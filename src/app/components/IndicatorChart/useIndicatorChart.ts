import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useThemeTokens } from "../../hooks/useThemeTokens";
import { usePhaseStateAPI } from "../../hooks/usePhaseStateAPI";
import { useDirectionStateAPI } from "../../hooks/useDirectionStateAPI";
import { useOscillationStateAPI } from "../../hooks/useOscillationStateAPI";
import { useDisplacementStateAPI } from "../../hooks/useDisplacementStateAPI";
import { useReferenceStateAPI } from "../../hooks/useReferenceStateAPI";
import { useEnvelopStateAPI } from "../../hooks/useEnvelopStateAPI";
import { useDecisionEngine } from "./decisionEngine";
import { phaseMainTFs } from "./indicatorChartTypesAndControls";
import type { IndicatorChartProps } from "./indicatorChartTypesAndControls";
import type { DrawingTool } from "../DrawingToolbar";

export function useIndicatorChart(props: IndicatorChartProps) {
  const {
    currency, indicator, data, timeframe, onTimeframeChange,
    mtfEnabled = false, mtfSmallTimeframe = 5, mtfLargeTimeframe = 60,
    onMtfEnabledChange, onMtfSmallTimeframeChange, onMtfLargeTimeframeChange,
    phaseStateData, generateCandlesFromReal, onLiveChartData, renderTradeButtons,
    accessToken, mt5Connected, executeTrade: executeTradeFromChart, bulkExecuteTrades,
    mt5Positions, addTradeToHistory, serverTradeHistory,
    autoTrades, autoTradeWorker, autoTradeSubscribe, autoTradeUnsubscribe, onOpenDynamics,
  } = props;

  const { language, t } = useLanguage();
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showChartInfo, setShowChartInfo] = useState(false);
  const [candleLimit, setCandleLimit] = useState<number | "Auto">("Auto");
  const isRTL = language === "ar";
  const tk = useThemeTokens();
  const decisionLabel = useDecisionEngine(currency?.symbol);

  const [isExpanded, setIsExpanded] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [dirLotSizes, setDirLotSizes] = useState<Record<number, number>>({});
  const [globalDirLot, setGlobalDirLot] = useState<number>(0.01);
  const [dirExecuting, setDirExecuting] = useState<Set<number>>(new Set());
  const [isExecutingAll, setIsExecutingAll] = useState(false);
  const [isAutoExecutingAll, setIsAutoExecutingAll] = useState(false);
  const [nextCheckStr, setNextCheckStr] = useState<string>("");

  const [executedComments, setExecutedComments] = useState<Set<string>>(new Set());
  const [viewWindow, setViewWindow] = useState(30);
  const [startIndex, setStartIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartIndex, setDragStartIndex] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const [dragStartYOffset, setDragStartYOffset] = useState(0);

  const chartRef = useRef<HTMLDivElement>(null);
  const fullscreenChartRef = useRef<HTMLDivElement>(null);
  const viewWindowRef = useRef(viewWindow);
  const startIndexRef = useRef(startIndex);
  const dataLenRef = useRef(0);

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

  useEffect(() => {
    if (!autoTradeWorker?.next_check) { setNextCheckStr(""); return; }
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const next = new Date(autoTradeWorker.next_check).getTime();
      const diff = next - now;
      if (diff <= 0) {
        setNextCheckStr(isRTL ? "الآن..." : "Now...");
      } else {
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setNextCheckStr(`${m}:${s.toString().padStart(2, "0")}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [autoTradeWorker?.next_check, isRTL]);

  const isPhaseIndicator = indicator?.id === "phase";
  const isDirectionIndicator = indicator?.id === "direction";
  const isOscillationIndicator = indicator?.id === "oscillation";
  const isDisplacementIndicator = indicator?.id === "displacement";
  const isReferenceIndicator = indicator?.id === "reference";
  const isEnvelopIndicator = indicator?.id === "envelop";

  useEffect(() => {
    if (isPhaseIndicator) {
      onMtfEnabledChange?.(true);
      onMtfLargeTimeframeChange?.(tfStringToNum(mainTF));
      onMtfSmallTimeframeChange?.(tfStringToNum(subTF));
    } else {
      onMtfEnabledChange?.(false);
    }
  }, [isPhaseIndicator]);

  const { candles: apiCandles, loading: apiLoading, error: apiError } = usePhaseStateAPI(currency?.symbol, mainTF, subTF, !!isPhaseIndicator, accessToken);
  const { candles: h1m5Candles } = usePhaseStateAPI(currency?.symbol, "H1", "M5", !!isPhaseIndicator, accessToken);
  const h1m5ClosePrice = useMemo(() => {
    if (h1m5Candles.length === 0) return null;
    return h1m5Candles[h1m5Candles.length - 1]?.close ?? null;
  }, [h1m5Candles]);

  const { candles: dirCandles, loading: dirLoading, error: dirError } = useDirectionStateAPI(currency?.symbol, timeframe, !!isDirectionIndicator, accessToken);
  const { candles: oscCandles, loading: oscLoading, error: oscError } = useOscillationStateAPI(currency?.symbol, timeframe, !!isOscillationIndicator, accessToken);
  const { candles: dispCandles, loading: dispLoading, error: dispError } = useDisplacementStateAPI(currency?.symbol, timeframe, !!isDisplacementIndicator, accessToken);
  const { candles: refCandles, loading: refLoading, error: refError } = useReferenceStateAPI(currency?.symbol, timeframe, !!isReferenceIndicator, accessToken);
  const { candles: envCandles, loading: envLoading, error: envError } = useEnvelopStateAPI(currency?.symbol, timeframe, !!isEnvelopIndicator, accessToken);

  // Drawing tools
  const [selectedTool, setSelectedTool] = useState<DrawingTool>("cursor");
  const [magnetEnabled, setMagnetEnabled] = useState(false);
  const [drawingsLocked, setDrawingsLocked] = useState(false);
  const [drawingsVisible, setDrawingsVisible] = useState(true);
  const [drawings, setDrawings] = useState<any[]>([]);
  const clearDrawingsCallback = useCallback(() => setDrawings([]), []);
  const handleClearDrawings = useCallback(() => { if (confirm("Clear drawings?")) setDrawings([]); }, []);
  const handleMagnetToggle = useCallback(() => setMagnetEnabled((prev) => !prev), []);
  const handleLockToggle = useCallback(() => setDrawingsLocked((prev) => !prev), []);
  const handleVisibilityToggle = useCallback(() => setDrawingsVisible((prev) => !prev), []);
  const [showDrawingTools, setShowDrawingTools] = useState(false);
  const handleCloseDrawingTools = useCallback(() => setShowDrawingTools(false), []);

  const frozenPriceRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (showDrawingTools) frozenPriceRef.current = currency?.price;
    else frozenPriceRef.current = undefined;
  }, [showDrawingTools]);
  const chartLivePrice = showDrawingTools ? frozenPriceRef.current : currency?.price;

  const effectiveData = useMemo(() => {
    if (isPhaseIndicator) {
      if (apiCandles.length > 0) return apiCandles;
      if (phaseStateData && generateCandlesFromReal && currency) {
        const key = `${mainTF}_${subTF} `;
        const symbolData = phaseStateData[key];
        if (symbolData) {
          const candle = symbolData[currency.symbol];
          if (candle) return generateCandlesFromReal(candle, 90);
        }
      }
      return [];
    }
    if (isDirectionIndicator) return dirCandles.length > 0 ? dirCandles : [];
    if (isOscillationIndicator) return oscCandles.length > 0 ? oscCandles : [];
    if (isDisplacementIndicator) return dispCandles.length > 0 ? dispCandles : [];
    if (isReferenceIndicator) return refCandles.length > 0 ? refCandles : [];
    if (isEnvelopIndicator) return envCandles.length > 0 ? envCandles : [];
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
          time: "Live\nNow", value: lastCandle.close || lastCandle.value,
          open: lastCandle.close || lastCandle.value, high: lastCandle.close || lastCandle.value,
          low: lastCandle.close || lastCandle.value, close: lastCandle.close || lastCandle.value,
          timestamp: Date.now(), isLiveIndicator: true,
        });
      }
    }
    return rawSlice;
  }, [effectiveData, startIndex, viewWindow, isDisplacementIndicator, isReferenceIndicator, isOscillationIndicator, isEnvelopIndicator]);

  const drawingPriceRange = useMemo(() => {
    if (displayedData.length === 0) return { min: 0, max: 0 };
    const values = displayedData.map((d: any) => d.value);
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [displayedData]);

  useEffect(() => { viewWindowRef.current = viewWindow; }, [viewWindow]);
  useEffect(() => { startIndexRef.current = startIndex; }, [startIndex]);
  useEffect(() => {
    dataLenRef.current = effectiveData.length;
    if (onLiveChartData) onLiveChartData(effectiveData);
  }, [effectiveData, onLiveChartData]);

  const zoomIn = useCallback(() => {
    setCandleLimit("Auto"); setYOffset(0);
    const vw = viewWindowRef.current; const si = startIndexRef.current;
    const nw = Math.max(10, vw - 5);
    setViewWindow(nw); setStartIndex(Math.max(0, si + vw - nw));
  }, []);
  const zoomOut = useCallback(() => {
    setCandleLimit("Auto"); setYOffset(0);
    const vw = viewWindowRef.current; const si = startIndexRef.current;
    const nw = Math.min(dataLenRef.current, vw + 10);
    setViewWindow(nw); setStartIndex(Math.max(0, si + vw - nw));
  }, []);
  const panLeft = () => { setCandleLimit("Auto"); setYOffset(0); setStartIndex((p) => Math.max(0, p - Math.max(3, Math.round(viewWindow / 5)))); };
  const panRight = () => { setCandleLimit("Auto"); setYOffset(0); setStartIndex((p) => Math.min(effectiveData.length - viewWindow, p + Math.max(3, Math.round(viewWindow / 5)))); };
  const goStart = () => { setCandleLimit("Auto"); setYOffset(0); setStartIndex(0); };
  const goEnd = () => { setCandleLimit("Auto"); setYOffset(0); setStartIndex(Math.max(0, effectiveData.length - viewWindow)); };

  const isDrawing = showDrawingTools && selectedTool !== "cursor" && selectedTool !== "crosshair";

  const onDown = (e: React.MouseEvent) => {
    if (isDrawing) return;
    setIsDragging(true); setDragStartX(e.clientX); setDragStartIndex(startIndex);
    setDragStartY(e.clientY); setDragStartYOffset(yOffset);
  };
  const onMove = (e: React.MouseEvent) => {
    if (!isDragging || !chartRef.current) return;
    setCandleLimit("Auto");
    const dx = e.clientX - dragStartX;
    const moveX = Math.round((dx / chartRef.current.offsetWidth) * viewWindow);
    setStartIndex(Math.max(0, Math.min(effectiveData.length - viewWindow, dragStartIndex - moveX)));
    const dy = e.clientY - dragStartY;
    const priceSpan = (drawingPriceRange.max - drawingPriceRange.min) || Math.abs(drawingPriceRange.max * 0.1) || 1;
    const moveY = (dy / chartRef.current.offsetHeight) * priceSpan;
    setYOffset(dragStartYOffset + moveY);
  };
  const onUp = () => setIsDragging(false);

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      setCandleLimit("Auto"); setYOffset(0);
      if (e.deltaY > 0) setStartIndex((p) => Math.min(effectiveData.length - viewWindow, p + Math.max(3, Math.round(viewWindow / 5))));
      else setStartIndex((p) => Math.max(0, p - Math.max(3, Math.round(viewWindow / 5))));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [effectiveData.length, viewWindow]);

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
    setDirLotSizes((prev) => {
      const next = { ...prev };
      directionsData.rows.forEach((r: any) => { next[r.windowSize] = Number(val.toFixed(2)); });
      return next;
    });
  };

  const handleExecuteAll = async () => {
    if (!directionsData || !directionsData.rows || directionsData.rows.length === 0 || !currency) return;
    setIsExecutingAll(true);
    const trades: Array<{ symbol: string; action: string; volume: number; sl?: number; comment: string }> = [];
    const tradeWindowSizes: number[] = [];
    for (const row of directionsData.rows) {
      if (dirExecuting.has(row.windowSize)) continue;
      const chartComment = `PX-Chart-${currency.symbol}-${mainTF}-${subTF}-W${row.windowSize}-${row.isBuy ? "BUY" : "SELL"}`.slice(0, 31);
      const hasPos = mt5Positions?.some((p: any) => p.comment === chartComment) || false;
      if (hasPos || executedComments.has(chartComment)) continue;
      trades.push({ symbol: currency.symbol, action: row.isBuy ? "BUY" : "SELL", volume: dirLotSizes[row.windowSize] ?? 0.01, comment: chartComment });
      tradeWindowSizes.push(row.windowSize);
    }
    if (trades.length === 0) { setIsExecutingAll(false); return; }
    setDirExecuting((prev) => { const next = new Set(prev); tradeWindowSizes.forEach((ws) => next.add(ws)); return next; });
    try {
      if (bulkExecuteTrades) {
        const { orders } = await bulkExecuteTrades(trades);
        const executedSet = new Set(orders.map((o: any) => o.comment).filter(Boolean));
        setExecutedComments((prev) => { const next = new Set(prev); executedSet.forEach((c) => next.add(c)); return next; });
        setTimeout(() => setExecutedComments((prev) => { const next = new Set(prev); executedSet.forEach((c) => next.delete(c)); return next; }), 3000);
      } else if (executeTradeFromChart) {
        await Promise.allSettled(trades.map(async (tr) => {
          try {
            await executeTradeFromChart(tr.symbol, tr.action, tr.volume, tr.sl, undefined, tr.comment);
            setExecutedComments((prev) => new Set(prev).add(tr.comment));
            setTimeout(() => setExecutedComments((prev) => { const n = new Set(prev); n.delete(tr.comment); return n; }), 3000);
          } catch (err) { console.error(err); }
        }));
      }
    } catch (err) { console.error("Bulk execution error:", err); }
    setDirExecuting((prev) => { const next = new Set(prev); tradeWindowSizes.forEach((ws) => next.delete(ws)); return next; });
    setIsExecutingAll(false);
  };

  const handleAutoAll = async () => {
    if (!directionsData || !directionsData.rows || directionsData.rows.length === 0 || !currency || !autoTradeSubscribe) return;
    setIsAutoExecutingAll(true);
    const trades: Array<{ symbol: string; main_tf: string; sub_tf: string; window_size: number; direction: string; lot_size: number; sl?: number; comment: string }> = [];
    const tradeWindowSizes: number[] = [];
    for (const row of directionsData.rows) {
      if (dirExecuting.has(-row.windowSize)) continue;
      const chartComment = `PX-Chart-${currency.symbol}-${mainTF}-${subTF}-W${row.windowSize}-${row.isBuy ? "BUY" : "SELL"}`.slice(0, 31);
      if (autoTrades?.some((at) => at.comment === chartComment)) continue;
      trades.push({ symbol: currency.symbol, main_tf: mainTF, sub_tf: subTF, window_size: row.windowSize, direction: row.isBuy ? "BUY" : "SELL", lot_size: dirLotSizes[row.windowSize] ?? 0.01, comment: chartComment });
      tradeWindowSizes.push(-row.windowSize);
    }
    if (trades.length === 0) { setIsAutoExecutingAll(false); return; }
    setDirExecuting((prev) => { const next = new Set(prev); tradeWindowSizes.forEach((ws) => next.add(ws)); return next; });
    try { await autoTradeSubscribe(trades); } catch (err) { console.error(err); } finally {
      setDirExecuting((prev) => { const next = new Set(prev); tradeWindowSizes.forEach((ws) => next.delete(ws)); return next; });
      setIsAutoExecutingAll(false);
    }
  };

  const decimals = currency?.market === "CRYPTO" || currency?.market === "INDEX" ? 2 : 4;
  const isPositive = (currency?.change ?? 0) >= 0;
  const isAnyLoading = (isPhaseIndicator && apiLoading) || (isDirectionIndicator && dirLoading) || (isOscillationIndicator && oscLoading) || (isDisplacementIndicator && dispLoading) || (isReferenceIndicator && refLoading) || (isEnvelopIndicator && envLoading);
  const anyError = isPhaseIndicator ? apiError : isDirectionIndicator ? dirError : isOscillationIndicator ? oscError : isDisplacementIndicator ? dispError : isReferenceIndicator ? refError : envError;
  const isAnyEmpty = (isPhaseIndicator || isDirectionIndicator || isOscillationIndicator || isDisplacementIndicator || isReferenceIndicator || isEnvelopIndicator) && effectiveData.length === 0;

  return {
    currency, indicator, timeframe, onTimeframeChange, renderTradeButtons, onOpenDynamics,
    language, t, isRTL, tk, decisionLabel,
    showInfoPopup, setShowInfoPopup, showChartInfo, setShowChartInfo,
    candleLimit, handleLimitChange,
    isExpanded, setIsExpanded, showTable, setShowTable,
    showDirections, setShowDirections, dirLotSizes, setDirLotSizes,
    globalDirLot, setGlobalDirLot, dirExecuting, setDirExecuting,
    isExecutingAll, isAutoExecutingAll, nextCheckStr,
    executedComments, setExecutedComments,
    viewWindow, startIndex, isDragging, yOffset, setYOffset,
    chartRef, fullscreenChartRef,
    mainTF, subTF, handleMainTFChange, handleSubTFChange,
    isPhaseIndicator, isDirectionIndicator, isOscillationIndicator,
    isDisplacementIndicator, isReferenceIndicator, isEnvelopIndicator,
    apiLoading, dirLoading, oscLoading, dispLoading, refLoading, envLoading,
    apiError, dirError, oscError, dispError, refError, envError,
    isAnyLoading, anyError, isAnyEmpty,
    effectiveData, displayedData, drawingPriceRange,
    selectedTool, setSelectedTool, magnetEnabled, drawingsLocked, drawingsVisible,
    drawings, setDrawings, clearDrawingsCallback, handleClearDrawings,
    handleMagnetToggle, handleLockToggle, handleVisibilityToggle,
    showDrawingTools, setShowDrawingTools, handleCloseDrawingTools,
    chartLivePrice,
    zoomIn, zoomOut, panLeft, panRight, goStart, goEnd,
    isDrawing, onDown, onMove, onUp,
    directionsData, applyGlobalDirLot, handleExecuteAll, handleAutoAll,
    decimals, isPositive,
    mt5Connected, executeTradeFromChart, bulkExecuteTrades, mt5Positions,
    autoTrades, autoTradeWorker, autoTradeSubscribe, autoTradeUnsubscribe,
    addTradeToHistory, serverTradeHistory, accessToken,
  };
}

export type IndicatorChartCtx = ReturnType<typeof useIndicatorChart>;
