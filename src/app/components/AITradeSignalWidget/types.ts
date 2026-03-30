export interface AITradeSignalWidgetProps {
    marketContext: string;
    assetSymbol?: string;
    timeframe: number;
    mtfEnabled: boolean;
    mtfSmallTimeframe: number;
    mtfLargeTimeframe: number;
    indicatorName?: string;
    onExecuteTrade?: (action: string, sl?: number, tp?: number, lot?: number) => void;
}

export type AiSignalColors = {
    bg: string;
    border: string;
    text: string;
    glow: string;
    rgb: string;
};
