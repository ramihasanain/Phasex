/**
 * useMT5 — React hook for MetaTrader 5 backend integration via MetaAPI.cloud.
 * Connects to the Django REST backend at localhost:8000.
 * account_id is obtained during connect (MetaAPI provisioning) and persisted in localStorage.
 */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const MT5_API_BASE = "http://localhost:8000/api/mt5";

/* ─── Types ─── */
export interface MT5Credentials {
    login: string;
    password: string;
    server: string;
}

export interface MT5Account {
    login: number;
    name: string;
    server: string;
    balance: number;
    equity: number;
    margin: number;
    free_margin: number;
    profit: number;
    leverage: number;
    currency: string;
    trade_mode: number;
    limit_orders: number;
    margin_level: number;
}

export interface MT5Position {
    ticket: number;
    symbol: string;
    type: "BUY" | "SELL";
    volume: number;
    open_price: number;
    current_price: number;
    sl: number | null;
    tp: number | null;
    profit: number;
    swap: number;
    commission: number;
    magic: number;
    comment: string;
    time_open: string;
    time_update: string | null;
}

export interface MT5Deal {
    ticket: number;
    order: number;
    symbol: string;
    type: string;
    volume: number;
    price: number;
    profit: number;
    swap: number;
    commission: number;
    fee: number;
    comment: string;
    magic: number;
    time: string;
    entry: number;
}

export interface MT5TradeResult {
    ticket: number;
    deal: number;
    symbol: string;
    action: string;
    volume: number;
    price: number;
    sl: number | null;
    tp: number | null;
    comment: string;
}

export interface UseMT5Result {
    // Connection
    connected: boolean;
    connecting: boolean;
    connectMT5: (credentials: MT5Credentials) => Promise<void>;
    disconnectMT5: () => Promise<void>;
    accountId: string;
    // Account
    account: MT5Account | null;
    accountLoading: boolean;
    // Positions
    positions: MT5Position[];
    positionsLoading: boolean;
    // History
    history: MT5Deal[];
    historyLoading: boolean;
    // Error
    error: string | null;
    // Refresh
    refreshAccount: () => Promise<void>;
    refreshPositions: () => Promise<void>;
    refreshHistory: (days?: number) => Promise<void>;
    // Trade Execution
    executeTrade: (symbol: string, action: string, volume: number, sl?: number, tp?: number) => Promise<MT5TradeResult | null>;
    closePosition: (ticket: number) => Promise<boolean>;
    closeAllPositions: () => Promise<boolean>;
    // Symbol Overrides
    symbolOverrides: Record<string, string>;
    setSymbolOverride: (dashboardName: string, brokerName: string) => Promise<boolean>;
    deleteSymbolOverride: (dashboardName: string) => Promise<boolean>;
    // Server-side Auto-Trade
    serverAutoTrades: Record<string, any>;
    addAutoTrade: (key: string, symbol: string, tf: string, lot: number, direction: string, signalPrice: number, sl?: number | null, tp?: number | null) => Promise<boolean>;
    removeAutoTrade: (key: string) => Promise<boolean>;
    fetchAutoTrades: () => Promise<void>;
    // Server-side Trade History
    serverTradeHistory: any[];
    fetchTradeHistory: () => Promise<void>;
    addTradeToHistory: (entry: any) => Promise<boolean>;
    clearServerHistory: () => Promise<boolean>;
}

