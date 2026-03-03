import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MarketList, Asset } from "./MarketList";
import { IndicatorChart, Indicator } from "./IndicatorChart";
import { SubscriptionPanel } from "./SubscriptionPanel";
import { AdSpace } from "./AdSpace";
import { Logo } from "./Logo";
import { LogOut, TrendingUp, Moon, Sun, Gauge, Zap, Waves, TrendingUpDown, Signal, ChartCandlestick, Crown, Clock, Languages, ChevronsLeft, ChevronsRight, Move, Target, Activity, Navigation } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "./ui/badge";

interface TradingDashboardProps {
  onLogout: () => void;
}

// بيانات الأصول المالية
const mockAssets: Asset[] = [
  // CRYPTO
  { id: "crypto1", name: "كاردانو", nameEn: "Cardano", symbol: "ADAUSD.p", price: 0.58, change: 0.012, changePercent: 2.1, market: "CRYPTO" },
  { id: "crypto2", name: "أتوم", nameEn: "Atmos", symbol: "ATMUSD.p", price: 12.45, change: -0.32, changePercent: -2.5, market: "CRYPTO" },
  { id: "crypto3", name: "أفالانش", nameEn: "Avalanche", symbol: "AVAUSD.p", price: 38.20, change: 1.15, changePercent: 3.1, market: "CRYPTO" },
  { id: "crypto4", name: "أكسي إنفينيتي", nameEn: "Axie", symbol: "AXSUSD.p", price: 7.85, change: -0.12, changePercent: -1.5, market: "CRYPTO" },
  { id: "crypto5", name: "بتكوين كاش", nameEn: "Bitcoin Cash", symbol: "BCHUSD.p", price: 425.60, change: 15.30, changePercent: 3.7, market: "CRYPTO" },
  { id: "crypto6", name: "بينانس كوين", nameEn: "Binance Coin", symbol: "BNBUSD.p", price: 595.40, change: 8.20, changePercent: 1.4, market: "CRYPTO" },
  { id: "crypto7", name: "بتكوين", nameEn: "Bitcoin", symbol: "BTCUSD.p", price: 62450.00, change: 850.00, changePercent: 1.38, market: "CRYPTO" },
  { id: "crypto8", name: "كومباوند", nameEn: "Compound", symbol: "COMUSD.p", price: 72.15, change: -1.25, changePercent: -1.7, market: "CRYPTO" },
  { id: "crypto9", name: "بولكادوت", nameEn: "Polkadot", symbol: "DOTUSD.p", price: 8.95, change: 0.22, changePercent: 2.5, market: "CRYPTO" },
  { id: "crypto10", name: "داش", nameEn: "Dash", symbol: "DSHUSD.p", price: 32.45, change: -0.45, changePercent: -1.4, market: "CRYPTO" },
  { id: "crypto11", name: "إيثريوم كلاسيك", nameEn: "Ethereum Classic", symbol: "ETCUSD.p", price: 28.75, change: 0.85, changePercent: 3.1, market: "CRYPTO" },
  { id: "crypto12", name: "إيثريوم", nameEn: "Ethereum", symbol: "ETHUSD.p", price: 3450.25, change: -45.30, changePercent: -1.3, market: "CRYPTO" },
  { id: "crypto13", name: "تشينلينك", nameEn: "Chainlink", symbol: "LNKUSD.p", price: 18.45, change: 0.35, changePercent: 1.9, market: "CRYPTO" },
  { id: "crypto14", name: "لايتكوين", nameEn: "Litecoin", symbol: "LTCUSD.p", price: 82.50, change: 1.45, changePercent: 1.8, market: "CRYPTO" },
  { id: "crypto15", name: "سولانا", nameEn: "Solana", symbol: "SOLUSD.p", price: 145.20, change: 5.67, changePercent: 4.0, market: "CRYPTO" },
  { id: "crypto16", name: "ترو يو إس دي", nameEn: "TrueUSD", symbol: "TRUUSD.p", price: 1.00, change: 0.00, changePercent: 0.0, market: "CRYPTO" },
  { id: "crypto17", name: "يوني سواب", nameEn: "Uniswap", symbol: "UNIUSD.p", price: 12.15, change: -0.25, changePercent: -2.0, market: "CRYPTO" },
  { id: "crypto18", name: "ريبل", nameEn: "Ripple", symbol: "XRPUSD.p", price: 0.58, change: 0.01, changePercent: 1.7, market: "CRYPTO" },
  { id: "crypto19", name: "يرن فاينانس", nameEn: "Yearn Finance", symbol: "YFIUSD.p", price: 8450.00, change: -120.00, changePercent: -1.4, market: "CRYPTO" },

  // FOREX
  { id: "fx1", name: "أسترالي/كندي", nameEn: "AUD/CAD", symbol: "AUDCAD", price: 0.8945, change: 0.0023, changePercent: 0.26, market: "FOREX" },
  { id: "fx2", name: "أسترالي/فرنك", nameEn: "AUD/CHF", symbol: "AUDCHF", price: 0.5812, change: -0.0015, changePercent: -0.26, market: "FOREX" },
  { id: "fx3", name: "أسترالي/ين", nameEn: "AUD/JPY", symbol: "AUDJPY", price: 98.45, change: 0.45, changePercent: 0.46, market: "FOREX" },
  { id: "fx4", name: "أسترالي/نيوزيلندي", nameEn: "AUD/NZD", symbol: "AUDNZD", price: 1.0785, change: -0.0012, changePercent: -0.11, market: "FOREX" },
  { id: "fx5", name: "أسترالي/دولار", nameEn: "AUD/USD", symbol: "AUDUSD", price: 0.6520, change: -0.0023, changePercent: -0.35, market: "FOREX" },
  { id: "fx6", name: "كندي/فرنك", nameEn: "CAD/CHF", symbol: "CADCHF", price: 0.6485, change: 0.0012, changePercent: 0.19, market: "FOREX" },
  { id: "fx7", name: "كندي/ين", nameEn: "CAD/JPY", symbol: "CADJPY", price: 109.50, change: 0.35, changePercent: 0.32, market: "FOREX" },
  { id: "fx8", name: "فرنك/ين", nameEn: "CHF/JPY", symbol: "CHFJPY", price: 168.25, change: 0.85, changePercent: 0.51, market: "FOREX" },
  { id: "fx9", name: "يورو/أسترالي", nameEn: "EUR/AUD", symbol: "EURAUD", price: 1.6540, change: 0.0045, changePercent: 0.27, market: "FOREX" },
  { id: "fx10", name: "يورو/كندي", nameEn: "EUR/CAD", symbol: "EURCAD", price: 1.4580, change: -0.0025, changePercent: -0.17, market: "FOREX" },
  { id: "fx11", name: "يورو/فرنك", nameEn: "EUR/CHF", symbol: "EURCHF", price: 0.9415, change: 0.0015, changePercent: 0.16, market: "FOREX" },
  { id: "fx12", name: "يورو/باوند", nameEn: "EUR/GBP", symbol: "EURGBP", price: 0.8540, change: -0.0008, changePercent: -0.09, market: "FOREX" },
  { id: "fx13", name: "يورو/ين", nameEn: "EUR/JPY", symbol: "EURJPY", price: 162.45, change: 0.75, changePercent: 0.46, market: "FOREX" },
  { id: "fx14", name: "يورو/نيوزيلندي", nameEn: "EUR/NZD", symbol: "EURNZD", price: 1.7820, change: 0.0055, changePercent: 0.31, market: "FOREX" },
  { id: "fx15", name: "يورو/دولار", nameEn: "EUR/USD", symbol: "EURUSD", price: 1.0845, change: 0.0023, changePercent: 0.21, market: "FOREX" },
  { id: "fx16", name: "باوند/أسترالي", nameEn: "GBP/AUD", symbol: "GBPAUD", price: 1.9340, change: 0.0065, changePercent: 0.34, market: "FOREX" },
  { id: "fx17", name: "باوند/كندي", nameEn: "GBP/CAD", symbol: "GBPCAD", price: 1.7050, change: -0.0015, changePercent: -0.09, market: "FOREX" },
  { id: "fx18", name: "باوند/فرنك", nameEn: "GBP/CHF", symbol: "GBPCHF", price: 1.1015, change: 0.0025, changePercent: 0.23, market: "FOREX" },
  { id: "fx19", name: "باوند/ين", nameEn: "GBP/JPY", symbol: "GBPJPY", price: 189.75, change: 1.15, changePercent: 0.61, market: "FOREX" },
  { id: "fx20", name: "باوند/نيوزيلندي", nameEn: "GBP/NZD", symbol: "GBPNZD", price: 2.0850, change: 0.0085, changePercent: 0.41, market: "FOREX" },
  { id: "fx21", name: "باوند/دولار", nameEn: "GBP/USD", symbol: "GBPUSD", price: 1.2634, change: -0.0015, changePercent: -0.12, market: "FOREX" },
  { id: "fx22", name: "نيوزيلندي/كندي", nameEn: "NZD/CAD", symbol: "NZDCAD", price: 0.8145, change: 0.0012, changePercent: 0.15, market: "FOREX" },
  { id: "fx23", name: "نيوزيلندي/فرنك", nameEn: "NZD/CHF", symbol: "NZDCHF", price: 0.5412, change: -0.0008, changePercent: -0.15, market: "FOREX" },
  { id: "fx24", name: "نيوزيلندي/ين", nameEn: "NZD/JPY", symbol: "NZDJPY", price: 92.45, change: 0.25, changePercent: 0.27, market: "FOREX" },
  { id: "fx25", name: "نيوزيلندي/دولار", nameEn: "NZD/USD", symbol: "NZDUSD", price: 0.6050, change: -0.0015, changePercent: -0.25, market: "FOREX" },
  { id: "fx26", name: "دولار/كندي", nameEn: "USD/CAD", symbol: "USDCAD", price: 1.3425, change: 0.0012, changePercent: 0.09, market: "FOREX" },
  { id: "fx27", name: "دولار/فرنك", nameEn: "USD/CHF", symbol: "USDCHF", price: 0.8812, change: -0.0008, changePercent: -0.09, market: "FOREX" },
  { id: "fx28", name: "دولار/ين", nameEn: "USD/JPY", symbol: "USDJPY", price: 149.52, change: 0.45, changePercent: 0.30, market: "FOREX" },

  // COMMODITY
  { id: "cmd1", name: "نفط برنت", nameEn: "Brent", symbol: "BRENT", price: 82.45, change: 1.15, changePercent: 1.41, market: "COMMODITY" },
  { id: "cmd2", name: "ذهب", nameEn: "Gold", symbol: "GOLD", price: 2045.60, change: 12.30, changePercent: 0.61, market: "COMMODITY" },
  { id: "cmd3", name: "فضة", nameEn: "Silver", symbol: "SILVER", price: 22.85, change: -0.25, changePercent: -1.08, market: "COMMODITY" },
  { id: "cmd4", name: "نفط خام", nameEn: "WTI", symbol: "WTI", price: 78.15, change: 0.85, changePercent: 1.10, market: "COMMODITY" },

  // INDEX
  { id: "idx1", name: "جير 30", nameEn: "GER30", symbol: "GER30", price: 17850.45, change: 85.30, changePercent: 0.48, market: "INDEX" },
  { id: "idx2", name: "اليابان 225", nameEn: "JAP225", symbol: "JAP225", price: 39500.00, change: 250.00, changePercent: 0.64, market: "INDEX" },
  { id: "idx3", name: "بريطانيا 100", nameEn: "UK100", symbol: "UK100", price: 7650.25, change: -12.45, changePercent: -0.16, market: "INDEX" },
  { id: "idx4", name: "يو إس 100", nameEn: "US100", symbol: "US100", price: 18250.60, change: 145.20, changePercent: 0.80, market: "INDEX" },
  { id: "idx5", name: "داو جونز", nameEn: "US30", symbol: "US30", price: 38950.00, change: 125.00, changePercent: 0.32, market: "INDEX" },
  { id: "idx6", name: "يو إس 500", nameEn: "US500", symbol: "US500", price: 5120.45, change: 25.30, changePercent: 0.50, market: "INDEX" },
  { id: "idx7", name: "فيكس", nameEn: "VIXRoll", symbol: "VIXRoll", price: 14.25, change: 0.15, changePercent: 1.06, market: "INDEX" },
  { id: "idx8", name: "هولندا 25", nameEn: "NL25Roll", symbol: "NL25Roll", price: 850.45, change: 2.30, changePercent: 0.27, market: "INDEX" },
  { id: "idx9", name: "النرويج 25", nameEn: "NORWAY25Roll", symbol: "NORWAY25Roll", price: 1250.60, change: -5.45, changePercent: -0.43, market: "INDEX" },
  { id: "idx10", name: "روسل 2000", nameEn: "RUSS2000", symbol: "RUSS2000", price: 2050.25, change: 12.45, changePercent: 0.61, market: "INDEX" },
  { id: "idx11", name: "أوروبا 50", nameEn: "EU50Roll", symbol: "EU50Roll", price: 4950.45, change: 15.30, changePercent: 0.31, market: "INDEX" },
  { id: "idx12", name: "فرنسا 40", nameEn: "FRA40Roll", symbol: "FRA40Roll", price: 7950.25, change: -2.45, changePercent: -0.03, market: "INDEX" },
  { id: "idx13", name: "أستراليا 200", nameEn: "AUS200Roll", symbol: "AUS200Roll", price: 7750.60, change: 18.20, changePercent: 0.24, market: "INDEX" },
  { id: "idx14", name: "الأسهم الصينية", nameEn: "CHshares", symbol: "CHshares", price: 5850.45, change: 45.30, changePercent: 0.78, market: "INDEX" },
  { id: "idx15", name: "سويسرا 20", nameEn: "SWISS20Roll", symbol: "SWISS20Roll", price: 11450.25, change: -12.45, changePercent: -0.11, market: "INDEX" },
  { id: "idx16", name: "الصين 50", nameEn: "CHINA50Roll", symbol: "CHINA50Roll", price: 12450.60, change: 85.20, changePercent: 0.69, market: "INDEX" },
  { id: "idx17", name: "إسبانيا 35", nameEn: "ESP35Roll", symbol: "ESP35Roll", price: 10150.45, change: 35.30, changePercent: 0.35, market: "INDEX" },
  { id: "idx18", name: "هونج كونج 50", nameEn: "HK50Roll", symbol: "HK50Roll", price: 16450.25, change: -145.45, changePercent: -0.88, market: "INDEX" },
];


