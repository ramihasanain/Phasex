import { useState, useRef, useCallback } from "react";
import { MarketList, Asset } from "./MarketList";
import { IndicatorChart, Indicator } from "./IndicatorChart";
import { SubscriptionPanel } from "./SubscriptionPanel";
import { AdSpace } from "./AdSpace";
import { TradingSignalsTable } from "./TradingSignalsTable";
import {
  LogOut,
  Gauge,
  Crown,
  Languages,
  Move,
  Target,
  Activity,
  Navigation,
  Upload,
  CheckCircle,
  FileJson,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { motion, AnimatePresence } from "motion/react";

/* ─── Types ─── */
interface TradingDashboardProps {
  onLogout: () => void;
}

/* ─── Mock Data ─── */
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
  { id: "cmd2", name: "نفط خام", nameEn: "WTI", symbol: "WTI", price: 78.15, change: 0.85, changePercent: 1.10, market: "COMMODITY" },
  { id: "cmd3", name: "نفط أمريكي", nameEn: "US Oil", symbol: "USOIL", price: 77.82, change: 0.65, changePercent: 0.84, market: "COMMODITY" },
  // METALS
  { id: "mtl1", name: "ذهب", nameEn: "Gold", symbol: "GOLD", price: 2045.60, change: 12.30, changePercent: 0.61, market: "METALS" },
  { id: "mtl2", name: "فضة", nameEn: "Silver", symbol: "SILVER", price: 22.85, change: -0.25, changePercent: -1.08, market: "METALS" },
  { id: "mtl3", name: "ذهب/دولار", nameEn: "Gold/USD", symbol: "XAUUSD", price: 2048.25, change: 15.40, changePercent: 0.76, market: "METALS" },
  { id: "mtl4", name: "فضة/دولار", nameEn: "Silver/USD", symbol: "XAGUSD", price: 23.15, change: 0.35, changePercent: 1.54, market: "METALS" },
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

/* ─── Indicators ─── */
const indicators: Indicator[] = [
  { id: "phase", name: "حالة المرحلة", nameEn: "PHASE STATE", type: "tz", color: "#a78bfa", icon: "Gauge" },
  { id: "displacement", name: "حالة الإزاحة", nameEn: "DISPLACEMENT STATE", type: "tz", color: "#60a5fa", icon: "Move" },
  { id: "reference", name: "حالة المرجع", nameEn: "REFERENCE STATE", type: "tz", color: "#34d399", icon: "Target" },
  { id: "oscillation", name: "حالة التذبذب", nameEn: "OSCILLATION STATE", type: "tz", color: "#fbbf24", icon: "Activity" },
  { id: "direction", name: "حالة الاتجاه", nameEn: "DIRECTION STATE", type: "tz", color: "#f87171", icon: "Navigation" },
];
const indicatorIcons: Record<string, any> = { Gauge, Move, Target, Activity, Navigation };

/* ─── Chart Data Generator ─── */
function generateChartData(asset: Asset, indicator: Indicator, timeframe: 5 | 15 | 30 | 60) {
  const data = [];
  const base = asset.price;
  const points = timeframe === 5 ? 120 : timeframe === 15 ? 96 : 48;
  const now = new Date();
  for (let i = points - 1; i >= 0; i--) {
    const t = new Date(now.getTime() - i * timeframe * 60000);
    const hh = t.getHours().toString().padStart(2, "0");
    const mm = t.getMinutes().toString().padStart(2, "0");
    const dd = t.getDate().toString().padStart(2, "0");
    const mo = (t.getMonth() + 1).toString().padStart(2, "0");
    const yr = t.getFullYear();
    const isNewDay = hh === "00" && mm === "00";
    const displayTime = isNewDay ? `${dd}/${mo}\n${hh}:${mm}` : `${hh}:${mm}`;
    const fullDate = `${dd}/${mo}/${yr} ${hh}:${mm}`;
    let value: number;
    switch (indicator.id) {
      case "phase": value = Math.sin(i / 20) * 50 + (Math.random() - 0.5) * 30; break;
      case "displacement": value = base + Math.cos(i / 15) * base * 0.01 + Math.sin(i / 25) * base * 0.005 + (Math.random() - 0.5) * base * 0.003; break;
      case "reference": value = base + Math.sin(i / 30) * base * 0.008 + (Math.random() - 0.5) * base * 0.002; break;
      case "oscillation": value = Math.max(-100, Math.min(100, Math.sin(i / 18) * 70 + (Math.random() - 0.5) * 20)); break;
      case "direction": value = Math.cos(i / 12) * 50 + (Math.random() - 0.5) * 25; break;
      default: { const v = timeframe === 5 ? 0.003 : timeframe === 15 ? 0.005 : 0.008; value = base + Math.sin(i / 15) * base * v * 2 + (Math.random() - 0.5) * base * v; }
    }
    data.push({ time: displayTime, fullTime: fullDate, timestamp: t.getTime(), value: +value.toFixed(4) });
  }
  return data;
}

/* ══════════════════════════════════════════════════════════════ */
/*  TRADING DASHBOARD                                            */
/* ══════════════════════════════════════════════════════════════ */

/* ─── Phase State Data Types ─── */
export interface PhaseCandle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  bars: number;
  tf_main: string;
  tf_candle: string;
}

