import { motion, AnimatePresence } from "motion/react";
import { X, RefreshCw, Wifi, Server, LogOut, User, Zap } from "lucide-react";
import { UserProfile } from "../UserProfile";
import { SubscriptionPanel } from "../SubscriptionPanel";
import type { PhaseXCtx } from "./usePhaseXDynamicsPage";

export function PhaseXDynamicsModals({ ctx }: { ctx: PhaseXCtx }) {
    const {
        isLoggedIn,
        isProfileOpen,
        setIsProfileOpen,
        isSubscriptionOpen,
        setIsSubscriptionOpen,
        isMT5LoginOpen,
        setIsMT5LoginOpen,
        isMT5DisconnectOpen,
        setIsMT5DisconnectOpen,
        tradeModalState,
        setTradeModalState,
        isLoginPromptOpen,
        setIsLoginPromptOpen,
        mt5Connected,
        mt5Connecting,
        mt5ConnectStatus,
        connectMT5,
        disconnectMT5,
        mt5Creds,
        setMT5Creds,
        showMT5Password,
        setShowMT5Password,
        mt5Error,
        setMT5Error,
        tradeSymbolOverride,
        setTradeSymbolOverride,
        tradeSL,
        setTradeSL,
        tradeTP,
        setTradeTP,
        tradeError,
        setTradeError,
        isExecuting,
        setIsExecuting,
        tradeLot,
        setTradeLot,
        executeTrade,
        mt5Positions,
        isRTL,
        lang,
        tk,
    } = ctx;

    return (
        <>
            {isLoggedIn && (
                <>
                    <SubscriptionPanel isOpen={isSubscriptionOpen} onClose={() => setIsSubscriptionOpen(false)} />
                    <AnimatePresence>
                        {isProfileOpen && (
                            <UserProfile onClose={() => setIsProfileOpen(false)} onTopUp={() => { setIsProfileOpen(false); setIsSubscriptionOpen(true); }} />
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {isMT5LoginOpen && !mt5Connected && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100] flex items-center justify-center"
                                style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
                                onClick={(e) => { if (e.target === e.currentTarget) setIsMT5LoginOpen(false); }}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                    className="w-full max-w-md mx-4 rounded-2xl overflow-hidden relative"
                                    style={{
                                        background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.06) 0%, rgba(6,10,16,0.98) 60%)',
                                        border: `1px solid rgba(99,102,241,0.15)`,
                                        boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
                                    }}
                                >
                                    <div className="absolute inset-0 pointer-events-none z-0" style={{
                                        backgroundImage: 'linear-gradient(rgba(99,102,241,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.02) 1px, transparent 1px)',
                                        backgroundSize: '30px 30px',
                                    }} />

                                    <div className="relative z-10 p-6 pb-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)', border: `1px solid rgba(99,102,241,0.2)` }}>
                                                    <Server className="w-5 h-5" style={{ color: '#6366f1' }} />
                                                </div>
                                                <div>
                                                    <h3 className="text-[16px] font-black tracking-wide text-white">MetaTrader 5</h3>
                                                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500">LIVE CONNECTION</p>
                                                </div>
                                            </div>
                                            <motion.button onClick={() => setIsMT5LoginOpen(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white">
                                                <X className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </div>
                                    <div className="relative z-10 px-6 pb-6 mt-4">
                                        <form onSubmit={async (e) => {
                                            e.preventDefault();
                                            setMT5Error(null);
                                            try { localStorage.setItem("mt5_credentials", JSON.stringify(mt5Creds)); } catch {}
                                            try {
                                                await connectMT5(mt5Creds);
                                                setIsMT5LoginOpen(false);
                                            } catch (err: any) {
                                                setMT5Error(err.message || 'Failed to connect');
                                            }
                                        }} className="space-y-4">
                                            <div>
                                                <label className="text-[10px] font-bold tracking-widest uppercase mb-1.5 block text-gray-500">Server</label>
                                                <input
                                                    type="text"
                                                    value={mt5Creds.server}
                                                    onChange={(e) => setMT5Creds({ ...mt5Creds, server: e.target.value })}
                                                    placeholder="e.g. EquitiBrokerageSC-Demo"
                                                    className="w-full px-4 py-3 rounded-xl text-[13px] font-medium outline-none transition-colors"
                                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold tracking-widest uppercase mb-1.5 block text-gray-500">Login</label>
                                                <input
                                                    type="text"
                                                    value={mt5Creds.login}
                                                    onChange={(e) => setMT5Creds({ ...mt5Creds, login: e.target.value })}
                                                    placeholder="e.g. 1110835"
                                                    className="w-full px-4 py-3 rounded-xl text-[13px] font-medium outline-none transition-colors"
                                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold tracking-widest uppercase mb-1.5 block text-gray-500">Password</label>
                                                <div className="relative">
                                                    <input
                                                        type={showMT5Password ? 'text' : 'password'}
                                                        value={mt5Creds.password}
                                                        onChange={(e) => setMT5Creds({ ...mt5Creds, password: e.target.value })}
                                                        placeholder="••••••••"
                                                        className="w-full px-4 py-3 rounded-xl text-[13px] font-medium outline-none transition-colors"
                                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', paddingRight: '40px' }}
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowMT5Password(!showMT5Password)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-lg cursor-pointer text-gray-400 hover:text-white"
                                                    >
                                                        {showMT5Password ? <span className="font-bold text-[10px]">HIDE</span> : <span className="font-bold text-[10px]">SHOW</span>}
                                                    </button>
                                                </div>
                                            </div>

                                            {mt5Error && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                                                    className="flex items-center gap-2 px-3 py-2 rounded-xl mt-2"
                                                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
                                                >
                                                    <span className="text-[11px] font-bold text-red-500">{mt5Error}</span>
                                                </motion.div>
                                            )}

                                            <motion.button
                                                type="submit"
                                                disabled={mt5Connecting || !mt5Creds.login || !mt5Creds.password || !mt5Creds.server}
                                                whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(99,102,241,0.25)' }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full py-3.5 rounded-xl text-[13px] font-black tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2 mt-4 relative overflow-hidden"
                                                style={{
                                                    background: mt5Connecting ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                                    color: mt5Connecting ? '#9ca3af' : '#fff',
                                                    border: `1px solid ${mt5Connecting ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.3)'}`,
                                                    opacity: (!mt5Creds.login || !mt5Creds.password || !mt5Creds.server) ? 0.5 : 1,
                                                }}
                                            >
                                                {mt5Connecting ? (
                                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                                        <RefreshCw className="w-4 h-4" />
                                                    </motion.div>
                                                ) : (
                                                    <Wifi className="w-4 h-4" />
                                                )}
                                                <span className="relative z-10">{mt5Connecting ? (mt5ConnectStatus || 'Connecting...') : 'Connect to MT5'}</span>
                                            </motion.button>
                                        </form>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}

            <AnimatePresence>
                {isMT5DisconnectOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setIsMT5DisconnectOpen(false);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-md mx-4 rounded-2xl overflow-hidden relative p-6"
                            style={{
                                background: tk.isDark ? 'radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.06) 0%, rgba(6,10,16,0.98) 60%)' : '#fff',
                                border: `1px solid ${tk.isDark ? 'rgba(239,68,68,0.15)' : 'rgba(0,0,0,0.1)'}`,
                                boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
                            }}
                        >
                            <h3 className="text-lg font-black mb-2" style={{ color: tk.textPrimary }}>
                                {lang === "ar" ? "تأكيد قطع الاتصال" : "Confirm Disconnect"}
                            </h3>
                            <p className="text-sm mb-6 leading-relaxed" style={{ color: tk.textSecondary }}>
                                {lang === "ar"
                                    ? "هل أنت متأكد أنك تريد فصل الاتصال عن MT5؟ الصفقات التي تعمل حالياً لن تتأثر وستظل شغالة."
                                    : "Are you sure you want to disconnect from MT5? Running trades will not be affected and will keep running."}
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsMT5DisconnectOpen(false)}
                                    className="flex-1 py-2.5 rounded-xl font-bold cursor-pointer transition-colors"
                                    style={{ background: tk.surfaceHover, color: tk.textPrimary, border: `1px solid ${tk.border}` }}
                                >
                                    {lang === "ar" ? "إلغاء" : "Cancel"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        disconnectMT5();
                                        setIsMT5DisconnectOpen(false);
                                    }}
                                    className="flex-1 py-2.5 rounded-xl font-bold cursor-pointer transition-colors flex items-center justify-center gap-2"
                                    style={{ background: '#ef4444', color: '#fff', border: '1px solid rgba(239,68,68,0.5)' }}
                                >
                                    <LogOut className="w-4 h-4" />
                                    {lang === "ar" ? "فصل الاتصال" : "Disconnect"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {tradeModalState?.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
                        onClick={(e) => { if (e.target === e.currentTarget && !isExecuting) setTradeModalState(null); }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="w-full max-w-sm rounded-[24px] overflow-hidden relative"
                            style={{
                                background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.06) 0%, rgba(6,10,16,0.98) 60%)',
                                border: `1px solid rgba(99,102,241,0.15)`,
                                boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
                            }}
                        >
                            <div className="absolute inset-0 pointer-events-none z-0" style={{
                                backgroundImage: 'linear-gradient(rgba(99,102,241,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.02) 1px, transparent 1px)',
                                backgroundSize: '24px 24px',
                            }} />

                            <div className="relative z-10 p-5 mt-2">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{
                                                background: tradeModalState.decision.includes("BUY") ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                border: `1px solid ${tradeModalState.decision.includes("BUY") ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                                            }}>
                                            <Zap className="w-5 h-5" style={{ color: tradeModalState.decision.includes("BUY") ? '#34d399' : '#f87171' }} />
                                        </div>
                                        <div>
                                            <h3 className="text-[16px] font-black tracking-wide text-white">Execute Order</h3>
                                            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500">{tradeModalState.symbol} • {tradeModalState.decision}</p>
                                        </div>
                                    </div>
                                    <motion.button disabled={isExecuting} onClick={() => setTradeModalState(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white disabled:opacity-50">
                                        <X className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>

                            <div className="relative z-10 px-5 pb-5">
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (!mt5Connected) { setTradeError("MT5 is not connected."); return; }
                                    const symbolToSend = tradeSymbolOverride.trim() || tradeModalState.symbol;
                                    let action = "BUY";
                                    if (tradeModalState.decision.includes("SELL")) action = "SELL";
                                    setTradeError(null);
                                    setIsExecuting(true);
                                    try {
                                        const aiComment = `PX-SD ${symbolToSend} ${action}`.slice(0, 31);
                                        const res = await executeTrade(symbolToSend, action, parseFloat(tradeLot) || 0.01, tradeSL ? parseFloat(tradeSL) : 0, tradeTP ? parseFloat(tradeTP) : 0, aiComment);
                                        if (res) { setTradeModalState(null); } else { setTradeError("Execution failed. Check connection or params."); }
                                    } catch (err: any) { setTradeError(err.message || 'Execution failed'); }
                                    finally { setIsExecuting(false); }
                                }} className="space-y-4 text-left">

                                    <div className="p-3 rounded-xl mb-4 text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                        <p className="text-gray-400 leading-relaxed">
                                            You are about to execute a <strong className={tradeModalState.decision.includes("BUY") ? "text-emerald-400" : "text-red-400"}>{tradeModalState.decision.includes("BUY") ? "BUY" : "SELL"}</strong> on <strong className="text-white">{tradeModalState.symbol}</strong> with <strong className="text-amber-400">{tradeLot || "0.01"}</strong> lot.
                                        </p>
                                    </div>

                                    <div className="space-y-1.5 mb-3">
                                        <label className="text-[10px] font-black tracking-wider uppercase text-gray-500 ml-1">Symbol (edit to match broker)</label>
                                        <input disabled={isExecuting} value={tradeSymbolOverride} onChange={e => setTradeSymbolOverride(e.target.value)} type="text" placeholder={tradeModalState.symbol}
                                            className="w-full bg-white/5 border border-indigo-500/20 rounded-xl px-4 py-2.5 text-sm font-bold text-indigo-300 focus:outline-none focus:border-indigo-500/50 placeholder-gray-600" />
                                        <p className="text-[9px] text-gray-600 ml-1">e.g. BTCUSD.raw, BTCUSDm, BTCUSD.p — depends on your broker</p>
                                    </div>

                                    <div className="space-y-1.5 mb-3">
                                        <label className="text-[10px] font-black tracking-wider uppercase text-gray-500 ml-1">Lot Size</label>
                                        <input disabled={isExecuting} value={tradeLot} onChange={e => setTradeLot(e.target.value)} type="number" step="0.01" min="0.01" max="100" className="w-full bg-white/5 border border-amber-500/20 rounded-xl px-4 py-2.5 text-sm font-bold text-amber-300 focus:outline-none focus:border-amber-500/50" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5"><label className="text-[10px] font-black tracking-wider uppercase text-gray-500 ml-1">Stop Loss (Optional)</label><input disabled={isExecuting} value={tradeSL} onChange={e => setTradeSL(e.target.value)} type="number" step="0.00001" placeholder="e.g. 0.0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-indigo-500/50" /></div>
                                        <div className="space-y-1.5"><label className="text-[10px] font-black tracking-wider uppercase text-gray-500 ml-1">Take Profit (Optional)</label><input disabled={isExecuting} value={tradeTP} onChange={e => setTradeTP(e.target.value)} type="number" step="0.00001" placeholder="e.g. 0.0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-indigo-500/50" /></div>
                                    </div>

                                    {tradeError && (
                                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl mt-2" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                                            <span className="text-[10px] font-bold text-red-500 leading-tight">{tradeError}</span>
                                        </div>
                                    )}

                                    {(() => {
                                        const symbolToSend = tradeSymbolOverride.trim() || tradeModalState.symbol;
                                        let action = "BUY";
                                        if (tradeModalState.decision.includes("SELL")) action = "SELL";
                                        const currentAiComment = `PX-SD ${symbolToSend} ${action}`.slice(0, 31);
                                        const isDuplicateModal = (mt5Positions || []).some((p: any) => p.comment === currentAiComment);
                                        return (
                                            <button disabled={isExecuting || isDuplicateModal} type="submit" className={`w-full py-3.5 rounded-xl text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.2)] disabled:opacity-50 transition-colors ${tradeModalState.decision.includes("BUY") ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/20'}`}>
                                                {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />} {isExecuting ? 'Executing...' : isDuplicateModal ? 'Duplicate Position Detected' : `Execute ${tradeModalState.decision.includes("BUY") ? "BUY" : "SELL"}`}
                                            </button>
                                        );
                                    })()}
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isLoginPromptOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] flex items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }}
                            className="w-full max-w-sm rounded-[24px] p-8 text-center relative overflow-hidden"
                            style={{
                                background: 'rgba(10,16,28,0.95)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 25px 80px rgba(0,0,0,0.8)',
                            }}
                        >
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                                style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                                <User className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-2">{isRTL ? "تسجيل الدخول مطلوب" : "Login Required"}</h3>
                            <p className="text-sm font-medium text-gray-400 mb-8 leading-relaxed">
                                {isRTL
                                    ? "يجب عليك تسجيل الدخول لتتمكن من استخدام ميزة تنفيذ الصفقات عبر الذكاء الاصطناعي والاستمتاع بكافة الخدمات."
                                    : "You must be logged in to execute AI trades and enjoy full premium services."}
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => window.location.href = '/login'}
                                    className="w-full py-3.5 rounded-xl font-black text-[11px] tracking-widest uppercase text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
                                >
                                    {isRTL ? "تسجيل الدخول والتسجيل" : "Login / Sign Up"}
                                </button>
                                <button
                                    onClick={() => setIsLoginPromptOpen(false)}
                                    className="w-full py-3 rounded-xl font-bold text-[11px] tracking-widest uppercase text-gray-400 hover:text-white transition-colors"
                                >
                                    {isRTL ? "إغلاق" : "Cancel"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
