import { motion } from "motion/react";
import { Zap } from "lucide-react";
import type { TradeSignalResponse } from "../../hooks/useAITradeSignal";
import type { ThemeTokens } from "../../hooks/useThemeTokens";
import type { AiSignalColors } from "./types";

type Props = {
    signal: TradeSignalResponse;
    colors: AiSignalColors;
    tk: ThemeTokens;
    aiLot: string;
    onLotChange: (value: string) => void;
    onExecuteTrade: (action: string, sl?: number, tp?: number, lot?: number) => void;
};

export function AITradeSignalWidgetExecuteBar({
    signal,
    colors,
    tk,
    aiLot,
    onLotChange,
    onExecuteTrade,
}: Props) {
    return (
        <div className="px-3 pb-3 space-y-2">
            <div className="flex items-center gap-2">
                <label
                    className="text-[8px] font-black tracking-[0.15em] uppercase whitespace-nowrap"
                    style={{ color: tk.textDim }}
                >
                    LOT
                </label>
                <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="100"
                    value={aiLot}
                    onChange={(e) => onLotChange(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg text-[12px] font-black text-center outline-none"
                    style={{
                        background: "rgba(245,158,11,0.08)",
                        border: "1px solid rgba(245,158,11,0.25)",
                        color: "#fbbf24",
                        width: "60px",
                    }}
                />
            </div>
            <motion.button
                type="button"
                whileHover={{ scale: 1.02, boxShadow: `0 8px 30px rgba(${colors.rgb},0.3)` }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                    const slVal = signal.targets?.sl ? parseFloat(String(signal.targets.sl)) : undefined;
                    const tpVal = signal.targets?.tp1 ? parseFloat(String(signal.targets.tp1)) : undefined;
                    const lotVal = parseFloat(aiLot) || 0.01;
                    onExecuteTrade(
                        signal.action,
                        isNaN(slVal!) ? undefined : slVal,
                        isNaN(tpVal!) ? undefined : tpVal,
                        lotVal
                    );
                }}
                className="w-full py-2.5 rounded-xl text-[10px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-2 cursor-pointer"
                style={{
                    background: signal.action === "BUY" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                    border: `1px solid ${signal.action === "BUY" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                    color: signal.action === "BUY" ? "#34d399" : "#f87171",
                }}
            >
                <Zap className="w-3.5 h-3.5" />
                Execute {signal.action}
                {signal.targets?.sl && <span className="opacity-60">SL:{signal.targets.sl}</span>}
                {signal.targets?.tp1 && <span className="opacity-60">TP:{signal.targets.tp1}</span>}
            </motion.button>
        </div>
    );
}
