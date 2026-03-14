import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Shield, Zap, Copy, Send, ArrowRight, CreditCard, Bot, Coins, Crown, Star, Trophy, CircleCheck, X } from "lucide-react";
import { useAuth, SubscriptionPlan } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

interface SubscriptionOnboardingProps {
    onComplete: () => void;
}

export function SubscriptionOnboarding({ onComplete }: SubscriptionOnboardingProps) {
    const { t, language } = useLanguage();
    const { submitReceipt, applyReferralCode } = useAuth();
    
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>("trader");
    const [aiAddon, setAiAddon] = useState(false);
    const [step, setStep] = useState<"plans" | "payment" | "pending">("plans");
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [referralInput, setReferralInput] = useState("");
    const [referralApplied, setReferralApplied] = useState(false);
    const [referralError, setReferralError] = useState(false);
    
    const isRTL = language === "ar";
    
    const walletAddress = "TQwFCKK5JjZACHdE888zG5iUx8wQ2RtnAV";

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleFinish = () => {
        submitReceipt(selectedPlan, aiAddon);
        setStep("pending");
        setTimeout(() => {
            onComplete();
        }, 3000);
    };

    const plans = [
        {
            id: "core" as SubscriptionPlan,
            title: t("planCoreName"),
            price: 29,
            iconColor: "#3b82f6",
            icon: <Zap size={24} className="text-[#3b82f6]" />,
            badge: null,
            charts: ["Phase State", "Direction State"],
            features: [t("planCoreF1"), t("planCoreF2"), t("planCoreF3"), t("planCoreF4")],
            limitations: [t("planCoreL1"), t("planCoreL2")],
            description: t("planCoreDesc"),
        },
        {
            id: "trader" as SubscriptionPlan,
            title: t("planTraderName"),
            price: 49,
            iconColor: "#00e5a0",
            icon: <Star size={24} className="text-[#00e5a0]" />,
            badge: { text: t("planTraderBadge"), color: "#00e5a0" },
            charts: ["Phase State", "Direction State", "Oscillation State"],
            features: [t("planTraderF1"), t("planTraderF2"), t("planTraderF3"), t("planTraderF4")],
            limitations: null,
            description: t("planTraderDesc"),
        },
        {
            id: "professional" as SubscriptionPlan,
            title: t("planProName"),
            price: 89,
            iconColor: "#a855f7",
            icon: <Trophy size={24} className="text-[#a855f7]" />,
            badge: { text: t("planProBadge"), color: "#a855f7" },
            charts: ["Phase State", "Direction State", "Oscillation State", "Reference State", "Displacement State"],
            features: [t("planProF1"), t("planProF2"), t("planProF3"), t("planProF4")],
            limitations: null,
            description: t("planProDesc"),
        },
        {
            id: "institutional" as SubscriptionPlan,
            title: t("planInstName"),
            price: 149,
            iconColor: "#facc15",
            icon: <Crown size={24} className="text-[#facc15]" />,
            badge: { text: t("planInstBadge"), color: "#facc15" },
            charts: ["Phase State", "Direction State", "Oscillation State", "Reference State", "Displacement State", "Envelope State"],
            features: [t("planInstF1"), t("planInstF2"), t("planInstF3"), t("planInstF4"), t("planInstF5")],
            limitations: null,
            description: t("planInstDesc"),
        },
    ];

    const currentPlan = plans.find(p => p.id === selectedPlan)!;
    const getPrice = (basePrice: number) => billingCycle === "yearly" ? Math.round(basePrice * 12 * 0.8) : basePrice;
    const subtotal = (currentPlan ? getPrice(currentPlan.price) : 0) + (aiAddon ? (billingCycle === "yearly" ? Math.round(20 * 12 * 0.8) : 20) : 0);
    const referralDiscountAmount = referralApplied ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
    const totalAmount = subtotal - referralDiscountAmount;

    const handleApplyReferral = () => {
        setReferralError(false);
        const result = applyReferralCode(referralInput);
        if (result.valid) { setReferralApplied(true); setReferralError(false); }
        else { setReferralApplied(false); setReferralError(true); }
    };
    const handleRemoveReferral = () => { setReferralApplied(false); setReferralInput(""); setReferralError(false); };

    return (
        <div className="min-h-screen flex flex-col pt-10 pb-20 px-4 relative overflow-x-hidden overflow-y-auto"
            style={{ background: "#0b0e14", fontFamily: "'Inter', sans-serif" }} dir={isRTL ? "rtl" : "ltr"}>
            
            {/* Cinematic Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[0%] left-[20%] w-[600px] h-[600px] rounded-full"
                    style={{ background: `radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 60%)`, filter: "blur(80px)" }} />
                <div className="absolute bottom-[0%] right-[20%] w-[600px] h-[600px] rounded-full"
                    style={{ background: `radial-gradient(circle, rgba(250, 204, 21, 0.02) 0%, transparent 60%)`, filter: "blur(80px)" }} />
            </div>

            <AnimatePresence mode="wait">
                {step === "plans" && (
                    <motion.div key="plans"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center"
                    >

                        {/* Hero Texts */}
                        <div className="text-center mb-8 relative z-10 mt-6">
                            <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight text-[#6366f1]" style={{ textShadow: '0 0 30px rgba(99,102,241,0.4)' }}>
                                {t("chooseYourPlan")}
                            </h1>
                            <p className="text-gray-400 text-lg font-medium">{t("chooseYourPlanSub")}</p>
                        </div>

                        {/* Cards Grid */}
                        {/* Billing Toggle */}
                        <div className="flex items-center justify-center gap-3 mb-6 relative z-10">
                            <div className="flex items-center rounded-full p-1 gap-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <button onClick={() => setBillingCycle("monthly")}
                                    className={`px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest transition-all cursor-pointer ${billingCycle === "monthly" ? "text-black bg-[#6366f1]" : "text-gray-400 hover:text-white"}`}>
                                    {t("billingMonthly")}
                                </button>
                                <button onClick={() => setBillingCycle("yearly")}
                                    className={`px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest transition-all cursor-pointer ${billingCycle === "yearly" ? "text-black bg-[#6366f1]" : "text-gray-400 hover:text-white"}`}>
                                    {t("billingYearly")}
                                </button>
                            </div>
                            {billingCycle === "yearly" && (
                                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                    className="px-3 py-1.5 rounded-full text-xs font-black tracking-wider text-black"
                                    style={{ background: "linear-gradient(90deg, #00e5a0, #00c890)" }}>
                                    {t("save20")}
                                </motion.span>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-[1400px] mx-auto relative z-10 px-4">
                            {plans.map((plan) => {
                                const isActive = selectedPlan === plan.id;
                                return (
                                    <motion.div
                                        key={plan.id}
                                        onClick={() => setSelectedPlan(plan.id)}
                                        whileHover={{ y: -5 }}
                                        className={`relative rounded-[24px] cursor-pointer p-6 flex flex-col transition-all duration-300 ${isActive ? 'shadow-2xl' : 'hover:bg-[#151a26]'}`}
                                        style={{
                                            backgroundColor: isActive ? `${plan.iconColor}08` : "#10141d", 
                                            border: `1px solid ${isActive ? plan.iconColor : "#1c2230"}`,
                                            boxShadow: isActive ? `0 20px 50px -10px ${plan.iconColor}30, inset 0 0 20px ${plan.iconColor}10` : 'none',
                                            minHeight: "420px"
                                        }}
                                    >
                                        {/* Badges */}
                                        {plan.badge && (
                                            <div className="absolute top-0 left-5 px-3 py-1 rounded-b-xl text-[9px] font-black text-black shadow-lg uppercase tracking-widest"
                                                 style={{ backgroundColor: plan.badge.color }}>
                                                {plan.badge.text}
                                            </div>
                                        )}
                                        
                                        {/* Active Check Circle */}
                                        {isActive && (
                                            <div className="absolute top-5 right-5 rounded-full bg-transparent border-2 p-0.5 z-20" style={{ color: plan.iconColor, borderColor: plan.iconColor }}>
                                                <Check size={16} strokeWidth={4} />
                                            </div>
                                        )}

                                        {/* Plan Name + Price */}
                                        <div className="mt-6 mb-3">
                                            <h3 className="text-base font-black text-white mb-0.5">{plan.title}</h3>
                                            <p className="text-[11px] text-gray-500 font-medium leading-snug">{plan.description}</p>
                                        </div>

                                        <div className="flex items-baseline gap-1 mb-3">
                                            <span className="text-3xl font-black" style={{ color: isActive ? plan.iconColor : '#fff' }}>${getPrice(plan.price)}</span>
                                            <span className="text-xs text-gray-500 font-bold">/ {billingCycle === "yearly" ? t("perYear") : t("perMonth")}</span>
                                            {billingCycle === "yearly" && (
                                                <span className="text-[10px] text-gray-600 line-through ml-1">${plan.price * 12}</span>
                                            )}
                                        </div>
                                        {billingCycle === "yearly" && (
                                            <p className="text-[9px] text-[#00e5a0] font-bold mb-2">{t("billedAnnually")} — {t("save20")}</p>
                                        )}
                                        
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
                                                        <div className="shrink-0 mt-0.5" style={{ color: isActive ? plan.iconColor : "#64748b" }}>
                                                            <Check size={12} strokeWidth={3} />
                                                        </div>
                                                        <span className={isActive ? "text-gray-200 font-medium" : "text-gray-400 font-medium"}>{feature}</span>
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
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* AI Add-on Section */}
                        <motion.div 
                            className="mt-8 mx-auto w-full max-w-[1400px] px-4"
                            onClick={() => setAiAddon(!aiAddon)}
                        >
                            <div className="p-6 md:p-8 rounded-[24px] flex flex-col md:flex-row items-center justify-between cursor-pointer border transition-all relative z-10"
                                style={{
                                    backgroundColor: aiAddon ? `rgba(0, 229, 160, 0.05)` : "#10141d",
                                    borderColor: aiAddon ? "#00e5a0" : "#1c2230",
                                    boxShadow: aiAddon ? `0 10px 40px rgba(0,229,160,0.15), inset 0 0 20px rgba(0,229,160,0.05)` : 'none'
                                }}
                            >
                                <div className="flex items-center gap-6 md:gap-8">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-[20px] flex items-center justify-center relative bg-[#0b0e14] border border-[#00e5a0]/30 shrink-0">
                                        {aiAddon && <motion.div className="absolute inset-0 rounded-[20px] border-2 border-dashed border-[#00e5a0]/50" animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />}
                                        <Bot size={32} color={aiAddon ? "#00e5a0" : "#4b5563"} />
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
                            </div>
                        </motion.div>

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
                        <div className="w-full max-w-[1400px] mx-auto mt-8 flex flex-col sm:flex-row justify-between items-center bg-[#10141d] p-6 md:p-8 rounded-[24px] border border-[#1c2230] relative z-10">
                            <div className="font-bold text-lg md:text-xl text-gray-400 mb-6 sm:mb-0 text-center sm:text-left">
                                {t("totalDue")} <span className="text-3xl md:text-4xl font-black text-white ml-2 block sm:inline mt-2 sm:mt-0">${totalAmount.toFixed(2)}</span>
                            </div>
                            <button onClick={() => setStep("payment")}
                                className="px-8 md:px-12 py-4 md:py-5 rounded-xl font-black uppercase tracking-wide md:tracking-widest flex items-center justify-center gap-3 text-black transition-transform hover:scale-[1.02] text-base md:text-lg w-full sm:w-auto cursor-pointer"
                                style={{ background: `linear-gradient(90deg, #00e5a0, #00b37e)`, boxShadow: `0 10px 30px rgba(0,229,160,0.3)` }}>
                                {t("checkoutPlan")} <ArrowRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === "payment" && (
                    <motion.div key="payment"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative z-10 w-full max-w-2xl bg-[#10141d] p-10 rounded-[32px] mx-auto my-10"
                        style={{ border: `1px solid #1c2230`, boxShadow: `0 20px 60px rgba(0,0,0,0.6)` }}
                    >
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-[#00e5a0]/10 rounded-3xl flex items-center justify-center mx-auto mb-5 border border-[#00e5a0]/30 shadow-[0_0_30px_rgba(0,229,160,0.2)]">
                                <CreditCard size={36} className="text-[#00e5a0]" />
                            </div>
                            <h2 className="text-3xl font-black text-white">{t("confirmPayment")}</h2>
                            <p className="text-gray-400 mt-2 text-base">{t("confirmPaymentDesc")}</p>
                            {currentPlan && (
                              <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl" style={{ background: `${currentPlan.iconColor}10`, border: `1px solid ${currentPlan.iconColor}20` }}>
                                <span className="text-sm font-black" style={{ color: currentPlan.iconColor }}>{currentPlan.title}</span>
                                {aiAddon && <span className="text-xs font-bold text-[#00e5a0]">+ AI Insight</span>}
                              </div>
                            )}
                        </div>

                        <div className="p-6 rounded-2xl mb-10 flex justify-between items-center bg-[#0b0e14] border border-[#1c2230] shadow-inner">
                            <span className="font-black text-gray-400 uppercase tracking-widest text-sm">{t("amountDue")}</span>
                            <span className="text-5xl font-black text-[#00e5a0]">${totalAmount.toFixed(2)}</span>
                        </div>

                        <div className="space-y-6 mb-10">
                            {/* Telegram Option */}
                            <div className="p-8 rounded-2xl border border-[#0088cc]/30 bg-[#0088cc]/5 relative overflow-hidden group hover:border-[#0088cc] transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Send size={80} className="text-[#0088cc]" />
                                </div>
                                <h3 className="font-black mb-2 flex items-center gap-3 text-white relative z-10 text-xl">
                                    <div className="bg-[#0088cc] text-black w-8 h-8 rounded-full flex items-center justify-center"><Send size={16} /></div> 
                                    {t("telegramFastTrack")}
                                </h3>
                                <p className="text-sm font-medium text-gray-400 mb-6 relative z-10">{t("telegramFastTrackDesc")}</p>
                                <div className="grid grid-cols-1 gap-3 relative z-10">
                                    <a href="https://t.me/PhaseX_Ai" target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between group/btn cursor-pointer hover:border-[#0088cc]/50 transition-colors no-underline">
                                        <span className="font-mono text-base font-bold text-white">@PhaseX_Ai</span>
                                        <div className="text-[#0088cc] group-hover/btn:text-white transition-colors bg-[#0088cc]/10 p-2.5 rounded-lg"><Copy size={18} /></div>
                                    </a>
                                    <a href="https://t.me/PhaseX_Ai_SupportBot" target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between group/btn cursor-pointer hover:border-[#0088cc]/50 transition-colors no-underline">
                                        <span className="font-mono text-base font-bold text-white">@PhaseX_Ai_SupportBot</span>
                                        <div className="text-[#0088cc] group-hover/btn:text-white transition-colors bg-[#0088cc]/10 p-2.5 rounded-lg"><Copy size={18} /></div>
                                    </a>
                                </div>
                            </div>
                            
                            {/* USDT Option */}
                            <div className="p-8 rounded-2xl border border-[#f7931a]/30 bg-[#f7931a]/5 relative overflow-hidden group hover:border-[#f7931a] transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Coins size={80} className="text-[#f7931a]" />
                                </div>
                                <h3 className="font-black mb-2 flex items-center gap-3 text-white relative z-10 text-xl">
                                    <div className="bg-[#f7931a] text-black w-8 h-8 rounded-full flex items-center justify-center"><Coins size={16} /></div> 
                                    {t("cryptoPayment")}
                                </h3>
                                <p className="text-sm font-medium text-gray-400 mb-6 relative z-10">{t("cryptoPaymentDesc")}</p>
                                <div className="p-4 rounded-xl border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between relative z-10 group/btn cursor-pointer" onClick={() => copyToClipboard(walletAddress)}>
                                    <span className="font-mono text-sm sm:text-base font-bold break-all text-white max-w-[85%]">{walletAddress}</span>
                                    <div className="text-[#f7931a] group-hover/btn:text-white transition-colors shrink-0 bg-[#f7931a]/10 p-2.5 rounded-lg ml-2"><Copy size={20} /></div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-[#1c2230] pt-8">
                            <div className="bg-[#00e5a0]/10 border border-[#00e5a0]/20 p-5 rounded-2xl mb-8 flex items-start gap-4">
                                <div className="text-[#00e5a0] shrink-0 mt-0.5"><Shield size={24} /></div>
                                <p className="text-sm font-medium text-[#00e5a0] leading-relaxed">
                                    {t("noReceiptNote")}
                                </p>
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                                <button onClick={() => setStep("plans")} className="font-bold text-gray-500 hover:text-white transition-colors px-6 py-4 w-full sm:w-auto cursor-pointer">{t("cancelGoBack")}</button>
                                <button 
                                    onClick={handleFinish} 
                                    className="px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.03] flex items-center justify-center gap-3 w-full sm:w-auto cursor-pointer"
                                    style={{ background: "#00e5a0", boxShadow: `0 10px 40px rgba(0,229,160,0.3)` }}>
                                    <CircleCheck size={22} /> {t("confirmPaymentSent")}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === "pending" && (
                    <motion.div key="pending"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center relative z-10 p-12 rounded-[32px] bg-[#10141d] max-w-xl w-full mx-auto my-auto mt-20"
                        style={{ border: `1px solid rgba(0,229,160,0.3)`, boxShadow: `0 0 80px rgba(0,229,160,0.15)` }}
                    >
                        <motion.div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-8 relative"
                            style={{ background: `linear-gradient(135deg, rgba(0,229,160,0.2) 0%, transparent 100%)` }}>
                            <motion.div className="absolute inset-0 border-4 rounded-full border-t-[#00e5a0] border-r-transparent border-b-[#00e5a0] border-l-transparent" 
                                animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                            <Check size={56} color="#00e5a0" />
                        </motion.div>
                        <h2 className="text-4xl font-black mb-4 text-white">{t("verificationPending")}</h2>
                        <p className="text-lg mb-8 leading-relaxed font-medium text-gray-400">
                            {t("verificationPendingDescOnboard")}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
