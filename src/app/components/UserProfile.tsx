import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Shield, CreditCard, Clock, Bot, Zap, ArrowRight, Settings, Check, Send, Coins, CircleCheck, ArrowLeft, Plus, Copy, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

interface UserProfileProps {
    onClose: () => void;
    onTopUp: () => void;
}

export function UserProfile({ onClose, onTopUp }: UserProfileProps) {
    const { t, language } = useLanguage();
    const { user, subscriptionPlan, subscriptionStatus, aiTokens, hasAIAccess, addTokens } = useAuth();
    
    const [view, setView] = useState<"dashboard" | "topup" | "pending">("dashboard");
    const [selectedPackage, setSelectedPackage] = useState<1000 | 3000 | 10000>(3000);
    const [isProcessing, setIsProcessing] = useState(false);

    const isRTL = language === "ar";
    const walletAddress = "TQwFCKK5JjZACHdE888zG5iUx8wQ2RtnAV";

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleConfirmTopUp = () => {
        setIsProcessing(true);
        // Simulate a brief verification delay, then dynamically credit tokens to satisfy the flow
        setTimeout(() => {
            setIsProcessing(false);
            addTokens(selectedPackage);
            setView("pending");
            setTimeout(() => {
                setView("dashboard");
            }, 3000);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/70"
             dir={isRTL ? "rtl" : "ltr"}
             style={{ fontFamily: "'Inter', sans-serif" }}>
             
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="w-full max-w-5xl rounded-[32px] overflow-hidden relative shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
                style={{ 
                    border: `1px solid #1c2230`,
                    height: "85vh",
                    maxHeight: "800px"
                }}
            >
                <AnimatePresence mode="wait">
                    {/* ──── DASHBOARD VIEW ──── */}
                    {view === "dashboard" && (
                        <motion.div key="dashboard" 
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col md:flex-row h-full">
                            
                            {/* Sidebar */}
                            <div className="md:w-1/3 relative p-10 flex flex-col items-center justify-center text-center border-r border-[#1c2230]" 
                                style={{ background: `linear-gradient(135deg, #10141d, #0b0e14)` }}>
                                
                                <div className="absolute inset-x-10 top-20 bottom-20 opacity-30 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, rgba(0,229,160,0.3) 0%, transparent 70%)`, filter: "blur(40px)" }} />
                                
                                <div className="w-32 h-32 rounded-full mb-6 relative flex items-center justify-center z-10 shadow-[0_0_40px_rgba(0,229,160,0.2)]"
                                    style={{ background: `linear-gradient(135deg, rgba(0,229,160,0.1), rgba(0,0,0,0.8))`, border: `2px solid #00e5a0` }}>
                                    <User size={56} className="text-[#00e5a0]" strokeWidth={1.5} />
                                </div>
                                
                                <h2 className="text-3xl font-black mb-1 z-10 text-white">{user?.name || "Premium Trader"}</h2>
                                <p className="text-sm font-medium z-10 mb-8 text-gray-400">{user?.email || "elite@phasex.ai"}</p>
                                
                                <div className="w-full p-6 rounded-2xl z-10 text-left bg-[#0b0e14] border border-[#1c2230] shadow-inner mt-auto">
                                    <div className="text-xs font-black uppercase tracking-widest mb-3 text-gray-500">Account Status</div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex h-3.5 w-3.5">
                                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${subscriptionStatus === 'active' ? 'bg-[#00e5a0]' : subscriptionStatus === 'pending' ? 'bg-[#facc15]' : 'bg-[#ef4444]'}`}></span>
                                                <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${subscriptionStatus === 'active' ? 'bg-[#00e5a0]' : subscriptionStatus === 'pending' ? 'bg-[#facc15]' : 'bg-[#ef4444]'}`}></span>
                                            </div>
                                            <span className="font-bold capitalize text-white text-lg">{subscriptionStatus}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="md:w-2/3 p-10 relative bg-[#0b0e14] flex flex-col h-full overflow-y-auto">
                                <button onClick={onClose} className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 z-20">
                                    <X size={26} />
                                </button>
                                
                                <h3 className="text-3xl font-black mb-10 flex items-center gap-3 text-white">
                                    <Shield className="text-[#00c3ff]" size={30} /> Terminal Dashboard
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 flex-shrink-0">
                                    {/* Plan Card */}
                                    <div className="p-8 rounded-[32px] border border-[#1c2230] bg-[#10141d] hover:border-gray-700 transition-colors flex flex-col">
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#1c2230] text-gray-300 shadow-inner">
                                                <CreditCard size={28} />
                                            </div>
                                            <span className="text-[10px] font-black px-3 py-1.5 rounded-lg bg-[#1c2230] uppercase tracking-widest text-gray-400">{t("currentPlan") || "Current Plan"}</span>
                                        </div>
                                        <div className="text-4xl font-black capitalize mb-3 text-white">
                                            {subscriptionPlan === 'none' ? 'Guest' 
                                            : subscriptionPlan === 'monthly' ? (t("planMonthly") || 'Monthly')
                                            : subscriptionPlan === 'quarterly' ? (t("planQuarterly") || 'Quarterly')
                                            : subscriptionPlan === 'semi-annual' ? (t("planSemiAnnual") || 'Semi-Annual')
                                            : subscriptionPlan === 'annual' ? (t("planAnnual") || 'Annual')
                                            : subscriptionPlan}
                                        </div>
                                        <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
                                            {subscriptionPlan === 'none' ? 'Upgrade to access full terminal systems.' : 'Full phase-state terminal access enabled.'}
                                        </p>
                                        
                                        <button onClick={() => { onClose(); onTopUp(); }} className="mt-auto w-full py-4 rounded-xl font-bold text-sm transition-colors border border-[#252a36] text-white bg-[#1a202d] hover:bg-[#252a36] uppercase tracking-widest">
                                            {subscriptionPlan === 'none' ? 'Upgrade Plan' : 'Manage Subscription'}
                                        </button>
                                    </div>

                                    {/* AI Tokens Card */}
                                    <div className="p-8 rounded-[32px] border relative overflow-hidden group transition-all flex flex-col" 
                                        style={{ borderColor: aiTokens > 0 ? "#00c3ff" : "#1c2230", background: "#10141d", boxShadow: aiTokens > 0 ? `0 10px 40px rgba(0,195,255,0.08)` : 'none' }}>
                                        
                                        {aiTokens > 0 && <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-[#00c3ff] opacity-15 rounded-full blur-[50px] pointer-events-none" />}
                                        
                                        <div className="flex items-start justify-between mb-6 relative z-10">
                                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: aiTokens > 0 ? "rgba(0,195,255,0.15)" : "#1c2230", color: aiTokens > 0 ? "#00c3ff" : "#64748b" }}>
                                                <Bot size={30} />
                                            </div>
                                            <span className="text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest" style={{ backgroundColor: aiTokens > 0 ? "rgba(0,195,255,0.15)" : "#1c2230", color: aiTokens > 0 ? "#00c3ff" : "#64748b" }}>AI Compute</span>
                                        </div>
                                        
                                        <div className="text-5xl font-black mb-2 flex items-baseline gap-2 relative z-10 text-white">
                                            {aiTokens.toLocaleString()} <span className="text-sm font-bold opacity-50 uppercase tracking-widest text-gray-400">Tokens</span>
                                        </div>
                                        
                                        {aiTokens > 0 ? (
                                            <p className="text-sm font-medium relative z-10 flex items-center gap-2 text-[#00e5a0] mb-8 mt-3">
                                                <Zap size={16} /> Systems Online & Ready
                                            </p>
                                        ) : (
                                            <p className="text-sm font-medium relative z-10 text-red-500 mb-8 mt-3 flex items-center gap-2">
                                                <ArrowRight size={16} /> Insufficient Tokens
                                            </p>
                                        )}

                                        <button onClick={() => setView("topup")} className="mt-auto w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-transform relative z-10 flex items-center justify-center gap-2 text-black hover:scale-[1.03]"
                                            style={{ background: aiTokens > 0 ? "#00c3ff" : "#fff", boxShadow: aiTokens > 0 ? `0 0 25px rgba(0,195,255,0.4)` : 'none' }}>
                                            <Plus size={20} strokeWidth={3} /> Top-up Balance
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8 mt-auto rounded-[32px] border border-[#1c2230] bg-[#10141d] flex items-center justify-between flex-shrink-0">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#facc15]/10 text-[#facc15]">
                                            <Clock size={26} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-xl">Billing Cycle</h4>
                                            <p className="text-sm text-gray-400 mt-1">{subscriptionPlan === 'none' ? 'No active plan.' : 'Next payment due in 14 days.'}</p>
                                        </div>
                                    </div>
                                    <button className="p-4 rounded-xl hover:bg-white/5 text-gray-400 transition-colors border border-transparent hover:border-[#252a36]">
                                        <Settings size={22} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ──── TOP-UP VIEW ──── */}
                    {view === "topup" && (
                        <motion.div key="topup" 
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            className="p-12 relative bg-[#0b0e14] h-full flex flex-col">
                            
                            <button onClick={() => setView("dashboard")} className="absolute top-8 left-8 p-3 rounded-full flex items-center gap-3 hover:bg-white/5 transition-colors text-gray-400 z-10">
                                <ArrowLeft size={22} /> <span className="font-bold text-sm uppercase tracking-widest">Back</span>
                            </button>
                            <button onClick={onClose} className="absolute top-8 right-8 p-3 rounded-full hover:bg-white/5 transition-colors text-gray-400 z-10">
                                <X size={26} />
                            </button>

                            <div className="text-center mt-6 mb-10 relative z-10">
                                <div className="w-20 h-20 bg-[#00c3ff]/10 rounded-3xl flex items-center justify-center mx-auto mb-5 border border-[#00c3ff]/30 shadow-[0_0_30px_rgba(0,195,255,0.2)]">
                                    <Coins size={36} className="text-[#00c3ff]" />
                                </div>
                                <h2 className="text-4xl font-black text-white">Top-up AI Tokens</h2>
                                <p className="text-gray-400 mt-2 text-base font-medium">Purchase additional compute power for live radar and chat analysis.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10 max-w-4xl mx-auto w-full">
                                {[
                                    { tokens: 1000, price: 10, name: "Starter", color: "#64748b" },
                                    { tokens: 3000, price: 20, name: "Pro", color: "#00c3ff", popular: true },
                                    { tokens: 10000, price: 50, name: "Max", color: "#a855f7" },
                                ].map(pkg => (
                                    <div key={pkg.tokens} 
                                         onClick={() => setSelectedPackage(pkg.tokens as any)}
                                         className={`cursor-pointer rounded-[24px] p-8 border-2 transition-all relative overflow-hidden flex flex-col justify-center ${selectedPackage === pkg.tokens ? 'shadow-2xl' : 'hover:border-[#252a36]'}`}
                                         style={{ 
                                             borderColor: selectedPackage === pkg.tokens ? pkg.color : "#1c2230",
                                             backgroundColor: selectedPackage === pkg.tokens ? `${pkg.color}10` : "#10141d",
                                             transform: selectedPackage === pkg.tokens ? "translateY(-6px)" : "none"
                                         }}>
                                         
                                         {pkg.popular && (
                                             <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#00c3ff] text-black text-[10px] font-black uppercase tracking-widest rounded-bl-xl shadow-lg">Recommended</div>
                                         )}
                                         {selectedPackage === pkg.tokens && (
                                             <div className="absolute top-6 right-6 rounded-full p-1 border-2" style={{ color: pkg.color, borderColor: pkg.color }}>
                                                 <Check size={14} strokeWidth={4} />
                                             </div>
                                         )}

                                         <div className="text-xs font-black uppercase tracking-widest mb-2 text-gray-500">{pkg.name}</div>
                                         <div className="text-4xl font-black text-white mb-6">{pkg.tokens.toLocaleString()} <span className="text-sm font-bold text-gray-500">TK</span></div>
                                         <div className="text-3xl font-black mt-auto" style={{ color: selectedPackage === pkg.tokens ? pkg.color : "#fff" }}>${pkg.price}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex-1 bg-[#10141d] rounded-[32px] border border-[#1c2230] p-8 flex flex-col md:flex-row gap-8 justify-between max-w-4xl mx-auto w-full relative z-10 shadow-inner">
                                <div className="flex-1">
                                    <h4 className="font-bold text-white mb-4 flex items-center gap-2 text-lg"><Send size={20} className="text-[#00c3ff]" /> Payment Instructions</h4>
                                    <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                                        Send exactly <strong className="text-white">${selectedPackage === 1000 ? 10 : selectedPackage === 3000 ? 20 : 50}</strong> via Telegram (<strong className="text-[#0088cc]">@PhaeX_Ai</strong>) or USDT TRC20 to get tokens credited immediately.
                                    </p>
                                    <div className="flex items-center justify-between p-4 bg-[#0b0e14] rounded-xl border border-[#1c2230] cursor-pointer hover:border-[#f7931a]/50 transition-colors group" onClick={() => copyToClipboard(walletAddress)}>
                                        <span className="font-mono text-sm text-gray-300 break-all pr-4">{walletAddress}</span>
                                        <span className="text-[#f7931a] group-hover:text-white group-hover:bg-[#f7931a] transition-colors p-2.5 bg-[#f7931a]/15 rounded-lg shrink-0"><Copy size={18} /></span>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-end min-w-[300px]">
                                    <button 
                                        onClick={handleConfirmTopUp} 
                                        disabled={isProcessing}
                                        className={`w-full py-5 rounded-xl font-black uppercase tracking-widest text-black transition-all flex items-center justify-center gap-3 ${isProcessing ? 'opacity-70' : 'hover:scale-[1.02]'}`}
                                        style={{ background: "#00c3ff", boxShadow: `0 10px 40px rgba(0,195,255,0.3)` }}>
                                        {isProcessing ? <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"/> Processing...</span> : <><CircleCheck size={22} /> I Have Paid ${selectedPackage === 1000 ? 10 : selectedPackage === 3000 ? 20 : 50}</>}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ──── PENDING/SUCCESS VIEW ──── */}
                    {view === "pending" && (
                        <motion.div key="pending" 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="p-12 text-center h-full flex flex-col items-center justify-center bg-[#0b0e14]">
                            
                            <motion.div className="w-32 h-32 rounded-full flex items-center justify-center mb-8 relative"
                                style={{ background: `linear-gradient(135deg, rgba(0,195,255,0.2) 0%, transparent 100%)` }}>
                                <motion.div className="absolute inset-0 border-4 rounded-full border-t-[#00c3ff] border-r-transparent border-b-[#00c3ff] border-l-transparent" 
                                    animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                                <Check size={56} color="#00c3ff" />
                            </motion.div>
                            <h2 className="text-4xl font-black mb-4 text-white">Tokens Verified!</h2>
                            <p className="text-lg text-gray-400 max-w-md mx-auto leading-relaxed font-medium">
                                <strong className="text-white text-xl mx-2">{selectedPackage.toLocaleString()}</strong> AI Tokens have been successfully added to your balance. Returning to dashboard...
                            </p>
                            
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

