import { motion } from "framer-motion";
import { Zap, Activity } from "lucide-react";
import type { ThemeTokens } from "../../hooks/useThemeTokens";
import type { AggregatedSymbolRow } from "./types";

type Props = {
    row: AggregatedSymbolRow;
    tk: ThemeTokens;
    isClosingAuto: boolean;
    isClosingAll: boolean;
    onCloseAuto: (symbol: string) => void;
    onCloseAll: (symbol: string, tickets: number[]) => void;
};

export function MarketWatchModalPositionRow({
    row,
    tk,
    isClosingAuto,
    isClosingAll,
    onCloseAuto,
    onCloseAll,
}: Props) {
    const isProfit = row.profit >= 0;

    return (
        <tr
            className="border-b transition-all duration-300 hover:bg-indigo-500/5 group relative"
            style={{ borderColor: tk.isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)" }}
        >
            <td className="px-5 py-4 relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-[13px] font-black tracking-[0.15em] drop-shadow-sm" style={{ color: tk.textPrimary }}>
                    {row.symbol}
                </div>
            </td>
            <td className="px-5 py-4">
                <span
                    className="px-3 py-1.5 rounded-md text-[11px] font-black font-mono shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]"
                    style={{
                        background: tk.isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.05)",
                        color: tk.textSecondary,
                        border: `1px solid ${tk.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.1)"}`,
                    }}
                >
                    {row.totalPos}
                </span>
            </td>
            <td className="px-5 py-4">
                <span
                    className="inline-flex whitespace-nowrap items-center w-max text-[10px] font-bold px-2.5 py-1 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                    style={{
                        color: "#10b981",
                        background: "rgba(16,185,129,0.08)",
                        border: "1px solid rgba(16,185,129,0.3)",
                    }}
                >
                    {row.buyCount} B
                </span>
            </td>
            <td className="px-5 py-4">
                <span
                    className="inline-flex whitespace-nowrap items-center w-max text-[10px] font-bold px-2.5 py-1 rounded-md shadow-[0_0_10px_rgba(239,68,68,0.15)]"
                    style={{
                        color: "#ef4444",
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.3)",
                    }}
                >
                    {row.sellCount} S
                </span>
            </td>
            <td className="px-5 py-4">
                <span
                    className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-md w-max shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                    style={{
                        color: "#c084fc",
                        background: "rgba(168,85,247,0.08)",
                        border: "1px solid rgba(168,85,247,0.3)",
                    }}
                >
                    <Zap className="w-3 h-3" /> {row.autoCount}
                </span>
            </td>
            <td className="px-5 py-4">
                <span
                    title="Total times Auto Trade reversed direction"
                    className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-md w-max shadow-[0_0_10px_rgba(251,146,60,0.15)]"
                    style={{
                        color: "#fb923c",
                        background: "rgba(251,146,60,0.08)",
                        border: "1px solid rgba(251,146,60,0.3)",
                    }}
                >
                    <Activity className="w-3 h-3" /> {row.flipCount}
                </span>
            </td>
            <td className="px-5 py-4">
                <span
                    className="text-[10px] font-bold px-3 py-1 rounded-md w-max shadow-[0_0_10px_rgba(59,130,246,0.15)]"
                    style={{
                        color: "#60a5fa",
                        background: "rgba(59,130,246,0.08)",
                        border: "1px solid rgba(59,130,246,0.3)",
                    }}
                >
                    {row.manualCount}
                </span>
            </td>
            <td className="px-5 py-4 text-right">
                <span
                    className="text-base font-black font-mono tracking-tight"
                    style={{
                        color: isProfit ? "#10b981" : "#ef4444",
                        textShadow: `0 0 10px ${isProfit ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
                    }}
                >
                    {isProfit ? "+" : ""}
                    {row.profit.toFixed(2)}
                </span>
            </td>
            <td className="px-5 py-4 text-right">
                <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onCloseAuto(row.symbol)}
                    disabled={isClosingAuto || row.autoCount === 0}
                    className="px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap overflow-hidden relative"
                    style={{
                        color: row.autoCount === 0 ? tk.textDim : "#c084fc",
                        background: row.autoCount === 0 ? tk.surfaceHover : "rgba(168,85,247,0.1)",
                        border: `1px solid ${row.autoCount === 0 ? "transparent" : "rgba(168,85,247,0.4)"}`,
                        opacity: isClosingAuto || row.autoCount === 0 ? 0.3 : 1,
                        cursor: isClosingAuto || row.autoCount === 0 ? "not-allowed" : "pointer",
                    }}
                >
                    {!isClosingAuto && row.autoCount !== 0 && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    )}
                    {isClosingAuto ? "STOPPING..." : "STOP AUTO"}
                </motion.button>
            </td>
            <td className="px-5 py-4 text-right w-[180px]">
                <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onCloseAll(row.symbol, row.allTickets)}
                    disabled={isClosingAll || row.totalPos === 0}
                    className="px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap overflow-hidden relative"
                    style={{
                        color: row.totalPos === 0 ? tk.textDim : "#ef4444",
                        background: row.totalPos === 0 ? tk.surfaceHover : "rgba(239,68,68,0.1)",
                        border: `1px solid ${row.totalPos === 0 ? "transparent" : "rgba(239,68,68,0.4)"}`,
                        opacity: isClosingAll || row.totalPos === 0 ? 0.3 : 1,
                        cursor: isClosingAll || row.totalPos === 0 ? "not-allowed" : "pointer",
                    }}
                >
                    {!isClosingAll && row.totalPos !== 0 && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    )}
                    {isClosingAll ? "CLOSING..." : "CLOSE ALL"}
                </motion.button>
            </td>
        </tr>
    );
}
