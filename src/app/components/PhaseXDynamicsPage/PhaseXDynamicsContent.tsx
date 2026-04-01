import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Zap } from "lucide-react";
import { Panel } from "../PhaseX/UIComponents";
import { getTrendColor } from "./phaseXDynamicsHelpers";
import { AnalysisTable } from "./AnalysisTable";
import { DynamicLayerTable } from "./DynamicLayerTable";
import { TradingDecisionEngineTable } from "./TradingDecisionEngineTable";
import type { PhaseXCtx } from "./usePhaseXDynamicsPage";

export function PhaseXDynamicsContent({ ctx }: { ctx: PhaseXCtx }) {
    const {
        selectedTab,
        selectedSymbol,
        selectedCategory,
        handleCategoryChange,
        setSelectedSymbol,
        isRTL,
        accent,
        accentG,
        sources,
        data,
        t,
        tv,
        mt5Positions,
        setTradeModalState,
        setTradeSymbolOverride,
        setTradeSL,
        setTradeTP,
        setTradeError,
        setTradeLot,
    } = ctx;

    return (
        <AnimatePresence mode="wait">
            <motion.div key={selectedTab + selectedSymbol}
                initial={{ opacity: 0, y: 30, scale: 0.97, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, scale: 0.98, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }} className="pb-8">
                {selectedTab === "Decision Engine" ? (
                    <TradingDecisionEngineTable
                        category={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                        selectedSymbol={selectedSymbol}
                        onSymbolSelect={setSelectedSymbol}
                        isRTL={isRTL}
                        sources={sources}
                        mt5Positions={mt5Positions}
                        onExecuteAction={(symbol, decision, lot) => {
                            setTradeModalState({ isOpen: true, symbol, decision });
                            setTradeSymbolOverride(symbol);
                            if (lot) setTradeLot(String(lot));
                            setTradeSL("");
                            setTradeTP("");
                            setTradeError(null);
                        }}
                    />
                ) : selectedTab === "Phase X Layer" ? (
                    <DynamicLayerTable symbol={selectedSymbol} isRTL={isRTL} sources={sources} />
                ) : (
                    <div className="grid grid-cols-12 gap-4">
                        {/* Main Table */}
                        <div className="col-span-12 xl:col-span-9">
                            <AnalysisTable
                                tab={selectedTab}
                                symbol={selectedSymbol}
                                isRTL={isRTL}
                                sources={sources}
                            />
                        </div>
                        {/* Sidebar */}
                        <div className="col-span-12 xl:col-span-3 space-y-4">
                            {/* Layer Summary Panel */}
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

                            {/* Phase X Dynamics Output */}
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

                                    {/* Execute from AI Analysis */}
                                    {(() => {
                                        const dec = data.decision || "NO TRADE";
                                        if (dec === "NO TRADE") return null;

                                        let action = "BUY";
                                        if (dec.includes("SELL")) action = "SELL";
                                        const expectedComment = `PX-SD ${selectedSymbol} ${action}`.slice(0, 31);
                                        const hasPos = (mt5Positions || []).some((p: any) => p.comment === expectedComment);

                                        return (
                                            <motion.button
                                                disabled={hasPos}
                                                whileHover={{ scale: hasPos ? 1 : 1.03 }} whileTap={{ scale: hasPos ? 1 : 0.97 }}
                                                onClick={() => {
                                                    if (hasPos) return;
                                                    setTradeModalState({ isOpen: true, symbol: selectedSymbol, decision: dec });
                                                    setTradeSymbolOverride(selectedSymbol);
                                                    setTradeSL("");
                                                    setTradeTP("");
                                                    setTradeError(null);
                                                }}
                                                className="w-full mt-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                style={{
                                                    background: dec.includes("BUY") ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                                                    border: `1px solid ${dec.includes("BUY") ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                                                    color: dec.includes("BUY") ? '#34d399' : '#f87171',
                                                }}>
                                                <Zap className="w-3.5 h-3.5" />
                                                {hasPos ? `Execute ${dec} (Active)` : `Execute ${dec}`}
                                            </motion.button>
                                        );
                                    })()}
                                </div>
                            </Panel>

                            {/* Strength & Alignment Mini Panel */}
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
    );
}
