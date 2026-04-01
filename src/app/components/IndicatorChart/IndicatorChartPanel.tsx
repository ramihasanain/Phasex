import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingUp, TrendingDown, Activity, Clock, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, SkipBack, SkipForward, Info, Table, BarChart3, Maximize2, ListOrdered, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TZCandlestickChart } from "../TZCandlestickChart.tsx";
import { PhaseTimeframeSelector, CandleLimitSelector, AnimatedStat } from "./indicatorChartTypesAndControls";
import { decisionStyle, decisionLabelAr } from "./decisionEngine";
import { IndicatorChartDirections } from "./IndicatorChartDirections";
import type { IndicatorChartCtx } from "./useIndicatorChart";

export function NavBtn({ onClick, disabled, children, title }: { onClick: () => void; disabled?: boolean; children: React.ReactNode; title?: string }) {
    return (
        <button onClick={onClick} disabled={disabled} title={title}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all disabled:opacity-20"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#94a3b8" }}
            onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
            {children}
        </button>
    );
}

export function IndicatorChartPanel({ ctx }: { ctx: IndicatorChartCtx }) {
    const {
        currency, indicator, tk, isRTL, t, decisionLabel, renderTradeButtons, onOpenDynamics,
        showInfoPopup, setShowInfoPopup, showChartInfo, setShowChartInfo,
        candleLimit, handleLimitChange,
        isExpanded, setIsExpanded, showTable, setShowTable,
        showDirections, setShowDirections,
        timeframe, onTimeframeChange,
        mainTF, subTF, handleMainTFChange, handleSubTFChange,
        isPhaseIndicator, isAnyLoading, isAnyEmpty,
        isDirectionIndicator, isOscillationIndicator, isDisplacementIndicator, isReferenceIndicator, isEnvelopIndicator,
        apiLoading, dirLoading, oscLoading, dispLoading, refLoading, envLoading,
        apiError, dirError, oscError, dispError, refError, envError,
        effectiveData, displayedData, yOffset, setYOffset,
        viewWindow, startIndex, isDragging, chartRef,
        zoomIn, zoomOut, panLeft, panRight, goStart, goEnd,
        onDown, onMove, onUp, decimals, isPositive,
    } = ctx;

    if (!currency || !indicator) return null;

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

  return (
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

          {/* Centered Animated Symbol + Decision Badge (Absolute) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-auto" style={{ marginLeft: decisionLabel ? '-10px' : 0 }}>
            <motion.div
              className="flex items-center justify-center gap-2.5 px-5 py-1.5 rounded-full"
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              key={currency.symbol + (decisionLabel || '')}
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
              <motion.button
                onClick={() => onOpenDynamics && onOpenDynamics(currency.symbol, "Decision Engine")}
                className="text-lg font-black relative z-10 tracking-[0.15em] uppercase cursor-pointer hover:opacity-80 transition-opacity"
                style={{ color: tk.textPrimary }}
                title={isRTL ? "فتح جدول ديسيشن إنجن" : "Open Decision Engine Table"}
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
              </motion.button>
              {/* Decision Engine Badge — inline next to symbol */}
              {decisionLabel && (() => {
                const ds = decisionStyle(decisionLabel);
                return (
                  <motion.button
                    onClick={() => onOpenDynamics && onOpenDynamics(currency.symbol, "Decision Engine")}
                    className="relative z-10 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-[0.1em] uppercase whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity"
                    initial={{ opacity: 0, x: -8, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    style={{
                      color: ds.color,
                      background: ds.bg,
                      border: `1px solid ${ds.border}`,
                      boxShadow: ds.glow,
                    }}
                    title={isRTL ? "فتح جدول ديسيشن إنجن" : "Open Decision Engine Table"}
                  >
                    <Zap className="w-2.5 h-2.5" />
                    {isRTL ? decisionLabelAr[decisionLabel] || decisionLabel : decisionLabel}
                  </motion.button>
                );
              })()}
              {!decisionLabel && (
                <div className="flex flex-col gap-1 items-center relative z-10">
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-500" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  <motion.div className="w-1 h-1 rounded-full bg-emerald-500/50" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} />
                </div>
              )}
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
                  {tf >= 1440 ? `1${isRTL ? 'ي' : 'D'}` : tf >= 60 ? `${tf / 60}${isRTL ? 'س' : 'H'}` : `${tf}${isRTL ? 'د' : 'M'}`}
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
                    {(() => {
                      const isAllExecuted = directionsData && directionsData.rows.length > 0 && directionsData.rows.every((row: any) => {
                        const chartComment = `PX-Chart-${currency.symbol}-${mainTF}-${subTF}-W${row.windowSize}-${row.isBuy ? 'BUY' : 'SELL'}`.slice(0, 31);
                        return executedComments.has(chartComment) || mt5Positions?.some((p: any) => p.comment === chartComment);
                      });

                      const isAllAutoActive = directionsData && directionsData.rows.length > 0 && directionsData.rows.every((row: any) => {
                        const chartComment = `PX-Chart-${currency.symbol}-${mainTF}-${subTF}-W${row.windowSize}-${row.isBuy ? 'BUY' : 'SELL'}`.slice(0, 31);
                        return autoTrades?.some(at => at.comment === chartComment) || executedComments.has(chartComment) || mt5Positions?.some((p: any) => p.comment === chartComment);
                      });

                      return (
                        <>
                          <button onClick={handleExecuteAll} disabled={isExecutingAll || isAllExecuted || !executeTradeFromChart || !currency} className="px-3 py-1.5 flex items-center gap-2 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: tk.isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.1)", color: tk.isDark ? "#34d399" : "#059669", border: `1px solid ${tk.isDark ? "rgba(16,185,129,0.3)" : "rgba(16,185,129,0.3)"}` }}>
                            {isExecutingAll ? (
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full" />
                            ) : (
                              <Activity className="w-3.5 h-3.5" />
                            )}
                            {isRTL ? "تنفيذ الكل" : "Execute All"}
                          </button>
                          <div className="flex flex-col items-center gap-1">
                            <button onClick={handleAutoAll} disabled={isAutoExecutingAll || isAllAutoActive || !autoTradeSubscribe || !currency} className="px-3 py-1.5 flex items-center gap-2 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: tk.isDark ? "rgba(139,92,246,0.15)" : "rgba(139,92,246,0.1)", color: tk.isDark ? "#a78bfa" : "#8b5cf6", border: `1px solid ${tk.isDark ? "rgba(139,92,246,0.3)" : "rgba(139,92,246,0.2)"}` }}>
                              {isAutoExecutingAll ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full" />
                              ) : (
                                <Zap className="w-3.5 h-3.5" />
                              )}
                              {isRTL ? "اوتو للكل" : "Auto All"}
                            </button>
                          </div>
                        </>
                      );
                    })()}
                    <button onClick={() => setShowDirections(false)} className="px-3 py-1.5 flex items-center gap-2 mb-4 rounded-lg text-xs font-bold transition-colors cursor-pointer" style={{ background: tk.buttonGhost, color: tk.buttonGhostText, border: `1px solid ${tk.buttonGhostBorder}` }}>
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
                                            await executeTradeFromChart(currency.symbol, row.isBuy ? 'BUY' : 'SELL', lot, undefined, undefined, chartComment);
                                            setExecutedComments(prev => new Set(prev).add(chartComment));
                                            setTimeout(() => setExecutedComments(prev => { const n = new Set(prev); n.delete(chartComment); return n; }), 3000);
                                          } catch (err) { console.error(err); }
                                          setDirExecuting(prev => { const n = new Set(prev); n.delete(row.windowSize); return n; });
                                        }}
                                        className="inline-flex items-center justify-center min-w-[60px] px-2 py-1 rounded-lg text-[10px] font-black tracking-wider cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        style={{
                                          color: (isBlocked || dirExecuting.has(row.windowSize)) ? '#64748b' : row.isBuy ? '#34d399' : '#f87171',
                                          background: (isBlocked || dirExecuting.has(row.windowSize)) ? 'rgba(255,255,255,0.03)' : row.isBuy ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                                          border: `1px solid ${(isBlocked || dirExecuting.has(row.windowSize)) ? 'rgba(255,255,255,0.06)' : row.isBuy ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                        }}
                                      >
                                        {dirExecuting.has(row.windowSize) ? '...' : isBlocked ? '✅' : row.isBuy ? '▶ BUY' : '▶ SELL'}
                                      </button>

                                      {/* Auto Button */}
                                      {(() => {
                                        const isAutoActive = autoTrades?.some(at => at.comment === chartComment);
                                        const isAutoTrading = dirExecuting.has(-row.windowSize); // negative windowSize for auto loading state
                                        const isAutoBlocked = isAutoActive || isBlocked;

                                        return (
                                          <button
                                            disabled={isAutoTrading || isAutoBlocked || !autoTradeSubscribe || !currency}
                                            onClick={async (e) => {
                                              e.stopPropagation();
                                              if (!autoTradeSubscribe || !currency || isAutoBlocked) return;

                                              setDirExecuting(prev => new Set(prev).add(-row.windowSize));

                                              const lot = dirLotSizes[row.windowSize] ?? 0.01;
                                              await autoTradeSubscribe([{
                                                symbol: currency.symbol,
                                                main_tf: mainTF,
                                                sub_tf: subTF,
                                                window_size: row.windowSize,
                                                direction: row.isBuy ? 'BUY' : 'SELL',
                                                lot_size: lot,
                                                comment: chartComment
                                              }]);

                                              setDirExecuting(prev => { const n = new Set(prev); n.delete(-row.windowSize); return n; });
                                            }}
                                            className="inline-flex items-center justify-center min-w-[60px] gap-1 px-2 py-1 rounded-lg text-[10px] font-black tracking-wider cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                            style={{
                                              color: (isAutoBlocked || isAutoTrading) ? '#64748b' : '#a78bfa',
                                              background: (isAutoBlocked || isAutoTrading) ? 'rgba(255,255,255,0.03)' : 'rgba(139,92,246,0.15)',
                                              border: `1px solid ${(isAutoBlocked || isAutoTrading) ? 'rgba(255,255,255,0.06)' : 'rgba(139,92,246,0.3)'}`,
                                            }}
                                          >
                                            {isAutoTrading ? '...' : isAutoActive ? '✅ Auto' : 'Auto'}
                                          </button>
                                        );
                                      })()}
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
    );
}
