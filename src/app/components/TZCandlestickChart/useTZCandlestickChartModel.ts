import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import type { ThemeTokens } from "../../hooks/useThemeTokens";
import { generateOHLCFromValue } from "./candlestickUtils";
import type { CandlestickRow, TZCandleDatum, TZCandlestickChartProps } from "./types";

const INFO_BAR_HEIGHT = 56;

export function useTZCandlestickChartModel({
    data,
    height = 400,
    livePrice,
    priceOffset = 0,
    showRightPadding = false,
    tk,
}: TZCandlestickChartProps & { tk: ThemeTokens }) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; data: CandlestickRow } | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(900);
    const margin = { top: 15, right: 55, bottom: 45, left: 5 };

    const chartHeight = Math.max(height - INFO_BAR_HEIGHT, 150);
    const chartWidth = containerWidth;
    const innerWidth = chartWidth - margin.left - margin.right;
    const innerHeight = chartHeight - margin.top - margin.bottom;

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const update = () => setContainerWidth(el.clientWidth || 900);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const candlestickData = useMemo((): CandlestickRow[] => {
        return data.map((item: TZCandleDatum, index: number) => {
            const hasNaN =
                isNaN(item.value) ||
                item.value === null ||
                (item.open !== undefined && (isNaN(item.open!) || item.open === null)) ||
                (item.high !== undefined && (isNaN(item.high!) || item.high === null)) ||
                (item.low !== undefined && (isNaN(item.low!) || item.low === null)) ||
                (item.close !== undefined && (isNaN(item.close!) || item.close === null));

            if (hasNaN) {
                return {
                    ...item,
                    open: 0,
                    high: 0,
                    low: 0,
                    close: 0,
                    isGreen: false,
                    isReal: false,
                    isNaNCandle: true,
                };
            }

            const hasOHLC =
                item.open !== undefined &&
                item.high !== undefined &&
                item.low !== undefined &&
                item.close !== undefined;
            const ohlc = hasOHLC
                ? { open: item.open!, high: item.high!, low: item.low!, close: item.close! }
                : generateOHLCFromValue(item.value, index);
            return {
                ...item,
                ...ohlc,
                isGreen: ohlc.close > ohlc.open,
                isReal: item.isReal || false,
                isNaNCandle: false,
            };
        });
    }, [data]);

    useEffect(() => {
        setHoveredIndex(-1);
        setTooltip(null);
    }, [data]);

    const { minY, maxY } = useMemo(() => {
        if (candlestickData.length === 0) return { minY: 0, maxY: 1 };
        let min = Infinity,
            max = -Infinity;
        for (const d of candlestickData) {
            if (d.isNaNCandle) continue;
            if (d.low < min) min = d.low;
            if (d.high > max) max = d.high;
        }
        if (min === Infinity || max === -Infinity) return { minY: 0 + priceOffset, maxY: 1 + priceOffset };
        const padding = (max - min) * 0.08 || 1;
        return { minY: min - padding + priceOffset, maxY: max + padding + priceOffset };
    }, [candlestickData, priceOffset]);

    const scaleY = useCallback(
        (val: number) => {
            return innerHeight - ((val - minY) / (maxY - minY)) * innerHeight;
        },
        [innerHeight, minY, maxY]
    );

    const rightPaddingRatio = showRightPadding ? 0.25 : 0;
    const dataWidth = innerWidth * (1 - rightPaddingRatio);
    const candleWidth = Math.max(Math.min((dataWidth / candlestickData.length) * 0.7, 14), 3);
    const gap = candlestickData.length > 0 ? dataWidth / candlestickData.length : innerWidth;

    const yTicks = useMemo(() => {
        const ticks: number[] = [];
        const range = maxY - minY;
        const step = range / 6;
        for (let i = 0; i <= 6; i++) {
            ticks.push(minY + step * i);
        }
        return ticks;
    }, [minY, maxY]);

    const xLabels = useMemo(() => {
        const total = candlestickData.length;
        const labelInterval = Math.max(Math.floor(total / 12), 1);
        return candlestickData
            .map((d, i) => ({
                label: d.isNaNCandle || !d.time || d.time.includes("NaN") ? "—" : d.time,
                index: i,
            }))
            .filter((_, i) => i % labelInterval === 0);
    }, [candlestickData]);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<SVGSVGElement>) => {
            const svg = svgRef.current;
            if (!svg) return;
            const rect = svg.getBoundingClientRect();
            const scaleX = chartWidth / rect.width;
            const scaleYFactor = chartHeight / rect.height;
            const mouseX = (e.clientX - rect.left) * scaleX - margin.left;
            const idx = Math.round(mouseX / gap - 0.5);
            if (idx >= 0 && idx < candlestickData.length) {
                setHoveredIndex(idx);
                setTooltip({
                    x: (e.clientX - rect.left) * scaleX,
                    y: (e.clientY - rect.top) * scaleYFactor,
                    data: candlestickData[idx],
                });
            } else {
                setHoveredIndex(-1);
                setTooltip(null);
            }
        },
        [candlestickData, gap, chartWidth, chartHeight, margin.left]
    );

    const handleMouseLeave = useCallback(() => {
        setHoveredIndex(-1);
        setTooltip(null);
    }, []);

    return {
        svgRef,
        containerRef,
        tooltip,
        hoveredIndex,
        margin,
        chartHeight,
        chartWidth,
        innerWidth,
        innerHeight,
        candlestickData,
        minY,
        maxY,
        scaleY,
        candleWidth,
        gap,
        yTicks,
        xLabels,
        handleMouseMove,
        handleMouseLeave,
        livePrice,
        tk,
        isDark: tk.isDark,
    };
}
