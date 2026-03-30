import { motion } from "motion/react";
import { Cpu, Zap, ChevronUp, ChevronDown } from "lucide-react";
import type { TradeSignalResponse } from "../../hooks/useAITradeSignal";
import type { ThemeTokens } from "../../hooks/useThemeTokens";
import type { AiSignalColors } from "./types";

type Props = {
    colors: AiSignalColors;
    tk: ThemeTokens;
    aiTokens: number;
    isScanning: boolean;
    signal: TradeSignalResponse | null;
    isExpanded: boolean;
    onToggleExpand: () => void;
};

export function AITradeSignalWidgetHeader({
    colors,
    tk,
    aiTokens,
    isScanning,
    signal,
    isExpanded,
    onToggleExpand,
}: Props) {
    return (
        <>
            <motion.div
                className="absolute top-0 left-0 right-0 h-[2px] z-30"
                style={{
                    background: `linear-gradient(90deg, transparent 5%, ${colors.text} 30%, ${colors.text} 70%, transparent 95%)`,
                }}
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity }}
            />

            <div
                className="flex items-center justify-between px-4 py-3.5 relative overflow-hidden"
                style={{
                    background: `linear-gradient(180deg, rgba(${colors.rgb},0.06) 0%, transparent 100%)`,
                    borderBottom: `1px solid rgba(${colors.rgb},0.1)`,
                }}
            >
                <motion.div
                    className="absolute inset-0 w-1/3"
                    style={{
                        background: `linear-gradient(90deg, transparent, rgba(${colors.rgb},0.08), transparent)`,
                    }}
                    animate={{ x: ["-200%", "500%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />

                <div className="flex items-center gap-2.5 relative z-10">
                    <motion.div
                        className="w-8 h-8 rounded-lg flex items-center justify-center relative"
                        style={{
                            background: `linear-gradient(135deg, rgba(${colors.rgb},0.2), rgba(${colors.rgb},0.05))`,
                            border: `1px solid rgba(${colors.rgb},0.25)`,
                        }}
                        animate={{
                            boxShadow: [
                                `0 0 10px rgba(${colors.rgb},0.1)`,
                                `0 0 20px rgba(${colors.rgb},0.25)`,
                                `0 0 10px rgba(${colors.rgb},0.1)`,
                            ],
                        }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                    >
                        <Cpu className="w-4 h-4" style={{ color: colors.text }} />
                    </motion.div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black tracking-[0.2em]" style={{ color: colors.text }}>
                            PHASE-X
                        </span>
                        <span className="text-[8px] font-bold tracking-[0.15em]" style={{ color: tk.textDim }}>
                            AI CORE ENGINE
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 relative z-10">
                    <div
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black"
                        style={{
                            background: `rgba(${colors.rgb},0.08)`,
                            border: `1px solid rgba(${colors.rgb},0.2)`,
                            color: colors.text,
                        }}
                    >
                        <Zap size={10} /> {aiTokens}
                    </div>
                    <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{
                            backgroundColor: isScanning ? colors.text : signal ? colors.text : tk.textDim,
                            boxShadow: `0 0 6px ${isScanning ? colors.text : "transparent"}`,
                        }}
                        animate={{ opacity: isScanning ? [0.4, 1, 0.4] : 1, scale: isScanning ? [1, 1.3, 1] : 1 }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                    />
                    <button
                        type="button"
                        onClick={onToggleExpand}
                        className="w-6 h-6 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
                        style={{
                            background: `rgba(${colors.rgb},0.06)`,
                            border: `1px solid rgba(${colors.rgb},0.15)`,
                        }}
                    >
                        {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" style={{ color: colors.text }} />
                        ) : (
                            <ChevronDown className="w-3.5 h-3.5" style={{ color: colors.text }} />
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
