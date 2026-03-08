import { useState, useEffect, useRef, useCallback } from "react";

const WS_URL = "wss://websocket.fxtweet.com/ws/metatrader/";
const RECONNECT_DELAY = 3000;

interface PriceData {
    bid: number;
    ask: number;
    time: number;
}

export type LivePriceMap = Record<string, PriceData>;

/**
 * Hook that connects to the MetaTrader WebSocket for live price updates.
 * Returns a map of symbol → { bid, ask, time }.
 * Symbols come as-is from the feed (e.g., "BTCUSD.p", "EURUSD").
 */
export function useLivePrices(): { prices: LivePriceMap; initialPrices: Record<string, number>; connected: boolean } {
    const [prices, setPrices] = useState<LivePriceMap>({});
    const [connected, setConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const mountedRef = useRef(true);
    const initialPricesRef = useRef<Record<string, number>>({});
    const [initialPrices, setInitialPrices] = useState<Record<string, number>>({});

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
                    if (data.prices && typeof data.prices === "object") {
                        // Track initial prices BEFORE setPrices (synchronous)
                        let hasNewInitial = false;
                        for (const [symbol, priceInfo] of Object.entries(data.prices)) {
                            const p = priceInfo as PriceData;
                            if (p.bid !== undefined && p.ask !== undefined) {
                                if (initialPricesRef.current[symbol] === undefined) {
                                    initialPricesRef.current[symbol] = (p.bid + p.ask) / 2;
                                    hasNewInitial = true;
                                }
                            }
                        }
                        if (hasNewInitial) {
                            setInitialPrices({ ...initialPricesRef.current });
                        }

                        // Update current prices
                        setPrices((prev) => {
                            const updated = { ...prev };
                            for (const [symbol, priceInfo] of Object.entries(data.prices)) {
                                const p = priceInfo as PriceData;
                                if (p.bid !== undefined && p.ask !== undefined) {
                                    updated[symbol] = p;
                                }
                            }
                            return updated;
                        });
                    }
                } catch {
                    // Ignore parse errors
                }
            };

            ws.onclose = () => {
                if (mountedRef.current) {
                    setConnected(false);
                    // Auto-reconnect
                    reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
                }
            };

            ws.onerror = () => {
                ws.close();
            };

            wsRef.current = ws;
        } catch {
            // Connection failed, retry
            reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
        }
    }, []);

    useEffect(() => {
        mountedRef.current = true;
        connect();

        return () => {
            mountedRef.current = false;
            if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
            if (wsRef.current) {
                wsRef.current.onclose = null; // Prevent reconnect on unmount
                wsRef.current.close();
            }
        };
    }, [connect]);

    return { prices, initialPrices, connected };
}
