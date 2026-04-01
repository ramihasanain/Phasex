import React from "react";
import { motion } from "motion/react";
import { CheckCircle, Play, ToggleLeft, ToggleRight, Zap } from "lucide-react";
import type { SignalEntry } from "./types";
import { PriceCell } from "./PriceCell";
import type { TradingSignalsTableModel } from "./useTradingSignalsTableModel";

type Props = {
    m: TradingSignalsTableModel;
    asset: string;
    tf: string;
    entry: SignalEntry;
};

export function TradingSignalsSignalTfRow({ m, asset, tf, entry }: Props) {
    const {
        tk,
        mt5Connected,
        livePrices,
        lotSizes,
        setLotSizes,
        executingTrades,
        setExecutingTrades,
        localAutoActive,
        setLocalAutoActive,
        autoTrades,
        localPosActive,
        mt5Positions,
        addAutoTrade,
        handleExecuteTrade,
        symbolOverrides,
        fmt,
        calcProfit,
    } = m;

    const isBuy = entry.net_signal === "Buy";
    const isSell = entry.net_signal === "Sell";
    const midPrice = (entry.high + entry.low) / 2;
    const baseAsset = asset.replace(/\.(sd|lv|p)$/i, "");

    let alias = baseAsset;
    if (baseAsset === "XAUUSD") alias = "GOLD";
    else if (baseAsset === "XAGUSD") alias = "SILVER";
    else if (baseAsset === "UKOILRoll" || baseAsset === "UKOIL") alias = livePrices["BRENT"] ? "BRENT" : "UKOIL";
    else if (baseAsset === "USOILRoll" || baseAsset === "USOIL") alias = livePrices["WTI"] ? "WTI" : "USOIL";
    else if (baseAsset === "US500Roll") alias = "US500";
    else if (baseAsset === "US30Roll") alias = "US30";
    else if (baseAsset === "UK100Roll") alias = "UK100";
    else if (baseAsset === "UT100Roll") alias = "US100";

    const liveMatch =
        livePrices[asset] || livePrices[baseAsset] || livePrices[alias] || livePrices[baseAsset + ".p"] || null;

    const mPrice = liveMatch ? (liveMatch.bid + liveMatch.ask) / 2 : midPrice;
    const profit = calcProfit(entry, mPrice);
    const profitPos = profit >= 0;

    const rowBg = isBuy ? "rgba(74,222,128,0.03)" : isSell ? "rgba(248,113,113,0.03)" : "transparent";
    const rowHoverBg = isBuy ? "rgba(74,222,128,0.07)" : isSell ? "rgba(248,113,113,0.07)" : "rgba(99,102,241,0.03)";
    const rowBorder = isBuy ? "1px solid rgba(74,222,128,0.06)" : isSell ? "1px solid rgba(248,113,113,0.06)" : "1px solid rgba(255,255,255,0.02)";

    return (
        <tr
            style={{ borderBottom: rowBorder, background: rowBg }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = rowHoverBg;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = rowBg;
            }}
        >
            <td className="p-2.5 max-[800px]:p-1.5 max-[800px]:px-2 px-4">
                <span
                    className="text-xs max-[800px]:text-[10px] font-black font-mono px-2 py-0.5 max-[800px]:px-1.5 max-[800px]:py-0.5 sm:px-2.5 sm:py-1 rounded-lg"
                    style={{
                        background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06))",
                        color: "#a5b4fc",
                        border: "1px solid rgba(99,102,241,0.12)",
                        textShadow: "0 0 6px rgba(99,102,241,0.3)",
                    }}
                >
                    {tf}
                </span>
            </td>
            <td className="p-2.5 max-[800px]:p-1.5 text-center">
                <span
                    className="text-xs max-[800px]:text-[10px] font-black px-2 py-0.5 max-[800px]:px-1.5 sm:px-3 sm:py-1 rounded-lg"
                    style={{
                        color: isBuy ? tk.positive : isSell ? tk.negative : tk.textDim,
                        background: isBuy ? tk.positiveBg : isSell ? tk.negativeBg : "transparent",
                        border: isBuy ? `1px solid ${tk.positiveBorder}` : isSell ? `1px solid ${tk.negativeBorder}` : "1px solid transparent",
                        textShadow: tk.isDark ? (isBuy ? `0 0 10px ${tk.positiveBg}` : isSell ? `0 0 10px ${tk.negativeBg}` : "none") : "none",
                    }}
                >
                    {entry.net_signal || "—"}
                </span>
            </td>
            <td className="p-2.5 max-[800px]:p-1.5 text-xs max-[800px]:text-[10px] font-mono font-medium" style={{ color: tk.textSecondary }}>{entry.time}</td>
            <td className="p-2.5 max-[800px]:p-1.5 text-sm max-[800px]:text-[10px] font-black font-mono text-right tabular-nums" style={{ color: tk.textBright }}>{fmt(entry.close)}</td>
            <td className="p-2.5 max-[800px]:p-1.5 text-xs max-[800px]:text-[10px] font-bold font-mono text-right tabular-nums" style={{ color: entry.stop_loss ? tk.negative : tk.textDim }}>
                {entry.stop_loss ? fmt(entry.stop_loss) : "—"}
            </td>
            <td className="p-2.5 max-[800px]:p-1.5 text-xs max-[800px]:text-[10px] font-bold font-mono text-right tabular-nums" style={{ color: entry.take_profit ? tk.positive : tk.textDim }}>
                {entry.take_profit ? fmt(entry.take_profit) : "—"}
            </td>
            <td className="p-2.5 max-[800px]:p-1.5 text-xs max-[800px]:text-[10px] font-bold font-mono text-right tabular-nums">
                <PriceCell price={mPrice} isLive={!!liveMatch} fmt={fmt} />
            </td>
            <td className="p-2.5 max-[800px]:p-1.5 text-right">
                <span
                    className="text-xs max-[800px]:text-[10px] font-black font-mono tabular-nums px-2 py-0.5 max-[800px]:px-1.5 sm:px-2.5 sm:py-1 rounded-lg"
                    style={{
                        color: profitPos ? tk.positive : tk.negative,
                        background: profitPos ? tk.positiveBg : tk.negativeBg,
                        border: profitPos ? `1px solid ${tk.positiveBorder}` : `1px solid ${tk.negativeBorder}`,
                        textShadow: tk.isDark ? (profitPos ? `0 0 8px ${tk.positiveBg}` : `0 0 8px ${tk.negativeBg}`) : "none",
                    }}
                >
                    {profit !== 0 ? `${profitPos ? "+" : ""}${fmt(Math.abs(profit))}` : "—"}
                </span>
            </td>
            {mt5Connected && (() => {
                const rowKey = `${asset}-${tf}`;
                const effectiveSymbol = symbolOverrides[asset] || asset;
                const isExecuting = executingTrades.has(rowKey);
                const isAuto = autoTrades.has(rowKey) || localAutoActive.has(rowKey);
                const lotVal = lotSizes[rowKey] ?? 0.01;
                const tradeComment = `PX-Dash ${asset} ${tf}`.slice(0, 31);
                const hasPos = mt5Positions?.some((p) => p.comment === tradeComment) || localPosActive.has(rowKey);
                const disableExec = isExecuting || hasPos || isAuto;

                let progress = 0;
                if (isAuto && entry.net_signal && mPrice > 0 && entry.close > 0) {
                    const diff = Math.abs(mPrice - entry.close);
                    const range = entry.close * 0.02;
                    if (entry.net_signal === "Buy") {
                        progress = mPrice <= entry.close ? 100 : Math.max(0, Math.min(99, (1 - diff / range) * 100));
                    } else {
                        progress = mPrice >= entry.close ? 100 : Math.max(0, Math.min(99, (1 - diff / range) * 100));
                    }
                }
                const isNear = progress >= 80;

                return (
                    <>
                        <td className="p-2.5 max-[800px]:p-1.5 text-center" style={{ borderLeft: "2px solid rgba(245,158,11,0.2)" }}>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                max="100"
                                value={lotVal}
                                onChange={(e) =>
                                    setLotSizes((prev) => ({
                                        ...prev,
                                        [rowKey]: Math.max(0.01, parseFloat(e.target.value) || 0.01),
                                    }))
                                }
                                className="w-14 max-[800px]:w-11 sm:w-16 text-center text-[10px] max-[800px]:text-[9px] sm:text-[11px] font-bold font-mono py-0.5 px-0.5 sm:py-1 sm:px-1 rounded-lg outline-none"
                                style={{
                                    background: "rgba(245,158,11,0.08)",
                                    border: "1px solid rgba(245,158,11,0.25)",
                                    color: "#fbbf24",
                                }}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </td>
                        <td className="p-2.5 max-[800px]:p-1.5 text-center">
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={disableExec}
                                title={hasPos ? "✅ صفقة منفذة بالفعل" : undefined}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleExecuteTrade(asset, tf, entry);
                                }}
                                className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 max-[800px]:text-[9px] sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] font-black cursor-pointer"
                                style={{
                                    color: disableExec ? tk.textDim : isBuy ? "#10b981" : "#ef4444",
                                    background: disableExec ? tk.surfaceHover : isBuy ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                                    border: `1px solid ${disableExec ? tk.border : isBuy ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                                    opacity: disableExec ? 0.6 : 1,
                                }}
                            >
                                {isExecuting ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>
                                        <Zap className="w-3 h-3" />
                                    </motion.div>
                                ) : hasPos ? (
                                    <CheckCircle className="w-3 h-3" />
                                ) : isAuto ? (
                                    <Zap className="w-3 h-3" />
                                ) : (
                                    <Play className="w-3 h-3" />
                                )}
                                {isExecuting ? "..." : hasPos ? "DONE" : isAuto ? "AUTO" : isBuy ? "BUY" : "SELL"}
                            </motion.button>
                        </td>
                        <td className="p-2.5 max-[800px]:p-1.5 text-center min-w-0 sm:min-w-[100px]">
                            <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                                <motion.button
                                    type="button"
                                    whileHover={isAuto || hasPos || isExecuting ? {} : { scale: 1.05 }}
                                    whileTap={isAuto || hasPos || isExecuting ? {} : { scale: 0.95 }}
                                    disabled={isAuto || hasPos || isExecuting}
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        if (!mt5Connected) return;
                                        if (isAuto || hasPos || executingTrades.has(rowKey) || autoTrades.has(rowKey)) return;

                                        const lot = lotSizes[rowKey] || 0.01;
                                        const direction = entry.net_signal || "";

                                        setExecutingTrades((prev) => new Set(prev).add(rowKey));
                                        setLocalAutoActive((prev) => new Set(prev).add(rowKey));
                                        let ticket = "";
                                        const existingManualPos = mt5Positions?.find((p) => p.comment === tradeComment);

                                        if (existingManualPos) {
                                            ticket = String(existingManualPos.ticket);
                                        }
                                        const p = addAutoTrade?.(
                                            rowKey,
                                            effectiveSymbol,
                                            tf,
                                            lot,
                                            direction,
                                            entry.close,
                                            entry.stop_loss || null,
                                            entry.take_profit || null,
                                            ticket,
                                        );
                                        if (p) {
                                            p.finally(() => {
                                                setExecutingTrades((prev) => {
                                                    const n = new Set(prev);
                                                    n.delete(rowKey);
                                                    return n;
                                                });
                                            });
                                        } else {
                                            setExecutingTrades((prev) => {
                                                const n = new Set(prev);
                                                n.delete(rowKey);
                                                return n;
                                            });
                                        }
                                    }}
                                    className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg text-[9px] max-[800px]:text-[8px] sm:text-[10px] font-black cursor-pointer shadow-sm relative overflow-hidden"
                                    style={{
                                        color: isExecuting || hasPos || isAuto ? tk.textDim : "#a855f7",
                                        background: isExecuting || hasPos || isAuto ? tk.surfaceHover : "transparent",
                                        border: `1px solid ${isExecuting || hasPos || isAuto ? tk.border : tk.border}`,
                                        opacity: isExecuting || hasPos || isAuto ? 0.6 : 1,
                                    }}
                                >
                                    {isExecuting ? (
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>
                                            <Zap className="w-3.5 h-3.5" />
                                        </motion.div>
                                    ) : isAuto ? (
                                        <ToggleRight className="w-3.5 h-3.5" />
                                    ) : (
                                        <ToggleLeft className="w-3.5 h-3.5" />
                                    )}
                                    {isExecuting ? "..." : isAuto ? "ON" : "OFF"}
                                </motion.button>
                                {isAuto && (
                                    <div className="w-full">
                                        <div className="relative w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(168,85,247,0.1)" }}>
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${Math.max(5, progress)}%`,
                                                    background: isNear
                                                        ? "linear-gradient(90deg, #a855f7, #10b981)"
                                                        : "linear-gradient(90deg, rgba(168,85,247,0.4), #a855f7)",
                                                    boxShadow: isNear ? "0 0 8px rgba(16,185,129,0.5)" : "0 0 4px rgba(168,85,247,0.3)",
                                                }}
                                                animate={isNear ? { opacity: [1, 0.6, 1] } : {}}
                                                transition={isNear ? { duration: 0.8, repeat: Infinity } : {}}
                                            />
                                        </div>
                                        <div className="text-[8px] font-bold mt-0.5 text-center" style={{ color: isNear ? "#10b981" : "#a855f7" }}>
                                            {Math.round(progress)}%
                                        </div>
                                    </div>
                                )}
                            </div>
                        </td>
                    </>
                );
            })()}
        </tr>
    );
}
