import { useState, useEffect, useRef, useCallback } from "react";

const API_BASE = "https://phase-x-qc8dy.ondigitalocean.app/api/v1/phase-state/read";
const POLL_INTERVAL = 30_000; // 30 seconds

interface APICandle {
    time: string;
    open: string;
    high: string;
    low: string;
    close: string;
    is_complete: boolean;
    source_count: number;
    expected_count: number;
}

interface ChartCandle {
    time: string;
    fullTime: string;
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    value: number;
    isReal: boolean;
}

interface UsePhaseStateAPIResult {
    candles: ChartCandle[];
    loading: boolean;
    error: string | null;
    lastUpdate: number | null;
}

/**
 * Clean asset symbol for the API.
 * - Crypto symbols have ".p" suffix (e.g., "BTCUSD.p" → "BTCUSD")
 * - Forex/Metals/Index symbols are already clean (e.g., "AUDCAD", "XAUUSD")
 */
function cleanSymbol(symbol: string): string {
    return symbol.replace(/\.p$/, "");
}

/**
 * Parse API time string "2026.03.07 21:25" into a Date and formatted strings.
 */
function parseAPITime(timeStr: string): { date: Date; display: string; full: string } {
    // "2026.03.07 21:25" → "2026-03-07T21:25:00"
    const iso = timeStr.replace(/\./g, "-").replace(" ", "T") + ":00";
    const date = new Date(iso);

    const dd = date.getDate().toString().padStart(2, "0");
    const mo = (date.getMonth() + 1).toString().padStart(2, "0");
    const yr = date.getFullYear();
    const hh = date.getHours().toString().padStart(2, "0");
    const mm = date.getMinutes().toString().padStart(2, "0");

    return {
        date,
        display: `${hh}:${mm}`,
        full: `${dd}/${mo}/${yr} ${hh}:${mm}`,
    };
}

/**
 * Transform API candles to the chart's expected format.
 * API returns newest-first, chart expects oldest-first.
 */
function transformCandles(apiCandles: APICandle[]): ChartCandle[] {
    // Reverse to oldest-first
    const sorted = [...apiCandles].reverse();

    let prevDay = "";

    return sorted.map((c) => {
        const { date, display, full } = parseAPITime(c.time);
        const dd = date.getDate().toString().padStart(2, "0");
        const mo = (date.getMonth() + 1).toString().padStart(2, "0");
        const dayKey = `${dd}/${mo}`;
        const isNewDay = dayKey !== prevDay;
        prevDay = dayKey;

        const open = parseFloat(c.open);
        const high = parseFloat(c.high);
        const low = parseFloat(c.low);
        const close = parseFloat(c.close);

        return {
            time: isNewDay ? `${dayKey}\n${display}` : display,
            fullTime: full,
            timestamp: date.getTime(),
            open,
            high,
            low,
            close,
            value: close,
            isReal: true,
        };
    });
}

export function usePhaseStateAPI(
    symbol: string | undefined,
    mainTF: string,
    subTF: string,
    enabled: boolean
): UsePhaseStateAPIResult {
    const [candles, setCandles] = useState<ChartCandle[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<number | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(async (sym: string, main: string, sub: string, isInitial: boolean) => {
        // Abort any in-flight request
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        if (isInitial) setLoading(true);

        try {
            const cleanSym = cleanSymbol(sym);
            const stateKey = `${main}_from_${sub}`;
            const url = `${API_BASE}?symbol=${cleanSym}&state_key=${stateKey}`;

            const res = await fetch(url, { signal: controller.signal });
            if (!res.ok) throw new Error(`API error: ${res.status}`);

            const json = await res.json();
            if (!json.ok || !json.candles || json.candles.length === 0) {
                throw new Error("No candle data available");
            }

            const transformed = transformCandles(json.candles);
            setCandles(transformed);
            setError(null);
            setLastUpdate(Date.now());
        } catch (err: any) {
            if (err.name === "AbortError") return; // Cancelled, ignore
            setError(err.message || "Failed to fetch data");
            // Don't clear existing candles on poll errors
            if (isInitial) setCandles([]);
        } finally {
            if (isInitial) setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Clear interval on any change
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (!enabled || !symbol) {
            setCandles([]);
            setError(null);
            setLoading(false);
            return;
        }

        // Initial fetch
        fetchData(symbol, mainTF, subTF, true);

        // Poll for live updates
        intervalRef.current = setInterval(() => {
            fetchData(symbol, mainTF, subTF, false);
        }, POLL_INTERVAL);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (abortRef.current) abortRef.current.abort();
        };
    }, [symbol, mainTF, subTF, enabled, fetchData]);

    return { candles, loading, error, lastUpdate };
}