// Map: "mainTF_subTF" -> { "SYMBOL": PhaseCandle }
export type PhaseStateDataMap = Record<string, Record<string, PhaseCandle>>;

/* ─── Generate 30 candles from a real candle ─── */
function generateCandlesFromReal(real: PhaseCandle, count: number = 90): any[] {
  const range = real.high - real.low;
  const volatility = range * 0.6;
  const candles: any[] = [];

  // Parse the real candle time
  const timeParts = real.time.replace(".", "-").replace(".", "-");
  const baseTime = new Date(timeParts.replace(" ", "T") + ":00");

  // Determine interval in minutes from tf_candle
  const tfMap: Record<string, number> = {
    "M5": 5, "M10": 10, "M15": 15, "M20": 20, "M30": 30,
    "H1": 60, "H2": 120, "H3": 180, "H4": 240, "H6": 360,
  };
  const intervalMin = tfMap[real.tf_candle] || 15;

  // ── FIRST bar: the REAL candle from JSON ──
  const rHH = baseTime.getHours().toString().padStart(2, "0");
  const rMM = baseTime.getMinutes().toString().padStart(2, "0");
  const rDD = baseTime.getDate().toString().padStart(2, "0");
  const rMO = (baseTime.getMonth() + 1).toString().padStart(2, "0");
  const rYR = baseTime.getFullYear();
  candles.push({
    time: `${rDD}/${rMO}\n${rHH}:${rMM}`,
    fullTime: `${rDD}/${rMO}/${rYR} ${rHH}:${rMM}`,
    timestamp: baseTime.getTime(),
    open: real.open,
    high: real.high,
    low: real.low,
    close: real.close,
    value: real.close,
    isReal: true,
  });

  // ── Remaining bars: random candles AFTER the real one ──
  let prevClose = real.close;

  for (let i = 1; i <= count; i++) {
    const t = new Date(baseTime.getTime() + i * intervalMin * 60000);
    const hh = t.getHours().toString().padStart(2, "0");
    const mm = t.getMinutes().toString().padStart(2, "0");
    const dd = t.getDate().toString().padStart(2, "0");
    const mo = (t.getMonth() + 1).toString().padStart(2, "0");
    const yr = t.getFullYear();
    const isNewDay = hh === "00" && mm === "00";

    const open = prevClose;
    const bodySize = (Math.random() - 0.5) * volatility * 0.4;
    const close = open + bodySize;
    const wickUp = Math.random() * volatility * 0.2;
    const wickDown = Math.random() * volatility * 0.2;
    const high = Math.max(open, close) + wickUp;
    const low = Math.min(open, close) - wickDown;

    candles.push({
      time: isNewDay ? `${dd}/${mo}\n${hh}:${mm}` : `${hh}:${mm}`,
      fullTime: `${dd}/${mo}/${yr} ${hh}:${mm}`,
      timestamp: t.getTime(),
      open: +open.toFixed(6),
      high: +high.toFixed(6),
      low: +low.toFixed(6),
      close: +close.toFixed(6),
      value: +close.toFixed(6),
    });

    prevClose = close + (Math.random() - 0.5) * volatility * 0.08;
  }

  return candles;
}

