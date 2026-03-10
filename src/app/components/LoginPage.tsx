import { useState, useMemo } from "react";
import { Lock, Mail, ArrowRight, Zap } from "lucide-react";
import { Logo } from "./Logo";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "motion/react";
import { TermsModal } from "./TermsAndConditions";
import { useThemeTokens } from "../hooks/useThemeTokens";

interface LoginPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

export function LoginPage({ onLogin, onRegister }: LoginPageProps) {
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin();
    }
  };

  const isRTL = language === "ar";
  const tk = useThemeTokens();
  const accent = "#00e5a0";
  const accentG = "rgba(0,229,160,";

  // Floating particles
  const particles = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: 3 + Math.random() * 6,
    delay: Math.random() * 5,
    driftX: (Math.random() - 0.5) * 60,
    driftY: -(20 + Math.random() * 50),
  })), []);

  // Speed streaks
  const streaks = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    y: 10 + Math.random() * 80,
    width: 80 + Math.random() * 200,
    height: 0.5 + Math.random() * 1,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 4,
  })), []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ background: tk.isDark ? "#060a10" : "#dcdfe5", fontFamily: "'Inter', system-ui, sans-serif" }}>

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
        <motion.div className="absolute w-[300px] h-[300px] rounded-full"
          style={{ top: "40%", left: "50%", background: `radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%)`, filter: "blur(40px)" }}
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(p => (
          <motion.div key={p.id} className="absolute rounded-full"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              backgroundColor: accent,
              boxShadow: `0 0 ${4 + p.size * 3}px ${accent}`,
            }}
            animate={{ x: [0, p.driftX], y: [0, p.driftY], opacity: [0, 0.7, 0], scale: [0.5, 1.3, 0.2] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "easeOut", delay: p.delay }} />
        ))}
      </div>

      {/* Speed streaks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {streaks.map(s => (
          <motion.div key={s.id} className="absolute rounded-full"
            style={{
              top: `${s.y}%`, width: s.width, height: s.height,
              background: `linear-gradient(90deg, transparent, ${accent}40, transparent)`,
            }}
            animate={{ left: ["-15%", "115%"] }}
            transition={{ duration: s.duration, repeat: Infinity, ease: "linear", delay: s.delay }} />
        ))}
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(${accentG}0.02) 1px, transparent 1px), linear-gradient(90deg, ${accentG}0.02) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
        className="w-full max-w-md mx-4 relative z-10"
      >
        <div className="rounded-2xl overflow-hidden relative"
          style={{
            background: "linear-gradient(160deg, rgba(14,20,33,0.92) 0%, rgba(8,12,22,0.96) 100%)",
            border: `1px solid ${accentG}0.12)`,
            boxShadow: `0 25px 80px rgba(0,0,0,0.5), 0 0 60px ${accentG}0.08), inset 0 1px 0 rgba(255,255,255,0.04)`,
          }}>

          {/* Top LED strip */}
          <motion.div className="absolute top-0 left-0 right-0 h-[2px] z-30"
            style={{ background: `linear-gradient(90deg, transparent 5%, ${accent} 30%, ${accent} 70%, transparent 95%)` }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }} />

          {/* Header */}
          <div className="px-8 pt-8 pb-4 text-center relative">
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

            <motion.h1 className="text-3xl font-black mb-2"
              style={{ color: accent }}
              animate={{ textShadow: [`0 0 15px ${accentG}0.3)`, `0 0 30px ${accentG}0.5)`, `0 0 15px ${accentG}0.3)`] }}
              transition={{ duration: 2.5, repeat: Infinity }}>
              {isRTL ? "تسجيل الدخول" : "Login"}
            </motion.h1>

            <p className="text-gray-500 text-sm font-medium tracking-wide">
              {isRTL ? "سجل دخولك للوصول إلى منصة PHASE X" : "Login to access PHASE X platform"}
            </p>

            <div className="flex justify-center gap-1 mt-3">
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: accent }}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }} />
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 tracking-wider uppercase"
                  htmlFor="email">
                  {isRTL ? "البريد الإلكتروني" : "Email"}
                </label>
                <div className="relative group">
                  <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{ border: `1px solid ${focused === "email" ? accent : "rgba(255,255,255,0.06)"}`, boxShadow: focused === "email" ? `0 0 20px ${accentG}0.15), inset 0 0 15px ${accentG}0.05)` : "none" }}
                    animate={focused === "email" ? { borderColor: [accent, `${accent}80`, accent] } : {}}
                    transition={{ duration: 2, repeat: Infinity }} />
                  <input
                    id="email"
                    type="email"
                    placeholder={isRTL ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    required
                    dir={isRTL ? "rtl" : "ltr"}
                    className="w-full bg-[rgba(255,255,255,0.03)] text-white placeholder:text-gray-600 rounded-xl py-3.5 text-sm font-medium outline-none transition-all"
                    style={{ paddingLeft: isRTL ? "16px" : "44px", paddingRight: isRTL ? "44px" : "16px" }}
                  />
                  <Mail className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-4 h-4`}
                    style={{ color: focused === "email" ? accent : "#4b5563" }} />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 tracking-wider uppercase"
                  htmlFor="password">
                  {isRTL ? "كلمة المرور" : "Password"}
                </label>
                <div className="relative group">
                  <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{ border: `1px solid ${focused === "password" ? accent : "rgba(255,255,255,0.06)"}`, boxShadow: focused === "password" ? `0 0 20px ${accentG}0.15), inset 0 0 15px ${accentG}0.05)` : "none" }}
                    animate={focused === "password" ? { borderColor: [accent, `${accent}80`, accent] } : {}}
                    transition={{ duration: 2, repeat: Infinity }} />
                  <input
                    id="password"
                    type="password"
                    placeholder={isRTL ? "أدخل كلمة المرور" : "Enter your password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    required
                    dir={isRTL ? "rtl" : "ltr"}
                    className="w-full bg-[rgba(255,255,255,0.03)] text-white placeholder:text-gray-600 rounded-xl py-3.5 text-sm font-medium outline-none transition-all"
                    style={{ paddingLeft: isRTL ? "16px" : "44px", paddingRight: isRTL ? "44px" : "16px" }}
                  />
                  <Lock className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-4 h-4`}
                    style={{ color: focused === "password" ? accent : "#4b5563" }} />
                </div>
              </div>

              {/* Login Button */}
              <motion.button type="submit"
                className="w-full py-4 rounded-xl text-[15px] font-black tracking-wider uppercase flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${accent} 0%, #00c890 100%)`,
                  color: "#060a10",
                  boxShadow: `0 8px 30px ${accentG}0.3), 0 0 40px ${accentG}0.15)`,
                }}
                whileHover={{ scale: 1.02, boxShadow: `0 12px 40px ${accentG}0.4), 0 0 60px ${accentG}0.2)` }}
                whileTap={{ scale: 0.98 }}>
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)` }}
                  animate={{ left: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }} />
                <Zap className="w-5 h-5" />
                {isRTL ? "تسجيل الدخول" : "Login"}
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full" style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${accentG}0.15), transparent)` }} />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-[10px] font-bold text-gray-600 tracking-[0.2em] uppercase"
                    style={{ background: "rgba(10,14,24,1)" }}>
                    {isRTL ? "أو" : "or"}
                  </span>
                </div>
              </div>

              {/* Terms Agreement Checkbox */}
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
                  {agreedToTerms && (
                    <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="#060a10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </motion.button>
                <p className="text-[12px] text-gray-400 leading-relaxed">
                  {isRTL ? "أوافق على " : "I agree to the "}
                  <button
                    type="button"
                    onClick={() => setTermsOpen(true)}
                    className="font-bold underline cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ color: accent }}
                  >
                    {isRTL ? "الشروط والأحكام" : "Terms and Conditions"}
                  </button>
                  {isRTL ? " الخاصة بمنصة PHASEX" : " of PHASEX platform"}
                </p>
              </div>

              {/* Register Button */}
              <motion.button type="button" onClick={onRegister}
                className="w-full py-4 rounded-xl text-[14px] font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                style={{
                  background: agreedToTerms ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)",
                  color: agreedToTerms ? accent : "rgba(255,255,255,0.2)",
                  border: `1px solid ${agreedToTerms ? `${accentG}0.15)` : "rgba(255,255,255,0.04)"}`,
                  pointerEvents: agreedToTerms ? "auto" : "none",
                  opacity: agreedToTerms ? 1 : 0.4,
                }}
                whileHover={agreedToTerms ? { background: `${accentG}0.06)`, borderColor: `${accentG}0.3)`, scale: 1.02 } : {}}
                whileTap={agreedToTerms ? { scale: 0.98 } : {}}>
                {isRTL ? "إنشاء حساب جديد" : "Create New Account"}
              </motion.button>
            </form>
          </div>

          {/* Bottom LED strip */}
          <motion.div className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{ background: `linear-gradient(90deg, transparent 10%, ${accent}50 40%, ${accent}50 60%, transparent 90%)` }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
        </div>
      </motion.div>

      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />

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