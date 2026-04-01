import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Activity, LogOut, User, Crown, RadioTower,
    Layers, ChevronDown, Wifi, WifiOff, RefreshCw, Menu, X,
} from "lucide-react";
import { themeOptions } from "../../contexts/ThemeContext";
import { Logo } from "../Logo";
import type { TradingDashboardCtx } from "./useTradingDashboard";

export function TradingDashboardHeader({ ctx }: { ctx: TradingDashboardCtx }) {
    const {
        onLogout, onOpenDynamics, tk, isRTL, t, language, setLanguageKey,
        theme, setTheme, currentThemeOption, themeDropdownOpen, setThemeDropdownOpen, themeDropdownRef,
        langDropdownOpen, setLangDropdownOpen, dropdownRef, languageOptions, currentLangObj,
        isSubscriptionOpen, setIsSubscriptionOpen, isNewsOpen, setIsNewsOpen,
        isProfileOpen, setIsProfileOpen, showMarketWatch, setShowMarketWatch,
        mt5Connected, mt5Connecting, mt5ConnectStatus, mt5Account, mt5Error,
        hasMT5Access, setIsMT5SubscribeOpen, setIsMT5LoginOpen, setIsMT5DisconnectOpen,
        subInfo,
    } = ctx;

    const [headerMoreOpen, setHeaderMoreOpen] = useState(false);
    const headerMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!headerMoreOpen) return;
        const close = (e: MouseEvent) => {
            if (headerMoreRef.current && !headerMoreRef.current.contains(e.target as Node)) setHeaderMoreOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [headerMoreOpen]);

    const btnBase =
        "flex items-center rounded-xl cursor-pointer transition-colors font-bold backdrop-blur-sm";
    const btnPad = "gap-1 px-2 py-1 xl:gap-1.5 xl:px-3 xl:py-1.5";
    const btnText = "text-[10px] xl:text-[11px] tracking-wide";
    const btnTextLg = "text-[10px] xl:text-[12px] tracking-wide";
    const iconSm = "w-3 h-3 xl:w-3.5 xl:h-3.5 shrink-0";

    return (
      <header
        className="relative z-40"
        style={{
          background: tk.isDark
            ? "linear-gradient(180deg, rgba(6,10,16,0.95) 0%, rgba(6,10,16,0.85) 100%)"
            : tk.headerBg,
          backdropFilter: tk.isDark ? "blur(20px)" : undefined,
          borderBottom: `1px solid ${tk.isDark ? "rgba(99,102,241,0.08)" : tk.headerBorder}`,
          transition: "background 0.3s, border-color 0.3s",
        }}
      >
        {/* Animated top LED strip — dark only */}
        {tk.isDark && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-[1.5px] z-10"
            style={{
              background:
                "linear-gradient(90deg, transparent, #6366f1 30%, #a855f7 50%, #6366f1 70%, transparent)",
            }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}

        {/* Subtle animated scan line — dark only */}
        {tk.isDark && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(99,102,241,0.03), transparent)",
              width: "30%",
            }}
            animate={{ x: ["-100%", "400%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Grid pattern — dark only */}
        {tk.isDark && (
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(99,102,241,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.015) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        )}

        <div className="flex items-center justify-between px-3 py-2 xl:px-5 xl:py-2.5 relative z-10 gap-2 min-w-0">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 xl:gap-3 shrink-0 min-w-0"
          >
            <Logo size="sm" showText={false} animated={false} />
          </motion.div>

          {/* Actions — md+ inline (compact below xl) */}
          <div className="hidden md:flex items-center gap-1 xl:gap-2 flex-wrap justify-end min-w-0">
            {/* Structure Dynamics Link */}
            <motion.button
              onClick={onOpenDynamics}
              whileHover={{
                scale: 1.04,
                boxShadow: tk.isDark ? "0 4px 15px rgba(99,102,241,0.15)" : "0 4px 15px rgba(79,70,229,0.2)",
              }}
              whileTap={{ scale: 0.96 }}
              className={`${btnBase} ${btnPad} ${btnText} uppercase whitespace-nowrap`}
              style={{
                color: tk.textPrimary,
                background: tk.isDark ? "rgba(99,102,241,0.08)" : "rgba(79,70,229,0.1)",
                border: `1px solid ${tk.isDark ? "rgba(99,102,241,0.2)" : "rgba(79,70,229,0.3)"}`,
                backdropFilter: tk.isDark ? "blur(8px)" : undefined,
              }}
            >
              <Layers className={`${iconSm} flex-shrink-0 drop-shadow-sm`} style={{ color: tk.isDark ? "#818cf8" : "#4f46e5" }} />
              <span className="drop-shadow-sm max-xl:truncate max-w-[7rem] xl:max-w-none">{isRTL ? "S. داينمك" : "S. DYNAMIC"}</span>
            </motion.button>

            {/* Market Watch Link */}
            <motion.button
              type="button"
              onClick={() => setShowMarketWatch(true)}
              whileHover={{
                scale: 1.04,
                boxShadow: tk.isDark ? "0 4px 15px rgba(251,191,36,0.15)" : "0 4px 15px rgba(245,158,11,0.2)",
              }}
              whileTap={{ scale: 0.96 }}
              className={`${btnBase} ${btnPad} ${btnTextLg}`}
              style={{
                color: tk.textPrimary,
                background: tk.isDark ? "rgba(251,191,36,0.08)" : "rgba(245,158,11,0.1)",
                border: `1px solid ${tk.isDark ? "rgba(251,191,36,0.2)" : "rgba(245,158,11,0.3)"}`,
                backdropFilter: tk.isDark ? "blur(8px)" : undefined,
              }}
            >
              <Activity className={`${iconSm} drop-shadow-sm`} style={{ color: tk.isDark ? "#fcd34d" : "#d97706" }} />
              <span className="drop-shadow-sm max-xl:hidden">MARKET WATCH</span>
              <span className="drop-shadow-sm xl:hidden uppercase">MW</span>
            </motion.button>

            {/* MT5 Account Details */}
            <AnimatePresence>
              {mt5Connected && mt5Account && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="hidden md:flex items-center gap-2 xl:gap-4 px-2 py-1 xl:px-4 xl:py-1.5 rounded-xl relative overflow-hidden"
                  style={{
                    background: tk.isDark ? "linear-gradient(90deg, rgba(16,185,129,0.04), rgba(99,102,241,0.04))" : "linear-gradient(90deg, rgba(16,185,129,0.08), rgba(99,102,241,0.08))",
                    border: `1px solid ${tk.isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.25)"}`,
                    boxShadow: tk.isDark ? "inset 0 0 20px rgba(16,185,129,0.02)" : "0 2px 10px rgba(0,0,0,0.02)",
                    backdropFilter: tk.isDark ? "blur(12px)" : undefined,
                  }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                      width: "50%",
                    }}
                    animate={{ x: ["-200%", "400%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  />

                  <div className="flex flex-col relative z-10 pr-1 text-right">
                    <span className="text-[8px] font-black uppercase tracking-widest line-clamp-1 max-w-[120px]" style={{ color: tk.textDim }}>
                      {mt5Account.server || mt5Account.name || "Broker"}
                    </span>
                    <span className="text-[10px] font-black tabular-nums tracking-tight" style={{ color: tk.textPrimary }}>
                      {mt5Account.login}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MT5 Connection Button */}
            <motion.button
              onClick={() => {
                if (!hasMT5Access) {
                  setIsMT5SubscribeOpen(true);
                  return;
                }
                mt5Connected ? setIsMT5DisconnectOpen(true) : setIsMT5LoginOpen(true);
              }}
              whileHover={{
                scale: 1.04,
                boxShadow: mt5Connected
                  ? "0 4px 15px rgba(16,185,129,0.15)"
                  : "0 4px 15px rgba(239,68,68,0.15)",
              }}
              whileTap={{ scale: 0.96 }}
              disabled={mt5Connecting}
              className={`${btnBase} ${btnPad} ${btnTextLg} relative overflow-hidden`}
              style={{
                color: mt5Connecting
                  ? tk.warning
                  : mt5Connected
                    ? "#10b981"
                    : "#ef4444",
                background: mt5Connecting
                  ? tk.warningBg
                  : mt5Connected
                    ? "rgba(16,185,129,0.08)"
                    : "rgba(239,68,68,0.08)",
                border: `1px solid ${mt5Connecting ? "rgba(250,204,21,0.15)" : mt5Connected ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                backdropFilter: tk.isDark ? "blur(8px)" : undefined,
                opacity: mt5Connecting ? 0.8 : 1,
              }}
            >
              {mt5Connecting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className={iconSm} />
                </motion.div>
              ) : mt5Connected ? (
                <Wifi className={iconSm} />
              ) : (
                <WifiOff className={iconSm} />
              )}
              <span className="max-xl:hidden">
                {mt5Connecting
                  ? (mt5ConnectStatus || "Connecting...")
                  : mt5Connected
                    ? "MT5 Live"
                    : "MT5 Connect"}
              </span>
              <span className="xl:hidden uppercase text-[9px]">{mt5Connecting ? "…" : mt5Connected ? "Live" : "Conn"}</span>
              {mt5Connected && (
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "#10b981",
                    boxShadow: "0 0 6px #10b981",
                  }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setIsNewsOpen(!isNewsOpen)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              aria-label={t("breakingNews")}
              className={`${btnBase} ${btnPad} ${btnTextLg}`}
              style={{
                color: isNewsOpen ? tk.negative : tk.textMuted,
                background: isNewsOpen ? tk.negativeBg : tk.buttonGhost,
                border: `1px solid ${isNewsOpen ? tk.negativeBorder : tk.buttonGhostBorder}`,
                backdropFilter: tk.isDark ? "blur(8px)" : undefined,
              }}
            >
              <RadioTower
                className={`${iconSm} ${isNewsOpen ? "animate-pulse" : ""}`}
              />
              <span className="max-xl:hidden">{t("breakingNews")}</span>
            </motion.button>

            <motion.button
              onClick={() => setIsProfileOpen(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`${btnBase} ${btnPad} ${btnTextLg}`}
              style={{
                color: tk.textMuted,
                background: tk.buttonGhost,
                border: `1px solid ${tk.buttonGhostBorder}`,
                backdropFilter: tk.isDark ? "blur(8px)" : undefined,
              }}
            >
              <User className={iconSm} /> <span className="max-xl:hidden">{t("userProfile") || "Profile"}</span>
            </motion.button>

            <motion.button
              onClick={onLogout}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`${btnBase} ${btnPad} ${btnTextLg}`}
              style={{
                color: tk.textMuted,
                background: tk.buttonGhost,
                border: `1px solid ${tk.buttonGhostBorder}`,
                backdropFilter: tk.isDark ? "blur(8px)" : undefined,
              }}
            >
              <LogOut className={iconSm} /> <span className="max-xl:hidden">{t("logout")}</span>
            </motion.button>

            {/* Theme Mode Dropdown */}
            <div className="relative" ref={themeDropdownRef}>
              <motion.button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                className="w-7 h-7 xl:w-8 xl:h-8 rounded-xl flex items-center justify-center cursor-pointer text-sm xl:text-[16px]"
                style={{
                  background: tk.buttonGhost,
                  border: `1px solid ${tk.buttonGhostBorder}`,
                }}
              >
                {currentThemeOption.icon}
              </motion.button>
              <AnimatePresence>
                {themeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 w-36 rounded-xl shadow-2xl overflow-hidden z-[60]"
                    style={{
                      background: tk.isDark
                        ? "rgba(6,10,16,0.95)"
                        : tk.surfaceElevated,
                      border: `1px solid ${tk.isDark ? "rgba(99,102,241,0.12)" : tk.border}`,
                      backdropFilter: tk.isDark ? "blur(20px)" : undefined,
                      right: isRTL ? "auto" : 0,
                      left: isRTL ? 0 : "auto",
                    }}
                  >
                    <div className="py-1 flex flex-col">
                      {themeOptions.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => {
                            setTheme(opt.key);
                            setThemeDropdownOpen(false);
                          }}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors text-start cursor-pointer"
                          style={{
                            color: theme === opt.key ? tk.info : tk.textMuted,
                            background:
                              theme === opt.key ? tk.infoBg : "transparent",
                          }}
                        >
                          <span className="text-[16px]">{opt.icon}</span>
                          <span
                            className={theme === opt.key ? "font-bold" : ""}
                          >
                            {isRTL ? opt.labelAr : opt.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language Dropdown */}
            <div className="relative me-2 xl:me-3 z-50" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 px-2 py-1 xl:gap-1.5 xl:px-3 xl:py-1.5 rounded-xl text-[10px] xl:text-[11px] font-black tracking-widest transition-colors cursor-pointer"
                style={{
                  color: tk.buttonGhostText,
                  border: `1px solid ${tk.buttonGhostBorder}`,
                  backgroundColor: tk.buttonGhost,
                }}
              >
                <img
                  src={`https://flagcdn.com/${currentLangObj.flagUrl}.svg`}
                  alt={currentLangObj.code}
                  className="w-4 h-auto xl:w-5 rounded-sm object-cover"
                />
                <span className="uppercase max-xl:hidden">{currentLangObj.code}</span>
                <ChevronDown
                  className={`w-2.5 h-2.5 xl:w-3 xl:h-3 transition-transform duration-300 shrink-0 ${langDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 w-36 rounded-xl shadow-2xl overflow-hidden z-[60]"
                    style={{
                      background: tk.isDark
                        ? "rgba(6,10,16,0.95)"
                        : tk.surfaceElevated,
                      border: `1px solid ${tk.isDark ? "rgba(99,102,241,0.12)" : tk.border}`,
                      backdropFilter: tk.isDark ? "blur(20px)" : undefined,
                      right: isRTL ? "auto" : 0,
                      left: isRTL ? 0 : "auto",
                    }}
                  >
                    <div className="py-1 flex flex-col">
                      {languageOptions.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguageKey(lang.code as any);
                            setLangDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-xs transition-colors text-start"
                          style={{
                            color:
                              language === lang.code ? tk.info : tk.textMuted,
                            background:
                              language === lang.code
                                ? tk.infoBg
                                : "transparent",
                          }}
                        >
                          <img
                            src={`https://flagcdn.com/${lang.flagUrl}.svg`}
                            alt={lang.code}
                            className="w-5 h-auto rounded-sm object-cover"
                          />
                          <span
                            className={
                              language === lang.code ? "font-bold" : ""
                            }
                          >
                            {lang.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="button"
              onClick={() => setIsSubscriptionOpen(true)}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 6px 25px rgba(250,204,21,0.15)",
              }}
              whileTap={{ scale: 0.96 }}
              aria-label={`${t("subscription")} — ${subInfo.daysRemaining} ${t("daysRemaining")}`}
              className={`${btnBase} gap-1 px-2 py-1 xl:gap-1.5 xl:px-3.5 xl:py-1.5 ${btnTextLg} font-black relative overflow-hidden`}
              style={{
                color: tk.warning,
                background: tk.warningBg,
                border: `1px solid ${tk.isDark ? "rgba(250,204,21,0.15)" : "rgba(217,119,6,0.2)"}`,
                boxShadow: tk.isDark
                  ? "0 0 20px rgba(250,204,21,0.03)"
                  : "none",
              }}
            >
              {/* Shimmer on subscription button */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${tk.isDark ? "rgba(250,204,21,0.06)" : "rgba(217,119,6,0.06)"}, transparent)`,
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <Crown className="w-3.5 h-3.5 xl:w-4 xl:h-4 relative z-10 shrink-0" />
              <span className="tracking-wide relative z-10 max-xl:hidden">
                {t("subscription")}
              </span>
              <span
                className="text-[8px] xl:text-[10px] font-black px-1.5 py-0.5 xl:px-2 xl:ml-1 rounded-lg relative z-10 whitespace-nowrap"
                style={{
                  background: tk.warningBg,
                  color: tk.warning,
                  border: `1px solid ${tk.isDark ? "rgba(250,204,21,0.15)" : "rgba(217,119,6,0.15)"}`,
                }}
              >
                <span className="xl:hidden">{subInfo.daysRemaining}d</span>
                <span className="hidden xl:inline">{subInfo.daysRemaining} {t("daysRemaining")}</span>
              </span>
            </motion.button>
          </div>

          {/* Narrow screens: menu button + overflow panel */}
          <div className="md:hidden relative flex items-center gap-1.5 shrink-0" ref={headerMoreRef}>
            <motion.button
              type="button"
              onClick={() => setHeaderMoreOpen((o) => !o)}
              whileTap={{ scale: 0.96 }}
              aria-expanded={headerMoreOpen}
              aria-label={isRTL ? "قائمة التنقل" : "Open menu"}
              className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer"
              style={{
                background: tk.buttonGhost,
                border: `1px solid ${tk.buttonGhostBorder}`,
                color: tk.textPrimary,
              }}
            >
              {headerMoreOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
            <AnimatePresence>
              {headerMoreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute end-0 top-full mt-2 w-[min(calc(100vw-1.5rem),18rem)] max-h-[min(70vh,28rem)] overflow-y-auto rounded-xl shadow-2xl z-[60] py-2 flex flex-col gap-0.5"
                  style={{
                    background: tk.isDark ? "rgba(6,10,16,0.97)" : tk.surfaceElevated,
                    border: `1px solid ${tk.isDark ? "rgba(99,102,241,0.15)" : tk.border}`,
                    backdropFilter: tk.isDark ? "blur(20px)" : undefined,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => { onOpenDynamics(); setHeaderMoreOpen(false); }}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-start text-xs font-bold cursor-pointer w-full"
                    style={{ color: tk.textPrimary }}
                  >
                    <Layers className="w-4 h-4 shrink-0" style={{ color: tk.isDark ? "#818cf8" : "#4f46e5" }} />
                    {isRTL ? "S. داينمك" : "S. DYNAMIC"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowMarketWatch(true); setHeaderMoreOpen(false); }}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-start text-xs font-bold cursor-pointer w-full"
                    style={{ color: tk.textPrimary }}
                  >
                    <Activity className="w-4 h-4 shrink-0" style={{ color: tk.isDark ? "#fcd34d" : "#d97706" }} />
                    MARKET WATCH
                  </button>
                  {mt5Connected && mt5Account && (
                    <div className="px-3 py-2 mx-2 rounded-lg text-[10px]" style={{ background: tk.infoBg, color: tk.textMuted }}>
                      <div className="font-black uppercase tracking-wide truncate">{mt5Account.server || mt5Account.name || "Broker"}</div>
                      <div className="font-mono font-bold tabular-nums" style={{ color: tk.textPrimary }}>{mt5Account.login}</div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (!hasMT5Access) setIsMT5SubscribeOpen(true);
                      else mt5Connected ? setIsMT5DisconnectOpen(true) : setIsMT5LoginOpen(true);
                      setHeaderMoreOpen(false);
                    }}
                    disabled={mt5Connecting}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-start text-xs font-bold cursor-pointer w-full disabled:opacity-60"
                    style={{ color: mt5Connected ? "#10b981" : "#ef4444" }}
                  >
                    {mt5Connecting ? <RefreshCw className="w-4 h-4 animate-spin shrink-0" /> : mt5Connected ? <Wifi className="w-4 h-4 shrink-0" /> : <WifiOff className="w-4 h-4 shrink-0" />}
                    {mt5Connecting ? (mt5ConnectStatus || "Connecting...") : mt5Connected ? "MT5 Live" : "MT5 Connect"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsNewsOpen(!isNewsOpen); setHeaderMoreOpen(false); }}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-start text-xs font-bold cursor-pointer w-full"
                    style={{ color: isNewsOpen ? tk.negative : tk.textMuted }}
                  >
                    <RadioTower className={`w-4 h-4 shrink-0 ${isNewsOpen ? "animate-pulse" : ""}`} />
                    {t("breakingNews")}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsProfileOpen(true); setHeaderMoreOpen(false); }}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-start text-xs font-bold cursor-pointer w-full"
                    style={{ color: tk.textMuted }}
                  >
                    <User className="w-4 h-4 shrink-0" />
                    {t("userProfile") || "Profile"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { onLogout(); setHeaderMoreOpen(false); }}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-start text-xs font-bold cursor-pointer w-full"
                    style={{ color: tk.textMuted }}
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    {t("logout")}
                  </button>
                  <div className="border-t my-1 mx-2" style={{ borderColor: tk.border }} />
                  <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider" style={{ color: tk.textDim }}>{isRTL ? "المظهر" : "Theme"}</div>
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => { setTheme(opt.key); setHeaderMoreOpen(false); }}
                      className="flex items-center gap-2.5 px-3 py-2 text-start text-xs cursor-pointer w-full"
                      style={{
                        color: theme === opt.key ? tk.info : tk.textMuted,
                        background: theme === opt.key ? tk.infoBg : "transparent",
                      }}
                    >
                      <span className="text-base">{opt.icon}</span>
                      {isRTL ? opt.labelAr : opt.label}
                    </button>
                  ))}
                  <div className="border-t my-1 mx-2" style={{ borderColor: tk.border }} />
                  <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider" style={{ color: tk.textDim }}>{isRTL ? "اللغة" : "Language"}</div>
                  {languageOptions.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => { setLanguageKey(lang.code as any); setHeaderMoreOpen(false); }}
                      className="flex items-center gap-2.5 px-3 py-2 text-start text-xs cursor-pointer w-full"
                      style={{
                        color: language === lang.code ? tk.info : tk.textMuted,
                        background: language === lang.code ? tk.infoBg : "transparent",
                      }}
                    >
                      <img src={`https://flagcdn.com/${lang.flagUrl}.svg`} alt="" className="w-5 h-auto rounded-sm" />
                      {lang.label}
                    </button>
                  ))}
                  <div className="border-t my-1 mx-2" style={{ borderColor: tk.border }} />
                  <button
                    type="button"
                    onClick={() => { setIsSubscriptionOpen(true); setHeaderMoreOpen(false); }}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-start text-xs font-black cursor-pointer mb-2 mx-2 rounded-lg shrink-0"
                    style={{ color: tk.warning, background: tk.warningBg, border: `1px solid ${tk.isDark ? "rgba(250,204,21,0.2)" : "rgba(217,119,6,0.25)"}` }}
                  >
                    <Crown className="w-4 h-4 shrink-0" />
                    <span>{t("subscription")}</span>
                    <span className="ms-auto text-[10px] px-2 py-0.5 rounded-md font-black" style={{ background: tk.warningBg, border: `1px solid ${tk.isDark ? "rgba(250,204,21,0.2)" : "rgba(217,119,6,0.2)"}` }}>
                      {subInfo.daysRemaining} {t("daysRemaining")}
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    );
}
