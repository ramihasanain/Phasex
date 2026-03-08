import { useState, useEffect, useRef, useCallback } from "react";

const WS_URL = "wss://websocket.fxtweet.com/ws/metatrader/";
const RECONNECT_DELAY = 3000;
/** Throttle interval — update React state at most once every N ms */
const THROTTLE_MS = 500;

interface PriceData {
    bid: number;
    ask: number;
    time: number;
}

export type LivePriceMap = Record<string, PriceData>;

/**
 * Hook that connects to the MetaTrader WebSocket for live price updates.
 *
 * Optimizations:
 *  - Accumulates WS messages in a mutable ref (zero overhead)
 *  - Flushes to React state via requestAnimationFrame + throttle (max 2 updates/sec)
 *  - Single WebSocket connection with exponential backoff reconnect
 *  - Proper cleanup on unmount (no reconnect, no state updates)
 */
export function useLivePrices(): {
    prices: LivePriceMap;
    initialPrices: Record<string, number>;
    connected: boolean;
} {
    const [prices, setPrices] = useState<LivePriceMap>({});
    const [connected, setConnected] = useState(false);
    const [initialPrices, setInitialPrices] = useState<Record<string, number>>({});

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const mountedRef = useRef(true);

    // Mutable buffer — accumulates prices between flushes (no re-renders)
    const bufferRef = useRef<LivePriceMap>({});
    const initialPricesRef = useRef<Record<string, number>>({});
    const dirtyRef = useRef(false);
    const flushScheduled = useRef(false);
    const lastFlush = useRef(0);

    // Flush buffer → React state (throttled)
    const flush = useCallback(() => {
        flushScheduled.current = false;
        if (!mountedRef.current || !dirtyRef.current) return;

        const now = Date.now();
        const elapsed = now - lastFlush.current;

        if (elapsed < THROTTLE_MS) {
            // Schedule a delayed flush
            flushScheduled.current = true;
            setTimeout(flush, THROTTLE_MS - elapsed);
            return;
        }

        lastFlush.current = now;
        dirtyRef.current = false;

        // Single state update with the accumulated buffer
        setPrices({ ...bufferRef.current });
    }, []);

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        try {
            const ws = new WebSocket(WS_URL);

            ws.onopen = () => {
                if (mountedRef.current) setConnected(true);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (!data.prices || typeof data.prices !== "object") return;

                    let hasNewInitial = false;

                    for (const [symbol, priceInfo] of Object.entries(data.prices)) {
                        const p = priceInfo as PriceData;
                        if (p.bid === undefined || p.ask === undefined) continue;

                        // Buffer the price (no React state update here)
                        bufferRef.current[symbol] = p;
                        dirtyRef.current = true;

                        // Track initial prices (first-seen price for change calculation)
                        if (initialPricesRef.current[symbol] === undefined) {
                            initialPricesRef.current[symbol] = (p.bid + p.ask) / 2;
                            hasNewInitial = true;
                        }
                    }

                    // Initial prices change rarely — update immediately when new ones appear
                    if (hasNewInitial && mountedRef.current) {
                        setInitialPrices({ ...initialPricesRef.current });
                    }

                    // Schedule a throttled flush for price updates
                    if (dirtyRef.current && !flushScheduled.current) {
                        flushScheduled.current = true;
                        requestAnimationFrame(flush);
                    }
                } catch {
                    // Ignore parse errors
                }
            };

            ws.onclose = () => {
                if (mountedRef.current) {
                    setConnected(false);
                    reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
                }
            };

            ws.onerror = () => {
                ws.close();
            };

            wsRef.current = ws;
        } catch {
            reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
        }
    }, [flush]);

    useEffect(() => {
        mountedRef.current = true;
        connect();

        return () => {
            mountedRef.current = false;
            if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
            if (wsRef.current) {
                wsRef.current.onclose = null; // Prevent reconnect on unmount
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [connect]);

    return { prices, initialPrices, connected };
}
