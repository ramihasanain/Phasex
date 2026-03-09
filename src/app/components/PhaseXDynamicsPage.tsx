import { useState, useEffect, useRef, useMemo } from "react";

import { motion, AnimatePresence } from "motion/react";

import { ArrowLeft, ChevronDown, ChevronRight, Settings, RefreshCw, TrendingUp, TrendingDown, Activity, Zap, Upload, RotateCcw, Target, Cpu, Activity as Pulse, Shield, Flame, Layers } from "lucide-react";

import { useLanguage } from "../contexts/LanguageContext";
import type { VCRow } from "./phase-x/types";

interface PhaseXDynamicsPageProps {
    onBack: () => void;
}

const SciFiClock = ({ isLive, label, timeMs, isRTL, accent = "#00e676", mode = "lastUpdate" }: { isLive: boolean, label: string, timeMs?: number | null, isRTL?: boolean, accent?: string, mode?: "lastUpdate" | "currentTime" }) => {
    const [time, setTime] = useState(timeMs ? new Date(timeMs) : new Date());

    useEffect(() => {
        if (mode === "currentTime") {
            const interval = setInterval(() => setTime(new Date()), 1000);
            return () => clearInterval(interval);
        } else if (timeMs) {
            setTime(new Date(timeMs));
        }
    }, [mode, timeMs]);

    const hh = time.getHours().toString().padStart(2, '0');
    const mm = time.getMinutes().toString().padStart(2, '0');
    const ss = time.getSeconds().toString().padStart(2, '0');

    const primaryColor = mode === "currentTime" ? "#00c8ff" : accent;
    const shadowColor = mode === "currentTime" ? "rgba(0, 200, 255, " : "rgba(0, 230, 118, ";

    return (
        <div className="flex flex-col items-center justify-center relative p-3 rounded-2xl overflow-hidden min-w-[150px]"
            style={{
                background: "linear-gradient(180deg, rgba(16,25,35,0.7) 0%, rgba(8,12,20,0.95) 100%)",
                border: `1px solid ${primaryColor}40`,
                boxShadow: `0 0 15px ${shadowColor}0.15), inset 0 0 20px ${shadowColor}0.05)`,
                backdropFilter: "blur(12px)"
            }}>

            {/* Radar / Sweep effect */}
            {mode === "currentTime" && (
                <motion.div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{ background: `linear-gradient(90deg, transparent, ${shadowColor}0.15), transparent)` }}
                    animate={{ left: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
            )}
            {mode === "lastUpdate" && isLive && (
                <motion.div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{ background: `linear-gradient(180deg, transparent, ${shadowColor}0.1), transparent)` }}
                    animate={{ top: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
            )}

            <div className="text-[10px] text-gray-400 tracking-[0.2em] font-bold uppercase mb-1 z-10 flex items-center gap-1.5"
                style={{ direction: isRTL ? "rtl" : "ltr" }}>
                {mode === "currentTime" && (
                    <motion.div className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: primaryColor, boxShadow: `0 0 6px ${primaryColor}` }}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1.5, repeat: Infinity }} />
                )}
                {label}
            </div>

            <div className="flex items-center gap-1 font-mono text-3xl font-black italic tracking-wider z-10"
                style={{
                    color: primaryColor,
                    textShadow: `0 0 10px ${shadowColor}0.4), 0 0 25px ${shadowColor}0.2)`
                }}>
                <span>{hh}</span>
                <motion.span
                    animate={mode === "currentTime" ? { opacity: [1, 0.2, 1] } : {}}
                    transition={mode === "currentTime" ? { duration: 1, repeat: Infinity } : {}}>
                    :
                </motion.span>
                <span>{mm}</span>
                <motion.span
                    className="text-lg opacity-70 ml-0.5 mt-1.5"
                    animate={mode === "currentTime" ? { opacity: [0.7, 0.1, 0.7] } : {}}
                    transition={mode === "currentTime" ? { duration: 1, repeat: Infinity, delay: 0.1 } : {}}>
                    {ss}
                </motion.span>
            </div>

            {/* Hexagon tech overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${primaryColor} 2px, ${primaryColor} 3px)`,
                    backgroundSize: "100% 4px"
                }}
            />
        </div>
    );
};

type MarketCategory = "Forex" | "Metals" | "Commodities" | "Indices" | "Crypto" | "Other";

type AnalysisTab = "Vector Core" | "Delta Engine" | "Pulse Matrix" | "Boundary Shell" | "Power Field" | "Phase X Layer";

type Signal = "Buy" | "Sell" | "Neutral" | "NA";

type TrendLabel = "Bullish" | "Bearish" | "Neutral";

interface SymbolData {
    symbol: string; globalScore: number; confidence: number;
    marketState: string; phase: string; volatility: string; risk: string; dominantLayer: string;
    strength: number; alignment: string; primaryTrend: TrendLabel;
    layerSummary: { shortTerm: TrendLabel; mediumTerm: TrendLabel; longTerm: TrendLabel };
    dynamics: { primaryTrend: TrendLabel; momentumState: string; structuralBias: string; marketPhase: string; reversalRisk: string };
}

const symbolsData: Record<string, SymbolData> = {
    "ADAUSD": { "symbol": "ADAUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "ATMUSD": { "symbol": "ATMUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "AUDCAD": { "symbol": "AUDCAD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "AUDCHF": { "symbol": "AUDCHF", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "AUDJPY": { "symbol": "AUDJPY", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "AUDNZD": { "symbol": "AUDNZD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "AUDUSD": { "symbol": "AUDUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "AUS200Roll": { "symbol": "AUS200Roll", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "AVAUSD": { "symbol": "AVAUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "AXSUSD": { "symbol": "AXSUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "BCHUSD": { "symbol": "BCHUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "BNBUSD": { "symbol": "BNBUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "BRENT": { "symbol": "BRENT", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "BTCUSD": { "symbol": "BTCUSD", "globalScore": 0.78, "confidence": 88, "marketState": "STRONG BULLISH EXPANSION", "phase": "Directional", "volatility": "Expanding", "risk": "Low", "dominantLayer": "Long-Term", "strength": 0.78, "alignment": "Strong", "primaryTrend": "Bullish", "layerSummary": { "shortTerm": "Bullish", "mediumTerm": "Bullish", "longTerm": "Bullish" }, "dynamics": { "primaryTrend": "Bullish", "momentumState": "Strong", "structuralBias": "Upward", "marketPhase": "Expansion", "reversalRisk": "Low" } },
    "CADCHF": { "symbol": "CADCHF", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "CADJPY": { "symbol": "CADJPY", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "CHFJPY": { "symbol": "CHFJPY", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "CHINA50Roll": { "symbol": "CHINA50Roll", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "CHshares": { "symbol": "CHshares", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "COMUSD": { "symbol": "COMUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "DOTUSD": { "symbol": "DOTUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "DSHUSD": { "symbol": "DSHUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "ESP35Roll": { "symbol": "ESP35Roll", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "ETCUSD": { "symbol": "ETCUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "ETHUSD": { "symbol": "ETHUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "EU50Roll": { "symbol": "EU50Roll", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "EURAUD": { "symbol": "EURAUD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "EURCAD": { "symbol": "EURCAD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "EURCHF": { "symbol": "EURCHF", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "EURGBP": { "symbol": "EURGBP", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "EURJPY": { "symbol": "EURJPY", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "EURNZD": { "symbol": "EURNZD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "EURUSD": { "symbol": "EURUSD", "globalScore": 0.45, "confidence": 76, "marketState": "MODERATE BULLISH", "phase": "Directional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Short-Term", "strength": 0.32, "alignment": "Medium", "primaryTrend": "Bullish", "layerSummary": { "shortTerm": "Bullish", "mediumTerm": "Neutral", "longTerm": "Bearish" }, "dynamics": { "primaryTrend": "Bullish", "momentumState": "Moderate", "structuralBias": "Upward", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "FRA40Roll": { "symbol": "FRA40Roll", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "GBPAUD": { "symbol": "GBPAUD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "GBPCAD": { "symbol": "GBPCAD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "GBPCHF": { "symbol": "GBPCHF", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "GBPJPY": { "symbol": "GBPJPY", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "GBPNZD": { "symbol": "GBPNZD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "GBPUSD": { "symbol": "GBPUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "GER30": { "symbol": "GER30", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "XAUUSD": { "symbol": "XAUUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "HK50Roll": { "symbol": "HK50Roll", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "JAP225": { "symbol": "JAP225", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "LNKUSD": { "symbol": "LNKUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "LTCUSD": { "symbol": "LTCUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "NL25Roll": { "symbol": "NL25Roll", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "NORWAY25Roll": { "symbol": "NORWAY25Roll", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "NZDCAD": { "symbol": "NZDCAD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "NZDCHF": { "symbol": "NZDCHF", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "NZDJPY": { "symbol": "NZDJPY", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "NZDUSD": { "symbol": "NZDUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "RUSS2000": { "symbol": "RUSS2000", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "XAGUSD": { "symbol": "XAGUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "SOLUSD": { "symbol": "SOLUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "SWISS20Roll": { "symbol": "SWISS20Roll", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "TRUUSD": { "symbol": "TRUUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "UK100": { "symbol": "UK100", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "UNIUSD": { "symbol": "UNIUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "US100": { "symbol": "US100", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "US30": { "symbol": "US30", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "US500": { "symbol": "US500", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "USDCAD": { "symbol": "USDCAD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "USDCHF": { "symbol": "USDCHF", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "USDJPY": { "symbol": "USDJPY", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "VIXRoll": { "symbol": "VIXRoll", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "USOIL": { "symbol": "USOIL", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "XRPUSD": { "symbol": "XRPUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "YFIUSD": { "symbol": "YFIUSD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "UKOILRoll": { "symbol": "UKOILRoll", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "USOILRoll": { "symbol": "USOILRoll", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "DE40Roll": { "symbol": "DE40Roll", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "JP225Roll": { "symbol": "JP225Roll", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "UK100Roll": { "symbol": "UK100Roll", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "UT100Roll": { "symbol": "UT100Roll", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "US30Roll": { "symbol": "US30Roll", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "US500Roll": { "symbol": "US500Roll", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "AMD": { "symbol": "AMD", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
    "AIG": { "symbol": "AIG", "globalScore": 0.0, "confidence": 70, "marketState": "NEUTRAL", "phase": "Transitional", "volatility": "Normal", "risk": "Low", "dominantLayer": "Medium-Term", "strength": 0.0, "alignment": "Medium", "primaryTrend": "Neutral", "layerSummary": { "shortTerm": "Neutral", "mediumTerm": "Neutral", "longTerm": "Neutral" }, "dynamics": { "primaryTrend": "Neutral", "momentumState": "Moderate", "structuralBias": "Neutral", "marketPhase": "Transition", "reversalRisk": "Moderate" } },
};

const marketCategories: { name: MarketCategory; nameAr: string; icon: string; symbols: string[] }[] = [
    {
        "name": "Forex",
        "nameAr": "فوركس",
        "icon": "💱",
        "symbols": [
            "AUDCAD", "AUDCHF", "AUDJPY", "AUDNZD", "AUDUSD",
            "CADCHF", "CADJPY", "CHFJPY",
            "EURAUD", "EURCAD", "EURCHF", "EURGBP", "EURJPY", "EURNZD", "EURUSD",
            "GBPAUD", "GBPCAD", "GBPCHF", "GBPJPY", "GBPNZD", "GBPUSD",
            "NZDCAD", "NZDCHF", "NZDJPY", "NZDUSD",
            "USDCAD", "USDCHF", "USDJPY"
        ]
    },
    {
        "name": "Commodities",
        "nameAr": "سلع",
        "icon": "🛢️",
        "symbols": [
            "XAUUSD", "XAGUSD", "UKOILRoll", "USOILRoll"
        ]
    },
    {
        "name": "Indices",
        "nameAr": "مؤشرات",
        "icon": "📊",
        "symbols": [
            "DE40Roll", "JP225Roll", "UK100Roll", "UT100Roll", "US30Roll", "US500Roll", "VIXRoll",
            "NL25Roll", "NORWAY25Roll", "RUSS2000", "EU50Roll", "FRA40Roll",
            "AUS200Roll", "CHshares", "SWISS20Roll", "CHINA50Roll", "ESP35Roll", "HK50Roll"
        ]
    },
    {
        "name": "Crypto",
        "nameAr": "عملات رقمية",
        "icon": "₿",
        "symbols": [
            "ADAUSD", "ATMUSD", "AVAUSD", "AXSUSD", "BCHUSD", "BNBUSD", "BTCUSD",
            "COMUSD", "DOTUSD", "DSHUSD", "ETCUSD", "ETHUSD", "LNKUSD", "LTCUSD",
            "SOLUSD", "TRUUSD", "UNIUSD", "XRPUSD", "YFIUSD"
        ]
    },
    {
        "name": "Other",
        "nameAr": "أخرى",
        "icon": "🏢",
        "symbols": [
            "AMD", "AIG"
        ]
    }
];

const symbolIcons: Record<string, { icon: string; label: string; labelAr: string; flag?: string }> = {
    "ADAUSD": { "icon": "🔵", "label": "Cardano", "labelAr": "كاردانو" },
    "ATMUSD": { "icon": "⚡", "label": "Cosmos", "labelAr": "كوزموس" },
    "AUDCAD": { "icon": "A$", "label": "AUD/CAD", "labelAr": "AUD/CAD", "flag": "C$" },
    "AUDCHF": { "icon": "A$", "label": "AUD/CHF", "labelAr": "AUD/CHF", "flag": "🏦" },
    "AUDJPY": { "icon": "A$", "label": "AUD/JPY", "labelAr": "AUD/JPY", "flag": "¥" },
    "AUDNZD": { "icon": "A$", "label": "AUD/NZD", "labelAr": "AUD/NZD", "flag": "🥝" },
    "AUDUSD": { "icon": "A$", "label": "AUD/USD", "labelAr": "AUD/USD", "flag": "$" },
    "AUS200Roll": { "icon": "🏛️", "label": "ASX 200", "labelAr": "أستراليا 200" },
    "AVAUSD": { "icon": "🔺", "label": "Avalanche", "labelAr": "أفالانش" },
    "AXSUSD": { "icon": "🎮", "label": "Axie", "labelAr": "أكسي" },
    "BCHUSD": { "icon": "💚", "label": "Bitcoin Cash", "labelAr": "بتكوين كاش" },
    "BNBUSD": { "icon": "💛", "label": "Binance", "labelAr": "بينانس" },
    "BRENT": { "icon": "🛢️", "label": "Brent", "labelAr": "برنت" },
    "GOLD": { "icon": "🥇", "label": "Gold", "labelAr": "ذهب" },
    "SILVER": { "icon": "🥈", "label": "Silver", "labelAr": "فضة" },
    "WTI": { "icon": "🛢️", "label": "WTI", "labelAr": "نفط خام" },
    "BTCUSD": { "icon": "₿", "label": "Bitcoin", "labelAr": "بتكوين" },
    "CADCHF": { "icon": "C$", "label": "CAD/CHF", "labelAr": "CAD/CHF", "flag": "🏦" },
    "CADJPY": { "icon": "C$", "label": "CAD/JPY", "labelAr": "CAD/JPY", "flag": "¥" },
    "CHFJPY": { "icon": "🏦", "label": "CHF/JPY", "labelAr": "CHF/JPY", "flag": "¥" },
    "CHINA50Roll": { "icon": "🏮", "label": "China A50", "labelAr": "الصين 50" },
    "CHshares": { "icon": "⛰️", "label": "Swiss Shares", "labelAr": "أسهم سويسرا" },
    "COMUSD": { "icon": "🌐", "label": "Compound", "labelAr": "كومباوند" },
    "DOTUSD": { "icon": "⚪", "label": "Polkadot", "labelAr": "بولكادوت" },
    "DSHUSD": { "icon": "🔷", "label": "Dash", "labelAr": "داش" },
    "ESP35Roll": { "icon": "🏟️", "label": "Spain 35", "labelAr": "إسبانيا 35" },
    "ETCUSD": { "icon": "💎", "label": "ETH Classic", "labelAr": "إيثريوم كلاسيك" },
    "ETHUSD": { "icon": "⟠", "label": "Ethereum", "labelAr": "إيثريوم" },
    "EU50Roll": { "icon": "🏦", "label": "Euro Stoxx 50", "labelAr": "يورو ستوكس 50" },
    "EURAUD": { "icon": "€", "label": "EUR/AUD", "labelAr": "EUR/AUD", "flag": "A$" },
    "EURCAD": { "icon": "€", "label": "EUR/CAD", "labelAr": "EUR/CAD", "flag": "C$" },
    "EURCHF": { "icon": "€", "label": "EUR/CHF", "labelAr": "EUR/CHF", "flag": "🏦" },
    "EURGBP": { "icon": "€", "label": "EUR/GBP", "labelAr": "EUR/GBP", "flag": "£" },
    "EURJPY": { "icon": "€", "label": "EUR/JPY", "labelAr": "EUR/JPY", "flag": "¥" },
    "EURNZD": { "icon": "€", "label": "EUR/NZD", "labelAr": "EUR/NZD", "flag": "🥝" },
    "EURUSD": { "icon": "€", "label": "EUR/USD", "labelAr": "يورو/دولار", "flag": "$" },
    "FRA40Roll": { "icon": "🗼", "label": "France 40", "labelAr": "فرنسا 40" },
    "GBPAUD": { "icon": "£", "label": "GBP/AUD", "labelAr": "GBP/AUD", "flag": "A$" },
    "GBPCAD": { "icon": "£", "label": "GBP/CAD", "labelAr": "GBP/CAD", "flag": "C$" },
    "GBPCHF": { "icon": "£", "label": "GBP/CHF", "labelAr": "GBP/CHF", "flag": "🏦" },
    "GBPJPY": { "icon": "£", "label": "GBP/JPY", "labelAr": "GBP/JPY", "flag": "¥" },
    "GBPNZD": { "icon": "£", "label": "GBP/NZD", "labelAr": "GBP/NZD", "flag": "🥝" },
    "GBPUSD": { "icon": "£", "label": "GBP/USD", "labelAr": "جنيه/دولار", "flag": "$" },
    "GER30": { "icon": "🏭", "label": "DAX 30", "labelAr": "داكس 30" },
    "XAUUSD": { "icon": "🥇", "label": "Gold", "labelAr": "ذهب" },
    "HK50Roll": { "icon": "🏙️", "label": "Hang Seng", "labelAr": "هانج سينج" },
    "JAP225": { "icon": "⛩️", "label": "Nikkei 225", "labelAr": "نيكي 225" },
    "LNKUSD": { "icon": "🔗", "label": "Chainlink", "labelAr": "تشين لينك" },
    "LTCUSD": { "icon": "🪨", "label": "Litecoin", "labelAr": "لايتكوين" },
    "NL25Roll": { "icon": "🌷", "label": "AEX 25", "labelAr": "هولندا 25" },
    "NORWAY25Roll": { "icon": "⛷️", "label": "Norway 25", "labelAr": "النرويج 25" },
    "NZDCAD": { "icon": "🥝", "label": "NZD/CAD", "labelAr": "NZD/CAD", "flag": "C$" },
    "NZDCHF": { "icon": "🥝", "label": "NZD/CHF", "labelAr": "NZD/CHF", "flag": "🏦" },
    "NZDJPY": { "icon": "🥝", "label": "NZD/JPY", "labelAr": "NZD/JPY", "flag": "¥" },
    "NZDUSD": { "icon": "🥝", "label": "NZD/USD", "labelAr": "NZD/USD", "flag": "$" },
    "RUSS2000": { "icon": "📈", "label": "Russell 2000", "labelAr": "راسل 2000" },
    "XAGUSD": { "icon": "🥈", "label": "Silver", "labelAr": "فضة" },
    "SOLUSD": { "icon": "◎", "label": "Solana", "labelAr": "سولانا" },
    "SWISS20Roll": { "icon": "⛰️", "label": "SMI 20", "labelAr": "سويسرا 20" },
    "TRUUSD": { "icon": "🟢", "label": "TrueUSD", "labelAr": "ترو يو إس دي" },
    "UK100": { "icon": "🏰", "label": "FTSE 100", "labelAr": "فوتسي 100" },
    "UNIUSD": { "icon": "🦄", "label": "Uniswap", "labelAr": "يونيسواب" },
    "US100": { "icon": "💻", "label": "Nasdaq 100", "labelAr": "ناسداك 100" },
    "US30": { "icon": "🏛️", "label": "Dow Jones", "labelAr": "داو جونز" },
    "US500": { "icon": "📊", "label": "S&P 500", "labelAr": "إس آند بي 500" },
    "USDCAD": { "icon": "$", "label": "USD/CAD", "labelAr": "USD/CAD", "flag": "C$" },
    "USDCHF": { "icon": "$", "label": "USD/CHF", "labelAr": "USD/CHF", "flag": "🏦" },
    "USDJPY": { "icon": "$", "label": "USD/JPY", "labelAr": "USD/JPY", "flag": "¥" },
    "VIXRoll": { "icon": "📉", "label": "VIX", "labelAr": "مؤشر التقلب" },
    "USOIL": { "icon": "🛢️", "label": "Crude Oil", "labelAr": "نفط خام" },
    "XRPUSD": { "icon": "💧", "label": "XRP", "labelAr": "ريبل" },
    "YFIUSD": { "icon": "💰", "label": "Yearn", "labelAr": "ييرن" },
    "UKOILRoll": { "icon": "🛢️", "label": "Brent Oil", "labelAr": "برنت" },
    "USOILRoll": { "icon": "🛢️", "label": "US Crude", "labelAr": "النفط الخام" },
    "DE40Roll": { "icon": "🏭", "label": "DAX 40", "labelAr": "داكس 40" },
    "JP225Roll": { "icon": "⛩️", "label": "Nikkei 225", "labelAr": "نيكي 225" },
    "UK100Roll": { "icon": "🏰", "label": "FTSE 100", "labelAr": "فوتسي 100" },
    "UT100Roll": { "icon": "💻", "label": "Nasdaq 100", "labelAr": "ناسداك 100" },
    "US30Roll": { "icon": "🏛️", "label": "Dow Jones", "labelAr": "داو جونز" },
    "US500Roll": { "icon": "📊", "label": "S&P 500", "labelAr": "إس آند بي 500" },
    "AMD": { "icon": "🖥️", "label": "AMD", "labelAr": "إي إم دي" },
    "AIG": { "icon": "🏢", "label": "AIG", "labelAr": "إيه آي جي" }
};
































































const analysisTabs: AnalysisTab[] = ["Vector Core", "Delta Engine", "Pulse Matrix", "Boundary Shell", "Power Field", "Phase X Layer"];

const analysisTabsAr: Record<string, string> = {
    "Vector Core": "المتجهات الأساسية",
    "Delta Engine": "محرك التغيرات",
    "Pulse Matrix": "مصفوفة النبض",
    "Boundary Shell": "الغلاف الحدودي",
    "Power Field": "حقل القوة",
    "Phase X Layer": "طبقة المرحلة X",
};

const analysisTabIcons: Record<string, React.ReactNode> = {
    "Vector Core": <Target className="w-4 h-4" />,
    "Delta Engine": <Cpu className="w-4 h-4" />,
    "Pulse Matrix": <Pulse className="w-4 h-4" />,
    "Boundary Shell": <Shield className="w-4 h-4" />,
    "Power Field": <Flame className="w-4 h-4" />,
    "Phase X Layer": <Layers className="w-4 h-4" />,
};

const tfColumns = ["5M", "10M", "15M", "20M", "30M", "H1", "H2", "H3", "H4", "H6", "H8", "Daily"];

const vcTfColumns = ["M5", "M10", "M15", "M20", "M30", "H1", "H2", "H3", "H4", "H6", "H8", "D1"];
const vcTfLabels = ["5M", "10M", "15M", "20M", "30M", "H1", "H2", "H3", "H4", "H6", "H8", "D1"];



// Map from app symbol IDs to JSON keys (matches API response format)
const symbolToJsonKey: Record<string, string> = {
    "ADAUSD": "ADAUSD.lv - CRYPTO",
    "ATMUSD": "ATMUSD.lv - CRYPTO",
    "AVAUSD": "AVAUSD.lv - CRYPTO",
    "AXSUSD": "AXSUSD.lv - CRYPTO",
    "BCHUSD": "BCHUSD.lv - CRYPTO",
    "BNBUSD": "BNBUSD.lv - CRYPTO",
    "BTCUSD": "BTCUSD.lv - CRYPTO",
    "COMUSD": "COMUSD.lv - CRYPTO",
    "DOTUSD": "DOTUSD.lv - CRYPTO",
    "DSHUSD": "DSHUSD.lv - CRYPTO",
    "ETCUSD": "ETCUSD.lv - CRYPTO",
    "ETHUSD": "ETHUSD.lv - CRYPTO",
    "LNKUSD": "LNKUSD.lv - CRYPTO",
    "LTCUSD": "LTCUSD.lv - CRYPTO",
    "SOLUSD": "SOLUSD.lv - CRYPTO",
    "TRUUSD": "TRUUSD.lv - CRYPTO",
    "UNIUSD": "UNIUSD.lv - CRYPTO",
    "XRPUSD": "XRPUSD.lv - CRYPTO",
    "YFIUSD": "YFIUSD.lv - CRYPTO",
    "AUDCAD": "AUDCAD.sd - FOREX",
    "AUDCHF": "AUDCHF.sd - FOREX",
    "AUDJPY": "AUDJPY.sd - FOREX",
    "AUDNZD": "AUDNZD.sd - FOREX",
    "AUDUSD": "AUDUSD.sd - FOREX",
    "CADCHF": "CADCHF.sd - FOREX",
    "CADJPY": "CADJPY.sd - FOREX",
    "CHFJPY": "CHFJPY.sd - FOREX",
    "EURAUD": "EURAUD.sd - FOREX",
    "EURCAD": "EURCAD.sd - FOREX",
    "EURCHF": "EURCHF.sd - FOREX",
    "EURGBP": "EURGBP.sd - FOREX",
    "EURJPY": "EURJPY.sd - FOREX",
    "EURNZD": "EURNZD.sd - FOREX",
    "EURUSD": "EURUSD.sd - FOREX",
    "GBPAUD": "GBPAUD.sd - FOREX",
    "GBPCAD": "GBPCAD.sd - FOREX",
    "GBPCHF": "GBPCHF.sd - FOREX",
    "GBPJPY": "GBPJPY.sd - FOREX",
    "GBPNZD": "GBPNZD.sd - FOREX",
    "GBPUSD": "GBPUSD.sd - FOREX",
    "NZDCAD": "NZDCAD.sd - FOREX",
    "NZDCHF": "NZDCHF.sd - FOREX",
    "NZDJPY": "NZDJPY.sd - FOREX",
    "NZDUSD": "NZDUSD.sd - FOREX",
    "USDCAD": "USDCAD.sd - FOREX",
    "USDCHF": "USDCHF.sd - FOREX",
    "USDJPY": "USDJPY.sd - FOREX",
    "XAUUSD": "XAUUSD.sd - COMMODITY",
    "XAGUSD": "XAGUSD.sd - COMMODITY",
    "UKOILRoll": "UKOILRoll - COMMODITY",
    "USOILRoll": "USOILRoll - COMMODITY",
    "DE40Roll": "DE40Roll - INDEX",
    "JP225Roll": "JP225Roll - INDEX",
    "UK100Roll": "UK100Roll - INDEX",
    "UT100Roll": "UT100Roll - INDEX",
    "US30Roll": "US30Roll - INDEX",
    "US500Roll": "US500Roll - INDEX",
    "VIXRoll": "VIXRoll - INDEX",
    "NL25Roll": "NL25Roll - INDEX",
    "NORWAY25Roll": "NORWAY25Roll - INDEX",
    "RUSS2000": "RUSS2000 - INDEX",
    "EU50Roll": "EU50Roll - INDEX",
    "FRA40Roll": "FRA40Roll - INDEX",
    "AUS200Roll": "AUS200Roll - INDEX",
    "CHshares": "CHshares - INDEX",
    "SWISS20Roll": "SWISS20Roll - INDEX",
    "CHINA50Roll": "CHINA50Roll - INDEX",
    "ESP35Roll": "ESP35Roll - INDEX",
    "HK50Roll": "HK50Roll - INDEX",
    "AMD": "AMD - OTHER",
    "AIG": "AIG - OTHER",
};


const defaultAnalysisSources: Record<AnalysisTab, any[]> = {
    "Vector Core": [],
    "Delta Engine": [],
    "Pulse Matrix": [],
    "Boundary Shell": [],
    "Power Field": [],
    "Phase X Layer": []
};

function getComponentDataFromJson(tab: AnalysisTab, symbol: string, sources: any[]): VCRow[] | null {
    const jsonKey = symbolToJsonKey[symbol];
    if (!jsonKey) return null;

    if (!sources || sources.length === 0) return null;

    // Merge multiple sources for the same period
    const aggregatedIndicators: Record<string, Record<string, string>> = {};

    sources.forEach((source, sourceIdx) => {
        const symbolData = (source as Record<string, any>)?.[jsonKey];
        if (!symbolData || !symbolData.indicators) return;

        Object.entries(symbolData.indicators as Record<string, Record<string, string>>).forEach(([param, tfs]) => {
            if (!aggregatedIndicators[param]) aggregatedIndicators[param] = {};
            Object.entries(tfs).forEach(([tf, signal]) => {
                // If collision, we could prioritize or average. 
                // For simplicity, we'll keep the first non-NA signal found for that specific timeframe in any of the 3 files.
                if (!aggregatedIndicators[param][tf] || aggregatedIndicators[param][tf] === "NA") {
                    aggregatedIndicators[param][tf] = signal;
                }
            });
        });
    });

    if (Object.keys(aggregatedIndicators).length === 0) return null;

    const rows: VCRow[] = [];
    const paramKeys = Object.keys(aggregatedIndicators).sort((a, b) => {
        const partsA = a.match(/(\d+|\D+)/g) || [];
        const partsB = b.match(/(\d+|\D+)/g) || [];

        for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
            const pA = partsA[i];
            const pB = partsB[i];

            const nA = parseInt(pA, 10);
            const nB = parseInt(pB, 10);

            if (!isNaN(nA) && !isNaN(nB)) {
                if (nA !== nB) return nA - nB;
            } else if (pA !== pB) {
                return pA.localeCompare(pB);
            }
        }
        return a.length - b.length;
    });

    for (const paramKey of paramKeys) {
        const tfData = aggregatedIndicators[paramKey];
        const signals: Signal[] = vcTfColumns.map(tf => {
            const val = tfData[tf];
            if (val === "Buy") return "Buy";
            if (val === "Sell") return "Sell";
            if (val === "Neutral") return "Neutral";
            return "NA";
        });

        const buyCount = signals.filter(s => s === "Buy").length;
        const sellCount = signals.filter(s => s === "Sell").length;
        const total = (buyCount - sellCount) / 12; // Use fixed divisor of 12 as requested
        const classification = getClassification(total);

        const displayParam = paramKey.replace(/^[A-Z]{2,}_/, "").replace(/_/g, ",");

        rows.push({
            param: displayParam,
            signals,
            total: Math.round(total * 100),
            classification
        });
    }
    return rows.length > 0 ? rows : null;
}


const trendAr: Record<string, string> = {
    "Bullish": "صعودي", "Bearish": "هبوطي", "Neutral": "محايد",
    "Strong": "قوي", "Moderate": "معتدل", "Weak": "ضعيف",
    "Upward": "صاعد", "Downward": "هابط",
    "Expansion": "توسع", "Contraction": "انكماش", "Transition": "تحول",
    "Low": "منخفض", "High": "مرتفع",
    "Directional": "اتجاهي", "Ranging": "عرضي", "Transitional": "انتقالي",
    "Normal": "طبيعي", "Expanding": "متوسع",
    "Strong Uptrend": "صعود قوي", "Strong Downtrend": "هبوط قوي",
    "Strong Upt": "صعود قوي", "Strong Dow": "هبوط قوي",
    "Strong Downward": "هبوط قوي", "Buy": "شراء", "Sell": "بيع",
    "Short-Term": "قصير المدى", "Medium-Term": "متوسط المدى", "Long-Term": "طويل المدى",
    "STRONG BULLISH EXPANSION": "توسع صعودي قوي", "MODERATE BULLISH": "صعودي معتدل",
    "WEAK BEARISH": "هبوطي ضعيف", "MODERATE DOWNTREND": "هبوط معتدل",
    "Bullish Expansion": "توسع صعودي", "Bearish Expansion": "توسع هبوطي",
    "Compression": "انضغاط", "Range": "عرضي", "Developing": "قيد التطور", "Elevated": "مرتفع",
};

const i18n: Record<string, Record<string, string>> = {
    ar: {
        title: "نظام الديناميكيات الهيكلية", score: "النتيجة", confidence: "الثقة",
        timeframe: "الإطار الزمني", layer: "الطبقة", globalState: "حالة السوق العالمية",
        phase: "المرحلة", volatility: "التذبذب", risk: "المخاطرة",
        trend: "الاتجاه", momentum: "الزخم", bias: "الانحياز", reversal: "الانعكاس",
        marketFilter: "تصفية الأسواق", globalScore: "النتيجة الكلية",
        layerSummary: "ملخص الطبقات", dynamicsOutput: "مخرجات الديناميكيات",
        primaryTrend: "الاتجاه الرئيسي", momentumState: "حالة الزخم",
        structuralBias: "الانحياز الهيكلي", marketPhase: "مرحلة السوق",
        reversalRisk: "مخاطر الانعكاس", strength: "القوة", alignment: "التوافق",
        total: "المجموع", classification: "التصنيف",
        shortTerm: "قصير المدى", mediumTerm: "متوسط المدى", longTerm: "طويل المدى",
    },
    en: {
        title: "Structural Dynamics", score: "Score", confidence: "Confidence",
        timeframe: "Timeframe", layer: "Layer", globalState: "GLOBAL MARKET STATE",
        phase: "Phase", volatility: "Volatility", risk: "Risk",
        trend: "Trend", momentum: "Momentum", bias: "Bias", reversal: "Reversal",
        marketFilter: "MARKET FILTER", globalScore: "GLOBAL SCORE",
        layerSummary: "LAYER SUMMARY", dynamicsOutput: "DYNAMICS OUTPUT",
        primaryTrend: "Primary Trend", momentumState: "Momentum State",
        structuralBias: "Structural Bias", marketPhase: "Market Phase",
        reversalRisk: "Reversal Risk", strength: "Strength", alignment: "Alignment",
        total: "Total", classification: "Classification",
        shortTerm: "Short-Term", mediumTerm: "Medium-Term", longTerm: "Long-Term",
    },
};

function getTrendColor(t: string): string {

    const v = t.toLowerCase();
    if (["bullish", "upward", "expansion", "low", "strong", "strong uptrend", "strong uptren"].includes(v)) return "#00e676";
    if (["bearish", "downward", "contraction", "high", "strong downtrend", "strong downtre"].includes(v)) return "#ff1744";
    return "#ffc400";
}

function getClassColor(c: string): string {
    if (c.includes("Strong Uptrend") || c.includes("Strong Upt")) return "#00c853";
    if (c.includes("Strong Downtrend") || c.includes("Strong Dow")) return "#d50000";
    if (c === "Bullish") return "#00e676";
    if (c === "Bearish") return "#ff1744";
    return "#ffc400";
}

function getTotalColor(p: number): string {
    if (p >= 50) return "#00e676";
    if (p >= 17) return "#76ff03";
    if (p > -17) return "#ffc400";
    if (p > -50) return "#ff6d00";
    return "#ff1744";
}
// Generate signal data based on score bias

function generateSignals(score: number, rowCount: number, paramType: string): {
    param: string;
    signals: Signal[];
    total: number;
    classification: string;
}[] {

    const params: Record<string, string[]> = {
        "MA": ["10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90", "95", "100", "105", "110", "115", "120", "125", "130", "135", "140", "145", "150", "155", "160", "165", "170", "175", "180", "185", "190", "195", "200"],
        "MACD": ["(5,11,4)", "(10,22,8)", "(15,32,11)", "(20,43,15)", "(25,54,19)", "(30,65,23)", "(35,76,26)", "(40,86,30)", "(45,97,34)", "(50,108,38)", "(55,119,41)", "(60,130,45)", "(65,140,49)", "(70,151,53)", "(75,162,56)", "(80,173,60)", "(85,184,64)", "(90,194,68)", "(95,205,71)", "(100,216,75)", "(105,227,79)", "(110,238,83)", "(115,248,86)", "(120,259,90)", "(125,270,94)", "(130,281,98)", "(135,292,101)", "(140,302,105)", "(145,313,109)", "(150,324,113)", "(155,335,116)", "(160,346,120)", "(165,356,124)", "(170,367,128)", "(175,378,131)", "(180,389,135)", "(185,400,139)", "(190,410,143)", "(195,421,146)"],
        "RSI": ["10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90", "95", "100", "105", "110", "115", "120", "125", "130", "135", "140", "145", "150", "155", "160", "165", "170", "175", "180", "185", "190", "195", "200"],
        "Bollinger": ["10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90", "95", "100", "105", "110", "115", "120", "125", "130", "135", "140", "145", "150", "155", "160", "165", "170", "175", "180", "185", "190", "195", "200"],
    };

    const paramList = params[paramType] || params["MA"];

    const bias = (score + 1) / 2; // 0..1
    return paramList.slice(0, rowCount).map((param, ri) => {
        // Create realistic pattern: early periods follow short-term, later periods follow long-term

        const rowBias = bias + (ri < 5 ? 0.15 : ri < 10 ? 0.05 : ri < 25 ? -0.1 : -0.2);

        const clampedBias = Math.max(0.05, Math.min(0.95, rowBias));

        const signals: Signal[] = tfColumns.map((_, ci) => {
            // Higher timeframes (later columns) tend to follow the underlying trend more

            const tfAdjust = ci < 5 ? 0.1 : ci < 8 ? -0.05 : -0.1;

            const prob = clampedBias + tfAdjust + (Math.sin(ri * 3.7 + ci * 5.3) * 0.15);
            return prob > 0.5 ? "Buy" : "Sell";
        });

        const buyCount = signals.filter(s => s === "Buy").length;
        const sellCount = signals.filter(s => s === "Sell").length;
        const totalPct = Math.round(((buyCount - sellCount) / signals.length) * 100);
        let classification = "Neutral";
        if (totalPct > 60) classification = "Strong Uptrend";
        else if (totalPct > 20) classification = "Bullish";
        else if (totalPct >= -20) classification = "Neutral";
        else if (totalPct >= -60) classification = "Bearish";
        else classification = "Strong Downtrend";
        return { param, signals, total: totalPct, classification };
    });
}
function getTabData(tab: AnalysisTab, symbol: string, currentSources: Record<AnalysisTab, any[]>) {
    const paramLabels: Record<AnalysisTab, string> = {
        "Vector Core": "VC",
        "Delta Engine": "DE",
        "Pulse Matrix": "PM",
        "Boundary Shell": "BS",
        "Power Field": "PF",
        "Phase X Layer": "PX",
    };

    const rows = getComponentDataFromJson(tab, symbol, currentSources[tab]) || [];

    if (rows.length === 0) {
        return { paramLabel: paramLabels[tab], rows: [], colTotals: [], colClassifications: [], overallTotal: 0, overallClass: "Neutral" };
    }

    const colTotals = vcTfColumns.map((_, ci) => {
        const buyC = rows.filter(r => r.signals[ci] === "Buy").length;
        const sellC = rows.filter(r => r.signals[ci] === "Sell").length;
        return rows.length > 0 ? Math.round(((buyC - sellC) / rows.length) * 100) : 0;
    });

    const colClassifications = colTotals.map(t => getClassification(t / 100));

    const overallTotal = rows.length > 0 ? Math.round(rows.reduce((a, b) => a + b.total, 0) / rows.length) : 0;
    const overallClass = getClassification(overallTotal / 100);
    return { paramLabel: paramLabels[tab], rows, colTotals, colClassifications, overallTotal, overallClass };
}
/* ═══════════ Dynamic Layer Aggregation ═══════════ */

type TeamLabel = "Short Term" | "Medium Term" | "Long Term" | "Overall";

const teamLabelsAr: Record<string, string> = { "Short Term": "قصير المدى", "Medium Term": "متوسط المدى", "Long Term": "طويل المدى", "Overall": "الإجمالي" };

const indicatorTabs: AnalysisTab[] = ["Vector Core", "Delta Engine", "Pulse Matrix", "Boundary Shell", "Power Field"];

function getClassification(dsr: number): string {
    const t = dsr * 100;
    if (t > 60) return "Strong Uptrend";
    if (t > 20) return "Bullish";
    if (t >= -20) return "Neutral";
    if (t >= -60) return "Bearish";
    return "Strong Downtrend";
}

function getDynamicLayerData(symbol: string, currentSources: Record<AnalysisTab, any[]>) {
    // Team definition by TIMEFRAME COLUMNS (not rows):
    // Short Term = M5, M10, M15, M20, M30  → column indices 0-4
    // Medium Term = H1, H2, H3, H4         → column indices 5-8
    // Long Term = H6, H8, D1               → column indices 9-11
    const teamColRanges: { name: TeamLabel; cols: number[] }[] = [
        { name: "Short Term", cols: [0, 1, 2, 3, 4] },       // M5 to M30
        { name: "Medium Term", cols: [5, 6, 7, 8] },         // H1 to H4
        { name: "Long Term", cols: [9, 10, 11] },            // H6 to D1
    ];
    const teamNames: TeamLabel[] = ["Short Term", "Medium Term", "Long Term"];

    const byIndicator: { indicator: string; teams: { team: TeamLabel; buy: number; sell: number; net: number; dsr: number; classification: string }[]; overall: { buy: number; sell: number; net: number; dsr: number; classification: string } }[] = [];

    indicatorTabs.forEach(tab => {
        const tabData = getTabData(tab, symbol, currentSources);
        const allRows = tabData.rows;

        // For each team, count Buy/Sell in that team's COLUMNS across ALL rows
        const teams = teamColRanges.map(({ name, cols }) => {
            let buy = 0, sell = 0;
            allRows.forEach(r => {
                cols.forEach(ci => {
                    const s = r.signals[ci];
                    if (s === "Buy") buy++;
                    else if (s === "Sell") sell++;
                });
            });

            const net = buy - sell;
            const totalCount = buy + sell;
            const dsr = totalCount > 0 ? net / totalCount : 0;
            return { team: name, buy, sell, net, dsr: Math.round(dsr * 100) / 100, classification: getClassification(dsr) };
        });

        const totalBuy = teams.reduce((a, t) => a + t.buy, 0);
        const totalSell = teams.reduce((a, t) => a + t.sell, 0);
        const totalNet = totalBuy - totalSell;
        const totalDsr = (totalBuy + totalSell) > 0 ? totalNet / (totalBuy + totalSell) : 0;

        byIndicator.push({
            indicator: tab,
            teams,
            overall: { buy: totalBuy, sell: totalSell, net: totalNet, dsr: Math.round(totalDsr * 100) / 100, classification: getClassification(totalDsr) },
        });
    });

    const byTeam: { team: TeamLabel; indicators: { indicator: string; buy: number; sell: number; net: number; dsr: number; classification: string }[]; overall: { buy: number; sell: number; net: number; dsr: number; classification: string } }[] = [];

    teamNames.forEach((team, ti) => {
        const indicators = indicatorTabs.map(tab => {
            const found = byIndicator.find(b => b.indicator === tab)!;
            return { indicator: tab, ...found.teams[ti] };
        });

        const totalBuy = indicators.reduce((a, t) => a + t.buy, 0);
        const totalSell = indicators.reduce((a, t) => a + t.sell, 0);
        const totalNet = totalBuy - totalSell;
        const totalDsr = (totalBuy + totalSell) > 0 ? totalNet / (totalBuy + totalSell) : 0;

        byTeam.push({
            team,
            indicators,
            overall: { buy: totalBuy, sell: totalSell, net: totalNet, dsr: Math.round(totalDsr * 100) / 100, classification: getClassification(totalDsr) },
        });
    });

    const allBuy = byIndicator.reduce((a, b) => a + b.overall.buy, 0);
    const allSell = byIndicator.reduce((a, b) => a + b.overall.sell, 0);
    const allNet = allBuy - allSell;
    const allDsr = (allBuy + allSell) > 0 ? allNet / (allBuy + allSell) : 0;
    const allRow = { buy: allBuy, sell: allSell, net: allNet, dsr: Math.round(allDsr * 100) / 100, classification: getClassification(allDsr) };

    // byTeam: [0]=Short Term, [1]=Medium Term, [2]=Long Term
    const dsrST = byTeam[0]?.overall.dsr ?? 0;
    const dsrMT = byTeam[1]?.overall.dsr ?? 0;
    const dsrLT = byTeam[2]?.overall.dsr ?? 0;

    // Global Score = (LT*0.5) + (MT*0.3) + (ST*0.2)
    const weightedScore = (dsrLT * 0.5) + (dsrMT * 0.3) + (dsrST * 0.2);
    const globalScorePct = Math.round(weightedScore * 100);

    // Confidence = 1 - (MAX(DSRs) - MIN(DSRs)) / 2
    const maxDsr = Math.max(dsrST, dsrMT, dsrLT);
    const minDsr = Math.min(dsrST, dsrMT, dsrLT);
    const confidence = Math.round((1 - (maxDsr - minDsr) / 2) * 100);

    return { byIndicator, byTeam, allRow, globalScorePct, confidence };
}

/* ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  F1 Racing Cinematic Effects ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  */

/* Speed Streaks — horizontal racing lines that fly across the banner */
const SpeedStreaks = ({ color }: { color: string }) => {
    const streaks = useMemo(() => Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        y: 8 + Math.random() * 84,
        width: 60 + Math.random() * 200,
        height: 0.5 + Math.random() * 1.5,
        duration: 1.2 + Math.random() * 2,
        delay: Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.5,
    })), []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {streaks.map(s => (
                <motion.div
                    key={s.id}
                    className="absolute rounded-full"
                    style={{
                        top: `${s.y}%`,
                        width: s.width,
                        height: s.height,
                        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                        filter: `blur(${s.height > 1 ? 1 : 0}px)`,
                        boxShadow: `0 0 8px ${color}`,
                    }}
                    animate={{ left: ["-15%", "115%"] }}
                    transition={{
                        duration: s.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: s.delay,
                    }}
                />
            ))}
        </div>
    );
};

