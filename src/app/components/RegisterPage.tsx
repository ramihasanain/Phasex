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
  Gift,
  Check
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface RegisterPageProps {
  onRegister: () => void;
  onBackToLogin: () => void;
}

export function RegisterPage({ onRegister, onBackToLogin }: RegisterPageProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [step, setStep] = useState(1);
  const [focused, setFocused] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    subscriptionType: "quarterly"
  });

  const accent = "#00e5a0";
  const accentG = "rgba(0,229,160,";

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
      price: "$29",
      period: isRTL ? "/شهر" : "/month",
      color: "#448aff",
      colorG: "rgba(68,138,255,",
      icon: Zap,
      save: "",
      features: [
        isRTL ? "5 مؤشرات فنية" : "5 Technical Indicators",
        isRTL ? "جميع الأسواق" : "All Markets",
        isRTL ? "دعم فني" : "Technical Support",
        isRTL ? "تحديثات يومية" : "Daily Updates"
      ]
    },
    {
      id: "quarterly",
      name: isRTL ? "ربع سنوي" : "Quarterly",
      price: "$69",
      period: isRTL ? "/3 أشهر" : "/3 months",
      color: accent,
      colorG: accentG,
      icon: Star,
      popular: true,
      save: isRTL ? "وفّر 20%" : "Save 20%",
      features: [
        isRTL ? "كل مميزات الشهري" : "All Monthly Features",
        isRTL ? "دعم أولوية" : "Priority Support",
        isRTL ? "تحليلات متقدمة" : "Advanced Analytics",
        isRTL ? "جلسات تدريبية" : "Training Sessions",
        isRTL ? "إشعارات فورية" : "Instant Alerts"
      ]
    },
    {
      id: "annual",
      name: isRTL ? "سنوي" : "Annual",
      price: "$199",
      period: isRTL ? "/سنة" : "/year",
      color: "#ffc400",
      colorG: "rgba(255,196,0,",
      icon: Trophy,
      save: isRTL ? "وفّر 43%" : "Save 43%",
      features: [
        isRTL ? "كل المميزات السابقة" : "All Previous Features",
        isRTL ? "دعم VIP 24/7" : "VIP Support 24/7",
        isRTL ? "استراتيجيات حصرية" : "Exclusive Strategies",
        isRTL ? "استشارات شخصية" : "Personal Consultations",
        isRTL ? "وصول مبكر للمزايا" : "Early Access to Features",
        isRTL ? "تقارير مخصصة" : "Custom Reports"
      ]
    }
  ];

  const stepColors = ["#448aff", accent, "#ffc400"];

  const steps = [
    { id: 1, title: isRTL ? "المعلومات الشخصية" : "Personal Info", icon: User },
    { id: 2, title: isRTL ? "معلومات الحساب" : "Account Details", icon: Mail },
    { id: 3, title: isRTL ? "اختر خطتك" : "Choose Plan", icon: Crown },
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName) {
        alert(isRTL ? "الرجاء إدخال الاسم الكامل" : "Please enter your full name");
        return;
      }
    } else if (step === 2) {
      if (!formData.email || !formData.password || !formData.confirmPassword || !formData.country) {
        alert(isRTL ? "الرجاء إكمال جميع الحقول" : "Please complete all fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert(isRTL ? "كلمتا المرور غير متطابقتين" : "Passwords don't match");
        return;
      }
      if (formData.password.length < 6) {
        alert(isRTL ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = () => {
    const selectedPlan = subscriptionTypes.find(s => s.id === formData.subscriptionType);
    alert(isRTL
      ? `🎉 مرحباً ${formData.firstName}! تم إنشاء حسابك بنجاح!\nاشتراكك: ${selectedPlan?.name} - ${selectedPlan?.price}`
      : `🎉 Welcome ${formData.firstName}! Your account has been created successfully!\nSubscription: ${selectedPlan?.name} - ${selectedPlan?.price}`
    );
    onRegister();
  };

  // Particles
  const particles = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 3 + 1, duration: 3 + Math.random() * 6, delay: Math.random() * 5,
    driftX: (Math.random() - 0.5) * 50, driftY: -(15 + Math.random() * 40),
  })), []);

  const currentColor = stepColors[step - 1];

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
      dir={isRTL ? "rtl" : "ltr"}
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
        className="w-full max-w-2xl relative z-10">

        {/* Main Card */}
        <div className="rounded-2xl overflow-hidden relative"
          style={{
            background: "linear-gradient(160deg, rgba(14,20,33,0.92) 0%, rgba(8,12,22,0.96) 100%)",
            border: `1px solid ${currentColor}18`,
            boxShadow: `0 25px 80px rgba(0,0,0,0.5), 0 0 60px ${currentColor}08, inset 0 1px 0 rgba(255,255,255,0.04)`,
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
              {isRTL ? "انضم إلى PHASE X" : "Join PHASE X"}
            </motion.h1>
            <p className="text-gray-500 text-xs font-medium tracking-wide">
              {isRTL ? "أكمل البيانات وابدأ رحلتك" : "Complete your details and start your journey"}
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
                        className="w-11 h-11 rounded-full flex items-center justify-center relative"
                        style={{
                          background: isCompleted || isActive
                            ? `linear-gradient(135deg, ${sColor}, ${sColor}aa)`
                            : "rgba(255,255,255,0.04)",
                          border: `1px solid ${isCompleted || isActive ? `${sColor}60` : "rgba(255,255,255,0.06)"}`,
                          boxShadow: isActive ? `0 0 20px ${sColor}40, 0 0 40px ${sColor}15` : "none",
                        }}
                        whileHover={{ scale: 1.1 }}>
                        {isCompleted ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <StepIcon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-600"}`} />
                        )}
                        {isActive && (
                          <motion.div className="absolute inset-0 rounded-full"
                            style={{ background: `radial-gradient(circle, ${sColor}30 0%, transparent 70%)` }}
                            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }} />
                        )}
                      </motion.div>
                      <span className={`text-[10px] mt-1.5 font-bold tracking-wide ${isActive ? "text-white" : "text-gray-600"}`}>
                        {s.title}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className="h-[2px] flex-1 mx-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
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
              {/* Step 1 */}
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
                    {renderInput("lastName", "text", isRTL ? "الاسم الأخير" : "Last Name", formData.lastName, v => setFormData({ ...formData, lastName: v }), <User className="w-4 h-4" />)}
                  </div>

                  <motion.div className="p-4 rounded-xl" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    style={{ background: `${stepColors[0]}08`, border: `1px solid ${stepColors[0]}18` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${stepColors[0]}, ${stepColors[0]}88)` }}>
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: stepColors[0] }}>{isRTL ? "مرحباً بك!" : "Welcome!"}</p>
                        <p className="text-xs text-gray-500">{isRTL ? "أنت على بُعد خطوات من الانطلاق" : "You're steps away from starting"}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-4">
                  <div className="text-center mb-4">
                    <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                      style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}>
                      <Lock className="w-4 h-4" style={{ color: accent }} />
                      <span className="text-sm font-bold" style={{ color: accent }}>
                        {isRTL ? "احمِ حسابك" : "Secure your account"}
                      </span>
                    </motion.div>
                  </div>

                  {renderInput("email", "email", isRTL ? "البريد الإلكتروني" : "Email", formData.email, v => setFormData({ ...formData, email: v }), <Mail className="w-4 h-4" />)}

                  <div className="grid grid-cols-2 gap-3">
                    {renderInput("password", "password", isRTL ? "كلمة المرور" : "Password", formData.password, v => setFormData({ ...formData, password: v }), <Lock className="w-4 h-4" />)}
                    {renderInput("confirmPassword", "password", isRTL ? "تأكيد" : "Confirm", formData.confirmPassword, v => setFormData({ ...formData, confirmPassword: v }), <Lock className="w-4 h-4" />)}
                  </div>

                  <div className="relative">
                    <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{ border: `1px solid ${focused === "country" ? accent : "rgba(255,255,255,0.06)"}`, boxShadow: focused === "country" ? `0 0 20px ${accentG}0.15)` : "none" }} />
                    <select value={formData.country}
                      onChange={e => setFormData({ ...formData, country: e.target.value })}
                      onFocus={() => setFocused("country")} onBlur={() => setFocused(null)}
                      className="w-full bg-[rgba(255,255,255,0.03)] text-white rounded-xl py-3.5 px-4 text-sm font-medium outline-none appearance-none cursor-pointer"
                      style={{ paddingLeft: isRTL ? "16px" : "44px", paddingRight: isRTL ? "44px" : "16px" }}>
                      <option value="" className="bg-[#0a0e18]">{isRTL ? "اختر البلد" : "Select Country"}</option>
                      {countries.map(c => <option key={c.value} value={c.value} className="bg-[#0a0e18]">{c.label}</option>)}
                    </select>
                    <MapPin className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-4 h-4`}
                      style={{ color: focused === "country" ? accent : "#4b5563" }} />
                  </div>

                  <motion.div className="p-4 rounded-xl" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    style={{ background: `${accent}08`, border: `1px solid ${accent}18` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}88)` }}>
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: accent }}>{isRTL ? "بياناتك آمنة!" : "Your data is safe!"}</p>
                        <p className="text-xs text-gray-500">{isRTL ? "نستخدم أعلى معايير التشفير" : "We use top encryption standards"}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-5">
                  <div className="text-center mb-4">
                    <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                      style={{ background: `${stepColors[2]}12`, border: `1px solid ${stepColors[2]}25` }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}>
                      <Crown className="w-4 h-4" style={{ color: stepColors[2] }} />
                      <span className="text-sm font-bold" style={{ color: stepColors[2] }}>
                        {isRTL ? "اختر خطتك المثالية" : "Choose your perfect plan"}
                      </span>
                    </motion.div>
                  </div>

                  <div className="grid gap-3">
                    {subscriptionTypes.map((sub) => {
                      const Icon = sub.icon;
                      const isSelected = formData.subscriptionType === sub.id;
                      return (
                        <motion.button key={sub.id} type="button"
                          onClick={() => setFormData({ ...formData, subscriptionType: sub.id })}
                          className={`relative p-5 rounded-2xl transition-all text-${isRTL ? 'right' : 'left'} cursor-pointer`}
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
                            <div className={`absolute -top-3 ${isRTL ? 'right-4' : 'left-4'}`}>
                              <div className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-wider text-black"
                                style={{ background: `linear-gradient(90deg, ${accent}, #00c890)`, boxShadow: `0 0 15px ${accent}50` }}>
                                <Star className="w-3 h-3" />
                                {isRTL ? "الأفضل" : "Best Choice"}
                              </div>
                            </div>
                          )}

                          {sub.save && (
                            <div className={`absolute -top-3 ${isRTL ? 'left-4' : 'right-4'}`}>
                              <div className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider"
                                style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}30` }}>
                                {sub.save}
                              </div>
                            </div>
                          )}

                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{
                                background: isSelected ? `linear-gradient(135deg, ${sub.color}, ${sub.color}88)` : `${sub.color}15`,
                                border: `1px solid ${sub.color}30`,
                                boxShadow: isSelected ? `0 0 15px ${sub.color}30` : "none",
                              }}>
                              <Icon className="w-6 h-6" style={{ color: isSelected ? "#fff" : sub.color }} />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-baseline gap-2 mb-2">
                                <h4 className="text-lg font-black text-white">{sub.name}</h4>
                                <span className="text-2xl font-black" style={{ color: sub.color }}>{sub.price}</span>
                                <span className="text-xs text-gray-500 font-medium">{sub.period}</span>
                              </div>
                              <ul className="space-y-1.5 mt-2">
                                {sub.features.map((f, i) => (
                                  <li key={i} className={`flex items-center gap-2 text-[12px] ${isRTL ? "flex-row-reverse" : ""}`}>
                                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isSelected ? sub.color : "#4b5563" }} />
                                    <span className={isSelected ? "text-gray-300" : "text-gray-500"}>{f}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {isSelected && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                                  style={{ background: `${sub.color}20`, border: `2px solid ${sub.color}` }}>
                                  <Check className="w-4 h-4" style={{ color: sub.color }} />
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  <motion.div className="p-4 rounded-xl" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    style={{ background: `${stepColors[2]}08`, border: `1px solid ${stepColors[2]}18` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${stepColors[2]}, ${stepColors[2]}88)` }}>
                        <Gift className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: stepColors[2] }}>{isRTL ? "عرض خاص!" : "Special Offer!"}</p>
                        <p className="text-xs text-gray-500">{isRTL ? "جميع الخطط تشمل 7 أيام تجربة مجانية" : "All plans include 7-day free trial"}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <motion.button type="button" onClick={() => setStep(step - 1)}
                  className="flex-1 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.03)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.08)" }}
                  whileHover={{ background: "rgba(255,255,255,0.06)", scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}>
                  <ArrowLeft className="w-4 h-4" />
                  {isRTL ? "رجوع" : "Back"}
                </motion.button>
              )}

              {step === 1 && (
                <motion.button type="button" onClick={onBackToLogin}
                  className="flex-1 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.03)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.08)" }}
                  whileHover={{ background: "rgba(255,255,255,0.06)", scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}>
                  {isRTL ? "لديك حساب؟" : "Have account?"}
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
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button type="button" onClick={handleSubmit}
                  className="flex-1 py-3.5 rounded-xl text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${accent}, #00c890)`, color: "#060a10", boxShadow: `0 8px 30px ${accentG}0.3)` }}
                  whileHover={{ scale: 1.02, boxShadow: `0 12px 40px ${accentG}0.4)` }}
                  whileTap={{ scale: 0.98 }}>
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
                    animate={{ left: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }} />
                  <Rocket className="w-4 h-4" />
                  {isRTL ? "ابدأ الآن!" : "Start Now!"}
                </motion.button>
              )}
            </div>
          </div>

          {/* Bottom LED */}
          <motion.div className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{ background: `linear-gradient(90deg, transparent 10%, ${currentColor}50 40%, ${currentColor}50 60%, transparent 90%)` }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
        </div>

        {/* Stats */}
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