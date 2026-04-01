import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Activity, Clock, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, SkipBack, SkipForward, Info, Table, BarChart3, X, ListOrdered, Edit3, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TZCandlestickChart } from "../TZCandlestickChart.tsx";
import { DrawingToolbar } from "../DrawingToolbar";
import { DrawingCanvas } from "../DrawingCanvas";
import { PhaseTimeframeSelector, CandleLimitSelector, AnimatedStat } from "./indicatorChartTypesAndControls";
import { IndicatorChartDirections } from "./IndicatorChartDirections";
import { NavBtn } from "./IndicatorChartPanel";
import type { IndicatorChartCtx } from "./useIndicatorChart";

export function IndicatorChartFullscreen({ ctx }: { ctx: IndicatorChartCtx }) {
    const {
        currency, indicator, tk, isRTL, t,
        isExpanded, setIsExpanded, showTable, setShowTable,
        showDirections, setShowDirections,
        showInfoPopup, setShowInfoPopup,
        timeframe, onTimeframeChange,
        mainTF, subTF, handleMainTFChange, handleSubTFChange,
        isPhaseIndicator,
        isDirectionIndicator, isOscillationIndicator, isDisplacementIndicator, isReferenceIndicator, isEnvelopIndicator,
        apiLoading, dirLoading, oscLoading, dispLoading, refLoading, envLoading,
        apiError, dirError, oscError, dispError, refError, envError,
        effectiveData, displayedData, drawingPriceRange, yOffset, setYOffset,
        viewWindow, startIndex, fullscreenChartRef,
        zoomIn, zoomOut, panLeft, panRight, goStart, goEnd,
        candleLimit, handleLimitChange,
        selectedTool, setSelectedTool, magnetEnabled, drawingsLocked, drawingsVisible,
        setDrawings, clearDrawingsCallback,
        handleClearDrawings, handleMagnetToggle, handleLockToggle, handleVisibilityToggle,
        showDrawingTools, setShowDrawingTools, handleCloseDrawingTools,
        decimals, isPositive, isAnyEmpty,
    } = ctx;

    if (!currency || !indicator || !isExpanded) return null;

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
                        {tf >= 1440 ? `1${isRTL ? 'ي' : 'D'}` : tf >= 60 ? `${tf / 60}${isRTL ? 'س' : 'H'}` : `${tf}${isRTL ? 'د' : 'M'}`}
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
                          {(() => {
                            const isAllExecuted = directionsData && directionsData.rows.length > 0 && directionsData.rows.every((row: any) => {
                              const chartComment = `PX-Chart-${currency.symbol}-${mainTF}-${subTF}-W${row.windowSize}-${row.isBuy ? 'BUY' : 'SELL'}`.slice(0, 31);
                              return executedComments.has(chartComment) || mt5Positions?.some((p: any) => p.comment === chartComment);
                            });

                            return (
                              <button onClick={handleExecuteAll} disabled={isExecutingAll || isAllExecuted || !executeTradeFromChart || !currency} className="px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399", border: `1px solid rgba(16,185,129,0.3)` }} onMouseEnter={(e) => { e.currentTarget.style.color = "#6ee7b7"; e.currentTarget.style.background = "rgba(16,185,129,0.25)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#34d399"; e.currentTarget.style.background = "rgba(16,185,129,0.15)"; }}>
                                {isExecutingAll ? (
                                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full" />
                                ) : (
                                  <Activity className="w-4 h-4" />
                                )}
                                {isRTL ? "تنفيذ الكل" : "Execute All"}
                              </button>
                            );
                          })()}
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
                                                    setTimeout(() => setExecutedComments(prev => { const n = new Set(prev); n.delete(chartComment); return n; }), 3000);
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
    );
}
