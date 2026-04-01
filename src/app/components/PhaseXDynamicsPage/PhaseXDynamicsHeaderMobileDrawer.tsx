import { AnimatePresence, motion } from "motion/react";
import type { PhaseXCtx } from "./usePhaseXDynamicsPage";

export function PhaseXDynamicsHeaderMobileDrawer({
    ctx,
    open,
    onClose,
}: {
    ctx: PhaseXCtx;
    open: boolean;
    onClose: () => void;
}) {
    const {
        isLoggedIn,
        mt5Connected,
        mt5Connecting,
        hasMT5Access,
        stopAllAutoTrades,
        logout,
        onBack,
        isRTL,
        lang,
        accent,
        setIsLoginPromptOpen,
        setIsSubscriptionOpen,
        setIsMT5DisconnectOpen,
        setIsMT5LoginOpen,
        setIsProfileOpen,
        isNewsOpen,
        setIsNewsOpen,
        languageOptions,
        language,
        setLanguageKey,
    } = ctx;

    const newsLabel =
        lang === "ar" ? "أخبار" : lang === "ru" ? "НОВОСТИ" : lang === "tr" ? "HABER" : "NEWS";

    const rowBtn =
        "w-full text-left py-2.5 px-4 rounded-lg text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 border border-white/5";

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="lg:hidden overflow-hidden border-t border-white/5"
                >
                    <div className="py-3 space-y-1">
                        <button
                            type="button"
                            className={rowBtn}
                            style={{ color: mt5Connecting ? "#facc15" : mt5Connected ? "#10b981" : "#ef4444", background: "rgba(255,255,255,0.02)" }}
                            onClick={() => {
                                onClose();
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
                        >
                            {mt5Connecting ? "MT5…" : mt5Connected ? "MT5 Live" : "MT5"}
                        </button>
                        <button
                            type="button"
                            className={rowBtn + " text-red-400"}
                            style={{ background: "rgba(239,68,68,0.06)" }}
                            onClick={() => {
                                onClose();
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
                                void stopAllAutoTrades();
                            }}
                        >
                            {isRTL ? "إغلاق كل الأوتو" : "Kill All Auto"}
                        </button>
                        <button
                            type="button"
                            className={rowBtn + " text-gray-300"}
                            style={{ background: "rgba(255,255,255,0.02)" }}
                            onClick={() => {
                                onClose();
                                if (!isLoggedIn) setIsLoginPromptOpen(true);
                                else setIsSubscriptionOpen(true);
                            }}
                        >
                            Sub
                        </button>
                        <button
                            type="button"
                            className={rowBtn + " text-gray-300"}
                            style={{ background: "rgba(255,255,255,0.02)" }}
                            onClick={() => {
                                onClose();
                                if (!isLoggedIn) setIsLoginPromptOpen(true);
                                else setIsProfileOpen(true);
                            }}
                        >
                            Profile
                        </button>
                        {isLoggedIn ? (
                            <button
                                type="button"
                                className={rowBtn + " text-gray-300"}
                                style={{ background: "rgba(255,255,255,0.02)" }}
                                onClick={() => {
                                    onClose();
                                    logout();
                                    onBack();
                                }}
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                type="button"
                                className={rowBtn}
                                style={{ color: "#22d3ee", background: "rgba(6,182,212,0.08)", borderColor: "rgba(6,182,212,0.15)" }}
                                onClick={() => {
                                    onClose();
                                    setIsLoginPromptOpen(true);
                                }}
                            >
                                Login
                            </button>
                        )}
                        <div className="pt-2 border-t border-white/5">
                            <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Language</p>
                            <div className="flex flex-wrap gap-2 px-2">
                                {languageOptions.map((langOpt) => (
                                    <button
                                        key={langOpt.code}
                                        type="button"
                                        onClick={() => {
                                            setLanguageKey(langOpt.code as any);
                                            onClose();
                                        }}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                                            language === langOpt.code ? "bg-white/10 text-white font-bold" : "text-gray-400 hover:bg-white/5"
                                        }`}
                                        style={{
                                            border:
                                                language === langOpt.code ? `1px solid ${accent}40` : "1px solid rgba(255,255,255,0.05)",
                                        }}
                                    >
                                        <img src={`https://flagcdn.com/${langOpt.flagUrl}.svg`} alt="" className="w-4 h-auto rounded-sm" />
                                        <span>{langOpt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="pt-2 border-t border-white/5 px-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsNewsOpen(!isNewsOpen);
                                    onClose();
                                }}
                                className="w-full py-2.5 rounded-lg text-sm font-bold cursor-pointer"
                                style={{
                                    color: isNewsOpen ? "#ef4444" : "#9ca3af",
                                    background: isNewsOpen ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.03)",
                                    border: `1px solid ${isNewsOpen ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.06)"}`,
                                }}
                            >
                                {newsLabel}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
