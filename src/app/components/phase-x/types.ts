export interface SymbolData {
    symbol: string;
    globalScore: number;
    confidence: number;
    marketState: string;
    phase: string;
    volatility: string;
    risk: string;
    dominantLayer: string;
    strength: number;
    alignment: string;
    primaryTrend: TrendLabel;
    layerSummary: {
        shortTerm: TrendLabel;
        mediumTerm: TrendLabel;
        longTerm: TrendLabel;
    };
    dynamics: {
        primaryTrend: TrendLabel;
        momentumState: string;
        structuralBias: string;
        marketPhase: string;
        reversalRisk: string;
    };
}

export type MarketCategory = "Forex" | "Metals" | "Commodities" | "Indices" | "Crypto";

export type AnalysisTab = "Vector Core" | "Delta Engine" | "Pulse Matrix" | "Boundary Shell" | "Power Field" | "Phase X Layer";

export type Signal = "Buy" | "Sell" | "Neutral" | "NA";

export type TrendLabel = "Bullish" | "Bearish" | "Neutral";

export interface VCRow {
    param: string;
    signals: Signal[];
    total: number;
    classification: string;
}

export type TeamLabel = "Short Term" | "Medium Term" | "Long Term" | "Overall";
