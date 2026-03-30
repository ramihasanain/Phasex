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
    decision?: string;
}

export type MarketCategory = "All" | "Forex" | "Metals" | "Commodities" | "Indices" | "Crypto" | "Other";

export type AnalysisTab = "Vector Core" | "Delta Engine" | "Pulse Matrix" | "Boundary Shell" | "Power Field" | "Phase X Layer" | "Decision Engine";

export type Signal = "Buy" | "Sell" | "Neutral" | "NA";

export type TrendLabel = "Bullish" | "Bearish" | "Neutral";

export interface VCRow {
    param: string;
    signals: Signal[];
    total: number;
    classification: string;
}

// News Hub Types
export interface NewsTag {
    symbol: string;
    keywords: string[];
}

export interface NewsEvent {
    id: string;
    title: string;
    body?: string;
    date: string;
    url?: string;
    impact: string; // High, Medium, Low, Normal
    source: "forex" | "crypto" | "commodities" | "indices" | "general" | "calendar";
    country?: string; 
    forecast?: string;
    previous?: string;
    imageurl?: string;
    provider?: string;
    matchedTags: string[]; // e.g. ["EURUSD", "GOLD", "FED"]
}

export type TeamLabel = "Short Term" | "Medium Term" | "Long Term" | "Overall";
