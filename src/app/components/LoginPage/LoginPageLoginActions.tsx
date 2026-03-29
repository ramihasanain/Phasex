import { motion } from "motion/react";
import { AlertCircle, ArrowRight, Loader2, X, Zap } from "lucide-react";

interface LoginPageLoginActionsProps {
    accent: string;
    accentG: string;
    isRTL: boolean;
    t: (key: string) => string;
    apiError: string | null;
    setApiError: (v: string | null) => void;
    apiLoading: boolean;
    agreedToTerms: boolean;
    setAgreedToTerms: (v: boolean) => void;
    setTermsOpen: (v: boolean) => void;
    onRegister: () => void;
}

export function LoginPageLoginActions({
    accent,
    accentG,
    isRTL,
    t,
    apiError,
    setApiError,
    apiLoading,
    agreedToTerms,
    setAgreedToTerms,
    setTermsOpen,
    onRegister,
}: LoginPageLoginActionsProps) {
    return (
        <>
            {apiError ? (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl flex items-center gap-3"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}
                >
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-xs font-bold text-red-400">{apiError}</p>
                    <button type="button" onClick={() => setApiError(null)} className="ml-auto text-red-400 hover:text-red-300 cursor-pointer">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </motion.div>
            ) : null}

            <motion.button
                type="submit"
                disabled={apiLoading}
                className="w-full py-4 rounded-xl text-[15px] font-black tracking-wider uppercase flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer disabled:opacity-60"
                style={{
                    background: `linear-gradient(135deg, ${accent} 0%, #00c890 100%)`,
                    color: "#060a10",
                    boxShadow: `0 8px 30px ${accentG}0.3), 0 0 40px ${accentG}0.15)`,
                }}
                whileHover={!apiLoading ? { scale: 1.02, boxShadow: `0 12px 40px ${accentG}0.4), 0 0 60px ${accentG}0.2)` } : {}}
                whileTap={!apiLoading ? { scale: 0.98 } : {}}
            >
                {apiLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {isRTL ? "جاري الدخول..." : "Logging in..."}
                    </>
                ) : (
                    <>
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
                            animate={{ left: ["-100%", "200%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                        />
                        <Zap className="w-5 h-5" />
                        {t("loginWrap")}
                        <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                    </>
                )}
            </motion.button>

            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full" style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${accentG}0.15), transparent)` }} />
                </div>
                <div className="relative flex justify-center">
                    <span className="px-4 text-[10px] font-bold text-gray-600 tracking-[0.2em] uppercase" style={{ background: "rgba(10,14,24,1)" }}>
                        {t("orTxt")}
                    </span>
                </div>
            </div>

            <div className="flex items-start gap-3 py-1">
                <motion.button
                    type="button"
                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                    className="flex-shrink-0 w-5 h-5 rounded-md mt-0.5 flex items-center justify-center cursor-pointer transition-all"
                    style={{
                        background: agreedToTerms ? accent : "rgba(255,255,255,0.03)",
                        border: `1.5px solid ${agreedToTerms ? accent : "rgba(255,255,255,0.12)"}`,
                        boxShadow: agreedToTerms ? `0 0 12px ${accentG}0.3)` : "none",
                    }}
                    whileTap={{ scale: 0.85 }}
                >
                    {agreedToTerms ? (
                        <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="#060a10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                    ) : null}
                </motion.button>
                <p className="text-[12px] text-gray-400 leading-relaxed">
                    {t("iAgreeTo")}
                    <button type="button" onClick={() => setTermsOpen(true)} className="font-bold underline cursor-pointer hover:opacity-80 transition-opacity" style={{ color: accent }}>
                        {t("termsAndCondTxt")}
                    </button>
                    {t("ofPlatformTxt")}
                </p>
            </div>

            <motion.button
                type="button"
                onClick={onRegister}
                className="w-full py-4 rounded-xl text-[14px] font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                style={{
                    background: agreedToTerms ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)",
                    color: agreedToTerms ? accent : "rgba(255,255,255,0.2)",
                    border: `1px solid ${agreedToTerms ? `${accentG}0.15)` : "rgba(255,255,255,0.04)"}`,
                    pointerEvents: agreedToTerms ? "auto" : "none",
                    opacity: agreedToTerms ? 1 : 0.4,
                }}
                whileHover={agreedToTerms ? { background: `${accentG}0.06)`, borderColor: `${accentG}0.3)`, scale: 1.02 } : {}}
                whileTap={agreedToTerms ? { scale: 0.98 } : {}}
            >
                {t("createNewAcc")}
            </motion.button>
        </>
    );
}
