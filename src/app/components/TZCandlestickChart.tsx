import { useRef, useMemo, useState, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
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

export function TZCandlestickChart({ data, height = 400 }: TZCandlestickChartProps) {
  const { language } = useLanguage();
  const isDark = true;
  const isRTL = language === 'ar';
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: any } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

  // Chart dimensions
  const margin = { top: 15, right: 60, bottom: 45, left: 15 };
  const chartWidth = 900;
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Generate candlestick data — use real OHLC if available, else mock from value
  const candlestickData = useMemo(() => {
    return data.map((item, index) => {
      const hasOHLC = item.open !== undefined && item.high !== undefined && item.low !== undefined && item.close !== undefined;
      const ohlc = hasOHLC
        ? { open: item.open!, high: item.high!, low: item.low!, close: item.close! }
        : generateOHLCFromValue(item.value, index);
      return {
        ...item,
        ...ohlc,
        isGreen: ohlc.close > ohlc.open,
        isReal: item.isReal || false,
      };
    });
  }, [data]);

  // Calculate Y scale
  const { minY, maxY } = useMemo(() => {
    if (candlestickData.length === 0) return { minY: 0, maxY: 1 };
    let min = Infinity, max = -Infinity;
    for (const d of candlestickData) {
      if (d.low < min) min = d.low;
      if (d.high > max) max = d.high;
    }
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
      .map((d, i) => ({ label: d.time, index: i }))
      .filter((_, i) => i % labelInterval === 0);
  }, [candlestickData]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = chartWidth / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX - margin.left;
    const idx = Math.round(mouseX / gap - 0.5);
    if (idx >= 0 && idx < candlestickData.length) {
      setHoveredIndex(idx);
      setTooltip({
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * (height / rect.height),
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

  const gridColor = '#1a2030';
  const textColor = '#475569';
  const bgColor = '#111520';
  const crosshairColor = '#6366f1';

  return (
    <div className="w-full relative" style={{ direction: 'ltr' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${chartWidth} ${height}`}
        className="w-full"
        style={{ height: `${height}px`, background: bgColor, borderRadius: '8px' }}
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
          {hoveredIndex >= 0 && (
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
            const cx = i * gap + gap / 2;
            const isGreen = candle.isGreen;
            const color = isGreen ? '#10b981' : '#ef4444';
            const hoverColor = isGreen ? '#34d399' : '#f87171';
            const isHovered = i === hoveredIndex;
            const fillColor = isHovered ? hoverColor : color;

            const highY = scaleY(candle.high);
            const lowY = scaleY(candle.low);
            const openY = scaleY(candle.open);
            const closeY = scaleY(candle.close);
            const bodyTop = Math.min(openY, closeY);
            const bodyH = Math.max(Math.abs(openY - closeY), 1);
            const w = isHovered ? candleWidth * 1.2 : candleWidth;

            return (
              <g key={`candle-${i}`}>
                {/* Upper wick */}
                <line
                  x1={cx}
                  y1={highY}
                  x2={cx}
                  y2={bodyTop}
                  stroke={fillColor}
                  strokeWidth={isHovered ? 2 : 1.2}
                />
                {/* Candle body */}
                <rect
                  x={cx - w / 2}
                  y={bodyTop}
                  width={w}
                  height={bodyH}
                  fill={isGreen ? fillColor : fillColor}
                  stroke={fillColor}
                  strokeWidth={0.5}
                  rx={1}
                  opacity={isHovered ? 1 : 0.9}
                />
                {/* Lower wick */}
                <line
                  x1={cx}
                  y1={bodyTop + bodyH}
                  x2={cx}
                  y2={lowY}
                  stroke={fillColor}
                  strokeWidth={isHovered ? 2 : 1.2}
                />
                {/* Glow effect on hover */}
                {isHovered && (
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
          {xLabels.map(({ label, index }) => (
            <text
              key={`xlabel-${index}`}
              x={index * gap + gap / 2}
              y={innerHeight + 20}
              fill={textColor}
              fontSize="9"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {label}
            </text>
          ))}

          {/* X axis line */}
          <line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke={gridColor} strokeWidth={1} />
        </g>

        {/* Glow filter */}
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
            <div className="p-3 rounded-xl border shadow-2xl backdrop-blur-sm" style={{ background: 'rgba(17,21,32,0.95)', borderColor: 'rgba(255,255,255,0.08)' }}>
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
}