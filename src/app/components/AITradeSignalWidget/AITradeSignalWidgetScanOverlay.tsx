import { motion } from "motion/react";
import { Cpu } from "lucide-react";
import type { AiTradeSignalTxt } from "./aiTradeSignalTranslations";
import type { AiSignalColors } from "./types";

type Props = {
    colors: AiSignalColors;
    scanProgress: number;
    txt: AiTradeSignalTxt;
};

export function AITradeSignalWidgetScanOverlay({ colors, scanProgress, txt }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center backdrop-blur-sm rounded-b-2xl"
            style={{
                background: `radial-gradient(circle, rgba(${colors.rgb},0.05) 0%, rgba(6,10,16,0.95) 70%)`,
            }}
        >
            <div className="relative w-20 h-20 mb-5">
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        border: `2px solid rgba(${colors.rgb},0.15)`,
                        borderTopColor: colors.text,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <div
                    className="absolute inset-2 rounded-full flex items-center justify-center"
                    style={{ background: `rgba(${colors.rgb},0.05)` }}
                >
                    <Cpu className="w-6 h-6" style={{ color: colors.text }} />
                </div>
            </div>
            <div className="w-3/4 h-1 rounded-full overflow-hidden relative" style={{ background: `rgba(${colors.rgb},0.1)` }}>
                <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                        background: `linear-gradient(90deg, ${colors.text}, rgba(${colors.rgb},0.5))`,
                    }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(scanProgress, 100)}%` }}
                    transition={{ ease: "circOut" }}
                />
            </div>
            <span className="text-[10px] mt-2.5 tracking-[0.2em] font-bold" style={{ color: colors.text }}>
                {txt.extracting} {Math.round(scanProgress)}%
            </span>
        </motion.div>
    );
}
