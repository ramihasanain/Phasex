import { motion, AnimatePresence } from "motion/react";
import { X, RefreshCw, Crown, Clock, Check, Copy, CircleCheck } from "lucide-react";
import { upgradeSubscription, getAddons } from "../../api/subscriptionsApi";
import type { TradingDashboardCtx } from "./useTradingDashboard";

export function TradingDashboardMT5SubscribeModal({ ctx }: { ctx: TradingDashboardCtx }) {
    const {
        tk, t, hasMT5Access, accessToken, subscriptionDetails,
        isMT5SubscribeOpen, setIsMT5SubscribeOpen,
        mt5SubscribeTermsAccepted, setMt5SubscribeTermsAccepted,
        isMT5Processing, setIsMT5Processing, isMT5Pending, setIsMT5Pending,
    } = ctx;

    return (
      <AnimatePresence>
        {isMT5SubscribeOpen && !hasMT5Access && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsMT5SubscribeOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md mx-4 rounded-[24px] overflow-hidden relative"
              style={{
                background: tk.isDark
                  ? "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.06) 0%, rgba(6,10,16,0.98) 60%)"
                  : tk.surfaceElevated,
                border: `1px solid ${tk.isDark ? "rgba(99,102,241,0.15)" : tk.border}`,
                boxShadow: tk.isDark
                  ? "0 30px 80px rgba(0,0,0,0.8)"
                  : "0 25px 60px rgba(0,0,0,0.15)",
              }}
            >
              {/* Grid pattern bg */}
              {tk.isDark && (
                <div
                  className="absolute inset-0 pointer-events-none z-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(99,102,241,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.02) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />
              )}

              <div className="relative z-10 p-6">
                {!isMT5Pending ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{
                            background: tk.isDark
                              ? "rgba(99,102,241,0.1)"
                              : tk.infoBg,
                            border: `1px solid ${tk.isDark ? "rgba(99,102,241,0.2)" : "rgba(79,70,229,0.15)"}`,
                          }}
                        >
                          <Crown
                            className="w-6 h-6"
                            style={{ color: tk.info }}
                          />
                        </div>
                        <div>
                          <h3
                            className="text-lg font-black tracking-wide leading-tight"
                            style={{ color: tk.textPrimary }}
                          >
                            {t("mt5Title")}
                          </h3>
                          <p
                            className="text-[10px] font-bold tracking-widest uppercase mt-0.5"
                            style={{ color: tk.textDim }}
                          >
                            Integration Add-on
                          </p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => setIsMT5SubscribeOpen(false)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
                        style={{
                          background: tk.surfaceHover,
                          border: `1px solid ${tk.border}`,
                        }}
                      >
                        <X className="w-4 h-4" style={{ color: tk.textDim }} />
                      </motion.button>
                    </div>

                    <div
                      className="p-4 rounded-xl mb-5"
                      style={{
                        background: tk.isDark
                          ? "rgba(99,102,241,0.05)"
                          : tk.surfaceHover,
                        border: `1px solid ${tk.isDark ? "rgba(99,102,241,0.1)" : tk.border}`,
                      }}
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span
                          className="text-sm font-bold"
                          style={{ color: tk.textPrimary }}
                        >
                          {t("mt5Price")}
                        </span>
                      </div>
                      <p
                        className="text-xs leading-relaxed font-medium"
                        style={{ color: tk.textDim }}
                      >
                        {t("mt5Desc")}
                      </p>
                    </div>

                    <div className="mb-6 flex flex-col gap-3">
                      <h4
                        className="font-bold text-sm flex items-center gap-2"
                        style={{ color: tk.textPrimary }}
                      >
                        Payment Instructions
                      </h4>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: tk.textDim }}
                      >
                        Send <strong className="text-white">$30</strong> via{" "}
                        <a
                          href="https://t.me/PhaseX_Ai"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0088cc] font-bold no-underline hover:underline"
                        >
                          Telegram
                        </a>{" "}
                        or USDT TRC20 to the following address:
                      </p>
                      <div
                        className="flex items-center justify-between p-3 rounded-xl border cursor-pointer hover:border-[#f7931a]/40 transition-colors group"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            "TQwFCKK5JjZACHdE888zG5iUx8wQ2RtnAV",
                          )
                        }
                        style={{
                          background: tk.surface,
                          borderColor: tk.border,
                        }}
                      >
                        <span
                          className="font-mono text-xs break-all pr-3"
                          style={{ color: tk.textMuted }}
                        >
                          TQwFCKK5JjZACHdE888zG5iUx8wQ2RtnAV
                        </span>
                        <span className="text-[#f7931a] group-hover:text-white group-hover:bg-[#f7931a] transition-colors p-2 bg-[#f7931a]/15 rounded-lg shrink-0">
                          <Copy size={14} />
                        </span>
                      </div>
                    </div>

                    <label
                      className="flex items-start gap-3 p-4 rounded-xl cursor-pointer mb-6 transition-colors"
                      style={{
                        background: tk.surfaceHover,
                        border: `1px solid ${mt5SubscribeTermsAccepted ? "#6366f1" : tk.border}`,
                      }}
                    >
                      <div className="pt-0.5 relative shrink-0">
                        <input
                          type="checkbox"
                          checked={mt5SubscribeTermsAccepted}
                          onChange={(e) =>
                            setMt5SubscribeTermsAccepted(e.target.checked)
                          }
                          className="peer sr-only"
                        />
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center transition-colors"
                          style={{
                            border: `2px solid ${mt5SubscribeTermsAccepted ? "#6366f1" : tk.border}`,
                            background: mt5SubscribeTermsAccepted
                              ? "#6366f1"
                              : "transparent",
                          }}
                        >
                          <Check
                            className={`w-3.5 h-3.5 text-white transition-opacity ${mt5SubscribeTermsAccepted ? "opacity-100" : "opacity-0"}`}
                            strokeWidth={3}
                          />
                        </div>
                      </div>
                      <span
                        className="text-xs leading-relaxed font-medium"
                        style={{ color: tk.textMuted }}
                      >
                        {t("mt5Terms")}
                      </span>
                    </label>

                    <motion.button
                      disabled={!mt5SubscribeTermsAccepted || isMT5Processing}
                      onClick={async () => {
                        setIsMT5Processing(true);
                        try {
                          // Fetch addons to get mt5_inte ID
                          const addons = await getAddons(accessToken || undefined);
                          const mt5Addon = addons.find((a: any) => a.code === 'mt5_intgration');
                          if (mt5Addon && accessToken) {
                            const result = await upgradeSubscription(accessToken, {
                              plan_id: subscriptionDetails?.planId || 0,
                              addon_ids: [mt5Addon.id],
                              addons_mode: 'add',
                            });
                            console.log('[PhaseX] MT5 upgrade submitted:', result);
                          } else {
                            console.warn('[PhaseX] mt5_inte addon not found or no token');
                          }
                          setIsMT5Processing(false);
                          setIsMT5Pending(true);
                        } catch (err: any) {
                          console.error('[PhaseX] MT5 upgrade error:', err);
                          setIsMT5Processing(false);
                          alert(err?.message || 'Failed to submit MT5 upgrade request');
                        }
                      }}
                      whileHover={
                        mt5SubscribeTermsAccepted && !isMT5Processing
                          ? {
                              scale: 1.02,
                              boxShadow: "0 8px 30px rgba(99,102,241,0.25)",
                            }
                          : {}
                      }
                      whileTap={
                        mt5SubscribeTermsAccepted && !isMT5Processing
                          ? { scale: 0.98 }
                          : {}
                      }
                      className={`w-full py-4 rounded-xl text-sm font-black uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-2 ${!mt5SubscribeTermsAccepted || isMT5Processing ? "opacity-50 grayscale cursor-not-allowed" : ""}`}
                      style={{
                        background: tk.info,
                        color: "#fff",
                        boxShadow:
                          mt5SubscribeTermsAccepted && !isMT5Processing
                            ? `0 8px 30px ${tk.isDark ? "rgba(99,102,241,0.25)" : "rgba(79,70,229,0.25)"}`
                            : "none",
                      }}
                    >
                      {isMT5Processing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />{" "}
                          Processing...
                        </>
                      ) : (
                        <>
                          <CircleCheck className="w-5 h-5" /> I Have Paid $30
                        </>
                      )}
                    </motion.button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <motion.div
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-6 relative"
                      style={{
                        background: `linear-gradient(135deg, rgba(250,204,21,0.15) 0%, transparent 100%)`,
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 border-4 rounded-full border-t-[#facc15] border-r-transparent border-b-[#facc15] border-l-transparent"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <Clock size={32} color="#facc15" />
                    </motion.div>
                    <h2
                      className="text-2xl font-black mb-2"
                      style={{ color: tk.textPrimary }}
                    >
                      Payment Pending
                    </h2>
                    <p
                      className="text-sm max-w-[280px] mx-auto leading-relaxed font-medium"
                      style={{ color: tk.textDim }}
                    >
                      Your payment is being verified by the administration. This
                      may take a few minutes.
                    </p>
                    <button
                      onClick={() => {
                        setIsMT5SubscribeOpen(false);
                        // Optionally reset states so next time they open it's initially pending or fresh?
                        // The user requested it stays pending, so we will not reset isMT5Pending here.
                      }}
                      className="mt-8 px-6 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      style={{
                        background: tk.surfaceHover,
                        border: `1px solid ${tk.border}`,
                        color: tk.textPrimary,
                      }}
                    >
                      Close Window
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
}