/* ─── Hook ─── */
export function useMT5(): UseMT5Result {
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [accountId, setAccountId] = useState<string>(() => {
        try { return localStorage.getItem('phasex_account_id') || ''; } catch { return ''; }
    });
    const [account, setAccount] = useState<MT5Account | null>(null);
    const [accountLoading, setAccountLoading] = useState(false);
    const [positions, setPositions] = useState<MT5Position[]>([]);
    const [positionsLoading, setPositionsLoading] = useState(false);
    const [history, setHistory] = useState<MT5Deal[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [symbolOverrides, setSymbolOverrides] = useState<Record<string, string>>({});

    const mountedRef = useRef(true);
    const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const accountIdRef = useRef(accountId);
    accountIdRef.current = accountId;

    // Save account_id to localStorage
    useEffect(() => {
        try {
            if (accountId) localStorage.setItem('phasex_account_id', accountId);
            else localStorage.removeItem('phasex_account_id');
        } catch { /* ignore */ }
    }, [accountId]);

    // ─── Connect to MT5 via MetaAPI provisioning ───
    const connectMT5 = useCallback(async (credentials: MT5Credentials) => {
        setConnecting(true);
        setError(null);
        try {
            const res = await fetch(`${MT5_API_BASE}/connect/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            const data = await res.json();
            if (!mountedRef.current) return;

            if (data.connected && data.account_id) {
                setConnected(true);
                setAccountId(data.account_id);
                if (data.account) setAccount(data.account);
            } else {
                setConnected(false);
                setError(data.error || "Failed to connect / provision account");
            }
        } catch (err: any) {
            if (mountedRef.current) {
                setConnected(false);
                setError("Cannot reach MT5 backend. Make sure the Django server is running on port 8000.");
            }
        } finally {
            if (mountedRef.current) setConnecting(false);
        }
    }, []);

    // ─── Disconnect ───
    const disconnectMT5 = useCallback(async () => {
        try {
            await fetch(`${MT5_API_BASE}/disconnect/`);
        } catch { /* ignore */ }
        if (mountedRef.current) {
            setConnected(false);
            setAccount(null);
            setPositions([]);
            setHistory([]);
            // Keep accountId in localStorage so re-connect is faster
        }
    }, []);

    // ─── Auto-reconnect if accountId exists ───
    useEffect(() => {
        if (accountId && !connected && !connecting) {
            // Verify the account is still valid by fetching account info
            (async () => {
                try {
                    const res = await fetch(`${MT5_API_BASE}/account/?account_id=${accountId}`);
                    const data = await res.json();
                    if (mountedRef.current && data.account) {
                        setConnected(true);
                        setAccount(data.account);
                    }
                } catch { /* ignore — user will need to reconnect */ }
            })();
        }
    }, []); // Only on mount

    // ─── Refresh Account Info ───
    const refreshAccount = useCallback(async () => {
        const aid = accountIdRef.current;
        if (!connected || !aid) return;
        setAccountLoading(true);
        try {
            const res = await fetch(`${MT5_API_BASE}/account/?account_id=${aid}`);
            const data = await res.json();
            if (mountedRef.current && data.account) {
                setAccount(data.account);
            }
        } catch { /* ignore */ }
        finally { if (mountedRef.current) setAccountLoading(false); }
    }, [connected]);

    // ─── Refresh Positions ───
    const refreshPositions = useCallback(async () => {
        const aid = accountIdRef.current;
        if (!connected || !aid) return;
        setPositionsLoading(true);
        try {
            const res = await fetch(`${MT5_API_BASE}/positions/?account_id=${aid}`);
            const data = await res.json();
            if (mountedRef.current && data.positions) {
                setPositions(data.positions);
            }
        } catch { /* ignore */ }
        finally { if (mountedRef.current) setPositionsLoading(false); }
    }, [connected]);

    // ─── Refresh History ───
    const refreshHistory = useCallback(async (days: number = 30) => {
        const aid = accountIdRef.current;
        if (!connected || !aid) return;
        setHistoryLoading(true);
        try {
            const res = await fetch(`${MT5_API_BASE}/history/?account_id=${aid}&days=${days}`);
            const data = await res.json();
            if (mountedRef.current && data.deals) {
                setHistory(data.deals);
            }
        } catch { /* ignore */ }
        finally { if (mountedRef.current) setHistoryLoading(false); }
    }, [connected]);

    // ─── Auto-poll when connected (every 5s) ───
    useEffect(() => {
        if (!connected) {
            if (pollTimerRef.current) {
                clearInterval(pollTimerRef.current);
                pollTimerRef.current = null;
            }
            return;
        }

        // Initial fetch
        refreshAccount();
        refreshPositions();
        refreshHistory();

        // Poll
        pollTimerRef.current = setInterval(() => {
            refreshAccount();
            refreshPositions();
        }, 5000);

        return () => {
            if (pollTimerRef.current) {
                clearInterval(pollTimerRef.current);
                pollTimerRef.current = null;
            }
        };
    }, [connected, refreshAccount, refreshPositions, refreshHistory]);

    // ─── Cleanup on unmount ───
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        };
    }, []);

    // ─── Execute Trade (with account_id) ───
    const executeTrade = useCallback(async (
        symbol: string, action: string, volume: number, sl?: number, tp?: number
    ): Promise<MT5TradeResult | null> => {
        const aid = accountIdRef.current;
        if (!connected || !aid) {
            setError('Not connected to MT5');
            return null;
        }
        try {
            const res = await fetch(`${MT5_API_BASE}/trade/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    account_id: aid,
                    symbol, action, volume,
                    sl: sl || undefined,
                    tp: tp || undefined,
                }),
            });
            const data = await res.json();
            if (data.success && data.order) {
                refreshPositions();
                refreshAccount();
                return data.order as MT5TradeResult;
            } else {
                const errMsg = data.error || 'Trade execution failed';
                console.error('[MT5] Trade failed:', errMsg);
                setError(errMsg);
                throw new Error(errMsg);
            }
        } catch (e: any) {
            if (e?.message && e.message !== 'Failed to fetch') {
                throw e;
            }
            setError('Failed to reach MT5 backend for trade execution');
            throw new Error('Failed to reach MT5 backend for trade execution');
        }
    }, [connected, refreshPositions, refreshAccount]);

    // ─── Close Position (with account_id) ───
    const closePosition = useCallback(async (ticket: number): Promise<boolean> => {
        const aid = accountIdRef.current;
        if (!connected || !aid) {
            setError('Not connected to MT5');
            return false;
        }
        try {
            const res = await fetch(`${MT5_API_BASE}/close-position/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ account_id: aid, ticket }),
            });
            const data = await res.json();
            if (data.success) {
                refreshPositions();
                refreshAccount();
                return true;
            } else {
                setError(data.error || 'Failed to close position');
                return false;
            }
        } catch {
            setError('Failed to reach MT5 backend');
            return false;
        }
    }, [connected, refreshPositions, refreshAccount]);

    // ─── Close All Positions (with account_id) ───
    const closeAllPositions = useCallback(async (): Promise<boolean> => {
        const aid = accountIdRef.current;
        if (!connected || !aid) {
            setError('Not connected to MT5');
            return false;
        }
        try {
            const res = await fetch(`${MT5_API_BASE}/close-all-positions/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ account_id: aid }),
            });
            const data = await res.json();
            if (data.success) {
                refreshPositions();
                refreshAccount();
                return true;
            } else {
                setError(data.error || 'Failed to close all positions');
                return false;
            }
        } catch {
            setError('Failed to reach MT5 backend');
            return false;
        }
    }, [connected, refreshPositions, refreshAccount]);

    // ─── Symbol Overrides ───
    const fetchOverrides = useCallback(async () => {
        try {
            const res = await fetch(`${MT5_API_BASE}/symbol-overrides/`);
            const data = await res.json();
            if (data.overrides) setSymbolOverrides(data.overrides);
        } catch { /* ignore */ }
    }, []);

    const setSymbolOverride = useCallback(async (dashboardName: string, brokerName: string): Promise<boolean> => {
        try {
            const res = await fetch(`${MT5_API_BASE}/symbol-overrides/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dashboard_name: dashboardName, broker_name: brokerName }),
            });
            const data = await res.json();
            if (data.success && data.overrides) {
                setSymbolOverrides(data.overrides);
                return true;
            }
            return false;
        } catch { return false; }
    }, []);

    const deleteSymbolOverride = useCallback(async (dashboardName: string): Promise<boolean> => {
        try {
            const res = await fetch(`${MT5_API_BASE}/symbol-overrides/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dashboard_name: dashboardName, delete: true }),
            });
            const data = await res.json();
            if (data.success) {
                setSymbolOverrides(prev => { const n = { ...prev }; delete n[dashboardName.toUpperCase()]; return n; });
                return true;
            }
            return false;
        } catch { return false; }
    }, []);

    // Fetch overrides when connected
    useEffect(() => {
        if (connected) fetchOverrides();
    }, [connected, fetchOverrides]);

    // ─── Auto-Trade API (server-side, with account_id) ───
    const [serverAutoTrades, setServerAutoTrades] = useState<Record<string, any>>({});
    const [serverTradeHistory, setServerTradeHistory] = useState<any[]>([]);

    const fetchAutoTrades = useCallback(async () => {
        try {
            const res = await fetch(`${MT5_API_BASE}/auto-trades/`);
            const data = await res.json();
            if (data.success) setServerAutoTrades(data.auto_trades || {});
        } catch { /* ignore */ }
    }, []);

    const addAutoTrade = useCallback(async (
        key: string, symbol: string, tf: string, lot: number,
        direction: string, signalPrice: number, sl?: number | null, tp?: number | null
    ): Promise<boolean> => {
        const aid = accountIdRef.current;
        try {
            const res = await fetch(`${MT5_API_BASE}/auto-trades/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key, symbol, tf, lot, direction,
                    signal_price: signalPrice, sl, tp,
                    account_id: aid,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setServerAutoTrades(data.auto_trades || {});
                return true;
            }
            return false;
        } catch { return false; }
    }, []);

    const removeAutoTrade = useCallback(async (key: string): Promise<boolean> => {
        try {
            const res = await fetch(`${MT5_API_BASE}/auto-trades/`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key }),
            });
            const data = await res.json();
            if (data.success) {
                setServerAutoTrades(data.auto_trades || {});
                return true;
            }
            return false;
        } catch { return false; }
    }, []);

    const fetchTradeHistory = useCallback(async () => {
        try {
            const res = await fetch(`${MT5_API_BASE}/trade-history/`);
            const data = await res.json();
            if (data.success) setServerTradeHistory(data.history || []);
        } catch { /* ignore */ }
    }, []);

    const addTradeToHistory = useCallback(async (entry: any): Promise<boolean> => {
        try {
            const res = await fetch(`${MT5_API_BASE}/trade-history/add/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry),
            });
            const data = await res.json();
            if (data.success) {
                fetchTradeHistory();
                return true;
            }
            return false;
        } catch { return false; }
    }, [fetchTradeHistory]);

    const clearServerHistory = useCallback(async (): Promise<boolean> => {
        try {
            const res = await fetch(`${MT5_API_BASE}/trade-history/clear/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (data.success) {
                setServerTradeHistory([]);
                return true;
            }
            return false;
        } catch { return false; }
    }, []);

    // Poll auto-trades & history when connected
    useEffect(() => {
        if (!connected) return;
        fetchAutoTrades();
        fetchTradeHistory();
        const interval = setInterval(() => {
            fetchAutoTrades();
            fetchTradeHistory();
        }, 10000);
        return () => clearInterval(interval);
    }, [connected, fetchAutoTrades, fetchTradeHistory]);

    return {
        connected,
        connecting,
        connectMT5,
        disconnectMT5,
        accountId,
        account,
        accountLoading,
        positions,
        positionsLoading,
        history,
        historyLoading,
        error,
        refreshAccount,
        refreshPositions,
        refreshHistory,
        executeTrade,
        closePosition,
        closeAllPositions,
        symbolOverrides,
        setSymbolOverride,
        deleteSymbolOverride,
        // Server-side auto-trade
        serverAutoTrades,
        addAutoTrade,
        removeAutoTrade,
        fetchAutoTrades,
        // Server-side trade history
        serverTradeHistory,
        fetchTradeHistory,
        addTradeToHistory,
        clearServerHistory,
    };
}
