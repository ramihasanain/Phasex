import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Asset } from "./MarketList";
import { useLanguage } from "../contexts/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, TrendingDown, Activity, X, Clock, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Layers, ZoomIn, ZoomOut, SkipBack, SkipForward, Info, ChevronDown, Check, Table, BarChart3, Maximize2, Minimize2, ListOrdered, Edit3, Zap } from "lucide-react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { usePhaseStateAPI } from "../hooks/usePhaseStateAPI";
import { useDirectionStateAPI } from "../hooks/useDirectionStateAPI";
import { useOscillationStateAPI } from "../hooks/useOscillationStateAPI";
import { useDisplacementStateAPI } from "../hooks/useDisplacementStateAPI";
import { useReferenceStateAPI } from "../hooks/useReferenceStateAPI";
import { useEnvelopStateAPI } from "../hooks/useEnvelopStateAPI";
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
  locked?: boolean;
  lockType?: "coming_soon" | "upgrade";
}

interface IndicatorChartProps {
  currency: Asset | null;
  indicator: Indicator | null;
  data: any[];
  timeframe: number;
  onTimeframeChange: (timeframe: number) => void;
  mtfEnabled?: boolean;
  mtfSmallTimeframe?: number;
  mtfLargeTimeframe?: number;
  onMtfEnabledChange?: (enabled: boolean) => void;
  onMtfSmallTimeframeChange?: (timeframe: number) => void;
  onMtfLargeTimeframeChange?: (timeframe: number) => void;
  phaseStateData?: PhaseStateDataMap;
  generateCandlesFromReal?: (real: PhaseCandle, count?: number) => any[];
  onLiveChartData?: (data: any[]) => void;
  renderTradeButtons?: () => React.ReactNode;
  accessToken?: string | null;
  mt5Connected?: boolean;
  executeTrade?: (symbol: string, action: string, volume: number, sl?: number, tp?: number, comment?: string) => Promise<any>;
  bulkExecuteTrades?: (trades: Array<{symbol: string, action: string, volume: number, sl?: number, tp?: number, comment?: string}>) => Promise<{orders: any[], errors: any[]}>;
  mt5Positions?: any[];
  addTradeToHistory?: (entry: any) => void;
  serverTradeHistory?: any[];
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
              className={`${compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"} rounded - md font - bold cursor - pointer transition - all`}
              style={{
                background: active ? `${color} 18` : "transparent",
                border: active ? `1px solid ${color} 35` : "1px solid transparent",
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
                className={`${compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"} rounded - md font - bold cursor - pointer transition - all`}
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
      <span className={`${compact ? "text-[9px]" : "text-[10px]"} font - mono px - 2 py - 0.5 rounded`}
        style={{ color: "#64748b", background: "rgba(255,255,255,0.02)" }}>
        {mainTF} → {subTF}
      </span>
    </div>
  );
}

interface AnimatedStatProps {
  label: string;
  value: string | number;
  color: string;
  isDirection?: boolean;
}

const AnimatedStat = ({ label, value, color, isDirection }: AnimatedStatProps) => {
  const tk = useThemeTokens();
  const [flash, setFlash] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 500); // 500ms flash duration
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <motion.div
      className="flex-col justify-center items-center text-center px-1.5 py-1.5 md:px-3 rounded-lg flex relative"
      animate={{
        background: flash ? `${color} 30` : `${color}08`,
        borderColor: flash ? `${color} 60` : `${color} 12`,
        boxShadow: flash
          ? `0 0 15px ${color} 50, inset 0 0 10px ${color} 20`
          : (isDirection ? `0 0 8px ${color} 20, inset 0 0 5px ${color} 10` : "none"),
        scale: flash && isDirection ? 1.05 : 1
      }}
      transition={{ duration: 0.3 }}
      style={{ border: `1px solid ${color} 12`, minWidth: 0 }}
    >
      <div className="text-[9px] font-medium truncate w-full" style={{ color: tk.isDark ? '#64748b' : '#475569' }}>{label}</div>
      <motion.div
        className={`font - bold tabular - nums truncate w - full ${isDirection ? 'text-[14px] tracking-widest' : 'text-[12px]'} `}
        style={{
          color,
          textShadow: isDirection ? `0 0 10px ${color} 80` : 'none'
        }}
        animate={isDirection && !flash ? { opacity: [0.8, 1, 0.8] } : {}}
        transition={isDirection && !flash ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
      >
        {value}
      </motion.div>
    </motion.div>
  );
};

