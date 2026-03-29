import { useState, useMemo, useRef, useCallback, useEffect, type ReactNode } from "react";
import { motion } from "motion/react";
import {
  User,
  Mail,
  Lock,
  MapPin,
  Crown,
  MailCheck,
  Send,
  Clock,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import { registerUser, resendVerification, getMe, loginUser, getCountries } from "../../api/authApi";
import { getPlans, getAddons, checkoutSubmit, checkoutPreview } from "../../api/subscriptionsApi";
import type { APIAddon, APIPlan, APICountry, APIUser } from "../../api/types";
import type { RegisterPageProps } from "./types";
import { LANGUAGE_OPTIONS } from "./registerLanguageOptions";
import { mapPlansToRows } from "./registerPlanUtils";

export function useRegisterWizard({ onRegister, onBackToLogin }: RegisterPageProps) {
  const { language, t, setLanguageKey } = useLanguage();
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
    subscriptionType: "trader",
  });
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [verifyChecking, setVerifyChecking] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [apiPlans, setApiPlans] = useState<APIPlan[]>([]);
  const [apiAddons, setApiAddons] = useState<APIAddon[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [previewTotal, setPreviewTotal] = useState<number | null>(null);

  const [apiCountries, setApiCountries] = useState<APICountry[]>([]);

  useEffect(() => {
    getCountries()
      .then((list) => setApiCountries(list))
      .catch((err) => console.error("[PhaseX] Failed to load countries:", err));
  }, []);

  const languageOptions = LANGUAGE_OPTIONS;
  const currentLangObj = languageOptions.find((l) => l.code === language) || languageOptions[0];

  const accent = "#00e5a0";
  const accentG = "rgba(0,229,160,";
  const walletAddress = "TQwFCKK5JjZACHdE888zG5iUx8wQ2RtnAV";

  const countries = apiCountries.map((c) => ({
    value: String(c.id),
    label: isRTL ? c.name_ar : c.name_en,
  }));

  const subscriptionTypes = useMemo(
    () => mapPlansToRows(apiPlans, accent),
    [apiPlans, accent]
  );

  const aiAddonData = apiAddons.find((a) => a.code === "ai_insight");
  const aiAddonPriceMonthly = aiAddonData ? parseFloat(aiAddonData.base_price_monthly) : 20;
  const aiAddonPriceAnnual = aiAddonData
    ? parseFloat(aiAddonData.base_price_annual_monthly) * 12
    : Math.round(20 * 12 * 0.8);

  const selectedSub = subscriptionTypes.find((s) => s.id === formData.subscriptionType);
  const getPrice = (sub: (typeof subscriptionTypes)[0]) =>
    billingCycle === "yearly" ? sub.priceAnnualTotal : sub.priceMonthly;
  const subtotal =
    (selectedSub ? getPrice(selectedSub) : 0) +
    (aiAddon ? (billingCycle === "yearly" ? aiAddonPriceAnnual : aiAddonPriceMonthly) : 0);

  useEffect(() => {
    if (step === 4 && apiPlans.length === 0 && !plansLoading) {
      setPlansLoading(true);
      const token = accessToken || undefined;
      Promise.all([getPlans(token), getAddons(token)])
        .then(([plans, addons]) => {
          setApiPlans(plans);
          setApiAddons(addons);
          if (plans.length > 0 && !formData.subscriptionType) {
            const popular = plans.find((p) => p.is_popular);
            setFormData((prev) => ({ ...prev, subscriptionType: String(popular?.id || plans[0].id) }));
          }
        })
        .catch((err) => {
          console.error("[PhaseX] Failed to load plans:", err);
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

  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    try {
      await resendVerification(formData.email);
      setResendSuccess(true);
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
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
      let userData: APIUser;
      let tokens: { access: string; refresh: string } | null = null;

      if (accessToken) {
        console.log("[PhaseX] Checking verification via getMe...");
        userData = await getMe(accessToken);
        console.log("[PhaseX] getMe response:", userData);
      } else {
        console.log("[PhaseX] Checking verification via loginUser...");
        const res = await loginUser(formData.email, formData.password);
        console.log("[PhaseX] Login check response:", res);
        userData = res.user;
        tokens = { access: res.access, refresh: res.refresh };
      }

      if (userData.email_verified) {
        if (tokens) {
          loginWithApi(userData, tokens.access, tokens.refresh);
        }
        setEmailVerified();
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current);
          pollTimerRef.current = null;
        }
        setStep(4);
      } else {
        setApiError(
          isRTL ? "البريد لم يتم تفعيله بعد، تحقق من بريدك الإلكتروني" : "Email not verified yet. Please check your inbox."
        );
      }
    } catch (err: any) {
      console.error("[PhaseX] Verification check error:", err);
      const msg = err.message || "";
      if (msg.toLowerCase().includes("verified") || msg.toLowerCase().includes("verify")) {
        setApiError(
          isRTL ? "البريد لم يتم تفعيله بعد، تحقق من بريدك الإلكتروني" : "Email not verified yet. Please check your inbox."
        );
      } else {
        setApiError(
          msg || (isRTL ? "فشل التحقق من حالة البريد" : "Failed to check verification status.")
        );
      }
    } finally {
      setVerifyChecking(false);
    }
  }, [formData.email, formData.password, isRTL, loginWithApi, setEmailVerified, accessToken]);

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
        loginWithApi(res.user, res.access, res.refresh);
        setStep(3);
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
    if (step === 3) {
      await handleCheckVerification();
      return;
    }
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
          console.log("[PhaseX] Checkout preview:", preview);
          const total = parseFloat(preview.total) || totalAmount;
          setPreviewTotal(total);
        } catch (err: any) {
          console.error("[PhaseX] Preview error:", err);
          setPreviewTotal(totalAmount);
        } finally {
          setApiLoading(false);
        }
      }
    }
    setApiError(null);
    setStep(step + 1);
  };

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
        console.log("[PhaseX] Checkout submit payload:", payload);
        console.log("[PhaseX] Displayed total:", totalAmount);
        const result = await checkoutSubmit(token, payload);
        console.log("[PhaseX] Checkout submit result:", result);
      } catch (err: any) {
        console.error("[PhaseX] Checkout submit error:", err);
        setApiError(err.message || (isRTL ? "فشل إرسال الاشتراك" : "Checkout failed."));
        return;
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

  const particles = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: 3 + Math.random() * 6,
        delay: Math.random() * 5,
        driftX: (Math.random() - 0.5) * 50,
        driftY: -(15 + Math.random() * 40),
      })),
    []
  );

  const currentColor = stepColors[Math.min(step - 1, stepColors.length - 1)];

  const inputClass =
    "w-full bg-[rgba(255,255,255,0.03)] text-white placeholder:text-gray-600 rounded-xl py-3.5 px-4 text-sm font-medium outline-none transition-all";

  const renderInput = (
    id: string,
    type: string,
    placeholder: string,
    value: string,
    onChange: (v: string) => void,
    icon: ReactNode
  ) => (
    <div className="relative">
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          border: `1px solid ${focused === id ? currentColor : "rgba(255,255,255,0.06)"}`,
          boxShadow:
            focused === id ? `0 0 20px ${currentColor}25, inset 0 0 12px ${currentColor}08` : "none",
        }}
      />
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(id)}
        onBlur={() => setFocused(null)}
        dir={isRTL ? "rtl" : "ltr"}
        className={inputClass}
        style={{ paddingLeft: isRTL ? "16px" : "44px", paddingRight: isRTL ? "44px" : "16px" }}
      />
      <div
        className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2`}
        style={{ color: focused === id ? currentColor : "#4b5563" }}
      >
        {icon}
      </div>
    </div>
  );

  return {
    onRegister,
    onBackToLogin,
    step,
    setStep,
    focused,
    setFocused,
    aiAddon,
    setAiAddon,
    billingCycle,
    setBillingCycle,
    referralInput,
    setReferralInput,
    referralApplied,
    setReferralApplied,
    referralError,
    setReferralError,
    formData,
    setFormData,
    langDropdownOpen,
    setLangDropdownOpen,
    language,
    t,
    isRTL,
    accent,
    accentG,
    walletAddress,
    countries,
    subscriptionTypes,
    selectedSub,
    plansLoading,
    previewTotal,
    totalAmount,
    subtotal,
    aiAddonData,
    aiAddonPriceMonthly,
    aiAddonPriceAnnual,
    referralDiscountAmount,
    steps,
    stepColors,
    currentColor,
    particles,
    renderInput,
    inputClass,
    apiError,
    setApiError,
    apiLoading,
    verifyChecking,
    resendCooldown,
    resendSuccess,
    languageOptions,
    currentLangObj,
    setLanguageKey,
    handleNext,
    handleResendVerification,
    handleCheckVerification,
    handleConfirmPayment,
    handleApplyReferral,
    handleRemoveReferral,
    copyToClipboard,
    pollTimerRef,
  };
}

export type RegisterWizardValue = ReturnType<typeof useRegisterWizard>;
