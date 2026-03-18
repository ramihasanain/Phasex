import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Logo } from "./Logo";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Lock,
  MapPin,
  Crown,
  CheckCircle2,
  Sparkles,
  Rocket,
  Star,
  Zap,
  Trophy,
  Check,
  ChevronDown,
  Send,
  Clock,
  CircleCheck,
  X,
  MailCheck,
  RefreshCw,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { registerUser, resendVerification, getMe, loginUser, getCountries } from "../api/authApi";
import type { APICountry } from "../api/authApi";
import { getPlans, getAddons, checkoutSubmit, checkoutPreview } from "../api/subscriptionsApi";
import type { APIPlan, APIAddon } from "../api/subscriptionsApi";

interface RegisterPageProps {
  onRegister: () => void;
  onBackToLogin: () => void;
}

export function RegisterPage({ onRegister, onBackToLogin }: RegisterPageProps) {
  const { language, t } = useLanguage();
  const { loginWithApi, submitReceipt, applyReferralCode, accessToken, setEmailVerified } = useAuth();
  const isRTL = language === "ar";

  const [step, setStep] = useState(1);
  const [focused, setFocused] = useState<string | null>(null);
  const [aiAddon, setAiAddon] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [referralInput, setReferralInput] = useState("");
  const [referralApplied, setReferralApplied] = useState(false);
  const [referralError, setReferralError] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    subscriptionType: "trader"
  });
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // API states
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [verifyChecking, setVerifyChecking] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Dynamic plans/addons from API
  const [apiPlans, setApiPlans] = useState<APIPlan[]>([]);
  const [apiAddons, setApiAddons] = useState<APIAddon[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [previewTotal, setPreviewTotal] = useState<number | null>(null);

  // Dynamic countries from API
  const [apiCountries, setApiCountries] = useState<APICountry[]>([]);

  // Fetch countries on mount
  useEffect(() => {
    getCountries()
      .then(list => setApiCountries(list))
      .catch(err => console.error('[PhaseX] Failed to load countries:', err));
  }, []);

  const languageOptions = [
    { code: "en", label: "English", flag: "https://flagcdn.com/w40/gb.png" },
    { code: "ar", label: "العربية", flag: "https://flagcdn.com/w40/sa.png" },
    { code: "ru", label: "Русский", flag: "https://flagcdn.com/w40/ru.png" },
    { code: "tr", label: "Türkçe", flag: "https://flagcdn.com/w40/tr.png" },
    { code: "fr", label: "Français", flag: "https://flagcdn.com/w40/fr.png" },
    { code: "es", label: "Español", flag: "https://flagcdn.com/w40/es.png" },
  ];
  const currentLangObj = languageOptions.find((l) => l.code === language) || languageOptions[0];
  const { setLanguageKey } = useLanguage();

  const accent = "#00e5a0";
  const accentG = "rgba(0,229,160,";
  const walletAddress = "TQwFCKK5JjZACHdE888zG5iUx8wQ2RtnAV";

  const countries = apiCountries.map(c => ({
    value: String(c.id),
    label: isRTL ? c.name_ar : c.name_en,
  }));

  // Plan color/icon mapping
  const planColorMap: Record<string, { color: string; icon: any }> = {
    "core": { color: "#3b82f6", icon: Zap },
    "trader": { color: accent, icon: Star },
    "professional": { color: "#a855f7", icon: Crown },
    "institutional": { color: "#facc15", icon: Trophy },
  };

  const getPlanKey = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes("core")) return "core";
    if (lower.includes("trader")) return "trader";
    if (lower.includes("professional") || lower.includes("pro")) return "professional";
    if (lower.includes("institutional") || lower.includes("inst")) return "institutional";
    return "core";
  };

  const subscriptionTypes = apiPlans.map(plan => {
    const key = getPlanKey(plan.name);
    const mapping = planColorMap[key] || { color: "#3b82f6", icon: Zap };
    return {
      id: String(plan.id),
      apiId: plan.id,
      name: plan.name,
      priceMonthly: parseFloat(plan.price_monthly),
      priceAnnualMonthly: parseFloat(plan.price_annual_monthly),
      priceAnnualTotal: parseFloat(plan.price_annual_total),
      savePercentage: parseFloat(plan.save_percentage),
      color: mapping.color,
      icon: mapping.icon,
      popular: plan.is_popular,
      charts: plan.indicators.map(ind => ind.name),
      features: plan.features,
      limitations: plan.limitations,
      description: plan.description,
    };
  });

  // AI Addon from API
  const aiAddonData = apiAddons.find(a => a.code === "ai_insight");
  const aiAddonPriceMonthly = aiAddonData ? parseFloat(aiAddonData.base_price_monthly) : 20;
  const aiAddonPriceAnnual = aiAddonData ? parseFloat(aiAddonData.base_price_annual_monthly) * 12 : Math.round(20 * 12 * 0.8);

  const selectedSub = subscriptionTypes.find(s => s.id === formData.subscriptionType);
  const getPrice = (sub: typeof subscriptionTypes[0]) => billingCycle === "yearly" ? sub.priceAnnualTotal : sub.priceMonthly;
  const displayPrice = (sub: typeof subscriptionTypes[0]) => billingCycle === "yearly" ? `$${sub.priceAnnualTotal}` : `$${sub.priceMonthly}`;
  const subtotal = (selectedSub ? getPrice(selectedSub) : 0) + (aiAddon ? (billingCycle === "yearly" ? aiAddonPriceAnnual : aiAddonPriceMonthly) : 0);
  // Fetch plans & addons when step reaches 4
  useEffect(() => {
    if (step === 4 && apiPlans.length === 0 && !plansLoading) {
      setPlansLoading(true);
      const token = accessToken || undefined;
      Promise.all([getPlans(token), getAddons(token)])
        .then(([plans, addons]) => {
          setApiPlans(plans);
          setApiAddons(addons);
          // Auto-select first plan if none selected
          if (plans.length > 0 && !formData.subscriptionType) {
            const popular = plans.find(p => p.is_popular);
            setFormData(prev => ({ ...prev, subscriptionType: String(popular?.id || plans[0].id) }));
          }
        })
        .catch(err => {
          console.error('[PhaseX] Failed to load plans:', err);
          setApiError(isRTL ? "فشل تحميل الباقات" : "Failed to load plans.");
        })
        .finally(() => setPlansLoading(false));
    }
  }, [step]);

  const referralDiscountAmount = referralApplied ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const totalAmount = subtotal - referralDiscountAmount;

  const handleApplyReferral = () => {
    setReferralError(false);
    const result = applyReferralCode(referralInput);
    if (result.valid) {
      setReferralApplied(true);
      setReferralError(false);
    } else {
      setReferralApplied(false);
      setReferralError(true);
    }
  };

  const handleRemoveReferral = () => {
    setReferralApplied(false);
    setReferralInput("");
    setReferralError(false);
  };

  const stepColors = ["#448aff", accent, "#a855f7", "#ffc400", accent, "#00e5a0"];

  const steps = [
    { id: 1, title: isRTL ? "البيانات" : "Personal", icon: User },
    { id: 2, title: isRTL ? "الحساب" : "Account", icon: Mail },
    { id: 3, title: isRTL ? "التحقق" : "Verify", icon: MailCheck },
    { id: 4, title: isRTL ? "الباقة" : "Plan", icon: Crown },
    { id: 5, title: isRTL ? "الدفع" : "Payment", icon: Send },
    { id: 6, title: isRTL ? "الانتظار" : "Pending", icon: Clock },
  ];

  const handleNext = async () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName) {
        setApiError(isRTL ? "يرجى إدخال الاسم الكامل" : "Please enter your full name");
        return;
      }
      setApiError(null);
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!formData.email || !formData.password || !formData.confirmPassword || !formData.country) {
        setApiError(isRTL ? "يرجى إكمال جميع الحقول" : "Please complete all fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setApiError(isRTL ? "كلمتا المرور غير متطابقتين" : "Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        setApiError(isRTL ? "كلمة المرور قصيرة جداً" : "Password too short");
        return;
      }
      // Call Registration API
      setApiLoading(true);
      setApiError(null);
      try {
        const res = await registerUser({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          country_id: parseInt(formData.country, 10),
        });
        // Store tokens and user in context
        loginWithApi(res.user, res.access, res.refresh);
        setStep(3); // go to email verification step
      } catch (err: any) {
        const msg = err.message || "";
        if (msg.includes("already exists")) {
          setApiError(isRTL ? "هذا البريد الإلكتروني مسجل مسبقاً" : "An account with this email already exists.");
        } else {
          setApiError(msg || (isRTL ? "حدث خطأ أثناء التسجيل" : "Registration failed. Please try again."));
        }
      } finally {
        setApiLoading(false);
      }
      return;
    }
    // Step 3: Email verification — must verify before proceeding
    if (step === 3) {
      // Don't advance directly, use verification check
      await handleCheckVerification();
      return;
    }
    // Step 4 → Step 5: call checkout/preview to get backend-calculated total
    if (step === 4 && selectedSub) {
      const token = accessToken;
      if (token) {
        setApiLoading(true);
        setApiError(null);
        try {
          const addonIds = aiAddon && aiAddonData ? [aiAddonData.id] : [];
          const preview = await checkoutPreview(token, {
            plan_id: selectedSub.apiId,
            billing_cycle: billingCycle === "yearly" ? "annual" : "monthly",
            addon_ids: addonIds,
          });
          console.log('[PhaseX] Checkout preview:', preview);
          const total = parseFloat(preview.total) || totalAmount;
          setPreviewTotal(total);
        } catch (err: any) {
          console.error('[PhaseX] Preview error:', err);
          // Fallback to frontend-calculated total
          setPreviewTotal(totalAmount);
        } finally {
          setApiLoading(false);
        }
      }
    }
    setApiError(null);
    setStep(step + 1);
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    try {
      await resendVerification(formData.email);
      setResendSuccess(true);
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
      setTimeout(() => setResendSuccess(false), 4000);
    } catch {
      setApiError(isRTL ? "فشل إعادة إرسال رسالة التحقق" : "Failed to resend verification email.");
    }
  };

  const handleCheckVerification = useCallback(async () => {
    setVerifyChecking(true);
    setApiError(null);
    try {
      let userData: any;
      let tokens: { access: string; refresh: string } | null = null;

      // Try getMe first if we already have a token (from registration)
      if (accessToken) {
        console.log('[PhaseX] Checking verification via getMe...');
        userData = await getMe(accessToken);
        console.log('[PhaseX] getMe response:', userData);
      } else {
        // Fallback: login again to get fresh data
        console.log('[PhaseX] Checking verification via loginUser...');
        const res = await loginUser(formData.email, formData.password);
        console.log('[PhaseX] Login check response:', res);
        userData = res.user;
        tokens = { access: res.access, refresh: res.refresh };
      }

      if (userData.email_verified) {
        // Email is verified! Update tokens if we got new ones
        if (tokens) {
          loginWithApi(userData, tokens.access, tokens.refresh);
        }
        setEmailVerified();
        if (pollTimerRef.current) { clearInterval(pollTimerRef.current); pollTimerRef.current = null; }
        setStep(4); // go to plan selection
      } else {
        setApiError(isRTL ? "البريد لم يتم تفعيله بعد، تحقق من بريدك الإلكتروني" : "Email not verified yet. Please check your inbox.");
      }
    } catch (err: any) {
      console.error('[PhaseX] Verification check error:', err);
      const msg = err.message || "";
      if (msg.toLowerCase().includes("verified") || msg.toLowerCase().includes("verify")) {
        setApiError(isRTL ? "البريد لم يتم تفعيله بعد، تحقق من بريدك الإلكتروني" : "Email not verified yet. Please check your inbox.");
      } else {
        setApiError(msg || (isRTL ? "فشل التحقق من حالة البريد" : "Failed to check verification status."));
      }
    } finally {
      setVerifyChecking(false);
    }
  }, [formData.email, formData.password, isRTL, loginWithApi, setEmailVerified, accessToken]);

  const handleConfirmPayment = async () => {
    const token = accessToken;
    if (token && selectedSub) {
      try {
        setApiLoading(true);
        const addonIds = aiAddon && aiAddonData ? [aiAddonData.id] : [];
        const payload = {
          plan_id: selectedSub.apiId,
          billing_cycle: (billingCycle === "yearly" ? "annual" : "monthly") as "monthly" | "annual",
          addon_ids: addonIds,
        };
        console.log('[PhaseX] Checkout submit payload:', payload);
        console.log('[PhaseX] Displayed total:', totalAmount);
        const result = await checkoutSubmit(token, payload);
        console.log('[PhaseX] Checkout submit result:', result);
      } catch (err: any) {
        console.error('[PhaseX] Checkout submit error:', err);
        setApiError(err.message || (isRTL ? "فشل إرسال الاشتراك" : "Checkout failed."));
        return; // Don't proceed if checkout fails
      } finally {
        setApiLoading(false);
      }
    }
    submitReceipt(formData.subscriptionType as any, aiAddon, false);
    setStep(6);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Particles
  const particles = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 3 + 1, duration: 3 + Math.random() * 6, delay: Math.random() * 5,
    driftX: (Math.random() - 0.5) * 50, driftY: -(15 + Math.random() * 40),
  })), []);

  const currentColor = stepColors[Math.min(step - 1, stepColors.length - 1)];

  const inputClass = "w-full bg-[rgba(255,255,255,0.03)] text-white placeholder:text-gray-600 rounded-xl py-3.5 px-4 text-sm font-medium outline-none transition-all";

  const renderInput = (id: string, type: string, placeholder: string, value: string, onChange: (v: string) => void, icon: React.ReactNode) => (
    <div className="relative">
      <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
        style={{ border: `1px solid ${focused === id ? currentColor : "rgba(255,255,255,0.06)"}`, boxShadow: focused === id ? `0 0 20px ${currentColor}25, inset 0 0 12px ${currentColor}08` : "none" }} />
      <input id={id} type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(id)} onBlur={() => setFocused(null)}
        dir={isRTL ? "rtl" : "ltr"}
        className={inputClass}
        style={{ paddingLeft: isRTL ? "16px" : "44px", paddingRight: isRTL ? "44px" : "16px" }} />
      <div className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2`}
        style={{ color: focused === id ? currentColor : "#4b5563" }}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4"
      dir="auto"
      style={{ background: "#060a10", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Ambient BG */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute w-[600px] h-[600px] rounded-full"
          style={{ top: "-20%", left: "-10%", background: `radial-gradient(circle, ${currentColor}14 0%, transparent 70%)`, filter: "blur(60px)" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute w-[500px] h-[500px] rounded-full"
          style={{ bottom: "-15%", right: "-5%", background: `radial-gradient(circle, ${currentColor}10 0%, transparent 70%)`, filter: "blur(50px)" }}
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity }} />
      </div>

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <div className="relative">
          <motion.button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer backdrop-blur-md"
            style={{
              background: "rgba(14,20,33,0.7)",
              border: `1px solid ${accentG}0.3)`,
              color: "#fff",
              boxShadow: `0 4px 20px ${accentG}0.1)`
            }}
          >
            <img src={currentLangObj.flag} alt={currentLangObj.label} className="w-5 h-5 rounded-full object-cover border border-white/20" />
            <span className="hidden sm:block">{currentLangObj.label}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </motion.button>
          
          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-xl overflow-hidden backdrop-blur-xl"
              style={{
                background: "rgba(14,20,33,0.9)",
                border: `1px solid ${accentG}0.2)`,
                boxShadow: `0 10px 40px ${accentG}0.15)`
              }}>
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    if(setLanguageKey) setLanguageKey(lang.code as any);
                    setLangDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors cursor-pointer"
                  style={{
                    background: language === lang.code ? "rgba(255,255,255,0.05)" : "transparent",
                    color: language === lang.code ? accent : "#e2e8f0"
                  }}
                >
                  <img src={lang.flag} alt={lang.label} className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-sm font-bold">{lang.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(p => (
          <motion.div key={p.id} className="absolute rounded-full"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, backgroundColor: currentColor, boxShadow: `0 0 ${4 + p.size * 3}px ${currentColor}` }}
            animate={{ x: [0, p.driftX], y: [0, p.driftY], opacity: [0, 0.6, 0], scale: [0.5, 1.2, 0.2] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "easeOut", delay: p.delay }} />
        ))}
      </div>

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(${currentColor}05 1px, transparent 1px), linear-gradient(90deg, ${currentColor}05 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
        className={`w-full relative z-10 ${step <= 3 ? 'max-w-2xl' : 'max-w-4xl'}`}>

        {/* Main Card */}
        <div className="rounded-2xl overflow-hidden relative"
          style={{
            background: "linear-gradient(160deg, rgba(14,20,33,0.92) 0%, rgba(8,12,22,0.96) 100%)",
            border: `1px solid ${currentColor}18`,
            boxShadow: `0 25px 80px rgba(0,0,0,0.5), 0 0 60px ${currentColor}08, inset 0 1px 0 rgba(255,255,255,0.04)`,
            maxHeight: step === 6 ? "auto" : "85vh",
            overflowY: "auto"
          }}>

          {/* Top LED */}
          <motion.div className="absolute top-0 left-0 right-0 h-[2px] z-30"
            style={{ background: `linear-gradient(90deg, transparent 5%, ${currentColor} 30%, ${currentColor} 70%, transparent 95%)` }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }} />

          {/* Header */}
          <div className="px-8 pt-7 pb-3 text-center">
            <motion.div className="flex justify-center mb-3" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}>
              <div className="relative">
                <Logo className="w-12 h-12 relative z-10" />
                <motion.div className="absolute inset-0 rounded-full"
                  style={{ background: `radial-gradient(circle, ${currentColor}30 0%, transparent 70%)`, filter: "blur(10px)" }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity }} />
              </div>
            </motion.div>
            <motion.h1 className="text-2xl font-black mb-1" style={{ color: currentColor }}
              animate={{ textShadow: [`0 0 15px ${currentColor}40`, `0 0 30px ${currentColor}60`, `0 0 15px ${currentColor}40`] }}
              transition={{ duration: 2.5, repeat: Infinity }}>
              {t("joinTitle")}
            </motion.h1>
            <p className="text-gray-500 text-xs font-medium tracking-wide">
              {t("joinSub")}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="px-8 pb-5">
            <div className="flex items-center justify-between">
              {steps.map((s, i) => {
                const StepIcon = s.icon;
                const isActive = step === s.id;
                const isCompleted = step > s.id;
                const sColor = stepColors[i];
                return (
                  <div key={s.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <motion.div
                        className="w-9 h-9 rounded-full flex items-center justify-center relative"
                        style={{
                          background: isCompleted || isActive
                            ? `linear-gradient(135deg, ${sColor}, ${sColor}aa)`
                            : "rgba(255,255,255,0.04)",
                          border: `1px solid ${isCompleted || isActive ? `${sColor}60` : "rgba(255,255,255,0.06)"}`,
                          boxShadow: isActive ? `0 0 20px ${sColor}40, 0 0 40px ${sColor}15` : "none",
                        }}
                        whileHover={{ scale: 1.1 }}>
                        {isCompleted ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <StepIcon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-600"}`} />
                        )}
                        {isActive && (
                          <motion.div className="absolute inset-0 rounded-full"
                            style={{ background: `radial-gradient(circle, ${sColor}30 0%, transparent 70%)` }}
                            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }} />
                        )}
                      </motion.div>
                      <span className={`text-[9px] mt-1 font-bold tracking-wide ${isActive ? "text-white" : "text-gray-600"}`}>
                        {s.title}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className="h-[2px] flex-1 mx-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <motion.div className="h-full rounded-full"
                          style={{ background: sColor, width: isCompleted ? "100%" : "0%" }}
                          animate={{ width: isCompleted ? "100%" : "0%" }}
                          transition={{ duration: 0.5 }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error Banner */}
          {apiError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mx-8 mb-3 p-3 rounded-xl flex items-center gap-3"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-xs font-bold text-red-400">{apiError}</p>
              <button onClick={() => setApiError(null)} className="ml-auto text-red-400 hover:text-red-300 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
            </motion.div>
          )}

          {/* Content */}
          <div className="px-8 pb-6">
            <AnimatePresence mode="wait">
              {/* Step 1 - Personal Info */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-4">
                  <div className="text-center mb-4">
                    <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                      style={{ background: `${stepColors[0]}12`, border: `1px solid ${stepColors[0]}25` }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}>
                      <User className="w-4 h-4" style={{ color: stepColors[0] }} />
                      <span className="text-sm font-bold" style={{ color: stepColors[0] }}>
                        {isRTL ? "من أنت؟" : "Who are you?"}
                      </span>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {renderInput("firstName", "text", isRTL ? "الاسم الأول" : "First Name", formData.firstName, v => setFormData({ ...formData, firstName: v }), <User className="w-4 h-4" />)}
                    {renderInput("lastName", "text", isRTL ? "اسم العائلة" : "Last Name", formData.lastName, v => setFormData({ ...formData, lastName: v }), <User className="w-4 h-4" />)}
                  </div>

                  <motion.div className="p-4 rounded-xl" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    style={{ background: `${stepColors[0]}08`, border: `1px solid ${stepColors[0]}18` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${stepColors[0]}, ${stepColors[0]}88)` }}>
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: stepColors[0] }}>{isRTL ? "مرحباً بك في Phase X" : "Welcome to Phase X"}</p>
                        <p className="text-xs text-gray-500">{isRTL ? "انضم لأكثر من 10,000 متداول محترف" : "Join 10,000+ professional traders"}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 2 - Account Details */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-4">
                  <div className="text-center mb-4">
                    <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                      style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}>
                      <Lock className="w-4 h-4" style={{ color: accent }} />
                      <span className="text-sm font-bold" style={{ color: accent }}>
                        {isRTL ? "تأمين الحساب" : "Secure Account"}
                      </span>
                    </motion.div>
                  </div>

                  {renderInput("email", "email", isRTL ? "البريد الإلكتروني" : "Email", formData.email, v => setFormData({ ...formData, email: v }), <Mail className="w-4 h-4" />)}

                  <div className="grid grid-cols-2 gap-3">
                    {renderInput("password", "password", isRTL ? "كلمة المرور" : "Password", formData.password, v => setFormData({ ...formData, password: v }), <Lock className="w-4 h-4" />)}
                    {renderInput("confirmPassword", "password", isRTL ? "تأكيد كلمة المرور" : "Confirm Password", formData.confirmPassword, v => setFormData({ ...formData, confirmPassword: v }), <Lock className="w-4 h-4" />)}
                  </div>

                  <div className="relative">
                    <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{ border: `1px solid ${focused === "country" ? accent : "rgba(255,255,255,0.06)"}`, boxShadow: focused === "country" ? `0 0 20px ${accentG}0.15)` : "none" }} />
                    <select value={formData.country}
                      onChange={e => setFormData({ ...formData, country: e.target.value })}
                      onFocus={() => setFocused("country")} onBlur={() => setFocused(null)}
                      className="w-full bg-[rgba(255,255,255,0.03)] text-white rounded-xl py-3.5 px-4 text-sm font-medium outline-none appearance-none cursor-pointer"
                      style={{ paddingLeft: isRTL ? "16px" : "44px", paddingRight: isRTL ? "44px" : "16px" }}>
                      <option value="" className="bg-[#0a0e18]">{isRTL ? "اختر الدولة" : "Select Country"}</option>
                      {countries.map(c => <option key={c.value} value={c.value} className="bg-[#0a0e18]">{c.label}</option>)}
                    </select>
                    <MapPin className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-4 h-4`}
                      style={{ color: focused === "country" ? accent : "#4b5563" }} />
                  </div>
                </motion.div>
              )}

              {/* Step 3 - Email Verification */}
              {step === 3 && (
                <motion.div key="s3verify" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                  className="flex flex-col items-center justify-center py-8 text-center space-y-5">

                  {/* Mail icon animation */}
                  <motion.div className="w-24 h-24 rounded-full flex items-center justify-center relative"
                    style={{ background: `linear-gradient(135deg, rgba(168,85,247,0.15) 0%, transparent 100%)` }}>
                    <motion.div className="absolute inset-0 rounded-full"
                      style={{ border: "3px solid rgba(168,85,247,0.2)" }}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity }} />
                    <MailCheck size={44} color="#a855f7" />
                  </motion.div>

                  <div>
                    <h2 className="text-xl font-black text-white mb-2">
                      {isRTL ? "تحقق من بريدك الإلكتروني" : "Verify Your Email"}
                    </h2>
                    <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed font-medium">
                      {isRTL
                        ? `أرسلنا رابط تحقق إلى ${formData.email}. يرجى فتح بريدك والضغط على الرابط لتفعيل حسابك.`
                        : `We sent a verification link to ${formData.email}. Please check your inbox and click the link to activate your account.`}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-3 w-full max-w-xs">
                    {/* Check verification */}
                    <motion.button type="button" onClick={handleCheckVerification} disabled={verifyChecking}
                      className="w-full py-3.5 rounded-xl text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer disabled:opacity-60"
                      style={{ background: `linear-gradient(135deg, #a855f7, #9333ea)`, color: "#fff", boxShadow: `0 8px 30px rgba(168,85,247,0.3)` }}
                      whileHover={!verifyChecking ? { scale: 1.02 } : {}}
                      whileTap={!verifyChecking ? { scale: 0.98 } : {}}>
                      {verifyChecking ? (
                        <><Loader2 className="w-4 h-4 animate-spin" />{isRTL ? "جاري التحقق..." : "Checking..."}</>
                      ) : (
                        <><CheckCircle2 className="w-4 h-4" />{isRTL ? "لقد فعّلت بريدي" : "I've Verified My Email"}</>
                      )}
                    </motion.button>

                    {/* Resend */}
                    <motion.button type="button" onClick={handleResendVerification}
                      disabled={resendCooldown > 0}
                      className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 transition-all"
                      style={{ background: "rgba(255,255,255,0.03)", color: resendCooldown > 0 ? "#6b7280" : "#a855f7", border: `1px solid ${resendCooldown > 0 ? "rgba(255,255,255,0.06)" : "rgba(168,85,247,0.25)"}` }}
                      whileHover={resendCooldown === 0 ? { background: "rgba(168,85,247,0.08)" } : {}}
                      whileTap={resendCooldown === 0 ? { scale: 0.98 } : {}}>
                      <RefreshCw className="w-4 h-4" />
                      {resendCooldown > 0
                        ? (isRTL ? `إعادة إرسال (${resendCooldown}s)` : `Resend (${resendCooldown}s)`)
                        : (isRTL ? "إعادة إرسال رابط التحقق" : "Resend Verification Link")}
                    </motion.button>
                  </div>

                  {resendSuccess && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-xs font-bold text-[#00e5a0]">
                      {isRTL ? "تم إرسال رابط التحقق مجدداً!" : "Verification link resent!"}
                    </motion.p>
                  )}

                  {/* Tip */}
                  <div className="p-3 rounded-xl max-w-xs" style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.15)" }}>
                    <p className="text-[11px] text-gray-400">
                      {isRTL
                        ? "💡 تحقق من مجلد الرسائل غير المرغوب فيها (Spam) إذا لم تجد الرسالة."
                        : "💡 Check your spam/junk folder if you don't see the email."}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 4 - Choose Plan + AI Addon */}
              {step === 4 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-4">
                  <div className="text-center mb-4">
                    <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                      style={{ background: `${stepColors[2]}12`, border: `1px solid ${stepColors[2]}25` }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}>
                      <Crown className="w-4 h-4" style={{ color: stepColors[2] }} />
                      <span className="text-sm font-bold" style={{ color: stepColors[2] }}>
                        {t("chooseYourPlanSub")}
                      </span>
                    </motion.div>
                  </div>

                  {/* Billing Toggle */}
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="flex items-center rounded-full p-1 gap-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <button type="button" onClick={() => setBillingCycle("monthly")}
                        className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${billingCycle === "monthly" ? "text-black" : "text-gray-400 hover:text-white"}`}
                        style={{ background: billingCycle === "monthly" ? accent : "transparent" }}>
                        {t("billingMonthly")}
                      </button>
                      <button type="button" onClick={() => setBillingCycle("yearly")}
                        className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-black" : "text-gray-400 hover:text-white"}`}
                        style={{ background: billingCycle === "yearly" ? accent : "transparent" }}>
                        {t("billingYearly")}
                      </button>
                    </div>
                    {billingCycle === "yearly" && (
                      <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider text-black"
                        style={{ background: `linear-gradient(90deg, ${accent}, #00c890)` }}>
                        {t("save20")}
                      </motion.span>
                    )}
                  </div>

                  {plansLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-[#a855f7]" />
                      <p className="text-sm text-gray-400 font-medium">{isRTL ? "جاري تحميل الباقات..." : "Loading plans..."}</p>
                    </div>
                  ) : subscriptionTypes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                      <AlertCircle className="w-8 h-8 text-red-400" />
                      <p className="text-sm text-gray-400 font-medium">{isRTL ? "لا توجد باقات متاحة" : "No plans available"}</p>
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {subscriptionTypes.map((sub) => {
                      const Icon = sub.icon;
                      const isSelected = formData.subscriptionType === sub.id;
                      const price = billingCycle === "yearly" ? sub.priceAnnualTotal : sub.priceMonthly;
                      return (
                        <motion.button key={sub.id} type="button"
                          onClick={() => setFormData({ ...formData, subscriptionType: sub.id })}
                          className={`relative p-4 rounded-2xl transition-all text-left cursor-pointer`}
                          style={{
                            background: isSelected
                              ? `linear-gradient(135deg, ${sub.color}20 0%, ${sub.color}08 100%)`
                              : "rgba(255,255,255,0.02)",
                            border: `1px solid ${isSelected ? `${sub.color}40` : "rgba(255,255,255,0.05)"}`,
                            boxShadow: isSelected ? `0 0 30px ${sub.color}15, inset 0 0 20px ${sub.color}05` : "none",
                          }}
                          whileHover={{ scale: 1.01, boxShadow: `0 0 25px ${sub.color}20` }}
                          whileTap={{ scale: 0.99 }}>

                          {sub.popular && (
                            <div className={`absolute -top-2.5 ${isRTL ? 'right-3' : 'left-3'}`}>
                              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider text-black"
                                style={{ background: `linear-gradient(90deg, ${accent}, #00c890)`, boxShadow: `0 0 15px ${accent}50` }}>
                                <Star className="w-2.5 h-2.5" />
                                {t("planTraderBadge")}
                              </div>
                            </div>
                          )}

                          {/* Plan Header */}
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{
                                background: isSelected ? `linear-gradient(135deg, ${sub.color}, ${sub.color}88)` : `${sub.color}15`,
                                border: `1px solid ${sub.color}30`,
                              }}>
                              <Icon className="w-5 h-5" style={{ color: isSelected ? "#fff" : sub.color }} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-black text-white leading-tight">{sub.name}</h4>
                              <p className="text-[10px] text-gray-500 font-medium leading-snug mt-0.5">{sub.description}</p>
                            </div>

                            {isSelected && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex-shrink-0">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center"
                                  style={{ background: `${sub.color}20`, border: `2px solid ${sub.color}` }}>
                                  <Check className="w-3.5 h-3.5" style={{ color: sub.color }} />
                                </div>
                              </motion.div>
                            )}
                          </div>

                          {/* Price */}
                          <div className="flex items-baseline gap-1.5 mb-3">
                            <span className="text-xl font-black" style={{ color: sub.color }}>${price}</span>
                            <span className="text-[10px] text-gray-500 font-medium">/{billingCycle === "yearly" ? t("perYear") : t("perMonth")}</span>
                            {billingCycle === "yearly" && (
                              <span className="text-[9px] text-gray-600 line-through ml-1">${sub.priceMonthly * 12}</span>
                            )}
                          </div>
                          {billingCycle === "yearly" && (
                            <p className="text-[9px] text-[#00e5a0] font-bold mb-2">{t("billedAnnually")} — {isRTL ? `وفّر ${sub.savePercentage}%` : `Save ${sub.savePercentage}%`}</p>
                          )}

                          {/* Divider */}
                          <div className="h-px w-full mb-2" style={{ background: `linear-gradient(90deg, transparent, ${sub.color}25, transparent)` }} />

                          {/* Chart Access */}
                          <div className="mb-2">
                            <p className="text-[9px] uppercase tracking-widest font-black mb-1.5" style={{ color: sub.color }}>{t("chartAccess")}</p>
                            <div className="space-y-1">
                              {sub.charts.map((chart, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                  <div className="w-1 h-1 rounded-full" style={{ background: sub.color }} />
                                  <span className="text-[10px] text-gray-300 font-medium">{chart}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="h-px w-full mb-2" style={{ background: `linear-gradient(90deg, transparent, ${sub.color}12, transparent)` }} />

                          {/* Features */}
                          <div className="mb-2">
                            <p className="text-[9px] uppercase tracking-widest font-black mb-1.5" style={{ color: sub.color }}>{t("subFeatures")}</p>
                            <ul className="space-y-0.5">
                              {sub.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-1.5 text-[10px]">
                                  <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: isSelected ? sub.color : "#4b5563" }} />
                                  <span className={isSelected ? "text-gray-300" : "text-gray-500"}>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Limitations */}
                          {sub.limitations && sub.limitations.length > 0 && (
                            <div className="mb-2">
                              <p className="text-[9px] uppercase tracking-widest font-black mb-1.5 text-red-500/70">{t("subLimitations")}</p>
                              <ul className="space-y-0.5">
                                {sub.limitations.map((lim, i) => (
                                  <li key={i} className="flex items-center gap-1.5 text-[10px]">
                                    <X className="w-3 h-3 flex-shrink-0 text-red-500/60" />
                                    <span className="text-gray-500">{lim}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* AI Add-on */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="p-4 rounded-2xl flex items-center justify-between cursor-pointer border transition-all"
                    onClick={() => setAiAddon(!aiAddon)}
                    style={{
                      backgroundColor: aiAddon ? `rgba(0, 229, 160, 0.05)` : "rgba(255,255,255,0.02)",
                      borderColor: aiAddon ? "#00e5a0" : "rgba(255,255,255,0.06)",
                      boxShadow: aiAddon ? `0 5px 20px rgba(0,229,160,0.15)` : 'none'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0b0e14] border border-[#00e5a0]/30 shrink-0">
                        {aiAddon ? <Zap size={20} className="text-[#00e5a0]" /> : <Zap size={20} className="text-gray-500" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                          {t("aiInsightTitle")} <Zap size={12} className="text-[#00e5a0]" />
                        </h4>
                        <p className="text-[11px] text-gray-400">
                          {t("aiInsightDesc")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-black text-[#00e5a0]">{billingCycle === "yearly" ? `$${aiAddonPriceAnnual}/${t("perYear")}` : `$${aiAddonPriceMonthly}/${t("perMonth")}`}</span>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${aiAddon ? 'border-[#00e5a0] bg-[#00e5a0]/20 text-[#00e5a0]' : 'border-[#4b5563] text-transparent'}`}>
                        <Check size={16} strokeWidth={4} />
                      </div>
                    </div>
                  </motion.div>

                  {/* Referral Code Input */}
                  <div className="p-3 rounded-xl" style={{ background: "rgba(168,85,247,0.04)", border: "1px solid rgba(168,85,247,0.15)" }}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#a855f7] mb-2">{t("referralCodeInput")}</p>
                    {referralApplied ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Check size={16} className="text-[#00e5a0]" />
                          <span className="text-sm font-bold text-[#00e5a0]">{t("referralApplied")}</span>
                          <span className="font-mono text-xs text-gray-400 ml-1">{referralInput.toUpperCase()}</span>
                        </div>
                        <button type="button" onClick={handleRemoveReferral} className="text-xs font-bold text-red-400 hover:text-red-300 cursor-pointer uppercase tracking-widest">{t("referralRemove")}</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input type="text" value={referralInput} onChange={(e) => { setReferralInput(e.target.value); setReferralError(false); }}
                          className="flex-1 px-3 py-2 rounded-lg text-sm font-mono font-bold bg-[#0b0e14] border border-[#1c2230] text-white placeholder-gray-600 focus:border-[#a855f7] outline-none uppercase tracking-wider"
                          placeholder={t("referralCodePlaceholder")} />
                        <button type="button" onClick={handleApplyReferral}
                          className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest bg-[#a855f7] text-black cursor-pointer hover:bg-[#9333ea] transition-colors">
                          {t("applyCode")}
                        </button>
                      </div>
                    )}
                    {referralError && <p className="text-[10px] text-red-400 mt-1 font-bold">{t("referralInvalid")}</p>}
                  </div>

                  {/* Referral Discount Line */}
                  {referralApplied && (
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: "rgba(0,229,160,0.05)", border: "1px solid rgba(0,229,160,0.15)" }}>
                      <span className="text-xs font-bold text-[#00e5a0]">{t("referralDiscount")}</span>
                      <span className="text-sm font-black text-[#00e5a0]">-${referralDiscountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{t("totalDue")}</span>
                    <span className="text-xl font-black text-white">${totalAmount.toFixed(2)}</span>
                  </div>
                </motion.div>
              )}

              {/* Step 5 - Payment */}
              {step === 5 && (
                <motion.div key="s4" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-4">
                  <div className="text-center mb-3">
                    <div className="w-16 h-16 bg-[#00e5a0]/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-[#00e5a0]/30 shadow-[0_0_20px_rgba(0,229,160,0.2)]">
                      <Send size={28} className="text-[#00e5a0]" />
                    </div>
                    <h2 className="text-xl font-black text-white">{t("confirmPayment")}</h2>
                    <p className="text-gray-400 mt-1 text-xs">{t("confirmPaymentDesc")}</p>
                  </div>

                  <div className="p-4 rounded-xl flex justify-between items-center bg-[#0b0e14] border border-[#1c2230]">
                    <span className="font-black text-gray-400 uppercase tracking-widest text-xs">{t("amountDue")}</span>
                    <span className="text-3xl font-black text-[#00e5a0]">${(previewTotal ?? totalAmount).toFixed(2)}</span>
                  </div>

                  {/* Telegram */}
                  <div className="p-5 rounded-xl border border-[#0088cc]/30 bg-[#0088cc]/5 hover:border-[#0088cc] transition-colors">
                    <h3 className="font-black mb-1.5 flex items-center gap-2 text-white text-sm">
                      <div className="bg-[#0088cc] text-black w-6 h-6 rounded-full flex items-center justify-center"><Send size={12} /></div>
                      {t("telegramFastTrack")}
                    </h3>
                    <p className="text-[11px] text-gray-400 mb-3">{t("telegramFastTrackDesc")}</p>
                    <div className="space-y-2">
                      <a href="https://t.me/PhaseX_Ai" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between cursor-pointer hover:border-[#0088cc]/50 transition-colors no-underline">
                        <span className="font-mono text-sm font-bold text-white">@PhaseX_Ai</span>
                        <div className="text-[#0088cc] bg-[#0088cc]/10 p-1.5 rounded-lg"><Send size={14} /></div>
                      </a>
                      <a href="https://t.me/PhaseX_Ai_SupportBot" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between cursor-pointer hover:border-[#0088cc]/50 transition-colors no-underline">
                        <span className="font-mono text-sm font-bold text-white">@PhaseX_Ai_SupportBot</span>
                        <div className="text-[#0088cc] bg-[#0088cc]/10 p-1.5 rounded-lg"><Send size={14} /></div>
                      </a>
                    </div>
                  </div>

                  {/* Crypto */}
                  <div className="p-5 rounded-xl border border-[#f7931a]/30 bg-[#f7931a]/5 hover:border-[#f7931a] transition-colors">
                    <h3 className="font-black mb-1.5 flex items-center gap-2 text-white text-sm">
                      <div className="bg-[#f7931a] text-black w-6 h-6 rounded-full flex items-center justify-center"><Zap size={12} /></div>
                      USDT TRC20
                    </h3>
                    <p className="text-[11px] text-gray-400 mb-3">{t("cryptoPaymentDesc")}</p>
                    <div className="p-3 rounded-lg border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between cursor-pointer" onClick={() => copyToClipboard(walletAddress)}>
                      <span className="font-mono text-xs font-bold break-all text-white max-w-[85%]">{walletAddress}</span>
                      <div className="text-[#f7931a] shrink-0 bg-[#f7931a]/10 p-1.5 rounded-lg ml-2"><Send size={16} /></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 6 - Pending */}
              {step === 6 && (
                <motion.div key="s6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center">
                  <motion.div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 relative"
                    style={{ background: `linear-gradient(135deg, rgba(0,229,160,0.2) 0%, transparent 100%)` }}>
                    <motion.div className="absolute inset-0 border-4 rounded-full border-t-[#00e5a0] border-r-transparent border-b-[#00e5a0] border-l-transparent"
                      animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                    <Check size={44} color="#00e5a0" />
                  </motion.div>
                  <h2 className="text-2xl font-black mb-3 text-white">{t("verificationPending")}</h2>
                  <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed font-medium mb-6">
                    {t("verificationPendingDescOnboard")}
                  </p>
                  <motion.button onClick={onRegister}
                    className="px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm text-black"
                    style={{ background: "#00e5a0", boxShadow: "0 10px 30px rgba(0,229,160,0.3)" }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}>
                    {t("gotIt")}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons (steps 1-2 and 4-5 only, step 3 has its own buttons) */}
            {(step <= 2 || (step >= 4 && step <= 5)) && (
              <div className="flex gap-3 mt-6">
                {step > 1 && step <= 2 && (
                  <motion.button type="button" onClick={() => setStep(step - 1)}
                    className="flex-1 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.03)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.08)" }}
                    whileHover={{ background: "rgba(255,255,255,0.06)", scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}>
                    <ArrowLeft className={`w-4 h-4 transition-transform ${isRTL ? "rotate-180" : ""}`} />
                    {isRTL ? "رجوع" : "Back"}
                  </motion.button>
                )}

                {step === 4 && (
                  <motion.button type="button" onClick={() => setStep(3)}
                    className="flex-1 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.03)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.08)" }}
                    whileHover={{ background: "rgba(255,255,255,0.06)", scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}>
                    <ArrowLeft className={`w-4 h-4 transition-transform ${isRTL ? "rotate-180" : ""}`} />
                    {isRTL ? "رجوع" : "Back"}
                  </motion.button>
                )}

                {step === 1 && (
                  <motion.button type="button" onClick={onBackToLogin}
                    className="flex-1 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.03)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.08)" }}
                    whileHover={{ background: "rgba(255,255,255,0.06)", scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}>
                    {isRTL ? "لديك حساب؟" : "Have Account?"}
                  </motion.button>
                )}

                {step < 3 ? (
                  <motion.button type="button" onClick={handleNext} disabled={apiLoading}
                    className="flex-1 py-3.5 rounded-xl text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer disabled:opacity-60"
                    style={{ background: `linear-gradient(135deg, ${currentColor}, ${currentColor}cc)`, color: "#060a10", boxShadow: `0 8px 30px ${currentColor}30` }}
                    whileHover={!apiLoading ? { scale: 1.02, boxShadow: `0 12px 40px ${currentColor}40` } : {}}
                    whileTap={!apiLoading ? { scale: 0.98 } : {}}>
                    {apiLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />{isRTL ? "جاري التسجيل..." : "Registering..."}</>
                    ) : (
                      <>{isRTL ? "التالي" : "Next"}<ArrowRight className={`w-4 h-4 transition-transform ${isRTL ? "rotate-180" : ""}`} /></>
                    )}
                    {!apiLoading && (
                      <motion.div className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
                        animate={{ left: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }} />
                    )}
                  </motion.button>
                ) : step === 4 ? (
                  <motion.button type="button" onClick={() => setStep(5)}
                    className="flex-1 py-3.5 rounded-xl text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer"
                    style={{ background: `linear-gradient(135deg, #facc15, #f59e0b)`, color: "#060a10", boxShadow: `0 8px 30px rgba(250,204,21,0.3)` }}
                    whileHover={{ scale: 1.02, boxShadow: `0 12px 40px rgba(250,204,21,0.4)` }}
                    whileTap={{ scale: 0.98 }}>
                    <motion.div className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
                      animate={{ left: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }} />
                    <Send className="w-4 h-4" />
                    {isRTL ? "متابعة الدفع" : "Proceed to Pay"}
                  </motion.button>
                ) : step === 5 ? (
                  <motion.button type="button" onClick={handleConfirmPayment}
                    className="flex-1 py-3.5 rounded-xl text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer"
                    style={{ background: `linear-gradient(135deg, ${accent}, #00c890)`, color: "#060a10", boxShadow: `0 8px 30px ${accentG}0.3)` }}
                    whileHover={{ scale: 1.02, boxShadow: `0 12px 40px ${accentG}0.4)` }}
                    whileTap={{ scale: 0.98 }}>
                    <motion.div className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
                      animate={{ left: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }} />
                    <CircleCheck className="w-4 h-4" />
                    {isRTL ? "أؤكد تحويل المبلغ" : "Confirm Payment Sent"}
                  </motion.button>
                ) : null}
              </div>
            )}
          </div>

          {/* Bottom LED */}
          <motion.div className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{ background: `linear-gradient(90deg, transparent 10%, ${currentColor}50 40%, ${currentColor}50 60%, transparent 90%)` }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
        </div>

        {/* Stats (show only on steps 1-2) */}
        {step <= 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-5 grid grid-cols-3 gap-3">
            {[
              { icon: Rocket, text: "10,000+", label: isRTL ? "متداول" : "Traders" },
              { icon: Star, text: "4.9/5", label: isRTL ? "تقييم" : "Rating" },
              { icon: Trophy, text: "50+", label: isRTL ? "سوق" : "Markets" }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div key={i} whileHover={{ scale: 1.05, borderColor: `${currentColor}30` }}
                  className="p-3 rounded-xl text-center"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <Icon className="w-4 h-4 mx-auto mb-1" style={{ color: currentColor }} />
                  <p className="font-black text-sm text-white">{stat.text}</p>
                  <p className="text-[10px] text-gray-500 font-medium">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>

      {/* Version badge */}
      <motion.div className="absolute bottom-4 text-center z-10 left-0 right-0"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <span className="text-[10px] text-gray-700 tracking-[0.3em] uppercase font-semibold">
          PHASE X — STRUCTURAL DYNAMICS
        </span>
      </motion.div>
    </div>
  );
}