import { motion } from "motion/react";
import {
    Target,
    ShieldAlert,
    Activity,
    Zap,
    BarChart2,
    Sparkles,
    Gauge,
    Layers,
} from "lucide-react";
import type { TradeSignalResponse } from "../../hooks/useAITradeSignal";
import type { ThemeTokens } from "../../hooks/useThemeTokens";
import type { AiTradeSignalTxt } from "./aiTradeSignalTranslations";
import type { AiSignalColors } from "./types";

type Props = {
    signal: TradeSignalResponse;
    colors: AiSignalColors;
    tk: ThemeTokens;
    txt: AiTradeSignalTxt;
    isRTL: boolean;
};

export function AITradeSignalWidgetSignalMetricsAndNarrative({ signal, colors, tk, txt, isRTL }: Props) {
    return (
        <>
            {signal.metrics && (
                <>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-xl" style={{ background: tk.infoBg, border: `1px solid ${tk.info}1a` }}>
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <Activity className="w-3 h-3" style={{ color: tk.info }} />
                                <span className="text-[8px] font-bold tracking-[0.1em]" style={{ color: tk.textDim }}>
                                    {txt.volatility}
                                </span>
                            </div>
                            <div className="text-[11px] font-black" style={{ color: tk.textBright }}>
                                {signal.metrics.volatility}
                            </div>
                        </div>

                        <div className="p-2.5 rounded-xl" style={{ background: tk.warningBg, border: `1px solid ${tk.warning}1a` }}>
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <Zap className="w-3 h-3" style={{ color: tk.warning }} />
                                <span className="text-[8px] font-bold tracking-[0.1em]" style={{ color: tk.textDim }}>
                                    {txt.trendStrength}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-[11px] font-black" style={{ color: tk.textBright }}>
                                    {signal.metrics.trendStrength}%
                                </div>
                                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: tk.warningBg }}>
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{
                                            background: `linear-gradient(90deg, ${tk.warning}, ${tk.warning})`,
                                            width: `${Math.min(100, Math.max(0, signal.metrics.trendStrength))}%`,
                                        }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, Math.max(0, signal.metrics.trendStrength))}%` }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div
                            className="p-2.5 rounded-xl"
                            style={{ background: tk.positiveBg, border: `1px solid ${tk.positiveBorder}` }}
                        >
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <BarChart2 className="w-3 h-3" style={{ color: tk.positive }} />
                                <span className="text-[8px] font-bold tracking-[0.1em]" style={{ color: tk.textDim }}>
                                    {txt.support}
                                </span>
                            </div>
                            <div className="text-[11px] font-black" style={{ color: tk.positive }}>
                                {signal.metrics.support}
                            </div>
                        </div>

                        <div
                            className="p-2.5 rounded-xl"
                            style={{ background: tk.negativeBg, border: `1px solid ${tk.negativeBorder}` }}
                        >
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <BarChart2 className="w-3 h-3" style={{ color: tk.negative }} />
                                <span className="text-[8px] font-bold tracking-[0.1em]" style={{ color: tk.textDim }}>
                                    {txt.resistance}
                                </span>
                            </div>
                            <div className="text-[11px] font-black" style={{ color: tk.negative }}>
                                {signal.metrics.resistance}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div
                            className="p-2.5 rounded-xl"
                            style={{
                                background: (signal.metrics.momentumScore ?? 0) >= 0 ? tk.positiveBg : tk.negativeBg,
                                border: `1px solid ${(signal.metrics.momentumScore ?? 0) >= 0 ? tk.positiveBorder : tk.negativeBorder}`,
                            }}
                        >
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <Gauge
                                    className="w-3 h-3"
                                    style={{
                                        color: (signal.metrics.momentumScore ?? 0) >= 0 ? tk.positive : tk.negative,
                                    }}
                                />
                                <span className="text-[8px] font-bold tracking-[0.1em]" style={{ color: tk.textDim }}>
                                    MOMENTUM
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="text-[11px] font-black"
                                    style={{
                                        color: (signal.metrics.momentumScore ?? 0) >= 0 ? tk.positive : tk.negative,
                                    }}
                                >
                                    {signal.metrics.momentumScore ?? 0}
                                </div>
                                <div className="flex-1 h-1 rounded-full overflow-hidden relative" style={{ background: tk.surfaceHover }}>
                                    <motion.div
                                        className="absolute h-full rounded-full"
                                        style={{
                                            background: (signal.metrics.momentumScore ?? 0) >= 0 ? tk.positive : tk.negative,
                                            width: `${Math.abs(signal.metrics.momentumScore ?? 0) / 2}%`,
                                            left:
                                                (signal.metrics.momentumScore ?? 0) >= 0
                                                    ? "50%"
                                                    : `${50 - Math.abs(signal.metrics.momentumScore ?? 0) / 2}%`,
                                        }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.abs(signal.metrics.momentumScore ?? 0) / 2}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    />
                                    <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: tk.textDim }} />
                                </div>
                            </div>
                        </div>

                        <div
                            className="p-2.5 rounded-xl"
                            style={{
                                background:
                                    signal.metrics.marketSentiment === "Bullish"
                                        ? tk.positiveBg
                                        : signal.metrics.marketSentiment === "Bearish"
                                          ? tk.negativeBg
                                          : tk.warningBg,
                                border: `1px solid ${
                                    signal.metrics.marketSentiment === "Bullish"
                                        ? tk.positiveBorder
                                        : signal.metrics.marketSentiment === "Bearish"
                                          ? tk.negativeBorder
                                          : tk.warning + "2d"
                                }`,
                            }}
                        >
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <Sparkles
                                    className="w-3 h-3"
                                    style={{
                                        color:
                                            signal.metrics.marketSentiment === "Bullish"
                                                ? tk.positive
                                                : signal.metrics.marketSentiment === "Bearish"
                                                  ? tk.negative
                                                  : tk.warning,
                                    }}
                                />
                                <span className="text-[8px] font-bold tracking-[0.1em]" style={{ color: tk.textDim }}>
                                    SENTIMENT
                                </span>
                            </div>
                            <div
                                className="text-[11px] font-black"
                                style={{
                                    color:
                                        signal.metrics.marketSentiment === "Bullish"
                                            ? tk.positive
                                            : signal.metrics.marketSentiment === "Bearish"
                                              ? tk.negative
                                              : tk.warning,
                                }}
                            >
                                {signal.metrics.marketSentiment}
                            </div>
                        </div>

                        <div
                            className="p-2.5 rounded-xl"
                            style={{
                                background:
                                    signal.metrics.timeframeAlignment === "Aligned"
                                        ? tk.positiveBg
                                        : signal.metrics.timeframeAlignment === "Conflicting"
                                          ? tk.negativeBg
                                          : tk.warningBg,
                                border: `1px solid ${
                                    signal.metrics.timeframeAlignment === "Aligned"
                                        ? tk.positiveBorder
                                        : signal.metrics.timeframeAlignment === "Conflicting"
                                          ? tk.negativeBorder
                                          : tk.warning + "2d"
                                }`,
                            }}
                        >
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <Layers
                                    className="w-3 h-3"
                                    style={{
                                        color:
                                            signal.metrics.timeframeAlignment === "Aligned"
                                                ? tk.positive
                                                : signal.metrics.timeframeAlignment === "Conflicting"
                                                  ? tk.negative
                                                  : tk.warning,
                                    }}
                                />
                                <span className="text-[8px] font-bold tracking-[0.1em]" style={{ color: tk.textDim }}>
                                    TF ALIGN
                                </span>
                            </div>
                            <div
                                className="text-[11px] font-black"
                                style={{
                                    color:
                                        signal.metrics.timeframeAlignment === "Aligned"
                                            ? tk.positive
                                            : signal.metrics.timeframeAlignment === "Conflicting"
                                              ? tk.negative
                                              : tk.warning,
                                }}
                            >
                                {signal.metrics.timeframeAlignment}
                            </div>
                        </div>

                        <div
                            className="p-2.5 rounded-xl"
                            style={{ background: tk.accentGlow08, border: `1px solid ${tk.accentGlow15}` }}
                        >
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <Target className="w-3 h-3" style={{ color: tk.accent }} />
                                <span className="text-[8px] font-bold tracking-[0.1em]" style={{ color: tk.textDim }}>
                                    R:R RATIO
                                </span>
                            </div>
                            <div className="text-[11px] font-black" style={{ color: tk.accent }}>
                                {signal.metrics.riskRewardRatio || "N/A"}
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div
                className="rounded-xl p-3.5 relative overflow-hidden"
                style={{ background: `rgba(${colors.rgb},0.03)`, border: `1px solid rgba(${colors.rgb},0.1)` }}
            >
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5" style={{ color: colors.text }} />
                    <span className="text-[9px] font-black tracking-[0.2em]" style={{ color: colors.text }}>
                        {txt.aiLogic}
                    </span>
                </div>
                <p className="text-[11px] leading-relaxed font-sans" style={{ color: tk.textSecondary }} dir={isRTL ? "rtl" : "ltr"}>
                    {signal.reasoning}
                </p>
            </div>

            {signal.risks && (
                <div className="rounded-xl p-3.5" style={{ background: tk.negativeBg, border: `1px solid ${tk.negativeBorder}` }}>
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldAlert className="w-3.5 h-3.5" style={{ color: tk.negative }} />
                        <span
                            className="text-[9px] font-black tracking-[0.2em]"
                            style={{ color: tk.negative, opacity: 0.8 }}
                        >
                            {txt.riskVectors}
                        </span>
                    </div>
                    <p className="text-[11px] leading-relaxed font-sans" style={{ color: tk.textMuted }} dir={isRTL ? "rtl" : "ltr"}>
                        {signal.risks}
                    </p>
                </div>
            )}
        </>
    );
}
