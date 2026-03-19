import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Shield, CreditCard, Clock, Bot, Zap, ArrowRight, Settings, Check, Send, Coins, CircleCheck, ArrowLeft, Plus, Copy, X, Gift, Users, DollarSign, Crown, Star, Trophy, Sparkles, Activity } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

interface UserProfileProps {
    onClose: () => void;
    onTopUp: () => void;
}

const planThemes: Record<string, { color: string; gradient: string; glow: string; icon: string; bg: string }> = {
    core: { color: "#3b82f6", gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)", glow: "rgba(59,130,246,0.25)", icon: "⚡", bg: "rgba(59,130,246,0.08)" },
    trader: { color: "#00e5a0", gradient: "linear-gradient(135deg, #00e5a0, #00b37e)", glow: "rgba(0,229,160,0.25)", icon: "⭐", bg: "rgba(0,229,160,0.08)" },
    professional: { color: "#a855f7", gradient: "linear-gradient(135deg, #a855f7, #7c3aed)", glow: "rgba(168,85,247,0.25)", icon: "🏆", bg: "rgba(168,85,247,0.08)" },
    institutional: { color: "#facc15", gradient: "linear-gradient(135deg, #facc15, #eab308)", glow: "rgba(250,204,21,0.25)", icon: "👑", bg: "rgba(250,204,21,0.08)" },
    none: { color: "#64748b", gradient: "linear-gradient(135deg, #64748b, #475569)", glow: "rgba(100,116,139,0.15)", icon: "🔒", bg: "rgba(100,116,139,0.08)" },
};

const PlanIcon = ({ plan, size }: { plan: string; size: number }) => {
    const theme = planThemes[plan] || planThemes.none;
    if (plan === "core") return <Zap size={size} style={{ color: theme.color }} />;
    if (plan === "trader") return <Star size={size} style={{ color: theme.color }} />;
    if (plan === "professional") return <Trophy size={size} style={{ color: theme.color }} />;
    if (plan === "institutional") return <Crown size={size} style={{ color: theme.color }} />;
    return <Shield size={size} style={{ color: theme.color }} />;
};

