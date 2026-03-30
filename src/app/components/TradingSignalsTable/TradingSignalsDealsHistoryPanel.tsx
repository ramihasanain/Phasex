import React from "react";
import { motion } from "motion/react";
import { ChevronDown, ChevronUp, Download, History } from "lucide-react";
import type { TradingSignalsTableModel } from "./useTradingSignalsTableModel";

type Props = { m: TradingSignalsTableModel };

export function TradingSignalsDealsHistoryPanel({ m }: Props) {
    const {
        tk,
        mt5Connected,
        tradeHistory,
        showHistory,
        setShowHistory,
        historyLimit,
        setHistoryLimit,
        clearServerHistory,
    } = m;

    if (!mt5Connected) return null;

    return (
        <div
            className="mx-6 mb-3 rounded-xl overflow-hidden"
            style={{
                border: "1px solid rgba(168,85,247,0.15)",
                background: tk.isDark ? "rgba(168,85,247,0.02)" : "rgba(168,85,247,0.02)",
            }}
        >
            <div
                className="flex items-center justify-between px-5 py-3 cursor-pointer select-none transition-colors hover:bg-indigo-500/10"
                style={{
                    borderBottom: showHistory ? "1px solid rgba(168,85,247,0.06)" : "none",
                    background: "rgba(99,102,241,0.05)",
                }}
                onClick={() => setShowHistory(!showHistory)}
            >
                <div className="flex items-center gap-3">
                    <History className="w-5 h-5 text-indigo-400" />
                    <span className="text-[12px] font-black uppercase tracking-wider text-indigo-400">Trade History</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400">{tradeHistory.length}</span>
                    {showHistory ? (
                        <ChevronUp className="w-4 h-4 text-indigo-400 opacity-50 ml-2" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-indigo-400 opacity-50 ml-2" />
                    )}
                </div>
                {showHistory && tradeHistory.length > 0 && (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()} role="presentation">
                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                const headers = ["Symbol", "Deal", "Order", "Position", "Time", "Type", "Direction", "Size", "Close price", "Commission", "Swap", "Comment"];
                                const rows = tradeHistory.map((t: Record<string, unknown>) =>
                                    [
                                        t.symbol || "",
                                        t.ticket || "",
                                        t.order || "",
                                        t.position || "",
                                        t.time || "",
                                        t.type || "",
                                        t.entry || "",
                                        t.volume || "",
                                        t.price || "",
                                        t.commission || "",
                                        t.swap || "",
                                        t.comment || "",
                                    ]
                                        .map((v) => `"${v}"`)
                                        .join(","),
                                );
                                const csv = [headers.join(","), ...rows].join("\n");
                                const blob = new Blob([csv], { type: "text/csv" });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `phasex_deals_history_${new Date().toISOString().slice(0, 10)}.csv`;
                                a.click();
                                URL.revokeObjectURL(url);
                            }}
                            className="flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                            style={{ color: "#10b981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.15)" }}
                        >
                            <Download className="w-3 h-3" /> CSV
                        </motion.button>
                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => clearServerHistory?.()}
                            className="text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                            style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.15)" }}
                        >
                            Clear All
                        </motion.button>
                    </div>
                )}
            </div>

            {showHistory && (
                <div className="overflow-auto custom-scrollbar" style={{ maxHeight: 400 }}>
                    {tradeHistory.length === 0 ? (
                        <div className="py-10 text-center" style={{ background: tk.surface }}>
                            <History className="w-10 h-10 mx-auto mb-3" style={{ color: tk.textDim, opacity: 0.4 }} />
                            <span className="text-sm font-bold" style={{ color: tk.textDim }}>No trades executed yet</span>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <table className="w-full text-left" style={{ borderCollapse: "collapse", background: tk.surface }}>
                                <thead className="sticky top-0 z-10" style={{ background: tk.isDark ? "#020617" : tk.surface }}>
                                    <tr style={{ borderBottom: "1px solid rgba(99,102,241,0.06)" }}>
                                        {["Symbol", "Deal", "Order", "Position", "Time", "Type", "Direction", "Size", "Close price", "Comission", "Swap"].map((h) => (
                                            <th key={h} className="px-3 py-2 text-[10px] font-black tracking-wider uppercase" style={{ color: tk.textDim }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tradeHistory.slice(0, historyLimit).map((th: Record<string, number | string | undefined>, i: number) => (
                                        <tr
                                            key={`${th.ticket}-${i}`}
                                            className="hover:bg-indigo-500/5 transition-colors"
                                            style={{ borderBottom: `1px solid ${tk.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}` }}
                                        >
                                            <td className="px-3 py-2 text-[11px] font-black drop-shadow-sm" style={{ color: tk.textPrimary }}>{th.symbol}</td>
                                            <td className="px-3 py-2 text-[10px] font-mono" style={{ color: tk.textSecondary }}>{th.ticket}</td>
                                            <td className="px-3 py-2 text-[10px] font-mono" style={{ color: tk.textSecondary }}>{th.order}</td>
                                            <td className="px-3 py-2 text-[10px] font-mono" style={{ color: tk.textSecondary }}>{th.position}</td>
                                            <td className="px-3 py-2 text-[10px] font-mono" style={{ color: tk.textSecondary }}>{th.time}</td>
                                            <td className="px-3 py-2 text-[11px] font-bold" style={{ color: tk.textPrimary }}>{th.type}</td>
                                            <td className="px-3 py-2 text-[11px] font-bold" style={{ color: tk.textSecondary }}>{th.entry}</td>
                                            <td className="px-3 py-2 text-[11px] font-bold font-mono text-amber-500">{typeof th.volume === "number" && th.volume > 0 ? th.volume : ""}</td>
                                            <td className="px-3 py-2 text-[11px] font-mono" style={{ color: tk.textPrimary }}>{typeof th.price === "number" && th.price > 0 ? th.price : ""}</td>
                                            <td className="px-3 py-2 text-[11px] font-mono" style={{ color: tk.textSecondary }}>
                                                {typeof th.commission === "number" ? th.commission.toFixed(2) : ""}
                                            </td>
                                            <td className="px-3 py-2 text-[11px] font-mono" style={{ color: tk.textSecondary }}>
                                                {typeof th.swap === "number" ? th.swap.toFixed(2) : ""}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {tradeHistory.length > historyLimit && (
                                <div className="flex justify-center p-3" style={{ background: tk.surface }}>
                                    <button
                                        type="button"
                                        onClick={() => setHistoryLimit((p) => p + 100)}
                                        className="px-4 py-1.5 text-[11px] font-black rounded cursor-pointer transition-all hover:bg-indigo-500/20"
                                        style={{ color: "#818cf8", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
                                    >
                                        Load More
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
