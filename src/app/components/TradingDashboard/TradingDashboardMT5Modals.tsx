import { motion, AnimatePresence } from "motion/react";
import { X, RefreshCw, Wifi, Server, LogOut, AlertTriangle, Eye, EyeOff } from "lucide-react";
import type { TradingDashboardCtx } from "./useTradingDashboard";

export function TradingDashboardMT5Modals({ ctx }: { ctx: TradingDashboardCtx }) {
    const {
        tk, isRTL, mt5Connected, mt5Connecting, mt5ConnectStatus, mt5Error,
        connectMT5, disconnectMT5, mt5Creds, setMT5Creds,
        showMT5Password, setShowMT5Password,
        isMT5LoginOpen, setIsMT5LoginOpen,
        isMT5DisconnectOpen, setIsMT5DisconnectOpen,
    } = ctx;

    return (
        <>
      <AnimatePresence>
        {isMT5LoginOpen && !mt5Connected && (
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
              if (e.target === e.currentTarget) setIsMT5LoginOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md mx-4 rounded-2xl overflow-hidden relative"
              style={{
                background: tk.isDark
                  ? "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.06) 0%, rgba(6,10,16,0.98) 60%)"
                  : tk.surfaceElevated,
                border: `1px solid ${tk.isDark ? "rgba(99,102,241,0.15)" : tk.border}`,
                boxShadow: tk.isDark
                  ? "0 25px 80px rgba(0,0,0,0.5)"
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

              {/* Header */}
              <div className="relative z-10 p-6 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: tk.isDark
                          ? "rgba(99,102,241,0.1)"
                          : tk.infoBg,
                        border: `1px solid ${tk.isDark ? "rgba(99,102,241,0.2)" : "rgba(79,70,229,0.15)"}`,
                      }}
                    >
                      <Server className="w-5 h-5" style={{ color: tk.info }} />
                    </div>
                    <div>
                      <h3
                        className="text-[16px] font-black tracking-wide"
                        style={{ color: tk.textPrimary }}
                      >
                        MetaTrader 5
                      </h3>
                      <p
                        className="text-[10px] font-bold tracking-widest uppercase"
                        style={{ color: tk.textDim }}
                      >
                        LIVE CONNECTION
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMT5LoginOpen(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
                    style={{
                      background: tk.surfaceHover,
                      border: `1px solid ${tk.border}`,
                    }}
                  >
                    <X className="w-4 h-4" style={{ color: tk.textDim }} />
                  </motion.button>
                </div>
              </div>

              {/* Form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    localStorage.setItem("mt5_credentials", JSON.stringify(mt5Creds));
                  } catch {}
                  await connectMT5(mt5Creds);
                  if (!mt5Error) setIsMT5LoginOpen(false);
                }}
                className="relative z-10 px-6 pb-6 flex flex-col gap-3"
              >
                {/* Server */}
                <div>
                  <label
                    className="text-[10px] font-bold tracking-widest uppercase mb-1.5 block"
                    style={{ color: tk.textDim }}
                  >
                    Server
                  </label>
                  <input
                    type="text"
                    value={mt5Creds.server}
                    onChange={(e) =>
                      setMT5Creds({ ...mt5Creds, server: e.target.value })
                    }
                    placeholder="e.g. EquitiBrokerageSC-Demo"
                    className="w-full px-3 py-2.5 rounded-xl text-[13px] font-medium outline-none transition-colors"
                    style={{
                      background: tk.inputBg,
                      border: `1px solid ${tk.inputBorder}`,
                      color: tk.inputText,
                    }}
                    required
                  />
                </div>

                {/* Login */}
                <div>
                  <label
                    className="text-[10px] font-bold tracking-widest uppercase mb-1.5 block"
                    style={{ color: tk.textDim }}
                  >
                    Login
                  </label>
                  <input
                    type="text"
                    value={mt5Creds.login}
                    onChange={(e) =>
                      setMT5Creds({ ...mt5Creds, login: e.target.value })
                    }
                    placeholder="e.g. 1110835"
                    className="w-full px-3 py-2.5 rounded-xl text-[13px] font-medium outline-none transition-colors"
                    style={{
                      background: tk.inputBg,
                      border: `1px solid ${tk.inputBorder}`,
                      color: tk.inputText,
                    }}
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    className="text-[10px] font-bold tracking-widest uppercase mb-1.5 block"
                    style={{ color: tk.textDim }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showMT5Password ? "text" : "password"}
                      value={mt5Creds.password}
                      onChange={(e) =>
                        setMT5Creds({ ...mt5Creds, password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 rounded-xl text-[13px] font-medium outline-none transition-colors"
                      style={{
                        background: tk.inputBg,
                        border: `1px solid ${tk.inputBorder}`,
                        color: tk.inputText,
                        paddingRight: "40px",
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowMT5Password(!showMT5Password)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer"
                      style={{ color: tk.textDim }}
                    >
                      {showMT5Password ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {mt5Error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.15)",
                    }}
                  >
                    <AlertTriangle
                      className="w-3.5 h-3.5 flex-shrink-0"
                      style={{ color: "#ef4444" }}
                    />
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: "#ef4444" }}
                    >
                      {mt5Error.replace(/MetaApi[i]?/gi, 'Broker').replace(/metaapi/gi, 'Broker').replace(/meta-api/gi, 'Broker')}
                    </span>
                  </motion.div>
                )}

                {/* Connect Button */}
                <motion.button
                  type="submit"
                  disabled={
                    mt5Connecting ||
                    !mt5Creds.login ||
                    !mt5Creds.password ||
                    !mt5Creds.server
                  }
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 8px 30px rgba(99,102,241,0.25)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl text-[13px] font-black tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2 mt-1 relative overflow-hidden"
                  style={{
                    background: mt5Connecting
                      ? tk.surfaceHover
                      : "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                    color: mt5Connecting ? tk.textDim : "#fff",
                    border: `1px solid ${mt5Connecting ? tk.border : "rgba(99,102,241,0.3)"}`,
                    opacity:
                      !mt5Creds.login || !mt5Creds.password || !mt5Creds.server
                        ? 0.5
                        : 1,
                  }}
                >
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  {mt5Connecting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <Wifi className="w-4 h-4" />
                  )}
                  <span className="relative z-10">
                    {mt5Connecting ? (mt5ConnectStatus || "Connecting...") : "Connect to MT5"}
                  </span>
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MT5 DISCONNECT CONFIRMATION MODAL ═══ */}
      <AnimatePresence>
        {isMT5DisconnectOpen && (
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
              if (e.target === e.currentTarget) setIsMT5DisconnectOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md mx-4 rounded-2xl overflow-hidden relative p-6"
              style={{
                background: tk.isDark ? "radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.06) 0%, rgba(6,10,16,0.98) 60%)" : tk.surfaceElevated,
                border: `1px solid ${tk.isDark ? "rgba(239,68,68,0.15)" : tk.border}`,
                boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
              }}
            >
              <h3 className="text-lg font-black mb-2" style={{ color: tk.textPrimary }}>
                {isRTL ? "تأكيد قطع الاتصال" : "Confirm Disconnect"}
              </h3>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: tk.textSecondary }}>
                {isRTL 
                  ? "هل أنت متأكد أنك تريد فصل الاتصال عن MT5؟ الصفقات التي تعمل حالياً لن تتأثر وستظل شغالة."
                  : "Are you sure you want to disconnect from MT5? Running trades will not be affected and will keep running."}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMT5DisconnectOpen(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold cursor-pointer transition-colors"
                  style={{ background: tk.surfaceHover, color: tk.textPrimary, border: `1px solid ${tk.border}` }}
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    disconnectMT5();
                    setIsMT5DisconnectOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl font-bold cursor-pointer transition-colors flex items-center justify-center gap-2"
                  style={{ background: "#ef4444", color: "#fff", border: "1px solid rgba(239,68,68,0.5)" }}
                >
                  <LogOut className="w-4 h-4" />
                  {isRTL ? "فصل الاتصال" : "Disconnect"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </>
    );
}
