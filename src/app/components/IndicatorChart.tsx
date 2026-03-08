import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Asset } from "./MarketList";
import { useLanguage } from "../contexts/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, TrendingDown, Activity, Maximize2, Minimize2, Table, BarChart3, X, Clock, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Layers, ZoomIn, ZoomOut, SkipBack, SkipForward, Download } from "lucide-react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { usePhaseStateAPI } from "../hooks/usePhaseStateAPI";
import { TZCandlestickChart } from "./TZCandlestickChart";
import { DrawingToolbar, DrawingTool } from "./DrawingToolbar";
import { DrawingCanvas } from "./DrawingCanvas";
import type { PhaseCandle, PhaseStateDataMap } from "./TradingDashboard";
import { useThemeTokens } from "../hooks/useThemeTokens";


export interface Indicator {
  id: string;
  name: string;
  nameEn: string;
  type: "line" | "area" | "bar" | "tz";
  color: string;
  icon: string;
}

interface IndicatorChartProps {
  currency: Asset | null;
  indicator: Indicator | null;
  data: any[];
  timeframe: 5 | 15 | 30 | 60;
  onTimeframeChange: (timeframe: 5 | 15 | 30 | 60) => void;
  mtfEnabled?: boolean;
  mtfSmallTimeframe?: 5 | 15 | 30 | 60;
  mtfLargeTimeframe?: 240 | 720 | 1440;
  onMtfEnabledChange?: (enabled: boolean) => void;
  onMtfSmallTimeframeChange?: (timeframe: 5 | 15 | 30 | 60) => void;
  onMtfLargeTimeframeChange?: (timeframe: 240 | 720 | 1440) => void;
  phaseStateData?: PhaseStateDataMap;
  generateCandlesFromReal?: (real: PhaseCandle, count?: number) => any[];
}

/* ═══════════ Phase State Hierarchical Timeframes ═══════════ */

const phaseMainTFs: Record<string, string[]> = {
  "H1": ["M5", "M10", "M15"],
  "H2": ["M5", "M10", "M15", "M20", "M30"],
  "H4": ["M5", "M10", "M15", "M20", "M30", "H1"],
  "H6": ["M5", "M10", "M15", "M20", "M30", "H1"],
  "H8": ["M10", "M15", "M20", "M30", "H1", "H2"],
  "H12": ["M15", "M20", "M30", "H1", "H2", "H3"],
  "D1": ["M30", "H1", "H2", "H3", "H4", "H6"],
};

const mainTFKeys = Object.keys(phaseMainTFs);