/* Energy Wave — powerful SVG wave grid */
const EnergyWaves = ({ color }: { color: string }) => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="w-full h-full" preserveAspectRatio="none" style={{ opacity: 0.4 }}>
            {[20, 40, 55, 70, 85].map((y, i) => (
                <motion.path
                    key={i}
                    d={`M-200 ${y} Q 300 ${y - 30}, 600 ${y} T 1400 ${y} T 2200 ${y}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={1.5 - i * 0.2}
                    animate={{
                        d: [
                            `M-200 ${y} Q 300 ${y - 30}, 600 ${y} T 1400 ${y} T 2200 ${y}`,
                            `M-200 ${y} Q 300 ${y + 40}, 600 ${y} T 1400 ${y} T 2200 ${y}`,
                            `M-200 ${y} Q 300 ${y - 30}, 600 ${y} T 1400 ${y} T 2200 ${y}`,
                        ],
                        opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{ duration: 4 + i * 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
                />
            ))}
        </svg>
    </div>
);

/* Particle Emitter — sparks flying like exhaust particles */
const RacingParticles = ({ color }: { color: string }) => {
    const particles = useMemo(() => Array.from({ length: 90 }).map((_, i) => ({
        id: i,
        startX: Math.random() * 50 + 25,
        startY: Math.random() * 100,
        size: Math.random() * 2.5 + 0.4,
        duration: 2 + Math.random() * 5,
        delay: Math.random() * 6,
        driftX: (Math.random() - 0.5) * 80,
        driftY: -(20 + Math.random() * 60),
    })), []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map(p => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${p.startX}%`,
                        top: `${p.startY}%`,
                        width: p.size,
                        height: p.size,
                        backgroundColor: color,
                        boxShadow: `0 0 ${6 + p.size * 4}px ${color}`,
                    }}
                    animate={{
                        x: [0, p.driftX],
                        y: [0, p.driftY],
                        opacity: [0, 0.9, 0],
                        scale: [0.5, 1.5, 0.2],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: p.delay,
                    }}
                />
            ))}
        </div>
    );
};

