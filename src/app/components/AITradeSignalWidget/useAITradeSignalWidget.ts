import { useCallback, useEffect, useMemo, useState } from "react";
import { useAITradeSignal } from "../../hooks/useAITradeSignal";
import type { TradeSignalResponse } from "../../hooks/useAITradeSignal";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useThemeTokens } from "../../hooks/useThemeTokens";
import type { ThemeTokens } from "../../hooks/useThemeTokens";
import { getAiTradeSignalTxt } from "./aiTradeSignalTranslations";
import type { AITradeSignalWidgetProps, AiSignalColors } from "./types";

function computeSignalColors(signal: TradeSignalResponse | null, tk: ThemeTokens): AiSignalColors {
    if (!signal) {
        return {
            bg: tk.accentGlow08,
            border: tk.accentGlow25,
            text: tk.accent,
            glow: "transparent",
            rgb: "99,102,241",
        };
    }
    switch (signal.action) {
        case "BUY": {
            const c = tk.positive;
            return {
                bg: tk.positiveBg,
                border: tk.positiveBorder,
                text: c,
                glow: `0 0 25px ${tk.positiveBg}`,
                rgb: "16,185,129",
            };
        }
        case "SELL": {
            const c = tk.negative;
            return {
                bg: tk.negativeBg,
                border: tk.negativeBorder,
                text: c,
                glow: `0 0 25px ${tk.negativeBg}`,
                rgb: "239,68,68",
            };
        }
        case "HOLD":
            return {
                bg: tk.warningBg,
                border: `${tk.warning}4d`,
                text: tk.warning,
                glow: `0 0 25px ${tk.warningBg}`,
                rgb: "245,158,11",
            };
        default:
            return {
                bg: tk.accentGlow08,
                border: tk.accentGlow25,
                text: tk.accent,
                glow: "transparent",
                rgb: "99,102,241",
            };
    }
}

export function useAITradeSignalWidget({
    marketContext,
    assetSymbol,
    timeframe,
    mtfEnabled,
    mtfSmallTimeframe,
    mtfLargeTimeframe,
    indicatorName,
    onExecuteTrade,
}: AITradeSignalWidgetProps) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const tk = useThemeTokens();
    const txt = useMemo(() => getAiTradeSignalTxt(language), [language]);

    const { signal, isScanning, error, scanMarket, resetSignal } = useAITradeSignal(
        assetSymbol,
        timeframe,
        mtfEnabled,
        mtfSmallTimeframe,
        mtfLargeTimeframe
    );
    const { aiTokens, consumeTokens } = useAuth();
    const [scanProgress, setScanProgress] = useState(0);
    const [isExpanded, setIsExpanded] = useState(true);
    const [tokenError, setTokenError] = useState(false);
    const [aiLot, setAiLot] = useState("0.01");

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (isScanning) {
            setScanProgress(0);
            interval = setInterval(() => {
                setScanProgress((prev) => {
                    if (prev >= 95) return prev;
                    return prev + Math.random() * 15;
                });
            }, 300);
        } else {
            setScanProgress(100);
        }
        return () => clearInterval(interval);
    }, [isScanning]);

    const handleScan = useCallback(() => {
        if (isScanning) return;
        setTokenError(false);
        if (!consumeTokens(1)) {
            setTokenError(true);
            return;
        }
        scanMarket(marketContext, language);
    }, [isScanning, consumeTokens, scanMarket, marketContext, language]);

    const colors = useMemo(() => computeSignalColors(signal, tk), [signal, tk]);

    return {
        language,
        isRTL,
        tk,
        txt,
        signal,
        isScanning,
        error,
        resetSignal,
        scanProgress,
        isExpanded,
        setIsExpanded,
        tokenError,
        aiLot,
        setAiLot,
        colors,
        handleScan,
        aiTokens,
        indicatorName,
        onExecuteTrade,
    };
}
