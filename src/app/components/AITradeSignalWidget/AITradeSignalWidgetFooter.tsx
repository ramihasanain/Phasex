import { motion } from "motion/react";
import { Crosshair, ShieldAlert } from "lucide-react";
import type { TradeSignalResponse } from "../../hooks/useAITradeSignal";
import type { ThemeTokens } from "../../hooks/useThemeTokens";
import type { AiTradeSignalTxt } from "./aiTradeSignalTranslations";
import type { AiSignalColors } from "./types";

type Props = {
    colors: AiSignalColors;
    tk: ThemeTokens;
    isScanning: boolean;
    signal: TradeSignalResponse | null;
    txt: AiTradeSignalTxt;
    onScan: () => void;
    onReset: () => void;
};

export function AITradeSignalWidgetFooter({ colors, tk, isScanning, signal, txt, onScan, onReset }: Props) {
    return (
        <div className="p-3 flex gap-2" style={{ borderTop: `1px solid rgba(${colors.rgb},0.08)` }}>
            <motion.button
                type="button"
                onClick={onScan}
                disabled={isScanning}
                whileHover={!isScanning ? { scale: 1.02, boxShadow: `0 8px 30px rgba(${colors.rgb},0.25)` } : {}}
                whileTap={!isScanning ? { scale: 0.98 } : {}}
                className="flex-1 relative group overflow-hidden rounded-xl py-2.5 transition-all outline-none cursor-pointer"
                style={{
                    background: isScanning
                        ? "rgba(30,41,59,0.3)"
                        : `linear-gradient(135deg, rgba(${colors.rgb},0.15), rgba(${colors.rgb},0.05))`,
                    border: `1px solid ${isScanning ? "rgba(51,65,85,0.3)" : `rgba(${colors.rgb},0.25)`}`,
                    boxShadow: isScanning ? "none" : `0 4px 20px rgba(${colors.rgb},0.1)`,
                }}
            >
                {!isScanning && (
                    <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{
                            background: `linear-gradient(90deg, transparent, rgba(${colors.rgb},0.1), transparent)`,
                        }}
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    />
                )}

                <div className="relative z-10 flex items-center justify-center gap-2">
                    <Crosshair className="w-4 h-4" style={{ color: isScanning ? "#475569" : colors.text }} />
                    <span className="text-[10px] font-black tracking-[0.2em]" style={{ color: isScanning ? "#475569" : colors.text }}>
                        {isScanning ? txt.scanningBtn : signal ? txt.rescanBtn : txt.executeBtn}
                    </span>
                </div>
            </motion.button>

            {signal && !isScanning && (
                <motion.button
                    type="button"
                    onClick={onReset}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 rounded-xl py-2.5 flex items-center justify-center cursor-pointer"
                    style={{ background: tk.negativeBg, border: `1px solid ${tk.negativeBorder}` }}
                    title="Reset Scan"
                >
                    <ShieldAlert className="w-4 h-4" style={{ color: tk.negative, opacity: 0.6 }} />
                </motion.button>
            )}
        </div>
    );
}