/* LED Border Pulse — racing car LED strips */
const LEDBorderPulse = ({ color }: { color: string }) => (
    <>
        {/* Top LED strip */}
        <motion.div className="absolute top-0 left-0 right-0 h-[2px] z-30"
            style={{ background: `linear-gradient(90deg, transparent 5%, ${color} 30%, ${color} 70%, transparent 95%)` }}
            animate={{ opacity: [0.2, 1, 0.2], scaleX: [0.7, 1, 0.7] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Bottom LED strip */}
        <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] z-30"
            style={{ background: `linear-gradient(90deg, transparent 10%, ${color}80 40%, ${color}80 60%, transparent 90%)` }}
            animate={{ opacity: [0.1, 0.7, 0.1], scaleX: [0.8, 1.1, 0.8] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        {/* Left LED strip */}
        <motion.div className="absolute top-0 bottom-0 left-0 w-[2px] z-30"
            style={{ background: `linear-gradient(180deg, ${color} 0%, transparent 60%)` }}
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Right LED strip */}
        <motion.div className="absolute top-0 bottom-0 right-0 w-[2px] z-30"
            style={{ background: `linear-gradient(180deg, ${color} 0%, transparent 60%)` }}
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
    </>
);

/* Heat Haze — radial glow that breathes intensely */
const HeatHaze = ({ color }: { color: string }) => (
    <>
        <motion.div className="absolute inset-0 z-0"
            animate={{
                background: [
                    `radial-gradient(ellipse 60% 80% at 75% 50%, ${color}22 0%, transparent 50%), radial-gradient(ellipse 40% 60% at 20% 40%, ${color}11 0%, transparent 40%)`,
                    `radial-gradient(ellipse 80% 100% at 75% 50%, ${color}33 0%, transparent 50%), radial-gradient(ellipse 50% 70% at 25% 60%, ${color}22 0%, transparent 40%)`,
                    `radial-gradient(ellipse 60% 80% at 75% 50%, ${color}22 0%, transparent 50%), radial-gradient(ellipse 40% 60% at 20% 40%, ${color}11 0%, transparent 40%)`,
                ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Corner bloom */}
        <motion.div className="absolute -top-10 -right-10 w-72 h-72 rounded-full z-0"
            style={{ background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`, filter: "blur(30px)" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
    </>
);

/* ═══════════ SUPERCAR GAUGE ═══════════ */

function SupercarGauge({ score, confidence, isRTL }: { score: number; confidence: number; isRTL: boolean }) {

    // 5-state color based on Global Score
    const primary = score > 0.6 ? "#00c853"   // Strong Uptrend
        : score > 0.2 ? "#00e676"              // Bullish
            : score >= -0.2 ? "#ffc400"            // Neutral
                : score >= -0.6 ? "#ff6d00"            // Bearish
                    : "#ff1744";                            // Strong Downtrend

    const glow = score > 0.6 ? "rgba(0,200,83,"
        : score > 0.2 ? "rgba(0,230,118,"
            : score >= -0.2 ? "rgba(255,196,0,"
                : score >= -0.6 ? "rgba(255,109,0,"
                    : "rgba(255,23,68,";

    // Confidence ring color (5 levels)
    const confColor = confidence >= 85 ? "#00e5ff"
        : confidence >= 70 ? "#448aff"
            : confidence >= 55 ? "#26c6da"
                : confidence >= 40 ? "#ffab00"
                    : "#ff6e40";

    const size = 260;

    const cx = size / 2, cy = size / 2;

    const arc = (sd: number, ed: number, r: number) => {

        const s = (sd * Math.PI) / 180, e = (ed * Math.PI) / 180;

        const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);

        const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
        return `M ${x1} ${y1} A ${r} ${r} 0 ${ed - sd > 180 ? 1 : 0} 1 ${x2} ${y2}`;
    };

    const startA = -225, sweepA = 270;

    const norm = (score + 1) / 2;

    const scoreAngle = startA + norm * sweepA;

    const segments = 60;

    const segAngle = sweepA / segments;

    const activeSegs = Math.round(norm * segments);

    const confNorm = confidence / 100;

    const ticks = Array.from({ length: 55 }, (_, i) => {

        const angle = startA + (i / 54) * sweepA;

        const rad = (angle * Math.PI) / 180;

        const isMajor = i % 5 === 0;

        const r1 = 110, r2 = isMajor ? 100 : 104;
        return { x1: cx + r1 * Math.cos(rad), y1: cy + r1 * Math.sin(rad), x2: cx + r2 * Math.cos(rad), y2: cy + r2 * Math.sin(rad), isMajor };
    });

    const needleRad = (scoreAngle * Math.PI) / 180;

    const nx = cx + 98 * Math.cos(needleRad), ny = cy + 98 * Math.sin(needleRad);

    const scorePct = Math.round(score * 100);
    const scoreText = (scorePct > 0 ? "+" : "") + scorePct + "%";
    return (
        <div className="relative" style={{ width: size, height: size * 0.68 }}>
            <div className="absolute" style={{ top: -15, left: -15, right: -15, bottom: -15, background: `radial-gradient(circle at 50% 55%, ${glow}0.12) 0%, transparent 65%)`, filter: "blur(8px)" }} />
            <svg width={size} height={size * 0.68} viewBox={`0 0 ${size} ${size * 0.68}`} className="relative z-10">
                <defs>
                    <filter id="hGlow"><feGaussianBlur stdDeviation="5" result="b1" /><feGaussianBlur stdDeviation="2" result="b2" /><feMerge><feMergeNode in="b1" /><feMergeNode in="b2" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                    <filter id="sGlow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                    <filter id="tGlow"><feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                    <radialGradient id="iDisc" cx="50%" cy="50%"><stop offset="0%" stopColor="#0d1520" /><stop offset="100%" stopColor="#060a10" /></radialGradient>
                    <filter id="vGlow"><feGaussianBlur stdDeviation="12" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter>
                </defs>
                {Array.from({ length: segments }, (_, i) => {

                    const a1 = startA + i * segAngle + 0.5, a2 = startA + (i + 1) * segAngle - 0.5;

                    const isActive = i < activeSegs;

                    const p = i / segments;
                    let c = "#1a2332";
                    if (isActive) { if (p < 0.25) c = "#ff1744"; else if (p < 0.4) c = "#ff6d00"; else if (p < 0.55) c = "#ffc400"; else if (p < 0.75) c = "#76ff03"; else c = "#00e676"; }
                    return <motion.path key={i} d={arc(a1, a2, 122)} fill="none" stroke={c} strokeWidth={isActive ? "5" : "2"} strokeLinecap="round" opacity={isActive ? 0.9 : 0.15} initial={{ opacity: 0 }} animate={{ opacity: isActive ? 0.9 : 0.15 }} transition={{ delay: i * 0.01, duration: 0.2 }} />;
                })}
                <path d={arc(-225, 45, 90)} fill="none" stroke="#111a28" strokeWidth="3" strokeLinecap="round" />
                <motion.path d={arc(-225, -225 + confNorm * 270, 90)} fill="none" stroke={confColor} strokeWidth="3" strokeLinecap="round" opacity="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 1.2 }} />
                {ticks.map((t, i) => <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.isMajor ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"} strokeWidth={t.isMajor ? 1.5 : 0.7} />)}
                <circle cx={cx} cy={cy} r="72" fill="url(#iDisc)" /><circle cx={cx} cy={cy} r="72" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                {(() => {
                    const nRad = (scoreAngle * Math.PI) / 180;
                    const tipX = cx + 92 * Math.cos(nRad), tipY = cy + 92 * Math.sin(nRad);
                    const baseX = cx - 3 * Math.cos(nRad), baseY = cy - 3 * Math.sin(nRad);
                    const perpX = 2.5 * Math.sin(nRad), perpY = -2.5 * Math.cos(nRad);
                    const b1x = baseX + perpX, b1y = baseY + perpY;
                    const b2x = baseX - perpX, b2y = baseY - perpY;
                    return (
                        <>
                            <motion.polygon
                                points={`${tipX},${tipY} ${b1x},${b1y} ${b2x},${b2y}`}
                                fill={primary} opacity="0.8" filter="url(#sGlow)"
                                initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            />
                            <circle cx={cx} cy={cy} r="5" fill="#0a0e14" stroke={primary} strokeWidth="2" />
                        </>
                    );
                })()}
                <motion.circle cx={nx} cy={ny} r="3.5" fill={primary} filter="url(#hGlow)" initial={{ opacity: 0 }} animate={{ opacity: [0.6, 1, 0.6] }} transition={{ delay: 1.5, duration: 2, repeat: Infinity }} />
                <motion.text x={cx} y={cy + 2} fill={primary} fontSize="30" fontWeight="900" textAnchor="middle" dominantBaseline="middle" fontFamily="'Inter', system-ui" letterSpacing="-1" filter="url(#tGlow)" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.8, type: "spring" }}>{scoreText}</motion.text>
                <text x={cx} y={cy + 22} fill="rgba(255,255,255,0.35)" fontSize="8" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" letterSpacing="2">{i18n[isRTL ? 'ar' : 'en'].globalScore}</text>
                <circle cx={cx} cy={cy} r="115" fill="none" stroke={primary} strokeWidth="1" opacity="0.1" filter="url(#vGlow)" />
            </svg>
        </div>
    );
}
/* ═══════════ Glass Panel ═══════════ */

function Panel({ children, className = "", accent }: { children: React.ReactNode; className?: string; accent?: string }) {
    return (
        <motion.div className={`rounded-2xl overflow-hidden ${className}`}
            initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
            whileHover={{ boxShadow: accent ? `0 12px 50px rgba(0,0,0,0.6), 0 0 60px ${accent}` : "0 12px 50px rgba(0,0,0,0.6)" }}
            style={{
                background: "linear-gradient(160deg, rgba(14,20,33,0.92) 0%, rgba(8,12,22,0.96) 100%)",
                border: "1px solid rgba(255,255,255,0.05)",
                boxShadow: accent ? `0 8px 40px rgba(0,0,0,0.5), 0 0 50px ${accent}, inset 0 1px 0 rgba(255,255,255,0.04)` : "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}>
            {children}
        </motion.div>
    );
}
/* ═══════════ Scanning line ═══════════ */

function ScanLine({ color }: { color: string }) {
    return (
        <motion.div className="absolute left-0 right-0 h-px pointer-events-none z-20"
            style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }}
            animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
    );
}
/* ═══════════ Animated Buy/Sell Cell ═══════════ */

function SignalCell({ signal, rowIdx, colIdx }: { signal: Signal; rowIdx: number; colIdx: number }) {
    const isBuy = signal === "Buy";
    const isSell = signal === "Sell";
    const isNeutral = signal === "Neutral" || signal === "NA";

    let color = "#666"; // Gray for NA
    let bgColor = "rgba(255,255,255,0.03)";
    let label = "-";

    if (isBuy) {
        color = "#00e676";
        bgColor = "rgba(0,230,118,0.06)";
        label = "Buy";
    } else if (isSell) {
        color = "#ff1744";
        bgColor = "rgba(255,23,68,0.06)";
        label = "Sell";
    } else if (signal === "Neutral") {
        color = "#ffc400";
        bgColor = "rgba(255,196,0,0.06)";
        label = "Neu";
    }

    return (
        <motion.td className="text-center text-[10px] font-bold py-[5px] px-0.5 border-r border-b relative"
            style={{
                color: color,
                background: bgColor,
                borderColor: "rgba(255,255,255,0.03)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: rowIdx * 0.008 + colIdx * 0.004, duration: 0.2 }}
            whileHover={{
                scale: 1.15,
                zIndex: 20,
                boxShadow: `0 0 10px ${color}30`,
                background: isBuy ? "rgba(0,230,118,0.12)" : isSell ? "rgba(255,23,68,0.12)" : "rgba(255,255,255,0.08)",
            }}
        >
            {label}
        </motion.td>
    );
}
/* ═══════════ Analysis Data Table ═══════════ */

function AnalysisTable({ tab, symbol, isRTL, sources }: { tab: AnalysisTab; symbol: string; isRTL: boolean; sources: Record<AnalysisTab, any[]> }) {
    const data = getTabData(tab, symbol, sources);
    const displayRows = data.rows;
    const displayTfCols = vcTfLabels;
    const displayColTotals = data.colTotals;
    const displayColClassifications = data.colClassifications;
    const displayOverallTotal = data.overallTotal;
    const displayOverallClass = data.overallClass;

    const t = i18n[isRTL ? 'ar' : 'en'];
    const accentColor = displayOverallTotal >= 0 ? "#00e676" : "#ff1744";
    const accentGlow = displayOverallTotal >= 0 ? "rgba(0,230,118,0.04)" : "rgba(255,23,68,0.04)";

    const tableRef = useRef<HTMLDivElement>(null);
    return (
        <Panel accent={accentGlow}>
            <div className="p-4">
                {/* Table Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <motion.span className="text-lg" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                            {analysisTabIcons[tab]}
                        </motion.span>
                        <span className="text-[14px] font-black text-white tracking-wider uppercase" dir="auto">
                            {isRTL ? analysisTabsAr[tab] : tab}
                        </span>
                        {(displayRows.length > 0) && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1.5" style={{ background: "rgba(0,229,160,0.1)", color: "#00e5a0", border: "1px solid rgba(0,229,160,0.2)" }}>
                                <motion.div className="w-1.5 h-1.5 rounded-full bg-[#00e5a0]"
                                    animate={{ opacity: [0.3, 1, 0.3], boxShadow: ["0 0 0 rgba(0,229,160,0)", "0 0 8px rgba(0,229,160,0.8)", "0 0 0 rgba(0,229,160,0)"] }}
                                    transition={{ duration: 1.5, repeat: Infinity }} />
                                LIVE
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">


                        <div className="flex gap-1">
                            {[0, 1, 2].map(i => (
                                <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: accentColor }}
                                    animate={{ opacity: [0.2, 1, 0.2] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }} />
                            ))}
                        </div>
                        <span className="text-[11px] font-mono text-gray-600">
                            {displayRows.length} rows × {displayTfCols.length} tf
                        </span>
                    </div>
                </div>
                {/* Scrollable Table */}
                <div ref={tableRef} className="rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
                    <table className="w-full border-collapse">
                        <thead className="sticky top-0 z-10">
                            <tr style={{ background: "rgba(10,16,28,0.98)" }}>
                                <th className="text-left text-[11px] font-bold text-gray-400 py-2 px-3 border-r border-b sticky left-0 z-20"
                                    style={{ background: "rgba(10,16,28,0.98)", borderColor: "rgba(255,255,255,0.05)", minWidth: "78px" }}>
                                    {data.paramLabel}
                                </th>
                                {displayTfCols.map(tf => (
                                    <th key={tf} className="text-center text-[10px] font-bold text-gray-500 py-2 px-1 border-r border-b tracking-wider"
                                        style={{ borderColor: "rgba(255,255,255,0.05)", minWidth: "52px" }}>
                                        {tf}
                                    </th>
                                ))}
                                <th className="text-center text-[10px] font-bold text-amber-400 py-2 px-2 border-r border-b tracking-wider"
                                    style={{ borderColor: "rgba(255,255,255,0.05)", minWidth: "55px" }}>{i18n[isRTL ? 'ar' : 'en'].total}</th>
                                <th className="text-center text-[10px] font-bold text-cyan-400 py-2 px-2 border-b tracking-wider"
                                    style={{ borderColor: "rgba(255,255,255,0.05)", minWidth: "110px" }}>{i18n[isRTL ? 'ar' : 'en'].classification}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayRows.map((row, ri) => (
                                <motion.tr key={ri}
                                    className="group transition-colors"
                                    style={{ cursor: "pointer" }}
                                    initial={{ opacity: 0, x: -20, filter: "blur(3px)" }}
                                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                    transition={{ delay: ri * 0.012, duration: 0.25, type: "spring", stiffness: 200 }}
                                    whileHover={{
                                        backgroundColor: "rgba(255,255,255,0.04)",
                                        scale: 1.005,
                                        x: 3,
                                    }}>
                                    <td className="text-[11px] font-semibold text-gray-500 py-[5px] px-3 border-r border-b sticky left-0"
                                        style={{ background: "rgba(10,16,28,0.95)", borderColor: "rgba(255,255,255,0.03)" }}>
                                        {row.param}
                                    </td>
                                    {row.signals.map((sig: Signal, ci: number) => (
                                        <SignalCell key={ci} signal={sig} rowIdx={ri} colIdx={ci} />
                                    ))}
                                    <td className="text-center text-[11px] font-black py-[5px] px-2 border-r border-b"
                                        style={{ color: getTotalColor(row.total), borderColor: "rgba(255,255,255,0.03)", background: `${getTotalColor(row.total)}08` }}>
                                        {row.total}%
                                    </td>
                                    <td className="text-center text-[10px] font-bold py-[5px] px-2 border-b"
                                        style={{ color: getClassColor(row.classification), borderColor: "rgba(255,255,255,0.03)" }}>
                                        {isRTL ? (trendAr[row.classification] || row.classification) : row.classification}
                                    </td>
                                </motion.tr>
                            ))}
                            {/* Total Row */}
                            <tr style={{ background: "rgba(255,200,0,0.04)" }}>
                                <td className="text-[11px] font-black text-amber-400 py-2 px-3 border-r border-b sticky left-0"
                                    style={{ background: "rgba(10,16,28,0.98)", borderColor: "rgba(255,255,255,0.05)" }}>
                                    {i18n[isRTL ? 'ar' : 'en'].total}
                                </td>
                                {displayColTotals.map((t, ci) => (
                                    <td key={ci} className="text-center text-[11px] font-black py-2 px-1 border-r border-b"
                                        style={{ color: getTotalColor(t), borderColor: "rgba(255,255,255,0.05)", background: `${getTotalColor(t)}08` }}>
                                        {t}%
                                    </td>
                                ))}
                                <td className="text-center text-[12px] font-black py-2 px-2 border-r border-b"
                                    style={{ color: getTotalColor(displayOverallTotal), borderColor: "rgba(255,255,255,0.05)" }}>
                                    {displayOverallTotal}%
                                </td>
                                <td className="text-center text-[11px] font-black py-2 px-2 border-b"
                                    style={{ color: getClassColor(displayOverallClass), borderColor: "rgba(255,255,255,0.05)" }}>
                                    {displayOverallClass}
                                </td>
                            </tr>
                            {/* Classification Row */}
                            <tr style={{ background: "rgba(0,200,255,0.03)" }}>
                                <td className="text-[10px] font-bold text-cyan-400 py-2 px-3 border-r sticky left-0"
                                    style={{ background: "rgba(10,16,28,0.98)", borderColor: "rgba(255,255,255,0.05)" }}>
                                    {i18n[isRTL ? 'ar' : 'en'].classification}
                                </td>
                                {displayColClassifications.map((c, ci) => (
                                    <td key={ci} className="text-center text-[9px] font-bold py-2 px-0.5 border-r"
                                        style={{ color: getClassColor(c), borderColor: "rgba(255,255,255,0.05)", direction: 'ltr' }}>
                                        {isRTL ? (trendAr[c] || c) : c}
                                    </td>
                                ))}
                                <td className="border-r" style={{ borderColor: "rgba(255,255,255,0.05)" }}></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </Panel>
    );
}
/* ═══════════ Dynamic Layer Table ═══════════ */

function DynamicLayerTable({ symbol, isRTL, sources }: { symbol: string; isRTL: boolean; sources: Record<AnalysisTab, any[]> }) {
    const layerData = getDynamicLayerData(symbol, sources);
    const score = layerData.globalScorePct / 100;

    const tv = (v: string) => isRTL ? (trendAr[v] || v) : v;
    const tvTeam = (v: string) => isRTL ? (teamLabelsAr[v] || v) : v;
    const tvTab = (v: string) => isRTL ? (analysisTabsAr[v] || v) : v;

    const bullish = score >= 0;
    const accent = bullish ? "#00e676" : "#ff1744";
    const accentG = bullish ? "rgba(0,230,118," : "rgba(255,23,68,";
    const cellStyle = (v: number) => ({ color: v >= 0 ? "#00e676" : "#ff1744" });


    const classStyle = (c: string) => ({ color: getClassColor(c) });
    // ALL team breakdown data

    const allTeams = layerData.byTeam.map(t => ({
        team: t.team,
        buy: t.overall.buy,
        sell: t.overall.sell,
        net: t.overall.net,
        dsr: t.overall.dsr,
        classification: t.overall.classification,
    }));

    const thCls = "text-[13px] font-bold text-gray-300 py-3.5 px-4 border-r border-b tracking-wider";

    const tdCls = "text-center text-[13px] font-bold py-3 px-3 border-r border-b";

    const tdClsLast = "text-center text-[13px] font-bold py-3 px-4 border-b";

    const borderC = "rgba(255,255,255,0.06)";
    return (
        <div className="space-y-5">
            {/* ═══ Summary Cards Above Tables ═══ */}
            <div className="grid grid-cols-12 gap-4">
                {/* ALL Summary Card */}
                <div className="col-span-8">
                    <Panel accent={`${accentG}0.06)`}>
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2.5">
                                    <motion.span className="text-xl" animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 2, repeat: Infinity }}> </motion.span>
                                    <span className="text-[16px] font-black text-white tracking-wider uppercase" dir="auto">ALL</span>
                                </div>
                                <span className="text-[10px] text-gray-600 tracking-widest uppercase">{isRTL ? "ملخص التصنيف" : "CLASSIFICATION SUMMARY"}</span>
                            </div>
                            <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${accentG}0.1)` }}>
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr style={{ background: "rgba(10,16,28,0.98)" }}>
                                            {[isRTL ? "الفترة" : "Team", isRTL ? "شراء" : "Buy", isRTL ? "بيع" : "Sell", "Net", "DSR", isRTL ? "التصنيف" : "Classification"].map((h, i) => (
                                                <th key={i} className="text-[12px] font-bold text-gray-400 py-3 px-4 border-r border-b tracking-wider"
                                                    style={{ borderColor: borderC, background: i === 0 ? `${accentG}0.05)` : undefined }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allTeams.map((row, i) => (
                                            <motion.tr key={i} className="hover:bg-white/[0.02]" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                                                <td className="text-[13px] font-bold text-gray-300 py-2.5 px-4 border-r border-b" style={{ borderColor: borderC, background: `${accentG}0.03)` }}>{tvTeam(row.team)}</td>
                                                <td className="text-center text-[13px] font-bold py-2.5 px-3 border-r border-b" style={{ color: "#00e676", borderColor: borderC }}>{row.buy}</td>
                                                <td className="text-center text-[13px] font-bold py-2.5 px-3 border-r border-b" style={{ color: "#ff1744", borderColor: borderC }}>{row.sell}</td>
                                                <td className="text-center text-[13px] font-bold py-2.5 px-3 border-r border-b" style={{ ...cellStyle(row.net), borderColor: borderC }}>{row.net}</td>
                                                <td className="text-center text-[13px] font-bold py-2.5 px-3 border-r border-b" style={{ ...cellStyle(row.dsr), borderColor: borderC }}>({row.dsr.toFixed(2)})</td>
                                                <td className="text-center text-[13px] font-bold py-2.5 px-4 border-b" style={{ ...classStyle(row.classification), borderColor: borderC }}>{tv(row.classification)}</td>
                                            </motion.tr>
                                        ))}
                                        {/* Over all row */}
                                        <motion.tr style={{ background: `${accentG}0.04)` }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                                            <td className="text-[13px] font-black text-amber-400 py-2.5 px-4 border-r border-b" style={{ borderColor: `${accentG}0.1)`, background: `${accentG}0.06)` }}>{tvTeam("Over all")}</td>
                                            <td className="text-center text-[14px] font-black py-2.5 px-3 border-r border-b" style={{ color: "#00e676", borderColor: `${accentG}0.1)` }}>{layerData.allRow.buy}</td>
                                            <td className="text-center text-[14px] font-black py-2.5 px-3 border-r border-b" style={{ color: "#ff1744", borderColor: `${accentG}0.1)` }}>{layerData.allRow.sell}</td>
                                            <td className="text-center text-[14px] font-black py-2.5 px-3 border-r border-b" style={{ ...cellStyle(layerData.allRow.net), borderColor: `${accentG}0.1)` }}>{layerData.allRow.net}</td>
                                            <td className="text-center text-[14px] font-black py-2.5 px-3 border-r border-b" style={{ ...cellStyle(layerData.allRow.dsr), borderColor: `${accentG}0.1)` }}>({layerData.allRow.dsr.toFixed(2)})</td>
                                            <td className="text-center text-[14px] font-black py-2.5 px-4 border-b" style={{ ...classStyle(layerData.allRow.classification), borderColor: `${accentG}0.1)` }}>{tv(layerData.allRow.classification)}</td>
                                        </motion.tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Panel>
                </div>
                {/* Confidence + Global Score Card */}
                <div className="col-span-4 space-y-4">
                    <Panel accent={`${accentG}0.08)`}>
                        <div className="p-5 text-center">
                            <div className="text-[10px] text-gray-600 tracking-[0.25em] uppercase font-semibold mb-1">{isRTL ? "النتيجة الإجمالية" : "Global Score"}</div>
                            <motion.div className="text-[44px] font-black leading-none my-2" style={{ color: accent }}
                                animate={{ textShadow: [`0 0 20px ${accentG}0.2)`, `0 0 45px ${accentG}0.5)`, `0 0 20px ${accentG}0.2)`] }}
                                transition={{ duration: 2.5, repeat: Infinity }}>{layerData.globalScorePct}%</motion.div>
                            <span className="text-[14px] font-bold" style={{ color: accent }}>{tv(layerData.allRow.classification)}</span>
                        </div>
                    </Panel>
                    <Panel accent={`${accentG}0.08)`}>
                        <div className="p-5 text-center" style={{ background: `linear-gradient(180deg, transparent 0%, ${accentG}0.04) 100%)` }}>
                            <div className="text-[10px] text-gray-600 tracking-[0.25em] uppercase font-semibold mb-1">{isRTL ? "مستوى الثقة" : "Confidence"}</div>
                            <motion.div className="text-[44px] font-black leading-none my-2" style={{ color: accent }}
                                animate={{ textShadow: [`0 0 20px ${accentG}0.2)`, `0 0 45px ${accentG}0.5)`, `0 0 20px ${accentG}0.2)`] }}
                                transition={{ duration: 2.5, repeat: Infinity }}>{layerData.confidence}%</motion.div>
                            <span className="text-[14px] font-bold" style={{ color: accent }}>{layerData.confidence >= 70 ? (isRTL ? "ثقة عالية" : "High Confidence") : (isRTL ? "ثقة متوسطة" : "Medium Confidence")}</span>
                        </div>
                    </Panel>
                </div>
            </div>
            {/* ═══ Table 1: Indicator × Team ═══ */}
            <Panel accent={`${accentG}0.04)`}>
                <div className="p-5">
                    <div className="flex items-center gap-2.5 mb-4">
                        <motion.span className="text-xl" animate={{ rotate: [0, 6, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}> </motion.span>
                        <span className="text-[15px] font-black text-white tracking-wider uppercase" dir="auto">
                            {isRTL ? "المؤشرات حسب الفترة" : "INDICATORS BY TEAM"}
                        </span>
                    </div>
                    <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${accentG}0.08)` }}>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr style={{ background: "rgba(10,16,28,0.98)" }}>
                                    {[isRTL ? "المؤشر" : "Indicator", isRTL ? "الفترة" : "Team", isRTL ? "شراء" : "Buy", isRTL ? "بيع" : "Sell", "Net", "DSR", isRTL ? "التصنيف" : "Regime Classification"].map((h, i) => (
                                        <th key={i} className={thCls}
                                            style={{ borderColor: borderC, background: i < 2 ? "rgba(255,200,0,0.04)" : undefined }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {layerData.byIndicator.map((ind, ii) => (
                                    <>{ind.teams.map((tm, ti) => (
                                        <motion.tr key={`${ii}-${ti}`} className="hover:bg-white/[0.02]" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (ii * 4 + ti) * 0.025 }}>
                                            {ti === 0 && <td rowSpan={4} className="text-[14px] font-black text-white py-3 px-4 border-r border-b" style={{ borderColor: borderC, background: "rgba(255,200,0,0.04)", verticalAlign: "middle" }}>{tvTab(ind.indicator)}</td>}
                                            <td className="text-[13px] font-semibold text-gray-400 py-2.5 px-4 border-r border-b" style={{ borderColor: borderC }}>{tvTeam(tm.team)}</td>
                                            <td className={tdCls} style={{ color: "#00e676", borderColor: borderC }}>{tm.buy}</td>
                                            <td className={tdCls} style={{ color: "#ff1744", borderColor: borderC }}>{tm.sell}</td>
                                            <td className={tdCls} style={{ ...cellStyle(tm.net), borderColor: borderC }}>{tm.net}</td>
                                            <td className={tdCls} style={{ ...cellStyle(tm.dsr), borderColor: borderC }}>({tm.dsr.toFixed(2)})</td>
                                            <td className={tdClsLast} style={{ ...classStyle(tm.classification), borderColor: borderC }}>{tv(tm.classification)}</td>
                                        </motion.tr>
                                    ))}
                                        <motion.tr style={{ background: "rgba(255,200,0,0.04)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (ii * 4 + 3) * 0.025 }}>
                                            <td className="text-[13px] font-black text-amber-400 py-2.5 px-4 border-r border-b" style={{ borderColor: borderC }}>{tvTeam("Over all")}</td>
                                            <td className={tdCls + " !font-black"} style={{ color: "#00e676", borderColor: borderC }}>{ind.overall.buy}</td>
                                            <td className={tdCls + " !font-black"} style={{ color: "#ff1744", borderColor: borderC }}>{ind.overall.sell}</td>
                                            <td className={tdCls + " !font-black"} style={{ ...cellStyle(ind.overall.net), borderColor: borderC }}>{ind.overall.net}</td>
                                            <td className={tdCls + " !font-black"} style={{ ...cellStyle(ind.overall.dsr), borderColor: borderC }}>{ind.overall.dsr.toFixed(2)}</td>
                                            <td className={tdClsLast + " !font-black"} style={{ ...classStyle(ind.overall.classification), borderColor: borderC }}>{tv(ind.overall.classification)}</td>
                                        </motion.tr></>
                                ))}
                                {/* ALL Section (expanded) */}
                                {allTeams.map((row, ri) => (
                                    <motion.tr key={`all-${ri}`} style={{ background: ri < 3 ? "rgba(200,100,255,0.03)" : "rgba(200,100,255,0.06)" }}
                                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + ri * 0.05 }}>
                                        {ri === 0 && <td rowSpan={4} className="text-[15px] font-black text-cyan-400 py-3 px-4 border-r border-b" style={{ borderColor: borderC, background: "rgba(0,200,255,0.06)", verticalAlign: "middle", letterSpacing: "0.15em" }}>ALL</td>}
                                        <td className="text-[13px] font-semibold py-2.5 px-4 border-r border-b" style={{ color: ri === 3 ? "#ffc400" : "#9ca3af", borderColor: borderC }}>{tvTeam(ri === 3 ? "Over all" : row.team)}</td>
                                        <td className={tdCls} style={{ color: "#00e676", borderColor: borderC }}>{row.buy}</td>
                                        <td className={tdCls} style={{ color: "#ff1744", borderColor: borderC }}>{row.sell}</td>
                                        <td className={tdCls} style={{ ...cellStyle(row.net), borderColor: borderC }}>{row.net}</td>
                                        <td className={tdCls} style={{ ...cellStyle(row.dsr), borderColor: borderC }}>({row.dsr.toFixed(2)})</td>
                                        <td className={tdClsLast} style={{ ...classStyle(row.classification), borderColor: borderC }}>{tv(row.classification)}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Panel>
            {/* ═══ Table 2: Team × Indicator ═══ */}
            <Panel accent={`${accentG}0.04)`}>
                <div className="p-5">
                    <div className="flex items-center gap-2.5 mb-4">
                        <motion.span className="text-xl" animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 2, repeat: Infinity }}> </motion.span>
                        <span className="text-[15px] font-black text-white tracking-wider uppercase" dir="auto">
                            {isRTL ? "الفترات حسب المؤشر" : "TEAMS BY INDICATOR"}
                        </span>
                    </div>
                    <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${accentG}0.08)` }}>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr style={{ background: "rgba(10,16,28,0.98)" }}>
                                    {[isRTL ? "الفترة" : "Team", isRTL ? "المؤشر" : "Indicator", isRTL ? "شراء" : "Buy", isRTL ? "بيع" : "Sell", "Net", "DSR", isRTL ? "التصنيف" : "Regime Classification"].map((h, i) => (
                                        <th key={i} className={thCls}
                                            style={{ borderColor: borderC, background: i < 2 ? "rgba(0,200,255,0.04)" : undefined }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {layerData.byTeam.map((tm, ti) => (
                                    <>{tm.indicators.map((ind, ii) => (
                                        <motion.tr key={`${ti}-${ii}`} className="hover:bg-white/[0.02]" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (ti * 6 + ii) * 0.025 }}>
                                            {ii === 0 && <td rowSpan={6} className="text-[14px] font-black text-white py-3 px-4 border-r border-b" style={{ borderColor: borderC, background: "rgba(0,200,255,0.04)", verticalAlign: "middle" }}>{tvTeam(tm.team)}</td>}
                                            <td className="text-[13px] font-semibold text-gray-400 py-2.5 px-4 border-r border-b" style={{ borderColor: borderC }}>{tvTab(ind.indicator)}</td>
                                            <td className={tdCls} style={{ color: "#00e676", borderColor: borderC }}>{ind.buy}</td>
                                            <td className={tdCls} style={{ color: "#ff1744", borderColor: borderC }}>{ind.sell}</td>
                                            <td className={tdCls} style={{ ...cellStyle(ind.net), borderColor: borderC }}>{ind.net}</td>
                                            <td className={tdCls} style={{ ...cellStyle(ind.dsr), borderColor: borderC }}>{(ind.dsr * 100).toFixed(0)}%</td>
                                            <td className={tdClsLast} style={{ ...classStyle(ind.classification), borderColor: borderC }}>{tv(ind.classification)}</td>
                                        </motion.tr>
                                    ))}
                                        <motion.tr style={{ background: "rgba(0,200,255,0.03)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (ti * 6 + 5) * 0.025 }}>
                                            <td className="text-[13px] font-black text-cyan-400 py-2.5 px-4 border-r border-b" style={{ borderColor: borderC }}>{tvTeam("Over all")}</td>
                                            <td className={tdCls + " !font-black"} style={{ color: "#00e676", borderColor: borderC }}>{tm.overall.buy}</td>
                                            <td className={tdCls + " !font-black"} style={{ color: "#ff1744", borderColor: borderC }}>{tm.overall.sell}</td>
                                            <td className={tdCls + " !font-black"} style={{ ...cellStyle(tm.overall.net), borderColor: borderC }}>{tm.overall.net}</td>
                                            <td className={tdCls + " !font-black"} style={{ ...cellStyle(tm.overall.dsr), borderColor: borderC }}>{(tm.overall.dsr * 100).toFixed(0)}%</td>
                                            <td className={tdClsLast + " !font-black"} style={{ ...classStyle(tm.overall.classification), borderColor: borderC }}>{tv(tm.overall.classification)}</td>
                                        </motion.tr></>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Panel>
        </div>
    );
}
/* ═══════════ MAIN COMPONENT ═══════════ */

export function PhaseXDynamicsPage({ onBack }: PhaseXDynamicsPageProps) {

    const { language } = useLanguage();

    const isRTL = language === "ar";

    const lang = isRTL ? "ar" : "en";

    const t = i18n[lang];

    const tv = (v: string) => isRTL ? (trendAr[v] || v) : v;

    const [selectedCategory, setSelectedCategory] = useState<MarketCategory>("Metals");

    const [selectedSymbol, setSelectedSymbol] = useState("XAUUSD");
    const [lastSystemUpdate, setLastSystemUpdate] = useState<number | null>(Date.now());

    const [selectedTab, setSelectedTab] = useState<AnalysisTab>("Vector Core");
    const [filterOpen, setFilterOpen] = useState(true);



    const [sources, setSources] = useState<Record<AnalysisTab, any[]>>(defaultAnalysisSources);
    const [uploadStatus, setUploadStatus] = useState<Record<AnalysisTab, boolean[]>>({
        "Vector Core": [false, false, false],
        "Delta Engine": [false, false, false],
        "Pulse Matrix": [false, false, false],
        "Boundary Shell": [false, false, false],
        "Power Field": [false, false, false],
        "Phase X Layer": [false, false, false]
    });

    const layerData = useMemo(() => getDynamicLayerData(selectedSymbol, sources), [selectedSymbol, sources]);

    // Auto-fetch structural dynamics data from API
    useEffect(() => {
        const SD_API_BASE = "https://phase-x-qc8dy.ondigitalocean.app/api/v1/structural-dynamics";
        const stages: { endpoint: string; idx: number }[] = [
            { endpoint: "fast", idx: 0 },
            { endpoint: "medium", idx: 1 },
            { endpoint: "slow", idx: 2 },
        ];

        const fileNameToTab = (name: string): AnalysisTab | null => {
            const n = name.toLowerCase();
            if (n.includes("vector_core") || n.includes("vector-core")) return "Vector Core";
            if (n.includes("delta_engine") || n.includes("delta-engine")) return "Delta Engine";
            if (n.includes("pulse_matrix") || n.includes("pulse-matrix")) return "Pulse Matrix";
            if (n.includes("boundary_shell") || n.includes("boundary-shell")) return "Boundary Shell";
            if (n.includes("power_field") || n.includes("power-field")) return "Power Field";
            if (n.includes("vector")) return "Vector Core";
            if (n.includes("delta")) return "Delta Engine";
            if (n.includes("pulse")) return "Pulse Matrix";
            if (n.includes("boundary")) return "Boundary Shell";
            if (n.includes("power")) return "Power Field";
            return null;
        };

        let cancelled = false;

        const getLatestAPIInterval = () => {
            const now = new Date();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            // Current 5-minute bucket
            let targetMinute = Math.floor(minutes / 5) * 5;

            // If we are before the 30-second mark of this bucket, the "last update" was actually the previous bucket
            if (minutes % 5 === 0 && seconds < 30) {
                targetMinute -= 5;
            }

            const targetDate = new Date(now);
            targetDate.setMinutes(targetMinute);
            targetDate.setSeconds(30);
            targetDate.setMilliseconds(0);
            return targetDate.getTime();
        };

        const fetchAll = async () => {
            const newSources: Record<AnalysisTab, any[]> = {
                "Vector Core": [null, null, null],
                "Delta Engine": [null, null, null],
                "Pulse Matrix": [null, null, null],
                "Boundary Shell": [null, null, null],
                "Power Field": [null, null, null],
                "Phase X Layer": [null, null, null],
            };
            const newStatus: Record<AnalysisTab, boolean[]> = {
                "Vector Core": [false, false, false],
                "Delta Engine": [false, false, false],
                "Pulse Matrix": [false, false, false],
                "Boundary Shell": [false, false, false],
                "Power Field": [false, false, false],
                "Phase X Layer": [false, false, false],
            };

            await Promise.all(stages.map(async ({ endpoint, idx }) => {
                try {
                    const res = await fetch(`${SD_API_BASE}/${endpoint}`);
                    if (!res.ok) return;
                    const data = await res.json();
                    if (!data?.files) return;

                    for (const file of data.files) {
                        const tab = fileNameToTab(file.name);
                        if (tab && file.payload) {
                            newSources[tab][idx] = file.payload;
                            newStatus[tab][idx] = true;
                        }
                    }
                } catch (err) {
                    console.error(`SD API fetch error (${endpoint}):`, err);
                }
            }));

            if (!cancelled) {
                setSources(newSources);
                setUploadStatus(newStatus);
                setLastSystemUpdate(getLatestAPIInterval());
            }
        };

        fetchAll();

        // Calculate time until next fetch (exactly at MM:00:30, MM:05:30, MM:10:30, etc.)
        const scheduleNextFetch = () => {
            const now = new Date();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            // Next target minute is the next multiple of 5
            let targetMinute = Math.floor(minutes / 5) * 5;

            // If we are past the 30-second mark of the current 5-minute window, go to the next 5-minute window
            if (minutes % 5 !== 0 || seconds >= 30) {
                targetMinute += 5;
            }

            const targetDate = new Date(now);
            targetDate.setMinutes(targetMinute);
            targetDate.setSeconds(30);
            targetDate.setMilliseconds(0);

            const delayParams = targetDate.getTime() - now.getTime();

            return setTimeout(() => {
                if (!cancelled) {
                    fetchAll();
                    // Once synchronized, run exactly every 5 minutes
                    setInterval(fetchAll, 5 * 60 * 1000);
                }
            }, delayParams);
        };

        const initialTimeout = scheduleNextFetch();

        return () => {
            cancelled = true;
            clearTimeout(initialTimeout);
        };
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        const newSources = { ...sources };
        const newStatus = { ...uploadStatus };
        const readers: Promise<void>[] = [];

        files.forEach(file => {
            readers.push(new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const json = JSON.parse(event.target?.result as string);
                        const fileName = file.name.toLowerCase();

                        let targetTab: AnalysisTab | null = null;
                        if (fileName.includes("vector_core") || fileName.includes("vector-core")) targetTab = "Vector Core";
                        else if (fileName.includes("delta_engine") || fileName.includes("delta-engine")) targetTab = "Delta Engine";
                        else if (fileName.includes("pulse_matrix") || fileName.includes("pulse-matrix")) targetTab = "Pulse Matrix";
                        else if (fileName.includes("boundary_shell") || fileName.includes("boundary-shell")) targetTab = "Boundary Shell";
                        else if (fileName.includes("power_field") || fileName.includes("power-field")) targetTab = "Power Field";
                        else if (fileName.includes("vector")) targetTab = "Vector Core";
                        else if (fileName.includes("delta")) targetTab = "Delta Engine";
                        else if (fileName.includes("pulse")) targetTab = "Pulse Matrix";
                        else if (fileName.includes("boundary")) targetTab = "Boundary Shell";
                        else if (fileName.includes("power")) targetTab = "Power Field";

                        if (targetTab) {
                            if (!newSources[targetTab]) newSources[targetTab] = [null, null, null];
                            // Map index based on fast, medium, slow
                            let idx = 1; // Default medium
                            if (fileName.includes("fast")) idx = 0;
                            else if (fileName.includes("slow")) idx = 2;

                            newSources[targetTab][idx] = json;
                            newStatus[targetTab][idx] = true;
                        }
                    } catch (err) {
                        console.error("Error parsing JSON:", err);
                    }
                    resolve();
                };
                reader.readAsText(file);
            }));
        });

        Promise.all(readers).then(() => {
            setSources({ ...newSources });
            setUploadStatus({ ...newStatus });
            setLastSystemUpdate(Date.now());
        });
    };

    const resetSources = () => {
        setSources(defaultAnalysisSources);
        setUploadStatus({
            "Vector Core": [false, false, false],
            "Delta Engine": [false, false, false],
            "Pulse Matrix": [false, false, false],
            "Boundary Shell": [false, false, false],
            "Power Field": [false, false, false],
            "Phase X Layer": [false, false, false]
        });
    };

    const data = useMemo((): SymbolData => {
        const gs = layerData.globalScorePct / 100; // Global Score as decimal

        // Team DSR values (overall for each team)
        const dsrST = layerData.byTeam[0]?.overall.dsr ?? 0; // Short Term
        const dsrMT = layerData.byTeam[1]?.overall.dsr ?? 0; // Medium Term
        const dsrLT = layerData.byTeam[2]?.overall.dsr ?? 0; // Long Term

        // Primary Trend = based on Global Score
        const primaryTrend: TrendLabel = gs > 0.6 ? "Bullish" : gs > 0.2 ? "Bullish" : gs >= -0.2 ? "Neutral" : gs >= -0.6 ? "Bearish" : "Bearish";
        const primaryTrendFull = gs > 0.6 ? "Strong Uptrend" : gs > 0.2 ? "Bullish" : gs >= -0.2 ? "Neutral" : gs >= -0.6 ? "Bearish" : "Strong Downtrend";

        // Momentum State = based on Short Term DSR
        const momentumState = dsrST >= 0.6 ? "Strong" : dsrST >= 0.2 ? "Moderate" : dsrST <= -0.6 ? "Strong" : dsrST <= -0.2 ? "Moderate" : "Weak";

        // Structural Bias = based on Long Term DSR
        const structuralBias = dsrLT > 0 ? "Upward" : dsrLT < 0 ? "Downward" : "Neutral";

        // Reversal Risk = range of DSRs
        const rRange = Math.max(dsrST, dsrMT, dsrLT) - Math.min(dsrST, dsrMT, dsrLT);
        const reversalRisk = rRange < 0.2 ? "Low" : rRange < 0.5 ? "Moderate" : "High";

        // Phase = AVERAGE of overall team DSRs
        const phaseAvg = (dsrST + dsrMT + dsrLT) / 3;
        const p = phaseAvg > 0.5 ? "Directional" : phaseAvg >= 0.2 ? "Developing" : "Range";

        // Market Phase = uses Power Field and Delta Engine DSR per team
        const powerFieldData = layerData.byIndicator.find(b => b.indicator === "Power Field");
        const deltaEngineData = layerData.byIndicator.find(b => b.indicator === "Delta Engine");

        const deDsrST = deltaEngineData?.teams[0]?.dsr ?? 0;
        const deDsrMT = deltaEngineData?.teams[1]?.dsr ?? 0;
        const deDsrLT = deltaEngineData?.teams[2]?.dsr ?? 0;
        const deAvg = (deDsrST + deDsrMT + deDsrLT) / 3;
        const v = deAvg > 0.3 ? "Elevated" : deAvg >= 0.1 ? "Moderate" : "Low";

        const t = gs > 0.2 ? "Up" : gs < -0.2 ? "Down" : "Flat";

        let marketPhase: string;
        if (p === "Range") marketPhase = "Range";
        else if (p === "Directional" && v === "Elevated" && t === "Up") marketPhase = "Bullish Expansion";
        else if (p === "Directional" && v === "Elevated" && t === "Down") marketPhase = "Bearish Expansion";
        else if (p === "Directional" && v === "Low") marketPhase = "Compression";
        else marketPhase = "Transition";

        return {
            symbol: selectedSymbol,
            globalScore: gs,
            confidence: layerData.confidence,
            marketState: primaryTrendFull,
            phase: p,
            volatility: v,
            risk: reversalRisk,
            dominantLayer: [...layerData.byTeam].sort((a, b) => Math.abs(b.overall.dsr) - Math.abs(a.overall.dsr))[0].team,
            strength: Math.abs(gs),
            alignment: layerData.confidence > 70 ? "Strong" : "Medium",
            primaryTrend,
            layerSummary: {
                shortTerm: layerData.byTeam[0].overall.classification as TrendLabel,
                mediumTerm: layerData.byTeam[1].overall.classification as TrendLabel,
                longTerm: layerData.byTeam[2].overall.classification as TrendLabel
            },
            dynamics: {
                primaryTrend: primaryTrendFull as TrendLabel,
                momentumState,
                structuralBias,
                marketPhase,
                reversalRisk
            }
        };
    }, [selectedSymbol, layerData]);

    const bullish = data.globalScore >= 0;

    const accent = data.marketState === "Strong Uptrend" ? "#00c853"
        : data.marketState === "Bullish" ? "#00e676"
            : data.marketState === "Neutral" ? "#ffc400"
                : data.marketState === "Bearish" ? "#ff6d00"
                    : "#ff1744"; // Strong Downtrend

    const accentG = data.marketState === "Strong Uptrend" ? "rgba(0,200,83,"
        : data.marketState === "Bullish" ? "rgba(0,230,118,"
            : data.marketState === "Neutral" ? "rgba(255,196,0,"
                : data.marketState === "Bearish" ? "rgba(255,109,0,"
                    : "rgba(255,23,68,";

    // Confidence color - expressive (5 levels)
    const confColor = data.confidence >= 85 ? "#00e5ff"    // Very High - bright cyan
        : data.confidence >= 70 ? "#448aff"               // High - electric blue
            : data.confidence >= 55 ? "#26c6da"               // Good - teal
                : data.confidence >= 40 ? "#ffab00"               // Medium - amber
                    : "#ff6e40";                                       // Low - warm orange-red
    const confColorG = data.confidence >= 85 ? "rgba(0,229,255,"
        : data.confidence >= 70 ? "rgba(68,138,255,"
            : data.confidence >= 55 ? "rgba(38,198,218,"
                : data.confidence >= 40 ? "rgba(255,171,0,"
                    : "rgba(255,110,64,";

    const handleCategoryChange = (cat: MarketCategory) => {
        setSelectedCategory(cat);

        const cd = marketCategories.find(c => c.name === cat);
        if (cd?.symbols.length) setSelectedSymbol(cd.symbols[0]);
    };
    return (
        <div className="min-h-screen text-gray-300 overflow-hidden" dir={isRTL ? "rtl" : "ltr"}
            style={{ background: "#060a10", fontFamily: "'Inter', system-ui, sans-serif" }}>
            {/* Ambient */}
            <div className="fixed inset-0 pointer-events-none" style={{
                background: `radial-gradient(ellipse 50% 40% at 70% 20%, ${accentG}0.06) 0%, transparent 70%),
radial-gradient(ellipse 30% 50% at 20% 80%, ${accentG}0.03) 0%, transparent 60%)`,
            }} />
            <ScanLine color={accent} />
            <div className="fixed inset-0 pointer-events-none opacity-[0.015]" style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
            }} />
            {/* ═══ HEADER ═══ */}
            <header className="relative z-30 border-b" style={{ background: "rgba(6,10,16,0.88)", backdropFilter: "blur(30px) saturate(200%)", borderColor: "rgba(255,255,255,0.04)" }}>
                <div className="max-w-[1700px] mx-auto px-5 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/5 transition-all group">
                            <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-300" />
                        </button>
                        <motion.span animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}
                            className="text-xl font-black" style={{ color: accent }}>»</motion.span>
                        <span className="text-[16px] font-bold tracking-wide">
                            <span style={{ color: accent }}>PHASE X</span>
                            <span className="text-gray-700 mx-1.5">—</span>
                            <span className="text-gray-500 font-medium">{t.title}</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">


                        <div className="flex items-center gap-1">
                            {/* Data Status Indicator */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.05] mr-2">
                                {indicatorTabs.map(tab => (
                                    <div key={tab} className="flex flex-col gap-1 items-center">
                                        <div className="text-[6px] text-gray-600 uppercase font-black">{tab.split(' ')[0]}</div>
                                        <div className="flex gap-0.5">
                                            {uploadStatus[tab as AnalysisTab]?.map((loaded, i) => (
                                                <motion.div
                                                    key={i}
                                                    className={`w-1.5 h-1.5 rounded-full ${loaded ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-gray-800'}`}
                                                    animate={loaded ? { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] } : {}}
                                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <label className="p-1.5 rounded-lg hover:bg-white/5 cursor-pointer title-none" title={isRTL ? "رفع البيانات" : "Upload Dataset"}>
                                <Upload className="w-3.5 h-3.5 text-gray-600" />
                                <input type="file" multiple accept=".json" onChange={handleFileUpload} className="hidden" />
                            </label>
                            <button onClick={resetSources} className="p-1.5 rounded-lg hover:bg-white/5" title="Reset to Defaults">
                                <RotateCcw className="w-3.5 h-3.5 text-gray-600" />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-white/5"><Settings className="w-3.5 h-3.5 text-gray-600" /></button>
                            <motion.button className="p-1.5 rounded-lg hover:bg-white/5" whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                                <RefreshCw className="w-3.5 h-3.5 text-gray-600" /></motion.button>
                        </div>
                    </div>
                </div>
            </header>
            {/* ═══ BODY ═══ */}
            <div className="relative z-10 max-w-[1700px] mx-auto px-5 -mt-2">
                {/* BANNER with Gauge — F1 Racing Level */}
                <motion.div className="rounded-2xl mb-2 relative overflow-hidden"
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

                    {/* Racing Effects Stack */}
                    <HeatHaze color={accent} />
                    <EnergyWaves color={accent} />
                    <SpeedStreaks color={accent} />
                    <RacingParticles color={accent} />
                    <LEDBorderPulse color={accent} />

                    {/* Confidence Visual Indicators — floating orbs */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                        {[15, 35, 55, 75, 90].map((pos, i) => (
                            <motion.div
                                key={`conf-orb-${i}`}
                                className="absolute rounded-full"
                                style={{
                                    left: `${pos}%`,
                                    top: `${10 + i * 18}%`,
                                    width: 6 + i * 2,
                                    height: 6 + i * 2,
                                    background: `radial-gradient(circle, ${confColor} 0%, transparent 70%)`,
                                    boxShadow: `0 0 ${12 + i * 4}px ${confColor}, 0 0 ${20 + i * 6}px ${confColorG}0.3)`,
                                }}
                                animate={{
                                    y: [0, -15 - i * 5, 0],
                                    opacity: [0.3, 0.9, 0.3],
                                    scale: [0.8, 1.3, 0.8],
                                }}
                                transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                            />
                        ))}
                        {/* Confidence horizontal line */}
                        <motion.div
                            className="absolute h-[1px] z-10"
                            style={{
                                top: "85%",
                                background: `linear-gradient(90deg, transparent 5%, ${confColor} 30%, ${confColor} 70%, transparent 95%)`,
                                boxShadow: `0 0 8px ${confColor}`,
                            }}
                            animate={{
                                left: ["-20%", "120%"],
                                opacity: [0, 0.7, 0],
                                width: ["20%", "35%", "20%"],
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 0.8 }}
                        />
                    </div>

                    {/* Double Scanning Beam */}
                    <motion.div
                        className="absolute top-0 bottom-0 w-32 z-10 pointer-events-none"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${accentG}0.2), ${accentG}0.05), transparent)`,
                            boxShadow: `0 0 40px ${accentG}0.15)`
                        }}
                        animate={{ left: ["-15%", "115%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute top-0 bottom-0 w-16 z-10 pointer-events-none"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${accentG}0.12), transparent)`,
                        }}
                        animate={{ left: ["-10%", "110%"] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "linear", delay: 1.5 }}
                    />

                    <div className="flex items-center relative z-20" style={{
                        background: `linear-gradient(135deg, rgba(8,12,20,0.75) 0%, rgba(10,16,26,0.7) 40%, rgba(8,12,20,0.6) 100%)`,
                        borderRadius: "16px",
                    }}>

                        <div className="flex-1 px-8 py-1">
                            <div className="text-[13px] text-gray-600 tracking-[0.25em] uppercase mt-3 mb-1 font-semibold flex items-center gap-3">
                                <motion.div className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: accent }}
                                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8], boxShadow: [`0 0 4px ${accent}`, `0 0 12px ${accent}`, `0 0 4px ${accent}`] }}
                                    transition={{ duration: 1.2, repeat: Infinity }} />
                                <motion.span
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}>
                                    {t.globalState}
                                </motion.span>
                            </div>

                            <motion.h2 className="text-[48px] font-black tracking-tight mb-0 leading-none"
                                style={{ color: accent, fontStyle: "italic" }}
                                animate={{
                                    textShadow: [
                                        `0 0 20px ${accentG}0.3), 0 0 60px ${accentG}0.15)`,
                                        `0 0 40px ${accentG}0.6), 0 0 100px ${accentG}0.25)`,
                                        `0 0 20px ${accentG}0.3), 0 0 60px ${accentG}0.15)`,
                                    ],
                                    scale: [1, 1.015, 1]
                                }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
                                {isRTL ? (trendAr[data.marketState] || data.marketState) : data.marketState}
                            </motion.h2>

                            {/* ═══ Top Cluster: Clocks + Currency Badge ═══ */}
                            <div className="-mt-6 flex justify-center items-center gap-8 mb-4 w-full relative z-30" style={{ paddingLeft: '150px' }}>
                                {/* LEFT CLOCK: Last Update */}
                                <SciFiClock
                                    isLive={true}
                                    label={isRTL ? "اخر ابديت" : "LAST UPDATE"}
                                    timeMs={lastSystemUpdate}
                                    isRTL={isRTL}
                                    mode="lastUpdate"
                                    accent={accent}
                                />

                                {(() => {
                                    const info = symbolIcons[selectedSymbol] || { icon: "📈", label: selectedSymbol, labelAr: selectedSymbol };
                                    return (
                                        <motion.div className="text-center relative flex flex-col items-center justify-center min-w-[140px] px-2"
                                            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                            key={selectedSymbol}>
                                            <motion.div className="absolute inset-0 z-0 pointer-events-none rounded-full"
                                                style={{ background: `radial-gradient(circle at 50% 50%, ${accent}25 0%, transparent 60%)`, filter: "blur(12px)" }}
                                                animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
                                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            />
                                            <motion.span className="text-[3.5rem] leading-none block mb-1 relative z-10"
                                                style={{ filter: `drop-shadow(0 4px 15px ${accent}60)` }}
                                                animate={{ y: [0, -6, 0] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                                                {info.icon}
                                            </motion.span>
                                            <motion.div className="text-[22px] font-black tracking-[0.1em] relative z-10 uppercase mt-1"
                                                style={{ color: "#fff", textShadow: `0 0 15px ${accent}80, 0 0 30px ${accent}40` }}
                                                animate={{ opacity: [0.8, 1, 0.8] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                                                {isRTL ? info.labelAr : info.label}
                                            </motion.div>
                                            <div className="text-[12px] font-mono font-bold mt-0.5 tracking-widest relative z-10" style={{ color: accent, opacity: 0.8 }}>{selectedSymbol}</div>
                                        </motion.div>
                                    );
                                })()}

                                {/* RIGHT CLOCK: Current Time */}
                                <SciFiClock
                                    isLive={true}
                                    label={isRTL ? "الوقت الحالي" : "CURRENT TIME"}
                                    isRTL={isRTL}
                                    mode="currentTime"
                                />
                            </div>

                            {/* ═══ Pyramid Row 1 — Phase, Volatility, Risk ═══ */}
                            <div className="flex items-center justify-center gap-3 text-[15px] flex-wrap" style={{ paddingLeft: '150px' }}>
                                {[
                                    { k: t.phase, va: tv(data.phase), c: data.phase === "Directional" ? "#00e676" : data.phase === "Developing" ? "#ffc400" : "#ff1744" },
                                    { k: t.volatility, va: tv(data.volatility), c: data.volatility === "Elevated" ? "#ff1744" : data.volatility === "Moderate" ? "#ffc400" : "#00e676" },
                                    { k: t.risk, va: tv(data.risk), c: data.risk === "Low" ? "#00e676" : data.risk === "Moderate" ? "#ffc400" : "#ff1744" },
                                ].map((x, i) => (
                                    <motion.div key={i} className="flex items-center gap-2.5 px-5 py-3 rounded-xl relative overflow-hidden"
                                        style={{
                                            background: `linear-gradient(135deg, ${x.c}15 0%, ${x.c}08 100%)`,
                                            border: `1px solid ${x.c}35`,
                                            boxShadow: `0 0 15px ${x.c}12, inset 0 0 12px ${x.c}08`,
                                        }}
                                        whileHover={{ scale: 1.06, boxShadow: `0 0 25px ${x.c}25, inset 0 0 15px ${x.c}12` }}
                                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                        <motion.div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: x.c, boxShadow: `0 0 8px ${x.c}` }}
                                            animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} />
                                        <span className="text-gray-400 font-semibold text-[14px]">{x.k}:</span>
                                        <span className="font-black tracking-wide text-[16px]" style={{ color: x.c }}>{x.va}</span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* ═══ Pyramid Layout: Row 2 — Trend, Momentum, Bias, Reversal ═══ */}
                            <div className="mt-1 flex items-center justify-center gap-3 text-[15px] flex-wrap" style={{ paddingLeft: '150px' }}>
                                {[
                                    { k: t.trend, v: data.dynamics.primaryTrend },
                                    { k: t.momentum, v: data.dynamics.momentumState },
                                    { k: t.bias, v: data.dynamics.structuralBias },
                                    { k: t.reversal, v: data.dynamics.reversalRisk },
                                ].map((x, i) => {
                                    const c = getTrendColor(x.v);
                                    return (
                                        <motion.div key={i} className="flex items-center gap-2.5 px-5 py-3 rounded-xl relative overflow-hidden"
                                            style={{
                                                background: `linear-gradient(135deg, ${c}15 0%, ${c}08 100%)`,
                                                border: `1px solid ${c}35`,
                                                boxShadow: `0 0 15px ${c}12, inset 0 0 12px ${c}08`,
                                            }}
                                            whileHover={{ scale: 1.06, boxShadow: `0 0 25px ${c}25, inset 0 0 15px ${c}12` }}
                                            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1 }}>
                                            <motion.div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: c, boxShadow: `0 0 8px ${c}` }}
                                                animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
                                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} />
                                            <span className="text-gray-400 font-semibold text-[14px]">{x.k}:</span>
                                            <span className="font-black tracking-wide text-[16px]" style={{ color: c }}>{tv(x.v)}</span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex-shrink-0 pr-6 relative">
                            <div className="flex items-center gap-4">
                                {/* Score & Confidence Numbers */}
                                <div className="flex flex-col gap-3 items-end">
                                    <motion.div className="text-center px-4 py-2.5 rounded-xl relative overflow-hidden"
                                        style={{ background: `${confColorG}0.08)`, border: `1px solid ${confColorG}0.2)` }}
                                        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                                        {/* Confidence glow pulse */}
                                        <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
                                            style={{ background: `radial-gradient(circle at 50% 50%, ${confColorG}0.12) 0%, transparent 70%)` }}
                                            animate={{ opacity: [0.3, 0.8, 0.3] }}
                                            transition={{ duration: 2.5, repeat: Infinity }} />
                                        <div className="text-[9px] tracking-widest uppercase mb-1 font-semibold relative z-10" style={{ color: confColor }}>{t.confidence}</div>
                                        <motion.div className="text-[22px] font-black tabular-nums relative z-10" style={{ color: confColor }}
                                            animate={{ textShadow: [`0 0 8px ${confColorG}0.3)`, `0 0 20px ${confColorG}0.6)`, `0 0 8px ${confColorG}0.3)`] }}
                                            transition={{ duration: 2, repeat: Infinity }}>
                                            {data.confidence}%
                                        </motion.div>
                                        {/* Confidence level dots */}
                                        <div className="flex justify-center gap-1 mt-1 relative z-10">
                                            {[0, 1, 2, 3, 4].map(i => {
                                                const activeDots = data.confidence >= 85 ? 5 : data.confidence >= 70 ? 4 : data.confidence >= 55 ? 3 : data.confidence >= 40 ? 2 : 1;
                                                return (
                                                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                                                        style={{ backgroundColor: i < activeDots ? confColor : "rgba(255,255,255,0.08)" }}
                                                        animate={i < activeDots ? { opacity: [0.5, 1, 0.5], scale: [0.9, 1.2, 0.9] } : {}}
                                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }} />
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                </div>
                                {/* Gauge */}
                                <SupercarGauge score={data.globalScore} confidence={data.confidence} isRTL={isRTL} />
                            </div>
                        </div>

                    </div>
                </motion.div>
                {/* ═══ MARKET FILTER ═══ */}
                <div className="mb-3">
                    <motion.button onClick={() => setFilterOpen(!filterOpen)}
                        className="flex items-center gap-3 mb-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all"
                        style={{
                            background: filterOpen ? `${accentG}0.08)` : 'rgba(255,255,255,0.03)',
                            border: filterOpen ? `1px solid ${accentG}0.2)` : '1px solid rgba(255,255,255,0.06)',
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}>
                        <Activity className="w-4 h-4" style={{ color: filterOpen ? accent : '#6b7280' }} />
                        <span className="text-[12px] tracking-[0.15em] uppercase font-bold" style={{ color: filterOpen ? accent : '#6b7280' }}>{t.marketFilter}</span>
                        <motion.div animate={{ rotate: filterOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                            <ChevronDown className="w-4 h-4" style={{ color: filterOpen ? accent : '#6b7280' }} />
                        </motion.div>
                    </motion.button>
                    <AnimatePresence>
                        {filterOpen && (
                            <motion.div className="flex items-center gap-2"
                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}>
                                {marketCategories.map(cat => {
                                    const isActive = selectedCategory === cat.name;
                                    return (
                                        <motion.button key={cat.name} onClick={() => handleCategoryChange(cat.name)}
                                            className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all overflow-hidden"
                                            style={{
                                                background: isActive
                                                    ? `linear-gradient(135deg, ${accentG}0.15) 0%, ${accentG}0.05) 100%)`
                                                    : "rgba(255,255,255,0.015)",
                                                border: isActive ? `1px solid ${accentG}0.3)` : "1px solid rgba(255,255,255,0.04)",
                                                boxShadow: isActive ? `0 4px 25px ${accentG}0.12), 0 0 40px ${accentG}0.05), inset 0 1px 0 rgba(255,255,255,0.08)` : "none",
                                            }}
                                            whileHover={{ scale: 1.06, y: -2, boxShadow: `0 6px 30px ${accentG}0.15)` }}
                                            whileTap={{ scale: 0.95 }}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                                            {/* Racing glow pulse for active */}
                                            {isActive && (
                                                <>
                                                    <motion.div className="absolute inset-0 pointer-events-none"
                                                        style={{ background: `radial-gradient(circle at 50% 100%, ${accentG}0.15) 0%, transparent 60%)` }}
                                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                                        transition={{ duration: 1.5, repeat: Infinity }} />
                                                    <motion.div className="absolute inset-0 pointer-events-none"
                                                        style={{ background: `linear-gradient(90deg, transparent, ${accentG}0.08), transparent)` }}
                                                        animate={{ x: ["-100%", "200%"] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                                                </>
                                            )}
                                            <motion.span className="text-lg relative z-10"
                                                animate={isActive ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
                                                transition={{ duration: 2, repeat: Infinity }}>{cat.icon}</motion.span>
                                            <div className="relative z-10">
                                                <div className="text-[12px] font-bold" style={{ color: isActive ? accent : "#6b7280" }}>{isRTL ? cat.nameAr : cat.name}</div>
                                            </div>
                                            {isActive && (
                                                <motion.div className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full"
                                                    layoutId="marketFilter"
                                                    style={{ background: `linear-gradient(90deg, transparent, ${accent}, ${accent}, transparent)` }}
                                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ═══ SYMBOL SELECTOR STRIP ═══ */}
                <AnimatePresence mode="wait">
                    {filterOpen && (
                        <motion.div key={selectedCategory}
                            className="mb-4 flex items-center gap-2 flex-wrap"
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35 }}>
                            {(() => {
                                const cat = marketCategories.find(c => c.name === selectedCategory);
                                if (!cat?.symbols.length) return null;

                                // Only show symbols that have data in at least one tab of the loaded sources
                                const availableSymbols = cat.symbols.filter(sym => {
                                    // Default data always has info, but we only want to show it if there's real API data available
                                    // Check if the symbol exists in the actual 'sources' object
                                    const jsonKey = symbolToJsonKey[sym];
                                    if (!jsonKey) return false;

                                    // Check if ANY tab has data for this jsonKey
                                    for (const tab in sources) {
                                        for (const stageData of sources[tab as AnalysisTab]) {
                                            if (stageData && stageData[jsonKey]) {
                                                return true; // Found actual data from API JSON
                                            }
                                        }
                                    }
                                    return false; // No real API data loaded yet for this symbol
                                });

                                if (!availableSymbols.length) return (
                                    <div className="text-gray-500 text-sm px-4 py-2 italic">
                                        {isRTL ? "جاري تحميل البيانات..." : "Loading data or no symbols available in JSON..."}
                                    </div>
                                );

                                return availableSymbols.map((sym, si) => {
                                    const info = symbolIcons[sym] || { icon: "📈", label: sym, labelAr: sym };
                                    const isActive = selectedSymbol === sym;
                                    const symData = symbolsData[sym];
                                    const symBullish = symData ? symData.globalScore >= 0 : true;
                                    const symColor = symBullish ? "#00e676" : "#ff1744";
                                    return (
                                        <motion.button key={sym} onClick={() => { setSelectedSymbol(sym); setFilterOpen(false); }}
                                            className="relative flex items-center gap-3 px-5 py-3 rounded-xl overflow-hidden"
                                            style={{
                                                background: isActive
                                                    ? `linear-gradient(135deg, ${symBullish ? 'rgba(0,230,118,' : 'rgba(255,23,68,'}0.12) 0%, rgba(10,16,26,0.9) 100%)`
                                                    : "rgba(255,255,255,0.02)",
                                                border: isActive ? `1px solid ${symColor}40` : "1px solid rgba(255,255,255,0.05)",
                                                boxShadow: isActive ? `0 4px 25px ${symColor}15, inset 0 1px 0 rgba(255,255,255,0.05)` : "none",
                                            }}
                                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                            transition={{ delay: si * 0.08, type: "spring", stiffness: 300, damping: 25 }}
                                            whileHover={{ scale: 1.06, y: -2 }}
                                            whileTap={{ scale: 0.95 }}>
                                            {/* Active shimmer */}
                                            {isActive && (
                                                <motion.div className="absolute inset-0 pointer-events-none"
                                                    style={{ background: `linear-gradient(90deg, transparent 20%, ${symColor}10 50%, transparent 80%)` }}
                                                    animate={{ x: ["-100%", "200%"] }}
                                                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} />
                                            )}
                                            {/* Icon */}
                                            <motion.span className="text-2xl relative z-10"
                                                animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                                                transition={{ duration: 1.5, repeat: Infinity }}>
                                                {info.icon}
                                            </motion.span>
                                            {/* Label + Mini Score */}
                                            <div className="relative z-10">
                                                <div className="text-[12px] font-bold" style={{ color: isActive ? "#fff" : "#9ca3af" }}>
                                                    {isRTL ? info.labelAr : info.label}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-mono" style={{ color: "#6b7280" }}>{sym}</span>
                                                    {symData && (
                                                        <motion.span className="text-[10px] font-black" style={{ color: symColor }}
                                                            animate={isActive ? { textShadow: [`0 0 4px ${symColor}40`, `0 0 10px ${symColor}60`, `0 0 4px ${symColor}40`] } : {}}
                                                            transition={{ duration: 2, repeat: Infinity }}>
                                                            {symData.globalScore > 0 ? "+" : ""}{symData.globalScore.toFixed(2)}
                                                        </motion.span>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Flag pair for forex */}
                                            {info.flag && (
                                                <span className="text-sm relative z-10 opacity-60">{info.flag}</span>
                                            )}
                                            {/* Active bottom LED */}
                                            {isActive && (
                                                <motion.div className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full z-20"
                                                    layoutId="symbolGlow"
                                                    style={{ background: `linear-gradient(90deg, transparent, ${symColor}, transparent)` }}
                                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                                            )}
                                        </motion.button>
                                    );
                                });
                            })()}
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* ═══ ANALYSIS TABS (separate layer) ═══ */}
                <div className="mb-4">
                    <div className="h-px w-full mb-3" style={{ background: `linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.04) 70%, transparent 95%)` }} />
                    <div className="flex items-center gap-1.5">
                        {analysisTabs.map(tab => {

                            const isActive = selectedTab === tab;
                            return (
                                <motion.button key={tab} onClick={() => setSelectedTab(tab)}
                                    className="relative px-4 py-2.5 text-[11px] font-bold tracking-wider rounded-xl transition-all flex items-center gap-2 overflow-hidden"
                                    style={{
                                        color: isActive ? accent : "#4b5563",
                                        background: isActive ? `${accent}12` : "rgba(255,255,255,0.01)",
                                        border: isActive ? `1px solid ${accent}30` : "1px solid rgba(255,255,255,0.03)",
                                        boxShadow: isActive ? `0 4px 20px ${accentG}0.1), 0 0 30px ${accentG}0.04)` : "none",
                                    }}
                                    whileHover={{ y: -2, scale: 1.04, boxShadow: `0 4px 20px ${accentG}0.08)` }}
                                    whileTap={{ scale: 0.94 }}>
                                    {/* Tab Racing Shimmer */}
                                    {isActive && (
                                        <motion.div className="absolute inset-0 pointer-events-none"
                                            style={{ background: `linear-gradient(90deg, transparent 30%, ${accentG}0.1) 50%, transparent 70%)` }}
                                            animate={{ x: ["-100%", "200%"] }}
                                            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} />
                                    )}
                                    <motion.span className="text-sm relative z-10"
                                        animate={isActive ? { rotate: [0, 12, -12, 0], scale: [1, 1.2, 1] } : {}}
                                        transition={{ duration: 2, repeat: Infinity }}>
                                        {analysisTabIcons[tab]}
                                    </motion.span>
                                    <span className="relative z-10">{isRTL ? analysisTabsAr[tab] : tab}</span>
                                    {isActive && (
                                        <motion.div layoutId="tabGlow" className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full"
                                            style={{ background: `linear-gradient(90deg, transparent, ${accent}, ${accent}, transparent)` }}
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }} />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* ═══ ANALYSIS TABLE + SIDEBAR ═══ */}
            <AnimatePresence mode="wait">
                <motion.div key={selectedTab + selectedSymbol}
                    initial={{ opacity: 0, y: 30, scale: 0.97, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, scale: 0.98, filter: "blur(4px)" }}
                    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }} className="pb-8">
                    {selectedTab === "Phase X Layer" ? (
                        <DynamicLayerTable symbol={selectedSymbol} isRTL={isRTL} sources={sources} />
                    ) : (
                        <div className="grid grid-cols-12 gap-4">
                            {/* Main Table — 9 cols */}
                            <div className="col-span-9">
                                <AnalysisTable
                                    tab={selectedTab}
                                    symbol={selectedSymbol}
                                    isRTL={isRTL}
                                    sources={sources}
                                />
                            </div>
                            {/* Sidebar — 3 cols */}
                            <div className="col-span-3 space-y-4">
                                {/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Layer Summary Panel ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */}
                                <Panel accent={`${accentG}0.05)`}>
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[13px] font-black text-white tracking-wider uppercase">{t.layerSummary}</span>
                                            <ChevronRight className="w-4 h-4 text-gray-700" />
                                        </div>
                                        <div className="space-y-2">
                                            {[
                                                { l: t.shortTerm, v: data.layerSummary.shortTerm },
                                                { l: t.mediumTerm, v: data.layerSummary.mediumTerm },
                                                { l: t.longTerm, v: data.layerSummary.longTerm },
                                            ].map((x, i) => (
                                                <motion.div key={i} className="flex items-center justify-between py-3 px-4 rounded-xl"
                                                    style={{ background: "rgba(255,255,255,0.015)" }}
                                                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.2 + i * 0.08 }}
                                                    whileHover={{ background: "rgba(255,255,255,0.03)", x: 3 }}>
                                                    <span className="text-[12px] text-gray-400">{x.l}</span>
                                                    <motion.span className="text-[14px] font-bold" style={{ color: getTrendColor(x.v) }}
                                                        animate={{ textShadow: [`0 0 6px ${getTrendColor(x.v)}25`, `0 0 14px ${getTrendColor(x.v)}50`, `0 0 6px ${getTrendColor(x.v)}25`] }}
                                                        transition={{ duration: 2.5, repeat: Infinity }}>
                                                        {tv(x.v)}
                                                    </motion.span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </Panel>
                                {/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Phase X Dynamics Output ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */}
                                <Panel accent={`${accentG}0.05)`}>
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[12px] font-black text-white tracking-wider uppercase">{t.dynamicsOutput}</span>
                                            <ChevronRight className="w-4 h-4 text-gray-700" />
                                        </div>
                                        <div className="space-y-2.5">
                                            {[
                                                { l: t.primaryTrend, v: data.dynamics.primaryTrend },
                                                { l: t.momentumState, v: data.dynamics.momentumState },
                                                { l: t.structuralBias, v: data.dynamics.structuralBias },
                                                { l: t.marketPhase, v: data.dynamics.marketPhase },
                                                { l: t.reversalRisk, v: data.dynamics.reversalRisk },
                                            ].map((x, i) => (
                                                <motion.div key={i} className="flex items-center justify-between py-2 px-1"
                                                    initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.3 + i * 0.07 }}
                                                    whileHover={{ x: 3 }}>
                                                    <span className="text-[11px] text-gray-600">{x.l}</span>
                                                    <motion.span className="text-[13px] font-bold" style={{ color: getTrendColor(x.v) }}
                                                        animate={{ textShadow: [`0 0 6px ${getTrendColor(x.v)}20`, `0 0 12px ${getTrendColor(x.v)}45`, `0 0 6px ${getTrendColor(x.v)}20`] }}
                                                        transition={{ duration: 2.5, repeat: Infinity }}>
                                                        {tv(x.v)}
                                                    </motion.span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </Panel>
                                {/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Strength & Alignment Mini Panel ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */}
                                <Panel>
                                    <div className="p-5">
                                        <div className="mb-3">
                                            <div className="flex justify-between mb-1.5">
                                                <span className="text-[11px] text-gray-600 tracking-wide uppercase font-semibold">{t.strength}</span>
                                                <span className="text-[14px] font-black" style={{ color: accent }}>{data.strength > 0 ? "+" : ""}{data.strength.toFixed(2)}</span>
                                            </div>
                                            <div className="h-[6px] rounded-full overflow-hidden relative" style={{ background: "#0c1018" }}>
                                                <motion.div className="h-full rounded-full" style={{ backgroundColor: accent }}
                                                    initial={{ width: 0 }} animate={{ width: `${((data.strength + 1) / 2) * 100}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }} />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] text-gray-600 tracking-wide uppercase font-semibold">{t.alignment}</span>
                                            <div className="flex items-center gap-1.5">
                                                <div className="flex gap-[3px]">
                                                    {[...Array(5)].map((_, i) => {

                                                        const fill = i < (data.alignment === "Strong" ? 5 : data.alignment === "Medium" ? 3 : 1);
                                                        return <motion.div key={i} className="w-[7px] h-[7px] rounded-full"
                                                            style={{ backgroundColor: fill ? accent : "#111a28" }}
                                                            animate={fill ? { boxShadow: [`0 0 3px ${accent}50`, `0 0 8px ${accent}70`, `0 0 3px ${accent}50`] } : {}}
                                                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.12 }} />;
                                                    })}
                                                </div>
                                                <span className="text-[13px] font-bold" style={{ color: accent }}>{tv(data.alignment)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Panel>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}