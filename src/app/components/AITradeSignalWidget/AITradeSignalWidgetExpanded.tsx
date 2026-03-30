import { motion, AnimatePresence } from "motion/react";
import type { TradeSignalResponse } from "../../hooks/useAITradeSignal";
import type { ThemeTokens } from "../../hooks/useThemeTokens";
import type { AiTradeSignalTxt } from "./aiTradeSignalTranslations";
import type { AiSignalColors } from "./types";
import { AITradeSignalWidgetEmptyStates } from "./AITradeSignalWidgetEmptyStates";
import { AITradeSignalWidgetExecuteBar } from "./AITradeSignalWidgetExecuteBar";
import { AITradeSignalWidgetFooter } from "./AITradeSignalWidgetFooter";
import { AITradeSignalWidgetScanOverlay } from "./AITradeSignalWidgetScanOverlay";
import { AITradeSignalWidgetSignalResult } from "./AITradeSignalWidgetSignalResult";

type Props = {
    colors: AiSignalColors;
    tk: ThemeTokens;
    txt: AiTradeSignalTxt;
    language: string;
    isRTL: boolean;
    isScanning: boolean;
    scanProgress: number;
    error: string | null;
    tokenError: boolean;
    signal: TradeSignalResponse | null;
    indicatorName?: string;
    aiLot: string;
    setAiLot: (v: string) => void;
    onExecuteTrade?: (action: string, sl?: number, tp?: number, lot?: number) => void;
    handleScan: () => void;
    resetSignal: () => void;
};

export function AITradeSignalWidgetExpanded({
    colors,
    tk,
    txt,
    language,
    isRTL,
    isScanning,
    scanProgress,
    error,
    tokenError,
    signal,
    indicatorName,
    aiLot,
    setAiLot,
    onExecuteTrade,
    handleScan,
    resetSignal,
}: Props) {
    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col flex-1 overflow-hidden relative"
        >
            <AnimatePresence>
                {isScanning && (
                    <AITradeSignalWidgetScanOverlay colors={colors} scanProgress={scanProgress} txt={txt} />
                )}
            </AnimatePresence>

            <div className="p-4 flex-1 overflow-y-auto max-h-[60vh] custom-scrollbar">
                <AITradeSignalWidgetEmptyStates
                    error={error}
                    isScanning={isScanning}
                    tokenError={tokenError}
                    hasSignal={!!signal}
                    colors={colors}
                    tk={tk}
                    txt={txt}
                    language={language}
                />

                {signal && !isScanning && (
                    <AITradeSignalWidgetSignalResult
                        signal={signal}
                        colors={colors}
                        tk={tk}
                        txt={txt}
                        isRTL={isRTL}
                        indicatorName={indicatorName}
                    />
                )}
            </div>

            <AITradeSignalWidgetFooter
                colors={colors}
                tk={tk}
                isScanning={isScanning}
                signal={signal}
                txt={txt}
                onScan={handleScan}
                onReset={resetSignal}
            />

            {signal && !isScanning && signal.action !== "HOLD" && onExecuteTrade && (
                <AITradeSignalWidgetExecuteBar
                    signal={signal}
                    colors={colors}
                    tk={tk}
                    aiLot={aiLot}
                    onLotChange={setAiLot}
                    onExecuteTrade={onExecuteTrade}
                />
            )}
        </motion.div>
    );
}
