import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { History, X } from "lucide-react";
import type { TradingSignalsTableModel } from "./useTradingSignalsTableModel";

type Props = { m: TradingSignalsTableModel };

export function TradingSignalsAutoLogsModal({ m }: Props) {
    const { tk, showAutoHistoryModal, setShowAutoHistoryModal, serverAutoLogs } = m;

    return (
        <AnimatePresence>
            {showAutoHistoryModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAutoHistoryModal(false)}
                        className="absolute inset-0 top-0 left-0 w-full h-full bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
                        style={{ background: tk.surface, border: `1px solid ${tk.border}` }}
                    >
                        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: tk.border, background: tk.surfaceElevated }}>
                            <div className="flex items-center gap-3">
                                <History className="w-5 h-5 text-pink-400" />
                                <h3 className="text-sm font-black tracking-widest uppercase text-pink-400">Auto Trade Event Logs</h3>
                            </div>
                            <button type="button" onClick={() => setShowAutoHistoryModal(false)} className="p-1.5 rounded-lg hover:bg-slate-500/10 transition-colors">
                                <X className="w-5 h-5" style={{ color: tk.textDim }} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                            {serverAutoLogs.length === 0 ? (
                                <div className="py-10 text-center flex flex-col items-center justify-center opacity-70">
                                    <History className="w-10 h-10 mb-3 text-slate-500" />
                                    <span className="text-sm font-bold text-slate-400">No auto trade history found</span>
                                </div>
                            ) : (
                                <table className="w-full text-left" style={{ borderCollapse: "collapse", background: tk.surface }}>
                                    <thead className="sticky top-0 z-10" style={{ background: tk.isDark ? "#020617" : tk.surface }}>
                                        <tr style={{ borderBottom: `1px solid ${tk.border}` }}>
                                            {["Time", "Symbol", "Source", "Action", "Direction", "Details"].map((h) => (
                                                <th key={h} className="px-3 py-2 text-[10px] font-black tracking-wider uppercase" style={{ color: tk.textDim }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {serverAutoLogs.map((log: Record<string, unknown>, i: number) => {
                                            const isBuy = String(log.new_direction || "").toLowerCase() === "buy";
                                            const isError = log.action === "ERROR";
                                            return (
                                                <tr
                                                    key={`${String(log.id ?? "")}-${i}`}
                                                    className="hover:bg-slate-500/5 transition-colors group"
                                                    style={{ borderBottom: `1px solid ${tk.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}` }}
                                                >
                                                    <td className="px-3 py-2 text-[10px] whitespace-nowrap" style={{ color: tk.textDim }}>
                                                        {new Date(String(log.created_at)).toLocaleString("en-US", {
                                                            hour12: false,
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            second: "2-digit",
                                                        })}
                                                    </td>
                                                    <td className="px-3 py-2 text-[11px] font-black drop-shadow-sm" style={{ color: tk.textPrimary }}>{String(log.symbol || "-")}</td>
                                                    <td className="px-3 py-2 text-[10px] font-bold font-mono text-purple-400/80">
                                                        {log.main_tf}/{log.sub_tf} <span className="text-pink-500/70">(W{log.window_size})</span>
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <span
                                                            className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase"
                                                            style={{
                                                                color: isError ? "#ef4444" : log.action === "CREATED" ? "#3b82f6" : log.action === "CLOSED" ? "#64748b" : "#f59e0b",
                                                                background: isError
                                                                    ? "rgba(239,68,68,0.1)"
                                                                    : log.action === "CREATED"
                                                                      ? "rgba(59,130,246,0.1)"
                                                                      : log.action === "CLOSED"
                                                                        ? "rgba(100,116,139,0.1)"
                                                                        : "rgba(245,158,11,0.1)",
                                                            }}
                                                        >
                                                            {String(log.action)}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <span
                                                            className="text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm"
                                                            style={{
                                                                color: isBuy ? "#10b981" : "#ef4444",
                                                                background: isBuy ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                                                            }}
                                                        >
                                                            {String(log.new_direction || "-").toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2 text-[10px] leading-relaxed" style={{ color: tk.textDim }}>
                                                        {String(log.details || "-")}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