// المؤشرات المتاحة
const indicators: Indicator[] = [
  { id: "phase", name: "حالة المرحلة", nameEn: "PHASE STATE", type: "tz", color: "#8b5cf6", icon: "Gauge" },
  { id: "displacement", name: "حالة الإزاحة", nameEn: "DISPLACEMENT STATE", type: "area", color: "#3b82f6", icon: "Move" },
  { id: "reference", name: "حالة المرجع", nameEn: "REFERENCE STATE", type: "line", color: "#10b981", icon: "Target" },
  { id: "oscillation", name: "حالة التذبذب", nameEn: "OSCILLATION STATE", type: "line", color: "#f59e0b", icon: "Activity" },
  { id: "direction", name: "حالة الاتجاه", nameEn: "DIRECTION STATE", type: "bar", color: "#ef4444", icon: "Navigation" },
];

const indicatorIcons: Record<string, any> = {
  Gauge,
  Move,
  Target,
  Activity,
  Navigation,
};

// دالة لتوليد بيانات وهمية للرسم البياني
const generateChartData = (asset: Asset, indicator: Indicator, timeframe: 5 | 15 | 30 | 60) => {
  const data = [];
  const baseValue = asset.price;

  // عدد النقاط بناءً على الفريم
  const dataPoints = timeframe === 5 ? 120 : timeframe === 15 ? 96 : timeframe === 30 ? 48 : 48;

  // توليد التاريخ والوقت
  const now = new Date();

  for (let i = dataPoints - 1; i >= 0; i--) {
    const timeInPast = new Date(now.getTime() - i * timeframe * 60 * 1000);
    const hours = timeInPast.getHours().toString().padStart(2, '0');
    const minutes = timeInPast.getMinutes().toString().padStart(2, '0');
    const day = timeInPast.getDate().toString().padStart(2, '0');
    const month = (timeInPast.getMonth() + 1).toString().padStart(2, '0');
    const year = timeInPast.getFullYear();

    // تنسيق العرض حسب الفريم - مثل MetaTrader
    let displayTime = '';
    let fullDate = '';

    if (timeframe === 5 || timeframe === 15) {
      // للفريمات الصغيرة: الوقت فقط، مع التاريخ عند بداية اليوم
      if (hours === '00' && minutes === '00') {
        displayTime = `${day}/${month}\n${hours}:${minutes}`;
      } else if (i === dataPoints - 1 || i === 0 || minutes === '00') {
        displayTime = `${hours}:${minutes}`;
      } else {
        displayTime = `${hours}:${minutes}`;
      }
      fullDate = `${day}/${month}/${year} ${hours}:${minutes}`;
    } else if (timeframe === 30) {
      // للفريم 30 دقيقة: التاريخ + الوقت
      if (hours === '00' && (minutes === '00' || minutes === '30')) {
        displayTime = `${day}/${month}\n${hours}:${minutes}`;
      } else {
        displayTime = `${hours}:${minutes}`;
      }
      fullDate = `${day}/${month}/${year} ${hours}:${minutes}`;
    } else {
      // للفريم 60 دقيقة: التاريخ عند بداية اليوم
      if (hours === '00') {
        displayTime = `${day}/${month}\n${hours}:00`;
      } else {
        displayTime = `${hours}:00`;
      }
      fullDate = `${day}/${month}/${year} ${hours}:00`;
    }

    let value;

    if (indicator.id === "phase") {
      // PHASE STATE - Candlestick data (TZ replacement)
      const trendBase = Math.sin(i / 20) * 50;
      const volatility = (Math.random() - 0.5) * 30;
      value = trendBase + volatility;
    } else if (indicator.id === "displacement") {
      // DISPLACEMENT STATE - Area chart showing displacement
      const displacement = Math.cos(i / 15) * (baseValue * 0.01);
      const trend = Math.sin(i / 25) * (baseValue * 0.005);
      value = baseValue + displacement + trend + (Math.random() - 0.5) * (baseValue * 0.003);
    } else if (indicator.id === "reference") {
      // REFERENCE STATE - Line chart showing reference levels
      const refLevel = baseValue + Math.sin(i / 30) * (baseValue * 0.008);
      value = refLevel + (Math.random() - 0.5) * (baseValue * 0.002);
    } else if (indicator.id === "oscillation") {
      // OSCILLATION STATE - Oscillator between -100 and +100
      const oscillation = Math.sin(i / 18) * 70;
      value = oscillation + (Math.random() - 0.5) * 20;
      value = Math.max(-100, Math.min(100, value));
    } else if (indicator.id === "direction") {
      // DIRECTION STATE - Bar chart showing directional strength
      const direction = Math.cos(i / 12) * 50;
      value = direction + (Math.random() - 0.5) * 25;
    } else if (indicator.id === "rsi") {
      // RSI بين 30 و 70 ع ذبذب واقعي
      const trend = Math.sin(i / 10) * 10;
      value = 50 + trend + (Math.random() - 0.5) * 15;
      value = Math.max(20, Math.min(80, value));
    } else if (indicator.id === "macd") {
      // MACD مع قيم موجبة وسالبة
      const trend = Math.cos(i / 8) * 1.5;
      value = trend + (Math.random() - 0.5) * 0.8;
    } else if (indicator.id === "stoch") {
      // Stochastic بين 0 و 100
      const trend = Math.sin(i / 12) * 30;
      value = 50 + trend + (Math.random() - 0.5) * 20;
      value = Math.max(0, Math.min(100, value));
    } else if (indicator.id === "tz") {
      // TZ Indicator - Trend Zone with histogram
      const trendBase = Math.sin(i / 20) * 50;
      const volatility = (Math.random() - 0.5) * 30;
      value = trendBase + volatility;
    } else {
      // للمؤشرات الأخرى (MA, EMA, BB)
      const volatility = timeframe === 5 ? 0.003 : timeframe === 15 ? 0.005 : timeframe === 30 ? 0.008 : 0.012;
      const trend = Math.sin(i / 15) * (baseValue * volatility * 2);
      const randomChange = (Math.random() - 0.5) * (baseValue * volatility);
      value = baseValue + trend + randomChange;
    }

    data.push({
      time: displayTime,
      fullTime: fullDate,
      timestamp: timeInPast.getTime(),
      value: parseFloat(value.toFixed(4)),
    });
  }

  return data;
};

