import React from "react";
import { motion } from "motion/react";
import { ChevronDown, ChevronUp, History, X } from "lucide-react";
import type { TradingSignalsTableModel } from "./useTradingSignalsTableModel";

type Props = { m: TradingSignalsTableModel };

export function TradingSignalsAutoBackgroundPanel({ m }: Props) {
    const {
        tk,
        isRTL,
        mt5Connected,
        showAutoLogs,
        setShowAutoLogs,
        fetchAutoLogs,
        serverAutoTrades,
        autoFilterSymbol,
        setAutoFilterSymbol,
        autoFilterDir,
        setAutoFilterDir,
        autoFilterSource,
        setAutoFilterSource,
        removeAutoTrade,
        stopAllAutoTrades,
        nextCheckStr,
        setShowAutoHistoryModal,
    } = m;

    if (!mt5Connected) return null;

    const filteredCountBadge =
        autoFilterSymbol !== "ALL" || autoFilterDir !== "ALL" || autoFilterSource !== "ALL"
            ? `${serverAutoTrades.filter((at) => {
                  if (autoFilterSymbol !== "ALL" && at.symbol !== autoFilterSymbol) return false;
                  if (autoFilterDir !== "ALL" && at.current_direction?.toUpperCase() !== autoFilterDir) return false;
                  if (autoFilterSource !== "ALL" && `${at.main_tf}/${at.sub_tf}` !== autoFilterSource) return false;
                  return true;
              }).length}/${serverAutoTrades.length}`
            : serverAutoTrades.length;

    return (
        <div
            className="mx-6 mb-3 rounded-xl overflow-hidden"
            style={{
                border: "1px solid rgba(236,72,153,0.15)",
                background: tk.isDark ? "rgba(236,72,153,0.02)" : "rgba(236,72,153,0.02)",
            }}
        >
            <div
                className="flex items-center justify-between px-5 py-3 cursor-pointer select-none transition-colors hover:bg-pink-500/10"
                style={{
                    borderBottom: showAutoLogs ? "1px solid rgba(236,72,153,0.06)" : "none",
                    background: "rgba(236,72,153,0.05)",
                }}
                onClick={() => {
                    setShowAutoLogs(!showAutoLogs);
                    if (!showAutoLogs && fetchAutoLogs) fetchAutoLogs();
                }}
            >
                <div className="flex items-center gap-3">
                    <History className="w-5 h-5 text-pink-400" />
                    <span className="text-[12px] font-black uppercase tracking-wider text-pink-400 whitespace-nowrap">Background Auto Trades</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-400">{filteredCountBadge}</span>

                    {showAutoLogs && serverAutoTrades.length > 0 && (() => {
                        const activeBuyCount = serverAutoTrades.filter((at) => at.current_direction?.toUpperCase() === "BUY").length;
                        const activeSellCount = serverAutoTrades.filter((at) => at.current_direction?.toUpperCase() === "SELL").length;
                        return (
                            <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-black/20 rounded-lg border border-pink-500/10">
                                <div className="flex items-center gap-1.5 border-r border-pink-500/10 pr-2">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{isRTL ? "مراكز حالية" : "Current"}</span>
                                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-1 rounded shadow-sm drop-shadow whitespace-nowrap">{activeBuyCount} B</span>
                                    <span className="text-[10px] font-black text-red-400 bg-red-500/10 px-1 rounded shadow-sm drop-shadow whitespace-nowrap">{activeSellCount} S</span>
                                </div>
                                <div className="flex items-center gap-1.5 pl-1">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{isRTL ? "بانتظار" : "Waiting"}</span>
                                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-1 rounded shadow-sm drop-shadow opacity-80 whitespace-nowrap">{activeSellCount} B</span>
                                    <span className="text-[10px] font-black text-red-400 bg-red-500/5 border border-red-500/20 px-1 rounded shadow-sm drop-shadow opacity-80 whitespace-nowrap">{activeBuyCount} S</span>
                                </div>
                            </div>
                        );
                    })()}
                    {showAutoLogs ? (
                        <ChevronUp className="w-4 h-4 text-pink-400 opacity-50 ml-auto" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-pink-400 opacity-50 ml-auto" />
                    )}
                </div>
                {showAutoLogs && (
                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()} role="presentation">
                        {nextCheckStr && (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded border border-pink-500/20 bg-pink-500/10 animate-pulse">
                                <span className="text-[9px] font-black uppercase tracking-wider text-pink-300">{isRTL ? "الفحص القادم" : "Next Check"}:</span>
                                <span className="text-[10px] font-mono font-black text-pink-200">{nextCheckStr}</span>
                            </div>
                        )}
                        {serverAutoTrades.length > 0 && stopAllAutoTrades && (
                            <motion.button
                                type="button"
                                whileTap={{ scale: 0.95 }}
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    const btn = document.getElementById("mt5-stop-btn") as HTMLButtonElement;
                                    if (btn) btn.innerHTML = "Stopping...";
                                    await stopAllAutoTrades();
                                    setTimeout(() => {
                                        if (btn) btn.innerHTML = "Stop All";
                                    }, 1000);
                                }}
                                id="mt5-stop-btn"
                                className="text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                                style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                            >
                                Stop All
                            </motion.button>
                        )}
                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (fetchAutoLogs) fetchAutoLogs();
                                setShowAutoHistoryModal(true);
                            }}
                            className="flex items-center justify-center p-1.5 rounded-lg cursor-pointer transition-colors"
                            style={{ color: "#ec4899", background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.15)" }}
                            title="Auto Trade History"
                        >
                            <History className="w-4 h-4" />
                        </motion.button>
                    </div>
                )}
            </div>

            {showAutoLogs && (() => {
                const uniqueSymbols = Array.from(new Set(serverAutoTrades.map((at) => at.symbol).filter(Boolean))).sort();
                const uniqueSources = Array.from(new Set(serverAutoTrades.map((at) => `${at.main_tf}/${at.sub_tf}`).filter(Boolean))).sort();

                const filteredAutoTrades = serverAutoTrades.filter((at) => {
                    if (autoFilterSymbol !== "ALL" && at.symbol !== autoFilterSymbol) return false;
                    if (autoFilterDir !== "ALL" && at.current_direction?.toUpperCase() !== autoFilterDir) return false;
                    if (autoFilterSource !== "ALL" && `${at.main_tf}/${at.sub_tf}` !== autoFilterSource) return false;
                    return true;
                });

                const hasActiveFilters = autoFilterSymbol !== "ALL" || autoFilterDir !== "ALL" || autoFilterSource !== "ALL";

                return (
                    <div>
                        {serverAutoTrades.length > 0 && (
                            <div
                                className="flex flex-wrap items-center gap-2 px-4 py-2.5"
                                style={{
                                    background: tk.isDark ? "rgba(236,72,153,0.03)" : "rgba(236,72,153,0.02)",
                                    borderBottom: "1px solid rgba(236,72,153,0.06)",
                                }}
                            >
                                <div className="flex items-center gap-1">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mr-0.5">Symbol</span>
                                    <button
                                        type="button"
                                        onClick={() => setAutoFilterSymbol("ALL")}
                                        className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${autoFilterSymbol === "ALL" ? "text-pink-300 bg-pink-500/20 shadow-sm" : "text-slate-500 hover:text-slate-300 bg-transparent"}`}
                                        style={{ border: autoFilterSymbol === "ALL" ? "1px solid rgba(236,72,153,0.3)" : "1px solid transparent" }}
                                    >
                                        All
                                    </button>
                                    {uniqueSymbols.map((sym) => (
                                        <button
                                            type="button"
                                            key={sym}
                                            onClick={() => setAutoFilterSymbol(autoFilterSymbol === sym ? "ALL" : sym)}
                                            className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${autoFilterSymbol === sym ? "text-pink-300 bg-pink-500/20 shadow-sm" : "text-slate-500 hover:text-slate-300 bg-transparent"}`}
                                            style={{ border: autoFilterSymbol === sym ? "1px solid rgba(236,72,153,0.3)" : "1px solid transparent" }}
                                        >
                                            {sym}
                                        </button>
                                    ))}
                                </div>
                                <div className="w-px h-4 bg-pink-500/10" />
                                <div className="flex items-center gap-1">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mr-0.5">Dir</span>
                                    {["ALL", "BUY", "SELL"].map((d) => (
                                        <button
                                            type="button"
                                            key={d}
                                            onClick={() => setAutoFilterDir(d)}
                                            className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${autoFilterDir === d ? `${d === "BUY" ? "text-emerald-300 bg-emerald-500/20" : d === "SELL" ? "text-red-300 bg-red-500/20" : "text-pink-300 bg-pink-500/20"} shadow-sm` : "text-slate-500 hover:text-slate-300 bg-transparent"}`}
                                            style={{
                                                border:
                                                    autoFilterDir === d
                                                        ? `1px solid ${d === "BUY" ? "rgba(16,185,129,0.3)" : d === "SELL" ? "rgba(239,68,68,0.3)" : "rgba(236,72,153,0.3)"}`
                                                        : "1px solid transparent",
                                            }}
                                        >
                                            {d === "ALL" ? "All" : d}
                                        </button>
                                    ))}
                                </div>
                                <div className="w-px h-4 bg-pink-500/10" />
                                <div className="flex items-center gap-1">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mr-0.5">TF</span>
                                    <button
                                        type="button"
                                        onClick={() => setAutoFilterSource("ALL")}
                                        className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${autoFilterSource === "ALL" ? "text-pink-300 bg-pink-500/20 shadow-sm" : "text-slate-500 hover:text-slate-300 bg-transparent"}`}
                                        style={{ border: autoFilterSource === "ALL" ? "1px solid rgba(236,72,153,0.3)" : "1px solid transparent" }}
                                    >
                                        All
                                    </button>
                                    {uniqueSources.map((src) => (
                                        <button
                                            type="button"
                                            key={src}
                                            onClick={() => setAutoFilterSource(autoFilterSource === src ? "ALL" : src)}
                                            className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono cursor-pointer transition-all ${autoFilterSource === src ? "text-purple-300 bg-purple-500/20 shadow-sm" : "text-slate-500 hover:text-slate-300 bg-transparent"}`}
                                            style={{ border: autoFilterSource === src ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent" }}
                                        >
                                            {src}
                                        </button>
                                    ))}
                                </div>
                                {hasActiveFilters && filteredAutoTrades.length > 0 && removeAutoTrade && (
                                    <>
                                        <div className="w-px h-4 bg-pink-500/10" />
                                        <motion.button
                                            type="button"
                                            whileTap={{ scale: 0.95 }}
                                            onClick={async () => {
                                                const comments = filteredAutoTrades.map((at) => at.comment).filter(Boolean);
                                                if (comments.length > 0) await removeAutoTrade(comments);
                                            }}
                                            className="px-3 py-1 rounded-lg text-[9px] font-black cursor-pointer transition-all flex items-center gap-1"
                                            style={{ color: "#ef4444", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}
                                        >
                                            <X className="w-3 h-3" /> Stop Filtered ({filteredAutoTrades.length})
                                        </motion.button>
                                    </>
                                )}
                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAutoFilterSymbol("ALL");
                                            setAutoFilterDir("ALL");
                                            setAutoFilterSource("ALL");
                                        }}
                                        className="text-[9px] font-bold text-slate-500 hover:text-pink-400 cursor-pointer transition-colors ml-auto"
                                    >
                                        ✕ Clear Filters
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="overflow-auto custom-scrollbar" style={{ maxHeight: 240 }}>
                            {serverAutoTrades.length === 0 ? (
                                <div className="py-10 text-center" style={{ background: tk.surface }}>
                                    <History className="w-10 h-10 mx-auto mb-3" style={{ color: tk.textDim, opacity: 0.4 }} />
                                    <span className="text-sm font-bold" style={{ color: tk.textDim }}>No active background trades</span>
                                </div>
                            ) : filteredAutoTrades.length === 0 ? (
                                <div className="py-6 text-center" style={{ background: tk.surface }}>
                                    <span className="text-xs font-bold" style={{ color: tk.textDim }}>No auto trades match current filters</span>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    <table className="w-full text-left" style={{ borderCollapse: "collapse", background: tk.surface }}>
                                        <thead className="sticky top-0 z-10" style={{ background: tk.isDark ? "#020617" : tk.surface }}>
                                            <tr style={{ borderBottom: "1px solid rgba(236,72,153,0.06)" }}>
                                                {["Symbol", "Source", "Current Dir.", "Waiting For", "Lot", "Ticket", "Status", "Action"].map((h) => (
                                                    <th key={h} className="px-3 py-2 text-[10px] font-black tracking-wider uppercase text-center" style={{ color: tk.textDim }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredAutoTrades.map((autoTrade, i) => {
                                                const isBuy = autoTrade.current_direction?.toLowerCase() === "buy";
                                                return (
                                                    <tr
                                                        key={autoTrade.id || i}
                                                        className="hover:bg-pink-500/5 transition-colors group text-center"
                                                        style={{ borderBottom: `1px solid ${tk.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}` }}
                                                    >
                                                        <td className="px-3 py-2 text-[11px] font-black drop-shadow-sm" style={{ color: tk.textPrimary }}>{autoTrade.symbol || "-"}</td>
                                                        <td className="px-3 py-2 text-[10px] font-bold font-mono text-purple-400/80">
                                                            {autoTrade.main_tf}/{autoTrade.sub_tf} <span className="text-pink-500/70">(W{autoTrade.window_size})</span>
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <span
                                                                className="text-[10px] font-black px-2 py-0.5 rounded shadow-sm"
                                                                style={{
                                                                    color: isBuy ? "#10b981" : "#ef4444",
                                                                    background: isBuy ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                                                                }}
                                                            >
                                                                {autoTrade.current_direction?.toUpperCase() || "-"}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <span
                                                                className="text-[10px] font-black px-2 py-0.5 rounded opacity-80 shadow-sm"
                                                                style={{
                                                                    color: !isBuy ? "#10b981" : "#ef4444",
                                                                    background: !isBuy ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                                                                    border: `1px dashed ${!isBuy ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                                                                }}
                                                            >
                                                                ⏳ {!isBuy ? "BUY" : "SELL"}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2 text-[11px] font-mono font-bold text-amber-500">{autoTrade.lot_size || "0.01"}</td>
                                                        <td className="px-3 py-2 text-[10px] font-mono text-purple-400">{autoTrade.last_ticket || "-"}</td>
                                                        <td className="px-3 py-2">
                                                            <span
                                                                className="text-[10px] font-black px-2 py-1 rounded shadow-sm cursor-help"
                                                                title={autoTrade.last_error || "Active and monitoring"}
                                                                style={{
                                                                    color: autoTrade.last_ticket ? "#ef4444" : "#fbbf24",
                                                                    background: autoTrade.last_ticket ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)",
                                                                    border: `1px solid ${autoTrade.last_ticket ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)"}`,
                                                                }}
                                                            >
                                                                {autoTrade.last_ticket ? "EXECUTED" : "WATCHING"}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <motion.button
                                                                type="button"
                                                                whileTap={{ scale: 0.95 }}
                                                                disabled={!removeAutoTrade}
                                                                onClick={async () => {
                                                                    if (removeAutoTrade && autoTrade.comment) await removeAutoTrade([autoTrade.comment]);
                                                                }}
                                                                className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded text-[10px] font-black cursor-pointer transition-colors opacity-80 hover:opacity-100 mx-auto"
                                                                style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
                                                            >
                                                                <X className="w-3 h-3" /> Stop
                                                            </motion.button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
