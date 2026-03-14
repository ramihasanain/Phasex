import { useState, useEffect, useRef, useMemo } from "react";

import { motion, AnimatePresence } from "motion/react";

import { ArrowLeft, ChevronDown, ChevronRight, Settings, RefreshCw, TrendingUp, TrendingDown, Activity, Zap, Upload, RotateCcw, Target, Cpu, Activity as Pulse, Shield, Flame, Layers, Bot, X, RadioTower } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useThemeTokens } from "../hooks/useThemeTokens";
import type { VCRow } from "./phase-x/types";
import { SciFiClock } from "./SciFiClock";
import { BreakingNews } from "./BreakingNews";
import { PhaseXBotIcon } from "./phase-x/PhaseXBotIcon";
import { Panel, ScanLine, SignalCell, SupercarGauge } from "./phase-x/UIComponents";
import { getAIMarketInsightText } from "./phase-x/aiMarketInsightLogic";

interface PhaseXDynamicsPageProps {
    onBack: () => void;
}

import type { MarketCategory, AnalysisTab, Signal, TrendLabel, SymbolData } from "./phase-x/types";

import { symbolsData } from "./phase-x/symbolsData";
import { marketCategories, symbolIcons } from "./phase-x/marketCategories";
import { SpeedStreaks, EnergyWaves, RacingParticles, LEDBorderPulse, HeatHaze } from "./phase-x/CinematicEffects";






















































import {
    analysisTabs,
    analysisTabsAr,
    analysisTabIcons,
    tfColumns,
    vcTfColumns,
    vcTfLabels,
    symbolToJsonKey,
    defaultAnalysisSources,
    trendAr,
    trendRu,
    trendTr,
    trendFr,
    trendEs,
    i18n
} from "./phase-x/constants";

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
        "Decision Engine": "DX",
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


/* ═══════════ Glass Panel ═══════════ */


/* ═══════════ Scanning line ═══════════ */


/* ═══════════ Animated Buy/Sell Cell ═══════════ */


/* ═══════════ Analysis Data Table ═══════════ */

