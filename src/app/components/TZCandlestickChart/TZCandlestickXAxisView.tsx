import type { useTZCandlestickChartModel } from "./useTZCandlestickChartModel";

type M = ReturnType<typeof useTZCandlestickChartModel>;

export function TZCandlestickXAxisView({ m }: { m: M }) {
    const { xLabels, gap, innerHeight, innerWidth, tk, hideXAxisLabels } = m;
    const gridColor = tk.chartGrid;
    const textColor = tk.chartText;

    return (
        <>
            {!hideXAxisLabels &&
                xLabels.map(({ label, index }) => {
                    const parts = label.split("\n");
                    return (
                        <text
                            key={`xlabel-${index}`}
                            x={index * gap + gap / 2}
                            y={innerHeight + (parts.length > 1 ? 16 : 20)}
                            fill={textColor}
                            fontSize="9"
                            fontFamily="monospace"
                            textAnchor="middle"
                        >
                            {parts.length > 1 ? (
                                <>
                                    <tspan x={index * gap + gap / 2} dy="0">
                                        {parts[0]}
                                    </tspan>
                                    <tspan x={index * gap + gap / 2} dy="11">
                                        {parts[1]}
                                    </tspan>
                                </>
                            ) : (
                                label
                            )}
                        </text>
                    );
                })}
            <line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke={gridColor} strokeWidth={1} />
        </>
    );
}
