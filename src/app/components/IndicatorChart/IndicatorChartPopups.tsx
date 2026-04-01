import { motion, AnimatePresence } from "motion/react";
import { Activity, Info, X } from "lucide-react";
import type { IndicatorChartCtx } from "./useIndicatorChart";

export function IndicatorChartPopups({ ctx }: { ctx: IndicatorChartCtx }) {
    const {
        currency, indicator, tk, isRTL, t,
        showInfoPopup, setShowInfoPopup, showChartInfo, setShowChartInfo,
    } = ctx;

    if (!currency || !indicator) return null;

    return (
        <>
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
