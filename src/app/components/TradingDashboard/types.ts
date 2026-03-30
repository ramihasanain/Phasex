export interface TradingDashboardProps {
    onLogout: () => void;
    onOpenDynamics: () => void;
}

export interface PhaseCandle {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    bars: number;
    tf_main: string;
    tf_candle: string;
}

/** Map: "mainTF_subTF" -> { "SYMBOL": PhaseCandle } */
export type PhaseStateDataMap = Record<string, Record<string, PhaseCandle>>;
