import React from "react";
import { useThemeTokens } from "../hooks/useThemeTokens";
import { TZCandlestickCandles } from "./TZCandlestickChart/TZCandlestickCandles";
import { TZCandlestickDefs } from "./TZCandlestickChart/TZCandlestickDefs";
import { TZCandlestickGridCrosshair } from "./TZCandlestickChart/TZCandlestickGridCrosshair";
import { TZCandlestickInfoBar } from "./TZCandlestickChart/TZCandlestickInfoBar";
import { TZCandlestickXAxis } from "./TZCandlestickChart/TZCandlestickXAxis";
import type { TZCandlestickChartProps } from "./TZCandlestickChart/types";
import { useTZCandlestickChartModel } from "./TZCandlestickChart/useTZCandlestickChartModel";

export type { TZCandlestickChartProps } from "./TZCandlestickChart/types";

export const TZCandlestickChart = React.memo(function TZCandlestickChart(props: TZCandlestickChartProps) {
    const tk = useThemeTokens();
    const m = useTZCandlestickChartModel({ ...props, tk });

    return (
        <div ref={m.containerRef} className="w-full h-full relative" style={{ direction: "ltr" }}>
            <svg
                ref={m.svgRef}
                width={m.chartWidth}
                height={m.chartHeight}
                className="w-full"
                style={{ height: `${m.chartHeight}px`, background: tk.chartBg, display: "block" }}
                onMouseMove={m.handleMouseMove}
                onMouseLeave={m.handleMouseLeave}
            >
                <g transform={`translate(${m.margin.left}, ${m.margin.top})`}>
                    <TZCandlestickGridCrosshair m={m} />
                    <TZCandlestickCandles m={m} />
                    <TZCandlestickXAxis m={m} />
                </g>
                <TZCandlestickDefs tk={tk} />
            </svg>
            <TZCandlestickInfoBar m={m} />
        </div>
    );
});
