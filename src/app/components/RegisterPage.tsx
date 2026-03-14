import { useState, useMemo } from "react";
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
  CircleCheck
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

interface RegisterPageProps {
  onRegister: () => void;
  onBackToLogin: () => void;
}

export function RegisterPage({ onRegister, onBackToLogin }: RegisterPageProps) {
  const { language, t } = useLanguage();
  const { login, submitReceipt } = useAuth();
  const isRTL = language === "ar";

  const [step, setStep] = useState(1);
  const [focused, setFocused] = useState<string | null>(null);
  const [aiAddon, setAiAddon] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    subscriptionType: "quarterly"
  });
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

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

  const countries = [
    { value: "ae", label: isRTL ? "الإمارات" : "UAE" },
    { value: "sa", label: isRTL ? "السعودية" : "Saudi Arabia" },
    { value: "eg", label: isRTL ? "مصر" : "Egypt" },
    { value: "jo", label: isRTL ? "الأردن" : "Jordan" },
    { value: "lb", label: isRTL ? "لبنان" : "Lebanon" },
    { value: "kw", label: isRTL ? "الكويت" : "Kuwait" },
    { value: "qa", label: isRTL ? "قطر" : "Qatar" },
    { value: "bh", label: isRTL ? "البحرين" : "Bahrain" },
    { value: "om", label: isRTL ? "عُمان" : "Oman" },
    { value: "iq", label: isRTL ? "العراق" : "Iraq" },
    { value: "sy", label: isRTL ? "سوريا" : "Syria" },
    { value: "ye", label: isRTL ? "اليمن" : "Yemen" },
    { value: "ps", label: isRTL ? "فلسطين" : "Palestine" },
    { value: "ma", label: isRTL ? "المغرب" : "Morocco" },
    { value: "dz", label: isRTL ? "الجزائر" : "Algeria" },
    { value: "tn", label: isRTL ? "تونس" : "Tunisia" },
    { value: "ly", label: isRTL ? "ليبيا" : "Libya" },
    { value: "sd", label: isRTL ? "السودان" : "Sudan" },
    { value: "us", label: isRTL ? "أمريكا" : "USA" },
    { value: "gb", label: isRTL ? "بريطانيا" : "UK" },
    { value: "tr", label: isRTL ? "تركيا" : "Turkey" },
    { value: "other", label: isRTL ? "أخرى" : "Other" }
  ];

  const subscriptionTypes = [
    {
      id: "monthly",
      name: isRTL ? "شهري" : "Monthly",
      price: 75,
      frequency: isRTL ? "شهر" : "month",
      color: "#3b82f6",
      icon: Zap,
      save: "",
      features: [
        isRTL ? "5 مؤشرات تقنية" : "5 Technical Indicators",
        isRTL ? "جميع الأسواق" : "All Markets",
        isRTL ? "دعم فني" : "Technical Support",
        isRTL ? "تحديثات يومية" : "Daily Updates"
      ]
    },
    {
      id: "quarterly",
      name: isRTL ? "ربع سنوي" : "Quarterly",
      price: 202.50,
      frequency: isRTL ? "3 أشهر" : "3 months",
      color: accent,
      icon: Star,
      popular: true,
      save: isRTL ? "وفر 10%" : "Save 10%",
      features: [
        isRTL ? "كل مميزات الشهري" : "All Monthly Features",
        isRTL ? "دعم أولوية" : "Priority Support",
        isRTL ? "تحليلات متقدمة" : "Advanced Analytics",
        isRTL ? "جلسات تدريب" : "Training Sessions",
        isRTL ? "تنبيهات فورية" : "Instant Alerts"
      ]
    },
    {
      id: "semi-annual",
      name: isRTL ? "نصف سنوي" : "Semi-Annual",
      price: 382.50,
      frequency: isRTL ? "6 أشهر" : "6 months",
      color: "#a855f7",
      icon: Crown,
      save: isRTL ? "وفر 15%" : "Save 15%",
      features: [
        isRTL ? "كل مميزات الربع سنوي" : "All Quarterly Features",
        isRTL ? "استشارة خاصة" : "1-on-1 Consultation",
        isRTL ? "إشارات ألفا" : "Alpha Signal Access"
      ]
    },
    {
      id: "annual",
      name: isRTL ? "سنوي" : "Annual",
      price: 720,
      frequency: isRTL ? "سنة" : "year",
      color: "#facc15",
      icon: Trophy,
      save: isRTL ? "وفر 20%" : "Save 20%",
      features: [
        isRTL ? "كل مميزات النصف سنوي" : "All Semi-Annual Features",
        isRTL ? "مدير حساب خاص" : "Dedicated Manager",
        isRTL ? "عضوية VIP" : "VIP Status",
        isRTL ? "تقارير مخصصة" : "Custom Reports"
      ]
    }
  ];

  const selectedSub = subscriptionTypes.find(s => s.id === formData.subscriptionType);
  const totalAmount = (selectedSub?.price || 0) + (aiAddon ? 20 : 0);

  const stepColors = ["#448aff", accent, "#ffc400", accent, "#00e5a0"];

  const steps = [
    { id: 1, title: isRTL ? "البيانات" : "Personal", icon: User },
    { id: 2, title: isRTL ? "الحساب" : "Account", icon: Mail },
    { id: 3, title: isRTL ? "الباقة" : "Plan", icon: Crown },
    { id: 4, title: isRTL ? "الدفع" : "Payment", icon: Send },
    { id: 5, title: isRTL ? "الانتظار" : "Pending", icon: Clock },
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName) {
        alert(isRTL ? "يرجى إدخال الاسم الكامل" : "Please enter your full name");
        return;
      }
    } else if (step === 2) {
      if (!formData.email || !formData.password || !formData.confirmPassword || !formData.country) {
        alert(isRTL ? "يرجى إكمال جميع الحقول" : "Please complete all fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert(isRTL ? "كلمتا المرور غير متطابقتين" : "Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        alert(isRTL ? "كلمة المرور قصيرة جداً" : "Password too short");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleConfirmPayment = () => {
    login(formData.email, `${formData.firstName} ${formData.lastName}`);
    submitReceipt(formData.subscriptionType as any, aiAddon);
    setStep(5);
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
        className={`w-full relative z-10 ${step <= 2 ? 'max-w-2xl' : 'max-w-4xl'}`}>

        {/* Main Card */}
        <div className="rounded-2xl overflow-hidden relative"
          style={{
            background: "linear-gradient(160deg, rgba(14,20,33,0.92) 0%, rgba(8,12,22,0.96) 100%)",
            border: `1px solid ${currentColor}18`,
            boxShadow: `0 25px 80px rgba(0,0,0,0.5), 0 0 60px ${currentColor}08, inset 0 1px 0 rgba(255,255,255,0.04)`,
            maxHeight: step === 5 ? "auto" : "85vh",
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

              {/* Step 3 - Choose Plan + AI Addon */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-4">
                  <div className="text-center mb-4">
                    <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                      style={{ background: `${stepColors[2]}12`, border: `1px solid ${stepColors[2]}25` }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}>
                      <Crown className="w-4 h-4" style={{ color: stepColors[2] }} />
                      <span className="text-sm font-bold" style={{ color: stepColors[2] }}>
                        {isRTL ? "اختر باقتك المثالية" : "Choose your perfect plan"}
                      </span>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {subscriptionTypes.map((sub) => {
                      const Icon = sub.icon;
                      const isSelected = formData.subscriptionType === sub.id;
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
                                {isRTL ? "الأفضل" : "Best"}
                              </div>
                            </div>
                          )}

                          {sub.save && (
                            <div className={`absolute -top-2.5 ${isRTL ? 'left-3' : 'right-3'}`}>
                              <div className="px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider"
                                style={{ background: `${sub.color}20`, color: sub.color, border: `1px solid ${sub.color}30` }}>
                                {sub.save}
                              </div>
                            </div>
                          )}

                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{
                                background: isSelected ? `linear-gradient(135deg, ${sub.color}, ${sub.color}88)` : `${sub.color}15`,
                                border: `1px solid ${sub.color}30`,
                              }}>
                              <Icon className="w-5 h-5" style={{ color: isSelected ? "#fff" : sub.color }} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-1.5 mb-1">
                                <h4 className="text-sm font-black text-white">{sub.name}</h4>
                                <span className="text-lg font-black" style={{ color: sub.color }}>${sub.price}</span>
                                <span className="text-[10px] text-gray-500 font-medium">/{sub.frequency}</span>
                              </div>
                              <ul className="space-y-0.5">
                                {sub.features.map((f, i) => (
                                  <li key={i} className="flex items-center gap-1.5 text-[11px]">
                                    <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: isSelected ? sub.color : "#4b5563" }} />
                                    <span className={isSelected ? "text-gray-300" : "text-gray-500"}>{f}</span>
                                  </li>
                                ))}
                              </ul>
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
                          Phase-X AI <Zap size={12} className="text-[#00e5a0]" />
                        </h4>
                        <p className="text-[11px] text-gray-400">
                          {isRTL ? "3,000 نقطة ذكاء اصطناعي — $20/شهر" : "3,000 AI Tokens — $20/mo"}
                        </p>
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${aiAddon ? 'border-[#00e5a0] bg-[#00e5a0]/20 text-[#00e5a0]' : 'border-[#4b5563] text-transparent'}`}>
                      <Check size={16} strokeWidth={4} />
                    </div>
                  </motion.div>

                  {/* Total */}
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{isRTL ? "المجموع" : "Total"}</span>
                    <span className="text-xl font-black text-white">${totalAmount.toFixed(2)}</span>
                  </div>
                </motion.div>
              )}

              {/* Step 4 - Payment */}
              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-4">
                  <div className="text-center mb-3">
                    <div className="w-16 h-16 bg-[#00e5a0]/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-[#00e5a0]/30 shadow-[0_0_20px_rgba(0,229,160,0.2)]">
                      <Send size={28} className="text-[#00e5a0]" />
                    </div>
                    <h2 className="text-xl font-black text-white">{isRTL ? "تأكيد الدفع" : "Confirm Payment"}</h2>
                    <p className="text-gray-400 mt-1 text-xs">{isRTL ? "أرسل المبلغ التالي بالضبط يدوياً" : "Send exactly this amount manually"}</p>
                  </div>

                  <div className="p-4 rounded-xl flex justify-between items-center bg-[#0b0e14] border border-[#1c2230]">
                    <span className="font-black text-gray-400 uppercase tracking-widest text-xs">{isRTL ? "المبلغ المطلوب" : "Amount Due"}</span>
                    <span className="text-3xl font-black text-[#00e5a0]">${totalAmount.toFixed(2)}</span>
                  </div>

                  {/* Telegram */}
                  <div className="p-5 rounded-xl border border-[#0088cc]/30 bg-[#0088cc]/5 hover:border-[#0088cc] transition-colors">
                    <h3 className="font-black mb-1.5 flex items-center gap-2 text-white text-sm">
                      <div className="bg-[#0088cc] text-black w-6 h-6 rounded-full flex items-center justify-center"><Send size={12} /></div>
                      {isRTL ? "تيليجرام" : "Telegram"}
                    </h3>
                    <p className="text-[11px] text-gray-400 mb-3">{isRTL ? "أرسل إثبات الدفع للوكيل المعتمد" : "Send payment proof to a trusted agent"}</p>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between cursor-pointer" onClick={() => copyToClipboard("@PhaeX_Ai")}>
                        <span className="font-mono text-sm font-bold text-white">@PhaeX_Ai</span>
                        <div className="text-[#0088cc] bg-[#0088cc]/10 p-1.5 rounded-lg"><Send size={14} /></div>
                      </div>
                      <div className="p-3 rounded-lg border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between cursor-pointer" onClick={() => copyToClipboard("@PhaseX_Ai_SupportBot")}>
                        <span className="font-mono text-sm font-bold text-white">@PhaseX_Ai_SupportBot</span>
                        <div className="text-[#0088cc] bg-[#0088cc]/10 p-1.5 rounded-lg"><Send size={14} /></div>
                      </div>
                    </div>
                  </div>

                  {/* Crypto */}
                  <div className="p-5 rounded-xl border border-[#f7931a]/30 bg-[#f7931a]/5 hover:border-[#f7931a] transition-colors">
                    <h3 className="font-black mb-1.5 flex items-center gap-2 text-white text-sm">
                      <div className="bg-[#f7931a] text-black w-6 h-6 rounded-full flex items-center justify-center"><Zap size={12} /></div>
                      USDT TRC20
                    </h3>
                    <p className="text-[11px] text-gray-400 mb-3">{isRTL ? "أرسل المبلغ بالضبط من محفظتك" : "Send exact amount from your wallet"}</p>
                    <div className="p-3 rounded-lg border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between cursor-pointer" onClick={() => copyToClipboard(walletAddress)}>
                      <span className="font-mono text-xs font-bold break-all text-white max-w-[85%]">{walletAddress}</span>
                      <div className="text-[#f7931a] shrink-0 bg-[#f7931a]/10 p-1.5 rounded-lg ml-2"><Send size={16} /></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5 - Pending */}
              {step === 5 && (
                <motion.div key="s5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center">
                  <motion.div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 relative"
                    style={{ background: `linear-gradient(135deg, rgba(0,229,160,0.2) 0%, transparent 100%)` }}>
                    <motion.div className="absolute inset-0 border-4 rounded-full border-t-[#00e5a0] border-r-transparent border-b-[#00e5a0] border-l-transparent"
                      animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                    <Check size={44} color="#00e5a0" />
                  </motion.div>
                  <h2 className="text-2xl font-black mb-3 text-white">{isRTL ? "قيد المراجعة" : "Verification Pending"}</h2>
                  <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed font-medium mb-6">
                    {isRTL ? "يتم التحقق من الدفعة الآن. سيتم منحك وصول كامل للمنصة خلال 2-4 ساعات. يمكنك إغلاق هذه الصفحة." : "Your payment is being verified. You will be granted full access within 2-4 hours. You may close this page."}
                  </p>
                  <motion.button onClick={onRegister}
                    className="px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm text-black"
                    style={{ background: "#00e5a0", boxShadow: "0 10px 30px rgba(0,229,160,0.3)" }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}>
                    {isRTL ? "حسناً، شكراً" : "OK, Got It"}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons (steps 1-4 only) */}
            {step <= 4 && (
              <div className="flex gap-3 mt-6">
                {step > 1 && (
                  <motion.button type="button" onClick={() => setStep(step - 1)}
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
                  <motion.button type="button" onClick={handleNext}
                    className="flex-1 py-3.5 rounded-xl text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer"
                    style={{ background: `linear-gradient(135deg, ${currentColor}, ${currentColor}cc)`, color: "#060a10", boxShadow: `0 8px 30px ${currentColor}30` }}
                    whileHover={{ scale: 1.02, boxShadow: `0 12px 40px ${currentColor}40` }}
                    whileTap={{ scale: 0.98 }}>
                    <motion.div className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
                      animate={{ left: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }} />
                    {isRTL ? "التالي" : "Next"}
                    <ArrowRight className={`w-4 h-4 transition-transform ${isRTL ? "rotate-180" : ""}`} />
                  </motion.button>
                ) : step === 3 ? (
                  <motion.button type="button" onClick={() => setStep(4)}
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
                ) : (
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
                )}
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