import { motion, AnimatePresence } from "motion/react";
import { Zap, X } from "lucide-react";
import { PhaseXBotIcon } from "../PhaseX/PhaseXBotIcon";
import { SupercarGauge } from "../PhaseX/UIComponents";
import { getAIMarketInsightText } from "../PhaseX/aiMarketInsightLogic";
import { symbolIcons } from "../PhaseX/marketCategories";
import { SpeedStreaks, EnergyWaves, RacingParticles, LEDBorderPulse, HeatHaze } from "../PhaseX/CinematicEffects";
import { SciFiClock } from "../SciFiClock";
import { getTrendColor } from "./phaseXDynamicsHelpers";
import type { PhaseXCtx } from "./usePhaseXDynamicsPage";

export function PhaseXDynamicsBanner({ ctx }: { ctx: PhaseXCtx }) {
    const {
        data,
        accent,
        accentG,
        confColor,
        confColorG,
        isRTL,
        lang,
        globalT,
        t,
        tv,
        selectedSymbol,
        isAiPanelOpen,
        setIsAiPanelOpen,
        lastSystemUpdate,
        mt5Positions,
        isLoggedIn,
        setIsLoginPromptOpen,
        setTradeModalState,
        setTradeSymbolOverride,
        setTradeSL,
        setTradeTP,
        setTradeError,
    } = ctx;

    return (
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

            <div
                className="flex flex-col min-[1200px]:flex-row min-[1200px]:items-stretch gap-4 min-[1200px]:gap-0 relative z-20 w-full"
                style={{
                    background: `linear-gradient(135deg, rgba(8,12,20,0.75) 0%, rgba(10,16,26,0.7) 40%, rgba(8,12,20,0.6) 100%)`,
                    borderRadius: "16px",
                }}
            >
                {/* ════  AI FLOATING BOT  ════ */}
                <div
                    className={`relative z-50 flex flex-col items-center justify-center gap-1.5 py-2 shrink-0 min-[1200px]:absolute min-[1200px]:top-[45%] min-[1200px]:-translate-y-1/2 ${isRTL ? "min-[1200px]:right-8" : "min-[1200px]:left-8"}`}
                >
                    {/* Outer attention ring */}
                    <div className="relative">
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
                    {/* Label: Click for Description */}
                    <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="text-[8px] font-bold tracking-wide whitespace-nowrap px-2 py-0.5 rounded-md text-center"
                        style={{
                            color: accent,
                            background: `${accentG}0.08)`,
                            border: `1px solid ${accentG}0.15)`,
                            textShadow: `0 0 8px ${accentG}0.4)`,
                        }}
                    >
                        {globalT("clickForDescription")}
                    </motion.span>
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

                            <div className="px-6 sm:px-10 lg:px-14 py-6 sm:py-8 relative z-10 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center h-full">
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

                <div
                    className={`flex-1 w-full min-w-0 px-4 sm:px-6 min-[1200px]:px-8 py-2 min-[1200px]:py-1 ${isRTL ? "min-[1200px]:pe-36" : "min-[1200px]:ps-36"}`}
                >
                    <div className="text-[11px] sm:text-[13px] text-gray-600 tracking-[0.2em] sm:tracking-[0.25em] uppercase mt-2 sm:mt-3 mb-1 font-semibold flex items-center gap-3 justify-center min-[1200px]:justify-start">
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

                    <motion.h2 className="text-[clamp(1.75rem,6vw,3rem)] min-[1200px]:text-[48px] font-black tracking-tight mb-6 min-[1200px]:mb-8 leading-none z-10 relative text-center min-[1200px]:text-start"
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
                    <div className="mt-4 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6 min-[1200px]:gap-8 mb-6 w-full relative z-30">
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

                                    {/* Quick BUY / SELL buttons */}
                                    {(() => {
                                        const buyComment = `PX-SD ${selectedSymbol} BUY`.slice(0, 31);
                                        const sellComment = `PX-SD ${selectedSymbol} SELL`.slice(0, 31);
                                        const hasBuyPos = (mt5Positions || []).some((p: any) => p.comment === buyComment);
                                        const hasSellPos = (mt5Positions || []).some((p: any) => p.comment === sellComment);

                                        return (
                                            <div className="flex items-center gap-1.5 mt-2 relative z-10">
                                                <motion.button
                                                    disabled={hasBuyPos}
                                                    whileHover={{ scale: hasBuyPos ? 1 : 1.08 }} whileTap={{ scale: hasBuyPos ? 1 : 0.94 }}
                                                    onClick={() => {
                                                        if (hasBuyPos) return;
                                                        if (!isLoggedIn) { setIsLoginPromptOpen(true); return; }
                                                        setTradeModalState({ isOpen: true, symbol: selectedSymbol, decision: 'BUY' });
                                                        setTradeSymbolOverride(selectedSymbol);
                                                        setTradeSL(""); setTradeTP(""); setTradeError(null);
                                                    }}
                                                    className="px-3 py-1 rounded-lg text-[10px] font-black tracking-wider cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                    style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
                                                    {hasBuyPos ? "BUY (Active)" : "BUY"}
                                                </motion.button>
                                                <motion.button
                                                    disabled={hasSellPos}
                                                    whileHover={{ scale: hasSellPos ? 1 : 1.08 }} whileTap={{ scale: hasSellPos ? 1 : 0.94 }}
                                                    onClick={() => {
                                                        if (hasSellPos) return;
                                                        if (!isLoggedIn) { setIsLoginPromptOpen(true); return; }
                                                        setTradeModalState({ isOpen: true, symbol: selectedSymbol, decision: 'SELL' });
                                                        setTradeSymbolOverride(selectedSymbol);
                                                        setTradeSL(""); setTradeTP(""); setTradeError(null);
                                                    }}
                                                    className="px-3 py-1 rounded-lg text-[10px] font-black tracking-wider cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                    style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                                                    {hasSellPos ? "SELL (Active)" : "SELL"}
                                                </motion.button>
                                            </div>
                                        );
                                    })()}
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
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[13px] sm:text-[15px] w-full">
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
                    <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[13px] sm:text-[15px] w-full">
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

                <div className="flex justify-center min-[1200px]:justify-end w-full min-[1200px]:w-auto shrink-0 px-2 pb-3 min-[1200px]:px-0 min-[1200px]:pb-0 min-[1200px]:pr-6 relative">
                    <div className="flex flex-col min-[480px]:flex-row items-center gap-4">
                        {/* Score & Confidence Numbers */}
                        <div className="flex flex-col gap-3 items-center min-[1200px]:items-end">
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
    );
}
