import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    ArrowLeft,
    ChevronDown,
    Menu,
    RefreshCw,
    RadioTower,
    User,
    LogOut,
    Wifi,
    WifiOff,
    CreditCard,
    PowerOff,
    X,
} from "lucide-react";

import type { PhaseXCtx } from "./usePhaseXDynamicsPage";
import { PhaseXDynamicsHeaderMobileDrawer } from "./PhaseXDynamicsHeaderMobileDrawer";

export function PhaseXDynamicsHeader({ ctx }: { ctx: PhaseXCtx }) {
    const {
        onBack,
        isLoggedIn,
        mt5Connected,
        mt5Connecting,
        mt5ConnectStatus,
        hasMT5Access,
        stopAllAutoTrades,
        logout,
        isRTL,
        lang,
        t,
        accent,
        setIsLoginPromptOpen,
        setIsSubscriptionOpen,
        setIsMT5DisconnectOpen,
        setIsMT5LoginOpen,
        setIsProfileOpen,
        isNewsOpen,
        setIsNewsOpen,
        langDropdownOpen,
        setLangDropdownOpen,
        dropdownRef,
        languageOptions,
        currentLangObj,
        language,
        setLanguageKey,
    } = ctx;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header
            className="sticky top-0 z-30 border-b backdrop-blur-xl"
            style={{
                background: "rgba(6,10,16,0.88)",
                backdropFilter: "blur(30px) saturate(200%)",
                borderColor: "rgba(255,255,255,0.04)",
            }}
        >
            <div className="max-w-[1700px] mx-auto px-4 sm:px-5">
                <div className="flex items-center justify-between h-14 lg:h-auto lg:min-h-[52px] lg:py-2.5 gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <button
                        type="button"
                        onClick={onBack}
                        className="p-2 rounded-xl hover:bg-white/5 transition-all group shrink-0"
                        aria-label="Back"
                    >
                        <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-300" />
                    </button>
                    <motion.span
                        animate={{ rotate: [0, 8, -8, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="text-lg sm:text-xl font-black shrink-0"
                        style={{ color: accent }}
                    >
                        »
                    </motion.span>
                    <span className="text-[13px] sm:text-[15px] lg:text-[16px] font-bold tracking-wide truncate">
                        <span style={{ color: accent }}>PHASE X</span>
                        <span className="text-gray-700 mx-1 sm:mx-1.5">—</span>
                        <span className="text-gray-500 font-medium hidden sm:inline">{t.title}</span>
                    </span>
                </div>
                <div className="hidden lg:flex items-center gap-1.5 flex-wrap justify-end shrink-0">
                    <div className="flex items-center gap-1.5">
                        {/* MT5 Connection Button */}
                        <motion.button
                            onClick={() => {
                                if (!isLoggedIn) {
                                    setIsLoginPromptOpen(true);
                                    return;
                                }
                                if (!hasMT5Access) {
                                    setIsSubscriptionOpen(true);
                                    return;
                                }
                                mt5Connected ? setIsMT5DisconnectOpen(true) : setIsMT5LoginOpen(true);
                            }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            disabled={mt5Connecting}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer relative overflow-hidden"
                            style={{
                                color: mt5Connecting ? "#facc15" : mt5Connected ? "#10b981" : "#ef4444",
                                background: mt5Connecting
                                    ? "rgba(250,204,21,0.08)"
                                    : mt5Connected
                                      ? "rgba(16,185,129,0.08)"
                                      : "rgba(239,68,68,0.08)",
                                border: `1px solid ${mt5Connecting ? "rgba(250,204,21,0.15)" : mt5Connected ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                                opacity: mt5Connecting ? 0.8 : 1,
                            }}
                        >
                            {mt5Connecting ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <RefreshCw className="w-3 h-3" />
                                </motion.div>
                            ) : mt5Connected ? (
                                <Wifi className="w-3 h-3" />
                            ) : (
                                <WifiOff className="w-3 h-3" />
                            )}
                            <span>
                                {mt5Connecting ? "Connecting..." : mt5Connected ? "MT5 Live" : "MT5"}
                            </span>
                            {mt5Connected && (
                                <motion.div
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ background: "#10b981", boxShadow: "0 0 6px #10b981" }}
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            )}
                        </motion.button>

                        {/* FORCE KILL ALL AUTO Button */}
                        <motion.button
                            onClick={async () => {
                                if (!isLoggedIn) {
                                    setIsLoginPromptOpen(true);
                                    return;
                                }
                                if (
                                    !confirm(
                                        isRTL
                                            ? "تحذير: هل أنت متأكد من إيقاف ومسح جميع صفقات الأوتو في الخلفية لهذا الحساب؟"
                                            : "WARNING: Are you sure you want to FORCE STOP and clear all background Auto Trades for this account?",
                                    )
                                )
                                    return;
                                await stopAllAutoTrades();
                            }}
                            whileHover={{ scale: 1.04, boxShadow: "0 0 15px rgba(239, 68, 68, 0.4)" }}
                            whileTap={{ scale: 0.96 }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer relative overflow-hidden"
                            style={{
                                color: "#ef4444",
                                background: "rgba(239, 68, 68, 0.1)",
                                border: "1px solid rgba(239, 68, 68, 0.3)",
                            }}
                        >
                            <PowerOff className="w-3 h-3 animate-pulse" />
                            <span>{isRTL ? "إغلاق كل الأوتو" : "Kill All Auto"}</span>
                        </motion.button>

                        <motion.button
                            onClick={() => {
                                if (!isLoggedIn) {
                                    setIsLoginPromptOpen(true);
                                    return;
                                }
                                setIsSubscriptionOpen(true);
                            }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer"
                            style={{
                                color: "#9ca3af",
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.05)",
                            }}
                        >
                            <CreditCard className="w-3 h-3" /> Sub
                        </motion.button>

                        <motion.button
                            onClick={() => {
                                if (!isLoggedIn) {
                                    setIsLoginPromptOpen(true);
                                    return;
                                }
                                setIsProfileOpen(true);
                            }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer"
                            style={{
                                color: "#9ca3af",
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.05)",
                            }}
                        >
                            <User className="w-3 h-3" /> Profile
                        </motion.button>

                        {isLoggedIn ? (
                            <motion.button
                                onClick={() => {
                                    logout();
                                    onBack();
                                }}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer"
                                style={{
                                    color: "#9ca3af",
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.05)",
                                }}
                            >
                                <LogOut className="w-3 h-3" /> Logout
                            </motion.button>
                        ) : (
                            <motion.button
                                onClick={() => setIsLoginPromptOpen(true)}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer"
                                style={{
                                    color: "#22d3ee",
                                    background: "rgba(6,182,212,0.08)",
                                    border: "1px solid rgba(6,182,212,0.15)",
                                }}
                            >
                                <LogOut className="w-3 h-3" /> Login
                            </motion.button>
                        )}

                        {/* Language Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <motion.button
                                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer"
                                style={{
                                    color: "#22d3ee",
                                    background: "rgba(6,182,212,0.1)",
                                    border: "1px solid rgba(6,182,212,0.2)",
                                }}
                            >
                                <img
                                    src={`https://flagcdn.com/${currentLangObj.flagUrl}.svg`}
                                    alt={currentLangObj.code}
                                    className="w-4 h-auto rounded-sm object-cover"
                                />
                                <ChevronDown
                                    className={`w-3 h-3 transition-transform duration-300 ${langDropdownOpen ? "rotate-180" : ""}`}
                                />
                            </motion.button>

                            <AnimatePresence>
                                {langDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full mt-2 w-36 rounded-xl shadow-2xl overflow-hidden z-[60] bg-gray-900 border border-white/10"
                                        style={{ right: isRTL ? "auto" : 0, left: isRTL ? 0 : "auto" }}
                                    >
                                        <div className="flex flex-col py-1">
                                            {languageOptions.map((langOpt) => (
                                                <button
                                                    key={langOpt.code}
                                                    onClick={() => {
                                                        setLanguageKey(langOpt.code as any);
                                                        setLangDropdownOpen(false);
                                                    }}
                                                    className={`flex items-center gap-2 px-3 py-2.5 text-xs transition-colors text-left ${language === langOpt.code ? "bg-white/10 text-white font-bold" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"}`}
                                                >
                                                    <img
                                                        src={`https://flagcdn.com/${langOpt.flagUrl}.svg`}
                                                        alt={langOpt.code}
                                                        className="w-5 h-auto rounded-sm object-cover"
                                                    />
                                                    <span>{langOpt.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                        <div className="w-px h-5 bg-white/10" />

                    <motion.button
                        type="button"
                        onClick={() => setIsNewsOpen(!isNewsOpen)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer"
                        style={{
                            color: isNewsOpen ? "#ef4444" : "#9ca3af",
                            background: isNewsOpen ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.03)",
                            border: `1px solid ${isNewsOpen ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.05)"}`,
                        }}
                    >
                        <RadioTower className={`w-3 h-3 ${isNewsOpen ? "animate-pulse" : ""}`} />
                        {lang === "ar"
                            ? "أخبار"
                            : lang === "ru"
                              ? "НОВОСТИ"
                              : lang === "tr"
                                ? "HABER"
                                : "NEWS"}
                    </motion.button>
                </div>

                    <motion.button
                        type="button"
                        onClick={() => setMobileMenuOpen((o) => !o)}
                        className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 shrink-0 cursor-pointer"
                        aria-expanded={mobileMenuOpen}
                        aria-label="Menu"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </motion.button>
                </div>
                <PhaseXDynamicsHeaderMobileDrawer ctx={ctx} open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
            </div>
        </header>
    );
}
