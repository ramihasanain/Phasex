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
            title: "Monthly", 
            price: 29,
            frequency: "month",
            icon: <Zap size={24} className="text-[#3b82f6]" />,
            iconBg: "bg-[#3b82f6]/10",
            iconColor: "#3b82f6",
            features: ["5 Technical Indicators", "All Markets", "Technical Support", "Daily Updates"],
            badge: null
        },
        { 
            id: "quarterly" as SubscriptionPlan, 
            title: "Quarterly", 
            price: 69,
            frequency: "3 months",
            icon: <Star size={24} className="text-[#00e5a0]" />,
            iconBg: "bg-[#00e5a0]/10",
            iconColor: "#00e5a0",
            features: ["All Monthly Features", "Priority Support", "Advanced Analytics", "Training Sessions", "Instant Alerts"],
            badge: { text: "Best Choice", color: "#00e5a0", rightText: "Save 20%" }
        },
        { 
            id: "annual" as SubscriptionPlan, 
            title: "Annual", 
            price: 199,
            frequency: "year",
            icon: <Trophy size={24} className="text-[#facc15]" />,
            iconBg: "bg-[#facc15]/10",
            iconColor: "#facc15",
            features: ["All Quarterly Features", "1-on-1 Consultation", "Alpha Signal Access", "Dedicated Manager", "VIP Status"],
            badge: { text: "Max Value", color: "#facc15", rightText: "Save 43%" }
        },
    ];

    const currentPlan = plans.find(p => p.id === selectedPlan)!;
    const totalAmount = currentPlan.price + (aiAddon ? 20 : 0);

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
                        {/* Step Indicator */}
                        <div className="flex justify-center items-center mb-8 w-full max-w-2xl mx-auto">
                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#3b82f6] shadow-[0_0_20px_rgba(59,130,246,0.6)] z-10 relative">
                                    <Check size={28} color="white" strokeWidth={3} />
                                </div>
                                <span className="text-xs font-bold text-gray-500 mt-3 tracking-wide">Personal Info</span>
                            </div>
                            
                            <div className="flex-1 h-1 bg-[#1c2230] mx-4 relative top-[-10px]">
                                <div className="h-full bg-[#3b82f6] w-[100%] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#00e5a0] shadow-[0_0_20px_rgba(0,229,160,0.6)] z-10 relative">
                                    <Check size={28} color="black" strokeWidth={4} />
                                </div>
                                <span className="text-xs font-bold text-gray-500 mt-3 tracking-wide">Account Details</span>
                            </div>

                            <div className="flex-1 h-1 bg-[#1c2230] mx-4 relative top-[-10px]">
                                <div className="h-full bg-[#00e5a0] w-[100%] rounded-full shadow-[0_0_8px_rgba(0,229,160,0.5)]"></div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#facc15] shadow-[0_0_25px_rgba(250,204,21,0.5)] z-10 relative">
                                    <Crown size={30} color="black" strokeWidth={3} />
                                </div>
                                <span className="text-xs font-black text-white mt-3 tracking-wide">Choose Plan</span>
                            </div>
                        </div>

                        {/* Hero Texts */}
                        <div className="text-center mb-8 relative z-10">
                            <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight text-[#facc15]" style={{ textShadow: '0 0 30px rgba(250,204,21,0.4)' }}>
                                Join PHASE X
                            </h1>
                            <p className="text-gray-400 text-lg font-medium">Complete your details and start your journey</p>
                        </div>

                        <div className="flex justify-center mb-10 w-full relative z-10">
                            <div className="px-8 py-3 rounded-full border border-[#facc15]/30 bg-[#facc15]/10 flex items-center gap-2 shadow-[0_0_20px_rgba(250,204,21,0.15)]">
                                <Crown size={20} className="text-[#facc15]" />
                                <span className="font-black text-[#facc15] tracking-widest uppercase text-sm">Choose your perfect plan</span>
                            </div>
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1200px] mx-auto relative z-10">
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
                            className="mt-10 mx-auto w-full max-w-[1200px] p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between cursor-pointer border transition-all relative z-10"
                            onClick={() => setAiAddon(!aiAddon)}
                            style={{
                                backgroundColor: aiAddon ? `rgba(0, 195, 255, 0.05)` : "#10141d",
                                borderColor: aiAddon ? "#00c3ff" : "#1c2230",
                                boxShadow: aiAddon ? `0 10px 40px rgba(0,195,255,0.15), inset 0 0 20px rgba(0,195,255,0.05)` : 'none'
                            }}
                        >
                            <div className="flex items-center gap-8">
                                <div className="w-20 h-20 rounded-[20px] flex items-center justify-center relative bg-[#0b0e14] border border-[#00c3ff]/30 shrink-0">
                                    {aiAddon && <motion.div className="absolute inset-0 rounded-[20px] border-2 border-dashed border-[#00c3ff]/50" animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />}
                                    <Bot size={36} color={aiAddon ? "#00c3ff" : "#4b5563"} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
                                        Phase-X AI Market Insight <Zap size={20} className="text-[#00c3ff]" />
                                    </h3>
                                    <p className="text-base font-medium text-gray-400 max-w-2xl leading-relaxed">Unlock elite AI analytics. Get 3,000 AI Tokens to power live radar scans and contextual conversational insights instantly.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 mt-6 md:mt-0 shrink-0">
                                <div className="text-right">
                                    <div className="text-4xl font-black text-[#00c3ff]">$20</div>
                                    <div className="text-xs font-black uppercase tracking-widest text-gray-500 mt-1">/ Month</div>
                                </div>
                                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${aiAddon ? 'border-[#00c3ff] bg-[#00c3ff]/20 text-[#00c3ff]' : 'border-[#4b5563] text-transparent'}`}>
                                    <Check size={24} strokeWidth={4} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Continue Button */}
                        <div className="w-full max-w-[1200px] mx-auto mt-10 flex flex-col sm:flex-row justify-between items-center bg-[#10141d] p-8 rounded-[32px] border border-[#1c2230] relative z-10">
                            <div className="font-bold text-xl text-gray-400 mb-6 sm:mb-0">
                                Total Due: <span className="text-4xl font-black text-white ml-3">${totalAmount.toFixed(2)}</span>
                            </div>
                            <button onClick={() => setStep("payment")}
                                className="px-12 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 text-black transition-transform hover:scale-[1.03] text-lg w-full sm:w-auto justify-center"
                                style={{ background: `linear-gradient(90deg, #facc15, #f59e0b)`, boxShadow: `0 10px 30px rgba(250,204,21,0.3)` }}>
                                Checkout Selected Plan <ArrowRight size={22} />
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
                            <h2 className="text-3xl font-black text-white">Confirm Payment</h2>
                            <p className="text-gray-400 mt-2 text-base">To bypass gateways and get immediate processing, send exactly this amount manually.</p>
                        </div>

                        <div className="p-6 rounded-2xl mb-10 flex justify-between items-center bg-[#0b0e14] border border-[#1c2230] shadow-inner">
                            <span className="font-black text-gray-400 uppercase tracking-widest text-sm">Amount Due</span>
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
                                    Telegram Fast-Track
                                </h3>
                                <p className="text-sm font-medium text-gray-400 mb-6 relative z-10">Send payment verification directly to a trusted agent.</p>
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
                                    Crypto (USDT TRC20)
                                </h3>
                                <p className="text-sm font-medium text-gray-400 mb-6 relative z-10">Send the exact amount from your secure wallet to our address.</p>
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
                                    No receipt upload required here. If you have sent the funds and contacted support, simply confirm below. Your account will automatically enter the priority verification queue.
                                </p>
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                                <button onClick={() => setStep("plans")} className="font-bold text-gray-500 hover:text-white transition-colors px-6 py-4 w-full sm:w-auto">Cancel & Go Back</button>
                                <button 
                                    onClick={handleFinish} 
                                    className={`px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.03] flex items-center justify-center gap-3 w-full sm:w-auto`}
                                    style={{ background: "#00e5a0", boxShadow: `0 10px 40px rgba(0,229,160,0.3)` }}>
                                    <CircleCheck size={22} /> I Confirm Payment Sent
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === "pending" && (
                    <motion.div key="pending"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center relative z-10 p-12 rounded-[32px] bg-[#10141d] max-w-xl w-full mx-auto my-auto"
                        style={{ border: `1px solid rgba(0,229,160,0.3)`, boxShadow: `0 0 80px rgba(0,229,160,0.15)` }}
                    >
                        <motion.div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-8 relative"
                            style={{ background: `linear-gradient(135deg, rgba(0,229,160,0.2) 0%, transparent 100%)` }}>
                            <motion.div className="absolute inset-0 border-4 rounded-full border-t-[#00e5a0] border-r-transparent border-b-[#00e5a0] border-l-transparent" 
                                animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                            <Check size={56} color="#00e5a0" />
                        </motion.div>
                        <h2 className="text-4xl font-black mb-4 text-white">Verification Pending</h2>
                        <p className="text-lg mb-8 leading-relaxed font-medium text-gray-400">
                            Your payment is being verified by our compliance team. You will be granted full access within 2-4 hours. Redirecting to your dashboard...
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

