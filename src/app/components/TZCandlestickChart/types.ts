export type TZCandleDatum = {
    time: string;
    value: number;
    timestamp: number;
    fullTime?: string;
    open?: number;
    high?: number;
    low?: number;
    close?: number;
    isReal?: boolean;
    isLiveIndicator?: boolean;
};

export interface TZCandlestickChartProps {
    data: TZCandleDatum[];
    height?: number;
    livePrice?: number;
    priceOffset?: number;
    showRightPadding?: boolean;
}

export type CandlestickRow = TZCandleDatum & {
    open: number;
    high: number;
    low: number;
    close: number;
    isGreen: boolean;
    isReal: boolean;
    isNaNCandle: boolean;
};
