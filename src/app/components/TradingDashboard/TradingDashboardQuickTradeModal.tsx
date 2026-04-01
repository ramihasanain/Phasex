import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, TrendingDown, X } from "lucide-react";
import type { TradingDashboardCtx } from "./useTradingDashboard";

export function TradingDashboardQuickTradeModal({ ctx }: { ctx: TradingDashboardCtx }) {
    const {
        quickTradeModal, setQuickTradeModal, mt5Connected,
        qtSL, setQtSL, qtTP, setQtTP, qtSymbol, setQtSymbol,
        qtError, setQtError, qtExecuting, setQtExecuting, qtLot, setQtLot,
        executeTrade, refreshMT5Positions, timeframe, language,
        recentlyExecuted, setRecentlyExecuted,
    } = ctx;

    return (
      <AnimatePresence>
        {quickTradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setQuickTradeModal(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md mx-4 rounded-2xl overflow-hidden relative"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.06) 0%, rgba(6,10,16,0.98) 60%)",
                border: "1px solid rgba(99,102,241,0.15)",
                boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
              }}
            >
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: quickTradeModal.action.includes("BUY")
                          ? "rgba(16,185,129,0.12)"
                          : "rgba(239,68,68,0.12)",
                      }}
                    >
                      {quickTradeModal.action.includes("BUY") ? (
                        <TrendingUp
                          className="w-4 h-4"
                          style={{ color: "#34d399" }}
                        />
                      ) : (
                        <TrendingDown
                          className="w-4 h-4"
                          style={{ color: "#f87171" }}
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-[14px] font-black text-white">
                        {quickTradeModal.action} {quickTradeModal.symbol}
                      </h3>
                      <p className="text-[10px] text-gray-500">Execute Order</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setQuickTradeModal(null)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setQtError(null);
                    if (!mt5Connected) {
                      setQtError("⚠️ Connect to MT5 first");
                      return;
                    }
                    setQtExecuting(true);
                    try {
                      const actionType = quickTradeModal.action.includes("BUY")
                        ? "BUY"
                        : "SELL";
                      const slVal = qtSL ? parseFloat(qtSL) : undefined;
                      const tpVal = qtTP ? parseFloat(qtTP) : undefined;
                      const dashComment = quickTradeModal.source === "Chart" 
                        ? `PX-Chart ${qtSymbol} ${timeframe} ${actionType}`.slice(0, 31)
                        : `PX-AI ${qtSymbol} ${timeframe} ${actionType}`.slice(0, 31);
                      await executeTrade(
                        qtSymbol,
                        actionType,
                        parseFloat(qtLot) || 0.01,
                        slVal,
                        tpVal,
                        dashComment,
                      );
                      // Track locally to prevent duplicate before positions refresh
                      const exSym = qtSymbol.toUpperCase().replace(/\.(raw|p|sd|lv)|micro|m$/i, '');
                      setRecentlyExecuted(prev => new Set(prev).add(exSym));
                      setQuickTradeModal(null);
                      // Force refresh positions immediately
                      refreshMT5Positions();
                    } catch (err: any) {
                      const rawMsg = err.message || "Trade failed";
                      // Sanitize the internal service name from the inline error just like TradeErrorPopup does
                      const safeMsg = rawMsg.replace(/MetaApi[i]?/gi, 'Broker').replace(/metaapi/gi, 'Broker').replace(/meta-api/gi, 'Broker');
                      setQtError(safeMsg);
                    } finally {
                      setQtExecuting(false);
                    }
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-[10px] font-bold tracking-widest uppercase mb-1 block text-gray-500">
                      Symbol Override
                    </label>
                    <input
                      type="text"
                      value={qtSymbol}
                      onChange={(e) => setQtSymbol(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-[13px] font-bold outline-none"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#fff",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold tracking-widest uppercase mb-1 block text-gray-500">
                      Lot Size
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="100"
                      value={qtLot}
                      onChange={(e) => setQtLot(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-[13px] font-bold outline-none"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#fff",
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold tracking-widest uppercase mb-1 block text-gray-500">
                        Stop Loss
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={qtSL}
                        onChange={(e) => setQtSL(e.target.value)}
                        placeholder="Optional"
                        className="w-full px-3 py-2 rounded-xl text-[13px] font-bold outline-none"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#fff",
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold tracking-widest uppercase mb-1 block text-gray-500">
                        Take Profit
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={qtTP}
                        onChange={(e) => setQtTP(e.target.value)}
                        placeholder="Optional"
                        className="w-full px-3 py-2 rounded-xl text-[13px] font-bold outline-none"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#fff",
                        }}
                      />
                    </div>
                  </div>
                  {qtError && (
                    <div
                      className="text-[11px] font-bold px-3 py-2 rounded-lg"
                      style={{
                        color: "#f87171",
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.15)",
                      }}
                    >
                      {qtError}
                    </div>
                  )}
                  <motion.button
                    type="submit"
                    disabled={qtExecuting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl text-[12px] font-black tracking-widest uppercase cursor-pointer"
                    style={{
                      background: quickTradeModal.action.includes("BUY")
                        ? "rgba(16,185,129,0.2)"
                        : "rgba(239,68,68,0.2)",
                      color: quickTradeModal.action.includes("BUY")
                        ? "#34d399"
                        : "#f87171",
                      border: `1px solid ${quickTradeModal.action.includes("BUY") ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                    }}
                  >
                    {qtExecuting
                      ? "Executing..."
                      : `Execute ${quickTradeModal.action}`}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
}
