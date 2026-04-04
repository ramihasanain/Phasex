import React from "react";
import { motion } from "motion/react";
import { ChevronDown, ChevronUp, X, Zap } from "lucide-react";
import type { TradeHistoryEntry } from "./types";
import type { TradingSignalsTableModel } from "./useTradingSignalsTableModel";

type Props = { m: TradingSignalsTableModel };

export function TradingSignalsLivePositionsPanel({ m }: Props) {
    const {
        tk,
        isRTL,
        mt5Connected,
        mt5Positions,
        closeAllPositions,
        closePosition,
        showPositions,
        setShowPositions,
        posFilterSymbol,
        setPosFilterSymbol,
        posFilterDir,
        setPosFilterDir,
        closingAllPositions,
        setClosingAllPositions,
        handleCloseAllPositions,
        closingTickets,
        setClosingTickets,
        addTradeToHistory,
        fmt,
        mt5Account,
    } = m;

    if (!mt5Connected) return null;

    return (
        <div
            className="mx-6 mb-3 rounded-xl overflow-hidden"
            style={{
                border: "1px solid rgba(16,185,129,0.15)",
                background: tk.isDark ? "rgba(16,185,129,0.02)" : "rgba(16,185,129,0.02)",
            }}
        >
            <div
                className="flex items-center justify-between px-5 py-3 cursor-pointer select-none transition-colors hover:bg-emerald-500/10"
                style={{
                    borderBottom: showPositions ? "1px solid rgba(16,185,129,0.06)" : "none",
                    background: "rgba(16,185,129,0.05)",
                }}
                onClick={() => setShowPositions(!showPositions)}
            >
                <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    <span className="text-[12px] font-black uppercase tracking-wider text-emerald-400">Active Tickets</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400">{mt5Positions.length}</span>
                    {showPositions && mt5Positions.length > 0 && (() => {
                        const activeBuyCount = mt5Positions.filter((p) => p.type?.toUpperCase() === "BUY").length;
                        const activeSellCount = mt5Positions.filter((p) => p.type?.toUpperCase() === "SELL").length;
                        return (
                            <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-black/20 rounded-lg border border-emerald-500/10">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{isRTL ? "مراكز حالية" : "Current"}</span>
                                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-1 rounded shadow-sm drop-shadow whitespace-nowrap">{activeBuyCount} B</span>
                                    <span className="text-[10px] font-black text-red-400 bg-red-500/10 px-1 rounded shadow-sm drop-shadow whitespace-nowrap">{activeSellCount} S</span>
                                </div>
                            </div>
                        );
                    })()}
                    {showPositions ? (
                        <ChevronUp className="w-4 h-4 text-emerald-400 opacity-50 ml-2" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-emerald-400 opacity-50 ml-2" />
                    )}
                </div>
                {showPositions && mt5Positions.length > 0 && closeAllPositions && (
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        disabled={closingAllPositions}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCloseAllPositions();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black cursor-pointer"
                        style={{
                            color: closingAllPositions ? tk.textDim : "#ef4444",
                            background: closingAllPositions ? tk.surfaceHover : "rgba(239,68,68,0.1)",
                            border: `1px solid ${closingAllPositions ? tk.border : "rgba(239,68,68,0.2)"}`,
                        }}
                    >
                        {closingAllPositions ? "..." : <X className="w-2.5 h-2.5" />}
                        {closingAllPositions ? "Closing All..." : "Close All Positions"}
                    </motion.button>
                )}
            </div>

            {showPositions && (
                <div>
                    {mt5Account && (
                        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 px-4 pt-3 pb-2 border-b border-emerald-500/10">
                            {[
                                { label: "Balance", value: `$${(mt5Account.balance || 0).toLocaleString()}`, color: "#10b981" },
                                { label: "Equity", value: `$${(mt5Account.equity || 0).toLocaleString()}`, color: "#6366f1" },
                                {
                                    label: "Profit",
                                    value: `$${(mt5Account.profit || 0) >= 0 ? "+" : ""}${(mt5Account.profit || 0).toLocaleString()}`,
                                    color: (mt5Account.profit || 0) >= 0 ? "#10b981" : "#ef4444",
                                },
                                { label: "Free Margin", value: `$${(mt5Account.free_margin || 0).toLocaleString()}`, color: "#a855f7" },
                                { label: "Margin", value: `$${(mt5Account.margin || 0).toLocaleString()}`, color: "#f59e0b" },
                                { label: "Leverage", value: `1:${mt5Account.leverage || 0}`, color: "#3b82f6" },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-lg px-2.5 py-1.5"
                                    style={{
                                        background: tk.isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                                        border: `1px solid ${tk.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                                    }}
                                >
                                    <div className="text-[8px] font-bold tracking-widest uppercase" style={{ color: tk.textDim }}>{stat.label}</div>
                                    <div className="text-[13px] font-black" style={{ color: stat.color }}>{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    {(() => {
                        const uniquePosSymbols = Array.from(new Set(mt5Positions.map((p) => p.symbol).filter(Boolean))).sort();
                        const filteredPositions = mt5Positions.filter((p) => {
                            if (posFilterSymbol !== "ALL" && p.symbol !== posFilterSymbol) return false;
                            if (posFilterDir !== "ALL" && p.type?.toUpperCase() !== posFilterDir) return false;
                            return true;
                        });
                        const hasActivePosFilters = posFilterSymbol !== "ALL" || posFilterDir !== "ALL";

                        return (
                            <>
                                {mt5Positions.length > 0 && (
                                    <div
                                        className="flex flex-wrap items-center gap-2 px-4 py-2.5"
                                        style={{
                                            background: tk.isDark ? "rgba(16,185,129,0.03)" : "rgba(16,185,129,0.02)",
                                            borderBottom: "1px solid rgba(16,185,129,0.06)",
                                        }}
                                    >
                                        <div className="flex items-center gap-1">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mr-0.5">Symbol</span>
                                            <button
                                                type="button"
                                                onClick={() => setPosFilterSymbol("ALL")}
                                                className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${posFilterSymbol === "ALL" ? "text-emerald-300 bg-emerald-500/20 shadow-sm" : "text-slate-500 hover:text-slate-300 bg-transparent"}`}
                                                style={{ border: posFilterSymbol === "ALL" ? "1px solid rgba(16,185,129,0.3)" : "1px solid transparent" }}
                                            >
                                                All
                                            </button>
                                            {uniquePosSymbols.map((sym) => (
                                                <button
                                                    type="button"
                                                    key={sym}
                                                    onClick={() => setPosFilterSymbol(posFilterSymbol === sym ? "ALL" : sym)}
                                                    className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${posFilterSymbol === sym ? "text-emerald-300 bg-emerald-500/20 shadow-sm" : "text-slate-500 hover:text-slate-300 bg-transparent"}`}
                                                    style={{ border: posFilterSymbol === sym ? "1px solid rgba(16,185,129,0.3)" : "1px solid transparent" }}
                                                >
                                                    {sym}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="w-px h-4 bg-emerald-500/10" />
                                        <div className="flex items-center gap-1">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mr-0.5">Dir</span>
                                            {["ALL", "BUY", "SELL"].map((d) => (
                                                <button
                                                    type="button"
                                                    key={d}
                                                    onClick={() => setPosFilterDir(d)}
                                                    className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${posFilterDir === d ? `${d === "BUY" ? "text-emerald-300 bg-emerald-500/20" : d === "SELL" ? "text-red-300 bg-red-500/20" : "text-emerald-300 bg-emerald-500/20"} shadow-sm` : "text-slate-500 hover:text-slate-300 bg-transparent"}`}
                                                    style={{
                                                        border:
                                                            posFilterDir === d
                                                                ? `1px solid ${d === "BUY" ? "rgba(16,185,129,0.3)" : d === "SELL" ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`
                                                                : "1px solid transparent",
                                                    }}
                                                >
                                                    {d === "ALL" ? "All" : d}
                                                </button>
                                            ))}
                                        </div>

                                        {hasActivePosFilters && filteredPositions.length > 0 && closePosition && (
                                            <>
                                                <div className="w-px h-4 bg-emerald-500/10" />
                                                <motion.button
                                                    type="button"
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={async () => {
                                                        setClosingAllPositions(true);
                                                        for (const p of filteredPositions) {
                                                            await closePosition(p.ticket);
                                                        }
                                                        setClosingAllPositions(false);
                                                    }}
                                                    className="px-3 py-1 rounded-lg text-[9px] font-black cursor-pointer transition-all flex items-center gap-1"
                                                    style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                                                >
                                                    <X className="w-2.5 h-2.5" /> Close Filtered ({filteredPositions.length})
                                                </motion.button>
                                            </>
                                        )}
                                        {hasActivePosFilters && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPosFilterSymbol("ALL");
                                                    setPosFilterDir("ALL");
                                                }}
                                                className="ml-auto text-[9px] font-bold text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 pr-2"
                                            >
                                                <X className="w-2 h-2" /> Clear Filters
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="overflow-auto custom-scrollbar" style={{ maxHeight: 240 }}>
                                    {filteredPositions.length === 0 ? (
                                        <div className="px-5 py-8 text-center" style={{ background: "rgba(16,185,129,0.02)" }}>
                                            <span className="text-[12px] font-black uppercase tracking-widest drop-shadow-sm" style={{ color: "rgba(16,185,129,0.4)" }}>
                                                No active live positions{hasActivePosFilters ? " matched" : ""}
                                            </span>
                                        </div>
                                    ) : (
                                        <table className="w-full" style={{ borderCollapse: "collapse" }}>
                                            <thead className="sticky top-0 z-10" style={{ background: tk.isDark ? "#020617" : tk.surface }}>
                                                <tr style={{ borderBottom: "1px solid rgba(16,185,129,0.1)" }}>
                                                    {["Symbol", "Type", "Vol", "Open", "Current", "SL", "TP", "Profit", "Swap", ""].map((h) => (
                                                        <th key={h} className="px-3 py-2 text-[10px] font-black tracking-wider uppercase text-left" style={{ color: tk.textDim }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredPositions.map((pos) => {
                                                    const isProfit = pos.profit >= 0;
                                                    const isClosing = closingTickets.has(pos.ticket);
                                                    return (
                                                        <tr
                                                            key={pos.ticket}
                                                            className="hover:bg-emerald-500/5 transition-colors group"
                                                            style={{
                                                                borderBottom: `1px solid ${tk.isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)"}`,
                                                                background: isProfit ? "rgba(16,185,129,0.03)" : "rgba(239,68,68,0.03)",
                                                            }}
                                                        >
                                                            <td className="px-3 py-2 text-[11px] font-black" style={{ color: tk.textPrimary }}>{pos.symbol}</td>
                                                            <td className="px-3 py-2">
                                                                <span
                                                                    className="text-[9px] font-black px-1.5 py-0.5 rounded"
                                                                    style={{
                                                                        color: pos.type === "BUY" ? "#10b981" : "#ef4444",
                                                                        background: pos.type === "BUY" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                                                                    }}
                                                                >
                                                                    {pos.type}
                                                                </span>
                                                            </td>
                                                            <td className="px-3 py-2 text-[10px] font-bold font-mono drop-shadow-sm" style={{ color: "#f59e0b" }}>{pos.volume}</td>
                                                            <td className="px-3 py-2 text-[10px] font-mono" style={{ color: tk.textSecondary }}>{fmt(pos.open_price)}</td>
                                                            <td className="px-3 py-2 text-[10px] font-mono font-bold" style={{ color: tk.textPrimary }}>{fmt(pos.current_price)}</td>
                                                            <td className="px-3 py-2 text-[10px] font-mono" style={{ color: pos.sl ? "#ef4444" : tk.textDim }}>{pos.sl ? fmt(pos.sl) : "—"}</td>
                                                            <td className="px-3 py-2 text-[10px] font-mono" style={{ color: pos.tp ? "#10b981" : tk.textDim }}>{pos.tp ? fmt(pos.tp) : "—"}</td>
                                                            <td className="px-3 py-2">
                                                                <span className="text-[11px] font-black font-mono drop-shadow-sm" style={{ color: isProfit ? "#10b981" : "#ef4444" }}>
                                                                    {isProfit ? "+" : ""}
                                                                    {pos.profit.toFixed(2)}
                                                                </span>
                                                            </td>
                                                            <td className="px-3 py-2 text-[9px] font-mono" style={{ color: tk.textDim }}>{pos.swap.toFixed(2)}</td>
                                                            <td className="px-3 py-2 text-right">
                                                                <motion.button
                                                                    type="button"
                                                                    whileTap={{ scale: 0.95 }}
                                                                    disabled={isClosing || !closePosition}
                                                                    onClick={async () => {
                                                                        if (!closePosition) return;
                                                                        setClosingTickets((prev) => new Set(prev).add(pos.ticket));
                                                                        const success = await closePosition(pos.ticket);
                                                                        if (success) {
                                                                            const closeEntry: TradeHistoryEntry = {
                                                                                id: `close-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                                                                                symbol: pos.symbol,
                                                                                tf: "-",
                                                                                action: pos.type === "BUY" ? "Buy" : "Sell",
                                                                                volume: pos.volume,
                                                                                entryPrice: pos.open_price,
                                                                                sl: pos.sl || null,
                                                                                tp: pos.tp || null,
                                                                                ticket: pos.ticket,
                                                                                status: "closed",
                                                                                executedAt: pos.time_open || new Date().toISOString(),
                                                                                signalPrice: pos.open_price,
                                                                                profit: pos.profit,
                                                                                closePrice: pos.current_price,
                                                                                closedAt: new Date().toISOString(),
                                                                            };
                                                                            addTradeToHistory?.(closeEntry);
                                                                        }
                                                                        setClosingTickets((prev) => {
                                                                            const n = new Set(prev);
                                                                            n.delete(pos.ticket);
                                                                            return n;
                                                                        });
                                                                    }}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-black cursor-pointer transition-colors opacity-80 group-hover:opacity-100"
                                                                    style={{
                                                                        color: isClosing ? tk.textDim : "#ef4444",
                                                                        background: isClosing ? tk.surfaceHover : "rgba(239,68,68,0.08)",
                                                                        border: `1px solid ${isClosing ? tk.border : "rgba(239,68,68,0.15)"}`,
                                                                    }}
                                                                >
                                                                    {isClosing ? "⏳" : <X className="w-3 h-3" />}
                                                                    {isClosing ? "..." : "Close"}
                                                                </motion.button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}
