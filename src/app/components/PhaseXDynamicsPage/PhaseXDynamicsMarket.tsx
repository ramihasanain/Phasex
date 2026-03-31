import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Activity } from "lucide-react";
import type { MarketCategory, AnalysisTab } from "../PhaseX/types";
import { symbolsData } from "../PhaseX/symbolsData";
import { marketCategories, symbolIcons } from "../PhaseX/marketCategories";
import { analysisTabs, analysisTabIcons, symbolToJsonKey } from "../PhaseX/constants";
import type { PhaseXCtx } from "./usePhaseXDynamicsPage";

export function PhaseXDynamicsMarket({ ctx }: { ctx: PhaseXCtx }) {
    const {
        selectedTab,
        setSelectedTab,
        selectedCategory,
        selectedSymbol,
        setSelectedSymbol,
        filterOpen,
        setFilterOpen,
        handleCategoryChange,
        accent,
        accentG,
        isRTL,
        lang,
        t,
        tv,
        tvTab,
        sources,
    } = ctx;

    return (
        <>
            {selectedTab !== "Decision Engine" && (
                <div className="mb-3">
                    <motion.button onClick={() => setFilterOpen(!filterOpen)}
                        className="flex items-center gap-3 mb-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all"
                        style={{
                            background: filterOpen ? `${accentG}0.08)` : "rgba(255,255,255,0.03)",
                            border: filterOpen ? `1px solid ${accentG}0.2)` : "1px solid rgba(255,255,255,0.06)",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}>
                        <Activity className="w-4 h-4" style={{ color: filterOpen ? accent : "#6b7280" }} />
                        <span className="text-[12px] tracking-[0.15em] uppercase font-bold" style={{ color: filterOpen ? accent : "#6b7280" }}>{t.marketFilter}</span>
                        <motion.div animate={{ rotate: filterOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                            <ChevronDown className="w-4 h-4" style={{ color: filterOpen ? accent : "#6b7280" }} />
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

            <AnimatePresence mode="wait">
                {filterOpen && selectedTab !== "Decision Engine" && (
                    <motion.div key={selectedCategory}
                        className="mb-4 flex items-center gap-2 flex-wrap"
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35 }}>
                        {(() => {
                            const cat = marketCategories.find(c => c.name === selectedCategory);
                            if (!cat?.symbols.length) return null;

                            const availableSymbols = cat.symbols.filter(sym => {
                                const jsonKey = symbolToJsonKey[sym];
                                if (!jsonKey) return false;

                                for (const tab in sources) {
                                    for (const stageData of sources[tab as AnalysisTab]) {
                                        if (stageData && stageData[jsonKey]) {
                                            return true;
                                        }
                                    }
                                }
                                return false;
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
                                                ? `linear-gradient(135deg, ${symBullish ? "rgba(0,230,118," : "rgba(255,23,68,"}0.12) 0%, rgba(10,16,26,0.9) 100%)`
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
                                        {isActive && (
                                            <motion.div className="absolute inset-0 pointer-events-none"
                                                style={{ background: `linear-gradient(90deg, transparent 20%, ${symColor}10 50%, transparent 80%)` }}
                                                animate={{ x: ["-100%", "200%"] }}
                                                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} />
                                        )}
                                        <motion.span className="text-2xl relative z-10"
                                            animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                                            transition={{ duration: 1.5, repeat: Infinity }}>
                                            {info.icon}
                                        </motion.span>
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
                                        {info.flag && (
                                            <span className="text-sm relative z-10 opacity-60">{info.flag}</span>
                                        )}
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

            <div className="mb-4">
                <div className="h-px w-full mb-3" style={{ background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.04) 70%, transparent 95%)" }} />
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
        </>
    );
}
