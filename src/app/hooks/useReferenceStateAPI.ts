import { useState, useEffect, useRef, useCallback } from "react";

const API_BASE = "https://phase-x-qc8dy.ondigitalocean.app/api/v1/reference-state/read";

// Global cache to deduplicate simultaneous requests
const pendingRequests = new Map<string, Promise<any>>();

function fetchDedup(url: string, headers: Record<string, string>): Promise<any> {
  let req = pendingRequests.get(url);
  if (!req) {
    req = fetch(url, { headers }).then(res => {
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    }).finally(() => setTimeout(() => pendingRequests.delete(url), 1000));
    pendingRequests.set(url, req);
  }
  return req;
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

interface UseReferenceStateAPIResult {
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
        let date: Date;
        let display: string;
        let full: string;

        const parsed = parseAPITime(c.time);
        date = parsed.date;
        display = parsed.display;
        full = parsed.full;

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
        case 5: return "reference_m5";
        case 10: return "reference_m10";
        case 15: return "reference_m15";
        case 30: return "reference_m30";
        case 60: return "reference_h1";
        case 120: return "reference_h2";
        case 240: return "reference_h4";
        case 360: return "reference_h6";
        case 480: return "reference_h8";
        case 720: return "reference_h12";
        case 1440: return "reference_d1";
        default: return `reference_m${tf}`;
    }
}

export function useReferenceStateAPI(
    symbol: string | undefined,
    timeframe: number,
    enabled: boolean,
    accessToken?: string | null
): UseReferenceStateAPIResult {
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

            const authHeaders: Record<string, string> = {};
            if (accessToken) authHeaders["Authorization"] = `Bearer ${accessToken}`;
            
            const json = await fetchDedup(url, authHeaders);

            if (!json.candles || !Array.isArray(json.candles) || json.candles.length === 0) {
                throw new Error("No reference data available");
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
