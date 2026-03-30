import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Target, BarChart2 } from "lucide-react";
import type { ThemeTokens } from "../../hooks/useThemeTokens";
import type { MarketWatchSummary } from "./types";

type Props = {
    tk: ThemeTokens;
    summary: MarketWatchSummary;
};

export function MarketWatchModalSummaryCards({ tk, summary }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-6 relative" style={{ background: tk.isDark ? "#0b0e14" : "#f1f5f9" }}>
            <motion.div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{ background: "linear-gradient(90deg, transparent, #6366f1, transparent)" }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <div
                className="rounded-2xl p-5 border relative overflow-hidden group transition-all duration-500 hover:scale-[1.02]"
                style={{
                    background: tk.isDark
                        ? "linear-gradient(180deg, rgba(16,185,129,0.05), rgba(0,0,0,0))"
                        : "linear-gradient(180deg, rgba(16,185,129,0.05), #ffffff)",
                    border: `1px solid ${summary.totalProfit >= 0 ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                    boxShadow: `0 8px 30px ${summary.totalProfit >= 0 ? "rgba(16,185,129,0.05)" : "rgba(239,68,68,0.05)"}`,
                }}
            >
                <div className="absolute -right-10 -top-10 w-40 h-40 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
                    {summary.totalProfit >= 0 ? (
                        <TrendingUp className="w-full h-full text-emerald-500" />
                    ) : (
                        <TrendingDown className="w-full h-full text-red-500" />
                    )}
                </div>
                <div
                    className="absolute top-0 left-0 w-1.5 h-full"
                    style={{
                        background: summary.totalProfit >= 0 ? "#10b981" : "#ef4444",
                        boxShadow: `0 0 15px ${summary.totalProfit >= 0 ? "#10b981" : "#ef4444"}`,
                    }}
                />

                <div className="pl-4">
                    <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: tk.textDim }}>
                        <div className="w-1 h-1 rounded-full bg-current opacity-50" />
                        Total Net Profit
                    </span>
                    <div
                        className="text-4xl font-black font-mono tracking-tight"
                        style={{
                            color: summary.totalProfit >= 0 ? "#10b981" : "#ef4444",
                            textShadow: `0 0 20px ${summary.totalProfit >= 0 ? "rgba(16,185,129,0.5)" : "rgba(239,68,68,0.5)"}`,
                        }}
                    >
                        {summary.totalProfit >= 0 ? "+" : ""}
                        {summary.totalProfit.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono tracking-widest text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20">
                            LIVE
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-[0.1em]" style={{ color: tk.textDim }}>
                            Portfolio Delta
                        </span>
                    </div>
                </div>
            </div>

            <div
                className="rounded-2xl p-5 border relative overflow-hidden group transition-all duration-500 hover:scale-[1.02]"
                style={{
                    background: tk.isDark
                        ? "linear-gradient(180deg, rgba(99,102,241,0.05), rgba(0,0,0,0))"
                        : "linear-gradient(180deg, rgba(99,102,241,0.05), #ffffff)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    boxShadow: "0 8px 30px rgba(99,102,241,0.05)",
                }}
            >
                <div className="absolute -right-8 -bottom-8 w-32 h-32 opacity-[0.08] group-hover:opacity-15 transition-opacity duration-500 pointer-events-none">
                    <Target className="w-full h-full text-indigo-500" />
                </div>
                <div className="absolute top-0 right-10 w-20 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: tk.textDim }}>
                    <div className="w-1 h-1 rounded-full bg-current opacity-50" />
                    Apex Performer
                </span>
                {summary.bestSymbol ? (
                    <>
                        <div className="text-2xl font-black tracking-wider mt-1 drop-shadow-md" style={{ color: tk.textPrimary }}>
                            {summary.bestSymbol.symbol}
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                            <div
                                className="text-lg font-black font-mono drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                                style={{ color: "#10b981" }}
                            >
                                +{summary.bestSymbol.profit.toFixed(2)}
                            </div>
                            <div className="px-2 py-0.5 rounded text-[9px] font-mono tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">
                                MAX THRUST
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-sm font-mono mt-4 opacity-50" style={{ color: tk.textDim }}>
                        // NO DATA
                    </div>
                )}
            </div>

            <div
                className="rounded-2xl p-5 border relative overflow-hidden group transition-all duration-500 hover:scale-[1.02]"
                style={{
                    background: tk.isDark
                        ? "linear-gradient(180deg, rgba(245,158,11,0.05), rgba(0,0,0,0))"
                        : "linear-gradient(180deg, rgba(245,158,11,0.05), #ffffff)",
                    border: "1px solid rgba(245,158,11,0.3)",
                    boxShadow: "0 8px 30px rgba(245,158,11,0.05)",
                }}
            >
                <div className="absolute -right-8 -bottom-8 w-32 h-32 opacity-[0.08] group-hover:opacity-15 transition-opacity duration-500 pointer-events-none">
                    <BarChart2 className="w-full h-full text-amber-500" />
                </div>
                <div className="absolute bottom-0 right-10 w-20 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: tk.textDim }}>
                    <div className="w-1 h-1 rounded-full bg-current opacity-50" />
                    High Drag
                </span>
                {summary.worstSymbol ? (
                    <>
                        <div className="text-2xl font-black tracking-wider mt-1 drop-shadow-md" style={{ color: tk.textPrimary }}>
                            {summary.worstSymbol.symbol}
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                            <div
                                className="text-lg font-black font-mono drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                                style={{ color: "#ef4444" }}
                            >
                                {summary.worstSymbol.profit.toFixed(2)}
                            </div>
                            <div className="px-2 py-0.5 rounded text-[9px] font-mono tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20">
                                CRITICAL
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-sm font-mono mt-4 opacity-50" style={{ color: tk.textDim }}>
                        // NO DATA
                    </div>
                )}
            </div>
        </div>
    );
}
