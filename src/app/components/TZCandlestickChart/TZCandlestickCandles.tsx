import type { useTZCandlestickChartModel } from "./useTZCandlestickChartModel";

type M = ReturnType<typeof useTZCandlestickChartModel>;

export function TZCandlestickCandles({ m }: { m: M }) {
    const {
        candlestickData,
        gap,
        hoveredIndex,
        livePrice,
        scaleY,
        candleWidth,
        innerWidth,
        chartHeight,
        margin,
        tk,
    } = m;

    return (
        <>
            {candlestickData.map((candle, i) => {
                if (!candle) return null;
                const cx = i * gap + gap / 2;
                const isGreen = candle.isGreen;
                const isLive = candle.isLiveIndicator && livePrice !== undefined;

                let effectiveOpen = candle.open;
                let effectiveClose = candle.close;
                let effectiveHigh = candle.high;
                let effectiveLow = candle.low;
                let effectiveIsGreen = candle.close >= candle.open;

                if (candle.isLiveIndicator && livePrice !== undefined) {
                    effectiveClose = livePrice;
                    effectiveHigh = Math.max(candle.open, effectiveClose, candle.high);
                    effectiveLow = Math.min(candle.open, effectiveClose, candle.low);
                    effectiveIsGreen = effectiveClose >= candle.open;
                }

                const displayLivePrice =
                    candle.isLiveIndicator && livePrice !== undefined ? livePrice : candle.close;

                if (candle.isNaNCandle) {
                    const midY = chartHeight / 2;
                    return (
                        <g key={`candle-${i}`}>
                            <line
                                x1={cx}
                                y1={margin.top + 10}
                                x2={cx}
                                y2={chartHeight - margin.bottom - 5}
                                stroke="#475569"
                                strokeWidth={1}
                                strokeDasharray="4 3"
                                opacity={0.5}
                            />
                            <text
                                x={cx}
                                y={midY}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#64748b"
                                fontSize={16}
                                fontWeight="bold"
                            >
                                ⊘
                            </text>
                            <text
                                x={cx}
                                y={midY + 20}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#475569"
                                fontSize={8}
                            >
                                —
                            </text>
                        </g>
                    );
                }

                const color = (isLive ? effectiveIsGreen : isGreen) ? tk.chartCandleGreen : tk.chartCandleRed;
                const hoverColor = (isLive ? effectiveIsGreen : isGreen) ? tk.chartCandleGreen : tk.chartCandleRed;
                const isHovered = i === hoveredIndex;
                const fillColor = isHovered ? hoverColor : color;

                const highY = scaleY(isLive ? effectiveHigh : candle.high);
                const lowY = scaleY(isLive ? effectiveLow : candle.low);
                const openY = scaleY(candle.open);
                const closeY = scaleY(isLive ? effectiveClose : candle.close);
                const bodyTop = Math.min(openY, closeY);
                const bodyH = Math.max(Math.abs(openY - closeY), 1);
                const w = isHovered ? candleWidth * 1.2 : isLive ? candleWidth * 1.1 : candleWidth;

                return (
                    <g key={`candle-${i}`}>
                        <line
                            x1={cx}
                            y1={highY}
                            x2={cx}
                            y2={bodyTop}
                            stroke={fillColor}
                            strokeWidth={isHovered ? 2 : isLive ? 2.2 : 1.2}
                            strokeLinecap="round"
                        >
                            {isLive && (
                                <animate
                                    attributeName="stroke-width"
                                    values="2.2;1.4;2.2"
                                    dur="2s"
                                    repeatCount="indefinite"
                                />
                            )}
                        </line>
                        <rect
                            x={cx - w / 2}
                            y={bodyTop}
                            width={w}
                            height={bodyH}
                            fill={isLive ? `url(#liveGrad${effectiveIsGreen ? "Green" : "Red"})` : fillColor}
                            stroke={isLive ? tk.chartCandleLive : fillColor}
                            strokeWidth={isLive ? 1 : 0.5}
                            rx={isLive ? 2 : 1}
                            opacity={isHovered ? 1 : isLive ? 0.95 : 0.9}
                            filter={isLive ? `url(#liveGlow)` : undefined}
                        >
                            {isLive && (
                                <animate attributeName="opacity" values="0.95;0.75;0.95" dur="2s" repeatCount="indefinite" />
                            )}
                        </rect>
                        <line
                            x1={cx}
                            y1={bodyTop + bodyH}
                            x2={cx}
                            y2={lowY}
                            stroke={fillColor}
                            strokeWidth={isHovered ? 2 : isLive ? 2.2 : 1.2}
                            strokeLinecap="round"
                        >
                            {isLive && (
                                <animate
                                    attributeName="stroke-width"
                                    values="1.4;2.2;1.4"
                                    dur="2s"
                                    repeatCount="indefinite"
                                />
                            )}
                        </line>

                        {isLive && (
                            <>
                                <rect
                                    x={cx - w / 2 - 4}
                                    y={bodyTop - 4}
                                    width={w + 8}
                                    height={bodyH + 8}
                                    fill="none"
                                    stroke={fillColor}
                                    strokeWidth={2}
                                    rx={4}
                                    filter="url(#liveGlow)"
                                >
                                    <animate attributeName="opacity" values="0.7;0.15;0.7" dur="1.2s" repeatCount="indefinite" />
                                </rect>
                                <rect
                                    x={cx - w / 2 - 8}
                                    y={bodyTop - 8}
                                    width={w + 16}
                                    height={bodyH + 16}
                                    fill="none"
                                    stroke={fillColor}
                                    strokeWidth={1}
                                    rx={6}
                                    filter="url(#liveGlowWide)"
                                >
                                    <animate attributeName="opacity" values="0.4;0.05;0.4" dur="1.8s" repeatCount="indefinite" />
                                </rect>
                                <rect
                                    x={cx - w / 2 - 14}
                                    y={bodyTop - 14}
                                    width={w + 28}
                                    height={bodyH + 28}
                                    fill="none"
                                    stroke={fillColor}
                                    strokeWidth={0.6}
                                    rx={8}
                                    filter="url(#liveGlowWide)"
                                >
                                    <animate attributeName="opacity" values="0.2;0.0;0.2" dur="2.5s" repeatCount="indefinite" />
                                </rect>

                                {[0, 1, 2, 3, 4, 5].map((si) => {
                                    const angle = (si / 6) * Math.PI * 2;
                                    const radius = w + 12;
                                    const sx = cx + Math.cos(angle) * radius;
                                    const sy = bodyTop + bodyH / 2 + Math.sin(angle) * (bodyH / 2 + 12);
                                    return (
                                        <circle key={`sparkle-${si}`} cx={sx} cy={sy} r={1.5} fill={fillColor}>
                                            <animate
                                                attributeName="opacity"
                                                values="0;0.9;0"
                                                dur={`${1.5 + si * 0.3}s`}
                                                begin={`${si * 0.25}s`}
                                                repeatCount="indefinite"
                                            />
                                            <animate
                                                attributeName="r"
                                                values="0.8;2;0.8"
                                                dur={`${1.5 + si * 0.3}s`}
                                                begin={`${si * 0.25}s`}
                                                repeatCount="indefinite"
                                            />
                                        </circle>
                                    );
                                })}

                                <line
                                    x1={cx + w / 2 + 4}
                                    y1={scaleY(displayLivePrice)}
                                    x2={innerWidth}
                                    y2={scaleY(displayLivePrice)}
                                    stroke={fillColor}
                                    strokeWidth={1.2}
                                    strokeDasharray="4 3"
                                    opacity={0.5}
                                >
                                    <animate attributeName="stroke-dashoffset" values="0;14" dur="1s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite" />
                                </line>

                                <rect
                                    x={innerWidth + 2}
                                    y={scaleY(displayLivePrice) - 11}
                                    width={56}
                                    height={22}
                                    rx={4}
                                    fill={`url(#priceLabel${effectiveIsGreen ? "Green" : "Red"})`}
                                    stroke={effectiveIsGreen ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}
                                    strokeWidth={1}
                                    filter="url(#liveGlow)"
                                >
                                    <animate attributeName="opacity" values="1;0.75;1" dur="1.5s" repeatCount="indefinite" />
                                </rect>
                                <text
                                    x={innerWidth + 30}
                                    y={scaleY(displayLivePrice) + 4}
                                    fill="white"
                                    fontSize="9.5"
                                    fontFamily="monospace"
                                    textAnchor="middle"
                                    fontWeight="bold"
                                >
                                    {displayLivePrice.toFixed(4)}
                                </text>

                                <circle cx={cx} cy={highY - 12} r={6} fill="none" stroke={fillColor} strokeWidth={0.8}>
                                    <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                                </circle>
                                <circle cx={cx} cy={highY - 12} r={3} fill={fillColor}>
                                    <animate attributeName="r" values="2;3.5;2" dur="1s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
                                </circle>
                                <circle cx={cx} cy={highY - 12} r={1.2} fill="white" opacity={0.8}>
                                    <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1s" repeatCount="indefinite" />
                                </circle>
                            </>
                        )}

                        {isHovered && !isLive && (
                            <rect
                                x={cx - w / 2 - 2}
                                y={bodyTop - 2}
                                width={w + 4}
                                height={bodyH + 4}
                                fill="none"
                                stroke={fillColor}
                                strokeWidth={1.5}
                                rx={2}
                                opacity={0.4}
                                filter="url(#glow)"
                            />
                        )}
                    </g>
                );
            })}
        </>
    );
}
