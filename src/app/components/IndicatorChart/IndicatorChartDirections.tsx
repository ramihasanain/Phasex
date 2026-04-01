import { motion } from "motion/react";
import { Activity, BarChart3, Zap } from "lucide-react";
import type { IndicatorChartCtx } from "./useIndicatorChart";

export function IndicatorChartDirections({ ctx, compact = false }: { ctx: IndicatorChartCtx; compact?: boolean }) {
    const {
        currency, indicator, tk, isRTL, t, decimals, isPositive,
        showDirections, setShowDirections, showTable, setShowTable,
        directionsData, dirLotSizes, setDirLotSizes,
        globalDirLot, setGlobalDirLot, applyGlobalDirLot,
        dirExecuting, setDirExecuting, executedComments, setExecutedComments,
        isExecutingAll, isAutoExecutingAll,
        handleExecuteAll, handleAutoAll,
        mainTF, subTF, mt5Positions, executeTradeFromChart, autoTrades, autoTradeSubscribe,
    } = ctx;

    if (!showDirections || !currency || !indicator) return null;

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
}
