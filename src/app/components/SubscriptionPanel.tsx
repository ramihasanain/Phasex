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
  const [step, setStep] = useState<"plans" | "pending">("plans");
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

  const handleUpgrade = () => {
      if (!selectedPlan) return;
      submitReceipt(selectedPlan as any, false);
      setStep("pending");
      setTimeout(() => {
          onClose();
          setStep("plans"); // Reset for next time
      }, 3000);
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
  };

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
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="p-8 rounded-[32px] border border-[#facc15]/30 bg-[#facc15]/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(250,204,21,0.05)]">
                            <div>
                                <h4 className="font-black text-white text-xl mb-2 flex items-center gap-3"><Send className="text-[#facc15]" /> Manual Verification Override</h4>
                                <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-2xl">
                                    Upgrades are currently processed manually via our Telegram channels. Please send the exact amount to <strong className="text-white">@PhaeX_Ai</strong> or <strong className="text-white">@PhaseX_Ai_SupportBot</strong> or via USDT TRC20: <br/>
                                    <span className="font-mono text-[#facc15] bg-[#facc15]/10 px-2 py-1 rounded inline-block mt-2">{walletAddress}</span>
                                </p>
                            </div>
                            <button onClick={handleUpgrade}
                                className="w-full md:w-auto px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.03] flex items-center justify-center gap-3 shrink-0"
                                style={{ background: `linear-gradient(90deg, #facc15, #f59e0b)`, boxShadow: `0 10px 30px rgba(250,204,21,0.3)` }}>
                                <CircleCheck size={22} /> Request Upgrade
                            </button>
                        </motion.div>
                    )}
                </div>
            )}

            {step === "pending" && (
                <div className="flex-1 flex flex-col items-center justify-center p-16 text-center h-[600px]">
                    <motion.div className="w-32 h-32 rounded-full flex items-center justify-center mb-8 relative"
                        style={{ background: `linear-gradient(135deg, rgba(250,204,21,0.2) 0%, transparent 100%)` }}>
                        <motion.div className="absolute inset-0 border-4 rounded-full border-t-[#facc15] border-r-transparent border-b-[#facc15] border-l-transparent" 
                            animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                        <Check size={56} color="#facc15" />
                    </motion.div>
                    <h2 className="text-4xl font-black mb-4 text-white">Upgrade Requested</h2>
                    <p className="text-lg text-gray-400 max-w-md mx-auto leading-relaxed font-medium">
                        Your request has been forwarded to the compliance team. Once verified, your account will be upgraded immediately. You may close this window.
                    </p>
                </div>
            )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
