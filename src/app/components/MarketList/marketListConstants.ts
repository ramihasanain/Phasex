export const flashStyles = `
@keyframes flashUp {
  0% { background: rgba(34,197,94,0.35); color: #22c55e; text-shadow: 0 0 8px rgba(34,197,94,0.5); }
  100% { background: transparent; color: #cbd5e1; text-shadow: none; }
}
@keyframes flashDown {
  0% { background: rgba(239,68,68,0.35); color: #ef4444; text-shadow: 0 0 8px rgba(239,68,68,0.5); }
  100% { background: transparent; color: #cbd5e1; text-shadow: none; }
}
.price-flash-up { animation: flashUp 1.2s ease-out; }
.price-flash-down { animation: flashDown 1.2s ease-out; }
`;

export const MARKET_VISUALS: Record<string, { labelAr: string; labelEn: string; accent: string; emoji: string }> = {
    ALL: { labelAr: "الكل", labelEn: "All", accent: "#0ea5e9", emoji: "🌐" },
    FOREX: { labelAr: "فوركس", labelEn: "Forex", accent: "#3b82f6", emoji: "💱" },
    COMMODITY: { labelAr: "سلع", labelEn: "Commodities", accent: "#f97316", emoji: "🛢️" },
    INDEX: { labelAr: "مؤشرات", labelEn: "Indices", accent: "#a855f7", emoji: "📊" },
    CRYPTO: { labelAr: "رقمية", labelEn: "Crypto", accent: "#10b981", emoji: "₿" },
};

export const DEFAULT_VISUAL = { labelAr: "سوق", labelEn: "Market", accent: "#6366f1", emoji: "📈" };

export function getMarketVisual(code: string) {
    return MARKET_VISUALS[code] || DEFAULT_VISUAL;
}

export const symbolIcons: Record<string, string> = {
    ADAUSD: "🔵",
    AXSUSD: "🎮",
    BCHUSD: "💚",
    BNBUSD: "💛",
    BTCUSD: "₿",
    DOTUSD: "⚪",
    ETCUSD: "💎",
    ETHUSD: "⟠",
    LTCUSD: "🪨",
    SOLUSD: "◎",
    UNIUSD: "🦄",
    XRPUSD: "💧",
    YFIUSD: "💰",
    LINKUSD: "🔗",
    COMPUSD: "🌐",
    DASHUSD: "🔷",
    TRUMPUSD: "🟡",
    ATOMUSD: "⚡",
    AVAXUSD: "🔺",
    AUDCAD: "🇦🇺",
    AUDCHF: "🇦🇺",
    AUDJPY: "🇦🇺",
    AUDNZD: "🇦🇺",
    AUDUSD: "🇦🇺",
    CADCHF: "🇨🇦",
    CADJPY: "🇨🇦",
    CHFJPY: "🇨🇭",
    EURAUD: "🇪🇺",
    EURCAD: "🇪🇺",
    EURCHF: "🇪🇺",
    EURGBP: "🇪🇺",
    EURJPY: "🇪🇺",
    EURNZD: "🇪🇺",
    EURUSD: "🇪🇺",
    GBPAUD: "🇬🇧",
    GBPCAD: "🇬🇧",
    GBPCHF: "🇬🇧",
    GBPJPY: "🇬🇧",
    GBPNZD: "🇬🇧",
    GBPUSD: "🇬🇧",
    NZDCAD: "🇳🇿",
    NZDCHF: "🇳🇿",
    NZDJPY: "🇳🇿",
    NZDUSD: "🇳🇿",
    USDCAD: "🇺🇸",
    USDCHF: "🇺🇸",
    USDJPY: "🇺🇸",
    XAUUSD: "🥇",
    XAGUSD: "🥈",
    UKOILRoll: "🛢️",
    USOILRoll: "🛢️",
    VIXRoll: "📉",
    NL25Roll: "🌷",
    NORWAY25Roll: "⛷️",
    RUSS2000: "📈",
    EU50Roll: "🏦",
    FRA40Roll: "🗼",
    AUS200Roll: "🏛️",
    CHshares: "⛰️",
    SWISS20Roll: "⛰️",
    CHINA50Roll: "🏮",
    ESP35Roll: "🏟️",
    HK50Roll: "🏙️",
    DE40Roll: "🏭",
    JP225Roll: "⛩️",
    UK100Roll: "🏰",
    US30Roll: "🏛️",
    US500Roll: "📊",
    UT100Roll: "💻",
};