export function TradingDashboard({ onLogout }: TradingDashboardProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isMarketListCollapsed, setIsMarketListCollapsed] = useState(false);
  const [isIndicatorsCollapsed, setIsIndicatorsCollapsed] = useState(false);
  const [timeframe, setTimeframe] = useState<5 | 15 | 30 | 60>(15); // الفريم الزمني بالدقائق

  // Multi-Timeframe للمؤشر TZ
  const [mtfEnabled, setMtfEnabled] = useState(false); // تفعيل Multi-Timeframe
  const [mtfSmallTimeframe, setMtfSmallTimeframe] = useState<5 | 15 | 30 | 60>(5); // الفريم الصغير
  const [mtfLargeTimeframe, setMtfLargeTimeframe] = useState<240 | 720 | 1440>(240); // الفريم الكبير (4H, 12H, 1D)

  // بيانات الاشتراك (يمكن استبدالها ببيانات من API)
  const subscriptionInfo = {
    isActive: true,
    daysRemaining: 3,
  };

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    if (selectedIndicator) {
      setChartData(generateChartData(asset, selectedIndicator, timeframe));
    }
  };

  const handleIndicatorSelect = (indicator: Indicator) => {
    setSelectedIndicator(indicator);
    if (selectedAsset) {
      setChartData(generateChartData(selectedAsset, indicator, timeframe));
    }
  };

  const handleTimeframeChange = (newTimeframe: 5 | 15 | 30 | 60) => {
    setTimeframe(newTimeframe);
    if (selectedAsset && selectedIndicator) {
      setChartData(generateChartData(selectedAsset, selectedIndicator, newTimeframe));
    }
  };

  const isDark = theme === "dark";
  const isRTL = language === "ar";

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-950" : "bg-slate-50"} transition-colors duration-200`} dir={isRTL ? "rtl" : "ltr"}>
      {/* شريط العلوي */}
      <header className={`${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"} border-b sticky top-0 z-10 shadow-sm`}>
        <div className="px-6 py-4 flex items-center justify-between">
          {/* اللوقو - على اليمين */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Logo size="md" showText={true} animated={true} />
          </motion.div>

          {/* الأزرار - ع��ى اليسار */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Button
              variant="outline"
              onClick={onLogout}
              className={`gap-2 ${isDark ? "border-gray-700 hover:bg-gray-800 text-gray-300" : ""}`}
            >
              <LogOut className="w-4 h-4" />
              {t("logout")}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className={`${isDark ? "border-gray-700 hover:bg-gray-800" : ""}`}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </motion.div>
            </Button>

            {/* زر تبديل اللغة */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleLanguage}
              className={`${isDark ? "border-gray-700 hover:bg-gray-800" : ""}`}
            >
              <motion.div
                animate={{ rotate: isRTL ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <Languages className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-slate-700"}`} />
              </motion.div>
            </Button>

            {/* زر الاشتراك */}
            <Button
              variant="outline"
              onClick={() => setIsSubscriptionOpen(true)}
              className={`gap-2 ${subscriptionInfo.daysRemaining <= 7
                  ? "border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                  : isDark
                    ? "border-gray-700 hover:bg-gray-800"
                    : ""
                }`}
            >
              <motion.div
                animate={subscriptionInfo.daysRemaining <= 7 ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className={`w-4 h-4 ${subscriptionInfo.daysRemaining <= 7 ? "text-amber-500" : ""}`} />
              </motion.div>
              <span>{t("subscription")}</span>
              {subscriptionInfo.daysRemaining <= 7 && (
                <Badge variant="destructive" className="text-xs px-1.5">
                  {subscriptionInfo.daysRemaining} {t("daysRemaining")}
                </Badge>
              )}
            </Button>
          </motion.div>
        </div>
      </header>

      <div className="p-6">
        <div className="flex gap-4">
          {/* القائمة الجانبية - الأسواق */}
          <motion.div
            initial={false}
            animate={{
              width: isMarketListCollapsed ? "70px" : "320px",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-shrink-0"
          >
            <MarketList
              assets={mockAssets}
              selectedAsset={selectedAsset}
              onSelectAsset={handleAssetSelect}
              isCollapsed={isMarketListCollapsed}
              onToggleCollapse={() => setIsMarketListCollapsed(!isMarketListCollapsed)}
            />
          </motion.div>

          {/* المحتوى الرئيسي */}
          <div className="flex-1 space-y-6 min-w-0">
            {/* المؤشرات */}
            <motion.div
              initial={false}
              animate={{
                height: isIndicatorsCollapsed ? "80px" : "auto",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <Card className={`${isDark ? "bg-gray-900 border-gray-700" : "bg-white"} shadow-lg border-2`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className={`flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg shadow-lg">
                        <ChartCandlestick className="w-5 h-5 text-white" />
                      </div>
                      {!isIndicatorsCollapsed && t("technicalIndicators")}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsIndicatorsCollapsed(!isIndicatorsCollapsed)}
                      className={`${isDark ? "hover:bg-gray-800" : ""}`}
                    >
                      {isIndicatorsCollapsed ? (
                        <ChevronsRight className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"} rotate-90`} />
                      ) : (
                        <ChevronsLeft className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"} rotate-90`} />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {!isIndicatorsCollapsed && (
                  <CardContent>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {indicators.map((indicator) => {
                        const Icon = indicatorIcons[indicator.icon];
                        const isActive = selectedIndicator?.id === indicator.id;

                        return (
                          <motion.button
                            key={indicator.id}
                            onClick={() => handleIndicatorSelect(indicator)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-2 rounded-lg border transition-all text-center shadow-sm hover:shadow-md ${isActive
                                ? isDark
                                  ? "border-indigo-500 bg-indigo-950/30 shadow-lg shadow-indigo-500/20"
                                  : "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/20"
                                : isDark
                                  ? "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                                  : "border-gray-200 hover:border-indigo-300"
                              }`}
                          >
                            <div
                              className={`w-8 h-8 mx-auto mb-1.5 rounded-lg flex items-center justify-center transition-all ${isActive
                                  ? "bg-gradient-to-br shadow-md"
                                  : isDark
                                    ? "bg-gray-700"
                                    : "bg-gray-100"
                                }`}
                              style={
                                isActive
                                  ? {
                                    backgroundImage: `linear-gradient(135deg, ${indicator.color}, ${indicator.color}dd)`,
                                  }
                                  : {}
                              }
                            >
                              <Icon
                                className={`w-4 h-4 ${isActive
                                    ? "text-white"
                                    : isDark
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                  }`}
                              />
                            </div>
                            <div
                              className={`w-2 h-2 rounded-full mx-auto mb-1 ${isActive ? "animate-pulse" : ""}`}
                              style={{ backgroundColor: indicator.color }}
                            />
                            <div className={`font-semibold text-[10px] leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                              {isRTL ? indicator.name : indicator.nameEn}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* الرسم البياني */}
            <AnimatePresence mode="wait">
              <IndicatorChart
                key={`${selectedAsset?.id}-${selectedIndicator?.id}-${timeframe}`}
                currency={selectedAsset}
                indicator={selectedIndicator}
                data={chartData}
                timeframe={timeframe}
                onTimeframeChange={handleTimeframeChange}
                mtfEnabled={mtfEnabled}
                mtfSmallTimeframe={mtfSmallTimeframe}
                mtfLargeTimeframe={mtfLargeTimeframe}
                onMtfEnabledChange={setMtfEnabled}
                onMtfSmallTimeframeChange={setMtfSmallTimeframe}
                onMtfLargeTimeframeChange={setMtfLargeTimeframe}
              />
            </AnimatePresence>
          </div>

          {/* مساحة الإعلانات */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="w-80 flex-shrink-0 hidden xl:block"
          >
            <AdSpace />
          </motion.div>
        </div>
      </div>

      {/* نافذة الاشتراك */}
      <SubscriptionPanel isOpen={isSubscriptionOpen} onClose={() => setIsSubscriptionOpen(false)} />
    </div>
  );
}