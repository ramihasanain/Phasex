import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Crown, Calendar, Clock, Send, Check, ShieldAlert, Zap, X, Shield, Star, Trophy, ArrowRight, CircleCheck, Layers, Activity, Navigation, Target, Move, Gauge } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { motion, AnimatePresence } from "motion/react";

interface SubscriptionPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionPanel({ isOpen, onClose }: SubscriptionPanelProps) {
  const { language, t } = useLanguage();
  const { user, subscriptionPlan, subscriptionStatus, aiTokens, hasAIAccess, submitReceipt, applyReferralCode } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [aiAddon, setAiAddon] = useState(false);
  const [mt5Addon, setMt5Addon] = useState(false);
  const [mt5TermsAccepted, setMt5TermsAccepted] = useState(false);
  const [step, setStep] = useState<"plans" | "payment" | "pending">("plans");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [referralInput, setReferralInput] = useState("");
  const [referralApplied, setReferralApplied] = useState(false);
  const [referralError, setReferralError] = useState(false);
  const isRTL = language === "ar";

  const walletAddress = "TQwFCKK5JjZACHdE888zG5iUx8wQ2RtnAV";

  const subscriptionPlans = [
    {
      id: "core",
      name: t("planCoreName"),
      price: 29,
      iconColor: "#3b82f6",
      icon: <Zap size={24} className="text-[#3b82f6]" />,
      badge: null,
      charts: ["Phase State", "Direction State"],
      features: [t("planCoreF1"), t("planCoreF2"), t("planCoreF3"), t("planCoreF4")],
      limitations: [t("planCoreL1"), t("planCoreL2")],
      description: t("planCoreDesc"),
      suitableFor: t("planCoreSuitable"),
    },
    {
      id: "trader",
      name: t("planTraderName"),
      price: 49,
      iconColor: "#00e5a0",
      icon: <Star size={24} className="text-[#00e5a0]" />,
      badge: { text: t("planTraderBadge"), color: "#00e5a0" },
      charts: ["Phase State", "Direction State", "Oscillation State"],
      features: [t("planTraderF1"), t("planTraderF2"), t("planTraderF3"), t("planTraderF4")],
      limitations: null,
      description: t("planTraderDesc"),
      suitableFor: t("planTraderSuitable"),
    },
    {
      id: "professional",
      name: t("planProName"),
      price: 89,
      iconColor: "#a855f7",
      icon: <Trophy size={24} className="text-[#a855f7]" />,
      badge: { text: t("planProBadge"), color: "#a855f7" },
      charts: ["Phase State", "Direction State", "Oscillation State", "Reference State", "Displacement State"],
      features: [t("planProF1"), t("planProF2"), t("planProF3"), t("planProF4")],
      limitations: null,
      description: t("planProDesc"),
      suitableFor: t("planProSuitable"),
    },
    {
      id: "institutional",
      name: t("planInstName"),
      price: 149,
      iconColor: "#facc15",
      icon: <Crown size={24} className="text-[#facc15]" />,
      badge: { text: t("planInstBadge"), color: "#facc15" },
      charts: ["Phase State", "Direction State", "Oscillation State", "Reference State", "Displacement State", "Envelope State"],
      features: [t("planInstF1"), t("planInstF2"), t("planInstF3"), t("planInstF4"), t("planInstF5")],
      limitations: null,
      description: t("planInstDesc"),
      suitableFor: t("planInstSuitable"),
    },
  ];

  const handleFinish = () => {
      if (!selectedPlan) return;
      submitReceipt(selectedPlan as any, aiAddon, mt5Addon);
      setStep("pending");
      setTimeout(() => {
          onClose();
          setStep("plans");
          setAiAddon(false);
          setMt5Addon(false);
          setSelectedPlan(null);
      }, 3000);
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
  };

