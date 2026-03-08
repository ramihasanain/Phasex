import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { useThemeTokens } from '../hooks/useThemeTokens';
import { useLanguage } from '../contexts/LanguageContext';

interface TZCandlestickChartProps {
  data: Array<{
    time: string;
    value: number;
    timestamp: number;
    fullTime?: string;
    open?: number;
    high?: number;
    low?: number;
    close?: number;
    isReal?: boolean;
  }>;
  height?: number;
  livePrice?: number; // Real-time price from WebSocket
}

// Seeded random for consistent candles (no re-randomization on re-render)
function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Generate OHLC from a single value with deterministic randomness
function generateOHLCFromValue(value: number, index: number) {
  const volatility = Math.max(Math.abs(value) * 0.06, 0.5);

  const r1 = seededRandom(index * 13 + 7);
  const r2 = seededRandom(index * 17 + 11);
  const r3 = seededRandom(index * 23 + 3);
  const r4 = seededRandom(index * 31 + 19);

  const openOffset = (r1 - 0.5) * volatility * 1.2;
  const closeOffset = (r2 - 0.5) * volatility * 1.2;

  const open = value + openOffset;
  const close = value + closeOffset;

  const wickUp = volatility * (0.3 + r3 * 0.7);
  const wickDown = volatility * (0.3 + r4 * 0.7);
  const high = Math.max(open, close) + wickUp;
  const low = Math.min(open, close) - wickDown;

  return { open, high, low, close };
}

