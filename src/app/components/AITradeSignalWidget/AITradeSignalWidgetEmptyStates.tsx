import { motion } from "motion/react";
import { ShieldAlert, Target, Coins } from "lucide-react";
import type { ThemeTokens } from "../../hooks/useThemeTokens";
import type { AiTradeSignalTxt } from "./aiTradeSignalTranslations";
import type { AiSignalColors } from "./types";

type Props = {
    error: string | null;
    isScanning: boolean;
    tokenError: boolean;
    hasSignal: boolean;
    colors: AiSignalColors;
    tk: ThemeTokens;
    txt: AiTradeSignalTxt;
    language: string;
};

export function AITradeSignalWidgetEmptyStates({
    error,
    isScanning,
    tokenError,
    hasSignal,
    colors,
    tk,
    txt,
    language,
}: Props) {
    return (
        <>
            {error && !isScanning && (
                <div className="text-center py-6">
                    <div
                        className="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center"
                        style={{ background: tk.negativeBg, border: `1px solid ${tk.negativeBorder}` }}
                    >
                        <ShieldAlert className="w-7 h-7" style={{ color: tk.negative }} />
                    </div>
                    <p className="text-xs font-medium" style={{ color: tk.negative }}>
                        {error}
                    </p>
                </div>
            )}

            {!hasSignal && !isScanning && !error && !tokenError && (
                <div className="text-center py-8">
                    <motion.div
                        className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center relative"
                        style={{
                            background: `rgba(${colors.rgb},0.06)`,
                            border: `1px solid rgba(${colors.rgb},0.15)`,
                        }}
                        animate={{
                            boxShadow: [
                                `0 0 0 rgba(${colors.rgb},0)`,
                                `0 0 30px rgba(${colors.rgb},0.15)`,
                                `0 0 0 rgba(${colors.rgb},0)`,
                            ],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <Target className="w-8 h-8" style={{ color: colors.text, opacity: 0.5 }} />
                    </motion.div>
                    <p className="text-[11px] leading-relaxed max-w-[200px] mx-auto font-medium" style={{ color: tk.textMuted }}>
                        {txt.initScan}
                    </p>
                </div>
            )}

            {tokenError && !isScanning && (
                <div
                    className="text-center py-4 m-1 rounded-xl"
                    style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)" }}
                >
                    <div
                        className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                        style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
                    >
                        <Coins className="w-6 h-6 text-amber-400" />
                    </div>
                    <h3 className="font-black text-amber-400 text-xs mb-1">
                        {language === "ar" ? "رصيد التوكن غير كافٍ" : "Insufficient AI Tokens"}
                    </h3>
                    <p className="text-[10px] text-gray-500 px-3 leading-relaxed">
                        {language === "ar"
                            ? "يرجى شحن رصيدك من صفحة الملف الشخصي."
                            : "Please top up your tokens in the user profile."}
                    </p>
                </div>
            )}
        </>
    );
}
