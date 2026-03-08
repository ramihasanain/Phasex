import { useState, useEffect, useRef, useCallback } from "react";

const API_BASE = "https://phase-x-qc8dy.ondigitalocean.app/api/v1/phase-state/read";

/**
 * Calculate ms until next 5-minute clock mark + 30 seconds.
 * e.g., if now is 12:32:15 → next is 12:35:30 → wait 3m15s = 195000ms
 *       if now is 12:35:45 → next is 12:40:30 → wait 4m45s = 285000ms
 */
function msUntilNext5MinMark(): number {
    const now = new Date();
    const mins = now.getMinutes();
    const secs = now.getSeconds();
    const ms = now.getMilliseconds();

    // Next 5-minute mark (0, 5, 10, 15, ...)
    const next5Min = Math.ceil((mins + 1) / 5) * 5;
    // If we're already past XX:X0:30 but before XX:X5:00, next mark is current 5-block
    const current5Min = Math.floor(mins / 5) * 5;
    const secsIntoBlock = (mins - current5Min) * 60 + secs;

    let targetMins: number;
    if (secsIntoBlock < 30 && mins % 5 === 0) {
        // We're at XX:X0:00-XX:X0:29 → target is XX:X0:30 (this block)
        targetMins = current5Min;
    } else {
        // Target is next 5-min block + 30s
        targetMins = current5Min + 5;
    }

    const target = new Date(now);
    target.setMinutes(targetMins, 30, 0); // XX:targetMins:30.000

    // If target is in the past (edge case), add 5 minutes
    if (target.getTime() <= now.getTime()) {
        target.setMinutes(target.getMinutes() + 5);
    }

    return target.getTime() - now.getTime();
}

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
 * Parse API time string into a Date and formatted strings.
 * Handles both formats:
 *   "2026.03.07 21:25" (dot-separated with space)
 *   "2026-03-08T03:55:00" (ISO format)
 */
function parseAPITime(timeStr: string): { date: Date; display: string; full: string } {
    let date: Date;
    if (timeStr.includes("T")) {
        // Already ISO format
        date = new Date(timeStr);
    } else {
        // Dot format: "2026.03.07 21:25" → "2026-03-07T21:25:00"
        const iso = timeStr.replace(/\./g, "-").replace(" ", "T") + ":00";
        date = new Date(iso);
    }

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
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
            if (!json.candles || !Array.isArray(json.candles) || json.candles.length === 0) {
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
        // Clear timer on any change
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (!enabled || !symbol) {
            setCandles([]);
            setError(null);
            setLoading(false);
            return;
        }

        // Initial fetch immediately
        fetchData(symbol, mainTF, subTF, true);

        // Schedule next fetch at the next 5-minute clock mark + 30s
        const scheduleNext = () => {
            const delay = msUntilNext5MinMark();
            timerRef.current = setTimeout(() => {
                fetchData(symbol, mainTF, subTF, false);
                scheduleNext(); // chain next
            }, delay);
        };
        scheduleNext();

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (abortRef.current) abortRef.current.abort();
        };
    }, [symbol, mainTF, subTF, enabled, fetchData]);

    return { candles, loading, error, lastUpdate };
}
