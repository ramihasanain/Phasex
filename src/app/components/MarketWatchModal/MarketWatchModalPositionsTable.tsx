import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import type { ThemeTokens } from "../../hooks/useThemeTokens";
import type { AggregatedSymbolRow } from "./types";
import { MarketWatchModalPositionRow } from "./MarketWatchModalPositionRow";

const HEADER_LABELS = ["Symbol", "Total", "Buy", "Sell", "Auto", "Flips", "Manual", "Net Profit", "Action", "Action"];

type Props = {
    tk: ThemeTokens;
    aggregated: AggregatedSymbolRow[];
    closingAutoSymbols: Set<string>;
    closingSymbols: Set<string>;
    onCloseAuto: (symbol: string) => void;
    onCloseAll: (symbol: string, tickets: number[]) => void;
};

export function MarketWatchModalPositionsTable({
    tk,
    aggregated,
    closingAutoSymbols,
    closingSymbols,
    onCloseAuto,
    onCloseAll,
}: Props) {
    return (
        <div className="flex-1 overflow-auto custom-scrollbar relative">
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)] z-20" />

            {aggregated.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center justify-center relative min-h-[300px]">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute w-32 h-32 border border-indigo-500/20 rounded-full border-t-indigo-500/80 border-b-indigo-500/80"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="absolute w-24 h-24 border border-rose-500/20 rounded-full border-l-rose-500/80 border-r-rose-500/80"
                    />
                    <Activity className="w-8 h-8 opacity-50 relative z-10" style={{ color: tk.textDim }} />
                    <h3 className="text-xl font-black uppercase tracking-[0.4em] mt-6 relative z-10" style={{ color: tk.textSecondary }}>
                        RADAR EMPTY
                    </h3>
                    <p className="text-[10px] mt-2 uppercase tracking-[0.2em] font-mono relative z-10" style={{ color: tk.textDim }}>
                        // AWAITING ACTIVE TELEMETRY //
                    </p>
                </div>
            ) : (
                <table className="w-full text-left border-collapse relative z-10">
                    <thead className="sticky top-0 z-30" style={{ background: tk.isDark ? "#060a10" : "#f8fafc" }}>
                        <tr>
                            {HEADER_LABELS.map((h, i) => (
                                <th
                                    key={h + i}
                                    className={`px-5 py-4 text-[9px] font-black tracking-[0.25em] uppercase border-b ${i >= 7 ? "text-right" : ""}`}
                                    style={{
                                        color: tk.textDim,
                                        borderColor: tk.isDark ? "rgba(99,102,241,0.2)" : "rgba(0,0,0,0.1)",
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                        <tr className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                    </thead>
                    <tbody>
                        {aggregated.map((row) => (
                            <MarketWatchModalPositionRow
                                key={row.symbol}
                                row={row}
                                tk={tk}
                                isClosingAuto={closingAutoSymbols.has(row.symbol)}
                                isClosingAll={closingSymbols.has(row.symbol)}
                                onCloseAuto={onCloseAuto}
                                onCloseAll={onCloseAll}
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
