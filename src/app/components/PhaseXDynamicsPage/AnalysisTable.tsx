import { useRef } from "react";
import { motion } from "motion/react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useThemeTokens } from "../../hooks/useThemeTokens";
import type { AnalysisTab, Signal } from "../PhaseX/types";
import { Panel, SignalCell } from "../PhaseX/UIComponents";
import { analysisTabIcons, vcTfLabels, trendAr, trendRu, trendTr, i18n } from "../PhaseX/constants";
import { getTabData, getTotalColor, getClassColor } from "./phaseXDynamicsHelpers";

export function AnalysisTable({ tab, symbol, isRTL, sources }: { tab: AnalysisTab; symbol: string; isRTL: boolean; sources: Record<AnalysisTab, any[]> }) {
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
        switch (v) {
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