export function UserProfile({ onClose, onTopUp }: UserProfileProps) {
    const { t, language } = useLanguage();
    const { user, subscriptionPlan, subscriptionStatus, subscriptionDetails, aiTokens, hasAIAccess, hasMT5Access, addTokens, referralCode, referralBalance, referralHistory } = useAuth();
    
    const [view, setView] = useState<"dashboard" | "topup" | "pending" | "referral">("dashboard");
    const [selectedPackage, setSelectedPackage] = useState<250 | 700 | 2000>(700);
    const [isProcessing, setIsProcessing] = useState(false);
    const [codeCopied, setCodeCopied] = useState(false);

    const isRTL = language === "ar";
    const walletAddress = "TQwFCKK5JjZACHdE888zG5iUx8wQ2RtnAV";
    const theme = planThemes[subscriptionPlan] || planThemes.none;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const copyReferralCode = () => {
        navigator.clipboard.writeText(referralCode);
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
    };

    const handleConfirmTopUp = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            addTokens(selectedPackage);
            setView("pending");
            setTimeout(() => {
                setView("dashboard");
            }, 3000);
        }, 1500);
    };

    const planDisplayName = subscriptionPlan === 'none' ? 'Guest'
        : subscriptionPlan === 'core' ? t("planCoreName")
        : subscriptionPlan === 'trader' ? t("planTraderName")
        : subscriptionPlan === 'professional' ? t("planProName")
        : subscriptionPlan === 'institutional' ? t("planInstName")
        : subscriptionPlan;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/70"
             dir={isRTL ? "rtl" : "ltr"}
             style={{ fontFamily: "'Inter', sans-serif" }}>
             
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="w-full max-w-5xl rounded-[32px] overflow-hidden relative"
                style={{ 
                    border: `1px solid ${theme.color}25`,
                    height: "85vh",
                    maxHeight: "800px",
                    boxShadow: `0 30px 80px rgba(0,0,0,0.8), 0 0 60px ${theme.glow}`
                }}
            >
                <AnimatePresence mode="wait">
                    {/* ──── DASHBOARD VIEW ──── */}
                    {view === "dashboard" && (
                        <motion.div key="dashboard" 
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col md:flex-row h-full">
                            
                            {/* Sidebar */}
                            <div className="md:w-[38%] relative p-10 flex flex-col items-center justify-center text-center overflow-hidden" 
                                style={{ background: `linear-gradient(160deg, #10141d 0%, #0b0e14 60%, ${theme.color}08 100%)`, borderRight: `1px solid ${theme.color}15` }}>
                                
                                {/* Animated glow orbs */}
                                <motion.div className="absolute top-[-100px] left-[-50px] w-[300px] h-[300px] rounded-full pointer-events-none"
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    style={{ background: `radial-gradient(circle, ${theme.color}30 0%, transparent 70%)`, filter: "blur(60px)" }} />
                                <motion.div className="absolute bottom-[-80px] right-[-60px] w-[250px] h-[250px] rounded-full pointer-events-none"
                                    animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.1, 0.2, 0.1] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    style={{ background: `radial-gradient(circle, ${theme.color}20 0%, transparent 70%)`, filter: "blur(50px)" }} />
                                
                                {/* Avatar */}
                                <motion.div 
                                    className="w-28 h-28 rounded-full mb-5 relative flex items-center justify-center z-10"
                                    animate={{ boxShadow: [`0 0 20px ${theme.glow}`, `0 0 40px ${theme.glow}`, `0 0 20px ${theme.glow}`] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    style={{ background: `linear-gradient(135deg, ${theme.color}15, rgba(0,0,0,0.6))`, border: `2px solid ${theme.color}` }}>
                                    <User size={48} style={{ color: theme.color }} strokeWidth={1.5} />
                                    {/* Plan badge on avatar */}
                                    <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-lg"
                                        style={{ background: theme.gradient, border: `2px solid #0b0e14` }}>
                                        {theme.icon}
                                    </div>
                                </motion.div>
                                
                                <h2 className="text-2xl font-black mb-0.5 z-10 text-white">{user?.name || "Premium Trader"}</h2>
                                <p className="text-xs font-medium z-10 mb-2 text-gray-500">{user?.email || "elite@phasex.ai"}</p>
                                
                                {/* Plan Badge */}
                                <div className="px-4 py-1.5 rounded-full mb-6 z-10 flex items-center gap-2"
                                    style={{ background: `${theme.color}15`, border: `1px solid ${theme.color}30` }}>
                                    <PlanIcon plan={subscriptionPlan} size={14} />
                                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: theme.color }}>
                                        {planDisplayName}
                                    </span>
                                </div>
                                
                                {/* Account Status */}
                                <div className="w-full p-5 rounded-2xl z-10 bg-[#0b0e14]/80 border shadow-inner mt-auto" style={{ borderColor: `${theme.color}15` }}>
                                    <div className="text-[10px] font-black uppercase tracking-widest mb-3 text-gray-600">Account Status</div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: subscriptionStatus === 'active' ? '#00e5a0' : subscriptionStatus === 'pending' ? '#facc15' : '#ef4444' }}></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: subscriptionStatus === 'active' ? '#00e5a0' : subscriptionStatus === 'pending' ? '#facc15' : '#ef4444' }}></span>
                                            </div>
                                            <span className="font-bold capitalize text-white text-sm">{subscriptionStatus}</span>
                                        </div>
                                        {subscriptionStatus === 'active' && (
                                            <div className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-[#00e5a0]/10 text-[#00e5a0]">Live</div>
                                        )}
                                    </div>
                                    
                                    {/* MT5 Status Display in sidebar */}
                                    <div className="mt-4 pt-4 border-t" style={{ borderColor: `${theme.color}10` }}>
                                        <div className="text-[10px] font-black uppercase tracking-widest mb-2 text-gray-600">MT5 Integration</div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                 <Activity size={14} className={hasMT5Access ? "text-[#6366f1]" : "text-gray-500"} />
                                                <span className="text-xs font-bold text-white">{hasMT5Access ? "Active" : "Inactive"}</span>
                                            </div>
                                            {hasMT5Access ? (
                                                <div className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-[#6366f1]/10 text-[#6366f1]">Live</div>
                                            ) : (
                                                <div className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-gray-500/10 text-gray-500">Disabled</div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Referral Code Display in sidebar */}
                                    {referralCode && (
                                        <div className="mt-4 pt-4 border-t" style={{ borderColor: `${theme.color}10` }}>
                                            <div className="text-[10px] font-black uppercase tracking-widest mb-2 text-gray-600">{t("yourReferralCode")}</div>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-mono text-sm font-black tracking-wider" style={{ color: theme.color }}>{referralCode}</span>
                                                <button onClick={copyReferralCode}
                                                    className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1"
                                                    style={{ background: codeCopied ? "#00e5a015" : `${theme.color}15`, color: codeCopied ? "#00e5a0" : theme.color }}>
                                                    {codeCopied ? <><Check size={10} /> {t("codeCopied")}</> : <><Copy size={10} /> {t("copyCode")}</>}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="md:w-[62%] p-8 relative bg-[#0b0e14] flex flex-col h-full overflow-y-auto">
                                <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 z-20 cursor-pointer">
                                    <X size={22} />
                                </button>
                                
                                <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-white">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${theme.color}15` }}>
                                        <Shield size={22} style={{ color: theme.color }} />
                                    </div>
                                    Terminal Dashboard
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 flex-shrink-0">
                                    {/* Plan Card */}
                                    <motion.div whileHover={{ y: -3 }} className="p-6 rounded-[24px] border bg-[#10141d] hover:border-opacity-60 transition-all flex flex-col cursor-pointer relative overflow-hidden group"
                                        onClick={() => { onClose(); onTopUp(); }}
                                        style={{ borderColor: `${theme.color}20` }}>
                                        <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{ background: `radial-gradient(circle, ${theme.color}15, transparent 70%)`, filter: "blur(30px)" }} />
                                        <div className="flex items-start justify-between mb-5">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner" style={{ background: `${theme.color}15` }}>
                                                <PlanIcon plan={subscriptionPlan} size={24} />
                                            </div>
                                            <span className="text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest" style={{ background: `${theme.color}12`, color: theme.color }}>{t("currentPlan") || "Current Plan"}</span>
                                        </div>
                                        <div className="text-2xl font-black capitalize mb-1 text-white">{planDisplayName}</div>
                                        <p className="text-[11px] font-medium text-gray-500 mb-4 leading-relaxed">
                                            {subscriptionPlan === 'none' ? 'Upgrade to access full terminal systems.' : 'Full phase-state terminal access enabled.'}
                                        </p>
                                        <div className="mt-auto pt-3 border-t flex items-center justify-between" style={{ borderColor: `${theme.color}10` }}>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                {subscriptionPlan === 'none' ? 'Upgrade Plan' : 'Manage'}
                                            </span>
                                            <ArrowRight size={14} className="text-gray-500" />
                                        </div>
                                    </motion.div>

                                    {/* AI Tokens Card */}
                                    <motion.div whileHover={{ y: -3 }} className="p-6 rounded-[24px] border relative overflow-hidden group transition-all flex flex-col cursor-pointer"
                                        onClick={() => setView("topup")}
                                        style={{ borderColor: aiTokens > 0 ? "#00c3ff30" : "#1c2230", background: "#10141d" }}>
                                        
                                        {aiTokens > 0 && <div className="absolute top-[-40px] right-[-40px] w-[160px] h-[160px] bg-[#00c3ff] opacity-[0.06] rounded-full blur-[40px] pointer-events-none group-hover:opacity-[0.12] transition-opacity" />}
                                        
                                        <div className="flex items-start justify-between mb-5 relative z-10">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner" style={{ backgroundColor: aiTokens > 0 ? "rgba(0,195,255,0.12)" : "#1c2230", color: aiTokens > 0 ? "#00c3ff" : "#64748b" }}>
                                                <Bot size={24} />
                                            </div>
                                            <span className="text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest" style={{ backgroundColor: aiTokens > 0 ? "rgba(0,195,255,0.12)" : "#1c2230", color: aiTokens > 0 ? "#00c3ff" : "#64748b" }}>AI Compute</span>
                                        </div>
                                        
                                        <div className="text-3xl font-black mb-0.5 flex items-baseline gap-2 relative z-10 text-white">
                                            {aiTokens.toLocaleString()} <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Tokens</span>
                                        </div>
                                        
                                        {aiTokens > 0 ? (
                                            <p className="text-[11px] font-medium relative z-10 flex items-center gap-1.5 text-[#00e5a0] mb-4 mt-1">
                                                <Sparkles size={12} /> Systems Online
                                            </p>
                                        ) : (
                                            <p className="text-[11px] font-medium relative z-10 text-red-400 mb-4 mt-1 flex items-center gap-1.5">
                                                <ArrowRight size={12} /> Insufficient Tokens
                                            </p>
                                        )}

                                        <div className="mt-auto pt-3 border-t flex items-center justify-between" style={{ borderColor: aiTokens > 0 ? "#00c3ff10" : "#1c223080" }}>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Top-up Balance</span>
                                            <Plus size={14} className="text-gray-500" />
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-shrink-0">
                                    {/* Referral Card */}
                                    <motion.div whileHover={{ y: -3 }} className="p-6 rounded-[24px] border bg-[#10141d] transition-all flex flex-col cursor-pointer relative overflow-hidden group"
                                        onClick={() => setView("referral")}
                                        style={{ borderColor: "#a855f720" }}>
                                        <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] bg-[#a855f7] opacity-[0.04] rounded-full blur-[35px] pointer-events-none group-hover:opacity-[0.1] transition-opacity" />
                                        <div className="flex items-start justify-between mb-5 relative z-10">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#a855f7]/12 text-[#a855f7] shadow-inner">
                                                <Gift size={24} />
                                            </div>
                                            <span className="text-[9px] font-black px-2.5 py-1 rounded-lg bg-[#a855f7]/10 uppercase tracking-widest text-[#a855f7]">{t("referralTab")}</span>
                                        </div>
                                        <div className="text-2xl font-black text-white relative z-10">${referralBalance.toFixed(2)}</div>
                                        <p className="text-[11px] font-medium text-gray-500 mb-4 mt-0.5 relative z-10">{t("referralEarnings")}</p>
                                        <div className="mt-auto pt-3 border-t border-[#a855f710] flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-1.5">
                                                <Users size={12} className="text-gray-500" />
                                                <span className="text-[10px] font-bold text-gray-500">{referralHistory.length} {t("referralTab").toLowerCase()}</span>
                                            </div>
                                            <ArrowRight size={14} className="text-gray-500" />
                                        </div>
                                    </motion.div>

                                    {/* Billing Cycle */}
                                    <div className="p-6 rounded-[24px] border border-[#1c2230] bg-[#10141d] flex items-center gap-5 flex-shrink-0">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#facc15]/10 text-[#facc15] shrink-0">
                                            <Clock size={22} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-white text-sm">Billing Cycle</h4>
                                            <p className="text-[11px] text-gray-500 mt-0.5 truncate">{subscriptionPlan === 'none' ? 'No active plan.' : subscriptionDetails ? `${Math.max(0, Math.ceil((new Date(subscriptionDetails.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days remaining` : 'Loading...'}</p>
                                        </div>
                                        <button className="p-2.5 rounded-xl hover:bg-white/5 text-gray-500 transition-colors shrink-0 cursor-pointer">
                                            <Settings size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ──── REFERRAL VIEW ──── */}
                    {view === "referral" && (
                        <motion.div key="referral"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            className="p-8 md:p-10 relative bg-[#0b0e14] h-full flex flex-col overflow-y-auto">
                            
                            {/* Bg glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.06), transparent 70%)", filter: "blur(80px)" }} />
                            
                            <button onClick={() => setView("dashboard")} className="absolute top-6 left-6 p-2.5 rounded-full flex items-center gap-2 hover:bg-white/5 transition-colors text-gray-400 z-10 cursor-pointer">
                                <ArrowLeft size={18} /> <span className="font-bold text-xs uppercase tracking-widest">Back</span>
                            </button>
                            <button onClick={onClose} className="absolute top-6 right-6 p-2.5 rounded-full hover:bg-white/5 transition-colors text-gray-400 z-10 cursor-pointer">
                                <X size={22} />
                            </button>

                            <div className="text-center mt-8 mb-8 relative z-10">
                                <motion.div className="w-16 h-16 bg-[#a855f7]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#a855f7]/30"
                                    animate={{ boxShadow: ["0 0 15px rgba(168,85,247,0.1)", "0 0 30px rgba(168,85,247,0.2)", "0 0 15px rgba(168,85,247,0.1)"] }}
                                    transition={{ duration: 3, repeat: Infinity }}>
                                    <Gift size={30} className="text-[#a855f7]" />
                                </motion.div>
                                <h2 className="text-3xl font-black text-white">{t("referralTitle")}</h2>
                                <p className="text-gray-500 mt-1.5 text-sm font-medium max-w-md mx-auto">{t("referralDesc")}</p>
                            </div>

                            {/* Referral Code Display */}
                            <div className="max-w-2xl mx-auto w-full space-y-4 relative z-10">
                                <div className="p-5 rounded-[20px] border border-[#a855f7]/20 bg-[#10141d] text-center">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#a855f7] mb-2">{t("yourReferralCode")}</p>
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="px-6 py-3 rounded-xl bg-[#0b0e14] border-2 border-[#a855f7]/30">
                                            <span className="font-mono text-2xl font-black text-white tracking-[0.15em]">{referralCode || "PX-XXXX0000"}</span>
                                        </div>
                                        <button onClick={copyReferralCode}
                                            className="px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer"
                                            style={{ background: codeCopied ? "#00e5a0" : "#a855f7", color: "#000" }}>
                                            {codeCopied ? <><Check size={16} /> {t("codeCopied")}</> : <><Copy size={16} /> {t("copyCode")}</>}
                                        </button>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-5 rounded-[20px] border border-[#1c2230] bg-[#10141d] text-center">
                                        <DollarSign size={22} className="text-[#00e5a0] mx-auto mb-1.5" />
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-0.5">{t("referralBalance")}</p>
                                        <div className="text-2xl font-black text-[#00e5a0]">${referralBalance.toFixed(2)}</div>
                                    </div>
                                    <div className="p-5 rounded-[20px] border border-[#1c2230] bg-[#10141d] text-center">
                                        <Users size={22} className="text-[#00c3ff] mx-auto mb-1.5" />
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-0.5">{t("referralTab")}</p>
                                        <div className="text-2xl font-black text-[#00c3ff]">{referralHistory.length}</div>
                                    </div>
                                </div>

                                {/* History Table */}
                                <div className="p-5 rounded-[20px] border border-[#1c2230] bg-[#10141d]">
                                    <h4 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                                        <Clock size={16} className="text-gray-500" /> {t("referralHistory")}
                                    </h4>
                                    
                                    {referralHistory.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Users size={32} className="text-gray-700 mx-auto mb-2" />
                                            <p className="text-gray-600 text-xs font-medium">{t("noReferrals")}</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-[#1c2230]">
                                                        <th className="text-[9px] font-black uppercase tracking-widest text-gray-600 py-2.5 text-left">{t("referralName")}</th>
                                                        <th className="text-[9px] font-black uppercase tracking-widest text-gray-600 py-2.5 text-left">{t("referralPlan")}</th>
                                                        <th className="text-[9px] font-black uppercase tracking-widest text-gray-600 py-2.5 text-left">{t("referralDate")}</th>
                                                        <th className="text-[9px] font-black uppercase tracking-widest text-gray-600 py-2.5 text-right">{t("referralEarned")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {referralHistory.map((entry, i) => (
                                                        <tr key={i} className="border-b border-[#1c2230]/50 hover:bg-white/[0.02] transition-colors">
                                                            <td className="py-2.5">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-7 h-7 rounded-full bg-[#a855f7]/10 flex items-center justify-center text-[#a855f7] text-[10px] font-black">
                                                                        {entry.name.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-xs font-bold text-white">{entry.name}</span>
                                                                        <p className="text-[9px] text-gray-600">{entry.email}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-2.5">
                                                                <span className="text-[10px] font-bold text-gray-400 px-2 py-0.5 rounded-md bg-white/5">{entry.plan}</span>
                                                            </td>
                                                            <td className="py-2.5 text-[10px] text-gray-500">{entry.date}</td>
                                                            <td className="py-2.5 text-right">
                                                                <span className="text-xs font-black text-[#00e5a0]">+${entry.earned.toFixed(2)}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ──── TOP-UP VIEW ──── */}
                    {view === "topup" && (
                        <motion.div key="topup" 
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            className="p-8 md:p-10 relative bg-[#0b0e14] h-full flex flex-col overflow-y-auto">
                            
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,195,255,0.05), transparent 70%)", filter: "blur(80px)" }} />
                            
                            <button onClick={() => setView("dashboard")} className="absolute top-6 left-6 p-2.5 rounded-full flex items-center gap-2 hover:bg-white/5 transition-colors text-gray-400 z-10 cursor-pointer">
                                <ArrowLeft size={18} /> <span className="font-bold text-xs uppercase tracking-widest">Back</span>
                            </button>
                            <button onClick={onClose} className="absolute top-6 right-6 p-2.5 rounded-full hover:bg-white/5 transition-colors text-gray-400 z-10 cursor-pointer">
                                <X size={22} />
                            </button>

                            <div className="text-center mt-8 mb-8 relative z-10">
                                <motion.div className="w-16 h-16 bg-[#00c3ff]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#00c3ff]/30"
                                    animate={{ boxShadow: ["0 0 15px rgba(0,195,255,0.1)", "0 0 30px rgba(0,195,255,0.2)", "0 0 15px rgba(0,195,255,0.1)"] }}
                                    transition={{ duration: 3, repeat: Infinity }}>
                                    <Coins size={30} className="text-[#00c3ff]" />
                                </motion.div>
                                <h2 className="text-3xl font-black text-white">Top-up AI Tokens</h2>
                                <p className="text-gray-500 mt-1.5 text-sm font-medium">Purchase compute power for live radar and chat analysis.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative z-10 max-w-3xl mx-auto w-full">
                                {[
                                    { tokens: 250, price: 10, name: "Starter", color: "#64748b" },
                                    { tokens: 700, price: 20, name: "Pro", color: "#00c3ff", popular: true },
                                    { tokens: 2000, price: 50, name: "Max", color: "#a855f7" },
                                ].map(pkg => (
                                    <motion.div key={pkg.tokens} 
                                         whileHover={{ y: -4 }}
                                         onClick={() => setSelectedPackage(pkg.tokens as any)}
                                         className="cursor-pointer rounded-[20px] p-6 border-2 transition-all relative overflow-hidden flex flex-col"
                                         style={{ 
                                             borderColor: selectedPackage === pkg.tokens ? pkg.color : "#1c2230",
                                             backgroundColor: selectedPackage === pkg.tokens ? `${pkg.color}08` : "#10141d",
                                         }}>
                                         
                                         {pkg.popular && (
                                             <div className="absolute top-0 right-0 px-3 py-1 bg-[#00c3ff] text-black text-[9px] font-black uppercase tracking-widest rounded-bl-xl">Best</div>
                                         )}
                                         {selectedPackage === pkg.tokens && (
                                             <div className="absolute top-4 right-4 rounded-full p-0.5 border-2" style={{ color: pkg.color, borderColor: pkg.color }}>
                                                 <Check size={12} strokeWidth={4} />
                                             </div>
                                         )}

                                         <div className="text-[9px] font-black uppercase tracking-widest mb-1.5 text-gray-600">{pkg.name}</div>
                                         <div className="text-3xl font-black text-white mb-4">{pkg.tokens.toLocaleString()} <span className="text-xs font-bold text-gray-600">TK</span></div>
                                         <div className="text-2xl font-black mt-auto" style={{ color: selectedPackage === pkg.tokens ? pkg.color : "#fff" }}>${pkg.price}</div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="bg-[#10141d] rounded-[24px] border border-[#1c2230] p-6 flex flex-col md:flex-row gap-6 max-w-3xl mx-auto w-full relative z-10 shadow-inner">
                                <div className="flex-1">
                                    <h4 className="font-bold text-white mb-3 flex items-center gap-2 text-sm"><Send size={16} className="text-[#00c3ff]" /> Payment Instructions</h4>
                                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                                        Send <strong className="text-white">${selectedPackage === 250 ? 10 : selectedPackage === 700 ? 20 : 50}</strong> via <a href="https://t.me/PhaseX_Ai" target="_blank" rel="noopener noreferrer" className="text-[#0088cc] font-bold no-underline hover:underline">Telegram</a> or USDT TRC20.
                                    </p>
                                    <div className="flex items-center justify-between p-3 bg-[#0b0e14] rounded-xl border border-[#1c2230] cursor-pointer hover:border-[#f7931a]/40 transition-colors group" onClick={() => copyToClipboard(walletAddress)}>
                                        <span className="font-mono text-xs text-gray-400 break-all pr-3">{walletAddress}</span>
                                        <span className="text-[#f7931a] group-hover:text-white group-hover:bg-[#f7931a] transition-colors p-2 bg-[#f7931a]/15 rounded-lg shrink-0"><Copy size={14} /></span>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-end min-w-[240px]">
                                    <button 
                                        onClick={handleConfirmTopUp} 
                                        disabled={isProcessing}
                                        className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-black transition-all flex items-center justify-center gap-2 text-sm cursor-pointer ${isProcessing ? 'opacity-70' : 'hover:scale-[1.02]'}`}
                                        style={{ background: "#00c3ff", boxShadow: `0 8px 30px rgba(0,195,255,0.25)` }}>
                                        {isProcessing ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/> Processing...</span> : <><CircleCheck size={18} /> I Have Paid ${selectedPackage === 250 ? 10 : selectedPackage === 700 ? 20 : 50}</>}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ──── PENDING/SUCCESS VIEW ──── */}
                    {view === "pending" && (
                        <motion.div key="pending" 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="p-10 text-center h-full flex flex-col items-center justify-center bg-[#0b0e14]">
                            
                            <motion.div className="w-28 h-28 rounded-full flex items-center justify-center mb-6 relative"
                                style={{ background: `linear-gradient(135deg, rgba(0,195,255,0.15) 0%, transparent 100%)` }}>
                                <motion.div className="absolute inset-0 border-4 rounded-full border-t-[#00c3ff] border-r-transparent border-b-[#00c3ff] border-l-transparent" 
                                    animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                                <Check size={48} color="#00c3ff" />
                            </motion.div>
                            <h2 className="text-3xl font-black mb-3 text-white">Tokens Verified!</h2>
                            <p className="text-base text-gray-400 max-w-md mx-auto leading-relaxed font-medium">
                                <strong className="text-white text-xl mx-1">{selectedPackage.toLocaleString()}</strong> AI Tokens added. Returning to dashboard...
                            </p>
                            
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
