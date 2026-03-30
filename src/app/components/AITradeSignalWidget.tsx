import { AnimatePresence } from "motion/react";
import { AITradeSignalWidgetExpanded } from "./AITradeSignalWidget/AITradeSignalWidgetExpanded";
import { AITradeSignalWidgetHeader } from "./AITradeSignalWidget/AITradeSignalWidgetHeader";
import type { AITradeSignalWidgetProps } from "./AITradeSignalWidget/types";
import { useAITradeSignalWidget } from "./AITradeSignalWidget/useAITradeSignalWidget";

export type { AITradeSignalWidgetProps } from "./AITradeSignalWidget/types";

export function AITradeSignalWidget({
    marketContext,
    assetSymbol,
    timeframe,
    mtfEnabled,
    mtfSmallTimeframe,
    mtfLargeTimeframe,
    indicatorName,
    onExecuteTrade,
}: AITradeSignalWidgetProps) {
    const vm = useAITradeSignalWidget({
        marketContext,
        assetSymbol,
        timeframe,
        mtfEnabled,
        mtfSmallTimeframe,
        mtfLargeTimeframe,
        indicatorName,
        onExecuteTrade,
    });

    const {
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
        indicatorName: indName,
        onExecuteTrade: execTrade,
    } = vm;

    return (
        <div
            className="rounded-2xl overflow-hidden relative flex flex-col font-mono flex-shrink-0"
            style={{
                background: tk.isDark
                    ? `radial-gradient(ellipse at 50% 0%, rgba(${colors.rgb},0.06) 0%, ${tk.bgPage} 60%)`
                    : tk.surface,
                backdropFilter: tk.isDark ? "blur(16px)" : undefined,
                border: `1px solid ${colors.border}`,
                boxShadow: tk.isDark
                    ? `${colors.glow}, 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)`
                    : `0 8px 30px rgba(0,0,0,0.06)`,
                transition: "all 0.5s ease",
            }}
        >
            <AITradeSignalWidgetHeader
                colors={colors}
                tk={tk}
                aiTokens={aiTokens}
                isScanning={isScanning}
                signal={signal}
                isExpanded={isExpanded}
                onToggleExpand={() => setIsExpanded(!isExpanded)}
            />

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <AITradeSignalWidgetExpanded
                        colors={colors}
                        tk={tk}
                        txt={txt}
                        language={language}
                        isRTL={isRTL}
                        isScanning={isScanning}
                        scanProgress={scanProgress}
                        error={error}
                        tokenError={tokenError}
                        signal={signal}
                        indicatorName={indName}
                        aiLot={aiLot}
                        setAiLot={setAiLot}
                        onExecuteTrade={execTrade}
                        handleScan={handleScan}
                        resetSignal={resetSignal}
                    />
                )}
            </AnimatePresence>

            <div className="absolute bottom-1 left-0 right-0 flex justify-center pointer-events-none">
                <span
                    className="text-[7px] tracking-[0.3em] uppercase font-semibold"
                    style={{ color: `rgba(${colors.rgb},0.15)` }}
                >
                    PHASE-X · CORE
                </span>
            </div>
        </div>
    );
}
