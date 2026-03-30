import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Minus, ShieldAlert } from "lucide-react";
import type { TradeSignalResponse } from "../../hooks/useAITradeSignal";
import type { ThemeTokens } from "../../hooks/useThemeTokens";
import type { AiTradeSignalTxt } from "./aiTradeSignalTranslations";
import type { AiSignalColors } from "./types";

type Props = {
    signal: TradeSignalResponse;
    colors: AiSignalColors;
    tk: ThemeTokens;
    txt: AiTradeSignalTxt;
    indicatorName?: string;
};

export function AITradeSignalWidgetSignalHero({ signal, colors, tk, txt, indicatorName }: Props) {
    return (
        <>
            <div
                className="text-center py-3 relative rounded-xl overflow-hidden"
                style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
            >
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(rgba(${colors.rgb},0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(${colors.rgb},0.04) 1px, transparent 1px)`,
                        backgroundSize: "20px 20px",
                    }}
                />

                <div
                    className="absolute -top-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full z-10 backdrop-blur-md"
                    style={{
                        background: tk.isDark ? "rgba(6,10,16,0.9)" : "rgba(255,255,255,0.9)",
                        border: `1px solid ${colors.border}`,
                        boxShadow: tk.isDark ? "none" : "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                >
                    <span className="text-[8px] tracking-[0.15em] font-bold" style={{ color: colors.text }}>
                        {txt.focus}
                    </span>
                    <span
                        className="text-[8px] font-black tracking-widest px-1.5 rounded"
                        style={{ background: `rgba(${colors.rgb},0.15)`, color: colors.text }}
                    >
                        {indicatorName || "PHASE X"}
                    </span>
                    <span
                        className="text-[8px] font-black tracking-widest px-1.5 rounded"
                        style={{ background: `rgba(${colors.rgb},0.1)`, color: colors.text }}
                    >
                        {signal.timeframeString}
                    </span>
                </div>

                <div className="flex items-center justify-center gap-2.5 mt-4 relative z-10">
                    {signal.action === "BUY" && <TrendingUp className="w-5 h-5" style={{ color: colors.text }} />}
                    {signal.action === "SELL" && <TrendingDown className="w-5 h-5" style={{ color: colors.text }} />}
                    {signal.action === "HOLD" && <Minus className="w-5 h-5" style={{ color: colors.text }} />}
                    <motion.h1
                        className="text-3xl font-black tracking-[0.3em]"
                        style={{ color: colors.text, textShadow: `0 0 20px rgba(${colors.rgb},0.4)` }}
                        animate={{
                            textShadow: [
                                `0 0 15px rgba(${colors.rgb},0.3)`,
                                `0 0 30px rgba(${colors.rgb},0.5)`,
                                `0 0 15px rgba(${colors.rgb},0.3)`,
                            ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        {signal.action}
                    </motion.h1>
                </div>
                <div className="mt-1 text-[9px] tracking-[0.15em] font-bold relative z-10" style={{ color: tk.textDim }}>
                    CONFIDENCE · <strong style={{ color: colors.text }}>{signal.confidence}%</strong>
                </div>
            </div>

            {(signal.targets?.entry || signal.targets?.tp1 || signal.targets?.sl) && (
                <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        {signal.targets.entry && (
                            <div
                                className="p-2.5 rounded-xl"
                                style={{
                                    background: `rgba(${colors.rgb},0.04)`,
                                    border: `1px solid rgba(${colors.rgb},0.1)`,
                                }}
                            >
                                <div className="text-[8px] tracking-[0.15em] font-bold mb-1" style={{ color: tk.textDim }}>
                                    {txt.entryProtocol}
                                </div>
                                <div className="text-xs font-black truncate" style={{ color: tk.textBright }}>
                                    {signal.targets.entry}
                                </div>
                            </div>
                        )}
                        {signal.targets.tp1 && (
                            <div
                                className="p-2.5 rounded-xl"
                                style={{ background: tk.positiveBg, border: `1px solid ${tk.positiveBorder}` }}
                            >
                                <div className="text-[8px] tracking-[0.15em] font-bold mb-1" style={{ color: tk.textDim }}>
                                    {txt.targetPrimary}
                                </div>
                                <div className="text-xs font-black truncate" style={{ color: tk.positive }}>
                                    {signal.targets.tp1}
                                </div>
                            </div>
                        )}
                    </div>
                    {signal.targets.sl && (
                        <div
                            className="p-2.5 rounded-xl"
                            style={{ background: tk.negativeBg, border: `1px solid ${tk.negativeBorder}` }}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="text-[8px] tracking-[0.15em] font-bold" style={{ color: tk.textDim }}>
                                    {txt.abortLevel}
                                </div>
                                <ShieldAlert className="w-3 h-3" style={{ color: tk.negative, opacity: 0.4 }} />
                            </div>
                            <div className="text-xs font-black" style={{ color: tk.negative }}>
                                {signal.targets?.sl || "N/A"}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
