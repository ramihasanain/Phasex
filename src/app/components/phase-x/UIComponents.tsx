import React from "react";
import { motion } from "motion/react";
import type { Signal } from "./types";
import { useLanguage } from "../../contexts/LanguageContext";
import { useThemeTokens } from "../../hooks/useThemeTokens";

/* ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  SUPERCAR GAUGE ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  */

export function SupercarGauge({ score, confidence, isRTL }: { score: number; confidence: number; isRTL: boolean }) {
    const { t } = useLanguage();

    // 5-state color based on Global Score
    const primary = score > 0.6 ? "#00c853"   // Strong Uptrend
        : score > 0.2 ? "#00e676"              // Bullish
            : score >= -0.2 ? "#ffc400"            // Neutral
                : score >= -0.6 ? "#ff6d00"            // Bearish
                    : "#ff1744";                            // Strong Downtrend

    const glow = score > 0.6 ? "rgba(0,200,83,"
        : score > 0.2 ? "rgba(0,230,118,"
            : score >= -0.2 ? "rgba(255,196,0,"
                : score >= -0.6 ? "rgba(255,109,0,"
                    : "rgba(255,23,68,";

    // Confidence ring color (5 levels)
    const confColor = confidence >= 85 ? "#00e5ff"
        : confidence >= 70 ? "#448aff"
            : confidence >= 55 ? "#26c6da"
                : confidence >= 40 ? "#ffab00"
                    : "#ff6e40";

    const size = 260;

    const cx = size / 2, cy = size / 2;

    const arc = (sd: number, ed: number, r: number) => {

        const s = (sd * Math.PI) / 180, e = (ed * Math.PI) / 180;

        const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);

        const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
        return `M ${x1} ${y1} A ${r} ${r} 0 ${ed - sd > 180 ? 1 : 0} 1 ${x2} ${y2}`;
    };

    const startA = -225, sweepA = 270;

    const norm = (score + 1) / 2;

    const scoreAngle = startA + norm * sweepA;

    const segments = 60;

    const segAngle = sweepA / segments;

    const activeSegs = Math.round(norm * segments);

    const confNorm = confidence / 100;

    const ticks = Array.from({ length: 55 }, (_, i) => {

        const angle = startA + (i / 54) * sweepA;

        const rad = (angle * Math.PI) / 180;

        const isMajor = i % 5 === 0;

        const r1 = 110, r2 = isMajor ? 100 : 104;
        return { x1: cx + r1 * Math.cos(rad), y1: cy + r1 * Math.sin(rad), x2: cx + r2 * Math.cos(rad), y2: cy + r2 * Math.sin(rad), isMajor };
    });

    const needleRad = (scoreAngle * Math.PI) / 180;

    const nx = cx + 98 * Math.cos(needleRad), ny = cy + 98 * Math.sin(needleRad);

    const scorePct = Math.round(score * 100);
    const scoreText = (scorePct > 0 ? "+" : "") + scorePct + "%";
    return (
        <div className="relative" style={{ width: size, height: size * 0.68 }}>
            <div className="absolute" style={{ top: -15, left: -15, right: -15, bottom: -15, background: `radial-gradient(circle at 50% 55%, ${glow}0.12) 0%, transparent 65%)`, filter: "blur(8px)" }} />
            <svg width={size} height={size * 0.68} viewBox={`0 0 ${size} ${size * 0.68}`} className="relative z-10">
                <defs>
                    <filter id="hGlow"><feGaussianBlur stdDeviation="5" result="b1" /><feGaussianBlur stdDeviation="2" result="b2" /><feMerge><feMergeNode in="b1" /><feMergeNode in="b2" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                    <filter id="sGlow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                    <filter id="tGlow"><feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                    <radialGradient id="iDisc" cx="50%" cy="50%"><stop offset="0%" stopColor="#0d1520" /><stop offset="100%" stopColor="#060a10" /></radialGradient>
                    <filter id="vGlow"><feGaussianBlur stdDeviation="12" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter>
                </defs>
                {Array.from({ length: segments }, (_, i) => {

                    const a1 = startA + i * segAngle + 0.5, a2 = startA + (i + 1) * segAngle - 0.5;

                    const isActive = i < activeSegs;

                    const p = i / segments;
                    let c = "#1a2332";
                    if (isActive) { if (p < 0.25) c = "#ff1744"; else if (p < 0.4) c = "#ff6d00"; else if (p < 0.55) c = "#ffc400"; else if (p < 0.75) c = "#76ff03"; else c = "#00e676"; }
                    return <motion.path key={i} d={arc(a1, a2, 122)} fill="none" stroke={c} strokeWidth={isActive ? "5" : "2"} strokeLinecap="round" opacity={isActive ? 0.9 : 0.15} initial={{ opacity: 0 }} animate={{ opacity: isActive ? 0.9 : 0.15 }} transition={{ delay: i * 0.01, duration: 0.2 }} />;
                })}
                <path d={arc(-225, 45, 90)} fill="none" stroke="#111a28" strokeWidth="3" strokeLinecap="round" />
                <motion.path d={arc(-225, -225 + confNorm * 270, 90)} fill="none" stroke={confColor} strokeWidth="3" strokeLinecap="round" opacity="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 1.2 }} />
                {ticks.map((t, i) => <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.isMajor ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"} strokeWidth={t.isMajor ? 1.5 : 0.7} />)}
                <circle cx={cx} cy={cy} r="72" fill="url(#iDisc)" /><circle cx={cx} cy={cy} r="72" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                {(() => {
                    const nRad = (scoreAngle * Math.PI) / 180;
                    const tipX = cx + 92 * Math.cos(nRad), tipY = cy + 92 * Math.sin(nRad);
                    const baseX = cx - 3 * Math.cos(nRad), baseY = cy - 3 * Math.sin(nRad);
                    const perpX = 2.5 * Math.sin(nRad), perpY = -2.5 * Math.cos(nRad);
                    const b1x = baseX + perpX, b1y = baseY + perpY;
                    const b2x = baseX - perpX, b2y = baseY - perpY;
                    return (
                        <>
                            <motion.polygon
                                points={`${tipX},${tipY} ${b1x},${b1y} ${b2x},${b2y}`}
                                fill={primary} opacity="0.8" filter="url(#sGlow)"
                                initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            />
                            <circle cx={cx} cy={cy} r="5" fill="#0a0e14" stroke={primary} strokeWidth="2" />
                        </>
                    );
                })()}
                <motion.circle cx={nx} cy={ny} r="3.5" fill={primary} filter="url(#hGlow)" initial={{ opacity: 0 }} animate={{ opacity: [0.6, 1, 0.6] }} transition={{ delay: 1.5, duration: 2, repeat: Infinity }} />
                <motion.text x={cx} y={cy + 2} fill={primary} fontSize="30" fontWeight="900" textAnchor="middle" dominantBaseline="middle" fontFamily="'Inter', system-ui" letterSpacing="-1" filter="url(#tGlow)" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.8, type: "spring" }}>{scoreText}</motion.text>
                <text x={cx} y={cy + 22} fill="rgba(255,255,255,0.35)" fontSize="8" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" letterSpacing="2">{t("globalScore")}</text>
                <circle cx={cx} cy={cy} r="115" fill="none" stroke={primary} strokeWidth="1" opacity="0.1" filter="url(#vGlow)" />
            </svg>
        </div>
    );
}

/* ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  Glass Panel ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  */

export function Panel({ children, className = "", accent }: { children: React.ReactNode; className?: string; accent?: string }) {
    const tk = useThemeTokens();
    const d = tk.isDark;
    return (
        <motion.div className={`rounded-2xl overflow-hidden ${className}`}
            initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
            whileHover={{ boxShadow: accent ? (d ? `0 12px 50px rgba(0,0,0,0.6), 0 0 60px ${accent}` : `0 8px 30px rgba(0,0,0,0.08), 0 0 30px ${accent}`) : (d ? "0 12px 50px rgba(0,0,0,0.6)" : "0 8px 30px rgba(0,0,0,0.08)") }}
            style={{
                background: d ? "linear-gradient(160deg, rgba(14,20,33,0.92) 0%, rgba(8,12,22,0.96) 100%)" : tk.surface,
                border: `1px solid ${d ? 'rgba(255,255,255,0.05)' : tk.border}`,
                boxShadow: accent ? (d ? `0 8px 40px rgba(0,0,0,0.5), 0 0 50px ${accent}, inset 0 1px 0 rgba(255,255,255,0.04)` : `0 4px 20px rgba(0,0,0,0.06), 0 0 30px ${accent}`) : (d ? "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)" : "0 4px 20px rgba(0,0,0,0.06)"),
            }}>
            {children}
        </motion.div>
    );
}
/* ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  Scanning line ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  */

export function ScanLine({ color }: { color: string }) {
    return (
        <motion.div className="absolute left-0 right-0 h-px pointer-events-none z-20"
            style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }}
            animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
    );
}
/* ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  Animated Buy/Sell Cell ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  */