  const currentPlan = subscriptionPlans.find(p => p.id === selectedPlan);
  const getPrice = (basePrice: number) => billingCycle === "yearly" ? Math.round(basePrice * 12 * 0.8) : basePrice;
  const subtotal = (currentPlan ? getPrice(currentPlan.price) : 0) + (aiAddon ? (billingCycle === "yearly" ? Math.round(20 * 12 * 0.8) : 20) : 0) + (mt5Addon ? (billingCycle === "yearly" ? Math.round(30 * 12 * 0.8) : 30) : 0);
  const referralDiscountAmount = referralApplied ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const totalAmount = subtotal - referralDiscountAmount;

  const handleApplyReferral = () => {
    setReferralError(false);
    const result = applyReferralCode(referralInput);
    if (result.valid) { setReferralApplied(true); setReferralError(false); }
    else { setReferralApplied(false); setReferralError(true); }
  };
  const handleRemoveReferral = () => { setReferralApplied(false); setReferralInput(""); setReferralError(false); };

  if (!isOpen) return null;

  const isActive = subscriptionStatus === "active";
  const daysRemaining = isActive ? 14 : 0;
  const progressPercent = isActive ? 60 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[32px] relative flex flex-col"
          style={{ background: "#0b0e14", border: `1px solid #1c2230`, boxShadow: `0 30px 60px rgba(0,0,0,0.8)` }}
          dir={isRTL ? "rtl" : "ltr"}
        >
            <button onClick={onClose} className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 z-20 cursor-pointer">
                <X size={26} />
            </button>

