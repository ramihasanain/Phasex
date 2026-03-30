export const symbolIcons: Record<string, string> = {
    "ADAUSD.p": "🔵",
    "ATMUSD.p": "⚡",
    "AVAUSD.p": "🔺",
    "AXSUSD.p": "🎮",
    "BCHUSD.p": "💚",
    "BNBUSD.p": "💛",
    "BTCUSD.p": "₿",
    "COMUSD.p": "🌐",
    "DOTUSD.p": "⚪",
    "DSHUSD.p": "🔷",
    "ETCUSD.p": "💎",
    "ETHUSD.p": "⟠",
    "LNKUSD.p": "🔗",
    "LTCUSD.p": "🪨",
    "SOLUSD.p": "◎",
    "TRUUSD.p": "🟢",
    "UNIUSD.p": "🦄",
    "XRPUSD.p": "💧",
    "YFIUSD.p": "💰",
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
    BRENT: "🛢️",
    WTI: "🛢️",
    USOIL: "🛢️",
    GOLD: "🥇",
    SILVER: "🥈",
    XAUUSD: "🥇",
    XAGUSD: "🥈",
    GER30: "🏭",
    JAP225: "⛩️",
    UK100: "🏰",
    US100: "💻",
    US30: "🏛️",
    US500: "📊",
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
};

export const getIcon = (asset: string): string => {
    if (symbolIcons[asset]) return symbolIcons[asset];
    const base = asset.replace(/\.(sd|lv|p)$/i, "");
    if (symbolIcons[base]) return symbolIcons[base];
    if (symbolIcons[base + ".p"]) return symbolIcons[base + ".p"];

    if (base.includes("JP225") || base.includes("JAP225")) return "⛩️";
    if (base.includes("US500")) return "📊";
    if (base.includes("US100") || base.includes("UT100")) return "💻";
    if (base.includes("US30")) return "🏛️";
    if (base.includes("AUS200")) return "🏛️";
    if (base.includes("CHINA50") || base.includes("CHshares")) return "🏮";
    if (base.includes("HK50")) return "🏙️";
    if (base.includes("GER40") || base.includes("DE40")) return "🏭";

    return "📈";
};

export const parseTF = (tf: string): number => {
    const s = tf.trim().toLowerCase();
    const num = parseInt(s.replace(/[^0-9]/g, "")) || 1;
    if (s.includes("m") && !s.includes("mn")) return num;
    if (s.includes("h")) return num * 60;
    if (s.includes("d")) return num * 60 * 24;
    if (s.includes("w")) return num * 60 * 24 * 7;
    if (s.includes("mn")) return num * 60 * 24 * 30;
    return 9999;
};

export const sortTF = (a: string, b: string) => parseTF(a) - parseTF(b);

export const normalizeSignal = (s: string): string => {
    if (!s) return "";
    const lower = s.trim().toLowerCase();
    if (lower === "buy") return "Buy";
    if (lower === "sell") return "Sell";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

export const MARKET_FILTERS = [
    { key: "ALL", label: "All", labelAr: "الكل", color: "#818cf8", emoji: "🌐" },
    { key: "FOREX", label: "Forex", labelAr: "فوركس", color: "#3b82f6", emoji: "💱" },
    { key: "CRYPTO", label: "Crypto", labelAr: "رقمية", color: "#10b981", emoji: "₿" },
    { key: "INDEX", label: "Indices", labelAr: "مؤشرات", color: "#a855f7", emoji: "📊" },
    { key: "COMMODITY", label: "Commodities", labelAr: "سلع", color: "#f59e0b", emoji: "🛢️" },
];

export const ACTION_FILTERS = [
    { key: "ALL", label: "All", labelAr: "الكل", color: "#818cf8" },
    { key: "Buy", label: "Buy", labelAr: "شراء", color: "#4ade80" },
    { key: "Sell", label: "Sell", labelAr: "بيع", color: "#f87171" },
];
