import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Crown, Calendar, Clock, Send, Check, ShieldAlert, Zap, X, Shield, Star, Trophy, ArrowRight, CircleCheck } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { motion, AnimatePresence } from "motion/react";

interface SubscriptionPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionPanel({ isOpen, onClose }: SubscriptionPanelProps) {
  const { language, t } = useLanguage();
  const { user, subscriptionPlan, subscriptionStatus, aiTokens, hasAIAccess, submitReceipt } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [aiAddon, setAiAddon] = useState(false);
  const [step, setStep] = useState<"plans" | "payment" | "pending">("plans");
  const isRTL = language === "ar";

  const walletAddress = "TQwFCKK5JjZACHdE888zG5iUx8wQ2RtnAV";

  // Updated to match the 4 new tiers
  const subscriptionPlans = [
    {
        id: "monthly",
        name: t("planMonthly") || "Monthly",
        frequency: t("freqMonth") || "month",
        price: 75.00,
        originalPrice: 75.00,
        features: ["5 Technical Indicators", "All Markets", "Technical Support", "Daily Updates"],
        icon: <Zap size={24} className="text-[#3b82f6]" />,
        iconColor: "#3b82f6",
        badge: null
    },
    {
        id: "quarterly",
        name: t("planQuarterly") || "Quarterly",
        frequency: t("freqQuarter") || "3 months",
        price: 202.50,
        originalPrice: 225.00,
        features: ["All Monthly Features", "Priority Support", "Advanced Analytics", "Training Sessions"],
        icon: <Star size={24} className="text-[#00e5a0]" />,
        iconColor: "#00e5a0",
        badge: { text: t("save10") || "Save 10%", color: "#00e5a0" }
    },
    {
        id: "semi-annual",
        name: t("planSemiAnnual") || "Semi-Annual",
        frequency: t("freqSemiAnnual") || "6 months",
        price: 382.50,
        originalPrice: 450.00,
        features: ["All Quarterly Features", "1-on-[1 Consultation", "Alpha Signal Access"],
        icon: <Trophy size={24} className="text-[#a855f7]" />,
        iconColor: "#a855f7",
        badge: { text: t("save15") || "Save 15%", color: "#a855f7" }
    },
    {
        id: "annual",
        name: t("planAnnual") || "Annual",
        frequency: t("freqAnnual") || "year",
        price: 720.00,
        originalPrice: 900.00,
        features: ["All Semi-Annual Features", "Dedicated Manager", "VIP Status", "Instant Alerts"],
        icon: <Crown size={24} className="text-[#facc15]" />,
        iconColor: "#facc15",
        badge: { text: t("save20") || "Save 20%", color: "#facc15" }
    },
  ];

  const handleFinish = () => {
      if (!selectedPlan) return;
      submitReceipt(selectedPlan as any, aiAddon);
      setStep("pending");
      setTimeout(() => {
          onClose();
          setStep("plans"); // Reset for next time
          setAiAddon(false);
          setSelectedPlan(null);
      }, 3000);
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
  };

  const currentPlan = subscriptionPlans.find(p => p.id === selectedPlan);
  const totalAmount = (currentPlan?.price || 0) + (aiAddon ? 20 : 0);

  if (!isOpen) return null;

  // Let's mock a fixed end date for demonstration of the progress bar if they have a plan
  const isActive = subscriptionStatus === "active";
  const daysRemaining = isActive ? 14 : 0;
  const progressPercent = isActive ? 60 : 0; // Just visual

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
            <button onClick={onClose} className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 z-20">
                <X size={26} />
            </button>