            {step === "plans" && (
                <div className="p-10 relative">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle, #6366f1 0%, transparent 60%)`, filter: "blur(60px)" }} />
                    
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative bg-[#10141d] border border-[#6366f1]/30 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                            <Crown size={32} className="text-[#6366f1]" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-white">{t("subscriptionTitle")}</h2>
                            <p className="text-gray-400 font-medium mt-1">{t("subscriptionSubtitle")}</p>
                        </div>
                    </div>

                    {/* Current Plan Status */}
                    <div className="p-8 rounded-[32px] border mb-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
                        style={{ borderColor: isActive ? "#00e5a0" : "#1c2230", background: "#10141d", boxShadow: isActive ? `0 10px 40px rgba(0,229,160,0.05), inset 0 0 20px rgba(0,229,160,0.05)` : "none" }}>
                        
                        <div className="flex-1 w-full">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                <span className={`px-4 py-1.5 rounded-xl text-sm font-black uppercase tracking-widest ${isActive ? 'bg-[#00e5a0]/15 text-[#00e5a0]' : subscriptionStatus === 'pending' ? 'bg-[#facc15]/15 text-[#facc15]' : 'bg-red-500/15 text-red-500'}`}>
                                    {isActive ? t("planActive") : subscriptionStatus === 'pending' ? t("planPending") : t("planNone")}
                                </span>
                                <span className="text-xl font-bold text-white capitalize">{subscriptionPlan === 'none' ? t('guestAccess') : subscriptionPlan}</span>
                            </div>
                            
                            {isActive && (
                                <div className="space-y-4 max-w-lg mt-8">
                                    <div className="flex items-center justify-between text-sm font-bold">
                                        <span className="text-gray-400">{daysRemaining} {t("subDaysRemaining")}</span>
                                        <span className="text-[#00e5a0]">{t("nextBilling")}</span>
                                    </div>
                                    <div className="h-3 rounded-full bg-[#1c2230] overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="h-full bg-[#00e5a0]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {isActive && (
                            <div className="flex items-center gap-6 p-6 rounded-2xl bg-[#0b0e14] border border-[#1c2230] shrink-0">
                                <div className="text-center px-4">
                                    <Clock className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                                    <div className="text-xs text-gray-400 uppercase tracking-widest font-black">{t("validUntil")}</div>
                                    <div className="text-white font-bold mt-1">Dec 31, 2026</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-black text-white">{t("availablePlans")}</h3>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center rounded-full p-1 gap-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <button onClick={() => setBillingCycle("monthly")}
                                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${billingCycle === "monthly" ? "text-black bg-[#6366f1]" : "text-gray-400 hover:text-white"}`}>
                                    {t("billingMonthly")}
                                </button>
                                <button onClick={() => setBillingCycle("yearly")}
                                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${billingCycle === "yearly" ? "text-black bg-[#6366f1]" : "text-gray-400 hover:text-white"}`}>
                                    {t("billingYearly")}
                                </button>
                            </div>
                            {billingCycle === "yearly" && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider text-black" style={{ background: "linear-gradient(90deg, #00e5a0, #00c890)" }}>
                                    {t("save20")}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 w-full">
                        {subscriptionPlans.map((plan) => {
                            const isSelected = selectedPlan === plan.id;
                            const isCurrentPlan = subscriptionPlan === plan.id && subscriptionStatus === "active";
                            
                            return (
                                <motion.div
                                    key={plan.id}
                                    onClick={() => !isCurrentPlan && setSelectedPlan(plan.id)}
                                    whileHover={{ y: isCurrentPlan ? 0 : -5 }}
                                    className={`relative rounded-[24px] p-5 flex flex-col transition-all duration-300 ${isSelected ? 'shadow-2xl' : isCurrentPlan ? 'opacity-80' : 'cursor-pointer hover:bg-[#151a26]'}`}
                                    style={{
                                        backgroundColor: isSelected || isCurrentPlan ? `${plan.iconColor}08` : "#10141d", 
                                        border: `1px solid ${isSelected || isCurrentPlan ? plan.iconColor : "#1c2230"}`,
                                        boxShadow: isSelected ? `0 20px 50px -10px ${plan.iconColor}30, inset 0 0 20px ${plan.iconColor}10` : 'none',
                                    }}
                                >
                                    {isCurrentPlan && (
                                        <div className="absolute top-0 left-5 px-3 py-1 rounded-b-xl text-[9px] uppercase tracking-widest font-black text-white shadow-lg"
                                             style={{ backgroundColor: "#22c55e" }}>
                                            {t("currentPlan")}
                                        </div>
                                    )}

                                    {plan.badge && !isCurrentPlan && (
                                        <div className="absolute top-0 right-5 px-3 py-1 rounded-b-xl text-[9px] uppercase tracking-widest font-black text-black shadow-lg"
                                             style={{ backgroundColor: plan.badge.color }}>
                                            {plan.badge.text}
                                        </div>
                                    )}
                                    
                                    {(isSelected || isCurrentPlan) && (
                                        <div className="absolute top-5 right-5 rounded-full p-0.5 z-20" style={{ color: isCurrentPlan ? "#22c55e" : plan.iconColor, background: isCurrentPlan ? "#22c55e20" : `${plan.iconColor}20` }}>
                                            <Check size={16} strokeWidth={4} />
                                        </div>
                                    )}

                                    {/* Plan name and price */}
                                    <div className="mb-3 mt-2">
                                        <h4 className="text-base font-black text-white mb-0.5">{plan.name}</h4>
                                        <p className="text-[11px] text-gray-500 font-medium leading-snug">{plan.description}</p>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-baseline gap-1">
                                            <div className="text-3xl font-black" style={{ color: isSelected || isCurrentPlan ? plan.iconColor : "#fff" }}>
                                                ${getPrice(plan.price)}
                                            </div>
                                            <span className="text-xs text-gray-500 font-bold">/ {billingCycle === "yearly" ? t("perYear") : t("perMonth")}</span>
                                            {billingCycle === "yearly" && (
                                                <span className="text-[10px] text-gray-600 line-through ml-1">${plan.price * 12}</span>
                                            )}
                                        </div>
                                        {billingCycle === "yearly" && (
                                            <p className="text-[9px] text-[#00e5a0] font-bold mt-1">{t("billedAnnually")} — {t("save20")}</p>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px w-full mb-3" style={{ background: `linear-gradient(90deg, transparent, ${plan.iconColor}30, transparent)` }} />

                                    {/* Chart Access */}
                                    <div className="mb-3">
                                        <p className="text-[10px] uppercase tracking-widest font-black mb-2" style={{ color: plan.iconColor }}>
                                            {t("chartAccess")}
                                        </p>
                                        <div className="space-y-1.5">
                                            {plan.charts.map((chart, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: plan.iconColor }} />
                                                    <span className="text-[11px] text-gray-300 font-medium">{chart}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px w-full mb-3" style={{ background: `linear-gradient(90deg, transparent, ${plan.iconColor}15, transparent)` }} />

                                    {/* Features */}
                                    <div className="mb-3 flex-1">
                                        <p className="text-[10px] uppercase tracking-widest font-black mb-2" style={{ color: plan.iconColor }}>
                                            {t("subFeatures")}
                                        </p>
                                        <ul className="space-y-1.5">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-2 text-[11px]">
                                                    <div className="shrink-0 mt-0.5" style={{ color: isSelected || isCurrentPlan ? plan.iconColor : "#64748b" }}>
                                                        <Check size={12} strokeWidth={3} />
                                                    </div>
                                                    <span className={isSelected || isCurrentPlan ? "text-gray-200 font-medium" : "text-gray-400 font-medium"}>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Limitations */}
                                    {plan.limitations && (
                                        <div className="mb-2">
                                            <ul className="space-y-1.5">
                                                {plan.limitations.map((lim, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-[11px]">
                                                        <div className="shrink-0 mt-0.5 text-red-500/60"><X size={12} strokeWidth={3} /></div>
                                                        <span className="text-gray-500 font-medium">{lim}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Suitable for */}
                                    <div className="mt-auto pt-3" style={{ borderTop: `1px solid ${plan.iconColor}10` }}>
                                        <p className="text-[10px] text-gray-500 leading-relaxed italic">{plan.suitableFor}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {selectedPlan && (
                        <>
                            {/* AI Add-on Section */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="mt-8 p-6 md:p-8 rounded-[24px] flex flex-col md:flex-row items-center justify-between cursor-pointer border transition-all relative z-10"
                                onClick={() => setAiAddon(!aiAddon)}
                                style={{
                                    backgroundColor: aiAddon ? `rgba(0, 229, 160, 0.05)` : "#10141d",
                                    borderColor: aiAddon ? "#00e5a0" : "#1c2230",
                                    boxShadow: aiAddon ? `0 10px 40px rgba(0,229,160,0.15), inset 0 0 20px rgba(0,229,160,0.05)` : 'none'
                                }}
                            >
                                <div className="flex items-center gap-6 md:gap-8">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-[20px] flex items-center justify-center relative bg-[#0b0e14] border border-[#00e5a0]/30 shrink-0">
                                        {aiAddon && <motion.div className="absolute inset-0 rounded-[20px] border-2 border-dashed border-[#00e5a0]/50" animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />}
                                        {aiAddon ? <Zap size={32} className="text-[#00e5a0]" /> : <Clock size={32} className="text-gray-500" />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-black text-white mb-2 flex items-center gap-2">
                                            {t("aiInsightTitle")} <Zap size={18} className="text-[#00e5a0]" />
                                        </h3>
                                        <p className="text-sm md:text-base font-medium text-gray-400 max-w-2xl leading-relaxed">
                                            {t("aiInsightDesc")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 mt-6 md:mt-0 shrink-0 self-end md:self-auto">
                                    <div className="text-right">
                                        <div className="text-3xl md:text-4xl font-black text-[#00e5a0]">$20</div>
                                        <div className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-500 mt-1">{t("aiAddonLabel")}</div>
                                    </div>
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-colors ${aiAddon ? 'border-[#00e5a0] bg-[#00e5a0]/20 text-[#00e5a0]' : 'border-[#4b5563] text-transparent'}`}>
                                        <Check size={20} strokeWidth={4} />
                                    </div>
                                </div>
                            </motion.div>

                            {/* MT5 Add-on Section */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className="mt-4 p-6 md:p-8 rounded-[24px] flex flex-col md:flex-row items-center justify-between cursor-pointer border transition-all relative z-10"
                                onClick={() => setMt5Addon(!mt5Addon)}
                                style={{
                                    backgroundColor: mt5Addon ? `rgba(99, 102, 241, 0.05)` : "#10141d",
                                    borderColor: mt5Addon ? "#6366f1" : "#1c2230",
                                    boxShadow: mt5Addon ? `0 10px 40px rgba(99,102,241,0.15), inset 0 0 20px rgba(99,102,241,0.05)` : 'none'
                                }}
                            >
                                <div className="flex items-center gap-6 md:gap-8">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-[20px] flex items-center justify-center relative bg-[#0b0e14] border border-[#6366f1]/30 shrink-0">
                                        {mt5Addon && <motion.div className="absolute inset-0 rounded-[20px] border-2 border-dashed border-[#6366f1]/50" animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />}
                                        <Activity size={32} color={mt5Addon ? "#6366f1" : "#4b5563"} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-black text-white mb-2 flex items-center gap-2">
                                            {t("mt5IntegrationTitle")}
                                        </h3>
                                        <p className="text-sm md:text-base font-medium text-gray-400 max-w-2xl leading-relaxed">
                                            {t("mt5IntegrationDesc")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 mt-6 md:mt-0 shrink-0 self-end md:self-auto">
                                    <div className="text-right">
                                        <div className="text-3xl md:text-4xl font-black text-[#6366f1]">$30</div>
                                        <div className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-500 mt-1">{t("perMonth")}</div>
                                    </div>
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-colors ${mt5Addon ? 'border-[#6366f1] bg-[#6366f1]/20 text-[#6366f1]' : 'border-[#4b5563] text-transparent'}`}>
                                        <Check size={20} strokeWidth={4} />
                                    </div>
                                </div>
                            </motion.div>
                            {mt5Addon && (
                                <div className="mt-4 flex items-center gap-3">
                                    <input 
                                        type="checkbox" 
                                        id="mt5TermsPanel" 
                                        checked={mt5TermsAccepted} 
                                        onChange={(e) => setMt5TermsAccepted(e.target.checked)} 
                                        className="w-5 h-5 rounded border-gray-600 bg-[#0b0e14] checked:bg-[#6366f1] focus:ring-0 cursor-pointer accent-[#6366f1]"
                                    />
                                    <label htmlFor="mt5TermsPanel" className="text-sm font-medium text-gray-400 cursor-pointer select-none">
                                        {t("mt5TermsAgreement")}
                                    </label>
                                </div>
                            )}

                            {/* Referral Code Input */}
                            <div className="w-full max-w-[1400px] mx-auto mt-6 p-5 rounded-[24px] relative z-10" style={{ background: "rgba(168,85,247,0.04)", border: "1px solid rgba(168,85,247,0.15)" }}>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#a855f7] mb-3">{t("referralCodeInput")}</p>
                                {referralApplied ? (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Check size={18} className="text-[#00e5a0]" />
                                            <span className="text-sm font-bold text-[#00e5a0]">{t("referralApplied")}</span>
                                            <span className="font-mono text-xs text-gray-400 ml-1">{referralInput.toUpperCase()}</span>
                                        </div>
                                        <button onClick={handleRemoveReferral} className="text-xs font-bold text-red-400 hover:text-red-300 cursor-pointer uppercase tracking-widest">{t("referralRemove")}</button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <input type="text" value={referralInput} onChange={(e) => { setReferralInput(e.target.value); setReferralError(false); }}
                                            className="flex-1 px-4 py-3 rounded-xl text-sm font-mono font-bold bg-[#0b0e14] border border-[#1c2230] text-white placeholder-gray-600 focus:border-[#a855f7] outline-none uppercase tracking-wider"
                                            placeholder={t("referralCodePlaceholder")} />
                                        <button onClick={handleApplyReferral}
                                            className="px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-[#a855f7] text-black cursor-pointer hover:bg-[#9333ea] transition-colors">
                                            {t("applyCode")}
                                        </button>
                                    </div>
                                )}
                                {referralError && <p className="text-[10px] text-red-400 mt-1 font-bold">{t("referralInvalid")}</p>}
                            </div>

                            {/* Referral Discount Line */}
                            {referralApplied && (
                                <div className="w-full max-w-[1400px] mx-auto mt-3 flex items-center justify-between px-5 py-3 rounded-[24px] relative z-10" style={{ background: "rgba(0,229,160,0.05)", border: "1px solid rgba(0,229,160,0.15)" }}>
                                    <span className="text-sm font-bold text-[#00e5a0]">{t("referralDiscount")}</span>
                                    <span className="text-lg font-black text-[#00e5a0]">-${referralDiscountAmount.toFixed(2)}</span>
                                </div>
                            )}

                            {/* Continue Button */}
                            <div className="w-full mt-8 flex flex-col sm:flex-row justify-between items-center bg-[#10141d] p-6 md:p-8 rounded-[24px] border border-[#1c2230] relative z-10">
                                <div className="font-bold text-lg md:text-xl text-gray-400 mb-6 sm:mb-0 text-center sm:text-left">
                                    {t("totalDue")} <span className="text-3xl md:text-4xl font-black text-white ml-2 block sm:inline mt-2 sm:mt-0">${totalAmount.toFixed(2)}</span>
                                </div>
                                <button onClick={() => {
                                        if (mt5Addon && !mt5TermsAccepted) {
                                            alert(language === 'ar' ? "يرجى الموافقة على الشروط والأحكام الخاصة بـ MT5 قبل المتابعة." : "Please agree to the MT5 Terms & Conditions before proceeding.");
                                            return;
                                        }
                                        setStep("payment");
                                    }}
                                    className={`px-8 md:px-12 py-4 md:py-5 rounded-xl font-black uppercase tracking-wide md:tracking-widest flex items-center justify-center gap-3 text-black transition-transform ${(mt5Addon && !mt5TermsAccepted) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] cursor-pointer'} text-base md:text-lg w-full sm:w-auto`}
                                    style={{ background: `linear-gradient(90deg, #00e5a0, #00b37e)`, boxShadow: `0 10px 30px rgba(0,229,160,0.3)` }}>
                                    {t("checkoutPlan")} <ArrowRight size={20} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {step === "payment" && (
                <div className="p-10 relative">
                    <button onClick={() => setStep("plans")} className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest cursor-pointer">
                        {t("backToPlans")}
                    </button>
                    <div className="text-center mb-8 relative z-10 max-w-2xl mx-auto mt-6">
                        <div className="w-20 h-20 bg-[#00e5a0]/10 rounded-3xl flex items-center justify-center mx-auto mb-5 border border-[#00e5a0]/30 shadow-[0_0_30px_rgba(0,229,160,0.2)]">
                            <Clock size={36} className="text-[#00e5a0]" />
                        </div>
                        <h2 className="text-3xl font-black text-white">{t("confirmPayment")}</h2>
                        <p className="text-gray-400 mt-2 text-base">{t("confirmPaymentDesc")}</p>
                        {currentPlan && (
                          <div className="flex flex-col items-center gap-2 mt-4 px-4 py-3 rounded-xl" style={{ background: `${currentPlan.iconColor}10`, border: `1px solid ${currentPlan.iconColor}20` }}>
                            <div className="inline-flex gap-2 items-center">
                                <span className="text-sm font-black" style={{ color: currentPlan.iconColor }}>{currentPlan.name}</span>
                                {aiAddon && <span className="text-xs font-bold text-[#00e5a0]">| + AI Insight</span>}
                                {mt5Addon && <span className="text-xs font-bold text-[#6366f1]">| + MT5 Integration</span>}
                            </div>
                          </div>
                        )}
                    </div>

                    <div className="max-w-2xl mx-auto p-6 rounded-2xl mb-10 flex justify-between items-center bg-[#0b0e14] border border-[#1c2230] shadow-inner">
                        <span className="font-black text-gray-400 uppercase tracking-widest text-sm">{t("amountDue")}</span>
                        <span className="text-5xl font-black text-[#00e5a0]">${totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="max-w-2xl mx-auto space-y-6 mb-10">
                        {/* Telegram Option */}
                        <div className="p-8 rounded-2xl border border-[#0088cc]/30 bg-[#0088cc]/5 relative overflow-hidden group hover:border-[#0088cc] transition-colors">
                            <h3 className="font-black mb-2 flex items-center gap-3 text-white relative z-10 text-xl">
                                <div className="bg-[#0088cc] text-black w-8 h-8 rounded-full flex items-center justify-center"><Send size={16} /></div> 
                                {t("telegramFastTrack")}
                            </h3>
                            <p className="text-sm font-medium text-gray-400 mb-6 relative z-10">{t("telegramFastTrackDesc")}</p>
                            <div className="grid grid-cols-1 gap-3 relative z-10">
                                <a href="https://t.me/PhaseX_Ai" target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between group/btn cursor-pointer hover:border-[#0088cc]/50 transition-colors no-underline">
                                    <span className="font-mono text-base font-bold text-white">@PhaseX_Ai</span>
                                    <div className="text-[#0088cc] group-hover/btn:text-white transition-colors bg-[#0088cc]/10 p-2.5 rounded-lg"><Send size={18} /></div>
                                </a>
                                <a href="https://t.me/PhaseX_Ai_SupportBot" target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between group/btn cursor-pointer hover:border-[#0088cc]/50 transition-colors no-underline">
                                    <span className="font-mono text-base font-bold text-white">@PhaseX_Ai_SupportBot</span>
                                    <div className="text-[#0088cc] group-hover/btn:text-white transition-colors bg-[#0088cc]/10 p-2.5 rounded-lg"><Send size={18} /></div>
                                </a>
                            </div>
                        </div>

                        {/* Crypto Option */}
                        <div className="p-8 rounded-2xl border border-[#f7931a]/30 bg-[#f7931a]/5 relative overflow-hidden group hover:border-[#f7931a] transition-colors">
                            <h3 className="font-black mb-2 flex items-center gap-3 text-white relative z-10 text-xl">
                                <div className="bg-[#f7931a] text-black w-8 h-8 rounded-full flex items-center justify-center"><Zap size={16} /></div> 
                                {t("cryptoPayment")}
                            </h3>
                            <p className="text-sm font-medium text-gray-400 mb-6 relative z-10">{t("cryptoPaymentDesc")}</p>
                            <div className="p-4 rounded-xl border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between relative z-10 group/btn cursor-pointer" onClick={() => copyToClipboard(walletAddress)}>
                                <span className="font-mono text-sm sm:text-base font-bold break-all text-white max-w-[85%]">{walletAddress}</span>
                                <div className="text-[#f7931a] group-hover/btn:text-white transition-colors shrink-0 bg-[#f7931a]/10 p-2.5 rounded-lg ml-2"><Send size={20} /></div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-2xl mx-auto border-t border-[#1c2230] pt-8 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                        <button onClick={() => setStep("plans")} className="font-bold text-gray-500 hover:text-white transition-colors px-6 py-4 w-full sm:w-auto cursor-pointer">{t("cancelGoBack")}</button>
                        <button 
                            onClick={handleFinish} 
                            className="px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.03] flex items-center justify-center gap-3 w-full sm:w-auto cursor-pointer"
                            style={{ background: "#00e5a0", boxShadow: `0 10px 40px rgba(0,229,160,0.3)` }}>
                            <CircleCheck size={22} /> {t("confirmPaymentSent")}
                        </button>
                    </div>
                </div>
            )}

            {step === "pending" && (
                <div className="flex-1 flex flex-col items-center justify-center p-16 text-center h-[600px] relative z-20">
                    <motion.div className="w-32 h-32 rounded-full flex items-center justify-center mb-8 relative"
                        style={{ background: `linear-gradient(135deg, rgba(0,229,160,0.2) 0%, transparent 100%)` }}>
                        <motion.div className="absolute inset-0 border-4 rounded-full border-t-[#00e5a0] border-r-transparent border-b-[#00e5a0] border-l-transparent" 
                            animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                        <Check size={56} color="#00e5a0" />
                    </motion.div>
                    <h2 className="text-4xl font-black mb-4 text-white">{t("verificationPending")}</h2>
                    <p className="text-lg text-gray-400 max-w-md mx-auto leading-relaxed font-medium">
                        {t("verificationPendingDesc")}
                    </p>
                </div>
            )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
