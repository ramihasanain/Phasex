import { MarketCategory } from "./types";

export const marketCategories: { name: MarketCategory | "All" | "Other"; nameAr: string; icon: string; symbols: string[] }[] = [
    {
        "name": "All",
        "nameAr": "كل الأسواق",
        "icon": "🌍",
        "symbols": [] // Will be populated dynamically or all keys used
    },
    {
        "name": "Forex",
        "nameAr": "فوركس",
        "icon": "💱",
        "symbols": [
            "AUDCAD", "AUDCHF", "AUDJPY", "AUDNZD", "AUDUSD",
            "CADCHF", "CADJPY", "CHFJPY",
            "EURAUD", "EURCAD", "EURCHF", "EURGBP", "EURJPY", "EURNZD", "EURUSD",
            "GBPAUD", "GBPCAD", "GBPCHF", "GBPJPY", "GBPNZD", "GBPUSD",
            "NZDCAD", "NZDCHF", "NZDJPY", "NZDUSD",
            "USDCAD", "USDCHF", "USDJPY"
        ]
    },
    {
        "name": "Commodities",
        "nameAr": "سلع",
        "icon": "🛢️",
        "symbols": [
            "XAUUSD", "XAGUSD", "UKOILRoll", "USOILRoll"
        ]
    },
    {
        "name": "Indices",
        "nameAr": "مؤشرات",
        "icon": "📊",
        "symbols": [
            "DE40Roll", "JP225Roll", "UK100Roll", "UT100Roll", "US30Roll", "US500Roll", "VIXRoll",
            "NL25Roll", "NORWAY25Roll", "RUSS2000", "EU50Roll", "FRA40Roll",
            "AUS200Roll", "CHshares", "SWISS20Roll", "CHINA50Roll", "ESP35Roll", "HK50Roll"
        ]
    },
    {
        "name": "Crypto",
        "nameAr": "عملات رقمية",
        "icon": "₿",
        "symbols": [
            "ADAUSD", "ATMUSD", "AVAUSD", "AXSUSD", "BCHUSD", "BNBUSD", "BTCUSD",
            "COMUSD", "DOTUSD", "DSHUSD", "ETCUSD", "ETHUSD", "LNKUSD", "LTCUSD",
            "SOLUSD", "TRUUSD", "UNIUSD", "XRPUSD", "YFIUSD"
        ]
    },
    {
        "name": "Other",
        "nameAr": "أخرى",
        "icon": "🏢",
        "symbols": [
            "AMD", "AIG"
        ]
    }
];