function PhaseTimeframeSelector({ mainTF, subTF, onMainTFChange, onSubTFChange, color, isRTL, compact }: {
  mainTF: string; subTF: string;
  onMainTFChange: (tf: string) => void; onSubTFChange: (tf: string) => void;
  color: string; isRTL: boolean; compact?: boolean;
}) {
  const subs = phaseMainTFs[mainTF] || [];

  return (
    <div className="flex items-center gap-2">
      <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#475569" }} />

      {/* Main TF row */}
      <div className="flex items-center gap-0.5 p-0.5 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
        {mainTFKeys.map((tf) => {
          const active = mainTF === tf;
          return (
            <motion.button key={tf} onClick={() => onMainTFChange(tf)} whileTap={{ scale: 0.95 }}
              className={`${compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"} rounded-md font-bold cursor-pointer transition-all`}
              style={{
                background: active ? `${color}18` : "transparent",
                border: active ? `1px solid ${color}35` : "1px solid transparent",
                color: active ? color : "#64748b",
              }}>
              {tf}
            </motion.button>
          );
        })}
      </div>

      {/* Separator */}
      <div className="w-px h-5" style={{ background: "rgba(255,255,255,0.08)" }} />

      {/* Sub TF row */}
      <div className="flex items-center gap-0.5 p-0.5 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
        <AnimatePresence mode="popLayout">
          {subs.map((tf) => {
            const active = subTF === tf;
            return (
              <motion.button key={tf} onClick={() => onSubTFChange(tf)}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                whileTap={{ scale: 0.95 }}
                className={`${compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"} rounded-md font-bold cursor-pointer transition-all`}
                style={{
                  background: active ? "#6366f115" : "transparent",
                  border: active ? "1px solid #6366f135" : "1px solid transparent",
                  color: active ? "#818cf8" : "#475569",
                }}>
                {tf}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Active label */}
      <span className={`${compact ? "text-[9px]" : "text-[10px]"} font-mono px-2 py-0.5 rounded`}
        style={{ color: "#64748b", background: "rgba(255,255,255,0.02)" }}>
        {mainTF} → {subTF}
      </span>
    </div>
  );
}

export function IndicatorChart({ currency, indicator, data, timeframe, onTimeframeChange, mtfEnabled, mtfSmallTimeframe, mtfLargeTimeframe, onMtfEnabledChange, onMtfSmallTimeframeChange, onMtfLargeTimeframeChange, phaseStateData, generateCandlesFromReal }: IndicatorChartProps) {
  const { language, t } = useLanguage();
  const isRTL = language === "ar";
  const tk = useThemeTokens();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [viewWindow, setViewWindow] = useState(30);
  const [startIndex, setStartIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartIndex, setDragStartIndex] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);

  // Phase State hierarchical timeframes
  const [mainTF, setMainTF] = useState("H1");
  const [subTF, setSubTF] = useState("M5");

  // Live API data for Phase State
  const isPhaseIndicator = indicator?.id === "phase";
  const { candles: apiCandles, loading: apiLoading, error: apiError } = usePhaseStateAPI(
    currency?.symbol,
    mainTF,
    subTF,
    !!isPhaseIndicator
  );

  // Drawing tools — only for fullscreen
  const [selectedTool, setSelectedTool] = useState<DrawingTool>("cursor");
  const [magnetEnabled, setMagnetEnabled] = useState(false);
  const [drawingsLocked, setDrawingsLocked] = useState(false);
  const [drawingsVisible, setDrawingsVisible] = useState(true);
  const [drawings, setDrawings] = useState<any[]>([]);
  const clearDrawingsCallback = useCallback(() => setDrawings([]), []);
  // Memoized callbacks for DrawingToolbar (prevents re-render on every price tick)
  const handleClearDrawings = useCallback(() => {
    if (confirm('Clear drawings?')) setDrawings([]);
  }, []);
  const handleMagnetToggle = useCallback(() => setMagnetEnabled(prev => !prev), []);
  const handleLockToggle = useCallback(() => setDrawingsLocked(prev => !prev), []);
  const handleVisibilityToggle = useCallback(() => setDrawingsVisible(prev => !prev), []);
  const handleCloseDrawingTools = useCallback(() => setShowDrawingTools(false), []);
  const [showDrawingTools, setShowDrawingTools] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fullscreenChartRef = useRef<HTMLDivElement>(null);

  // Freeze live price when drawing tools are active to prevent chart re-renders
  const frozenPriceRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (showDrawingTools) {
      // Capture current price when drawing tools open
      frozenPriceRef.current = currency?.price;
    } else {
      frozenPriceRef.current = undefined;
    }
  }, [showDrawingTools]);
  // Use frozen price when drawing, live price otherwise
  const chartLivePrice = showDrawingTools ? frozenPriceRef.current : currency?.price;

  // Export chart as image with PHASE X watermark
  const handleExportChart = async () => {
    const ref = isExpanded ? fullscreenChartRef.current : chartRef.current;
    if (!ref || !currency || !indicator) return;
    setIsExporting(true);

    try {
      // Dynamic import html2canvas
      const mod = await import("html2canvas");
      const html2canvas = mod.default;

      // Capture the chart area
      const captured = await html2canvas(ref, {
        backgroundColor: "#0b0e14",
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        removeContainer: true,
      });

      // Create final canvas with watermark footer
      const finalW = captured.width;
      const footerH = 120;
      const finalH = captured.height + footerH;
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = finalW;
      finalCanvas.height = finalH;
      const ctx = finalCanvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context failed");

      // Fill background
      ctx.fillStyle = "#0b0e14";
      ctx.fillRect(0, 0, finalW, finalH);

      // Draw captured chart image
      ctx.drawImage(captured, 0, 0);

      // ── Diagonal "PHASE X" watermark across entire image ──
      ctx.save();
      ctx.globalAlpha = 0.035;
      ctx.font = "bold 52px Arial, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      for (let row = -200; row < finalH + 200; row += 180) {
        for (let col = -200; col < finalW + 200; col += 420) {
          ctx.save();
          ctx.translate(col, row);
          ctx.rotate(-0.42); // ~24 degrees
          ctx.fillText("PHASE X", 0, 0);
          ctx.restore();
        }
      }
      ctx.restore();

      // ── Footer bar ──
      const fy = captured.height;

      // Footer background
      ctx.fillStyle = "#0d1017";
      ctx.fillRect(0, fy, finalW, footerH);

      // Gradient accent line at top of footer
      const accentGrad = ctx.createLinearGradient(0, fy, finalW, fy);
      accentGrad.addColorStop(0, "#6366f1");
      accentGrad.addColorStop(0.5, "#8b5cf6");
      accentGrad.addColorStop(1, "#6366f1");
      ctx.fillStyle = accentGrad;
      ctx.fillRect(0, fy, finalW, 3);

      // PHASE X badge (rounded rect with fallback)
      const bx = 40, by = fy + 30, bw = 200, bh = 56;
      const bGrad = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
      bGrad.addColorStop(0, "#6366f1");
      bGrad.addColorStop(1, "#8b5cf6");
      ctx.fillStyle = bGrad;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 14);
        ctx.fill();
      } else {
        // Fallback: simple rect
        ctx.fillRect(bx, by, bw, bh);
      }

      // "PHASE X" text in badge
      ctx.font = "bold 28px Arial, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("PHASE X", bx + 30, by + bh / 2);

      // Symbol + Indicator + Timeframe info
      ctx.font = "bold 20px Arial, sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.textBaseline = "alphabetic";
      const infoText = `${currency.symbol}  •  ${isRTL ? indicator.name : indicator.nameEn}  •  ${timeframe}${isRTL ? "د" : "M"}`;
      ctx.fillText(infoText, bx + bw + 30, fy + 52);

      // Timestamp
      ctx.font = "400 16px Arial, sans-serif";
      ctx.fillStyle = "#475569";
      const dateStr = new Date().toLocaleString();
      ctx.fillText(dateStr, bx + bw + 30, fy + 78);

      // Copyright on the right
      ctx.font = "500 16px Arial, sans-serif";
      ctx.fillStyle = "#334155";
      ctx.textAlign = "right";
      ctx.fillText("© PHASE X Trading Platform", finalW - 40, fy + 65);

      // Trigger download
      const dataUrl = finalCanvas.toDataURL("image/png", 1.0);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `PHASE_X_${currency.symbol}_${indicator.id}_${timeframe}M_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    } catch (err) {
      console.error("Export error:", err);
      alert(isRTL ? "فشل التصدير، حاول مرة أخرى" : "Export failed, please try again");
    } finally {
      setIsExporting(false);
    }
  };

  // Use live API data for Phase State, fall back to uploaded JSON, then mock
  const effectiveData = useMemo(() => {
    // Priority 1: Live API candles
    if (isPhaseIndicator && apiCandles.length > 0) {
      return apiCandles;
    }
    // Priority 2: Uploaded JSON data
    if (isPhaseIndicator && phaseStateData && generateCandlesFromReal && currency) {
      const key = `${mainTF}_${subTF}`;
      const symbolData = phaseStateData[key];
      if (symbolData) {
        const candle = symbolData[currency.symbol];
        if (candle) {
          return generateCandlesFromReal(candle, 90);
        }
      }
    }
    // Priority 3: Mock chart data
    return data;
  }, [isPhaseIndicator, apiCandles, mainTF, subTF, currency?.symbol, phaseStateData, data]);

  useEffect(() => { setStartIndex(Math.max(0, effectiveData.length - viewWindow)); }, [effectiveData.length]);

  const displayedData = useMemo(() => effectiveData.slice(startIndex, startIndex + viewWindow), [effectiveData, startIndex, viewWindow]);

  // Memoize price range for DrawingCanvas to prevent re-renders from WebSocket updates
  const drawingPriceRange = useMemo(() => {
    if (displayedData.length === 0) return { min: 0, max: 0 };
    const values = displayedData.map((d: any) => d.value);
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [displayedData]);

  // Keyboard Nav
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); setStartIndex((p) => Math.max(0, p - 5)); }
      else if (e.key === "ArrowRight") { e.preventDefault(); setStartIndex((p) => Math.min(effectiveData.length - viewWindow, p + 5)); }
      else if (e.key === "Home") { e.preventDefault(); setStartIndex(0); }
      else if (e.key === "End") { e.preventDefault(); setStartIndex(Math.max(0, effectiveData.length - viewWindow)); }
      else if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomIn(); }
      else if (e.key === "-") { e.preventDefault(); zoomOut(); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [effectiveData.length, viewWindow]);

  // Zoom functions — use refs for stable callbacks (DrawingToolbar React.memo)
  const viewWindowRef = useRef(viewWindow);
  const startIndexRef = useRef(startIndex);
  const dataLenRef = useRef(effectiveData.length);
  useEffect(() => { viewWindowRef.current = viewWindow; }, [viewWindow]);
  useEffect(() => { startIndexRef.current = startIndex; }, [startIndex]);
  useEffect(() => { dataLenRef.current = effectiveData.length; }, [effectiveData.length]);

  const zoomIn = useCallback(() => {
    const vw = viewWindowRef.current;
    const si = startIndexRef.current;
    const nw = Math.max(10, vw - 5);
    setViewWindow(nw);
    const center = si + vw / 2;
    setStartIndex(Math.max(0, Math.min(dataLenRef.current - nw, Math.round(center - nw / 2))));
  }, []);
  const zoomOut = useCallback(() => {
    const vw = viewWindowRef.current;
    const si = startIndexRef.current;
    const nw = Math.min(dataLenRef.current, vw + 10);
    setViewWindow(nw);
    const center = si + vw / 2;
    setStartIndex(Math.max(0, Math.min(dataLenRef.current - nw, Math.round(center - nw / 2))));
  }, []);
  const panLeft = () => setStartIndex((p) => Math.max(0, p - Math.max(3, Math.round(viewWindow / 5))));
  const panRight = () => setStartIndex((p) => Math.min(effectiveData.length - viewWindow, p + Math.max(3, Math.round(viewWindow / 5))));
  const goStart = () => setStartIndex(0);
  const goEnd = () => setStartIndex(Math.max(0, effectiveData.length - viewWindow));

  const isDrawing = showDrawingTools && selectedTool !== "cursor" && selectedTool !== "crosshair";

  // Mouse drag on chart
  const onDown = (e: React.MouseEvent) => { if (isDrawing) return; setIsDragging(true); setDragStartX(e.clientX); setDragStartIndex(startIndex); };
  const onMove = (e: React.MouseEvent) => { if (!isDragging || !chartRef.current) return; const dx = e.clientX - dragStartX; const move = Math.round((dx / chartRef.current.offsetWidth) * viewWindow); setStartIndex(Math.max(0, Math.min(effectiveData.length - viewWindow, dragStartIndex - move))); };
  const onUp = () => setIsDragging(false);
  const onWheel = (e: React.WheelEvent) => { e.preventDefault(); if (e.deltaY > 0) zoomOut(); else zoomIn(); };

  /* ────── EMPTY STATE ────── */
  if (!currency || !indicator) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="h-full flex items-center justify-center rounded-xl"
        style={{ background: tk.surface, border: `1px solid ${tk.border}`, minHeight: 400 }}>
        <div className="text-center">
          <motion.div animate={{ y: [0, -8, 0], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2.5, repeat: Infinity }}>
            <Activity className="w-14 h-14 mx-auto mb-4" style={{ color: tk.textDim }} />
          </motion.div>
          <p className="text-sm font-medium" style={{ color: tk.textMuted }}>{t("selectAssetAndIndicator")}</p>
          <p className="text-[11px] mt-1" style={{ color: "#334155" }}>
            {isRTL ? "اختر سوق ومؤشر فني لبدء التحليل" : "Choose a market and technical indicator to start analysis"}
          </p>
        </div>
      </motion.div>
    );
  }

  /* ────── CHART ────── */
  const gridColor = tk.chartGrid;
  const textColor = tk.chartText;

  const CustomTick = ({ x, y, payload }: any) => {
    if (payload.value.includes("\n")) {
      const [d, ti] = payload.value.split("\n");
      return (<g transform={`translate(${x},${y})`}><text x={0} y={-5} textAnchor="middle" fill="#60a5fa" fontSize={11} fontWeight={700}>{d}</text><text x={0} y={10} textAnchor="middle" fill={textColor} fontSize={9}>{ti}</text></g>);
    }
    return (<g transform={`translate(${x},${y})`}><text x={0} y={5} textAnchor="middle" fill={textColor} fontSize={10}>{payload.value}</text></g>);
  };

  const TooltipContent = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const dec = currency.market === "CRYPTO" || currency.market === "INDEX" ? 2 : 4;
    return (
      <div className="px-3 py-2 rounded-lg" style={{ background: tk.tooltipBg, border: `1px solid ${tk.tooltipBorder}` }}>
        <p className="text-[10px] mb-0.5" style={{ color: tk.textMuted }}>{payload[0].payload.fullTime}</p>
        <p className="text-[12px] font-bold" style={{ color: tk.textPrimary }}>{payload[0].value.toFixed(dec)}</p>
      </div>
    );
  };

  const daySeps = () => displayedData.filter((d: any) => d.time.includes("\n")).map((d: any, i: number) => (
    <ReferenceLine key={`sep-${i}`} x={d.time} stroke="#334155" strokeWidth={1} strokeDasharray="4 4" opacity={0.4} />
  ));

  const renderChart = (height: number) => {
    const common = { data: displayedData, margin: { top: 5, right: 5, left: 0, bottom: 5 } };
    switch (indicator.type) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...common}>
              <defs><linearGradient id={`g-${indicator.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={indicator.color} stopOpacity={0.3} /><stop offset="95%" stopColor={indicator.color} stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />{daySeps()}
              <XAxis dataKey="time" stroke={textColor} height={50} tick={<CustomTick />} interval="preserveStartEnd" />
              <YAxis stroke={textColor} tick={{ fontSize: 10 }} />
              <Tooltip content={<TooltipContent />} />
              <Area type="monotone" dataKey="value" stroke={indicator.color} fillOpacity={1} fill={`url(#g-${indicator.id})`} />
            </AreaChart>
          </ResponsiveContainer>);
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart {...common}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />{daySeps()}
              <XAxis dataKey="time" stroke={textColor} height={50} tick={<CustomTick />} interval="preserveStartEnd" />
              <YAxis stroke={textColor} tick={{ fontSize: 10 }} />
              <Tooltip content={<TooltipContent />} />
              <Bar dataKey="value" fill={indicator.color} />
            </BarChart>
          </ResponsiveContainer>);
      case "tz":
        return <TZCandlestickChart data={displayedData} height={height} livePrice={chartLivePrice} />;
      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...common}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />{daySeps()}
              <XAxis dataKey="time" stroke={textColor} height={50} tick={<CustomTick />} interval="preserveStartEnd" />
              <YAxis stroke={textColor} tick={{ fontSize: 10 }} />
              <Tooltip content={<TooltipContent />} />
              <Line type="monotone" dataKey="value" stroke={indicator.color} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>);
    }
  };

  const decimals = currency.market === "CRYPTO" || currency.market === "INDEX" ? 2 : 4;
  const isPositive = currency.change >= 0;

  /* ─── NAV BUTTON ─── */
  const NavBtn = ({ onClick, disabled, children, title }: { onClick: () => void; disabled?: boolean; children: React.ReactNode; title?: string }) => (
    <button onClick={onClick} disabled={disabled} title={title}
      className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all disabled:opacity-20"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#94a3b8" }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
      {children}
    </button>
  );

  /* ════════════════════════════════════════════════════════════ */
  /* MAIN CHART PANEL (small view — NO drawing tools)            */
  /* ════════════════════════════════════════════════════════════ */
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        className="h-full rounded-xl overflow-hidden flex flex-col"
        style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>

        {/* ─── Header ─── */}
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${tk.border}` }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${indicator.color}15`, border: `1px solid ${indicator.color}20` }}>
              <Activity className="w-4 h-4" style={{ color: indicator.color }} />
            </div>
            <div>
              <span className="text-[13px] font-bold" style={{ color: tk.textPrimary }}>{isRTL ? indicator.name : indicator.nameEn}</span>
              <span className="text-[11px] mx-2" style={{ color: tk.textMuted }}>•</span>
              <span className="text-[11px]" style={{ color: tk.textMuted }}>{currency.symbol}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Price */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg" style={{ background: tk.surfaceHover }}>
              <span className="text-[13px] font-bold tabular-nums" style={{ color: tk.textPrimary }}>{currency.price.toFixed(decimals)}</span>
              <span className="text-[11px] font-bold flex items-center gap-0.5"
                style={{ color: isPositive ? "#22c55e" : "#ef4444" }}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? "+" : ""}{currency.changePercent.toFixed(2)}%
              </span>
            </div>
            {/* View Buttons */}
            <div className="flex items-center gap-0.5">
              {[
                { icon: Table, active: showTable, onClick: () => setShowTable(true), title: "Table" },
                { icon: BarChart3, active: !showTable, onClick: () => setShowTable(false), title: "Chart" },
                { icon: Download, active: false, onClick: () => handleExportChart(), title: isRTL ? "تصدير" : "Export" },
                { icon: Maximize2, active: false, onClick: () => setIsExpanded(true), title: isRTL ? "تكبير" : "Fullscreen" },
              ].map(({ icon: Ic, active, onClick, title }) => (
                <button key={title} onClick={onClick} className="w-7 h-7 rounded-md flex items-center justify-center cursor-pointer transition-all"
                  style={{ background: active ? "rgba(255,255,255,0.06)" : "transparent", color: active ? "#e2e8f0" : "#475569" }}>
                  <Ic className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Timeframe + Navigation Bar ─── */}
        <div className="px-4 py-2 flex items-center justify-between" style={{ borderBottom: `1px solid ${tk.border}` }}>
          {/* Timeframes */}
          {indicator.id === "phase" ? (
            <PhaseTimeframeSelector mainTF={mainTF} subTF={subTF} onMainTFChange={(m) => { setMainTF(m); setSubTF(phaseMainTFs[m][0]); }} onSubTFChange={setSubTF} color={indicator.color} isRTL={isRTL} compact />
          ) : (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 mr-1" style={{ color: "#475569" }} />
              {[5, 15, 30, 60].map((tf) => (
                <button key={tf} onClick={() => onTimeframeChange(tf as 5 | 15 | 30 | 60)}
                  className="px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all"
                  style={{
                    background: timeframe === tf ? `${indicator.color}15` : "transparent",
                    border: timeframe === tf ? `1px solid ${indicator.color}30` : "1px solid transparent",
                    color: timeframe === tf ? indicator.color : "#64748b",
                  }}>
                  {tf}{isRTL ? "د" : "M"}
                </button>
              ))}
            </div>
          )}

          {/* Navigation + Zoom Controls */}
          <div className="flex items-center gap-1">
            <NavBtn onClick={zoomIn} title={isRTL ? "تكبير" : "Zoom In"}><ZoomIn className="w-3.5 h-3.5" /></NavBtn>
            <NavBtn onClick={zoomOut} title={isRTL ? "تصغير" : "Zoom Out"}><ZoomOut className="w-3.5 h-3.5" /></NavBtn>
            <div className="w-px h-5 mx-1" style={{ background: "rgba(255,255,255,0.06)" }} />
            <NavBtn onClick={goStart} disabled={startIndex === 0} title={isRTL ? "البداية" : "Start"}>
              <SkipBack className="w-3.5 h-3.5" />
            </NavBtn>
            <NavBtn onClick={panLeft} disabled={startIndex === 0} title={isRTL ? "يسار" : "Left"}>
              <ChevronLeft className="w-3.5 h-3.5" />
            </NavBtn>
            <span className="text-[10px] font-mono px-2 py-1 rounded" style={{ color: "#64748b", background: "rgba(255,255,255,0.02)" }}>
              {startIndex + 1}–{Math.min(startIndex + viewWindow, effectiveData.length)} / {effectiveData.length}
            </span>
            <NavBtn onClick={panRight} disabled={startIndex >= effectiveData.length - viewWindow} title={isRTL ? "يمين" : "Right"}>
              <ChevronRight className="w-3.5 h-3.5" />
            </NavBtn>
            <NavBtn onClick={goEnd} disabled={startIndex >= effectiveData.length - viewWindow} title={isRTL ? "النهاية" : "End"}>
              <SkipForward className="w-3.5 h-3.5" />
            </NavBtn>
          </div>
        </div>

        {/* ─── Chart Area (NO drawing tools in small view) ─── */}
        <div ref={chartRef} className="flex-1 relative min-h-0"
          onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp} onWheel={onWheel}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}>

          {/* API Loading overlay */}
          {isPhaseIndicator && apiLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center" style={{ background: "rgba(17,21,32,0.8)" }}>
              <div className="flex flex-col items-center gap-3">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 rounded-full border-2 border-t-transparent" style={{ borderColor: `${indicator?.color || '#6366f1'}40`, borderTopColor: 'transparent' }} />
                <span className="text-xs font-medium" style={{ color: "#64748b" }}>{isRTL ? "جاري التحميل..." : "Loading live data..."}</span>
              </div>
            </div>
          )}
          <AnimatePresence mode="wait">
            {showTable ? (
              <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-auto rounded-lg"
                style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
                <table className="w-full">
                  <thead className="sticky top-0 z-10" style={{ background: "#0b0e14" }}>
                    <tr>
                      <th className="p-2 text-[11px] font-semibold text-left" style={{ color: "#64748b" }}>{isRTL ? "الوقت" : "Time"}</th>
                      <th className="p-2 text-[11px] font-semibold text-left" style={{ color: "#64748b" }}>Open</th>
                      <th className="p-2 text-[11px] font-semibold text-left" style={{ color: "#22c55e" }}>High</th>
                      <th className="p-2 text-[11px] font-semibold text-left" style={{ color: "#ef4444" }}>Low</th>
                      <th className="p-2 text-[11px] font-semibold text-left" style={{ color: "#64748b" }}>Close</th>
                    </tr>
                  </thead>
                  <tbody>
                    {effectiveData.map((row: any, i: number) => {
                      const hasOHLC = row.open !== undefined;
                      const isGreen = hasOHLC ? row.close > row.open : false;
                      const val = hasOHLC ? row.close : row.value;
                      const dec = val < 1 ? 5 : val < 100 ? 4 : val < 1000 ? 2 : val < 10000 ? 1 : 0;
                      return (
                        <tr key={i} style={{
                          borderBottom: "1px solid rgba(255,255,255,0.03)",
                          background: row.isReal ? "rgba(99,102,241,0.06)" : "transparent",
                        }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = row.isReal ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = row.isReal ? "rgba(99,102,241,0.06)" : "transparent")}>
                          <td className="p-2 text-[11px] font-mono flex items-center gap-1" style={{ color: "#64748b" }}>
                            {row.isReal && <span className="text-[8px] px-1 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold">★</span>}
                            {(row.fullTime || row.time || "").replace("\n", " ")}
                          </td>
                          {hasOHLC ? (
                            <>
                              <td className="p-2 text-[11px] font-bold font-mono tabular-nums" style={{ color: "#e2e8f0" }}>{row.open.toFixed(dec)}</td>
                              <td className="p-2 text-[11px] font-bold font-mono tabular-nums" style={{ color: "#22c55e" }}>{row.high.toFixed(dec)}</td>
                              <td className="p-2 text-[11px] font-bold font-mono tabular-nums" style={{ color: "#ef4444" }}>{row.low.toFixed(dec)}</td>
                              <td className="p-2 text-[11px] font-bold font-mono tabular-nums" style={{ color: isGreen ? "#22c55e" : "#ef4444" }}>{row.close.toFixed(dec)}</td>
                            </>
                          ) : (
                            <>
                              <td className="p-2 text-[11px] font-bold font-mono tabular-nums" style={{ color: "#e2e8f0" }}>{row.value.toFixed(decimals)}</td>
                              <td className="p-2 text-[11px]" style={{ color: "#475569" }}>—</td>
                              <td className="p-2 text-[11px]" style={{ color: "#475569" }}>—</td>
                              <td className="p-2 text-[11px]" style={{ color: "#475569" }}>—</td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div key="chart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                {renderChart(Math.max(300, (chartRef.current?.offsetHeight ?? 400) - 16))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Stats Footer ─── */}
        <div className="px-4 py-2 flex items-center gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          {[
            { label: t("currentPrice"), value: currency.price.toFixed(decimals), color: "#60a5fa" },
            { label: t("highPrice"), value: effectiveData.length ? Math.max(...effectiveData.map((d: any) => d.value)).toFixed(decimals) : "—", color: "#22c55e" },
            { label: t("lowPrice"), value: effectiveData.length ? Math.min(...effectiveData.map((d: any) => d.value)).toFixed(decimals) : "—", color: "#ef4444" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex-1 text-center px-3 py-1.5 rounded-lg" style={{ background: `${color}08`, border: `1px solid ${color}12` }}>
              <div className="text-[9px] font-medium" style={{ color: "#64748b" }}>{label}</div>
              <div className="text-[12px] font-bold tabular-nums" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* FULLSCREEN MODAL — with drawing tools                   */}
      {/* ════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: tk.isDark ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
            onClick={() => setIsExpanded(false)}>
            <motion.div initial={{ scale: 0.98 }} animate={{ scale: 1 }} exit={{ scale: 0.98 }}
              className="w-screen h-screen overflow-hidden flex flex-col"
              style={{ background: tk.bg }}
              onClick={(e) => e.stopPropagation()} dir={isRTL ? "rtl" : "ltr"}>

              {/* Fullscreen Header */}
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${tk.border}` }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${indicator.color}15`, border: `1px solid ${indicator.color}20` }}>
                    <Activity className="w-5 h-5" style={{ color: indicator.color }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: tk.textPrimary }}>{isRTL ? indicator.name : indicator.nameEn}</h2>
                    <p className="text-xs" style={{ color: tk.textMuted }}>{isRTL ? currency.name : currency.nameEn} • {currency.symbol}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Price */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: tk.surfaceHover }}>
                    <span className="text-lg font-bold tabular-nums" style={{ color: tk.textPrimary }}>{currency.price.toFixed(decimals)}</span>
                    <span className="text-sm font-bold" style={{ color: isPositive ? "#22c55e" : "#ef4444" }}>
                      {isPositive ? "+" : ""}{currency.changePercent.toFixed(2)}%
                    </span>
                  </div>
                  {/* Toolbar buttons */}
                  <div className="flex items-center gap-1">
                    <button onClick={() => setShowTable(!showTable)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer"
                      style={{ background: showTable ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)", color: showTable ? "#e2e8f0" : "#64748b" }}
                      title={isRTL ? "جدول" : "Table"}>
                      <Table className="w-4 h-4" />
                    </button>
                    <button onClick={() => setShowDrawingTools(!showDrawingTools)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer"
                      style={{ background: showDrawingTools ? `${indicator.color}15` : "rgba(255,255,255,0.03)", color: showDrawingTools ? indicator.color : "#64748b", border: showDrawingTools ? `1px solid ${indicator.color}30` : "1px solid transparent" }}
                      title={isRTL ? "أدوات الرسم" : "Drawing Tools"}>
                      <Layers className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleExportChart()} disabled={isExporting}
                      className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all"
                      style={{ background: isExporting ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)", color: isExporting ? "#818cf8" : "#64748b", border: isExporting ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent" }}
                      title={isRTL ? "تصدير صورة" : "Export Image"}>
                      {isExporting ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Download className="w-4 h-4" /></motion.div> : <Download className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setIsExpanded(false)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer"
                      style={{ background: tk.buttonGhost, color: tk.buttonGhostText }}
                      title={isRTL ? "إغلاق" : "Close"}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Fullscreen Timeframe + Navigation */}
              <div className="px-6 py-2 flex items-center justify-between" style={{ borderBottom: `1px solid ${tk.border}` }}>
                {indicator.id === "phase" ? (
                  <PhaseTimeframeSelector mainTF={mainTF} subTF={subTF} onMainTFChange={(m) => { setMainTF(m); setSubTF(phaseMainTFs[m][0]); }} onSubTFChange={setSubTF} color={indicator.color} isRTL={isRTL} />
                ) : (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 mr-1.5" style={{ color: "#475569" }} />
                    {[5, 15, 30, 60].map((tf) => (
                      <button key={tf} onClick={() => onTimeframeChange(tf as 5 | 15 | 30 | 60)}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                        style={{
                          background: timeframe === tf ? `${indicator.color}15` : "transparent",
                          border: timeframe === tf ? `1px solid ${indicator.color}30` : "1px solid transparent",
                          color: timeframe === tf ? indicator.color : "#64748b",
                        }}>
                        {tf}{isRTL ? "د" : "M"}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <NavBtn onClick={zoomIn} title="Zoom In"><ZoomIn className="w-3.5 h-3.5" /></NavBtn>
                  <NavBtn onClick={zoomOut} title="Zoom Out"><ZoomOut className="w-3.5 h-3.5" /></NavBtn>
                  <div className="w-px h-5 mx-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <NavBtn onClick={goStart} disabled={startIndex === 0}><SkipBack className="w-3.5 h-3.5" /></NavBtn>
                  <NavBtn onClick={panLeft} disabled={startIndex === 0}><ChevronLeft className="w-3.5 h-3.5" /></NavBtn>
                  <span className="text-[10px] font-mono px-2" style={{ color: "#475569" }}>
                    {startIndex + 1}–{Math.min(startIndex + viewWindow, effectiveData.length)}/{effectiveData.length}
                  </span>
                  <NavBtn onClick={panRight} disabled={startIndex >= effectiveData.length - viewWindow}><ChevronRight className="w-3.5 h-3.5" /></NavBtn>
                  <NavBtn onClick={goEnd} disabled={startIndex >= effectiveData.length - viewWindow}><SkipForward className="w-3.5 h-3.5" /></NavBtn>
                </div>
              </div>

              {/* Fullscreen Chart + Drawing Tools — flex layout */}
              <div className="flex-1 min-h-0 flex">
                {/* Drawing Toolbar — sidebar that pushes chart */}
                {showDrawingTools && !showTable && (
                  <div className="flex-shrink-0 h-full" style={{ width: "190px" }}>
                    <DrawingToolbar selectedTool={selectedTool} onToolChange={setSelectedTool}
                      onZoomIn={zoomIn} onZoomOut={zoomOut}
                      onClear={handleClearDrawings}
                      onExport={handleExportChart} magnetEnabled={magnetEnabled} onMagnetToggle={handleMagnetToggle}
                      locked={drawingsLocked} onLockToggle={handleLockToggle}
                      visible={drawingsVisible} onVisibilityToggle={handleVisibilityToggle}
                      onClose={handleCloseDrawingTools} />
                  </div>
                )}

                {/* Chart Area — fills remaining width */}
                <div ref={fullscreenChartRef} className="flex-1 min-h-0 min-w-0 relative">
                  {showTable ? (
                    <div className="h-full overflow-auto rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
                      <table className="w-full">
                        <thead className="sticky top-0 z-10" style={{ background: "#0b0e14" }}>
                          <tr>
                            <th className="p-2.5 text-xs font-semibold text-left" style={{ color: "#64748b" }}>{isRTL ? "الوقت" : "Time"}</th>
                            <th className="p-2.5 text-xs font-semibold text-left" style={{ color: "#64748b" }}>Open</th>
                            <th className="p-2.5 text-xs font-semibold text-left" style={{ color: "#22c55e" }}>High</th>
                            <th className="p-2.5 text-xs font-semibold text-left" style={{ color: "#ef4444" }}>Low</th>
                            <th className="p-2.5 text-xs font-semibold text-left" style={{ color: "#64748b" }}>Close</th>
                          </tr>
                        </thead>
                        <tbody>
                          {effectiveData.map((row: any, i: number) => {
                            const hasOHLC = row.open !== undefined;
                            const isGreen = hasOHLC ? row.close > row.open : false;
                            const val = hasOHLC ? row.close : row.value;
                            const dec = val < 1 ? 5 : val < 100 ? 4 : val < 1000 ? 2 : val < 10000 ? 1 : 0;
                            return (
                              <tr key={i} style={{
                                borderBottom: "1px solid rgba(255,255,255,0.03)",
                                background: row.isReal ? "rgba(99,102,241,0.06)" : "transparent",
                              }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = row.isReal ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = row.isReal ? "rgba(99,102,241,0.06)" : "transparent")}>
                                <td className="p-2.5 text-xs font-mono flex items-center gap-1.5" style={{ color: "#64748b" }}>
                                  {row.isReal && <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold">★</span>}
                                  {(row.fullTime || row.time || "").replace("\n", " ")}
                                </td>
                                {hasOHLC ? (
                                  <>
                                    <td className="p-2.5 text-xs font-bold font-mono tabular-nums" style={{ color: "#e2e8f0" }}>{row.open.toFixed(dec)}</td>
                                    <td className="p-2.5 text-xs font-bold font-mono tabular-nums" style={{ color: "#22c55e" }}>{row.high.toFixed(dec)}</td>
                                    <td className="p-2.5 text-xs font-bold font-mono tabular-nums" style={{ color: "#ef4444" }}>{row.low.toFixed(dec)}</td>
                                    <td className="p-2.5 text-xs font-bold font-mono tabular-nums" style={{ color: isGreen ? "#22c55e" : "#ef4444" }}>{row.close.toFixed(dec)}</td>
                                  </>
                                ) : (
                                  <>
                                    <td className="p-2.5 text-xs font-bold font-mono tabular-nums" style={{ color: "#e2e8f0" }}>{row.value.toFixed(decimals)}</td>
                                    <td className="p-2.5 text-xs" style={{ color: "#475569" }}>—</td>
                                    <td className="p-2.5 text-xs" style={{ color: "#475569" }}>—</td>
                                    <td className="p-2.5 text-xs" style={{ color: "#475569" }}>—</td>
                                  </>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    renderChart(window.innerHeight - 140)
                  )}

                  {/* Drawing Canvas overlay — only in fullscreen */}
                  {!showTable && showDrawingTools && (
                    <DrawingCanvas selectedTool={selectedTool} magnetEnabled={magnetEnabled} locked={drawingsLocked} visible={drawingsVisible}
                      data={displayedData}
                      priceRange={drawingPriceRange}
                      onDrawingsChange={setDrawings} onClearAll={clearDrawingsCallback} />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence >
    </>
  );
}