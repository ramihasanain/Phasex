import type { useTZCandlestickChartModel } from "./useTZCandlestickChartModel";

type M = ReturnType<typeof useTZCandlestickChartModel>;

export function TZCandlestickGridCrosshair({
    m,
}: {
    m: M;
}) {
    const {
        yTicks,
        scaleY,
        innerWidth,
        innerHeight,
        minY,
        maxY,
        hoveredIndex,
        candlestickData,
        gap,
        tk,
        isDark,
    } = m;
    const gridColor = tk.chartGrid;
    const textColor = tk.chartText;
    const crosshairColor = tk.accent;

    return (
        <>
            {yTicks.map((tick, i) => (
                <g key={`grid-${i}`}>
                    <line
                        x1={0}
                        y1={scaleY(tick)}
                        x2={innerWidth}
                        y2={scaleY(tick)}
                        stroke={gridColor}
                        strokeDasharray="4 4"
                        strokeWidth={0.5}
                    />
                    <text
                        x={innerWidth + 8}
                        y={scaleY(tick) + 4}
                        fill={textColor}
                        fontSize="10"
                        fontFamily="monospace"
                    >
                        {tick.toFixed(4)}
                    </text>
                </g>
            ))}

            {minY <= 0 && maxY >= 0 && (
                <line
                    x1={0}
                    y1={scaleY(0)}
                    x2={innerWidth}
                    y2={scaleY(0)}
                    stroke={isDark ? "#475569" : "#94a3b8"}
                    strokeWidth={1.5}
                    strokeDasharray="6 4"
                />
            )}

            {hoveredIndex >= 0 && hoveredIndex < candlestickData.length && candlestickData[hoveredIndex] && (
                <>
                    <line
                        x1={hoveredIndex * gap + gap / 2}
                        y1={0}
                        x2={hoveredIndex * gap + gap / 2}
                        y2={innerHeight}
                        stroke={crosshairColor}
                        strokeWidth={0.8}
                        strokeDasharray="3 3"
                        opacity={0.6}
                    />
                    <line
                        x1={0}
                        y1={scaleY(candlestickData[hoveredIndex].close)}
                        x2={innerWidth}
                        y2={scaleY(candlestickData[hoveredIndex].close)}
                        stroke={crosshairColor}
                        strokeWidth={0.8}
                        strokeDasharray="3 3"
                        opacity={0.6}
                    />
                    <rect
                        x={innerWidth + 2}
                        y={scaleY(candlestickData[hoveredIndex].close) - 9}
                        width={52}
                        height={18}
                        rx={3}
                        fill={crosshairColor}
                    />
                    <text
                        x={innerWidth + 28}
                        y={scaleY(candlestickData[hoveredIndex].close) + 4}
                        fill="white"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                    >
                        {candlestickData[hoveredIndex].close.toFixed(4)}
                    </text>
                </>
            )}
        </>
    );
}