            {step === "plans" && (
                <div className="p-10 relative">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle, #facc15 0%, transparent 60%)`, filter: "blur(60px)" }} />
                    
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative bg-[#10141d] border border-[#facc15]/30 shadow-[0_0_30px_rgba(250,204,21,0.15)]">
                            <Crown size={32} className="text-[#facc15]" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-white">Subscription Management</h2>
                            <p className="text-gray-400 font-medium mt-1">Manage your Phase-X terminal access and billing cycle.</p>
                        </div>
                    </div>

                    {/* Current Plan Status */}
                    <div className="p-8 rounded-[32px] border mb-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
                        style={{ borderColor: isActive ? "#00e5a0" : "#1c2230", background: "#10141d", boxShadow: isActive ? `0 10px 40px rgba(0,229,160,0.05), inset 0 0 20px rgba(0,229,160,0.05)` : "none" }}>
                        
                        <div className="flex-1 w-full">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                <span className={`px-4 py-1.5 rounded-xl text-sm font-black uppercase tracking-widest ${isActive ? 'bg-[#00e5a0]/15 text-[#00e5a0]' : subscriptionStatus === 'pending' ? 'bg-[#facc15]/15 text-[#facc15]' : 'bg-red-500/15 text-red-500'}`}>
                                    {isActive ? "Active" : subscriptionStatus === 'pending' ? "Verification Pending" : "No Active Plan"}
                                </span>
                                <span className="text-xl font-bold text-white capitalize">{subscriptionPlan === 'none' ? 'Guest Access' : subscriptionPlan}</span>
                            </div>
                            
                            {isActive && (
                                <div className="space-y-4 max-w-lg mt-8">
                                    <div className="flex items-center justify-between text-sm font-bold">
                                        <span className="text-gray-400">{daysRemaining} Days Remaining</span>
                                        <span className="text-[#00e5a0]">Next Billing: Upcoming</span>
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
                                    <div className="text-xs text-gray-400 uppercase tracking-widest font-black">Valid Until</div>
                                    <div className="text-white font-bold mt-1">Dec 31, 2026</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <h3 className="text-2xl font-black text-white mb-6">Available Plans</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 w-full">
                        {subscriptionPlans.map((plan) => {
                            const isSelected = selectedPlan === plan.id;
                            const isCurrentPlan = subscriptionPlan === plan.id && subscriptionStatus === "active";
                            
                            return (
                                <motion.div
                                    key={plan.id}
                                    onClick={() => !isCurrentPlan && setSelectedPlan(plan.id)}
                                    whileHover={{ y: isCurrentPlan ? 0 : -5 }}
                                    className={`relative rounded-[32px] p-6 flex flex-col transition-all duration-300 ${isSelected ? 'shadow-2xl' : isCurrentPlan ? 'opacity-80' : 'cursor-pointer hover:bg-[#151a26]'}`}
                                    style={{
                                        backgroundColor: isSelected || isCurrentPlan ? `${plan.iconColor}08` : "#10141d", 
                                        border: `1px solid ${isSelected || isCurrentPlan ? plan.iconColor : "#1c2230"}`,
                                        boxShadow: isSelected ? `0 20px 50px -10px ${plan.iconColor}30, inset 0 0 20px ${plan.iconColor}10` : 'none',
                                    }}
                                >
                                    {isCurrentPlan && (
                                        <div className="absolute top-0 left-6 px-4 py-1 rounded-b-xl text-[10px] uppercase tracking-widest font-black text-white shadow-lg"
                                             style={{ backgroundColor: "#22c55e" }}>
                                            {t("currentPlan") || "Current Plan"}
                                        </div>
                                    )}

                                    {plan.badge && !isCurrentPlan && (
                                        <div className="absolute top-0 right-6 px-4 py-1 rounded-b-xl text-[10px] uppercase tracking-widest font-black text-black shadow-lg"
                                             style={{ backgroundColor: plan.badge.color }}>
                                            {plan.badge.text}
                                        </div>
                                    )}
                                    
                                    {(isSelected || isCurrentPlan) && (
                                        <div className="absolute top-6 right-6 rounded-full p-0.5 z-20" style={{ color: isCurrentPlan ? "#22c55e" : plan.iconColor, background: isCurrentPlan ? "#22c55e20" : `${plan.iconColor}20` }}>
                                            <Check size={18} strokeWidth={4} />
                                        </div>
                                    )}

                                    <div className="mb-4 mt-2">
                                        <h4 className="text-xl font-black text-white mb-1">{plan.name}</h4>
                                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{plan.frequency}</div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-baseline gap-2">
                                            <div className="text-4xl font-black text-white" style={{ color: isSelected || isCurrentPlan ? plan.iconColor : "#fff" }}>
                                                ${plan.price}
                                            </div>
                                            {plan.originalPrice > plan.price && (
                                                <div className="text-sm font-medium text-gray-500 line-through">
                                                    ${plan.originalPrice}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <ul className="space-y-3 flex-1 mb-8">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-[13px]">
                                                <div className="shrink-0 mt-0.5 text-gray-400" style={{ color: isSelected || isCurrentPlan ? plan.iconColor : "#64748b" }}>
                                                    <Check size={14} strokeWidth={3} />
                                                </div>
                                                <span className={isSelected || isCurrentPlan ? "text-gray-200 font-medium" : "text-gray-400 font-medium"}>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
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
                            </motion.div>

                            {/* Continue Button */}
                            <div className="w-full mt-8 flex flex-col sm:flex-row justify-between items-center bg-[#10141d] p-6 md:p-8 rounded-[24px] border border-[#1c2230] relative z-10">
                                <div className="font-bold text-lg md:text-xl text-gray-400 mb-6 sm:mb-0 text-center sm:text-left">
                                    {isRTL ? "المجموع المطلوب:" : "Total Due:"} <span className="text-3xl md:text-4xl font-black text-white ml-2 block sm:inline mt-2 sm:mt-0">${totalAmount.toFixed(2)}</span>
                                </div>
                                <button onClick={() => setStep("payment")}
                                    className="px-8 md:px-12 py-4 md:py-5 rounded-xl font-black uppercase tracking-wide md:tracking-widest flex items-center justify-center gap-3 text-black transition-transform hover:scale-[1.02] text-base md:text-lg w-full sm:w-auto"
                                    style={{ background: `linear-gradient(90deg, #00e5a0, #00b37e)`, boxShadow: `0 10px 30px rgba(0,229,160,0.3)` }}>
                                    {isRTL ? "اكمال عملية الدفع" : "Checkout Selected Plan"} <ArrowRight size={20} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {step === "payment" && (
                <div className="p-10 relative">
                    <button onClick={() => setStep("plans")} className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                        {isRTL ? "← العودة للباقات" : "← Back to Plans"}
                    </button>
                    <div className="text-center mb-8 relative z-10 max-w-2xl mx-auto mt-6">
                        <div className="w-20 h-20 bg-[#00e5a0]/10 rounded-3xl flex items-center justify-center mx-auto mb-5 border border-[#00e5a0]/30 shadow-[0_0_30px_rgba(0,229,160,0.2)]">
                            <Clock size={36} className="text-[#00e5a0]" />
                        </div>
                        <h2 className="text-3xl font-black text-white">{isRTL ? "تأكيد الدفع" : "Confirm Payment"}</h2>
                        <p className="text-gray-400 mt-2 text-base">{isRTL ? "لتجاوز البوابات والحصول على تفعيل فوري، أرسل هذا المبلغ بالضبط يدوياً." : "To bypass gateways and get immediate processing, send exactly this amount manually."}</p>
                    </div>

                    <div className="max-w-2xl mx-auto p-6 rounded-2xl mb-10 flex justify-between items-center bg-[#0b0e14] border border-[#1c2230] shadow-inner">
                        <span className="font-black text-gray-400 uppercase tracking-widest text-sm">{isRTL ? "المبلغ المطلوب" : "Amount Due"}</span>
                        <span className="text-5xl font-black text-[#00e5a0]">${totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="max-w-2xl mx-auto space-y-6 mb-10">
                        {/* Telegram Option */}
                        <div className="p-8 rounded-2xl border border-[#0088cc]/30 bg-[#0088cc]/5 relative overflow-hidden group hover:border-[#0088cc] transition-colors">
                            <h3 className="font-black mb-2 flex items-center gap-3 text-white relative z-10 text-xl">
                                <div className="bg-[#0088cc] text-black w-8 h-8 rounded-full flex items-center justify-center"><Send size={16} /></div> 
                                {isRTL ? "تفعيل سريع عبر تيليجرام" : "Telegram Fast-Track"}
                            </h3>
                            <p className="text-sm font-medium text-gray-400 mb-6 relative z-10">{isRTL ? "أرسل إثبات الدفع مباشرة إلى الوكيل المعتمد." : "Send payment verification directly to a trusted agent."}</p>
                            <div className="grid grid-cols-1 gap-3 relative z-10">
                                <div className="p-4 rounded-xl border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between group/btn cursor-pointer" onClick={() => copyToClipboard("@PhaeX_Ai")}>
                                    <span className="font-mono text-base font-bold text-white">@PhaeX_Ai</span>
                                    <div className="text-[#0088cc] group-hover/btn:text-white transition-colors bg-[#0088cc]/10 p-2.5 rounded-lg"><Send size={18} /></div>
                                </div>
                                <div className="p-4 rounded-xl border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between group/btn cursor-pointer" onClick={() => copyToClipboard("@PhaseX_Ai_SupportBot")}>
                                    <span className="font-mono text-base font-bold text-white">@PhaseX_Ai_SupportBot</span>
                                    <div className="text-[#0088cc] group-hover/btn:text-white transition-colors bg-[#0088cc]/10 p-2.5 rounded-lg"><Send size={18} /></div>
                                </div>
                            </div>
                        </div>

                        {/* Crypto Option */}
                        <div className="p-8 rounded-2xl border border-[#f7931a]/30 bg-[#f7931a]/5 relative overflow-hidden group hover:border-[#f7931a] transition-colors">
                            <h3 className="font-black mb-2 flex items-center gap-3 text-white relative z-10 text-xl">
                                <div className="bg-[#f7931a] text-black w-8 h-8 rounded-full flex items-center justify-center"><Zap size={16} /></div> 
                                {isRTL ? "العملات الرقمية (USDT TRC20)" : "Crypto (USDT TRC20)"}
                            </h3>
                            <p className="text-sm font-medium text-gray-400 mb-6 relative z-10">{isRTL ? "أرسل المبلغ المطلوب بالضبط من محفظتك إلى عنواننا." : "Send the exact amount from your secure wallet to our address."}</p>
                            <div className="p-4 rounded-xl border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between relative z-10 group/btn cursor-pointer" onClick={() => copyToClipboard(walletAddress)}>
                                <span className="font-mono text-sm sm:text-base font-bold break-all text-white max-w-[85%]">{walletAddress}</span>
                                <div className="text-[#f7931a] group-hover/btn:text-white transition-colors shrink-0 bg-[#f7931a]/10 p-2.5 rounded-lg ml-2"><Send size={20} /></div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-2xl mx-auto border-t border-[#1c2230] pt-8 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                        <button onClick={() => setStep("plans")} className="font-bold text-gray-500 hover:text-white transition-colors px-6 py-4 w-full sm:w-auto">{isRTL ? "تراجع" : "Cancel & Go Back"}</button>
                        <button 
                            onClick={handleFinish} 
                            className={`px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.03] flex items-center justify-center gap-3 w-full sm:w-auto`}
                            style={{ background: "#00e5a0", boxShadow: `0 10px 40px rgba(0,229,160,0.3)` }}>
                            <CircleCheck size={22} /> {isRTL ? "أؤكد تحويل المبلغ" : "I Confirm Payment Sent"}
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
                    <h2 className="text-4xl font-black mb-4 text-white">{isRTL ? "قيد المراجعة" : "Verification Pending"}</h2>
                    <p className="text-lg text-gray-400 max-w-md mx-auto leading-relaxed font-medium">
                        {isRTL ? "يتم التحقق من الدفعة الآن، سيتم منحك وصول كامل للمنصة حين موافقة الإدارة. نافذة الترقية ستغلق تلقائياً." : "Your payment is being verified by our compliance team. You will be granted full access within 2-4 hours. You may close this window."}
                    </p>
                </div>
            )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