export function SignalCell({ signal, rowIdx, colIdx }: { signal: Signal; rowIdx: number; colIdx: number }) {
    const tk = useThemeTokens();
    const d = tk.isDark;
    const isBuy = signal === "Buy";
    const isSell = signal === "Sell";
    const isNeutral = signal === "Neutral" || signal === "NA";

    let color = d ? "#666" : "#999";
    let bgColor = d ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";
    let label = "-";

    if (isBuy) {
        color = d ? "#00e676" : "#16a34a";
        bgColor = d ? "rgba(0,230,118,0.06)" : "rgba(22,163,74,0.06)";
        label = "Buy";
    } else if (isSell) {
        color = d ? "#ff1744" : "#dc2626";
        bgColor = d ? "rgba(255,23,68,0.06)" : "rgba(220,38,38,0.06)";
        label = "Sell";
    } else if (signal === "Neutral") {
        color = d ? "#ffc400" : "#d97706";
        bgColor = d ? "rgba(255,196,0,0.06)" : "rgba(217,119,6,0.06)";
        label = "Neu";
    }

    return (
        <motion.td className="text-center text-[10px] font-bold py-[5px] px-0.5 border-r border-b relative"
            style={{
                color: color,
                background: bgColor,
                borderColor: d ? "rgba(255,255,255,0.03)" : tk.border,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: rowIdx * 0.008 + colIdx * 0.004, duration: 0.2 }}
            whileHover={{
                scale: 1.15,
                zIndex: 20,
                boxShadow: `0 0 10px ${color}30`,
                background: isBuy ? (d ? "rgba(0,230,118,0.12)" : "rgba(22,163,74,0.1)") : isSell ? (d ? "rgba(255,23,68,0.12)" : "rgba(220,38,38,0.1)") : (d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"),
            }}
        >
            {label}
        </motion.td>
    );
}

// ==========================================
// Smart Keyword Matcher for News Hub
// ==========================================
import { NewsTag } from "./types";

export const GLOBAL_NEWS_TAGS: NewsTag[] = [
    // Forex Majors & Central Banks
    { symbol: "EURUSD", keywords: ["EUR", "USD", "ECB", "Federal Reserve", "Fed", "Lagarde", "Powell", "Eurozone", "Euro", "Dollar", "NFP", "FOMC", "CPI"] },
    { symbol: "GBPUSD", keywords: ["GBP", "USD", "BoE", "Bank of England", "Bailey", "Pound", "Sterling", "UK", "Britain", "Brexit"] },
    { symbol: "USDJPY", keywords: ["JPY", "USD", "BoJ", "Bank of Japan", "Yen", "Ueda", "Kuroda", "Tokyo"] },
    { symbol: "AUDUSD", keywords: ["AUD", "USD", "RBA", "Reserve Bank of Australia", "Aussie", "Australia", "Bullock"] },
    { symbol: "USDCAD", keywords: ["CAD", "USD", "BoC", "Bank of Canada", "Loonie", "Canada", "Macklem"] },
    { symbol: "USDCHF", keywords: ["CHF", "USD", "SNB", "Swiss National Bank", "Franc", "Switzerland", "Jordan"] },
    { symbol: "NZDUSD", keywords: ["NZD", "USD", "RBNZ", "Kiwi", "New Zealand", "Orr"] },
    // Commodities
    { symbol: "XAUUSD", keywords: ["Gold", "XAU", "Bullion", "Precious Metal"] },
    { symbol: "USOILRoll", keywords: ["Oil", "WTI", "Crude", "OPEC", "Energy Information Administration", "EIA", "Petroleum"] },
    { symbol: "XAGUSD", keywords: ["Silver", "XAG"] },
    // Indices
    { symbol: "US30", keywords: ["Dow", "US30", "Wall Street", "DJIA"] },
    { symbol: "NAS100", keywords: ["Nasdaq", "NAS100", "Tech Stocks", "NDX"] },
    { symbol: "SPX500", keywords: ["S&P", "SPX", "SP500", "Equities"] },
    { symbol: "DAX", keywords: ["DAX", "Germany", "Frankfurt", "GER40"] },
    { symbol: "UK100", keywords: ["FTSE", "UK100", "London Stock Exchange"] },
    // Crypto
    { symbol: "BTC", keywords: ["Bitcoin", "BTC", "Satoshi", "ETF", "Crypto"] },
    { symbol: "ETH", keywords: ["Ethereum", "ETH", "Vitalik", "ERC", "Crypto"] },
    { symbol: "SOL", keywords: ["Solana", "SOL", "Crypto"] }
];

export function extractTagsFromText(text: string | undefined): string[] {
    if (!text) return [];
    const normalizedText = text.toLowerCase();
    const matched = new Set<string>();

    for (const tagdef of GLOBAL_NEWS_TAGS) {
        for (const kw of tagdef.keywords) {
            // Match substring without word boundary for broader catching, or use boundaries for short words
            const isShort = kw.length <= 3;
            const regexStr = isShort ? `\\b${kw.toLowerCase()}\\b` : kw.toLowerCase();
            const regex = new RegExp(regexStr, 'i');
            
            if (regex.test(normalizedText)) {
                matched.add(tagdef.symbol);
                break; // One keyword match is enough to assign this symbol tag
            }
        }
    }
    return Array.from(matched);
}
