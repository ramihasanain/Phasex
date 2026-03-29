import { motion } from "motion/react";
import { AlertCircle, ArrowRight, KeyRound, Loader2, Mail, X } from "lucide-react";
import { LoginPageForgotSuccessPanel } from "./LoginPageForgotSuccessPanel";

interface LoginPageForgotPasswordModalProps {
    accent: string;
    accentG: string;
    isRTL: boolean;
    resetEmail: string;
    setResetEmail: (v: string) => void;
    resetLoading: boolean;
    resetSuccess: boolean;
    resetError: string | null;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function LoginPageForgotPasswordModal({
    accent,
    accentG,
    isRTL,
    resetEmail,
    setResetEmail,
    resetLoading,
    resetSuccess,
    resetError,
    onClose,
    onSubmit,
}: LoginPageForgotPasswordModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            onClick={onClose}
            role="presentation"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md mx-4 rounded-2xl overflow-hidden relative"
                style={{
                    background: "linear-gradient(135deg, #0a0e18 0%, #0d1225 50%, #0a0f1a 100%)",
                    border: `1px solid ${accentG}0.15)`,
                    boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 40px ${accentG}0.08)`,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{
                        background: `linear-gradient(90deg, transparent 5%, ${accent} 30%, ${accent} 70%, transparent 95%)`,
                        opacity: 0.6,
                    }}
                />

                <div className="px-8 py-8">
                    <button type="button" onClick={onClose} className="absolute top-4 right-4 cursor-pointer" style={{ color: "#6b7280" }}>
                        <X className="w-5 h-5" />
                    </button>

                    {resetSuccess ? (
                        <LoginPageForgotSuccessPanel accent={accent} accentG={accentG} isRTL={isRTL} resetEmail={resetEmail} onClose={onClose} />
                    ) : (
                        <>
                            <div className="flex items-center gap-3 mb-6">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: `${accentG}0.1)`, border: `1px solid ${accentG}0.2)` }}
                                >
                                    <KeyRound className="w-5 h-5" style={{ color: accent }} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black" style={{ color: accent }}>
                                        {isRTL ? "نسيت كلمة السر؟" : "Forgot Password?"}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {isRTL ? "أدخل إيميلك وسنرسل لك رابط إعادة التعيين" : "Enter your email and we'll send you a reset link"}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={onSubmit} className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        placeholder={isRTL ? "أدخل بريدك الإلكتروني" : "Enter your email address"}
                                        required
                                        dir="auto"
                                        className="w-full bg-[rgba(255,255,255,0.03)] text-white placeholder:text-gray-600 rounded-xl py-3.5 px-10 text-sm font-medium outline-none"
                                        style={{ border: `1px solid ${accentG}0.15)` }}
                                    />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#4b5563" }} />
                                </div>

                                {resetError ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 rounded-xl flex items-center gap-2"
                                        style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}
                                    >
                                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                        <p className="text-xs font-bold text-red-400">{resetError}</p>
                                    </motion.div>
                                ) : null}

                                <motion.button
                                    type="submit"
                                    disabled={resetLoading || !resetEmail}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3.5 rounded-xl text-sm font-black tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                    style={{
                                        background: `linear-gradient(135deg, ${accent} 0%, #00c890 100%)`,
                                        color: "#060a10",
                                        boxShadow: `0 6px 25px ${accentG}0.25)`,
                                    }}
                                >
                                    {resetLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            {isRTL ? "جاري الإرسال..." : "Sending..."}
                                        </>
                                    ) : (
                                        <>
                                            {isRTL ? "إرسال رابط إعادة التعيين" : "Send Reset Link"}
                                            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
