import { useState, useEffect, useRef, useCallback } from "react";

const API_BASE = "https://phase-x-qc8dy.ondigitalocean.app/api/v1/envelop-state/read";

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

interface UseEnvelopStateAPIResult {
    candles: ChartCandle[];
    loading: boolean;
    error: string | null;
    lastUpdate: number | null;
}

function cleanSymbol(symbol: string): string {
    return symbol.replace(/\.p$/, "");
}

function parseAPITime(timeStr: string): { date: Date; display: string; full: string } {
    let date: Date;
    if (timeStr.includes("T")) {
        date = new Date(timeStr);
    } else {
        let iso = timeStr.replace(/\./g, "-").replace(" ", "T");
        const timePart = iso.split("T")[1] || "";
        if ((timePart.match(/:/g) || []).length < 2) {
            iso += ":00";
        }
        date = new Date(iso);
    }

    if (isNaN(date.getTime())) {
        return { date: new Date(0), display: "—", full: "—" };
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

function transformCandles(apiCandles: APICandle[]): ChartCandle[] {
    const sorted = [...apiCandles].reverse();
    let prevDay = "";

    return sorted.map((c, idx) => {
        const isLast = idx === sorted.length - 1;
        let date: Date;
        let display: string;
        let full: string;

        if (isLast) {
            date = new Date();
            const dd = date.getDate().toString().padStart(2, "0");
            const mo = (date.getMonth() + 1).toString().padStart(2, "0");
            const yr = date.getFullYear();
            const hh = date.getHours().toString().padStart(2, "0");
            const mm = date.getMinutes().toString().padStart(2, "0");
            display = `${hh}:${mm}`;
            full = `${dd}/${mo}/${yr} ${hh}:${mm}`;
        } else {
            const parsed = parseAPITime(c.time);
            date = parsed.date;
            display = parsed.display;
            full = parsed.full;
        }

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

function getTimeframeStateKey(tf: number): string {
    switch (tf) {
        case 5: return "envelop_m5";
        case 10: return "envelop_m10";
        case 15: return "envelop_m15";
        case 30: return "envelop_m30";
        case 60: return "envelop_h1";
        case 120: return "envelop_h2";
        case 240: return "envelop_h4";
        case 360: return "envelop_h6";
        case 480: return "envelop_h8";
        case 720: return "envelop_h12";
        case 1440: return "envelop_d1";
        default: return `envelop_m${tf}`;
    }
}

export function useEnvelopStateAPI(
    symbol: string | undefined,
    timeframe: number,
    enabled: boolean
): UseEnvelopStateAPIResult {
    const [candles, setCandles] = useState<ChartCandle[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<number | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(async (sym: string, tf: number, isInitial: boolean) => {
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        if (isInitial) setLoading(true);

        try {
            const cleanSym = cleanSymbol(sym);
            const stateKey = getTimeframeStateKey(tf);
            const url = `${API_BASE}?symbol=${cleanSym}&state_key=${stateKey}&limit=50000`;

            const m5StateKey = "envelop_m5";
            const m5Url = `${API_BASE}?symbol=${cleanSym}&state_key=${m5StateKey}&limit=2`;

            const [res, m5Res] = await Promise.all([
                fetch(url, { signal: controller.signal }),
                stateKey !== m5StateKey ? fetch(m5Url, { signal: controller.signal }).catch(() => null) : Promise.resolve(null)
            ]);

            if (!res.ok) throw new Error(`API error: ${res.status}`);
            const json = await res.json();

            if (m5Res && m5Res.ok && stateKey !== m5StateKey) {
                const m5Json = await m5Res.json();
                if (json.candles?.length > 0 && m5Json.candles?.length > 0) {
                    json.candles[0].open = m5Json.candles[0].open;
                    json.candles[0].high = m5Json.candles[0].high;
                    json.candles[0].low = m5Json.candles[0].low;
                    json.candles[0].close = m5Json.candles[0].close;
                }
            }

            if (!json.candles || !Array.isArray(json.candles) || json.candles.length === 0) {
                throw new Error("No envelop data available");
            }

            const transformed = transformCandles(json.candles);
            setCandles(transformed);
            setError(null);
            setLastUpdate(Date.now());
        } catch (err: any) {
            if (err.name === "AbortError") return;
            setError(err.message || "Failed to fetch data");
            if (isInitial) setCandles([]);
        } finally {
            if (isInitial) setLoading(false);
        }
    }, []);

    useEffect(() => {
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

        fetchData(symbol, timeframe, true);

        const scheduleNext = () => {
            const delay = 60000; // Poll every minute
            timerRef.current = setTimeout(() => {
                fetchData(symbol, timeframe, false);
                scheduleNext();
            }, delay);
        };
        scheduleNext();

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (abortRef.current) abortRef.current.abort();
        };
    }, [symbol, timeframe, enabled, fetchData]);

    return { candles, loading, error, lastUpdate };
}
