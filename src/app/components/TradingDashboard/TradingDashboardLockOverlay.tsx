import { motion } from "motion/react";
import { Crown, Lock } from "lucide-react";
import type { TradingDashboardCtx } from "./useTradingDashboard";

export function TradingDashboardLockOverlay({ ctx }: { ctx: TradingDashboardCtx }) {
    const { selectedIndicator, isRTL, setIsSubscriptionOpen } = ctx;
    if (!selectedIndicator?.locked) return null;
    
    const isUpgrade = selectedIndicator.lockType === "upgrade";
    const accentColor = isUpgrade ? "#fb923c" : "#6366f1";
    const accentRgb = isUpgrade ? "251,146,60" : "99,102,241";

    return (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-xl overflow-hidden"
                    style={{
                      background: `radial-gradient(ellipse at 50% 30%, rgba(${accentRgb},0.06) 0%, rgba(6,10,16,0.95) 70%)`,
                      backdropFilter: "blur(16px)",
                      border: `1px solid rgba(${accentRgb},0.12)`,
                    }}
                  >
                    {/* Animated grid background */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: `linear-gradient(rgba(${accentRgb},0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(${accentRgb},0.03) 1px, transparent 1px)`,
                        backgroundSize: "40px 40px",
                      }}
                    />

                    {/* Scan line effect */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(transparent 0%, rgba(${accentRgb},0.03) 50%, transparent 100%)`,
                        backgroundSize: "100% 4px",
                      }}
                      animate={{ backgroundPosition: ["0 0", "0 100%"] }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    {/* Outer orbital ring */}
                    <div
                      className="absolute"
                      style={{ width: "340px", height: "340px" }}
                    >
                      <motion.div
                        className="w-full h-full rounded-full absolute"
                        style={{ border: `1px dashed rgba(${accentRgb},0.15)` }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 30,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </div>
                    {/* Middle orbital ring */}
                    <div
                      className="absolute"
                      style={{ width: "260px", height: "260px" }}
                    >
                      <motion.div
                        className="w-full h-full rounded-full absolute"
                        style={{ border: `1px solid rgba(${accentRgb},0.1)` }}
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </div>

                    {/* Radial glow behind icon */}
                    <motion.div
                      className="absolute rounded-full"
                      style={{
                        width: "200px",
                        height: "200px",
                        background: `radial-gradient(circle, rgba(${accentRgb},0.12) 0%, transparent 70%)`,
                        filter: "blur(30px)",
                      }}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />

                    {/* PHASE-X CORE brand tag */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 relative z-10"
                      style={{
                        background: `rgba(${accentRgb},0.08)`,
                        border: `1px solid rgba(${accentRgb},0.2)`,
                      }}
                    >
                      <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: accentColor,
                          boxShadow: `0 0 8px ${accentColor}`,
                        }}
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span
                        className="text-[10px] font-black tracking-[0.25em] uppercase"
                        style={{ color: accentColor }}
                      >
                        PHASE-X CORE
                      </span>
                    </motion.div>

                    {/* Main icon container with hexagonal feel */}
                    <motion.div
                      animate={{ scale: [1, 1.04, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="relative z-10 w-28 h-28 flex items-center justify-center mb-6"
                    >
                      {/* Spinning border */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          border: `2px solid rgba(${accentRgb},0.25)`,
                          borderTopColor: accentColor,
                          borderBottomColor: "transparent",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      {/* Inner glow box */}
                      <div
                        className="absolute inset-2 rounded-xl"
                        style={{
                          background: `linear-gradient(135deg, rgba(${accentRgb},0.1) 0%, rgba(${accentRgb},0.02) 100%)`,
                          border: `1px solid rgba(${accentRgb},0.15)`,
                        }}
                      />
                      {/* Icon */}
                      {isUpgrade ? (
                        <Crown
                          size={40}
                          style={{
                            color: accentColor,
                            filter: `drop-shadow(0 0 12px rgba(${accentRgb},0.5))`,
                          }}
                          className="relative z-10"
                        />
                      ) : (
                        <Lock
                          size={40}
                          style={{
                            color: accentColor,
                            filter: `drop-shadow(0 0 12px rgba(${accentRgb},0.5))`,
                          }}
                          className="relative z-10"
                        />
                      )}
                    </motion.div>

                    {/* Indicator name */}
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl font-black text-white mb-1 relative z-10 tracking-wide"
                      style={{ textShadow: `0 0 30px rgba(${accentRgb},0.3)` }}
                    >
                      {isRTL
                        ? selectedIndicator.name
                        : selectedIndicator.nameEn}
                    </motion.h3>

                    {/* Status line */}
                    <div className="flex items-center gap-2 mb-5 relative z-10">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: isUpgrade ? "#f97316" : "#94a3b8",
                        }}
                      />
                      <span
                        className="text-[11px] font-bold tracking-widest uppercase"
                        style={{ color: isUpgrade ? "#f97316" : "#94a3b8" }}
                      >
                        {isUpgrade
                          ? isRTL
                            ? "يتطلب ترقية"
                            : "UPGRADE REQUIRED"
                          : isRTL
                            ? "قيد التطوير"
                            : "IN DEVELOPMENT"}
                      </span>
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: isUpgrade ? "#f97316" : "#94a3b8",
                        }}
                      />
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-500 max-w-xs text-center leading-relaxed mb-6 relative z-10 font-medium">
                      {isUpgrade
                        ? isRTL
                          ? "هذا المؤشر متاح فقط للمشتركين المميزين. قم بترقية خطتك للوصول الكامل لجميع أدوات التحليل المتقدمة."
                          : "This indicator is available exclusively for premium subscribers. Upgrade your plan to unlock all advanced analysis tools."
                        : isRTL
                          ? "فريقنا يعمل على تطوير هذا المؤشر المتقدم. سيكون متاحاً قريباً ضمن منظومة Phase-X."
                          : "Our team is developing this advanced indicator. It will be available soon within the Phase-X ecosystem."}
                    </p>

                    {/* Action */}
                    {isUpgrade ? (
                      <motion.button
                        whileHover={{
                          scale: 1.05,
                          boxShadow: `0 15px 40px rgba(${accentRgb},0.4)`,
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="relative z-10 px-8 py-3 rounded-xl text-sm font-black uppercase tracking-[0.2em] cursor-pointer flex items-center gap-2"
                        style={{
                          background: `linear-gradient(135deg, ${accentColor}, #f97316)`,
                          color: "#000",
                          boxShadow: `0 8px 30px rgba(${accentRgb},0.3)`,
                        }}
                      >
                        <motion.div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
                          <motion.div
                            className="absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                            }}
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                              delay: 1,
                            }}
                          />
                        </motion.div>
                        <Crown size={16} />
                        {isRTL ? "ترقية الاشتراك" : "Upgrade Plan"}
                      </motion.button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="relative z-10 flex items-center gap-3 px-6 py-3 rounded-xl"
                        style={{
                          background: `rgba(${accentRgb},0.06)`,
                          border: `1px solid rgba(${accentRgb},0.15)`,
                        }}
                      >
                        <motion.div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            background: accentColor,
                            boxShadow: `0 0 10px ${accentColor}`,
                          }}
                          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span
                          className="text-xs font-black tracking-[0.2em] uppercase"
                          style={{ color: accentColor }}
                        >
                          {isRTL ? "قريباً" : "Coming Soon"}
                        </span>
                      </motion.div>
                    )}

                    {/* Bottom corner branding */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <span
                        className="text-[9px] tracking-[0.4em] uppercase font-semibold"
                        style={{ color: `rgba(${accentRgb},0.25)` }}
                      >
                        PHASE-X · STRUCTURAL DYNAMICS · CORE
                      </span>
                    </div>
                  </motion.div>
    );
}