export function TradingDashboard({ onLogout }: TradingDashboardProps) {
  const { language, toggleLanguage, t } = useLanguage();
  const isRTL = language === "ar";

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isMarketListCollapsed, setIsMarketListCollapsed] = useState(false);
  const [timeframe, setTimeframe] = useState<5 | 15 | 30 | 60>(15);
  const [mtfEnabled, setMtfEnabled] = useState(false);
  const [mtfSmallTimeframe, setMtfSmallTimeframe] = useState<5 | 15 | 30 | 60>(5);
  const [mtfLargeTimeframe, setMtfLargeTimeframe] = useState<240 | 720 | 1440>(240);

  // Phase State uploaded data
  const [phaseStateData, setPhaseStateData] = useState<PhaseStateDataMap>({});
  const [uploadedFileCount, setUploadedFileCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subInfo = { isActive: true, daysRemaining: 3 };

  /* ─── File Upload Handler ─── */
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);

    const newData: PhaseStateDataMap = { ...phaseStateData };
    let count = 0;

    for (const file of Array.from(files)) {
      try {
        const text = await file.text();
        const json = JSON.parse(text);

        // Extract mainTF and subTF from filename: phasestate_H1_M5_results.json
        const match = file.name.match(/phasestate_([A-Z0-9]+)_([A-Z0-9]+)_results/);
        if (!match) continue;
        const [, mainTF, subTF] = match;
        const key = `${mainTF}_${subTF}`;

        if (!newData[key]) newData[key] = {};

        // Parse each symbol in the JSON
        for (const [symbolKey, phaseObj] of Object.entries(json)) {
          if (symbolKey === "exported_at") continue;

          // symbolKey = "AUDCAD - FOREX" -> symbol = "AUDCAD"
          const symbol = symbolKey.split(" - ")[0].trim();
          const phaseKey = Object.keys(phaseObj as object)[0];
          const candle = (phaseObj as any)[phaseKey] as PhaseCandle;

          if (candle && candle.open !== undefined) {
            newData[key][symbol] = candle;
            count++;
          }
        }
      } catch (err) {
        console.error(`Error parsing ${file.name}:`, err);
      }
    }

    setPhaseStateData(newData);
    setUploadedFileCount((prev) => prev + Array.from(files).length);
    setIsUploading(false);

    // Reset input so same files can be re-uploaded
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [phaseStateData]);

  /* ─── Data Generation ─── */
  const pickAsset = (a: Asset) => { setSelectedAsset(a); if (selectedIndicator) setChartData(generateChartData(a, selectedIndicator, timeframe)); };
  const pickIndicator = (ind: Indicator) => { setSelectedIndicator(ind); if (selectedAsset) setChartData(generateChartData(selectedAsset, ind, timeframe)); };
  const pickTimeframe = (tf: 5 | 15 | 30 | 60) => { setTimeframe(tf); if (selectedAsset && selectedIndicator) setChartData(generateChartData(selectedAsset, selectedIndicator, tf)); };

  return (
    <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"} style={{ background: "#0b0e14", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ═══════════════ HEADER ═══════════════ */}
      <header style={{ background: "linear-gradient(180deg, #12161f 0%, #0d1017 100%)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center justify-between px-5 py-2.5">
          {/* Logo */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <div style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", padding: "6px 18px", borderRadius: 10 }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 16, letterSpacing: 2 }}>PHASE X</span>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Upload Phase State Data */}
            <input ref={fileInputRef} type="file" accept=".json" multiple onChange={handleFileUpload}
              className="hidden" id="phase-upload" />
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium cursor-pointer"
              style={{
                color: uploadedFileCount > 0 ? "#4ade80" : "#818cf8",
                background: uploadedFileCount > 0 ? "rgba(74,222,128,0.08)" : "rgba(99,102,241,0.08)",
                border: uploadedFileCount > 0 ? "1px solid rgba(74,222,128,0.15)" : "1px solid rgba(99,102,241,0.15)",
              }}>
              {isUploading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Upload className="w-3.5 h-3.5" />
                </motion.div>
              ) : uploadedFileCount > 0 ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                <FileJson className="w-3.5 h-3.5" />
              )}
              <span>
                {isUploading
                  ? (isRTL ? "جاري التحميل..." : "Uploading...")
                  : uploadedFileCount > 0
                    ? `${uploadedFileCount} ${isRTL ? "ملف" : "files"}`
                    : (isRTL ? "رفع بيانات" : "Upload Data")}
              </span>
            </motion.button>

            <motion.button onClick={onLogout} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium cursor-pointer"
              style={{ color: "#94a3b8", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <LogOut className="w-3.5 h-3.5" /> {t("logout")}
            </motion.button>

            <motion.button onClick={toggleLanguage} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }}
              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
              style={{ color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <Languages className="w-3.5 h-3.5" />
            </motion.button>

            <motion.button onClick={() => setIsSubscriptionOpen(true)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold cursor-pointer"
              style={{ color: "#fbbf24", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.15)" }}>
              <Crown className="w-3.5 h-3.5" />
              <span>{t("subscription")}</span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md" style={{ background: "rgba(251,191,36,0.15)" }}>
                {subInfo.daysRemaining} {t("daysRemaining")}
              </span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* ═══════════════ BODY ═══════════════ */}
      <div className="flex gap-0 py-3" style={{ minHeight: "calc(100vh - 52px)" }}>

        {/* ── LEFT: Market List ── */}
        <motion.div initial={false} animate={{ width: isMarketListCollapsed ? 64 : 280 }}
          transition={{ type: "spring", damping: 26, stiffness: 220 }} className="flex-shrink-0 sticky top-0 self-start" style={{ height: "calc(100vh - 64px)" }}>
          <MarketList assets={mockAssets} selectedAsset={selectedAsset} onSelectAsset={pickAsset}
            isCollapsed={isMarketListCollapsed} onToggleCollapse={() => setIsMarketListCollapsed(!isMarketListCollapsed)} />
        </motion.div>

        {/* ── CENTER: Indicators + Chart + Signals ── */}
        <div className="flex-1 flex flex-col gap-3 min-w-0 px-0">

          {/* Indicator Ribbon */}
          <div className="rounded-xl overflow-hidden" style={{ background: "#111520", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-1 p-2">
              {indicators.map((ind) => {
                const Icon = indicatorIcons[ind.icon];
                const active = selectedIndicator?.id === ind.id;
                return (
                  <motion.button key={ind.id} onClick={() => pickIndicator(ind)}
                    whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                    className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg cursor-pointer transition-all"
                    style={{
                      background: active ? `${ind.color}10` : "transparent",
                      border: active ? `1px solid ${ind.color}30` : "1px solid transparent",
                    }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                      background: active ? `linear-gradient(135deg, ${ind.color}, ${ind.color}88)` : "rgba(255,255,255,0.03)",
                      boxShadow: active ? `0 4px 20px ${ind.color}25` : "none",
                    }}>
                      <Icon className="w-5 h-5" style={{ color: active ? "#fff" : "#555" }} />
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: ind.color, opacity: active ? 1 : 0.25 }} />
                    <span className="text-[10px] font-bold leading-tight text-center" style={{ color: active ? ind.color : "#6b7280" }}>
                      {isRTL ? ind.name : ind.nameEn}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Chart */}
          <div className="flex-shrink-0" style={{ minHeight: "420px", height: "calc(100vh - 280px)" }}>
            <AnimatePresence mode="wait">
              <IndicatorChart
                key={`${selectedAsset?.id}-${selectedIndicator?.id}-${timeframe}`}
                currency={selectedAsset} indicator={selectedIndicator} data={chartData}
                timeframe={timeframe} onTimeframeChange={pickTimeframe}
                mtfEnabled={mtfEnabled} mtfSmallTimeframe={mtfSmallTimeframe} mtfLargeTimeframe={mtfLargeTimeframe}
                onMtfEnabledChange={setMtfEnabled} onMtfSmallTimeframeChange={setMtfSmallTimeframe} onMtfLargeTimeframeChange={setMtfLargeTimeframe}
                phaseStateData={phaseStateData}
                generateCandlesFromReal={generateCandlesFromReal}
              />
            </AnimatePresence>
          </div>

          {/* ═══ SIGNALS TABLE (same width as chart) ═══ */}
          <TradingSignalsTable />
        </div>

        {/* ── RIGHT: Ads ── */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="w-72 flex-shrink-0 hidden xl:block sticky top-0 self-start" style={{ height: "calc(100vh - 64px)" }}>
          <AdSpace />
        </motion.div>
      </div>

      <SubscriptionPanel isOpen={isSubscriptionOpen} onClose={() => setIsSubscriptionOpen(false)} />
    </div>
  );
}