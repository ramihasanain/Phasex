import { AlertCircle, CheckCircle, Eye, EyeOff, KeyRound, Loader2, Lock, X } from "lucide-react";
import { motion } from "motion/react";
import type { NavigateFunction } from "react-router-dom";

export function ResetPasswordPageResetForm({
    isRTL,
    navigate,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    loading,
    error,
    setError,
    accent,
    accentG,
    handleSubmit,
}: {
    isRTL: boolean;
    navigate: NavigateFunction;
    newPassword: string;
    setNewPassword: (v: string) => void;
    confirmPassword: string;
    setConfirmPassword: (v: string) => void;
    showPassword: boolean;
    setShowPassword: (v: boolean) => void;
    loading: boolean;
    error: string | null;
    setError: (v: string | null) => void;
    accent: string;
    accentG: string;
    handleSubmit: (e: React.FormEvent) => void;
}) {
    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                    {isRTL ? "كلمة السر الجديدة" : "New Password"}
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={isRTL ? "أدخل كلمة السر الجديدة" : "Enter new password"}
                        required
                        dir="auto"
                        className="w-full bg-[rgba(255,255,255,0.03)] text-white placeholder:text-gray-600 rounded-xl py-3.5 px-10 pr-12 text-sm font-medium outline-none"
                        style={{ border: `1px solid ${accentG}0.15)` }}
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#4b5563" }} />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                        style={{ color: "#4b5563" }}
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                    {isRTL ? "تأكيد كلمة السر" : "Confirm Password"}
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={isRTL ? "أعد إدخال كلمة السر" : "Re-enter new password"}
                        required
                        dir="auto"
                        className="w-full bg-[rgba(255,255,255,0.03)] text-white placeholder:text-gray-600 rounded-xl py-3.5 px-10 text-sm font-medium outline-none"
                        style={{
                            border: `1px solid ${
                                newPassword && confirmPassword && newPassword !== confirmPassword
                                    ? "rgba(239,68,68,0.4)"
                                    : `${accentG}0.15)`
                            }`,
                        }}
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#4b5563" }} />
                    {newPassword && confirmPassword && newPassword === confirmPassword ? (
                        <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: accent }} />
                    ) : null}
                </div>
            </div>

            {error ? (
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl flex items-center gap-2"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}
                >
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-xs font-bold text-red-400">{error}</p>
                    <button type="button" onClick={() => setError(null)} className="ml-auto text-red-400 cursor-pointer">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </motion.div>
            ) : null}

            <motion.button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl text-[15px] font-black tracking-wider uppercase flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer disabled:opacity-50"
                style={{
                    background: `linear-gradient(135deg, ${accent} 0%, #00c890 100%)`,
                    color: "#060a10",
                    boxShadow: `0 8px 30px ${accentG}0.3), 0 0 40px ${accentG}0.15)`,
                }}
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {isRTL ? "جاري التحديث..." : "Updating..."}
                    </>
                ) : (
                    <>
                        <KeyRound className="w-5 h-5" />
                        {isRTL ? "تعيين كلمة السر الجديدة" : "Set New Password"}
                    </>
                )}
            </motion.button>

            <div className="text-center">
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-[12px] font-bold cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ color: accent }}
                >
                    {isRTL ? "العودة لتسجيل الدخول" : "← Back to Login"}
                </button>
            </div>
        </form>
    );
}
