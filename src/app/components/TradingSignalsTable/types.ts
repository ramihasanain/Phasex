import type { MT5Position, MT5Account, MT5TradeResult } from "../../hooks/useMT5";

export interface SignalEntry {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    net_signal: string;
    stop_loss: number;
    take_profit: number;
    market: string;
    candles_showed?: string | number;
}

export type AssetSignals = Record<string, Record<string, SignalEntry>>;

export interface TradeHistoryEntry {
    id: string;
    symbol: string;
    tf: string;
    action: string;
    volume: number;
    entryPrice: number;
    sl: number | null;
    tp: number | null;
    ticket: number | null;
    status: "filled" | "failed" | "pending" | "closed";
    error?: string;
    executedAt: string;
    signalPrice: number;
    profit?: number | null;
    closePrice?: number | null;
    closedAt?: string;
    signalFulfilled?: boolean;
    autoExecuted?: boolean;
}

export interface TradingSignalsTableProps {
    mt5Connected?: boolean;
    executeTrade?: (
        symbol: string,
        action: string,
        volume: number,
        sl?: number,
        tp?: number,
        comment?: string
    ) => Promise<MT5TradeResult | null>;
    mt5Positions?: MT5Position[];
    closePosition?: (ticket: number) => Promise<boolean>;
    closeAllPositions?: () => Promise<boolean>;
    symbolOverrides?: Record<string, string>;
    setSymbolOverride?: (dashboardName: string, brokerName: string) => Promise<boolean>;
    mt5Account?: MT5Account | null;
    stopAllAutoTrades?: () => Promise<boolean>;
    serverAutoTrades?: any[];
    autoTradeWorker?: any;
    addAutoTrade?: (
        key: string,
        symbol: string,
        tf: string,
        lot: number,
        direction: string,
        signalPrice: number,
        sl?: number | null,
        tp?: number | null,
        ticket?: string
    ) => Promise<boolean>;
    addAutoTradesBulk?: (trades: any[]) => Promise<boolean>;
    removeAutoTrade?: (comments: string[]) => Promise<void>;
    serverTradeHistory?: any[];
    addTradeToHistory?: (entry: any) => Promise<boolean>;
    clearServerHistory?: () => Promise<boolean>;
    fetchTradeHistory?: () => Promise<void>;
    serverAutoLogs?: any[];
    fetchAutoLogs?: () => Promise<void>;
}
