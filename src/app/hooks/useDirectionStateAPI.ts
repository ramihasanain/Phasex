import { useState, useEffect, useRef, useCallback } from "react";

const API_BASE = "https://phase-x-qc8dy.ondigitalocean.app/api/v1/direction-state/read";

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

interface UseDirectionStateAPIResult {
  candles: ChartCandle[];
  loading: boolean;
  error: string | null;
  lastUpdate: number | null;
}

function cleanSymbol(symbol: string): string {
  return symbol.replace(/\.p$/, "");
}

function parseAPITime(timeStr: string): {
  date: Date;
  display: string;
  full: string;
} {
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
    const parsed = parseAPITime(c.time);
    const date = parsed.date;
    const display = parsed.display;
    const full = parsed.full;

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
    case 5:
      return "direction_m5";
    case 10:
      return "direction_m10";
    case 15:
      return "direction_m15";
    case 30:
      return "direction_m30";
    case 60:
      return "direction_h1";
    case 120:
      return "direction_h2";
    case 240:
      return "direction_h4";
    case 360:
      return "direction_h6";
    case 480:
      return "direction_h8";
    case 720:
      return "direction_h12";
    case 1440:
      return "direction_d1";
    default:
      return `direction_m${tf}`;
  }
}

export function useDirectionStateAPI(
  symbol: string | undefined,
  timeframe: number,
  enabled: boolean,
  accessToken?: string | null,
): UseDirectionStateAPIResult {
  const [candles, setCandles] = useState<ChartCandle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(
    async (sym: string, tf: number, isInitial: boolean) => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (isInitial) setLoading(true);
      if (!accessToken) return;
      try {
        const cleanSym = cleanSymbol(sym);
        const stateKey = getTimeframeStateKey(tf);
        const url = `${API_BASE}?symbol=${cleanSym}&state_key=${stateKey}&limit=50000`;

        const m5StateKey = "direction_m5";
        const m5Url = `${API_BASE}?symbol=${cleanSym}&state_key=${m5StateKey}&limit=2`;

        const authHeaders: Record<string, string> = {};
        if (accessToken) authHeaders["Authorization"] = `Bearer ${accessToken}`;

        const [json, m5Json] = await Promise.all([
          fetchDedup(url, authHeaders),
          stateKey !== m5StateKey ? fetchDedup(m5Url, authHeaders).catch(() => null) : Promise.resolve(null),
        ]);

        if (m5Json && stateKey !== m5StateKey) {
          if (json.candles?.length > 0 && m5Json.candles?.length > 0) {
            json.candles[0].open = m5Json.candles[0].open;
            json.candles[0].high = m5Json.candles[0].high;
            json.candles[0].low = m5Json.candles[0].low;
            json.candles[0].close = m5Json.candles[0].close;
          }
        }

        if (
          !json.candles ||
          !Array.isArray(json.candles) ||
          json.candles.length === 0
        ) {
          throw new Error("No direction data available");
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
    },
    [accessToken],
  );

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
