import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Shield, Zap, Copy, Send, ArrowRight, CreditCard, Bot, Coins, Crown, Star, Trophy, CircleCheck } from "lucide-react";
import { useAuth, SubscriptionPlan } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

interface SubscriptionOnboardingProps {
    onComplete: () => void;
}

export function SubscriptionOnboarding({ onComplete }: SubscriptionOnboardingProps) {
    const { t, language } = useLanguage();
    const { submitReceipt } = useAuth();
    
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>("quarterly");
    const [aiAddon, setAiAddon] = useState(false);
    const [step, setStep] = useState<"plans" | "payment" | "pending">("plans");
    
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
            id: "monthly" as SubscriptionPlan,
            title: t("monthlyPlan") || "Monthly",
            price: 75,
            frequency: isRTL ? "شهر" : "month",
            icon: <Zap size={24} className="text-[#3b82f6]" />,
            iconBg: "bg-[#3b82f6]/10",
            iconColor: "#3b82f6",
            features: [t("feature1"), t("feature2"), t("feature3"), t("feature4")],
            badge: null
        },
        {
            id: "quarterly" as SubscriptionPlan,
            title: t("quarterlyPlan") || "Quarterly",
            price: 202.50,
            frequency: isRTL ? "3 أشهر" : "3 months",
            icon: <Star size={24} className="text-[#00e5a0]" />,
            iconBg: "bg-[#00e5a0]/10",
            iconColor: "#00e5a0",
            features: [t("featureAllPrevious"), t("featurePriority"), t("featureAnalytics"), t("featureTraining"), t("featureAlerts")],
            badge: { text: isRTL ? "الأفضل قيمة" : "Best Choice", color: "#00e5a0", rightText: isRTL ? "وفر 10%" : "Save 10%" }
        },
        {
            id: "semi-annual" as SubscriptionPlan,
            title: t("semiAnnualPlan") || "Semi-Annual",
            price: 382.50,
            frequency: isRTL ? "6 أشهر" : "6 months",
            icon: <Crown size={24} className="text-[#a855f7]" />,
            iconBg: "bg-[#a855f7]/10",
            iconColor: "#a855f7",
            features: [t("featureAllPrevious"), t("featureConsultation"), t("featureAlpha"), t("featureManager")],
            badge: { text: isRTL ? "خيار المحترفين" : "Pro Choice", color: "#a855f7", rightText: isRTL ? "وفر 15%" : "Save 15%" }
        },
        {
            id: "annual" as SubscriptionPlan,
            title: t("annualPlan") || "Annual",
            price: 720,
            frequency: isRTL ? "سنة" : "year",
            icon: <Trophy size={24} className="text-[#facc15]" />,
            iconBg: "bg-[#facc15]/10",
            iconColor: "#facc15",
            features: [t("featureAllPrevious"), t("featureVip"), t("featureStrategies"), t("featureReports")],
            badge: { text: isRTL ? "القيمة القصوى" : "Max Value", color: "#facc15", rightText: isRTL ? "وفر 20%" : "Save 20%" }
        },
    ];

    const currentPlan = plans.find(p => p.id === selectedPlan)!;
    const totalAmount = (currentPlan?.price || 0) + (aiAddon ? 20 : 0);

    return (
        <div className="min-h-screen flex flex-col pt-10 pb-20 px-4 relative overflow-x-hidden overflow-y-auto"
            style={{ background: "#0b0e14", fontFamily: "'Inter', sans-serif" }} dir={isRTL ? "rtl" : "ltr"}>
            
            {/* Cinematic Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[0%] left-[20%] w-[600px] h-[600px] rounded-full"
                    style={{ background: `radial-gradient(circle, rgba(0, 229, 160, 0.04) 0%, transparent 60%)`, filter: "blur(80px)" }} />
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
                            <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight text-[#00e5a0]" style={{ textShadow: '0 0 30px rgba(0,229,160,0.4)' }}>
                                {isRTL ? "اختر خطة الاشتراك الخاصة بك" : "Subscribe to PHASE X"}
                            </h1>
                            <p className="text-gray-400 text-lg font-medium">{isRTL ? "اختر الباقة المناسبة لتفعيل حسابك والبدء فوراً" : "Choose the right plan to activate your account and start immediately"}</p>
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-[1400px] mx-auto relative z-10 px-4">
                            {plans.map((plan) => {
                                const isActive = selectedPlan === plan.id;
                                const cColor = isActive ? plan.iconColor : "#1c2230";
                                return (
                                    <motion.div
                                        key={plan.id}
                                        onClick={() => setSelectedPlan(plan.id)}
                                        whileHover={{ y: -5 }}
                                        className={`relative rounded-[32px] cursor-pointer p-8 flex flex-col transition-all duration-300 ${isActive ? 'shadow-2xl' : 'hover:bg-[#151a26]'}`}
                                        style={{
                                            backgroundColor: isActive ? `${plan.iconColor}08` : "#10141d", 
                                            border: `1px solid ${isActive ? plan.iconColor : "#1c2230"}`,
                                            boxShadow: isActive ? `0 20px 50px -10px ${plan.iconColor}30, inset 0 0 20px ${plan.iconColor}10` : 'none',
                                            minHeight: "460px"
                                        }}
                                    >
                                        {/* Badges */}
                                        {plan.badge && (isActive || true) && (
                                            <>
                                                <div className="absolute top-0 left-6 px-4 py-1.5 rounded-b-xl text-xs font-black text-black shadow-lg"
                                                     style={{ backgroundColor: plan.badge.color }}>
                                                    {plan.badge.text}
                                                </div>
                                                <div className="absolute top-0 right-6 px-4 py-1.5 rounded-b-xl text-xs font-black text-white shadow-lg border border-t-0"
                                                     style={{ backgroundColor: `${plan.badge.color}20`, borderColor: plan.badge.color }}>
                                                    {plan.badge.rightText}
                                                </div>
                                            </>
                                        )}
                                        
                                        {/* Active Check Circle */}
                                        {isActive && (
                                            <div className="absolute top-6 right-6 rounded-full bg-transparent border-2 p-0.5 z-20" style={{ color: plan.iconColor, borderColor: plan.iconColor }}>
                                                <Check size={16} strokeWidth={4} />
                                            </div>
                                        )}

                                        <div className={`mt-10 mb-5 w-14 h-14 rounded-2xl flex items-center justify-center`} style={{ backgroundColor: plan.iconBg }}>
                                            {plan.icon}
                                        </div>
                                        
                                        <h3 className="text-2xl font-black text-white mb-2 flex items-baseline">
                                            {plan.title} 
                                            <span className="text-4xl font-black ml-3" style={{ color: isActive ? plan.iconColor : '#fff' }}>${plan.price}</span> 
                                            <span className="text-sm font-semibold text-gray-500 ml-1">/{plan.frequency}</span>
                                        </h3>
                                        
                                        <div className="my-6 border-t border-[#1c2230]" />
                                        
                                        <ul className="flex-1 space-y-4">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-4 text-[15px]">
                                                    <div className="shrink-0 mt-1 w-[18px] h-[18px] rounded-full border flex items-center justify-center text-gray-400"
                                                        style={isActive ? { borderColor: plan.iconColor, color: plan.iconColor } : { borderColor: '#4b5563' }}>
                                                        <Check size={12} strokeWidth={3} />
                                                    </div>
                                                    <span className={isActive ? "text-gray-200 font-medium" : "text-gray-400 font-medium"}>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
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
                                            {isRTL ? "مستكشف الذكاء الاصطناعي Phase-X AI" : "Phase-X AI Insight"} <Zap size={18} className="text-[#00e5a0]" />
                                        </h3>
                                        <p className="text-sm md:text-base font-medium text-gray-400 max-w-2xl leading-relaxed">
                                            {isRTL ? "احصل على 3000 نقطة ذكاء اصطناعي (AI Tokens) صالحة لمدة شهر واحد، تتيح لك تشغيل رادار السوق المباشر ومحادثة الشات بوت للحصول على تحليلات دقيقة ولحظية." : "Unlock elite AI analytics. Get 3,000 AI Tokens to power live radar scans and conversational insights instantly."}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 mt-6 md:mt-0 shrink-0 self-end md:self-auto">
                                    <div className="text-right">
                                        <div className="text-3xl md:text-4xl font-black text-[#00e5a0]">$20</div>
                                        <div className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-500 mt-1">{isRTL ? "/ إضافي شهرياً" : "/ Add-on"}</div>
                                    </div>
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-colors ${aiAddon ? 'border-[#00e5a0] bg-[#00e5a0]/20 text-[#00e5a0]' : 'border-[#4b5563] text-transparent'}`}>
                                        <Check size={20} strokeWidth={4} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Continue Button */}
                        <div className="w-full max-w-[1400px] mx-auto mt-8 flex flex-col sm:flex-row justify-between items-center bg-[#10141d] p-6 md:p-8 rounded-[24px] border border-[#1c2230] relative z-10">
                            <div className="font-bold text-lg md:text-xl text-gray-400 mb-6 sm:mb-0 text-center sm:text-left">
                                {isRTL ? "المجموع المطلوب:" : "Total Due:"} <span className="text-3xl md:text-4xl font-black text-white ml-2 block sm:inline mt-2 sm:mt-0">${totalAmount.toFixed(2)}</span>
                            </div>
                            <button onClick={() => setStep("payment")}
                                className="px-8 md:px-12 py-4 md:py-5 rounded-xl font-black uppercase tracking-wide md:tracking-widest flex items-center justify-center gap-3 text-black transition-transform hover:scale-[1.02] text-base md:text-lg w-full sm:w-auto"
                                style={{ background: `linear-gradient(90deg, #00e5a0, #00b37e)`, boxShadow: `0 10px 30px rgba(0,229,160,0.3)` }}>
                                {isRTL ? "اكمال عملية الدفع" : "Checkout Selected Plan"} <ArrowRight size={20} />
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
                            <h2 className="text-3xl font-black text-white">{isRTL ? "تأكيد الدفع" : "Confirm Payment"}</h2>
                            <p className="text-gray-400 mt-2 text-base">{isRTL ? "لتجاوز البوابات والحصول على تفعيل فوري، أرسل هذا المبلغ بالضبط يدوياً." : "To bypass gateways and get immediate processing, send exactly this amount manually."}</p>
                        </div>

                        <div className="p-6 rounded-2xl mb-10 flex justify-between items-center bg-[#0b0e14] border border-[#1c2230] shadow-inner">
                            <span className="font-black text-gray-400 uppercase tracking-widest text-sm">{isRTL ? "المبلغ المطلوب" : "Amount Due"}</span>
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
                                    {isRTL ? "تفعيل سريع عبر تيليجرام" : "Telegram Fast-Track"}
                                </h3>
                                <p className="text-sm font-medium text-gray-400 mb-6 relative z-10">{isRTL ? "أرسل إثبات الدفع مباشرة إلى الوكيل المعتمد." : "Send payment verification directly to a trusted agent."}</p>
                                <div className="grid grid-cols-1 gap-3 relative z-10">
                                    <div className="p-4 rounded-xl border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between group/btn cursor-pointer" onClick={() => copyToClipboard("@PhaeX_Ai")}>
                                        <span className="font-mono text-base font-bold text-white">@PhaeX_Ai</span>
                                        <div className="text-[#0088cc] group-hover/btn:text-white transition-colors bg-[#0088cc]/10 p-2.5 rounded-lg"><Copy size={18} /></div>
                                    </div>
                                    <div className="p-4 rounded-xl border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between group/btn cursor-pointer" onClick={() => copyToClipboard("@PhaseX_Ai_SupportBot")}>
                                        <span className="font-mono text-base font-bold text-white">@PhaseX_Ai_SupportBot</span>
                                        <div className="text-[#0088cc] group-hover/btn:text-white transition-colors bg-[#0088cc]/10 p-2.5 rounded-lg"><Copy size={18} /></div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* USDT Option */}
                            <div className="p-8 rounded-2xl border border-[#f7931a]/30 bg-[#f7931a]/5 relative overflow-hidden group hover:border-[#f7931a] transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Coins size={80} className="text-[#f7931a]" />
                                </div>
                                <h3 className="font-black mb-2 flex items-center gap-3 text-white relative z-10 text-xl">
                                    <div className="bg-[#f7931a] text-black w-8 h-8 rounded-full flex items-center justify-center"><Coins size={16} /></div> 
                                    {isRTL ? "العملات الرقمية (USDT TRC20)" : "Crypto (USDT TRC20)"}
                                </h3>
                                <p className="text-sm font-medium text-gray-400 mb-6 relative z-10">{isRTL ? "أرسل المبلغ المطلوب بالضبط من محفظتك إلى عنواننا." : "Send the exact amount from your secure wallet to our address."}</p>
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
                                    {isRTL ? "لا حاجة لرفع الإيصال. إذا كنت قد أرسلت المبلغ وتواصلت مع الدعم، قم بالتأكيد بالأسفل لتدخل قائمة التفعيل ذات الأولوية." : "No receipt upload required here. If you have sent the funds and contacted support, simply confirm below. Your account will automatically enter the priority verification queue."}
                                </p>
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                                <button onClick={() => setStep("plans")} className="font-bold text-gray-500 hover:text-white transition-colors px-6 py-4 w-full sm:w-auto">{isRTL ? "تراجع" : "Cancel & Go Back"}</button>
                                <button 
                                    onClick={handleFinish} 
                                    className={`px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.03] flex items-center justify-center gap-3 w-full sm:w-auto`}
                                    style={{ background: "#00e5a0", boxShadow: `0 10px 40px rgba(0,229,160,0.3)` }}>
                                    <CircleCheck size={22} /> {isRTL ? "أؤكد تحويل المبلغ" : "I Confirm Payment Sent"}
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
                        <h2 className="text-4xl font-black mb-4 text-white">{isRTL ? "قيد المراجعة" : "Verification Pending"}</h2>
                        <p className="text-lg mb-8 leading-relaxed font-medium text-gray-400">
                            {isRTL ? "يتم التحقق من الدفعة الآن، سيتم منحك وصول كامل للمنصة حين موافقة الإدارة. (جاري تحويلك...)" : "Your payment is being verified by our compliance team. You will be granted full access within 2-4 hours. Redirecting to your dashboard..."}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

