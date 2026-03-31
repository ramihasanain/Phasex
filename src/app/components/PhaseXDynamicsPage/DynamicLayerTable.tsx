import { Fragment } from "react";
import { motion } from "motion/react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useThemeTokens } from "../../hooks/useThemeTokens";
import { Panel } from "../PhaseX/UIComponents";
import { trendAr, trendRu, trendTr, i18n } from "../PhaseX/constants";
import type { AnalysisTab } from "../PhaseX/types";
import { getDynamicLayerData, getClassColor } from "./phaseXDynamicsHelpers";

export function DynamicLayerTable({ symbol, isRTL, sources }: { symbol: string; isRTL: boolean; sources: Record<AnalysisTab, any[]> }) {
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
        switch (v) {
            case "Short Term": return t.shortTerm;
            case "Medium Term": return t.mediumTerm;
            case "Long Term": return t.longTerm;
            case "Over all": return t.total;
            case "Overall": return t.total;
            default: return v;
        }
    };

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
        <div className="flex justify-center w-full pb-8">
            <div className="w-[95%] max-w-[1400px] xl:max-w-6xl space-y-6 px-2 lg:px-0">
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
                                    <Fragment key={ti}>
                                        {tm.indicators.map((ind, ii) => (
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
                                        </motion.tr>
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Panel>
            </div>
        </div>
    );
}
