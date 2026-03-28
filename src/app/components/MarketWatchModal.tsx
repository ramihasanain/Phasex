import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, TrendingUp, TrendingDown, Target, Zap, BarChart2 } from 'lucide-react';
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
                    className="relative w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
                    style={{
                        background: tk.isDark ? '#0b0e14' : '#ffffff',
                        border: `1px solid ${tk.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                >
                    {/* Header */}
                    <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: tk.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', background: tk.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 drop-shadow-sm">
                                    Market Watch <span className="opacity-50 font-medium">TERMINAL</span>
                                </h2>
                                <p className="text-[9px] uppercase font-bold tracking-[0.2em]" style={{ color: tk.textDim }}>
                                    Live MetaApi Aggregation
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-lg transition-colors hover:bg-white/5 group" style={{ color: tk.textDim }}>
                            <X className="w-5 h-5 group-hover:text-white transition-colors" />
                        </button>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6" style={{ background: tk.isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)' }}>
                        {/* Total Net Profit */}
                        <div className="rounded-xl p-5 border relative overflow-hidden" style={{ borderColor: summary.totalProfit >= 0 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', background: tk.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', boxShadow: summary.totalProfit >= 0 ? 'inset 0 0 20px rgba(16,185,129,0.05)' : 'inset 0 0 20px rgba(239,68,68,0.05)' }}>
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
                                {summary.totalProfit >= 0 ? <TrendingUp className="w-full h-full text-emerald-500" /> : <TrendingDown className="w-full h-full text-red-500" />}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: tk.textDim }}>Total Net Profit</span>
                            <div className="text-3xl font-black font-mono mt-1 drop-shadow-lg" style={{ color: summary.totalProfit >= 0 ? '#10b981' : '#ef4444', textShadow: `0 0 15px ${summary.totalProfit >= 0 ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}` }}>
                                {summary.totalProfit >= 0 ? '+' : ''}{summary.totalProfit.toFixed(2)}
                            </div>
                            <div className="text-[9px] font-bold tracking-[0.2em] mt-2 uppercase" style={{ color: tk.textSecondary }}>Live MT5 Portfolio</div>
                        </div>

                        {/* Best Asset */}
                        <div className="rounded-xl p-5 border relative overflow-hidden" style={{ borderColor: 'rgba(99,102,241,0.2)', background: tk.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
                                <Target className="w-full h-full text-indigo-500" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: tk.textDim }}>Best Performing</span>
                            {summary.bestSymbol ? (
                                <>
                                    <div className="text-xl font-black mt-2 drop-shadow-lg" style={{ color: tk.textPrimary }}>
                                        {summary.bestSymbol.symbol}
                                    </div>
                                    <div className="text-sm font-bold font-mono mt-1" style={{ color: '#10b981' }}>
                                        +{summary.bestSymbol.profit.toFixed(2)}
                                    </div>
                                </>
                            ) : (
                                <div className="text-sm font-bold mt-4" style={{ color: tk.textDim }}>No Data</div>
                            )}
                        </div>

                        {/* Worst Asset */}
                        <div className="rounded-xl p-5 border relative overflow-hidden" style={{ borderColor: 'rgba(245,158,11,0.2)', background: tk.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
                                <BarChart2 className="w-full h-full text-amber-500" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: tk.textDim }}>Highest Drawdown</span>
                            {summary.worstSymbol ? (
                                <>
                                    <div className="text-xl font-black mt-2 drop-shadow-lg" style={{ color: tk.textPrimary }}>
                                        {summary.worstSymbol.symbol}
                                    </div>
                                    <div className="text-sm font-bold font-mono mt-1" style={{ color: '#ef4444' }}>
                                        {summary.worstSymbol.profit.toFixed(2)}
                                    </div>
                                </>
                            ) : (
                                <div className="text-sm font-bold mt-4" style={{ color: tk.textDim }}>No Data</div>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-auto custom-scrollbar">
                        {aggregated.length === 0 ? (
                            <div className="p-16 text-center flex flex-col items-center justify-center">
                                <Activity className="w-16 h-16 mb-4 opacity-10" style={{ color: tk.textDim }} />
                                <h3 className="text-lg font-black uppercase tracking-[0.2em]" style={{ color: tk.textSecondary }}>No Active Markets</h3>
                                <p className="text-xs mt-2 uppercase tracking-wide" style={{ color: tk.textDim }}>There are currently no open positions.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 z-10" style={{ background: tk.isDark ? '#0b0e14' : '#ffffff', borderBottom: `1px solid ${tk.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                                    <tr>
                                        {['Symbol', 'Total', 'Buy', 'Sell', 'Auto', 'Flips', 'Manual', 'Net Profit', 'Action', 'Action'].map((h, i) => (
                                            <th key={i} className={`px-5 py-4 text-[10px] font-black tracking-widest uppercase ${i >= 7 ? 'text-right' : ''}`} style={{ color: tk.textDim }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {aggregated.map((row) => {
                                        const isClosingAuto = closingAutoSymbols.has(row.symbol);
                                        const isClosingAll = closingSymbols.has(row.symbol);
                                        const isProfit = row.profit >= 0;

                                        return (
                                            <tr key={row.symbol} className="border-b transition-colors hover:bg-white/5" style={{ borderColor: tk.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)' }}>
                                                <td className="px-5 py-3.5">
                                                    <div className="text-xs font-black tracking-wider" style={{ color: tk.textPrimary }}>{row.symbol}</div>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="px-2.5 py-1 rounded-md text-[11px] font-black font-mono shadow-inner" style={{ background: tk.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: tk.textSecondary }}>
                                                        {row.totalPos}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="inline-flex whitespace-nowrap items-center w-max text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm drop-shadow" style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)' }}>{row.buyCount} B</span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="inline-flex whitespace-nowrap items-center w-max text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm drop-shadow" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.15)' }}>{row.sellCount} S</span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-md w-max shadow-sm drop-shadow" style={{ color: '#a855f7', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.15)' }}>
                                                        <Zap className="w-3 h-3" /> {row.autoCount}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span title="Total times Auto Trade reversed direction" className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-md w-max shadow-sm drop-shadow" style={{ color: '#fb923c', background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.15)' }}>
                                                        <Activity className="w-3 h-3" /> {row.flipCount}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md w-max shadow-sm drop-shadow" style={{ color: '#3b82f6', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.15)' }}>
                                                        {row.manualCount}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <span className="text-sm font-black font-mono drop-shadow-md" style={{ color: isProfit ? '#10b981' : '#ef4444' }}>
                                                        {isProfit ? '+' : ''}{row.profit.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <motion.button 
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleCloseAuto(row.symbol)}
                                                        disabled={isClosingAuto || row.autoCount === 0}
                                                        className="px-3.5 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap shadow-sm"
                                                        style={{
                                                            color: row.autoCount === 0 ? tk.textDim : '#a855f7',
                                                            background: row.autoCount === 0 ? tk.surfaceHover : 'rgba(168,85,247,0.1)',
                                                            border: `1px solid ${row.autoCount === 0 ? 'transparent' : 'rgba(168,85,247,0.2)'}`,
                                                            opacity: (isClosingAuto || row.autoCount === 0) ? 0.5 : 1,
                                                            cursor: (isClosingAuto || row.autoCount === 0) ? 'not-allowed' : 'pointer'
                                                        }}
                                                    >
                                                        {isClosingAuto ? 'STOPPING...' : 'STOP AUTO'}
                                                    </motion.button>
                                                </td>
                                                <td className="px-5 py-3.5 text-right w-[160px]">
                                                    <motion.button 
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleCloseAll(row.symbol, row.allTickets)}
                                                        disabled={isClosingAll || row.totalPos === 0}
                                                        className="px-3.5 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap shadow-sm"
                                                        style={{
                                                            color: row.totalPos === 0 ? tk.textDim : '#ef4444',
                                                            background: row.totalPos === 0 ? tk.surfaceHover : 'rgba(239,68,68,0.1)',
                                                            border: `1px solid ${row.totalPos === 0 ? 'transparent' : 'rgba(239,68,68,0.2)'}`,
                                                            opacity: (isClosingAll || row.totalPos === 0) ? 0.5 : 1,
                                                            cursor: (isClosingAll || row.totalPos === 0) ? 'not-allowed' : 'pointer'
                                                        }}
                                                    >
                                                        {isClosingAll ? 'CLOSING...' : 'CLOSE ALL POSITIONS'}
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
