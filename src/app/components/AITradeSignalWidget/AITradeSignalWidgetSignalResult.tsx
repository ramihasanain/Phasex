import { motion } from "motion/react";
import type { TradeSignalResponse } from "../../hooks/useAITradeSignal";
import type { ThemeTokens } from "../../hooks/useThemeTokens";
import type { AiTradeSignalTxt } from "./aiTradeSignalTranslations";
import type { AiSignalColors } from "./types";
import { AITradeSignalWidgetSignalHero } from "./AITradeSignalWidgetSignalHero";
import { AITradeSignalWidgetSignalMetricsAndNarrative } from "./AITradeSignalWidgetSignalMetricsAndNarrative";

type Props = {
    signal: TradeSignalResponse;
    colors: AiSignalColors;
    tk: ThemeTokens;
    txt: AiTradeSignalTxt;
    isRTL: boolean;
    indicatorName?: string;
};

export function AITradeSignalWidgetSignalResult({ signal, colors, tk, txt, isRTL, indicatorName }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-3"
        >
            <AITradeSignalWidgetSignalHero
                signal={signal}
                colors={colors}
                tk={tk}
                txt={txt}
                indicatorName={indicatorName}
            />
            <AITradeSignalWidgetSignalMetricsAndNarrative
                signal={signal}
                colors={colors}
                tk={tk}
                txt={txt}
                isRTL={isRTL}
            />
        </motion.div>
    );
}
