import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, TrendingUp, TrendingDown, Target, Zap, BarChart2, Wallet, CircleDollarSign, Unlock, Lock, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useThemeTokens } from '../hooks/useThemeTokens';
import { MT5Position, MT5Account } from '../hooks/useMT5';

interface MarketWatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    mt5Positions: MT5Position[];
    serverAutoTrades: any[];
    autoFlipCounts: Record<string, number>;
    closePosition: (ticket: number) => Promise<boolean>;
    autoTradeUnsubscribe?: (comments: string[]) => Promise<void>;
    mt5Account?: MT5Account | null;
}

export function MarketWatchModal({ isOpen, onClose, mt5Positions, serverAutoTrades, autoFlipCounts, closePosition, autoTradeUnsubscribe, mt5Account }: MarketWatchModalProps) {
    const { language, t } = useLanguage();
    const tk = useThemeTokens();

    const [closingSymbols, setClosingSymbols] = useState<Set<string>>(new Set());
    const [closingAutoSymbols, setClosingAutoSymbols] = useState<Set<string>>(new Set());

    const { summary, aggregated } = useMemo(() => {
        let totalProfit = 0;

        const symMap: Record<string, {
            symbol: string,
            totalPos: number,
            buyCount: number,
            sellCount: number,
            autoCount: number,
            manualCount: number,
            flipCount: number,
            profit: number,
            autoTickets: number[],
            allTickets: number[],
        }> = {};

        const autoTicketsSet = new Set(serverAutoTrades.map(at => at.last_ticket).filter(Boolean));

        mt5Positions.forEach(pos => {
            totalProfit += pos.profit;
            const sym = pos.symbol;
            if (!symMap[sym]) {
                symMap[sym] = {
                    symbol: sym,
                    totalPos: 0,
                    buyCount: 0,
                    sellCount: 0,
                    autoCount: 0,
                    manualCount: 0,
                    flipCount: autoFlipCounts[sym] || 0,
                    profit: 0,
                    autoTickets: [],
                    allTickets: []
                };
            }

            const isAuto = autoTicketsSet.has(pos.ticket) || (pos.comment && pos.comment.toLowerCase().includes('auto'));
            
            symMap[sym].totalPos++;
            symMap[sym].allTickets.push(pos.ticket);
            
            if (pos.type === 'BUY') symMap[sym].buyCount++;
            else symMap[sym].sellCount++;

            if (isAuto) {
                symMap[sym].autoCount++;
                symMap[sym].autoTickets.push(pos.ticket);
            } else {
                symMap[sym].manualCount++;
            }

            symMap[sym].profit += pos.profit;
        });

        const aggregatedArray = Object.values(symMap).sort((a, b) => b.profit - a.profit);
        
        // --- Normalization: Ensure symbol profits sum EXACTLY to mt5Account.profit ---
        if (mt5Account && aggregatedArray.length > 0) {
            const trueTotal = mt5Account.profit;
            const currentSum = aggregatedArray.reduce((acc, row) => acc + row.profit, 0);
            
            if (aggregatedArray.length === 1) {
                aggregatedArray[0].profit = trueTotal;
            } else if (currentSum !== trueTotal) {
                const absSum = aggregatedArray.reduce((acc, row) => acc + Math.abs(row.profit), 0);
                if (absSum !== 0) {
                    const diff = trueTotal - currentSum;
                    aggregatedArray.forEach(row => {
                        row.profit += diff * (Math.abs(row.profit) / absSum);
                    });
                } else {
                    // Fallback if all profits are 0 but trueTotal is non-zero
                    const perSymbolDiff = trueTotal / aggregatedArray.length;
                    aggregatedArray.forEach(row => { row.profit += perSymbolDiff; });
                }
            }
        }
        
        // Re-sort after normalization in case orders changed
        aggregatedArray.sort((a, b) => b.profit - a.profit);

        let bestSymbol = aggregatedArray.length > 0 && aggregatedArray[0].profit > 0 ? aggregatedArray[0] : null;
        let worstSymbol = aggregatedArray.length > 0 && aggregatedArray[aggregatedArray.length - 1].profit < 0 ? aggregatedArray[aggregatedArray.length - 1] : null;

        return {
            summary: {
                totalProfit: mt5Account ? mt5Account.profit : totalProfit, // Use live account profit if available to avoid freeze
                bestSymbol,
                worstSymbol
            },
            aggregated: aggregatedArray
        };
    }, [mt5Positions, serverAutoTrades, autoFlipCounts, mt5Account]);

    const handleCloseAuto = async (symbol: string) => {
        setClosingAutoSymbols(prev => new Set(prev).add(symbol));
        const commentsToStop = serverAutoTrades
            .filter(at => at.symbol === symbol && at.is_active)
            .map(at => at.comment)
            .filter(Boolean);
            
        if (commentsToStop.length > 0 && autoTradeUnsubscribe) {
            await autoTradeUnsubscribe(commentsToStop);
        }
        setClosingAutoSymbols(prev => { const n = new Set(prev); n.delete(symbol); return n; });
    };

    const handleCloseAll = async (symbol: string, tickets: number[]) => {
        setClosingSymbols(prev => new Set(prev).add(symbol));
        for (const t of tickets) {
            await closePosition(t);
        }
        setClosingSymbols(prev => { const n = new Set(prev); n.delete(symbol); return n; });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-[1200px] overflow-hidden rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
                    style={{
                        background: tk.isDark ? '#0b0e14' : '#ffffff',
                        border: `1px solid ${tk.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                >
                    {/* Sci-Fi Racing Header */}
                    <div className="px-6 py-5 flex items-center justify-between relative overflow-hidden" style={{ background: tk.isDark ? '#060a10' : '#f8fafc', borderBottom: `1px solid ${tk.isDark ? 'rgba(99,102,241,0.15)' : 'rgba(0,0,0,0.1)'}` }}>
                        {/* Background Grid Pattern */}
                        {tk.isDark && (
                            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                        )}
                        {/* Glowing orb */}
                        <div className="absolute top-1/2 left-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-20 -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                        <div className="flex items-center gap-4 relative z-10">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 rounded-xl flex items-center justify-center relative border border-indigo-500/30" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(0,0,0,0))' }}>
                                <Activity className="w-6 h-6 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                                <div className="absolute inset-0 border border-indigo-400 rounded-xl" style={{ clipPath: 'polygon(0 0, 30% 0, 0 30%)' }} />
                                <div className="absolute inset-0 border border-indigo-400 rounded-xl" style={{ clipPath: 'polygon(100% 100%, 70% 100%, 100% 70%)' }} />
                            </motion.div>
                            <div>
                                <h2 className="text-lg font-black tracking-[0.3em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-500 drop-shadow-sm flex items-center gap-2">
                                    Market Watch <span className="opacity-40 font-mono text-[10px]">v2.0</span>
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                    <p className="text-[10px] uppercase font-bold tracking-[0.25em]" style={{ color: tk.textDim }}>
                                        Telemetry Active // MetaApi Link
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 flex items-center gap-3">
                            {/* Scanning line decoration */}
                            <div className="hidden md:flex flex-col items-end mr-4">
                                <div className="text-[8px] font-mono tracking-widest text-indigo-400/50 mb-0.5">LATENCY: 12ms</div>
                                <div className="w-24 h-1 bg-indigo-900/40 rounded-full overflow-hidden relative">
                                    <motion.div className="w-1/2 h-full bg-indigo-500 rounded-full" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2.5 rounded-xl transition-all duration-300 hover:scale-105 group border border-transparent hover:border-red-500/30 hover:bg-red-500/10" style={{ color: tk.textDim }}>
                                <X className="w-5 h-5 group-hover:text-red-400 transition-colors drop-shadow-[0_0_8px_rgba(239,68,68,0)] group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                            </button>
                        </div>
                    </div>

                    {/* Telemetry Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-6 relative" style={{ background: tk.isDark ? '#0b0e14' : '#f1f5f9' }}>
                        {/* Background glowing sweep */}
                        <motion.div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ background: 'linear-gradient(90deg, transparent, #6366f1, transparent)' }} animate={{ x: ['-100%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />

                        {/* Total Net Profit Card */}
                        <div className="rounded-2xl p-5 border relative overflow-hidden group transition-all duration-500 hover:scale-[1.02]" style={{ 
                            background: tk.isDark ? 'linear-gradient(180deg, rgba(16,185,129,0.05), rgba(0,0,0,0))' : 'linear-gradient(180deg, rgba(16,185,129,0.05), #ffffff)', 
                            border: `1px solid ${summary.totalProfit >= 0 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                            boxShadow: `0 8px 30px ${summary.totalProfit >= 0 ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)'}`
                        }}>
                            <div className="absolute -right-10 -top-10 w-40 h-40 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
                                {summary.totalProfit >= 0 ? <TrendingUp className="w-full h-full text-emerald-500" /> : <TrendingDown className="w-full h-full text-red-500" />}
                            </div>
                            {/* Abstract racing stripe */}
                            <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: summary.totalProfit >= 0 ? '#10b981' : '#ef4444', boxShadow: `0 0 15px ${summary.totalProfit >= 0 ? '#10b981' : '#ef4444'}` }} />
                            
                            <div className="pl-4">
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: tk.textDim }}>
                                    <div className="w-1 h-1 rounded-full bg-current opacity-50" />
                                    Total Net Profit
                                </span>
                                <div className="text-4xl font-black font-mono tracking-tight" style={{ 
                                    color: summary.totalProfit >= 0 ? '#10b981' : '#ef4444', 
                                    textShadow: `0 0 20px ${summary.totalProfit >= 0 ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)'}` 
                                }}>
                                    {summary.totalProfit >= 0 ? '+' : ''}{summary.totalProfit.toFixed(2)}
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="px-2 py-0.5 rounded text-[9px] font-mono tracking-widest text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20">LIVE</span>
                                    <span className="text-[10px] uppercase font-bold tracking-[0.1em]" style={{ color: tk.textDim }}>Portfolio Delta</span>
                                </div>
                            </div>
                        </div>

                        {/* Best Asset Card */}
                        <div className="rounded-2xl p-5 border relative overflow-hidden group transition-all duration-500 hover:scale-[1.02]" style={{ 
                            background: tk.isDark ? 'linear-gradient(180deg, rgba(99,102,241,0.05), rgba(0,0,0,0))' : 'linear-gradient(180deg, rgba(99,102,241,0.05), #ffffff)', 
                            border: '1px solid rgba(99,102,241,0.3)',
                            boxShadow: '0 8px 30px rgba(99,102,241,0.05)'
                        }}>
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 opacity-[0.08] group-hover:opacity-15 transition-opacity duration-500 pointer-events-none">
                                <Target className="w-full h-full text-indigo-500" />
                            </div>
                            <div className="absolute top-0 right-10 w-20 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                            
                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: tk.textDim }}>
                                <div className="w-1 h-1 rounded-full bg-current opacity-50" />
                                Apex Performer
                            </span>
                            {summary.bestSymbol ? (
                                <>
                                    <div className="text-2xl font-black tracking-wider mt-1 drop-shadow-md" style={{ color: tk.textPrimary }}>
                                        {summary.bestSymbol.symbol}
                                    </div>
                                    <div className="flex items-center gap-3 mt-3">
                                        <div className="text-lg font-black font-mono drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]" style={{ color: '#10b981' }}>
                                            +{summary.bestSymbol.profit.toFixed(2)}
                                        </div>
                                        <div className="px-2 py-0.5 rounded text-[9px] font-mono tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">MAX THRUST</div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-sm font-mono mt-4 opacity-50" style={{ color: tk.textDim }}>// NO DATA</div>
                            )}
                        </div>

                        {/* Worst Asset Card */}
                        <div className="rounded-2xl p-5 border relative overflow-hidden group transition-all duration-500 hover:scale-[1.02]" style={{ 
                            background: tk.isDark ? 'linear-gradient(180deg, rgba(245,158,11,0.05), rgba(0,0,0,0))' : 'linear-gradient(180deg, rgba(245,158,11,0.05), #ffffff)', 
                            border: '1px solid rgba(245,158,11,0.3)',
                            boxShadow: '0 8px 30px rgba(245,158,11,0.05)'
                        }}>
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 opacity-[0.08] group-hover:opacity-15 transition-opacity duration-500 pointer-events-none">
                                <BarChart2 className="w-full h-full text-amber-500" />
                            </div>
                            <div className="absolute bottom-0 right-10 w-20 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                            
                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: tk.textDim }}>
                                <div className="w-1 h-1 rounded-full bg-current opacity-50" />
                                High Drag
                            </span>
                            {summary.worstSymbol ? (
                                <>
                                    <div className="text-2xl font-black tracking-wider mt-1 drop-shadow-md" style={{ color: tk.textPrimary }}>
                                        {summary.worstSymbol.symbol}
                                    </div>
                                    <div className="flex items-center gap-3 mt-3">
                                        <div className="text-lg font-black font-mono drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]" style={{ color: '#ef4444' }}>
                                            {summary.worstSymbol.profit.toFixed(2)}
                                        </div>
                                        <div className="px-2 py-0.5 rounded text-[9px] font-mono tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20">CRITICAL</div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-sm font-mono mt-4 opacity-50" style={{ color: tk.textDim }}>// NO DATA</div>
                            )}
                        </div>
                    </div>

                    {/* Premium Account Stats Panel */}
                    {mt5Account && (
                        <div className="px-6 pb-6">
                            <div className="p-4 rounded-2xl border" style={{ 
                                background: tk.isDark ? 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)' : 'linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.005) 100%)', 
                                borderColor: tk.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)'
                            }}>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {[
                                        { label: 'Balance', icon: Wallet, value: `$${(mt5Account.balance || 0).toLocaleString()}`, color: '#10b981', rgb: '16, 185, 129' },
                                        { label: 'Equity', icon: CircleDollarSign, value: `$${(mt5Account.equity || 0).toLocaleString()}`, color: '#6366f1', rgb: '99, 102, 241' },
                                        { label: 'Free Margin', icon: Unlock, value: `$${(mt5Account.free_margin || 0).toLocaleString()}`, color: '#a855f7', rgb: '168, 85, 247' },
                                        { label: 'Margin', icon: Lock, value: `$${(mt5Account.margin || 0).toLocaleString()}`, color: '#f59e0b', rgb: '245, 158, 11' },
                                        { label: 'Leverage', icon: Zap, value: `1:${mt5Account.leverage || 0}`, color: '#3b82f6', rgb: '59, 130, 246' },
                                    ].map((stat, idx) => (
                                        <div key={stat.label} className="relative group p-3 rounded-xl transition-all duration-300 hover:scale-105 cursor-default" style={{ 
                                            background: `rgba(${stat.rgb}, 0.05)`, 
                                            border: `1px solid rgba(${stat.rgb}, 0.15)`,
                                            boxShadow: `inset 0 0 20px rgba(${stat.rgb}, 0.02)`
                                        }}>
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl" style={{ background: `linear-gradient(135deg, transparent, rgba(${stat.rgb}, 1))` }} />
                                            {/* Glow effect behind icon */}
                                            <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-40 pointer-events-none" style={{ background: stat.color }} />
                                            
                                            <div className="flex items-center gap-2 mb-2 relative z-10">
                                                <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `rgba(${stat.rgb}, 0.1)`, border: `1px solid rgba(${stat.rgb}, 0.2)` }}>
                                                    <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                                                </div>
                                                <div className="text-[9px] xl:text-[10px] font-black tracking-[0.2em] uppercase truncate" style={{ color: tk.textDim }}>{stat.label}</div>
                                            </div>
                                            <div className="text-sm xl:text-lg font-black font-mono tracking-wide relative z-10 drop-shadow-md truncate" style={{ color: stat.color, textShadow: tk.isDark ? `0 0 12px rgba(${stat.rgb}, 0.4)` : 'none' }}>
                                                {stat.value}
                                            </div>
                                            {/* Separator line for non-last child on Desktop */}
                                            {idx < 4 && (
                                                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 w-px h-10" style={{ background: tk.isDark ? 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)' : 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.1), transparent)' }} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Telemetry Data Grid */}
                    <div className="flex-1 overflow-auto custom-scrollbar relative">
                        {/* Inner shadow for depth */}
                        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)] z-20" />
                        
                        {aggregated.length === 0 ? (
                            <div className="p-20 text-center flex flex-col items-center justify-center relative min-h-[300px]">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} className="absolute w-32 h-32 border border-indigo-500/20 rounded-full border-t-indigo-500/80 border-b-indigo-500/80" />
                                <motion.div animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} className="absolute w-24 h-24 border border-rose-500/20 rounded-full border-l-rose-500/80 border-r-rose-500/80" />
                                <Activity className="w-8 h-8 opacity-50 relative z-10" style={{ color: tk.textDim }} />
                                <h3 className="text-xl font-black uppercase tracking-[0.4em] mt-6 relative z-10" style={{ color: tk.textSecondary }}>RADAR EMPTY</h3>
                                <p className="text-[10px] mt-2 uppercase tracking-[0.2em] font-mono relative z-10" style={{ color: tk.textDim }}>// AWAITING ACTIVE TELEMETRY //</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse relative z-10">
                                <thead className="sticky top-0 z-30" style={{ background: tk.isDark ? '#060a10' : '#f8fafc' }}>
                                    <tr>
                                        {['Symbol', 'Total', 'Buy', 'Sell', 'Auto', 'Flips', 'Manual', 'Net Profit', 'Action', 'Action'].map((h, i) => (
                                            <th key={i} className={`px-5 py-4 text-[9px] font-black tracking-[0.25em] uppercase border-b ${i >= 7 ? 'text-right' : ''}`} style={{ color: tk.textDim, borderColor: tk.isDark ? 'rgba(99,102,241,0.2)' : 'rgba(0,0,0,0.1)' }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                    {/* Glowing line under header */}
                                    <tr className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                                </thead>
                                <tbody>
                                    {aggregated.map((row) => {
                                        const isClosingAuto = closingAutoSymbols.has(row.symbol);
                                        const isClosingAll = closingSymbols.has(row.symbol);
                                        const isProfit = row.profit >= 0;

                                        return (
                                            <tr key={row.symbol} className="border-b transition-all duration-300 hover:bg-indigo-500/5 group relative" style={{ borderColor: tk.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)' }}>
                                                
                                                <td className="px-5 py-4 relative">
                                                    {/* Hover side glow */}
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <div className="text-[13px] font-black tracking-[0.15em] drop-shadow-sm" style={{ color: tk.textPrimary }}>{row.symbol}</div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="px-3 py-1.5 rounded-md text-[11px] font-black font-mono shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]" style={{ background: tk.isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)', color: tk.textSecondary, border: `1px solid ${tk.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)'}` }}>
                                                        {row.totalPos}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="inline-flex whitespace-nowrap items-center w-max text-[10px] font-bold px-2.5 py-1 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.15)]" style={{ color: '#10b981', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)' }}>{row.buyCount} B</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="inline-flex whitespace-nowrap items-center w-max text-[10px] font-bold px-2.5 py-1 rounded-md shadow-[0_0_10px_rgba(239,68,68,0.15)]" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>{row.sellCount} S</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-md w-max shadow-[0_0_10px_rgba(168,85,247,0.15)]" style={{ color: '#c084fc', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.3)' }}>
                                                        <Zap className="w-3 h-3" /> {row.autoCount}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span title="Total times Auto Trade reversed direction" className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-md w-max shadow-[0_0_10px_rgba(251,146,60,0.15)]" style={{ color: '#fb923c', background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.3)' }}>
                                                        <Activity className="w-3 h-3" /> {row.flipCount}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="text-[10px] font-bold px-3 py-1 rounded-md w-max shadow-[0_0_10px_rgba(59,130,246,0.15)]" style={{ color: '#60a5fa', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.3)' }}>
                                                        {row.manualCount}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <span className="text-base font-black font-mono tracking-tight" style={{ color: isProfit ? '#10b981' : '#ef4444', textShadow: `0 0 10px ${isProfit ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}` }}>
                                                        {isProfit ? '+' : ''}{row.profit.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <motion.button 
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleCloseAuto(row.symbol)}
                                                        disabled={isClosingAuto || row.autoCount === 0}
                                                        className="px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap overflow-hidden relative"
                                                        style={{
                                                            color: row.autoCount === 0 ? tk.textDim : '#c084fc',
                                                            background: row.autoCount === 0 ? tk.surfaceHover : 'rgba(168,85,247,0.1)',
                                                            border: `1px solid ${row.autoCount === 0 ? 'transparent' : 'rgba(168,85,247,0.4)'}`,
                                                            opacity: (isClosingAuto || row.autoCount === 0) ? 0.3 : 1,
                                                            cursor: (isClosingAuto || row.autoCount === 0) ? 'not-allowed' : 'pointer'
                                                        }}
                                                    >
                                                        {(!isClosingAuto && row.autoCount !== 0) && (
                                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                                        )}
                                                        {isClosingAuto ? 'STOPPING...' : 'STOP AUTO'}
                                                    </motion.button>
                                                </td>
                                                <td className="px-5 py-4 text-right w-[180px]">
                                                    <motion.button 
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleCloseAll(row.symbol, row.allTickets)}
                                                        disabled={isClosingAll || row.totalPos === 0}
                                                        className="px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap overflow-hidden relative"
                                                        style={{
                                                            color: row.totalPos === 0 ? tk.textDim : '#ef4444',
                                                            background: row.totalPos === 0 ? tk.surfaceHover : 'rgba(239,68,68,0.1)',
                                                            border: `1px solid ${row.totalPos === 0 ? 'transparent' : 'rgba(239,68,68,0.4)'}`,
                                                            opacity: (isClosingAll || row.totalPos === 0) ? 0.3 : 1,
                                                            cursor: (isClosingAll || row.totalPos === 0) ? 'not-allowed' : 'pointer'
                                                        }}
                                                    >
                                                        {(!isClosingAll && row.totalPos !== 0) && (
                                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                                        )}
                                                        {isClosingAll ? 'CLOSING...' : 'CLOSE ALL'}
                                                    </motion.button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