export const symbolIcons: Record<string, { icon: string; label: string; labelAr: string; flag?: string }> = {
    "ADAUSD": { "icon": "🔵", "label": "Cardano", "labelAr": "كاردانو" },
    "ATMUSD": { "icon": "⚡", "label": "Cosmos", "labelAr": "كوزموس" },
    "AUDCAD": { "icon": "A$", "label": "AUD/CAD", "labelAr": "AUD/CAD", "flag": "C$" },
    "AUDCHF": { "icon": "A$", "label": "AUD/CHF", "labelAr": "AUD/CHF", "flag": "🏦" },
    "AUDJPY": { "icon": "A$", "label": "AUD/JPY", "labelAr": "AUD/JPY", "flag": "¥" },
    "AUDNZD": { "icon": "A$", "label": "AUD/NZD", "labelAr": "AUD/NZD", "flag": "🥝" },
    "AUDUSD": { "icon": "A$", "label": "AUD/USD", "labelAr": "AUD/USD", "flag": "$" },
    "AUS200Roll": { "icon": "🏛️", "label": "ASX 200", "labelAr": "أستراليا 200" },
    "AVAUSD": { "icon": "🔺", "label": "Avalanche", "labelAr": "أفالانش" },
    "AXSUSD": { "icon": "🎮", "label": "Axie", "labelAr": "أكسي" },
    "BCHUSD": { "icon": "💚", "label": "Bitcoin Cash", "labelAr": "بتكوين كاش" },
    "BNBUSD": { "icon": "💛", "label": "Binance", "labelAr": "بينانس" },
    "BRENT": { "icon": "🛢️", "label": "Brent", "labelAr": "برنت" },
    "GOLD": { "icon": "🥇", "label": "Gold", "labelAr": "ذهب" },
    "SILVER": { "icon": "🥈", "label": "Silver", "labelAr": "فضة" },
    "WTI": { "icon": "🛢️", "label": "WTI", "labelAr": "نفط خام" },
    "BTCUSD": { "icon": "₿", "label": "Bitcoin", "labelAr": "بتكوين" },
    "CADCHF": { "icon": "C$", "label": "CAD/CHF", "labelAr": "CAD/CHF", "flag": "🏦" },
    "CADJPY": { "icon": "C$", "label": "CAD/JPY", "labelAr": "CAD/JPY", "flag": "¥" },
    "CHFJPY": { "icon": "🏦", "label": "CHF/JPY", "labelAr": "CHF/JPY", "flag": "¥" },
    "CHINA50Roll": { "icon": "🏮", "label": "China A50", "labelAr": "الصين 50" },
    "CHshares": { "icon": "⛰️", "label": "Swiss Shares", "labelAr": "أسهم سويسرا" },
    "COMUSD": { "icon": "🌐", "label": "Compound", "labelAr": "كومباوند" },
    "DOTUSD": { "icon": "⚪", "label": "Polkadot", "labelAr": "بولكادوت" },
    "DSHUSD": { "icon": "🔷", "label": "Dash", "labelAr": "داش" },
    "ESP35Roll": { "icon": "🏟️", "label": "Spain 35", "labelAr": "إسبانيا 35" },
    "ETCUSD": { "icon": "💎", "label": "ETH Classic", "labelAr": "إيثريوم كلاسيك" },
    "ETHUSD": { "icon": "⟠", "label": "Ethereum", "labelAr": "إيثريوم" },
    "EU50Roll": { "icon": "🏦", "label": "Euro Stoxx 50", "labelAr": "يورو ستوكس 50" },
    "EURAUD": { "icon": "€", "label": "EUR/AUD", "labelAr": "EUR/AUD", "flag": "A$" },
    "EURCAD": { "icon": "€", "label": "EUR/CAD", "labelAr": "EUR/CAD", "flag": "C$" },
    "EURCHF": { "icon": "€", "label": "EUR/CHF", "labelAr": "EUR/CHF", "flag": "🏦" },
    "EURGBP": { "icon": "€", "label": "EUR/GBP", "labelAr": "EUR/GBP", "flag": "£" },
    "EURJPY": { "icon": "€", "label": "EUR/JPY", "labelAr": "EUR/JPY", "flag": "¥" },
    "EURNZD": { "icon": "€", "label": "EUR/NZD", "labelAr": "EUR/NZD", "flag": "🥝" },
    "EURUSD": { "icon": "€", "label": "EUR/USD", "labelAr": "يورو/دولار", "flag": "$" },
    "FRA40Roll": { "icon": "🗼", "label": "France 40", "labelAr": "فرنسا 40" },
    "GBPAUD": { "icon": "£", "label": "GBP/AUD", "labelAr": "GBP/AUD", "flag": "A$" },
    "GBPCAD": { "icon": "£", "label": "GBP/CAD", "labelAr": "GBP/CAD", "flag": "C$" },
    "GBPCHF": { "icon": "£", "label": "GBP/CHF", "labelAr": "GBP/CHF", "flag": "🏦" },
    "GBPJPY": { "icon": "£", "label": "GBP/JPY", "labelAr": "GBP/JPY", "flag": "¥" },
    "GBPNZD": { "icon": "£", "label": "GBP/NZD", "labelAr": "GBP/NZD", "flag": "🥝" },
    "GBPUSD": { "icon": "£", "label": "GBP/USD", "labelAr": "جنيه/دولار", "flag": "$" },
    "GER30": { "icon": "🏭", "label": "DAX 30", "labelAr": "داكس 30" },
    "XAUUSD": { "icon": "🥇", "label": "Gold", "labelAr": "ذهب" },
    "HK50Roll": { "icon": "🏙️", "label": "Hang Seng", "labelAr": "هانج سينج" },
    "JAP225": { "icon": "⛩️", "label": "Nikkei 225", "labelAr": "نيكي 225" },
    "LNKUSD": { "icon": "🔗", "label": "Chainlink", "labelAr": "تشين لينك" },
    "LTCUSD": { "icon": "🪨", "label": "Litecoin", "labelAr": "لايتكوين" },
    "NL25Roll": { "icon": "🌷", "label": "AEX 25", "labelAr": "هولندا 25" },
    "NORWAY25Roll": { "icon": "⛷️", "label": "Norway 25", "labelAr": "النرويج 25" },
    "NZDCAD": { "icon": "🥝", "label": "NZD/CAD", "labelAr": "NZD/CAD", "flag": "C$" },
    "NZDCHF": { "icon": "🥝", "label": "NZD/CHF", "labelAr": "NZD/CHF", "flag": "🏦" },
    "NZDJPY": { "icon": "🥝", "label": "NZD/JPY", "labelAr": "NZD/JPY", "flag": "¥" },
    "NZDUSD": { "icon": "🥝", "label": "NZD/USD", "labelAr": "NZD/USD", "flag": "$" },
    "RUSS2000": { "icon": "📈", "label": "Russell 2000", "labelAr": "راسل 2000" },
    "XAGUSD": { "icon": "🥈", "label": "Silver", "labelAr": "فضة" },
    "SOLUSD": { "icon": "◎", "label": "Solana", "labelAr": "سولانا" },
    "SWISS20Roll": { "icon": "⛰️", "label": "SMI 20", "labelAr": "سويسرا 20" },
    "TRUUSD": { "icon": "🟢", "label": "TrueUSD", "labelAr": "ترو يو إس دي" },
    "UK100": { "icon": "🏰", "label": "FTSE 100", "labelAr": "فوتسي 100" },
    "UNIUSD": { "icon": "🦄", "label": "Uniswap", "labelAr": "يونيسواب" },
    "US100": { "icon": "💻", "label": "Nasdaq 100", "labelAr": "ناسداك 100" },
    "US30": { "icon": "🏛️", "label": "Dow Jones", "labelAr": "داو جونز" },
    "US500": { "icon": "📊", "label": "S&P 500", "labelAr": "إس آند بي 500" },
    "USDCAD": { "icon": "$", "label": "USD/CAD", "labelAr": "USD/CAD", "flag": "C$" },
    "USDCHF": { "icon": "$", "label": "USD/CHF", "labelAr": "USD/CHF", "flag": "🏦" },
    "USDJPY": { "icon": "$", "label": "USD/JPY", "labelAr": "USD/JPY", "flag": "¥" },
    "VIXRoll": { "icon": "📉", "label": "VIX", "labelAr": "مؤشر التقلب" },
    "USOIL": { "icon": "🛢️", "label": "Crude Oil", "labelAr": "نفط خام" },
    "XRPUSD": { "icon": "💧", "label": "XRP", "labelAr": "ريبل" },
    "YFIUSD": { "icon": "💰", "label": "Yearn", "labelAr": "ييرن" },
    "UKOILRoll": { "icon": "🛢️", "label": "Brent Oil", "labelAr": "برنت" },
    "USOILRoll": { "icon": "🛢️", "label": "US Crude", "labelAr": "النفط الخام" },
    "DE40Roll": { "icon": "🏭", "label": "DAX 40", "labelAr": "داكس 40" },
    "JP225Roll": { "icon": "⛩️", "label": "Nikkei 225", "labelAr": "نيكي 225" },
    "UK100Roll": { "icon": "🏰", "label": "FTSE 100", "labelAr": "فوتسي 100" },
    "UT100Roll": { "icon": "💻", "label": "Nasdaq 100", "labelAr": "ناسداك 100" },
    "US30Roll": { "icon": "🏛️", "label": "Dow Jones", "labelAr": "داو جونز" },
    "US500Roll": { "icon": "📊", "label": "S&P 500", "labelAr": "إس آند بي 500" },
    "AMD": { "icon": "🖥️", "label": "AMD", "labelAr": "إي إم دي" },
    "AIG": { "icon": "🏢", "label": "AIG", "labelAr": "إيه آي جي" }
};

// Dynamically populate the "All" category with symbols from all other categories
const allCategory = marketCategories.find(c => c.name === "All");
if (allCategory) {
    allCategory.symbols = marketCategories.filter(c => c.name !== "All").flatMap(c => c.symbols);
}