// Custom Candle Limit Popup
function CandleLimitSelector({ value, onChange, isRTL, tk, color, compact = false }: {
  value: number | "Auto";
  onChange: (val: string) => void;
  isRTL: boolean;
  tk: any;
  color: string;
  compact?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [customVal, setCustomVal] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (v: string) => { onChange(v); setIsOpen(false); };
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(customVal);
    if (!isNaN(num) && num > 0) {
      handleSelect(num.toString());
    }
  };

  const presets = ["Auto", 50, 100, 200, 500];

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded cursor-pointer transition-colors ${compact ? 'px-2 py-0.5 mr-1 md:mr-2' : 'px-3 py-1 rounded-lg mr-2 md:mr-4 shadow-inner'}`}
        style={{
          background: compact ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.2)",
          border: compact ? "1px solid rgba(255,255,255,0.05)" : `1px solid ${tk.border}`
        }}
      >
        <span className={`text-slate-400 font-bold uppercase ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
          {isRTL ? "الشموع" : "Candles"}:
        </span>
        <span className={`font-bold font-mono ${compact ? 'text-[11px]' : 'text-xs md:text-sm'}`}
          style={{ color: value === "Auto" ? "#e2e8f0" : color }}>
          {value}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-500" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 p-2 rounded-xl backdrop-blur-xl shadow-2xl overflow-hidden"
            style={{
              background: "rgba(15, 23, 42, 0.95)", border: `1px solid ${tk.border}`,
              ...(isRTL ? { left: 0 } : { right: 0 })
            }}
          >
            <div className="flex flex-col gap-1 w-32">
              <div className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1 mb-1">{isRTL ? 'إعدادات مسبقة' : 'Presets'}</div>
              {presets.map(p => (
                <button
                  key={p}
                  onClick={() => handleSelect(p.toString())}
                  className="text-left px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors flex items-center justify-between"
                  style={{
                    background: value === p ? `${color}15` : "transparent",
                    color: value === p ? color : "#e2e8f0"
                  }}
                >
                  {p}
                  {value === p && <Check className="w-3 h-3" />}
                </button>
              ))}

              <div className="w-full h-px my-1" style={{ background: tk.border }} />

              <div className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1">{isRTL ? 'مخصص' : 'Custom'}</div>
              <form onSubmit={handleCustomSubmit} className="flex gap-1 px-1 mt-1">
                <input
                  type="number" min="1" max="5000"
                  value={customVal} onChange={e => setCustomVal(e.target.value)}
                  placeholder={typeof value === 'number' && !presets.includes(value) ? value.toString() : "..."}
                  className="w-full bg-slate-800/50 rounded flex-1 px-2 py-1.5 text-xs text-white font-mono outline-none focus:ring-1 focus:ring-opacity-50"
                  style={{ border: `1px solid ${tk.border}` } as any}
                />
                <button type="submit" className="px-2 rounded bg-slate-700/50 hover:bg-slate-700 text-white transition-colors">
                  <Check className="w-3 h-3" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function IndicatorChart({
  currency, indicator, data, timeframe, onTimeframeChange,
  mtfEnabled = false, mtfSmallTimeframe = 5, mtfLargeTimeframe = 60,
  onMtfEnabledChange, onMtfSmallTimeframeChange, onMtfLargeTimeframeChange,
  phaseStateData, generateCandlesFromReal, onLiveChartData, renderTradeButtons,
  accessToken, mt5Connected, executeTrade: executeTradeFromChart, bulkExecuteTrades, mt5Positions, addTradeToHistory, serverTradeHistory,
}: IndicatorChartProps) {
  const { language, t } = useLanguage();
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showChartInfo, setShowChartInfo] = useState(false);
  const [candleLimit, setCandleLimit] = useState<number | "Auto">("Auto");
  const isRTL = language === "ar";
  const tk = useThemeTokens();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [dirLotSizes, setDirLotSizes] = useState<Record<number, number>>({});
  const [globalDirLot, setGlobalDirLot] = useState<number>(0.01);
  const [dirExecuting, setDirExecuting] = useState<Set<number>>(new Set());
  const [isExecutingAll, setIsExecutingAll] = useState(false);
  // Track executed trade comments to prevent duplicates (persists via serverTradeHistory)
  const [executedComments, setExecutedComments] = useState<Set<string>>(new Set());
  
  // Initialize executedComments from server trade history on mount/update
  // BUT only keep comments that have a matching active position
  useEffect(() => {
    const activeComments = new Set<string>(
      (mt5Positions || []).map((p: any) => p.comment).filter(Boolean)
    );
    
    if (serverTradeHistory && serverTradeHistory.length > 0) {
      const historyComments = new Set<string>();
      for (const entry of serverTradeHistory) {
        if (entry.tf && typeof entry.tf === 'string') historyComments.add(entry.tf);
        if (entry.comment && typeof entry.comment === 'string') historyComments.add(entry.comment);
      }
      // Only keep comments that are STILL active positions
      setExecutedComments(prev => {
        const merged = new Set<string>();
        // Keep existing entries only if they have an active position
        prev.forEach(c => { if (activeComments.has(c)) merged.add(c); });
        // Add history entries only if they have an active position
        historyComments.forEach(c => { if (activeComments.has(c)) merged.add(c); });
        return merged;
      });
    } else {
      // No history — just keep what's still active
      setExecutedComments(prev => {
        const cleaned = new Set<string>();
        prev.forEach(c => { if (activeComments.has(c)) cleaned.add(c); });
        return cleaned;
      });
    }
  }, [serverTradeHistory, mt5Positions]);
  const [viewWindow, setViewWindow] = useState(30);
  const [startIndex, setStartIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartIndex, setDragStartIndex] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const [dragStartYOffset, setDragStartYOffset] = useState(0);

  const handleLimitChange = useCallback((val: string) => {
    if (val === "Auto") {
      setCandleLimit("Auto");
    } else {
      const num = Number(val);
      setCandleLimit(num);
      setViewWindow(num);
      setYOffset(0);
      setStartIndex(Math.max(0, dataLenRef.current - num));
    }
  }, []);
  const chartRef = useRef<HTMLDivElement>(null);

  // Phase State hierarchical timeframes
  const [mainTF, setMainTF] = useState("H1");
  const [subTF, setSubTF] = useState("M5");

  const tfStringToNum = (tf: string) => {
    if (tf.startsWith("M")) return parseInt(tf.replace("M", ""));
    if (tf.startsWith("H")) return parseInt(tf.replace("H", "")) * 60;
    if (tf.startsWith("D")) return parseInt(tf.replace("D", "")) * 1440;
    return 15;
  };

  const handleMainTFChange = (m: string) => {
    setMainTF(m);
    const newSub = phaseMainTFs[m][0];
    setSubTF(newSub);
    onMtfEnabledChange?.(true);
    onMtfLargeTimeframeChange?.(tfStringToNum(m));
    onMtfSmallTimeframeChange?.(tfStringToNum(newSub));
  };

  const handleSubTFChange = (s: string) => {
    setSubTF(s);
    onMtfEnabledChange?.(true);
    onMtfLargeTimeframeChange?.(tfStringToNum(mainTF));
    onMtfSmallTimeframeChange?.(tfStringToNum(s));
  };

  const isPhaseIndicator = indicator?.id === "phase";

  // When switching to Phase indicator, ensure TradingDashboard MTF is instantly enabled with defaults
  useEffect(() => {
    if (isPhaseIndicator) {
      onMtfEnabledChange?.(true);
      onMtfLargeTimeframeChange?.(tfStringToNum(mainTF));
      onMtfSmallTimeframeChange?.(tfStringToNum(subTF));
    } else {
      onMtfEnabledChange?.(false);
    }
  }, [isPhaseIndicator]); // Only run when toggling indicators

  // Live API data for Phase State
  const { candles: apiCandles, loading: apiLoading, error: apiError } = usePhaseStateAPI(
    currency?.symbol,
    mainTF,
    subTF,
    !!isPhaseIndicator,
    accessToken
  );

  // Always fetch H1_from_M5 for the Directions table close price (regardless of selected TF)
  const { candles: h1m5Candles } = usePhaseStateAPI(
    currency?.symbol,
    "H1",
    "M5",
    !!isPhaseIndicator,
    accessToken
  );
  // Last candle close from H1_from_M5 — used as "Close Price" in directions table
  const h1m5ClosePrice = useMemo(() => {
    if (h1m5Candles.length === 0) return null;
    return h1m5Candles[h1m5Candles.length - 1]?.close ?? null;
  }, [h1m5Candles]);

  const isDirectionIndicator = indicator?.id === "direction";
  const { candles: dirCandles, loading: dirLoading, error: dirError } = useDirectionStateAPI(
    currency?.symbol,
    timeframe,
    !!isDirectionIndicator,
    accessToken
  );

  const isOscillationIndicator = indicator?.id === "oscillation";
  const { candles: oscCandles, loading: oscLoading, error: oscError } = useOscillationStateAPI(
    currency?.symbol,
    timeframe,
    !!isOscillationIndicator,
    accessToken
  );

  const isDisplacementIndicator = indicator?.id === "displacement";
  const { candles: dispCandles, loading: dispLoading, error: dispError } = useDisplacementStateAPI(
    currency?.symbol,
    timeframe,
    !!isDisplacementIndicator,
    accessToken
  );

  const isReferenceIndicator = indicator?.id === "reference";
  const { candles: refCandles, loading: refLoading, error: refError } = useReferenceStateAPI(
    currency?.symbol,
    timeframe,
    !!isReferenceIndicator,
    accessToken
  );

  const isEnvelopIndicator = indicator?.id === "envelop";
  const { candles: envCandles, loading: envLoading, error: envError } = useEnvelopStateAPI(
    currency?.symbol,
    timeframe,
    !!isEnvelopIndicator,
    accessToken
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

  // Use live API data for Phase State, or uploaded JSON. For Phase: NO mock fallback.
  const effectiveData = useMemo(() => {
    if (isPhaseIndicator) {
      // Priority 1: Live API candles — keep all entries (NaN handled in chart)
      if (apiCandles.length > 0) {
        return apiCandles;
      }
      // Priority 2: Uploaded JSON data
      if (phaseStateData && generateCandlesFromReal && currency) {
        const key = `${mainTF}_${subTF} `;
        const symbolData = phaseStateData[key];
        if (symbolData) {
          const candle = symbolData[currency.symbol];
          if (candle) {
            return generateCandlesFromReal(candle, 90);
          }
        }
      }
      // Phase indicator with no data → empty (will show "no readings" message)
      return [];
    }
    if (isDirectionIndicator) {
      if (dirCandles.length > 0) {
        return dirCandles;
      }
      return [];
    }
    if (isOscillationIndicator) {
      if (oscCandles.length > 0) {
        return oscCandles;
      }
      return [];
    }
    if (isDisplacementIndicator) {
      if (dispCandles.length > 0) {
        return dispCandles;
      }
      return [];
    }
    if (isReferenceIndicator) {
      if (refCandles.length > 0) {
        return refCandles;
      }
      return [];
    }
    if (isEnvelopIndicator) {
      if (envCandles.length > 0) {
        return envCandles;
      }
      return [];
    }
    // Non-phase indicators: use chart data
    return data;
  }, [isPhaseIndicator, apiCandles, mainTF, subTF, currency?.symbol, phaseStateData, data, isDirectionIndicator, dirCandles, isOscillationIndicator, oscCandles, isDisplacementIndicator, dispCandles, isReferenceIndicator, refCandles, isEnvelopIndicator, envCandles]);

  useEffect(() => { setStartIndex(Math.max(0, effectiveData.length - viewWindow)); }, [effectiveData.length]);

  const displayedData = useMemo(() => {
    const rawSlice = effectiveData.slice(startIndex, startIndex + viewWindow);
    if (rawSlice.length > 0 && startIndex + rawSlice.length >= effectiveData.length) {
      const isExcludedTarget = isDisplacementIndicator || isReferenceIndicator || isOscillationIndicator || isEnvelopIndicator;
      if (!isExcludedTarget) {
        const lastCandle = rawSlice[rawSlice.length - 1];
        rawSlice.push({
          time: "Live\nNow",
          value: lastCandle.close || lastCandle.value,
          open: lastCandle.close || lastCandle.value,
          high: lastCandle.close || lastCandle.value,
          low: lastCandle.close || lastCandle.value,
          close: lastCandle.close || lastCandle.value,
          timestamp: Date.now(),
          isLiveIndicator: true
        });
      }
    }
    return rawSlice;
  }, [effectiveData, startIndex, viewWindow, isDisplacementIndicator, isReferenceIndicator, isOscillationIndicator, isEnvelopIndicator]);

  // Memoize price range for DrawingCanvas to prevent re-renders from WebSocket updates
  const drawingPriceRange = useMemo(() => {
    if (displayedData.length === 0) return { min: 0, max: 0 };
    const values = displayedData.map((d: any) => d.value);
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [displayedData]);

  // Zoom functions — use refs for stable callbacks (DrawingToolbar React.memo)
  const viewWindowRef = useRef(viewWindow);
  const startIndexRef = useRef(startIndex);
  const dataLenRef = useRef(effectiveData.length);
  useEffect(() => { viewWindowRef.current = viewWindow; }, [viewWindow]);
  useEffect(() => { startIndexRef.current = startIndex; }, [startIndex]);
  useEffect(() => { 
    dataLenRef.current = effectiveData.length; 
    if (onLiveChartData) onLiveChartData(effectiveData);
  }, [effectiveData, onLiveChartData]);

  const zoomIn = useCallback(() => {
    setCandleLimit("Auto");
    setYOffset(0);
    const vw = viewWindowRef.current;
    const si = startIndexRef.current;
    const nw = Math.max(10, vw - 5);
    setViewWindow(nw);
    // Pin to the right side (most recent candles in view)
    const rightEdge = si + vw;
    setStartIndex(Math.max(0, rightEdge - nw));
  }, []);
  const zoomOut = useCallback(() => {
    setCandleLimit("Auto");
    setYOffset(0);
    const vw = viewWindowRef.current;
    const si = startIndexRef.current;
    const nw = Math.min(dataLenRef.current, vw + 10);
    setViewWindow(nw);
    // Pin to the right side (most recent candles in view)
    const rightEdge = si + vw;
    setStartIndex(Math.max(0, rightEdge - nw));
  }, []);

  const panLeft = () => { setCandleLimit("Auto"); setYOffset(0); setStartIndex((p) => Math.max(0, p - Math.max(3, Math.round(viewWindow / 5)))); };
  const panRight = () => { setCandleLimit("Auto"); setYOffset(0); setStartIndex((p) => Math.min(effectiveData.length - viewWindow, p + Math.max(3, Math.round(viewWindow / 5)))); };
  const goStart = () => { setCandleLimit("Auto"); setYOffset(0); setStartIndex(0); };
  const goEnd = () => { setCandleLimit("Auto"); setYOffset(0); setStartIndex(Math.max(0, effectiveData.length - viewWindow)); };

  const isDrawing = showDrawingTools && selectedTool !== "cursor" && selectedTool !== "crosshair";

  // Mouse drag on chart
  const onDown = (e: React.MouseEvent) => {
    if (isDrawing) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartIndex(startIndex);
    setDragStartY(e.clientY);
    setDragStartYOffset(yOffset);
  };
  const onMove = (e: React.MouseEvent) => {
    if (!isDragging || !chartRef.current) return;
    setCandleLimit("Auto");
    // Horizontal Move
    const dx = e.clientX - dragStartX;
    const moveX = Math.round((dx / chartRef.current.offsetWidth) * viewWindow);
    setStartIndex(Math.max(0, Math.min(effectiveData.length - viewWindow, dragStartIndex - moveX)));
    // Vertical Move
    const dy = e.clientY - dragStartY;
    const priceSpan = (drawingPriceRange.max - drawingPriceRange.min) || Math.abs(drawingPriceRange.max * 0.1) || 1;
    const moveY = (dy / chartRef.current.offsetHeight) * priceSpan;
    setYOffset(dragStartYOffset + moveY);
  };
  const onUp = () => setIsDragging(false);

  // Native wheel listener on chart: pan left/right & prevent page scroll
  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        // scroll down → pan right
        setCandleLimit("Auto");
        setYOffset(0);
        setStartIndex((p) => Math.min(effectiveData.length - viewWindow, p + Math.max(3, Math.round(viewWindow / 5))));
      } else {
        // scroll up → pan left
        setCandleLimit("Auto");
        setYOffset(0);
        setStartIndex((p) => Math.max(0, p - Math.max(3, Math.round(viewWindow / 5))));
      }
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [effectiveData.length, viewWindow]);

  // Keyboard Nav
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); setCandleLimit("Auto"); setStartIndex((p) => Math.max(0, p - 5)); }
      else if (e.key === "ArrowRight") { e.preventDefault(); setCandleLimit("Auto"); setStartIndex((p) => Math.min(effectiveData.length - viewWindow, p + 5)); }
      else if (e.key === "Home") { e.preventDefault(); setCandleLimit("Auto"); setStartIndex(0); }
      else if (e.key === "End") { e.preventDefault(); setCandleLimit("Auto"); setStartIndex(Math.max(0, effectiveData.length - viewWindow)); }
      else if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomIn(); }
      else if (e.key === "-") { e.preventDefault(); zoomOut(); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [effectiveData.length, viewWindow, zoomIn, zoomOut]);

  // Optimize Directions Table rendering
  // Use H1_from_M5 close price for the directions table (not the live socket price)
  const directionsData = useMemo(() => {
    const closePrice = h1m5ClosePrice;
    if (!showDirections || effectiveData.length === 0 || closePrice === null) return null;
    
    const rows = Array.from({ length: 50 }, (_, i) => (i + 1) * 10).map((windowSize, idx) => {
      if (windowSize > effectiveData.length) return null;

      const dataSlice = effectiveData.slice(-windowSize);
      if (dataSlice.length === 0) return null;

      const high = Math.max(...dataSlice.map((d: any) => d.high ?? d.value));
      const low = Math.min(...dataSlice.map((d: any) => d.low ?? d.value));
      const entry = (high + low) / 2;
      const currentPrice = closePrice;
      const isBuy = currentPrice >= entry;
      const directionStr = isBuy ? "Buy" : "Sell";
      const profit = isBuy ? currentPrice - entry : entry - currentPrice;

      return { windowSize, idx, high, low, entry, currentPrice, isBuy, directionStr, profit };
    }).filter(Boolean) as any[];

    if (rows.length === 0) return null;

    const maxProfitWindow = [...rows].reduce((max, row) => row.profit > max.profit ? row : max, rows[0]).windowSize;
    const minProfitWindow = [...rows].reduce((min, row) => row.profit < min.profit ? row : min, rows[0]).windowSize;

    return { rows, maxProfitWindow, minProfitWindow };
  }, [effectiveData, h1m5ClosePrice, showDirections]);

  const applyGlobalDirLot = (val: number) => {
    if (!directionsData?.rows) return;
    setDirLotSizes(prev => {
      const next = { ...prev };
      directionsData.rows.forEach((r: any) => { next[r.windowSize] = Number(val.toFixed(2)); });
      return next;
    });
  };

  const handleExecuteAll = async () => {
    if (!directionsData || !directionsData.rows || directionsData.rows.length === 0) return;
    if (!currency) return;
    
    setIsExecutingAll(true);
    
    // Build trades array — skip already executed or live positions
    const trades: Array<{symbol: string, action: string, volume: number, comment: string}> = [];
    const tradeWindowSizes: number[] = [];
    
    for (const row of directionsData.rows) {
      if (dirExecuting.has(row.windowSize)) continue;
      const chartComment = `PX-Chart-${currency.symbol}-${mainTF}-${subTF}-W${row.windowSize}-${row.isBuy ? 'BUY' : 'SELL'}`.slice(0, 31);
      const hasPos = mt5Positions?.some((p: any) => p.comment === chartComment) || false;
      const alreadyExecuted = executedComments.has(chartComment);
      if (hasPos || alreadyExecuted) continue;
      
      trades.push({
        symbol: currency.symbol,
        action: row.isBuy ? 'BUY' : 'SELL',
        volume: dirLotSizes[row.windowSize] ?? 0.01,
        comment: chartComment,
      });
      tradeWindowSizes.push(row.windowSize);
    }

    if (trades.length === 0) {
      setIsExecutingAll(false);
      return;
    }

    // Mark all as executing
    setDirExecuting(prev => {
      const next = new Set(prev);
      tradeWindowSizes.forEach(ws => next.add(ws));
      return next;
    });

    try {
      if (bulkExecuteTrades) {
        // 🚀 ROCKET MODE: ONE request, ALL trades fire in parallel on the server!
        const { orders } = await bulkExecuteTrades(trades);
        // Mark successfully executed comments
        const executedSet = new Set(orders.map((o: any) => o.comment).filter(Boolean));
        setExecutedComments(prev => {
          const next = new Set(prev);
          executedSet.forEach(c => next.add(c));
          return next;
        });
      } else if (executeTradeFromChart) {
        // Fallback: parallel individual calls
        await Promise.allSettled(trades.map(async (t) => {
          try {
            await executeTradeFromChart(t.symbol, t.action, t.volume, undefined, undefined, t.comment);
            setExecutedComments(prev => new Set(prev).add(t.comment));
          } catch (err) { console.error(err); }
        }));
      }
    } catch (err) {
      console.error('Bulk execution error:', err);
    }

    // Clear executing state
    setDirExecuting(prev => {
      const next = new Set(prev);
      tradeWindowSizes.forEach(ws => next.delete(ws));
      return next;
    });
    setIsExecutingAll(false);
  };



  /* ────── EMPTY STATE ────── */
  if (!currency || !indicator) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="h-full flex items-center justify-center rounded-2xl relative overflow-hidden"
        style={{ background: tk.isDark ? 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.04) 0%, rgba(6,10,16,0.95) 60%)' : tk.surface, border: `1px solid ${tk.isDark ? 'rgba(99,102,241,0.1)' : tk.border}`, backdropFilter: tk.isDark ? 'blur(16px)' : undefined, minHeight: 400 }}>
        {tk.isDark && <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.015) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />}
        <div className="text-center relative z-10">
          <motion.div animate={{ y: [0, -8, 0], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2.5, repeat: Infinity }}>
            <Activity className="w-14 h-14 mx-auto mb-4" style={{ color: tk.info }} />
          </motion.div>
          <p className="text-sm font-black" style={{ color: tk.textPrimary }}>{t("selectAssetAndIndicator")}</p>
          <p className="text-[11px] mt-1 font-bold" style={{ color: tk.textDim }}>
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
      return (<g transform={`translate(${x}, ${y})`}><text x={0} y={-5} textAnchor="middle" fill="#60a5fa" fontSize={11} fontWeight={700}>{d}</text><text x={0} y={10} textAnchor="middle" fill={textColor} fontSize={9}>{ti}</text></g>);
    }
    return (<g transform={`translate(${x}, ${y})`}><text x={0} y={5} textAnchor="middle" fill={textColor} fontSize={10}>{payload.value}</text></g>);
  };

  const TooltipContent = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const dec = currency.market === "CRYPTO" || currency.market === "INDEX" ? 2 : 4;
    return (
      <div className="px-3 py-2 rounded-lg" style={{ background: tk.tooltipBg, border: `1px solid ${tk.tooltipBorder} ` }}>
        <p className="text-[10px] mb-0.5" style={{ color: tk.textMuted }}>{payload[0].payload.fullTime}</p>
        <p className="text-[12px] font-bold" style={{ color: tk.textPrimary }}>{payload[0].value.toFixed(dec)}</p>
      </div>
    );
  };

  const daySeps = () => displayedData.filter((d: any) => d.time.includes("\n")).map((d: any, i: number) => (
    <ReferenceLine key={`sep - ${i} `} x={d.time} stroke="#334155" strokeWidth={1} strokeDasharray="4 4" opacity={0.4} />
  ));

  const renderChart = (height: number) => {
    // Show loading / error / empty state for Phase State when no data
    if ((isPhaseIndicator && effectiveData.length === 0) || (isDirectionIndicator && effectiveData.length === 0) || (isOscillationIndicator && effectiveData.length === 0) || (isDisplacementIndicator && effectiveData.length === 0) || (isReferenceIndicator && effectiveData.length === 0) || (isEnvelopIndicator && effectiveData.length === 0)) {
      const isLoading = isPhaseIndicator ? apiLoading : (isDirectionIndicator ? dirLoading : isOscillationIndicator ? oscLoading : isDisplacementIndicator ? dispLoading : isReferenceIndicator ? refLoading : envLoading);
      const errorMsg = isPhaseIndicator ? apiError : (isDirectionIndicator ? dirError : isOscillationIndicator ? oscError : isDisplacementIndicator ? dispError : isReferenceIndicator ? refError : envError);
      return (
        <div className="flex items-center justify-center rounded-lg" style={{ height, background: tk.surface, border: `1px solid ${tk.border} ` }}>
          <div className="text-center">
            {isLoading ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 mx-auto mb-3 rounded-full" style={{ border: `3px solid ${tk.border} `, borderTopColor: '#6366f1' }} />
                <p className="text-sm font-medium" style={{ color: tk.textMuted }}>
                  {isRTL ? "جاري تحميل القراءات..." : "Loading readings..."}
                </p>
              </>
            ) : (
              <>
                <Activity className="w-12 h-12 mx-auto mb-3" style={{ color: tk.textDim, opacity: 0.5 }} />
                <p className="text-sm font-medium" style={{ color: tk.textMuted }}>
                  {isRTL ? "لا توجد قراءات حالية" : "No current readings"}
                </p>
                {errorMsg && (
                  <p className="text-xs mt-1" style={{ color: tk.negative, opacity: 0.7 }}>{errorMsg}</p>
                )}
                <p className="text-[11px] mt-2" style={{ color: tk.textDim }}>
                  {isPhaseIndicator 
                    ? (isRTL ? `${currency?.symbol} - ${mainTF} من ${subTF} ` : `${currency?.symbol} - ${mainTF} from ${subTF} `)
                    : isDirectionIndicator 
                      ? (isRTL ? `${currency?.symbol} - الإتجاه (${timeframe}د)` : `${currency?.symbol} - Direction (M${timeframe})`)
                      : isOscillationIndicator
                        ? (isRTL ? `${currency?.symbol} - التذبذب (${timeframe}د)` : `${currency?.symbol} - Oscillation (M${timeframe})`)
                        : isDisplacementIndicator
                          ? (isRTL ? `${currency?.symbol} - الإزاحة (${timeframe}د)` : `${currency?.symbol} - Displacement (M${timeframe})`)
                          : isReferenceIndicator
                            ? (isRTL ? `${currency?.symbol} - المرجع (${timeframe}د)` : `${currency?.symbol} - Reference (M${timeframe})`)
                            : (isRTL ? `${currency?.symbol} - الغلاف (${timeframe}د)` : `${currency?.symbol} - Envelop (M${timeframe})`)
                  }
                </p>
              </>
            )}
          </div>
        </div>
      );
    }

    const common = { data: displayedData, margin: { top: 5, right: 5, left: 0, bottom: 5 } };
    switch (indicator.type) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...common}>
              <defs><linearGradient id={`g - ${indicator.id} `} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={indicator.color} stopOpacity={0.3} /><stop offset="95%" stopColor={indicator.color} stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />{daySeps()}
              <XAxis dataKey="time" stroke={textColor} height={50} tick={<CustomTick />} interval="preserveStartEnd" />
              <YAxis
                stroke={textColor}
                tick={{ fontSize: 10 }}
                tickFormatter={(val: number) => val.toFixed(4)}
                domain={[
                  (dataMin: number) => (dataMin - (dataMin * 0.05)) + yOffset,
                  (dataMax: number) => (dataMax + (dataMax * 0.05)) + yOffset,
                ]}
              />
              <Tooltip content={<TooltipContent />} />
              <Area type="monotone" dataKey="value" stroke={indicator.color} fillOpacity={1} fill={`url(#g - ${indicator.id})`} />
            </AreaChart>
          </ResponsiveContainer>);
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart {...common}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />{daySeps()}
              <XAxis dataKey="time" stroke={textColor} height={50} tick={<CustomTick />} interval="preserveStartEnd" />
              <YAxis
                stroke={textColor}
                tick={{ fontSize: 10 }}
                tickFormatter={(val: number) => val.toFixed(4)}
                domain={[
                  (dataMin: number) => (dataMin - (dataMin * 0.05)) + yOffset,
                  (dataMax: number) => (dataMax + (dataMax * 0.05)) + yOffset,
                ]}
              />
              <Tooltip content={<TooltipContent />} />
              <Bar dataKey="value" fill={indicator.color} />
            </BarChart>
          </ResponsiveContainer>);
      case "tz":
        return (
          <TZCandlestickChart
            data={displayedData}
            height={height}
            livePrice={currency.price}
            priceOffset={yOffset}
            showRightPadding={startIndex + viewWindow >= effectiveData.length}
          />);
      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...common}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />{daySeps()}
              <XAxis dataKey="time" stroke={textColor} height={50} tick={<CustomTick />} interval="preserveStartEnd" />
              <YAxis
                stroke={textColor}
                tick={{ fontSize: 10 }}
                tickFormatter={(val: number) => val.toFixed(4)}
                domain={[
                  (dataMin: number) => (dataMin - (dataMin * 0.05)) + yOffset,
                  (dataMax: number) => (dataMax + (dataMax * 0.05)) + yOffset,
                ]}
              />
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
        className="h-full rounded-2xl overflow-hidden flex flex-col relative"
        style={{ background: tk.isDark ? 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.04) 0%, rgba(6,10,16,0.95) 60%)' : tk.surface, border: `1px solid ${tk.isDark ? 'rgba(99,102,241,0.1)' : tk.border}`, backdropFilter: tk.isDark ? 'blur(16px)' : undefined }}>
        {/* Grid bg — dark only */}
        {tk.isDark && <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.015) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />}

        {/* ─── Header ─── */}
        <div className="px-4 py-3 flex items-center justify-between relative z-10" style={{ borderBottom: `1px solid ${tk.isDark ? 'rgba(99,102,241,0.08)' : tk.border}` }}>
          <div className="flex items-center gap-3 relative z-10 w-1/3">
            <motion.div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: tk.infoBg, border: `1px solid ${tk.isDark ? 'rgba(99,102,241,0.15)' : 'rgba(79,70,229,0.15)'}` }}
              animate={tk.isDark ? { boxShadow: ['0 0 0 rgba(99,102,241,0)', '0 0 15px rgba(99,102,241,0.1)', '0 0 0 rgba(99,102,241,0)'] } : {}}
              transition={{ duration: 3, repeat: Infinity }}>
              <Activity className="w-4 h-4" style={{ color: tk.info }} />
            </motion.div>
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-black tracking-[0.15em] uppercase" style={{ color: tk.textPrimary }}>{isRTL ? indicator.name : indicator.nameEn}</span>
              <button
                onClick={() => setShowChartInfo(true)}
                className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all flex-shrink-0"
                style={{ background: tk.infoBg, border: `1px solid ${tk.isDark ? 'rgba(99,102,241,0.2)' : 'rgba(79,70,229,0.15)'}`, color: tk.info }}
                title={isRTL ? 'معلومات المؤشر' : 'Indicator Info'}
              >
                <Info className="w-3 h-3" />
              </button>
              {renderTradeButtons && renderTradeButtons()}
            </div>
          </div>
          
          {/* Centered Animated Symbol (Absolute) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
             <motion.div 
                className="flex items-center justify-center gap-3 px-6 py-1.5 rounded-full"
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                key={currency.symbol}
                style={{ 
                  background: `linear-gradient(180deg, ${tk.surfaceHover} 0%, transparent 100%)`,
                  border: `1px solid ${tk.border}`,
                  boxShadow: `0 4px 20px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.05)`
                }}
             >
               <motion.div 
                  className="absolute inset-0 rounded-full z-0 opacity-20"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${tk.textPrimary} 0%, transparent 70%)` }}
                  animate={{ opacity: [0.1, 0.3, 0.1], scale: [0.9, 1.1, 0.9] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               />
               <motion.h2 
                  className="text-2xl font-black relative z-10 tracking-[0.15em] uppercase"
                  style={{ color: tk.textPrimary }}
                  animate={{ 
                     textShadow: [
                       `0 0 10px rgba(255,255,255,0.1)`, 
                       `0 0 20px rgba(255,255,255,0.3)`, 
                       `0 0 10px rgba(255,255,255,0.1)`
                     ] 
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
               >
                  {currency.symbol}
               </motion.h2>
               <div className="flex flex-col gap-1 items-center relative z-10">
                   <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-500" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
                   <motion.div className="w-1 h-1 rounded-full bg-emerald-500/50" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} />
               </div>
             </motion.div>
          </div>

          <div className="flex items-center gap-2 relative z-10 w-1/3 justify-end">
            {/* Price */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl" style={{ background: tk.surfaceHover, border: `1px solid ${tk.isDark ? 'rgba(99,102,241,0.08)' : tk.border}` }}>
              <span className="text-[13px] font-bold tabular-nums" style={{ color: tk.textPrimary }}>{currency.price.toFixed(decimals)}</span>
              <span className="text-[11px] font-bold flex items-center gap-0.5"
                style={{ color: isPositive ? "#22c55e" : "#ef4444" }}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? "+" : ""}{currency.changePercent.toFixed(2)}%
              </span>
            </div>
            {/* View Buttons */}
            <div className="flex items-center gap-1 ml-1">
              {indicator.id === "phase" && (
                <button onClick={() => { setShowDirections(true); setShowTable(false); }} title="Phase X State Candles Directions"
                  className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all ${!showDirections ? "animate-pulse" : ""}`}
                  style={{
                    background: showDirections ? "rgba(16,185,129,0.2)" : "rgba(14, 165, 233, 0.15)",
                    color: showDirections ? "#10b981" : "#0ea5e9",
                    border: `1px solid ${showDirections ? "rgba(16,185,129,0.4)" : "rgba(14, 165, 233, 0.4)"}`,
                    boxShadow: showDirections ? "0 0 10px rgba(16,185,129,0.2)" : "0 0 15px rgba(14, 165, 233, 0.3)"
                  }}>
                  <ListOrdered className="w-4 h-4" />
                </button>
              )}
              
              {[
                { icon: Table, active: showTable && !showDirections, onClick: () => { setShowTable(true); setShowDirections(false); }, title: "Table" },
                { icon: BarChart3, active: !showTable && !showDirections, onClick: () => { setShowTable(false); setShowDirections(false); }, title: "Chart" },
                { icon: Maximize2, active: false, onClick: () => setIsExpanded(true), title: isRTL ? "تكبير" : "Fullscreen" },
              ].map(({ icon: Ic, active, onClick, title }) => (
                <button key={title} onClick={onClick} title={title} className="w-7 h-7 rounded-md flex items-center justify-center cursor-pointer transition-all"
                  style={{ background: active ? "rgba(255,255,255,0.06)" : "transparent", color: active ? "#e2e8f0" : "#475569" }}>
                  <Ic className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Timeframe + Navigation Bar ─── */}
        <div className="px-4 py-2 flex items-center justify-between relative z-10" style={{ borderBottom: `1px solid ${tk.isDark ? 'rgba(99,102,241,0.06)' : tk.border}` }}>
          {/* Timeframes */}
          {indicator.id === "phase" ? (
            <PhaseTimeframeSelector mainTF={mainTF} subTF={subTF} onMainTFChange={handleMainTFChange} onSubTFChange={handleSubTFChange} color={indicator.color} isRTL={isRTL} compact />
          ) : (
            <div className="flex items-center gap-0.5 overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <Clock className="w-3.5 h-3.5 mr-1 flex-shrink-0" style={{ color: "#475569" }} />
              {(indicator.id !== "phase" ? [5, 10, 15, 30, 60, 120, 240, 360, 480, 720, 1440] : [5, 15, 30, 60]).map((tf) => (
                <button key={tf} onClick={() => onTimeframeChange(tf)}
                  className="px-1.5 py-0.5 rounded-md text-[11px] font-bold cursor-pointer transition-all flex-shrink-0"
                  style={{
                    background: timeframe === tf ? `${indicator.color} 15` : "transparent",
                    border: timeframe === tf ? `1px solid ${indicator.color} 30` : "1px solid transparent",
                    color: timeframe === tf ? indicator.color : "#64748b",
                  }}>
                  {tf >= 1440 ? `1${isRTL ? 'ي' : 'D'}` : tf >= 60 ? `${tf/60}${isRTL ? 'س' : 'H'}` : `${tf}${isRTL ? 'د' : 'M'}`}
                </button>
              ))}
            </div>
          )}

          {/* Navigation + Zoom Controls */}
          <div className="flex items-center gap-1">
            {/* Custom Candle Limit Filter */}
            <CandleLimitSelector
              value={candleLimit}
              onChange={handleLimitChange}
              isRTL={isRTL}
              tk={tk}
              color={indicator.color}
              compact={true}
            />

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
          onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
          onDoubleClick={() => setYOffset(0)}
          style={{ cursor: isDragging ? "grabbing" : "crosshair" }}>

          {/* API Loading overlay */}
          {((isPhaseIndicator && apiLoading) || (isDirectionIndicator && dirLoading) || (isOscillationIndicator && oscLoading) || (isDisplacementIndicator && dispLoading) || (isReferenceIndicator && refLoading) || (isEnvelopIndicator && envLoading)) && (
            <div className="absolute inset-0 z-20 flex items-center justify-center" style={{ background: "rgba(17,21,32,0.8)" }}>
              <div className="flex flex-col items-center gap-3">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 rounded-full border-2 border-t-transparent" style={{ borderColor: `${indicator?.color || '#6366f1'} 40`, borderTopColor: 'transparent' }} />
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
            ) : !showDirections ? (
              <motion.div key="chart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                {renderChart(Math.max(300, (chartRef.current?.offsetHeight ?? 400) - 16))}
              </motion.div>
            ) : null}

            {showDirections && (
              <motion.div key="directions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 z-40 overflow-hidden flex flex-col rounded-lg"
                style={{ background: tk.isDark ? 'rgba(15,23,42,0.95)' : tk.surface, backdropFilter: 'blur(12px)', border: `1px solid ${tk.border}` }}>
                {/* Custom Header for Directions Table */}
                <div className="px-4 py-3 flex items-center justify-between" style={{ background: tk.isDark ? 'rgba(15,23,42,0.6)' : tk.surfaceElevated, borderBottom: `1px solid ${tk.border}` }}>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4">
                    <span className="text-lg font-bold tracking-widest" style={{ color: tk.textPrimary }}>
                      Phase <span className="text-red-500 font-black">X</span> State Candles Directions
                    </span>
                    {directionsData && directionsData.rows && directionsData.rows.length > 0 && (() => {
                      const totalProfit = directionsData.rows.reduce((sum: number, r: any) => sum + (r.profit || 0), 0);
                      const isTotalPositive = totalProfit >= 0;
                      return (
                      <div className={(isRTL ? "mr-2 pr-2 border-r" : "ml-2 pl-2 border-l") + " flex items-center gap-3"} style={{ borderColor: tk.border }}>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md" style={{ background: 'rgba(16,185,129,0.1)' }}>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[11px] font-black text-emerald-500 uppercase tracking-wider">
                            BUY: {directionsData.rows.filter((r: any) => r.isBuy).length}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md" style={{ background: 'rgba(239,68,68,0.1)' }}>
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-[11px] font-black text-red-500 uppercase tracking-wider">
                            SELL: {directionsData.rows.filter((r: any) => !r.isBuy).length}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md" style={{ background: isTotalPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${isTotalPositive ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                          <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: isTotalPositive ? '#10b981' : '#ef4444' }}>
                            {isRTL ? 'الربح:' : 'Profit:'} {isTotalPositive ? '+' : ''}{totalProfit.toFixed(decimals)}
                          </span>
                        </div>
                      </div>
                      );
                    })()}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 md:gap-1.5 px-1.5 py-1 rounded-lg" style={{ background: tk.isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)', border: `1px solid ${tk.border}` }}>
                      <span className="text-[9px] md:text-[10px] font-bold text-slate-500 whitespace-nowrap">{isRTL ? "لوت الجميع:" : "All Lots:"}</span>
                      <button onClick={(e) => { e.stopPropagation(); const newVal = Math.max(0.01, Number((globalDirLot - 0.01).toFixed(2))); setGlobalDirLot(newVal); applyGlobalDirLot(newVal); }} className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded text-[10px] md:text-sm font-bold bg-slate-700/50 hover:bg-slate-700 text-white transition-colors cursor-pointer">-</button>
                      <input type="number" step="0.01" min="0.01" value={globalDirLot} onChange={(e) => { const newVal = Math.max(0.01, parseFloat(e.target.value) || 0.01); setGlobalDirLot(newVal); applyGlobalDirLot(newVal); }} className="w-10 md:w-12 text-center text-[10px] md:text-[11px] font-black font-mono bg-transparent outline-none" style={{ color: '#fbbf24' }} />
                      <button onClick={(e) => { e.stopPropagation(); const newVal = Number((globalDirLot + 0.01).toFixed(2)); setGlobalDirLot(newVal); applyGlobalDirLot(newVal); }} className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded text-[10px] md:text-sm font-bold bg-slate-700/50 hover:bg-slate-700 text-white transition-colors cursor-pointer">+</button>
                    </div>

                    <button onClick={handleExecuteAll} disabled={isExecutingAll || !executeTradeFromChart || !currency} className="px-3 py-1.5 flex items-center gap-2 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50" style={{ background: tk.isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.1)", color: tk.isDark ? "#34d399" : "#059669", border: `1px solid ${tk.isDark ? "rgba(16,185,129,0.3)" : "rgba(16,185,129,0.3)"}` }}>
                      {isExecutingAll ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full" />
                      ) : (
                        <Activity className="w-3.5 h-3.5" />
                      )}
                      {isRTL ? "تنفيذ الكل" : "Execute All"}
                    </button>
                    <button onClick={() => setShowDirections(false)} className="px-3 py-1.5 flex items-center gap-2 rounded-lg text-xs font-bold transition-colors cursor-pointer" style={{ background: tk.buttonGhost, color: tk.buttonGhostText, border: `1px solid ${tk.buttonGhostBorder}` }}>
                      <BarChart3 className="w-3.5 h-3.5" />
                      {isRTL ? "العودة للشارت" : "Back to Chart"}
                    </button>
                  </div>
                </div>

                {/* Table Data */}
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-center border-collapse">
                    <thead className="sticky top-0 z-20 backdrop-blur-md" style={{ background: tk.isDark ? 'rgba(15,23,42,0.85)' : tk.surfaceElevated, borderBottom: `1px solid ${tk.border}` }}>
                      <tr>
                        {["Close Price", "High Price", "Low Price", "Candles", "Entry", "Direction", "Profit", "Lot", "Execute"].map((head, idx) => (
                          <th key={idx} className="p-2 text-[12px] font-bold whitespace-nowrap" style={{
                            color: head === "Lot" ? '#fbbf24' : head === "Execute" ? '#818cf8' : tk.textPrimary,
                            border: `1px solid ${tk.isDark ? 'rgba(100,116,139,0.3)' : tk.border}`,
                            ...(head === "Lot" ? { borderLeft: '2px solid rgba(245,158,11,0.3)' } : {}),
                          }}>
                            {isRTL ? (
                              head === "Close Price" ? "سعر الإغلاق" :
                                head === "High Price" ? "أعلى سعر" :
                                  head === "Low Price" ? "أدنى سعر" :
                                    head === "Candles" ? "الشموع" :
                                      head === "Entry" ? "الدخول" :
                                        head === "Direction" ? "الاتجاه" :
                                          head === "Profit" ? "الربح" :
                                            head === "Lot" ? "اللوت" :
                                              head === "Execute" ? "تنفيذ" : head
                            ) : head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {directionsData && directionsData.rows.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-4 text-sm text-slate-500">No data available for directions.</td>
                        </tr>
                      ) : (
                        directionsData && directionsData.rows.map((row: any) => {
                          const isEven = row.idx % 2 === 0;
                          const rowBg = isEven ? (tk.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)') : 'transparent';
                          const dirBg = row.isBuy ? (tk.isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.12)') : (tk.isDark ? 'rgba(244,63,94,0.2)' : 'rgba(244,63,94,0.12)');
                          const dirColor = row.isBuy ? tk.positive : tk.negative;

                          const isMax = row.windowSize === directionsData.maxProfitWindow;
                          const isMin = row.windowSize === directionsData.minProfitWindow;
                          const borderStyle = `1px solid ${tk.isDark ? 'rgba(100,116,139,0.3)' : tk.border}`;

                          return (
                            <tr key={row.windowSize} style={{ borderBottom: `1px solid ${tk.isDark ? 'rgba(255,255,255,0.05)' : tk.border}`, background: rowBg }}>
                              <td className="p-2 text-[13px] font-bold font-mono" style={{ color: isPositive ? tk.positive : tk.negative }}>
                                {row.currentPrice.toFixed(decimals)}
                              </td>
                              <td className="p-2 text-[13px] font-bold font-mono" style={{ borderLeft: borderStyle, borderRight: borderStyle, color: tk.textPrimary }}>
                                {row.high.toFixed(decimals)}
                              </td>
                              <td className="p-2 text-[13px] font-bold font-mono" style={{ borderRight: borderStyle, color: tk.textPrimary }}>
                                {row.low.toFixed(decimals)}
                              </td>
                              <td className="p-2 text-[13px] font-bold font-mono"
                                style={{
                                  borderRight: borderStyle,
                                  background: isMax ? (tk.isDark ? 'rgba(234,179,8,0.15)' : 'rgba(234,179,8,0.1)') : isMin ? (tk.isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)') : (tk.isDark ? 'rgba(30,41,59,0.5)' : 'rgba(0,0,0,0.02)'),
                                  color: isMax ? tk.warning : isMin ? tk.negative : tk.textPrimary
                                }}>
                                {row.windowSize}
                                {isMax && <span className="ml-1 text-[10px]">⭐</span>}
                                {isMin && <span className="ml-1 text-[10px]">🔻</span>}
                              </td>
                              <td className="p-2 text-[13px] font-bold font-mono" style={{ borderRight: borderStyle, color: tk.textPrimary }}>
                                {row.entry.toFixed(decimals)}
                              </td>
                              <td className="p-2 text-[13px] font-bold" style={{ borderRight: borderStyle, background: dirBg, color: dirColor }}>
                                {row.directionStr}
                              </td>
                              <td className="p-2 text-[13px] font-bold font-mono" style={{ color: tk.positive }}>
                                {row.profit.toFixed(decimals)}
                              </td>
                              <td className="p-2" style={{ borderLeft: '2px solid rgba(245,158,11,0.2)' }}>
                                <input
                                  type="number" step="0.01" min="0.01" max="100"
                                  value={dirLotSizes[row.windowSize] ?? 0.01}
                                  onChange={(e) => setDirLotSizes(prev => ({ ...prev, [row.windowSize]: Math.max(0.01, parseFloat(e.target.value) || 0.01) }))}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-14 text-center text-[11px] font-black font-mono py-1 px-1 rounded-lg outline-none mx-auto block"
                                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24' }}
                                />
                              </td>
                              <td className="p-2 text-center">
                                {(() => {
                                  const chartComment = `PX-Chart-${currency.symbol}-${mainTF}-${subTF}-W${row.windowSize}-${row.isBuy ? 'BUY' : 'SELL'}`.slice(0, 31);
                                  const hasPos = mt5Positions?.some((p: any) => p.comment === chartComment) || false;
                                  const alreadyExecuted = executedComments.has(chartComment);
                                  const isBlocked = hasPos || alreadyExecuted;

                                  return (
                                    <div className="flex items-center justify-center gap-1.5">
                                      {/* Execute Button */}
                                      <button
                                        disabled={isBlocked || dirExecuting.has(row.windowSize) || !executeTradeFromChart || !currency}
                                        title={isBlocked ? '✅ صفقة منفذة بالفعل' : undefined}
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          if (isBlocked || !executeTradeFromChart || !currency) return;
                                          const lot = dirLotSizes[row.windowSize] ?? 0.01;
                                          setDirExecuting(prev => new Set(prev).add(row.windowSize));
                                          try {
                                            await executeTradeFromChart(currency.symbol, row.isBuy ? 'BUY' : 'SELL', lot, row.entry, undefined, chartComment);
                                            setExecutedComments(prev => new Set(prev).add(chartComment));
                                          } catch (err) { console.error(err); }
                                          setDirExecuting(prev => { const n = new Set(prev); n.delete(row.windowSize); return n; });
                                        }}
                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black tracking-wider cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        style={{
                                          color: (isBlocked || dirExecuting.has(row.windowSize)) ? '#64748b' : row.isBuy ? '#34d399' : '#f87171',
                                          background: (isBlocked || dirExecuting.has(row.windowSize)) ? 'rgba(255,255,255,0.03)' : row.isBuy ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                                          border: `1px solid ${(isBlocked || dirExecuting.has(row.windowSize)) ? 'rgba(255,255,255,0.06)' : row.isBuy ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                        }}
                                      >
                                        {dirExecuting.has(row.windowSize) ? '...' : isBlocked ? '✅' : row.isBuy ? '▶ BUY' : '▶ SELL'}
                                      </button>
                                    </div>
                                  );
                                })()}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-4 py-2.5 flex items-center justify-between gap-3 relative z-10 mx-3 mb-2 rounded-xl" style={{ border: `1px solid ${tk.isDark ? 'rgba(99,102,241,0.12)' : tk.border}`, background: tk.isDark ? 'rgba(99,102,241,0.02)' : tk.surfaceHover }}>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 items-center gap-2 md:gap-3">
            {(() => {
              const high = displayedData.length ? Math.max(...displayedData.map((d: any) => d.high ?? d.value)) : 0;
              const low = displayedData.length ? Math.min(...displayedData.map((d: any) => d.low ?? d.value)) : 0;
              const average = (high + low) / 2;
              const isBuy = currency.price > average;
              const profit = isBuy ? currency.price - average : average - currency.price;

              return [
                { label: isRTL ? "السعر الحالي" : t("currentPrice"), value: currency.price.toFixed(decimals), color: tk.info },
                { label: isRTL ? "أعلى سعر" : t("highPrice"), value: displayedData.length ? high.toFixed(decimals) : "—", color: tk.positive },
                { label: isRTL ? "أدنى سعر" : t("lowPrice"), value: displayedData.length ? low.toFixed(decimals) : "—", color: tk.negative },
                { label: isRTL ? "الشموع المعروضة" : "Candles Showed", value: displayedData.length, color: tk.accent },
                { label: isRTL ? "المتوسط" : "Average", value: displayedData.length ? average.toFixed(decimals) : "—", color: tk.warning },
                {
                  label: isRTL ? "الاتجاه" : "Direction",
                  value: displayedData.length ? (isBuy ? "BUY" : "SELL") : "—",
                  color: displayedData.length ? (isBuy ? tk.positive : tk.negative) : tk.textDim,
                  isDirection: true
                },
                {
                  label: isRTL ? "الربح" : "Profit",
                  value: displayedData.length ? profit.toFixed(decimals) : "—",
                  color: displayedData.length ? (profit >= 0 ? tk.positive : tk.negative) : tk.textDim
                },
              ].map(({ label, value, color, isDirection }) => (
                <AnimatedStat key={label} label={label} value={value} color={color} isDirection={isDirection} />
              ));
            })()}
          </div>
          <button
            onClick={() => setShowInfoPopup(true)}
            className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center cursor-pointer transition-colors"
            style={{ background: tk.surfaceHover, border: `1px solid ${tk.border}`, color: tk.textMuted }}
            onMouseEnter={(e) => { e.currentTarget.style.background = tk.surfaceActive; e.currentTarget.style.color = tk.textBright; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = tk.surfaceHover; e.currentTarget.style.color = tk.textMuted; }}
          >
            <Info className="w-5 h-5" />
          </button>
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
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${tk.border} ` }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${indicator.color} 15`, border: `1px solid ${indicator.color} 20` }}>
                    <Activity className="w-5 h-5" style={{ color: indicator.color }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: tk.textPrimary }}>{isRTL ? indicator.name : indicator.nameEn}</h2>
                    <p className="text-xs" style={{ color: tk.textMuted }}>{isRTL ? currency.name : currency.nameEn} • {currency.symbol}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Price & Stats Grid in Fullscreen */}
                  <div className="flex-1 px-4 lg:px-8 flex items-center gap-3">
                    <div className="flex-1 grid grid-cols-3 xl:grid-cols-7 items-center gap-2 lg:gap-3">
                      {(() => {
                        const high = displayedData.length ? Math.max(...displayedData.map((d: any) => d.high ?? d.value)) : 0;
                        const low = displayedData.length ? Math.min(...displayedData.map((d: any) => d.low ?? d.value)) : 0;
                        const average = (high + low) / 2;
                        const isBuy = currency.price > average;
                        const profit = isBuy ? currency.price - average : average - currency.price;

                        return [
                          { label: isRTL ? "السعر" : t("currentPrice"), value: currency.price.toFixed(decimals), color: "#60a5fa" },
                          { label: isRTL ? "أعلى" : t("highPrice"), value: displayedData.length ? high.toFixed(decimals) : "—", color: "#22c55e" },
                          { label: isRTL ? "أدنى" : t("lowPrice"), value: displayedData.length ? low.toFixed(decimals) : "—", color: "#ef4444" },
                          { label: isRTL ? "الشموع" : "Candles", value: displayedData.length, color: "#a78bfa" },
                          { label: isRTL ? "المتوسط" : "Average", value: displayedData.length ? average.toFixed(decimals) : "—", color: "#fcd34d" },
                          {
                            label: isRTL ? "الاتجاه" : "Direction",
                            value: displayedData.length ? (isBuy ? "BUY" : "SELL") : "—",
                            color: displayedData.length ? (isBuy ? "#10b981" : "#f43f5e") : "#64748b",
                            isDirection: true
                          },
                          {
                            label: isRTL ? "الربح" : "Profit",
                            value: displayedData.length ? profit.toFixed(decimals) : "—",
                            color: displayedData.length ? (profit >= 0 ? "#10b981" : "#f43f5e") : "#64748b"
                          },
                        ].map(({ label, value, color, isDirection }) => (
                          <div key={label} className="min-w-0">
                            <AnimatedStat label={label} value={value} color={color} isDirection={isDirection} />
                          </div>
                        ));
                      })()}
                    </div>
                    <button
                      onClick={() => setShowInfoPopup(true)}
                      className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center cursor-pointer transition-colors"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", color: "#94a3b8" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#f8fafc"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "#94a3b8"; }}
                    >
                      <Info className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Toolbar buttons */}
                  <div className="flex items-center gap-1">
                    {indicator.id === "phase" && (
                      <button onClick={() => { setShowDirections(!showDirections); setShowTable(false); }}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all ${!showDirections ? "animate-pulse" : ""}`}
                        style={{ 
                          background: showDirections ? "rgba(16,185,129,0.2)" : "rgba(14, 165, 233, 0.15)", 
                          color: showDirections ? "#10b981" : "#0ea5e9",
                          border: `1px solid ${showDirections ? "rgba(16,185,129,0.4)" : "rgba(14, 165, 233, 0.4)"}`,
                          boxShadow: showDirections ? "0 0 10px rgba(16,185,129,0.2)" : "0 0 15px rgba(14, 165, 233, 0.3)"
                        }}
                        title="Phase X State Candles Directions">
                        <ListOrdered className="w-5 h-5" />
                      </button>
                    )}
                    <button onClick={() => { setShowTable(!showTable); setShowDirections(false); }}
                      className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer"
                      style={{ background: showTable ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)", color: showTable ? "#e2e8f0" : "#64748b" }}
                      title={isRTL ? "جدول" : "Table"}>
                      <Table className="w-4 h-4" />
                    </button>
                    <button onClick={() => setShowDrawingTools(!showDrawingTools)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer"
                      style={{ background: showDrawingTools ? `${indicator.color} 15` : "rgba(255,255,255,0.03)", color: showDrawingTools ? indicator.color : "#64748b", border: showDrawingTools ? `1px solid ${indicator.color} 30` : "1px solid transparent" }}
                      title={isRTL ? "أدوات الرسم" : "Drawing Tools"}>
                      <Edit3 className="w-4 h-4" />
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
              <div className="px-6 py-2 flex items-center justify-between" style={{ borderBottom: `1px solid ${tk.border} ` }}>
                {indicator.id === "phase" ? (
                  <PhaseTimeframeSelector mainTF={mainTF} subTF={subTF} onMainTFChange={handleMainTFChange} onSubTFChange={handleSubTFChange} color={indicator.color} isRTL={isRTL} />
                ) : (
                  <div className="flex items-center gap-0.5 overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    <Clock className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" style={{ color: "#475569" }} />
                    {(indicator.id !== "phase" ? [5, 10, 15, 30, 60, 120, 240, 360, 480, 720, 1440] : [5, 15, 30, 60]).map((tf) => (
                      <button key={tf} onClick={() => onTimeframeChange(tf)}
                        className="px-2 py-1 rounded-lg text-[11px] md:text-xs font-bold cursor-pointer flex-shrink-0"
                        style={{
                          background: timeframe === tf ? `${indicator.color} 15` : "transparent",
                          border: timeframe === tf ? `1px solid ${indicator.color} 30` : "1px solid transparent",
                          color: timeframe === tf ? indicator.color : "#64748b",
                        }}>
                        {tf >= 1440 ? `1${isRTL ? 'ي' : 'D'}` : tf >= 60 ? `${tf/60}${isRTL ? 'س' : 'H'}` : `${tf}${isRTL ? 'د' : 'M'}`}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  {/* Custom Candle Limit Filter */}
                  <CandleLimitSelector
                    value={candleLimit}
                    onChange={handleLimitChange}
                    isRTL={isRTL}
                    tk={tk}
                    color={indicator.color}
                  />

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
                      onClear={handleClearDrawings} magnetEnabled={magnetEnabled} onMagnetToggle={handleMagnetToggle}
                      locked={drawingsLocked} onLockToggle={handleLockToggle}
                      visible={drawingsVisible} onVisibilityToggle={handleVisibilityToggle}
                      onClose={handleCloseDrawingTools} />
                  </div>
                )}

                {/* Chart Area — fills remaining width */}
                <div ref={fullscreenChartRef} className="flex-1 min-h-0 min-w-0 relative"
                  onDoubleClick={() => setYOffset(0)}>
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
                  ) : !showDirections ? (
                    <div className="absolute inset-0 z-0">
                      {renderChart(window.innerHeight - 140)}
                    </div>
                  ) : null}

                  {/* Drawing Canvas overlay — only in fullscreen */}
                  {!showTable && !showDirections && showDrawingTools && (
                    <DrawingCanvas selectedTool={selectedTool} magnetEnabled={magnetEnabled} locked={drawingsLocked} visible={drawingsVisible}
                      data={displayedData}
                      priceRange={drawingPriceRange}
                      onDrawingsChange={setDrawings} onClearAll={clearDrawingsCallback} />
                  )}

                  {showDirections && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-0 z-40 overflow-hidden flex flex-col bg-slate-900/95 backdrop-blur-md rounded-lg"
                      style={{ border: `1px solid ${tk.border}` }}>
                      <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4" style={{ background: "rgba(15, 23, 42, 0.6)", borderBottom: `1px solid ${tk.border}` }}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-bold text-white tracking-widest">
                            Phase <span className="text-red-500 font-black">X</span> State Candles Directions
                          </span>
                          {directionsData && directionsData.rows && directionsData.rows.length > 0 && (() => {
                            const totalProfit = directionsData.rows.reduce((sum: number, r: any) => sum + (r.profit || 0), 0);
                            const isTotalPositive = totalProfit >= 0;
                            return (
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md" style={{ background: 'rgba(16,185,129,0.1)' }}>
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                  <span className="text-[12px] font-black text-emerald-500 uppercase tracking-wider">
                                    BUY: {directionsData.rows.filter((r: any) => r.isBuy).length}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md" style={{ background: 'rgba(239,68,68,0.1)' }}>
                                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                  <span className="text-[12px] font-black text-red-500 uppercase tracking-wider">
                                    SELL: {directionsData.rows.filter((r: any) => !r.isBuy).length}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md" style={{ background: isTotalPositive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', border: `1px solid ${isTotalPositive ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
                                  <span className="text-[13px] font-black uppercase tracking-wider font-mono" style={{ color: isTotalPositive ? '#10b981' : '#ef4444' }}>
                                    {isRTL ? 'الربح:' : 'Profit:'} {isTotalPositive ? '+' : ''}{totalProfit.toFixed(decimals)}
                                  </span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${tk.border}` }}>
                            <span className="text-[12px] font-bold text-slate-400 whitespace-nowrap">{isRTL ? "تعيين لوت لجميع الشموع:" : "Set Lots for All:"}</span>
                            <button onClick={(e) => { e.stopPropagation(); const newVal = Math.max(0.01, Number((globalDirLot - 0.01).toFixed(2))); setGlobalDirLot(newVal); applyGlobalDirLot(newVal); }} className="w-6 h-6 flex items-center justify-center rounded text-sm font-bold bg-slate-700/50 hover:bg-slate-700 text-white transition-colors cursor-pointer">-</button>
                            <input type="number" step="0.01" min="0.01" value={globalDirLot} onChange={(e) => { const newVal = Math.max(0.01, parseFloat(e.target.value) || 0.01); setGlobalDirLot(newVal); applyGlobalDirLot(newVal); }} className="w-14 text-center text-sm font-black font-mono bg-transparent outline-none" style={{ color: '#fbbf24' }} />
                            <button onClick={(e) => { e.stopPropagation(); const newVal = Number((globalDirLot + 0.01).toFixed(2)); setGlobalDirLot(newVal); applyGlobalDirLot(newVal); }} className="w-6 h-6 flex items-center justify-center rounded text-sm font-bold bg-slate-700/50 hover:bg-slate-700 text-white transition-colors cursor-pointer">+</button>
                          </div>

                          <button onClick={handleExecuteAll} disabled={isExecutingAll || !executeTradeFromChart || !currency} className="px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399", border: `1px solid rgba(16,185,129,0.3)` }} onMouseEnter={(e) => { e.currentTarget.style.color = "#6ee7b7"; e.currentTarget.style.background = "rgba(16,185,129,0.25)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#34d399"; e.currentTarget.style.background = "rgba(16,185,129,0.15)"; }}>
                            {isExecutingAll ? (
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full" />
                            ) : (
                              <Activity className="w-4 h-4" />
                            )}
                            {isRTL ? "تنفيذ الكل" : "Execute All"}
                          </button>
                          <button onClick={() => setShowDirections(false)} className="px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-bold transition-colors" style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: `1px solid ${tk.border}` }} onMouseEnter={(e) => { e.currentTarget.style.color = "#f8fafc"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}>
                            <BarChart3 className="w-4 h-4" />
                            {isRTL ? "العودة للشارت" : "Back to Chart"}
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 overflow-auto p-2">
                        <table className="w-full text-center border-collapse">
                          <thead className="sticky top-0 z-20 backdrop-blur-md" style={{ background: "rgba(15, 23, 42, 0.85)", borderBottom: `1px solid ${tk.border}` }}>
                            <tr>
                              {["Close Price", "High Price", "Low Price", "Candles", "Entry", "Direction", "Profit", "Lot", "Execute"].map((head, idx) => (
                                <th key={idx} className="p-3 text-[14px] font-bold text-white border border-slate-700/50 whitespace-nowrap"
                                  style={head === "Lot" ? { color: '#fbbf24', borderLeft: '2px solid rgba(245,158,11,0.3)' } : head === "Execute" ? { color: '#818cf8' } : {}}
                                >
                                  {isRTL ? (
                                    head === "Close Price" ? "سعر الإغلاق" :
                                      head === "High Price" ? "أعلى سعر" :
                                        head === "Low Price" ? "أدنى سعر" :
                                          head === "Candles" ? "الشموع" :
                                            head === "Entry" ? "الدخول" :
                                              head === "Direction" ? "الاتجاه" :
                                                head === "Profit" ? "الربح" :
                                                  head === "Lot" ? "اللوت" :
                                                    head === "Execute" ? "تنفيذ" : head
                                  ) : head}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {directionsData && directionsData.rows.length === 0 ? (
                              <tr>
                                <td colSpan={9} className="p-4 text-sm text-slate-500">No data available for directions.</td>
                              </tr>
                            ) : (
                              directionsData && directionsData.rows.map((row: any) => {
                                const isEven = row.idx % 2 === 0;
                                const rowBg = isEven ? "rgba(255,255,255,0.03)" : "transparent";
                                const dirBg = row.isBuy ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)";
                                const dirColor = row.isBuy ? "#10b981" : "#f43f5e";

                                const isMax = row.windowSize === directionsData.maxProfitWindow;
                                const isMin = row.windowSize === directionsData.minProfitWindow;

                                return (
                                  <tr key={row.windowSize} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: rowBg }}>
                                    <td className="p-3 text-[14px] font-bold font-mono" style={{ color: isPositive ? "#22c55e" : "#ef4444" }}>
                                      {row.currentPrice.toFixed(decimals)}
                                    </td>
                                    <td className="p-3 text-[14px] font-bold font-mono border-l border-r border-slate-700/50">
                                      {row.high.toFixed(decimals)}
                                    </td>
                                    <td className="p-3 text-[14px] font-bold font-mono border-r border-slate-700/50">
                                      {row.low.toFixed(decimals)}
                                    </td>
                                    <td className="p-3 text-[14px] font-bold font-mono border-r border-slate-700/50"
                                      style={{
                                        background: isMax ? "rgba(234, 179, 8, 0.15)" : isMin ? "rgba(239, 68, 68, 0.15)" : "rgba(30, 41, 59, 0.5)",
                                        color: isMax ? "#eab308" : isMin ? "#ef4444" : "white"
                                      }}>
                                      {row.windowSize}
                                      {isMax && <span className="ml-2 text-[12px]">⭐</span>}
                                      {isMin && <span className="ml-2 text-[12px]">🔻</span>}
                                    </td>
                                    <td className="p-3 text-[14px] font-bold font-mono border-r border-slate-700/50">
                                      {row.entry.toFixed(decimals)}
                                    </td>
                                    <td className="p-3 text-[14px] font-bold border-r border-slate-700/50" style={{ background: dirBg, color: dirColor }}>
                                      {row.directionStr}
                                    </td>
                                    <td className="p-3 text-[14px] font-bold font-mono" style={{ color: "#10b981" }}>
                                      {row.profit.toFixed(decimals)}
                                    </td>
                                    <>
                                        <td className="p-3" style={{ borderLeft: '2px solid rgba(245,158,11,0.2)' }}>
                                          <input
                                            type="number" step="0.01" min="0.01" max="100"
                                            value={dirLotSizes[row.windowSize] ?? 0.01}
                                            onChange={(e) => setDirLotSizes(prev => ({ ...prev, [row.windowSize]: Math.max(0.01, parseFloat(e.target.value) || 0.01) }))}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-16 text-center text-[12px] font-black font-mono py-1.5 px-1 rounded-lg outline-none mx-auto block"
                                            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24' }}
                                          />
                                        </td>
                                        <td className="p-3 text-center whitespace-nowrap">
                                          {(() => {
                                            const chartComment = `PX-Chart-${currency.symbol}-${mainTF}-${subTF}-W${row.windowSize}-${row.isBuy ? 'BUY' : 'SELL'}`.slice(0, 31);
                                            const hasPos = mt5Positions?.some((p: any) => p.comment === chartComment) || false;
                                            const alreadyExecuted = executedComments.has(chartComment);
                                            const isBlocked = hasPos || alreadyExecuted;

                                            return (
                                              <div className="flex items-center justify-center gap-2 whitespace-nowrap min-w-fit">
                                                {/* Execute Button */}
                                                <button
                                                  disabled={isBlocked || dirExecuting.has(row.windowSize) || !executeTradeFromChart || !currency}
                                                  title={isBlocked ? '✅ صفقة منفذة بالفعل' : undefined}
                                                  onClick={async (e) => {
                                                    e.stopPropagation();
                                                    if (isBlocked || !executeTradeFromChart || !currency) return;
                                                    const lot = dirLotSizes[row.windowSize] ?? 0.01;
                                                    setDirExecuting(prev => new Set(prev).add(row.windowSize));
                                                    try {
                                                      await executeTradeFromChart(currency.symbol, row.isBuy ? 'BUY' : 'SELL', lot, row.entry, undefined, chartComment);
                                                      setExecutedComments(prev => new Set(prev).add(chartComment));
                                                    } catch (err) { console.error(err); }
                                                    setDirExecuting(prev => { const n = new Set(prev); n.delete(row.windowSize); return n; });
                                                  }}
                                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black tracking-wider cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                  style={{
                                                    color: (isBlocked || dirExecuting.has(row.windowSize)) ? '#64748b' : row.isBuy ? '#34d399' : '#f87171',
                                                    background: (isBlocked || dirExecuting.has(row.windowSize)) ? 'rgba(255,255,255,0.03)' : row.isBuy ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                                                    border: `1px solid ${(isBlocked || dirExecuting.has(row.windowSize)) ? 'rgba(255,255,255,0.06)' : row.isBuy ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                                  }}
                                                >
                                                  {dirExecuting.has(row.windowSize) ? '...' : isBlocked ? '✅' : row.isBuy ? '▶ BUY' : '▶ SELL'}
                                                </button>
                                              </div>
                                            );
                                          })()}\r
                                        </td>\r
                                    </>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInfoPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)" }}
            onClick={() => setShowInfoPopup(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl relative"
              style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)" }}
              onClick={(e) => e.stopPropagation()} dir="ltr">
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-indigo-400" />
                  Analytical Derivation Notice
                </h3>
                <button onClick={() => setShowInfoPopup(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm md:text-base leading-relaxed text-slate-300">
                  What you see here is not a direct recommendation to buy or sell. Rather, it is a real-time derivation and analysis based on the number of candles currently displayed on your chart.
                  <br /><br />
                  The system identifies the total number of visible candles, the highest value and the lowest value within those candles, and calculates the midpoint between them. If the current price is above this midpoint, the likely directional bias is toward buying; conversely, if it is below, the bias is toward selling. The system also displays the potential profit or loss that would result if the trade were executed at that specific moment.
                </p>
              </div>
              <div className="px-6 py-4 flex justify-end" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" }}>
                <button onClick={() => setShowInfoPopup(false)} className="px-6 py-2 rounded-lg font-bold text-sm bg-indigo-500 hover:bg-indigo-600 text-white transition-colors">
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chart Info Popup */}
      <AnimatePresence>
        {showChartInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)" }}
            onClick={() => setShowChartInfo(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl relative"
              style={{ background: tk.isDark ? '#0f172a' : tk.surfaceElevated, border: `1px solid ${tk.isDark ? 'rgba(99,102,241,0.15)' : tk.border}` }}
              onClick={(e) => e.stopPropagation()} dir={isRTL ? "rtl" : "ltr"}>
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${tk.isDark ? 'rgba(99,102,241,0.1)' : tk.border}` }}>
                <h3 className="text-lg font-black flex items-center gap-2" style={{ color: tk.textPrimary }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${indicator.color}15`, border: `1px solid ${indicator.color}25` }}>
                    <Activity className="w-4 h-4" style={{ color: indicator.color }} />
                  </div>
                  {isRTL ? indicator.name : indicator.nameEn}
                </h3>
                <button onClick={() => setShowChartInfo(false)} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors" style={{ color: tk.textMuted, background: tk.surfaceHover }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm md:text-base leading-relaxed" style={{ color: tk.textMuted }}>
                  {indicator.id === 'phase' ? t('chartInfoPhase')
                    : indicator.id === 'displacement' ? t('chartInfoDisplacement')
                    : indicator.id === 'reference' ? t('chartInfoReference')
                    : indicator.id === 'oscillation' ? t('chartInfoOscillation')
                    : indicator.id === 'direction' ? t('chartInfoDirection')
                    : indicator.id === 'envelop' ? t('chartInfoEnvelope')
                    : t('chartInfoPhase')}
                </p>
              </div>
              <div className="px-6 py-4 flex justify-end" style={{ borderTop: `1px solid ${tk.isDark ? 'rgba(99,102,241,0.08)' : tk.border}`, background: tk.isDark ? 'rgba(0,0,0,0.2)' : tk.surfaceHover }}>
                <button onClick={() => setShowChartInfo(false)} className="px-6 py-2 rounded-lg font-bold text-sm cursor-pointer transition-colors" style={{ background: indicator.color, color: '#fff' }}>
                  {isRTL ? 'فهمت' : 'Got it'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}