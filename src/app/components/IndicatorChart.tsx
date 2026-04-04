import { useEffect } from "react";
import { motion } from "motion/react";
import { Activity } from "lucide-react";
import { useIndicatorChart } from "./IndicatorChart/useIndicatorChart";
import { IndicatorChartPanel } from "./IndicatorChart/IndicatorChartPanel";
import { IndicatorChartFullscreen } from "./IndicatorChart/IndicatorChartFullscreen";
import { IndicatorChartPopups } from "./IndicatorChart/IndicatorChartPopups";
import type { IndicatorChartProps } from "./IndicatorChart/indicatorChartTypesAndControls";

export type { Indicator, IndicatorChartProps } from "./IndicatorChart/indicatorChartTypesAndControls";

export function IndicatorChart(props: IndicatorChartProps) {
    const ctx = useIndicatorChart(props);
    const { currency, indicator, isRTL, tk, t, isExpanded } = ctx;

    useEffect(() => {
        if (!isExpanded) return;
        const prevHtml = document.documentElement.style.overflow;
        const prevBody = document.body.style.overflow;
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        return () => {
            document.documentElement.style.overflow = prevHtml;
            document.body.style.overflow = prevBody;
        };
    }, [isExpanded]);

    if (!currency || !indicator) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center rounded-2xl relative overflow-hidden"
                style={{
                    background: tk.isDark
                        ? "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.04) 0%, rgba(6,10,16,0.95) 60%)"
                        : tk.surface,
                    border: `1px solid ${tk.isDark ? "rgba(99,102,241,0.1)" : tk.border}`,
                    backdropFilter: tk.isDark ? "blur(16px)" : undefined,
                    minHeight: 400,
                }}
            >
                {tk.isDark && (
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(99,102,241,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.015) 1px, transparent 1px)",
                            backgroundSize: "40px 40px",
                        }}
                    />
                )}
                <div className="text-center relative z-10">
                    <motion.div
                        animate={{ y: [0, -8, 0], opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                    >
                        <Activity className="w-14 h-14 mx-auto mb-4" style={{ color: tk.info }} />
                    </motion.div>
                    <p className="text-sm font-black" style={{ color: tk.textPrimary }}>
                        {t("selectAssetAndIndicator")}
                    </p>
                    <p className="text-[11px] mt-1 font-bold" style={{ color: tk.textDim }}>
                        {isRTL ? "اختر سوق ومؤشر فني لبدء التحليل" : "Choose a market and technical indicator to start analysis"}
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <>
            <IndicatorChartPanel ctx={ctx} />
            <IndicatorChartFullscreen ctx={ctx} />
            <IndicatorChartPopups ctx={ctx} />
        </>
    );
}
