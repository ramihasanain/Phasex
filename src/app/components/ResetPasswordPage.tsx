import { useState, useMemo } from "react";
import { Lock, ArrowRight, Loader2, AlertCircle, CheckCircle, KeyRound, X, Eye, EyeOff } from "lucide-react";
import { Logo } from "./Logo";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "motion/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmPasswordReset } from "../api/authApi";
import { useThemeTokens } from "../hooks/useThemeTokens";

export function ResetPasswordPage() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tk = useThemeTokens();

  const uid = searchParams.get("uid") || "";
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const accent = "#00e5a0";
  const accentG = "rgba(0,229,160,";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      setError(isRTL ? "كلمتا المرور غير متطابقتين" : "Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError(isRTL ? "كلمة المرور قصيرة جداً (6 أحرف على الأقل)" : "Password too short (min 6 characters)");
      return;
    }
    if (!uid || !token) {
      setError(isRTL ? "رابط إعادة التعيين غير صالح" : "Invalid reset link. Please request a new one.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await confirmPasswordReset(uid, token, newPassword);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || (isRTL ? "فشل إعادة تعيين كلمة المرور" : "Failed to reset password."));
    } finally {
      setLoading(false);
    }
  };

  // Floating particles
  const particles = useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: 3 + Math.random() * 6,
    delay: Math.random() * 5,
    driftX: (Math.random() - 0.5) * 60,
    driftY: -(20 + Math.random() * 50),
  })), []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      dir="auto"
      style={{ background: "#060a10", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute w-[600px] h-[600px] rounded-full"
          style={{ top: "-20%", left: "-10%", background: `radial-gradient(circle, ${accentG}0.08) 0%, transparent 70%)`, filter: "blur(60px)" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute w-[500px] h-[500px] rounded-full"
          style={{ bottom: "-15%", right: "-5%", background: `radial-gradient(circle, ${accentG}0.06) 0%, transparent 70%)`, filter: "blur(50px)" }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
      </div>

      {/* Particles */}
      {particles.map(p => (
        <motion.div key={p.id} className="absolute rounded-full pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, backgroundColor: accent, opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0], x: p.driftX, y: p.driftY }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeOut" }} />
      ))}

      <motion.div className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>

        <div className="relative rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(10,14,24,0.95), rgba(15,20,35,0.98))",
            border: `1px solid ${accentG}0.12)`,
            boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 80px ${accentG}0.06)`,
            backdropFilter: "blur(20px)",
          }}>

          {/* Top LED */}
          <motion.div className="absolute top-0 left-0 right-0 h-[2px] z-30"
            style={{ background: `linear-gradient(90deg, transparent 5%, ${accent} 30%, ${accent} 70%, transparent 95%)` }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }} />

          <div className="px-8 py-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div className="flex justify-center mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}>
                <div className="relative">
                  <Logo className="w-16 h-16 relative z-10" />
                  <motion.div className="absolute inset-0 rounded-full"
                    style={{ background: `radial-gradient(circle, ${accentG}0.2) 0%, transparent 70%)`, filter: "blur(12px)" }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity }} />
                </div>
              </motion.div>

              <div className="flex items-center justify-center gap-2 mb-2">
                <KeyRound className="w-5 h-5" style={{ color: accent }} />
                <h1 className="text-2xl font-black" style={{ color: accent }}>
                  {isRTL ? "إعادة تعيين كلمة السر" : "Reset Password"}
                </h1>
              </div>
              <p className="text-gray-500 text-sm font-medium">
                {isRTL ? "أدخل كلمة السر الجديدة" : "Enter your new password"}
              </p>
            </div>

            {success ? (
              /* ── Success State ── */
              <div className="text-center py-4">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ background: `${accentG}0.1)`, border: `2px solid ${accentG}0.3)` }}>
                  <CheckCircle className="w-8 h-8" style={{ color: accent }} />
                </motion.div>
                <h3 className="text-xl font-black mb-2" style={{ color: accent }}>
                  {isRTL ? "تم بنجاح!" : "Password Reset!"}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {isRTL
                    ? "تم إعادة تعيين كلمة السر بنجاح. يمكنك الآن تسجيل الدخول."
                    : "Your password has been reset successfully. You can now log in."}
                </p>
                <motion.button
                  onClick={() => navigate("/login")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3.5 rounded-xl text-sm font-black tracking-wider flex items-center justify-center gap-2 mx-auto cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${accent} 0%, #00c890 100%)`,
                    color: "#060a10",
                    boxShadow: `0 6px 25px ${accentG}0.3)`,
                  }}>
                  {isRTL ? "تسجيل الدخول" : "Go to Login"}
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </motion.button>
              </div>
            ) : (!uid || !token) ? (
              /* ── Invalid Link ── */
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.3)' }}>
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-black mb-2 text-red-400">
                  {isRTL ? "رابط غير صالح" : "Invalid Reset Link"}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {isRTL
                    ? "رابط إعادة التعيين غير صالح أو منتهي الصلاحية. أعد طلب إعادة التعيين."
                    : "This reset link is invalid or has expired. Please request a new one."}
                </p>
                <motion.button
                  onClick={() => navigate("/login")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 rounded-xl text-sm font-bold cursor-pointer"
                  style={{ background: `${accentG}0.1)`, color: accent, border: `1px solid ${accentG}0.25)` }}>
                  {isRTL ? "العودة لتسجيل الدخول" : "Back to Login"}
                </motion.button>
              </div>
            ) : (
              /* ── Form ── */
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
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
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#4b5563' }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: '#4b5563' }}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
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
                      style={{ border: `1px solid ${newPassword && confirmPassword && newPassword !== confirmPassword ? 'rgba(239,68,68,0.4)' : `${accentG}0.15)`}` }}
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#4b5563' }} />
                    {newPassword && confirmPassword && newPassword === confirmPassword && (
                      <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: accent }} />
                    )}
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl flex items-center gap-2"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-xs font-bold text-red-400">{error}</p>
                    <button type="button" onClick={() => setError(null)} className="ml-auto text-red-400 cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}

                {/* Submit */}
                <motion.button type="submit" disabled={loading || !newPassword || !confirmPassword}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl text-[15px] font-black tracking-wider uppercase flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer disabled:opacity-50"
                  style={{
                    background: `linear-gradient(135deg, ${accent} 0%, #00c890 100%)`,
                    color: "#060a10",
                    boxShadow: `0 8px 30px ${accentG}0.3), 0 0 40px ${accentG}0.15)`,
                  }}>
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />{isRTL ? "جاري التحديث..." : "Updating..."}</>
                  ) : (
                    <>
                      <KeyRound className="w-5 h-5" />
                      {isRTL ? "تعيين كلمة السر الجديدة" : "Set New Password"}
                    </>
                  )}
                </motion.button>

                {/* Back to login */}
                <div className="text-center">
                  <button type="button" onClick={() => navigate("/login")}
                    className="text-[12px] font-bold cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ color: accent }}>
                    {isRTL ? "العودة لتسجيل الدخول" : "← Back to Login"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Bottom LED */}
          <motion.div className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{ background: `linear-gradient(90deg, transparent 10%, ${accent}50 40%, ${accent}50 60%, transparent 90%)` }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
        </div>
      </motion.div>

      {/* Version badge */}
      <motion.div className="absolute bottom-6 text-center z-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <span className="text-[10px] text-gray-700 tracking-[0.3em] uppercase font-semibold">
          PHASE X — STRUCTURAL DYNAMICS
        </span>
      </motion.div>
    </div>
  );
}