export const TZCandlestickChart = React.memo(function TZCandlestickChart({ data, height = 400, livePrice }: TZCandlestickChartProps) {
  const { language } = useLanguage();
  const tk = useThemeTokens();
  const isDark = tk.isDark;
  const isRTL = language === 'ar';
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: any } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

  // Chart dimensions — responsive
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(900);
  const margin = { top: 15, right: 55, bottom: 45, left: 5 };
  const chartWidth = containerWidth;
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Measure container width on mount and resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth || 900);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Generate candlestick data — use real OHLC if available, else mock from value
  const candlestickData = useMemo(() => {
    return data.map((item, index) => {
      // Detect NaN/null candles
      const hasNaN = isNaN(item.value) || item.value === null
        || (item.open !== undefined && (isNaN(item.open) || item.open === null))
        || (item.high !== undefined && (isNaN(item.high) || item.high === null))
        || (item.low !== undefined && (isNaN(item.low) || item.low === null))
        || (item.close !== undefined && (isNaN(item.close) || item.close === null));

      if (hasNaN) {
        return {
          ...item,
          open: 0, high: 0, low: 0, close: 0,
          isGreen: false,
          isReal: false,
          isNaNCandle: true,
        };
      }

      const hasOHLC = item.open !== undefined && item.high !== undefined && item.low !== undefined && item.close !== undefined;
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

  // Reset hover state when data changes to prevent stale index references
  useEffect(() => {
    setHoveredIndex(-1);
    setTooltip(null);
  }, [data]);

  // Calculate Y scale
  const { minY, maxY } = useMemo(() => {
    if (candlestickData.length === 0) return { minY: 0, maxY: 1 };
    let min = Infinity, max = -Infinity;
    for (const d of candlestickData) {
      if (d.isNaNCandle) continue; // skip NaN entries
      if (d.low < min) min = d.low;
      if (d.high > max) max = d.high;
    }
    if (min === Infinity || max === -Infinity) return { minY: 0, maxY: 1 };
    const padding = (max - min) * 0.08 || 1;
    return { minY: min - padding, maxY: max + padding };
  }, [candlestickData]);

  const scaleY = useCallback((val: number) => {
    return innerHeight - ((val - minY) / (maxY - minY)) * innerHeight;
  }, [innerHeight, minY, maxY]);

  // X positioning
  const candleWidth = Math.max(Math.min(innerWidth / candlestickData.length * 0.7, 14), 3);
  const gap = innerWidth / candlestickData.length;

  // Grid lines
  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    const range = maxY - minY;
    const step = range / 6;
    for (let i = 0; i <= 6; i++) {
      ticks.push(minY + step * i);
    }
    return ticks;
  }, [minY, maxY]);

  // X axis labels
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

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = chartWidth / rect.width;
    const scaleYFactor = height / rect.height;
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
  }, [candlestickData, gap, chartWidth, height, margin.left]);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(-1);
    setTooltip(null);
  }, []);

  const gridColor = tk.chartGrid;
  const textColor = tk.chartText;
  const bgColor = tk.surface;
  const crosshairColor = '#6366f1';

  return (
    <div ref={containerRef} className="w-full h-full relative" style={{ direction: 'ltr' }}>
      <svg
        ref={svgRef}
        width={chartWidth}
        height={height}
        className="w-full"
        style={{ height: `${height}px`, background: bgColor, display: 'block' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid lines */}
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
                {tick.toFixed(2)}
              </text>
            </g>
          ))}

          {/* Zero line */}
          {minY <= 0 && maxY >= 0 && (
            <line
              x1={0}
              y1={scaleY(0)}
              x2={innerWidth}
              y2={scaleY(0)}
              stroke={isDark ? '#475569' : '#94a3b8'}
              strokeWidth={1.5}
              strokeDasharray="6 4"
            />
          )}

          {/* Crosshair */}
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
              {/* Price label on Y axis */}
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
                {candlestickData[hoveredIndex].close.toFixed(2)}
              </text>
            </>
          )}

          {/* Candlesticks */}
          {candlestickData.map((candle, i) => {
            if (!candle) return null;
            const cx = i * gap + gap / 2;
            const isGreen = candle.isGreen;
            const isLast = i === candlestickData.length - 1;
            const isLive = isLast && livePrice !== undefined;

            // For the last candle, use live price to update close/high/low
            let effectiveClose = candle.close;
            let effectiveHigh = candle.high;
            let effectiveLow = candle.low;
            let effectiveIsGreen = isGreen;
            if (isLive) {
              effectiveClose = livePrice!;
              effectiveHigh = Math.max(candle.high, livePrice!);
              effectiveLow = Math.min(candle.low, livePrice!);
              effectiveIsGreen = effectiveClose > candle.open;
            }

            // ── NaN candle → show "no data" placeholder ──
            if (candle.isNaNCandle) {
              const midY = height / 2;
              return (
                <g key={`candle-${i}`}>
                  {/* Dashed line */}
                  <line x1={cx} y1={margin.top + 10} x2={cx} y2={height - margin.bottom - 5}
                    stroke="#475569" strokeWidth={1} strokeDasharray="4 3" opacity={0.5} />
                  {/* No-data icon */}
                  <text x={cx} y={midY} textAnchor="middle" dominantBaseline="middle"
                    fill="#64748b" fontSize={16} fontWeight="bold">⊘</text>
                  {/* Label */}
                  <text x={cx} y={midY + 20} textAnchor="middle" dominantBaseline="middle"
                    fill="#475569" fontSize={8}>—</text>
                </g>
              );
            }

            const color = (isLive ? effectiveIsGreen : isGreen) ? '#059669' : '#dc2626';
            const hoverColor = (isLive ? effectiveIsGreen : isGreen) ? '#10b981' : '#ef4444';
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
                {/* Upper wick */}
                <line
                  x1={cx}
                  y1={highY}
                  x2={cx}
                  y2={bodyTop}
                  stroke={fillColor}
                  strokeWidth={isHovered ? 2 : isLive ? 2.2 : 1.2}
                  strokeLinecap="round"
                >
                  {isLive && <animate attributeName="stroke-width" values="2.2;1.4;2.2" dur="2s" repeatCount="indefinite" />}
                </line>
                {/* Candle body */}
                <rect
                  x={cx - w / 2}
                  y={bodyTop}
                  width={w}
                  height={bodyH}
                  fill={isLive ? `url(#liveGrad${effectiveIsGreen ? 'Green' : 'Red'})` : fillColor}
                  stroke={isLive ? 'rgba(255,255,255,0.3)' : fillColor}
                  strokeWidth={isLive ? 1 : 0.5}
                  rx={isLive ? 2 : 1}
                  opacity={isHovered ? 1 : isLive ? 0.95 : 0.9}
                  filter={isLive ? `url(#liveGlow)` : undefined}
                >
                  {isLive && <animate attributeName="opacity" values="0.95;0.75;0.95" dur="2s" repeatCount="indefinite" />}
                </rect>
                {/* Lower wick */}
                <line
                  x1={cx}
                  y1={bodyTop + bodyH}
                  x2={cx}
                  y2={lowY}
                  stroke={fillColor}
                  strokeWidth={isHovered ? 2 : isLive ? 2.2 : 1.2}
                  strokeLinecap="round"
                >
                  {isLive && <animate attributeName="stroke-width" values="1.4;2.2;1.4" dur="2s" repeatCount="indefinite" />}
                </line>

                {/* LIVE candle effects */}
                {isLive && (
                  <>
                    {/* === Multi-layer Halo Rings === */}
                    {/* Inner ring - fast pulse */}
                    <rect
                      x={cx - w / 2 - 4}
                      y={bodyTop - 4}
                      width={w + 8}
                      height={bodyH + 8}
                      fill="none"
                      stroke={fillColor}
                      strokeWidth={2}
                      rx={4}
                      filter="url(#liveGlow)">
                      <animate attributeName="opacity" values="0.7;0.15;0.7" dur="1.2s" repeatCount="indefinite" />
                    </rect>
                    {/* Middle ring - medium pulse */}
                    <rect
                      x={cx - w / 2 - 8}
                      y={bodyTop - 8}
                      width={w + 16}
                      height={bodyH + 16}
                      fill="none"
                      stroke={fillColor}
                      strokeWidth={1}
                      rx={6}
                      filter="url(#liveGlowWide)">
                      <animate attributeName="opacity" values="0.4;0.05;0.4" dur="1.8s" repeatCount="indefinite" />
                    </rect>
                    {/* Outer ring - slow pulse */}
                    <rect
                      x={cx - w / 2 - 14}
                      y={bodyTop - 14}
                      width={w + 28}
                      height={bodyH + 28}
                      fill="none"
                      stroke={fillColor}
                      strokeWidth={0.6}
                      rx={8}
                      filter="url(#liveGlowWide)">
                      <animate attributeName="opacity" values="0.2;0.0;0.2" dur="2.5s" repeatCount="indefinite" />
                    </rect>

                    {/* === Sparkle Particles === */}
                    {[0, 1, 2, 3, 4, 5].map((si) => {
                      const angle = (si / 6) * Math.PI * 2;
                      const radius = w + 12;
                      const sx = cx + Math.cos(angle) * radius;
                      const sy = (bodyTop + bodyH / 2) + Math.sin(angle) * (bodyH / 2 + 12);
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

                    {/* === Animated Price Line === */}
                    <line
                      x1={cx + w / 2 + 4}
                      y1={closeY}
                      x2={innerWidth}
                      y2={closeY}
                      stroke={fillColor}
                      strokeWidth={1.2}
                      strokeDasharray="4 3"
                      opacity={0.5}>
                      <animate attributeName="stroke-dashoffset" values="0;14" dur="1s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite" />
                    </line>

                    {/* === Premium Price Label === */}
                    <rect
                      x={innerWidth + 2}
                      y={closeY - 11}
                      width={56}
                      height={22}
                      rx={4}
                      fill={`url(#priceLabel${effectiveIsGreen ? 'Green' : 'Red'})`}
                      stroke={effectiveIsGreen ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}
                      strokeWidth={1}
                      filter="url(#liveGlow)">
                      <animate attributeName="opacity" values="1;0.75;1" dur="1.5s" repeatCount="indefinite" />
                    </rect>
                    <text
                      x={innerWidth + 30}
                      y={closeY + 4}
                      fill="white"
                      fontSize="9.5"
                      fontFamily="monospace"
                      textAnchor="middle"
                      fontWeight="bold">
                      {effectiveClose.toFixed(2)}
                    </text>

                    {/* === LIVE Beacon === */}
                    {/* Outer glow ring */}
                    <circle cx={cx} cy={highY - 12} r={6} fill="none" stroke={fillColor} strokeWidth={0.8}>
                      <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                    {/* Inner beacon dot */}
                    <circle cx={cx} cy={highY - 12} r={3} fill={fillColor}>
                      <animate attributeName="r" values="2;3.5;2" dur="1s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
                    </circle>
                    {/* White center */}
                    <circle cx={cx} cy={highY - 12} r={1.2} fill="white" opacity={0.8}>
                      <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}

                {/* Glow effect on hover */}
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

          {/* X axis labels */}
          {xLabels.map(({ label, index }) => {
            const parts = label.split('\n');
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
                    <tspan x={index * gap + gap / 2} dy="0">{parts[0]}</tspan>
                    <tspan x={index * gap + gap / 2} dy="11">{parts[1]}</tspan>
                  </>
                ) : (
                  label
                )}
              </text>
            );
          })}

          {/* X axis line */}
          <line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke={gridColor} strokeWidth={1} />
        </g>

        {/* Glow filters & Gradients */}
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor="currentColor" floodOpacity="0.3" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="liveGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="currentColor" floodOpacity="0.6" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="liveGlowWide" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feFlood floodColor="currentColor" floodOpacity="0.4" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Live candle gradient fills */}
          <linearGradient id="liveGradGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="1" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#059669" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="liveGradRed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
            <stop offset="50%" stopColor="#dc2626" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.9" />
          </linearGradient>
          {/* Price label gradients */}
          <linearGradient id="priceLabelGreen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="priceLabelRed" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
      </svg>

      {/* Tooltip */}
      {tooltip && tooltip.data && (() => {
        // Auto-detect decimal precision from the values
        const val = tooltip.data.close;
        const dec = val < 1 ? 5 : val < 100 ? 4 : val < 1000 ? 2 : val < 10000 ? 1 : 0;
        return (
          <div
            className="absolute pointer-events-none z-50"
            style={{
              left: `${Math.min(tooltip.x / chartWidth * 100, 75)}%`,
              top: `${Math.max(tooltip.y / height * 100 - 15, 5)}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="p-3 rounded-xl border shadow-2xl backdrop-blur-sm" style={{ background: tk.isDark ? 'rgba(17,21,32,0.95)' : 'rgba(255,255,255,0.95)', borderColor: tk.borderStrong }}>
              <p className="text-xs text-gray-400 mb-1.5 font-mono flex items-center gap-1.5">
                📅 {tooltip.data.fullTime || tooltip.data.time}
                {tooltip.data.isReal && <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold">★ JSON</span>}
              </p>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${tooltip.data.isGreen ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {tooltip.data.isGreen ? '▲ Bullish' : '▼ Bearish'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-1.5 text-xs text-gray-300">
                <div className="flex justify-between gap-3">
                  <span className="opacity-50">Open</span>
                  <span className="font-mono font-bold">{tooltip.data.open.toFixed(dec)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="opacity-50">High</span>
                  <span className="font-mono font-bold text-green-400">{tooltip.data.high.toFixed(dec)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="opacity-50">Low</span>
                  <span className="font-mono font-bold text-red-400">{tooltip.data.low.toFixed(dec)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="opacity-50">Close</span>
                  <span className="font-mono font-bold">{tooltip.data.close.toFixed(dec)}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
});