function AnalysisTable({ tab, symbol, isRTL, sources }: { tab: AnalysisTab; symbol: string; isRTL: boolean; sources: Record<AnalysisTab, any[]> }) {
    const { language, t: globalT } = useLanguage();
    const tk = useThemeTokens();
    const d = tk.isDark;
    const lang = ["ar", "ru", "tr", "fr", "es"].includes(language) ? language : "en";
    const data = getTabData(tab, symbol, sources);
    const displayRows = data.rows;
    const displayTfCols = vcTfLabels;
    const displayColTotals = data.colTotals;
    const displayColClassifications = data.colClassifications;
    const displayOverallTotal = data.overallTotal;
    const displayOverallClass = data.overallClass;

    const t = i18n[lang];
    const accentColor = displayOverallTotal >= 0 ? (d ? "#00e676" : "#16a34a") : (d ? "#ff1744" : "#dc2626");
    const accentGlow = displayOverallTotal >= 0 ? (d ? "rgba(0,230,118,0.04)" : "rgba(22,163,74,0.03)") : (d ? "rgba(255,23,68,0.04)" : "rgba(220,38,38,0.03)");
    const tableBg = d ? "rgba(10,16,28,0.98)" : tk.surfaceElevated;
    const borderC = d ? "rgba(255,255,255,0.05)" : tk.border;
    const cellBorderC = d ? "rgba(255,255,255,0.03)" : tk.border;

    const tvTab = (v: string) => {
        switch(v) {
            case "Vector Core": return t.vectorCore;
            case "Delta Engine": return t.deltaEngine;
            case "Pulse Matrix": return t.pulseMatrix;
            case "Boundary Shell": return t.boundaryShell;
            case "Power Field": return t.powerField;
            case "Phase X Layer": return t.phaseXLayer;
            case "Decision Engine": return t.decisionEngine;
            default: return v;
        }
    };

    const tv = (v: string) => lang === "ar" ? (trendAr[v] || v) : lang === "ru" ? (trendRu[v] || v) : lang === "tr" ? (trendTr[v] || v) : v;

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
                        <span className="text-[14px] font-black tracking-wider uppercase" style={{ color: tk.textPrimary }} dir="auto">
                            {tvTab(tab)}
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
                <div ref={tableRef} className="rounded-xl" style={{ border: `1px solid ${borderC}` }}>
                    <table className="w-full border-collapse">
                        <thead className="sticky top-0 z-10">
                            <tr style={{ background: tableBg }}>
                                <th className="text-left text-[11px] font-bold py-2 px-3 border-r border-b sticky left-0 z-20"
                                    style={{ background: tableBg, borderColor: borderC, minWidth: "78px", color: tk.textMuted }}>
                                    {data.paramLabel}
                                </th>
                                {displayTfCols.map(tf => (
                                    <th key={tf} className="text-center text-[10px] font-bold py-2 px-1 border-r border-b tracking-wider"
                                        style={{ borderColor: borderC, minWidth: "52px", color: tk.textDim }}>
                                        {tf}
                                    </th>
                                ))}
                                <th className="text-center text-[10px] font-bold py-2 px-2 border-r border-b tracking-wider"
                                    style={{ borderColor: borderC, minWidth: "55px", color: d ? '#fbbf24' : '#d97706' }}>{t.total}</th>
                                <th className="text-center text-[10px] font-bold py-2 px-2 border-b tracking-wider"
                                    style={{ borderColor: borderC, minWidth: "110px", color: d ? '#22d3ee' : '#0891b2' }}>{t.classification}</th>
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
                                    <td className="text-[11px] font-semibold py-[5px] px-3 border-r border-b sticky left-0"
                                        style={{ background: tableBg, borderColor: cellBorderC, color: tk.textMuted }}>
                                        {row.param}
                                    </td>
                                    {row.signals.map((sig: Signal, ci: number) => (
                                        <SignalCell key={ci} signal={sig} rowIdx={ri} colIdx={ci} />
                                    ))}
                                    <td className="text-center text-[11px] font-black py-[5px] px-2 border-r border-b"
                                        style={{ color: getTotalColor(row.total), borderColor: cellBorderC, background: `${getTotalColor(row.total)}08` }}>
                                        {row.total}%
                                    </td>
                                    <td className="text-center text-[10px] font-bold py-[5px] px-2 border-b"
                                        style={{ color: getClassColor(row.classification), borderColor: cellBorderC }}>
                                        {tv(row.classification)}
                                    </td>
                                </motion.tr>
                            ))}
                            {/* Total Row */}
                            <tr style={{ background: d ? 'rgba(255,200,0,0.04)' : 'rgba(217,119,6,0.03)' }}>
                                <td className="text-[11px] font-black py-2 px-3 border-r border-b sticky left-0"
                                    style={{ background: tableBg, borderColor: borderC, color: d ? '#fbbf24' : '#d97706' }}>
                                    {t.total}
                                </td>
                                {displayColTotals.map((t, ci) => (
                                    <td key={ci} className="text-center text-[11px] font-black py-2 px-1 border-r border-b"
                                        style={{ color: getTotalColor(t), borderColor: borderC, background: `${getTotalColor(t)}08` }}>
                                        {t}%
                                    </td>
                                ))}
                                <td className="text-center text-[12px] font-black py-2 px-2 border-r border-b"
                                    style={{ color: getTotalColor(displayOverallTotal), borderColor: borderC }}>
                                    {displayOverallTotal}%
                                </td>
                                <td className="text-center text-[11px] font-black py-2 px-2 border-b"
                                    style={{ color: getClassColor(displayOverallClass), borderColor: borderC }}>
                                    {displayOverallClass}
                                </td>
                            </tr>
                            {/* Classification Row */}
                            <tr style={{ background: d ? 'rgba(0,200,255,0.03)' : 'rgba(8,145,178,0.03)' }}>
                                <td className="text-[10px] font-bold py-2 px-3 border-r sticky left-0"
                                    style={{ background: tableBg, borderColor: borderC, color: d ? '#22d3ee' : '#0891b2' }}>
                                    {t.classification}
                                </td>
                                {displayColClassifications.map((c, ci) => (
                                    <td key={ci} className="text-center text-[9px] font-bold py-2 px-0.5 border-r"
                                        style={{ color: getClassColor(c), borderColor: borderC, direction: 'ltr' }}>
                                        {tv(c)}
                                    </td>
                                ))}
                                <td className="border-r" style={{ borderColor: borderC }}></td>
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
    const { language, t: globalT } = useLanguage();
    const tk = useThemeTokens();
    const d = tk.isDark;
    const lang = ["ar", "ru", "tr", "fr", "es"].includes(language) ? language : "en";
    const t = i18n[lang];

    const layerData = getDynamicLayerData(symbol, sources);
    const score = layerData.globalScorePct / 100;

    const tv = (v: string) => lang === "ar" ? (trendAr[v] || v) : lang === "ru" ? (trendRu[v] || v) : lang === "tr" ? (trendTr[v] || v) : v;
    
    const tvTeam = (v: string) => {
        if (lang === "en") return v;
        switch(v) {
            case "Short Term": return t.shortTerm;
            case "Medium Term": return t.mediumTerm;
            case "Long Term": return t.longTerm;
            case "Over all": return t.total;
            case "Overall": return t.total;
            default: return v;
        }
    };

    const tvTab = (v: string) => {
        switch(v) {
            case "Vector Core": return t.vectorCore;
            case "Delta Engine": return t.deltaEngine;
            case "Pulse Matrix": return t.pulseMatrix;
            case "Boundary Shell": return t.boundaryShell;
            case "Power Field": return t.powerField;
            case "Phase X Layer": return t.phaseXLayer;
            case "Decision Engine": return t.decisionEngine;
            default: return v;
        }
    };

    const bullish = score >= 0;
    const accent = bullish ? (d ? "#00e676" : "#16a34a") : (d ? "#ff1744" : "#dc2626");
    const accentG = bullish ? (d ? "rgba(0,230,118," : "rgba(22,163,74,") : (d ? "rgba(255,23,68," : "rgba(220,38,38,");
    const cellStyle = (v: number) => ({ color: v >= 0 ? (d ? "#00e676" : "#16a34a") : (d ? "#ff1744" : "#dc2626") });


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

    const thCls = "text-[13px] font-bold py-3.5 px-4 border-r border-b tracking-wider";

    const tdCls = "text-center text-[13px] font-bold py-3 px-3 border-r border-b";

    const tdClsLast = "text-center text-[13px] font-bold py-3 px-4 border-b";

    const borderC = d ? "rgba(255,255,255,0.06)" : tk.border;
    const tableBg = d ? "rgba(10,16,28,0.98)" : tk.surfaceElevated;
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
                                    <span className="text-[16px] font-black tracking-wider uppercase" style={{ color: tk.textPrimary }} dir="auto">{globalT("allTxt")}</span>
                                </div>
                                <span className="text-[10px] tracking-widest uppercase" style={{ color: tk.textDim }}>{globalT("classificationSummary")}</span>
                            </div>
                            <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${accentG}0.1)` }}>
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr style={{ background: tableBg }}>
                                            {[globalT("team"), globalT("buyBtn"), globalT("sellBtn"), "Net", "DSR", t.classification].map((h, i) => (
                                                <th key={i} className="text-[12px] font-bold py-3 px-4 border-r border-b tracking-wider"
                                                    style={{ borderColor: borderC, background: i === 0 ? `${accentG}0.05)` : undefined, color: tk.textMuted }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allTeams.map((row, i) => (
                                            <motion.tr key={i} className={d ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.02]'} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                                                <td className="text-[13px] font-bold py-2.5 px-4 border-r border-b" style={{ borderColor: borderC, background: `${accentG}0.03)`, color: tk.textSecondary }}>{tvTeam(row.team)}</td>
                                                <td className="text-center text-[13px] font-bold py-2.5 px-3 border-r border-b" style={{ color: d ? "#00e676" : "#16a34a", borderColor: borderC }}>{row.buy}</td>
                                                <td className="text-center text-[13px] font-bold py-2.5 px-3 border-r border-b" style={{ color: d ? "#ff1744" : "#dc2626", borderColor: borderC }}>{row.sell}</td>
                                                <td className="text-center text-[13px] font-bold py-2.5 px-3 border-r border-b" style={{ ...cellStyle(row.net), borderColor: borderC }}>{row.net}</td>
                                                <td className="text-center text-[13px] font-bold py-2.5 px-3 border-r border-b" style={{ ...cellStyle(row.dsr), borderColor: borderC }}>({row.dsr.toFixed(2)})</td>
                                                <td className="text-center text-[13px] font-bold py-2.5 px-4 border-b" style={{ ...classStyle(row.classification), borderColor: borderC }}>{tv(row.classification)}</td>
                                            </motion.tr>
                                        ))}
                                        {/* Over all row */}
                                        <motion.tr style={{ background: `${accentG}0.04)` }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                                            <td className="text-[13px] font-black py-2.5 px-4 border-r border-b" style={{ borderColor: `${accentG}0.1)`, background: `${accentG}0.06)`, color: d ? '#fbbf24' : '#d97706' }}>{tvTeam("Over all")}</td>
                                            <td className="text-center text-[14px] font-black py-2.5 px-3 border-r border-b" style={{ color: d ? "#00e676" : "#16a34a", borderColor: `${accentG}0.1)` }}>{layerData.allRow.buy}</td>
                                            <td className="text-center text-[14px] font-black py-2.5 px-3 border-r border-b" style={{ color: d ? "#ff1744" : "#dc2626", borderColor: `${accentG}0.1)` }}>{layerData.allRow.sell}</td>
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
                            <div className="text-[10px] text-gray-600 tracking-[0.25em] uppercase font-semibold mb-1">{globalT("globalScore")}</div>
                            <motion.div className="text-[44px] font-black leading-none my-2" style={{ color: accent }}
                                animate={{ textShadow: [`0 0 20px ${accentG}0.2)`, `0 0 45px ${accentG}0.5)`, `0 0 20px ${accentG}0.2)`] }}
                                transition={{ duration: 2.5, repeat: Infinity }}>{layerData.globalScorePct}%</motion.div>
                            <span className="text-[14px] font-bold" style={{ color: accent }}>{tv(layerData.allRow.classification)}</span>
                        </div>
                    </Panel>
                    <Panel accent={`${accentG}0.08)`}>
                        <div className="p-5 text-center" style={{ background: `linear-gradient(180deg, transparent 0%, ${accentG}0.04) 100%)` }}>
                            <div className="text-[10px] text-gray-600 tracking-[0.25em] uppercase font-semibold mb-1">{globalT("confidence")}</div>
                            <motion.div className="text-[44px] font-black leading-none my-2" style={{ color: accent }}
                                animate={{ textShadow: [`0 0 20px ${accentG}0.2)`, `0 0 45px ${accentG}0.5)`, `0 0 20px ${accentG}0.2)`] }}
                                transition={{ duration: 2.5, repeat: Infinity }}>{layerData.confidence}%</motion.div>
                            <span className="text-[14px] font-bold" style={{ color: accent }}>{layerData.confidence >= 70 ? globalT("highConfidence") : globalT("mediumConfidence")}</span>
                        </div>
                    </Panel>
                </div>
            </div>
            {/* ═══ Table 1: Indicator × Team ═══ */}
            <Panel accent={`${accentG}0.04)`}>
                <div className="p-5">
                    <div className="flex items-center gap-2.5 mb-4">
                        <motion.span className="text-xl" animate={{ rotate: [0, 6, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}> </motion.span>
                        <span className="text-[15px] font-black tracking-wider uppercase" style={{ color: tk.textPrimary }} dir="auto">
                            {globalT("indicatorsByTeam")}
                        </span>
                    </div>
                    <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${accentG}0.08)` }}>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr style={{ background: tableBg }}>
                                    {[globalT("indicatorLbl"), globalT("team"), globalT("buyBtn"), globalT("sellBtn"), "Net", "DSR", t.classification].map((h, i) => (
                                        <th key={i} className={thCls}
                                            style={{ borderColor: borderC, background: i < 2 ? (d ? "rgba(255,200,0,0.04)" : "rgba(217,119,6,0.03)") : undefined, color: tk.textMuted }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {layerData.byIndicator.map((ind, ii) => (
                                    <>{ind.teams.map((tm, ti) => (
                                        <motion.tr key={`${ii}-${ti}`} className={d ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.02]'} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (ii * 4 + ti) * 0.025 }}>
                                            {ti === 0 && <td rowSpan={4} className="text-[14px] font-black py-3 px-4 border-r border-b" style={{ borderColor: borderC, background: d ? "rgba(255,200,0,0.04)" : "rgba(217,119,6,0.03)", verticalAlign: "middle", color: tk.textPrimary }}>{tvTab(ind.indicator)}</td>}
                                            <td className="text-[13px] font-semibold py-2.5 px-4 border-r border-b" style={{ borderColor: borderC, color: tk.textMuted }}>{tvTeam(tm.team)}</td>
                                            <td className={tdCls} style={{ color: d ? "#00e676" : "#16a34a", borderColor: borderC }}>{tm.buy}</td>
                                            <td className={tdCls} style={{ color: d ? "#ff1744" : "#dc2626", borderColor: borderC }}>{tm.sell}</td>
                                            <td className={tdCls} style={{ ...cellStyle(tm.net), borderColor: borderC }}>{tm.net}</td>
                                            <td className={tdCls} style={{ ...cellStyle(tm.dsr), borderColor: borderC }}>({tm.dsr.toFixed(2)})</td>
                                            <td className={tdClsLast} style={{ ...classStyle(tm.classification), borderColor: borderC }}>{tv(tm.classification)}</td>
                                        </motion.tr>
                                    ))}
                                        <motion.tr style={{ background: "rgba(255,200,0,0.04)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (ii * 4 + 3) * 0.025 }}>
                                            <td className="text-[13px] font-black py-2.5 px-4 border-r border-b" style={{ borderColor: borderC, color: d ? '#fbbf24' : '#d97706' }}>{tvTeam("Over all")}</td>
                                            <td className={tdCls + " !font-black"} style={{ color: d ? "#00e676" : "#16a34a", borderColor: borderC }}>{ind.overall.buy}</td>
                                            <td className={tdCls + " !font-black"} style={{ color: d ? "#ff1744" : "#dc2626", borderColor: borderC }}>{ind.overall.sell}</td>
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
                        <span className="text-[15px] font-black tracking-wider uppercase" style={{ color: tk.textPrimary }} dir="auto">
                            {globalT("teamsByIndicator")}
                        </span>
                    </div>
                    <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${accentG}0.08)` }}>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr style={{ background: tableBg }}>
                                    {[globalT("team"), globalT("indicatorLbl"), globalT("buyBtn"), globalT("sellBtn"), "Net", "DSR", t.classification].map((h, i) => (
                                        <th key={i} className={thCls}
                                            style={{ borderColor: borderC, background: i < 2 ? (d ? "rgba(0,200,255,0.04)" : "rgba(8,145,178,0.03)") : undefined, color: tk.textMuted }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {layerData.byTeam.map((tm, ti) => (
                                    <>{tm.indicators.map((ind, ii) => (
                                        <motion.tr key={`${ti}-${ii}`} className={d ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.02]'} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (ti * 6 + ii) * 0.025 }}>
                                            {ii === 0 && <td rowSpan={6} className="text-[14px] font-black py-3 px-4 border-r border-b" style={{ borderColor: borderC, background: d ? "rgba(0,200,255,0.04)" : "rgba(8,145,178,0.03)", verticalAlign: "middle", color: tk.textPrimary }}>{tvTeam(tm.team)}</td>}
                                            <td className="text-[13px] font-semibold py-2.5 px-4 border-r border-b" style={{ borderColor: borderC, color: tk.textMuted }}>{tvTab(ind.indicator)}</td>
                                            <td className={tdCls} style={{ color: d ? "#00e676" : "#16a34a", borderColor: borderC }}>{ind.buy}</td>
                                            <td className={tdCls} style={{ color: d ? "#ff1744" : "#dc2626", borderColor: borderC }}>{ind.sell}</td>
                                            <td className={tdCls} style={{ ...cellStyle(ind.net), borderColor: borderC }}>{ind.net}</td>
                                            <td className={tdCls} style={{ ...cellStyle(ind.dsr), borderColor: borderC }}>{(ind.dsr * 100).toFixed(0)}%</td>
                                            <td className={tdClsLast} style={{ ...classStyle(ind.classification), borderColor: borderC }}>{tv(ind.classification)}</td>
                                        </motion.tr>
                                    ))}
                                        <motion.tr style={{ background: "rgba(0,200,255,0.03)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (ti * 6 + 5) * 0.025 }}>
                                            <td className="text-[13px] font-black py-2.5 px-4 border-r border-b" style={{ borderColor: borderC, color: d ? '#22d3ee' : '#0891b2' }}>{tvTeam("Over all")}</td>
                                            <td className={tdCls + " !font-black"} style={{ color: d ? "#00e676" : "#16a34a", borderColor: borderC }}>{tm.overall.buy}</td>
                                            <td className={tdCls + " !font-black"} style={{ color: d ? "#ff1744" : "#dc2626", borderColor: borderC }}>{tm.overall.sell}</td>
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

/* ═ ═ ═  Trading Decision Engine Table  ═ ═ ═ */
function TradingDecisionEngineTable({
    category,
    onCategoryChange,
    selectedSymbol,
    onSymbolSelect,
    isRTL,
    sources
}: {
    category: MarketCategory;
    onCategoryChange: (c: MarketCategory) => void;
    selectedSymbol: string;
    onSymbolSelect: (s: string) => void;
    isRTL: boolean;
    sources: Record<AnalysisTab, any[]>;
}) {
    const { language, t: globalT } = useLanguage();
    const lang = ["ar", "ru", "tr", "fr", "es"].includes(language) ? language : "en";
    const t = i18n[lang];
    const [decisionFilter, setDecisionFilter] = useState<"ALL" | "STRONG BUY" | "BUY" | "WEAK BUY" | "NO TRADE" | "WEAK SELL" | "SELL" | "STRONG SELL">("ALL");

    const cat = marketCategories.find(c => c.name === category);
    const symbols = cat?.symbols.filter(sym => {
        const jsonKey = symbolToJsonKey[sym];
        if (!jsonKey) return false;
        for (const tab in sources) {
            for (const stageData of sources[tab as AnalysisTab]) {
                if (stageData && stageData[jsonKey]) return true;
            }
        }
        return false;
    }) || [];

    const tv = (v: string) => lang === "ar" ? (trendAr[v] || v) : lang === "ru" ? (trendRu[v] || v) : lang === "tr" ? (trendTr[v] || v) : v;
    
    // Translation logic for headers
    const tvh = (h: string) => {
        if (lang === "ar") {
            return {
                "Symbol": "الرمز", "Primary Trend": "الاتجاه الرئيسي", "Structural Bias": "الانحياز الهيكلي",
                "Momentum": "الزخم", "Phase": "المرحلة", "Volatility": "التذبذب", "Reversal Risk": "مخاطر الانعكاس",
                "Confidence": "الثقة", "Market Phase": "مرحلة السوق", "Decision": "القرار"
            }[h] || h;
        } else if (lang === "ru") {
            return {
                "Symbol": "Символ", "Primary Trend": "Основной тренд", "Structural Bias": "Структ. смещение",
                "Momentum": "Импульс", "Phase": "Фаза", "Volatility": "Волатильность", "Reversal Risk": "Риск разворота",
                "Confidence": "Уверенность", "Market Phase": "Фаза рынка", "Decision": "Решение"
            }[h] || h;
        } else if (lang === "tr") {
            return {
                "Symbol": "Sembol", "Primary Trend": "Ana Trend", "Structural Bias": "Yapısal Eğilim",
                "Momentum": "İvme", "Phase": "Aşama", "Volatility": "Volatilite", "Reversal Risk": "Dönüş Riski",
                "Confidence": "Güven", "Market Phase": "Piyasa Aşaması", "Decision": "Karar"
            }[h] || h;
        } else if (lang === "fr") {
            return {
                "Symbol": "Symbole", "Primary Trend": "Tendance Principale", "Structural Bias": "Biais Structurel",
                "Momentum": "Dynamique", "Phase": "Phase", "Volatility": "Volatilité", "Reversal Risk": "Risque Renvers.",
                "Confidence": "Confiance", "Market Phase": "Phase du Marché", "Decision": "Décision"
            }[h] || h;
        } else if (lang === "es") {
            return {
                "Symbol": "Símbolo", "Primary Trend": "Tendencia Primaria", "Structural Bias": "Sesgo Estructural",
                "Momentum": "Impulso", "Phase": "Fase", "Volatility": "Volatilidad", "Reversal Risk": "Riesgo Revers.",
                "Confidence": "Confianza", "Market Phase": "Fase del Mercado", "Decision": "Decisión"
            }[h] || h;
        }
        return h;
    };

    const rows = symbols.map(sym => {
        const layerData = getDynamicLayerData(sym, sources);
        const gs = layerData.globalScorePct / 100;
        const dsrST = layerData.byTeam[0]?.overall.dsr ?? 0;
        const dsrMT = layerData.byTeam[1]?.overall.dsr ?? 0;
        const dsrLT = layerData.byTeam[2]?.overall.dsr ?? 0;

        const primaryTrendFull = gs > 0.6 ? "Strong Uptrend" : gs > 0.2 ? "Bullish" : gs >= -0.2 ? "Neutral" : gs >= -0.6 ? "Bearish" : "Strong Downtrend";
        const momentumState = dsrST >= 0.6 ? "Strong" : dsrST >= 0.2 ? "Moderate" : dsrST <= -0.6 ? "Strong" : dsrST <= -0.2 ? "Moderate" : "Weak";
        const structuralBias = dsrLT > 0 ? "Upward" : dsrLT < 0 ? "Downward" : "Neutral";
        const rRange = Math.max(dsrST, dsrMT, dsrLT) - Math.min(dsrST, dsrMT, dsrLT);
        const reversalRisk = rRange < 0.2 ? "Low" : rRange < 0.5 ? "Moderate" : "High";
        const phaseAvg = (dsrST + dsrMT + dsrLT) / 3;
        const phase = phaseAvg > 0.5 ? "Directional" : phaseAvg >= 0.2 ? "Developing" : "Range";

        const deltaEngineData = layerData.byIndicator.find(b => b.indicator === "Delta Engine");
        const deDsrST = deltaEngineData?.teams[0]?.dsr ?? 0;
        const deDsrMT = deltaEngineData?.teams[1]?.dsr ?? 0;
        const deDsrLT = deltaEngineData?.teams[2]?.dsr ?? 0;
        const deAvg = (deDsrST + deDsrMT + deDsrLT) / 3;
        const v = deAvg > 0.3 ? "Elevated" : deAvg >= 0.1 ? "Moderate" : "Low";
        const t = gs > 0.2 ? "Up" : gs < -0.2 ? "Down" : "Flat";

        let marketPhase: string;
        if (phase === "Range") marketPhase = "Range";
        else if (phase === "Directional" && v === "Elevated" && t === "Up") marketPhase = "Bullish Expansion";
        else if (phase === "Directional" && v === "Elevated" && t === "Down") marketPhase = "Bearish Expansion";
        else if (phase === "Directional" && v === "Low") marketPhase = "Compression";
        else marketPhase = "Transition";

        const confStr = layerData.confidence >= 70 ? "High Confidence" : layerData.confidence >= 40 ? "Medium Confidence" : "Low Confidence";

        // ----- SCORES -----
        const sPt = primaryTrendFull === "Strong Uptrend" ? 4 : primaryTrendFull === "Bullish" ? 2 : primaryTrendFull === "Bearish" ? -2 : primaryTrendFull === "Strong Downtrend" ? -4 : 0;
        const sMom = momentumState === "Strong" ? 2 : momentumState === "Moderate" ? 1 : 0;
        const sBias = structuralBias === "Upward" ? 2 : structuralBias === "Downward" ? -2 : 0;
        const sPhase = phase === "Directional" ? 2 : phase === "Developing" ? 1 : 0;
        const sVol = v === "Elevated" ? 1 : v === "Moderate" ? 2 : 0;
        // Reversal risk doesn't add to score
        const sConf = confStr === "High Confidence" ? 2 : confStr === "Medium Confidence" ? 1 : 0;
        const sMph = marketPhase === "Bullish Expansion" ? 3 : marketPhase === "Bearish Expansion" ? -3 : 0;

        const coreSum = sPt + sBias + sMph;
        const extraSum = sMom + sPhase + sVol + sConf;
        const totalScore = Math.sign(coreSum) * (Math.abs(coreSum) + extraSum);

        let decision = "NO TRADE";
        if (totalScore >= 13) decision = "STRONG BUY";
        else if (totalScore > 7) decision = "BUY";
        else if (totalScore > 0) decision = "WEAK BUY";
        else if (totalScore === 0) decision = "NO TRADE";
        else if (totalScore > -7) decision = "WEAK SELL";
        else if (totalScore > -13) decision = "SELL";
        else decision = "STRONG SELL";

        return { sym, primaryTrendFull, structuralBias, momentumState, phase, volatility: v, reversalRisk, confStr, marketPhase, decision, confidence: layerData.confidence, score: gs, totalScore };
    });

    const filteredRows = rows.filter(r => decisionFilter === "ALL" || r.decision === decisionFilter);

    return (
        <div className="flex justify-center w-full">
            <div className="w-full max-w-[1200px] space-y-4">
                {/* Local Filters for Decision Engine */}
            <div className="grid grid-cols-1 gap-4 mb-2">
                {/* Market Filter */}
                <div className="p-3 rounded-xl flex items-center gap-2 flex-wrap" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <span className="text-[11px] font-black tracking-widest text-gray-500 mx-1">{lang === "ar" ? "السوق:" : lang === "ru" ? "РЫНОК:" : lang === "tr" ? "PİYASA:" : "MARKET:"}</span>
                    {marketCategories.map(c => (
                        <button key={c.name} onClick={() => onCategoryChange(c.name)}
                            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1.5 transition-all
                                ${category === c.name ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-transparent text-gray-400 hover:bg-white/5"}`}>
                            <span className="text-sm">{c.icon}</span>
                            <span>{lang === "ar" ? c.nameAr : lang === "ru" ? t[c.name.toLowerCase() as keyof typeof t] : lang === "tr" ? t[c.name.toLowerCase() as keyof typeof t] : c.name}</span>
                        </button>
                    ))}
                </div>
                {/* Decision Filter */}
                <div className="p-3 rounded-xl flex items-center justify-between gap-2 flex-wrap" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-black tracking-widest text-gray-500 mx-1">{globalT("decision")}:</span>
                        {["ALL", "STRONG BUY", "BUY", "WEAK BUY", "NO TRADE", "WEAK SELL", "SELL", "STRONG SELL"].map(df => {
                            let styleCls = "bg-transparent text-gray-400 hover:bg-white/5";
                            if (decisionFilter === df) {
                                switch (df) {
                                    case "STRONG BUY": styleCls = "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]"; break;
                                    case "BUY": styleCls = "bg-lime-500/20 text-lime-400 border border-lime-500/30 shadow-[0_0_10px_rgba(132,204,22,0.15)]"; break;
                                    case "WEAK BUY": styleCls = "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.15)]"; break;
                                    case "NO TRADE": styleCls = "bg-slate-500/20 text-slate-300 border border-slate-500/30 shadow-[0_0_10px_rgba(100,116,139,0.15)]"; break;
                                    case "WEAK SELL": styleCls = "bg-orange-500/15 text-orange-400 border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.15)]"; break;
                                    case "SELL": styleCls = "bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-[0_0_10px_rgba(225,29,72,0.15)]"; break;
                                    case "STRONG SELL": styleCls = "bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.25)]"; break;
                                    case "ALL": styleCls = "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]"; break;
                                }
                            }
                            
                            const getDecLabel = (d: string) => {
                                if (lang === "ar") return { "ALL": "الكل", "STRONG BUY": "شراء قوي", "BUY": "شراء", "WEAK BUY": "شراء ضعيف", "NO TRADE": "لا تداول", "WEAK SELL": "بيع ضعيف", "SELL": "بيع", "STRONG SELL": "بيع قوي" }[d] || d;
                                if (lang === "ru") return { "ALL": "Все", "STRONG BUY": "СИЛЬНО ПОКУПАТЬ", "BUY": "ПОКУПАТЬ", "WEAK BUY": "СЛАБО ПОКУПАТЬ", "NO TRADE": "ВНЕ РЫНКА", "WEAK SELL": "СЛАБО ПРОДАВАТЬ", "SELL": "ПРОДАВАТЬ", "STRONG SELL": "СИЛЬНО ПРОДАВАТЬ" }[d] || d;
                                if (lang === "tr") return { "ALL": "Tümü", "STRONG BUY": "GÜÇLÜ AL", "BUY": "AL", "WEAK BUY": "ZAYIF AL", "NO TRADE": "İŞLEM YOK", "WEAK SELL": "ZAYIF SAT", "SELL": "SAT", "STRONG SELL": "GÜÇLÜ SAT" }[d] || d;
                                if (lang === "fr") return { "ALL": "Tout", "STRONG BUY": "ACHAT FORT", "BUY": "ACHAT", "WEAK BUY": "ACHAT FAIBLE", "NO TRADE": "AUCUN TRADE", "WEAK SELL": "VENTE FAIBLE", "SELL": "VENTE", "STRONG SELL": "VENTE FORTE" }[d] || d;
                                if (lang === "es") return { "ALL": "Todo", "STRONG BUY": "COMPRA FUERTE", "BUY": "COMPRA", "WEAK BUY": "COMPRA DÉBIL", "NO TRADE": "SIN TRADE", "WEAK SELL": "VENTA DÉBIL", "SELL": "VENTA", "STRONG SELL": "VENTA FUERTE" }[d] || d;
                                return d;
                            };
                            
                            const count = df === "ALL" ? rows.length : rows.filter(r => r.decision === df).length;

                            return (
                                <button key={df} onClick={() => setDecisionFilter(df as any)}
                                    className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center gap-1.5 ${styleCls} ${count === 0 ? "opacity-50" : ""}`}>
                                    <span>{getDecLabel(df)}</span>
                                    <span className="bg-black/20 px-1.5 py-0.5 rounded text-[10px] ml-1">{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid rgba(0, 200, 255, 0.15)` }}>
                <table className="w-full border-collapse whitespace-nowrap">
                    <thead>
                        <tr style={{ background: "rgba(10,16,28,0.98)" }}>
                            {["Symbol", "Primary Trend", "Structural Bias", "Momentum", "Phase", "Volatility", "Reversal Risk", "Confidence", "Market Phase", "Decision"].map((h, i) => (
                                <th key={i} className="text-left py-2 px-3 text-[10px] font-black tracking-widest uppercase text-cyan-400 border-r border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }} dir="auto">
                                    {tvh(h)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRows.map((r, i) => (
                            <motion.tr key={r.sym}
                                onClick={() => onSymbolSelect(r.sym)}
                                className={`cursor-pointer transition-colors ${selectedSymbol === r.sym ? "bg-cyan-500/10" : "hover:bg-white/[0.04]"}`}
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                                <td className="py-2 px-3 border-r border-b text-[11px] font-bold text-white flex items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                    <span className="text-base">{symbolIcons[r.sym]?.icon || '📈'}</span> {r.sym}
                                </td>
                                <td className="py-2 px-3 border-r border-b text-[11px] font-bold" style={{ borderColor: 'rgba(255,255,255,0.06)', color: getTrendColor(r.primaryTrendFull) }}>{tv(r.primaryTrendFull)}</td>
                                <td className="py-2 px-3 border-r border-b text-[11px] font-bold" style={{ borderColor: 'rgba(255,255,255,0.06)', color: getTrendColor(r.structuralBias) }}>{tv(r.structuralBias)}</td>
                                <td className="py-2 px-3 border-r border-b text-[11px] font-bold" style={{ borderColor: 'rgba(255,255,255,0.06)', color: getTrendColor(r.momentumState) }}>{tv(r.momentumState)}</td>
                                <td className="py-2 px-3 border-r border-b text-[11px] font-bold" style={{ borderColor: 'rgba(255,255,255,0.06)', color: r.phase === "Directional" ? "#00e676" : r.phase === "Developing" ? "#ffc400" : "#ff1744" }}>{tv(r.phase)}</td>
                                <td className="py-2 px-3 border-r border-b text-[11px] font-bold" style={{ borderColor: 'rgba(255,255,255,0.06)', color: r.volatility === "Elevated" ? "#ff1744" : r.volatility === "Moderate" ? "#ffc400" : "#00e676" }}>{tv(r.volatility)}</td>
                                <td className="py-2 px-3 border-r border-b text-[11px] font-bold" style={{ borderColor: 'rgba(255,255,255,0.06)', color: r.reversalRisk === "Low" ? "#00e676" : r.reversalRisk === "Moderate" ? "#ffc400" : "#ff1744" }}>{tv(r.reversalRisk)}</td>
                                <td className="py-2 px-3 border-r border-b text-[11px] font-bold" style={{ borderColor: 'rgba(255,255,255,0.06)', color: r.confidence >= 70 ? "#00e5ff" : r.confidence >= 40 ? "#ffab00" : "#ff6e40" }}>
                                    {lang === "en" ? r.confStr : r.confidence >= 70 ? t.aiHigh : r.confidence >= 40 ? t.aiMed : t.aiLow}
                                </td>
                                <td className="py-2 px-3 border-r border-b text-[11px] font-bold" style={{ borderColor: 'rgba(255,255,255,0.06)', color: getTrendColor(r.marketPhase) }}>{tv(r.marketPhase)}</td>
                                <td className="py-2 px-3 border-r border-b text-[11px] font-black tracking-wider" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                    {r.decision === "STRONG BUY" && <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.4)] block text-center min-w-[75px] border border-emerald-500/40">{globalT("strongBuyStr")}</span>}
                                    {r.decision === "BUY" && <span className="bg-lime-500/20 text-lime-400 px-2 py-1 rounded-md shadow-[0_0_10px_rgba(132,204,22,0.2)] block text-center min-w-[75px] border border-lime-500/30">{globalT("buyStr")}</span>}
                                    {r.decision === "WEAK BUY" && <span className="bg-yellow-500/15 text-yellow-500 px-2 py-1 rounded-md block text-center min-w-[75px] border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.15)]">{globalT("weakBuyStr")}</span>}
                                    {r.decision === "STRONG SELL" && <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-md shadow-[0_0_15px_rgba(239,68,68,0.4)] block text-center min-w-[75px] border border-red-500/40">{globalT("strongSellStr")}</span>}
                                    {r.decision === "SELL" && <span className="bg-rose-500/20 text-rose-400 px-2 py-1 rounded-md shadow-[0_0_10px_rgba(225,29,72,0.2)] block text-center min-w-[75px] border border-rose-500/30">{globalT("sellStr")}</span>}
                                    {r.decision === "WEAK SELL" && <span className="bg-orange-500/15 text-orange-500 px-2 py-1 rounded-md block text-center min-w-[75px] border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.15)]">{globalT("weakSellStr")}</span>}
                                    {r.decision === "NO TRADE" && <span className="bg-slate-500/20 text-slate-400 px-2 py-1 rounded-md block text-center min-w-[75px] border border-slate-500/30">{globalT("noTradeStr")}</span>}
                                </td>
                            </motion.tr>
                        ))}
                        {filteredRows.length === 0 && (
                            <tr>
                                <td colSpan={10} className="py-8 text-center text-gray-500 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                    {lang === "ar" ? "لا يوجد بيانات لهذه التصفية" : lang === "ru" ? "Нет данных по этому фильтру" : lang === "tr" ? "Bu filtreyle eşleşen veri yok" : "No symbols match this filter"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
}

/* ═══════════ MAIN COMPONENT ═══════════ */

export function PhaseXDynamicsPage({ onBack }: PhaseXDynamicsPageProps) {

    const { language, setLanguageKey, t: globalT } = useLanguage();
    const isRTL = language === "ar";
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setLangDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const languageOptions = [
        { code: "ar", label: "العربية", flagUrl: "sa" },
        { code: "en", label: "English", flagUrl: "gb" },
        { code: "ru", label: "Русский", flagUrl: "ru" },
        { code: "tr", label: "Türkçe", flagUrl: "tr" },
        { code: "fr", label: "Français", flagUrl: "fr" },
        { code: "es", label: "Español", flagUrl: "es" }
    ];

    const currentLangObj = languageOptions.find(l => l.code === language) || languageOptions[1];

    const lang = ["ar", "ru", "tr", "fr", "es"].includes(language) ? language : "en";

    const t = i18n[lang];

    const tv = (v: string) => lang === "ar" ? (trendAr[v] || v) : lang === "ru" ? (trendRu[v] || v) : lang === "tr" ? (trendTr[v] || v) : lang === "fr" ? ((trendFr as Record<string,string>)[v] || v) : lang === "es" ? ((trendEs as Record<string,string>)[v] || v) : v;

    const tvTab = (v: string) => {
        switch(v) {
            case "Vector Core": return t.vectorCore;
            case "Delta Engine": return t.deltaEngine;
            case "Pulse Matrix": return t.pulseMatrix;
            case "Boundary Shell": return t.boundaryShell;
            case "Power Field": return t.powerField;
            case "Phase X Layer": return t.phaseXLayer;
            case "Decision Engine": return t.decisionEngine;
            default: return v;
        }
    };

    const [selectedCategory, setSelectedCategory] = useState<MarketCategory>("Forex");

    const [selectedSymbol, setSelectedSymbol] = useState("EURUSD");
    const [lastSystemUpdate, setLastSystemUpdate] = useState<number | null>(Date.now());

    const [selectedTab, setSelectedTab] = useState<AnalysisTab>("Vector Core");
    const [filterOpen, setFilterOpen] = useState(true);
    const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
    const [isNewsOpen, setIsNewsOpen] = useState(false);

    const [sources, setSources] = useState<Record<AnalysisTab, any[]>>(defaultAnalysisSources);
    const [uploadStatus, setUploadStatus] = useState<Record<AnalysisTab, boolean[]>>({
        "Vector Core": [false, false, false],
        "Delta Engine": [false, false, false],
        "Pulse Matrix": [false, false, false],
        "Boundary Shell": [false, false, false],
        "Power Field": [false, false, false],
        "Phase X Layer": [false, false, false],
        "Decision Engine": [false, false, false]
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
                "Decision Engine": [null, null, null]
            };
            const newStatus: Record<AnalysisTab, boolean[]> = {
                "Vector Core": [false, false, false],
                "Delta Engine": [false, false, false],
                "Pulse Matrix": [false, false, false],
                "Boundary Shell": [false, false, false],
                "Power Field": [false, false, false],
                "Phase X Layer": [false, false, false],
                "Decision Engine": [false, false, false]
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



    const resetSources = () => {
        setSources(defaultAnalysisSources);
        setUploadStatus({
            "Vector Core": [false, false, false],
            "Delta Engine": [false, false, false],
            "Pulse Matrix": [false, false, false],
            "Boundary Shell": [false, false, false],
            "Power Field": [false, false, false],
            "Phase X Layer": [false, false, false],
            "Decision Engine": [false, false, false]
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

        const confStr = layerData.confidence >= 70 ? "High Confidence" : layerData.confidence >= 40 ? "Medium Confidence" : "Low Confidence";

        // ----- SCORES -----
        const sPt = primaryTrendFull === "Strong Uptrend" ? 4 : primaryTrendFull === "Bullish" ? 2 : primaryTrendFull === "Bearish" ? -2 : primaryTrendFull === "Strong Downtrend" ? -4 : 0;
        const sMom = momentumState === "Strong" ? 2 : momentumState === "Moderate" ? 1 : 0;
        const sBias = structuralBias === "Upward" ? 2 : structuralBias === "Downward" ? -2 : 0;
        const sPhase = p === "Directional" ? 2 : p === "Developing" ? 1 : 0;
        const sVol = v === "Elevated" ? 1 : v === "Moderate" ? 2 : 0;
        const sConf = confStr === "High Confidence" ? 2 : confStr === "Medium Confidence" ? 1 : 0;
        const sMph = marketPhase === "Bullish Expansion" ? 3 : marketPhase === "Bearish Expansion" ? -3 : 0;

        const coreSum = sPt + sBias + sMph;
        const extraSum = sMom + sPhase + sVol + sConf;
        const totalScore = Math.sign(coreSum) * (Math.abs(coreSum) + extraSum);

        let decision = "NO TRADE";
        if (totalScore >= 13) decision = "STRONG BUY";
        else if (totalScore > 7) decision = "BUY";
        else if (totalScore > 0) decision = "WEAK BUY";
        else if (totalScore === 0) decision = "NO TRADE";
        else if (totalScore > -7) decision = "WEAK SELL";
        else if (totalScore > -13) decision = "SELL";
        else decision = "STRONG SELL";

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
            decision,
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
            {/* ═══ HEADER ══_═ */}
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

                            <button onClick={() => setIsNewsOpen(!isNewsOpen)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black tracking-widest uppercase transition-colors mr-2 ${isNewsOpen ? "bg-red-500/10 text-red-500 border border-red-500/20" : "text-gray-400 hover:text-white border border-transparent hover:bg-white/10"}`}>
                                <RadioTower className={`w-3.5 h-3.5 ${isNewsOpen ? "animate-pulse" : ""}`} />
                                {lang === "ar" ? "أخر الأخبار" : lang === "ru" ? "НОВОСТИ" : lang === "tr" ? "HABERLER" : "NEWS"}
                            </button>

                            <div className="relative mr-2" ref={dropdownRef}>
                                <button
                                    onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black tracking-widest text-cyan-400 hover:text-white hover:bg-white/10 transition-colors border border-cyan-500/20 bg-cyan-500/10 cursor-pointer"
                                >
                                    <img src={`https://flagcdn.com/${currentLangObj.flagUrl}.svg`} alt={currentLangObj.code} className="w-5 h-auto rounded-sm object-cover" />
                                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${langDropdownOpen ? "rotate-180" : ""}`} />
                                </button>

                                <AnimatePresence>
                                    {langDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full mt-2 w-36 rounded-xl shadow-2xl overflow-hidden z-[60] bg-gray-900 border border-white/10"
                                            style={{ right: isRTL ? 'auto' : 0, left: isRTL ? 0 : 'auto' }}
                                        >
                                            <div className="flex flex-col py-1">
                                                {languageOptions.map((lang) => (
                                                    <button
                                                        key={lang.code}
                                                        onClick={() => {
                                                            setLanguageKey(lang.code as any);
                                                            setLangDropdownOpen(false);
                                                        }}
                                                        className={`flex items-center gap-2 px-3 py-2.5 text-xs transition-colors text-left ${
                                                            language === lang.code ? "bg-white/10 text-white font-bold" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                                                        }`}
                                                    >
                                                        <img src={`https://flagcdn.com/${lang.flagUrl}.svg`} alt={lang.code} className="w-5 h-auto rounded-sm object-cover" />
                                                        <span>{lang.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

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
            
            {/* ═ ═ ═  BREAKING NEWS BAR ═ ═_═  */}
            <AnimatePresence>
                {isNewsOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        style={{ overflow: "hidden" }}
                        className="px-5 w-full relative z-20 max-w-[1700px] mx-auto"
                    >
                        <BreakingNews selectedSymbol={selectedSymbol} selectedCategory={selectedCategory} />
                    </motion.div>
                )}
            </AnimatePresence>
            {/* ═══ BODY ══_═ */}
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
                        {/* ════  AI FLOATING BOT  ════ */}
                        <div className={`absolute top-[45%] -translate-y-1/2 ${isRTL ? "right-8" : "left-8"} z-50`}>
                            {/* Outer attention ring */}
                            <motion.div className="absolute inset-0 rounded-full"
                                style={{ border: `2px solid ${accent}` }}
                                animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
                            {/* Second attention ring */}
                            <motion.div className="absolute inset-0 rounded-full"
                                style={{ border: `1px solid ${accent}` }}
                                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }} />
                            
                            <motion.button
                                onClick={() => setIsAiPanelOpen(true)}
                                className="w-14 h-14 rounded-full flex items-center justify-center relative overflow-hidden group hover:scale-110 transition-transform cursor-pointer"
                                style={{
                                    background: `linear-gradient(135deg, ${accent}40 0%, rgba(0,0,0,0.6) 100%)`,
                                    border: `1.5px solid ${accent}80`,
                                    boxShadow: `0 0 25px ${accentG}0.5), inset 0 0 15px ${accentG}0.4)`
                                }}
                                animate={{ y: [0, -6, 0], boxShadow: [`0 0 20px ${accentG}0.4)`, `0 0 40px ${accentG}0.8)`, `0 0 20px ${accentG}0.4)`] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <motion.div className="absolute inset-0 pointer-events-none"
                                    style={{ background: `radial-gradient(circle at 50% 50%, ${accent}60 0%, transparent 70%)` }}
                                    animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.8, 1.3, 0.8] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                                {/* Robot Icon */}
                                <motion.div animate={{ rotate: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                                    <PhaseXBotIcon size={28} color="#fff" className="relative z-10" style={{ filter: `drop-shadow(0 0 10px ${accent})` }} />
                                </motion.div>
                            </motion.button>
                        </div>

                        {/* ════  AI INSIGHT PANEL OVERLAY  ════ */}
                        <AnimatePresence>
                            {isAiPanelOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className={`absolute top-0 bottom-0 ${isRTL ? "right-0" : "left-0"} z-50 rounded-2xl flex flex-col justify-center overflow-hidden`}
                                    style={{
                                        width: "100%",
                                        background: "rgba(10, 15, 25, 0.95)",
                                        backdropFilter: "blur(12px)",
                                        border: `1px solid ${accent}40`,
                                        boxShadow: `0 0 50px rgba(0,0,0,0.8), inset 0 0 30px ${accentG}0.15)`
                                    }}
                                >
                                    {/* Sci-fi background grid */}
                                    <div className="absolute inset-0 pointer-events-none opacity-20"
                                        style={{ backgroundImage: `linear-gradient(${accent} 1px, transparent 1px), linear-gradient(90deg, ${accent} 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />
                                    
                                    <button onClick={() => setIsAiPanelOpen(false)} className={`absolute top-5 ${isRTL ? "left-5" : "right-5"} text-gray-400 hover:text-white transition-colors z-20`}>
                                        <X size={28} />
                                    </button>

                                    <div className="px-14 py-8 relative z-10 flex gap-8 items-center h-full">
                                        <div className="w-24 h-24 rounded-full flex-shrink-0 flex items-center justify-center relative bg-black/40 border border-white/10"
                                            style={{ boxShadow: `0 0 30px ${accentG}0.3)` }}>
                                            <motion.div className="absolute inset-0 rounded-full"
                                                style={{ border: `2px dashed ${accent}60` }}
                                                animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
                                            <PhaseXBotIcon size={44} color={accent} style={{ filter: `drop-shadow(0 0 12px ${accent})` }} />
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h3 className="text-xl font-black mb-4 flex items-center gap-3 tracking-wider uppercase" style={{ color: accent }}>
                                                <Zap size={20} />
                                                {lang === "ar" ? "نظرة سوق الذكاء الاصطناعي" : lang === "fr" ? "APERÇU DU MARCHÉ IA" : lang === "es" ? "VISIÓN DE MERCADO IA" : lang === "ru" ? "ОБЗОР РЫНКА ОТ ИИ" : lang === "tr" ? "YZ PIYASA GÖRÜSÜ" : "AI MARKET INSIGHT"}
                                            </h3>
                                            <p className="text-gray-200 text-lg leading-relaxed font-medium" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }} dir={lang === "ar" ? "rtl" : "ltr"}>
                                                {getAIMarketInsightText(
                                                    {
                                                        decision: data.decision || "NO TRADE",
                                                        primaryTrend: data.dynamics.primaryTrend,
                                                        structuralBias: data.dynamics.structuralBias,
                                                        momentumState: data.dynamics.momentumState,
                                                        volatility: data.volatility,
                                                        reversalRisk: data.dynamics.reversalRisk || "LOW",
                                                    },
                                                    lang as any
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

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

                            <motion.h2 className="text-[48px] font-black tracking-tight mb-8 leading-none z-10 relative"
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
                                {tv(data.marketState)}
                            </motion.h2>

                            {/* ═══ Top Cluster: Clocks + Currency Badge ═══ */}
                            <div className="mt-4 flex justify-center items-center gap-8 mb-6 w-full relative z-30" style={{ paddingLeft: '150px' }}>
                                {/* LEFT CLOCK: Last Update */}
                                <SciFiClock
                                    isLive={true}
                                    label={lang === "ar" ? "اخر ابديت" : lang === "ru" ? "ПОСЛЕДНЕЕ ОБНОВЛЕНИЕ" : lang === "tr" ? "SON GÜNCELLEME" : "LAST UPDATE"}
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

                                <SciFiClock
                                    isLive={true}
                                    label={globalT("currentTimeStr")}
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

                                    {/* DECISION BOX */}
                                    {data.decision && (() => {
                                        const getDecisionColors = (decision: string) => {
                                            switch (decision) {
                                                case "STRONG BUY": return { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", text: "#34d399", glow: "rgba(16,185,129,0.3)" };
                                                case "BUY": return { bg: "rgba(132,204,22,0.12)", border: "rgba(132,204,22,0.25)", text: "#a3e635", glow: "rgba(132,204,22,0.2)" };
                                                case "WEAK BUY": return { bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.2)", text: "#facc15", glow: "rgba(234,179,8,0.15)" };
                                                case "NO TRADE": return { bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.2)", text: "#94a3b8", glow: "transparent" };
                                                case "WEAK SELL": return { bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.2)", text: "#fb923c", glow: "rgba(249,115,22,0.15)" };
                                                case "SELL": return { bg: "rgba(225,29,72,0.12)", border: "rgba(225,29,72,0.25)", text: "#fb7185", glow: "rgba(225,29,72,0.2)" };
                                                case "STRONG SELL": return { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.3)", text: "#f87171", glow: "rgba(239,68,68,0.3)" };
                                                default: return { bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.2)", text: "#94a3b8", glow: "transparent" };
                                            }
                                        };
                                        const dColors = getDecisionColors(data.decision);
                                        const decisionLabel = data.decision === "STRONG BUY" ? globalT("strongBuyStr") : data.decision === "BUY" ? globalT("buyStr") : data.decision === "WEAK BUY" ? globalT("weakBuyStr") : data.decision === "NO TRADE" ? globalT("noTradeStr") : data.decision === "WEAK SELL" ? globalT("weakSellStr") : data.decision === "SELL" ? globalT("sellStr") : data.decision === "STRONG SELL" ? globalT("strongSellStr") : data.decision;

                                        return (
                                            <motion.div className="w-full text-center px-4 py-2 rounded-xl relative overflow-hidden"
                                                style={{
                                                    background: dColors.bg,
                                                    border: `1px solid ${dColors.border}`
                                                }}
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                                                <div className="text-[10px] tracking-widest uppercase mb-0.5 font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>
                                                    {globalT("decision")}
                                                </div>
                                                <div className="text-[18px] font-black tracking-wider"
                                                    style={{ color: dColors.text }}>
                                                    {decisionLabel}
                                                </div>
                                                {/* Decision Glow Pulse */}
                                                {data.decision !== "NO TRADE" && (
                                                    <motion.div className="absolute inset-0 pointer-events-none"
                                                        style={{ background: `radial-gradient(circle at 50% 50%, ${dColors.glow} 0%, transparent 70%)` }}
                                                        animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.9, 1.1, 0.9] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                                                )}
                                            </motion.div>
                                        );
                                    })()}
                                </div>
                                {/* Gauge */}
                                <SupercarGauge score={data.globalScore} confidence={data.confidence} isRTL={isRTL} />
                            </div>
                        </div>

                    </div>
                </motion.div>
                {/* ═ ═ ═  MARKET FILTER ═ ═_═  */}
                {selectedTab !== "Decision Engine" && (
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
                                                    <div className="text-[12px] font-bold" style={{ color: isActive ? accent : "#6b7280" }}>{lang === "ar" ? cat.nameAr : lang === "ru" ? t[cat.name.toLowerCase() as keyof typeof t] : lang === "tr" ? t[cat.name.toLowerCase() as keyof typeof t] : cat.name}</div>
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
                )}

                {/* ═══ SYMBOL SELECTOR STRIP ═══ */}
                <AnimatePresence mode="wait">
                    {filterOpen && selectedTab !== "Decision Engine" && (
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
                                        {lang === "ar" ? "جاري تحميل البيانات..." : lang === "ru" ? "Загрузка данных или нет символов в JSON..." : lang === "tr" ? "Veriler yükleniyor veya JSON'da sembol yok..." : "Loading data or no symbols available in JSON..."}
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
                                                    {lang === "ar" ? info.labelAr : info.label}
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
                {/* ══_═ ANALYSIS TABS (separate layer) ══_═ */}
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
                                    <span className="relative z-10">{tvTab(tab)}</span>
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
            {/* ══_═ ANALYSIS TABLE + SIDEBAR ══_═ */}
            <AnimatePresence mode="wait">
                <motion.div key={selectedTab + selectedSymbol}
                    initial={{ opacity: 0, y: 30, scale: 0.97, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, scale: 0.98, filter: "blur(4px)" }}
                    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }} className="pb-8">
                    {selectedTab === "Decision Engine" ? (
                        <TradingDecisionEngineTable category={selectedCategory} onCategoryChange={handleCategoryChange} selectedSymbol={selectedSymbol} onSymbolSelect={setSelectedSymbol} isRTL={isRTL} sources={sources} />
                    ) : selectedTab === "Phase X Layer" ? (
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