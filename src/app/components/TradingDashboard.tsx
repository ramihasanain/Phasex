import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { MarketList, Asset } from "./MarketList";
import { IndicatorChart, Indicator } from "./IndicatorChart";
import { SubscriptionPanel } from "./SubscriptionPanel";
import { AdSpace } from "./AdSpace";
import { TradingSignalsTable } from "./TradingSignalsTable";
import {
  LineChart, Activity, LogOut, Search, Star,
  TrendingUp, TrendingDown, Sun, Moon, Map, User, KeySquare, MonitorDot, AlertTriangle, ArrowRight, X, Maximize2, Minimize2,
  Calendar, Layers, Filter, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Lock, ShieldAlert, Cpu, Crown, Clock, Flame, BarChart3, RadioTower, Languages,
  Gauge, Move, Target, Navigation, Network
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { useLivePrices } from "../hooks/useLivePrices";
import { useThemeTokens } from "../hooks/useThemeTokens";
import { useTheme } from "../contexts/ThemeContext";
import { useMarketsAPI } from "../hooks/useMarketsAPI";
import { usePhaseStateAPI } from "../hooks/usePhaseStateAPI";
import { useDirectionStateAPI } from "../hooks/useDirectionStateAPI";
import { useEnvelopStateAPI } from "../hooks/useEnvelopStateAPI";
import { useOscillationStateAPI } from "../hooks/useOscillationStateAPI";
import { useDisplacementStateAPI } from "../hooks/useDisplacementStateAPI";
import { useReferenceStateAPI } from "../hooks/useReferenceStateAPI";
import { BreakingNews } from "./BreakingNews";
import { AIChatBot } from "./AIChatBot";
import { AITradeSignalWidget } from "./AITradeSignalWidget";
import { UserProfile } from "./UserProfile";
import { useAuth } from "../contexts/AuthContext";
import { Bot, Sparkles } from "lucide-react";

/* ─── Types ─── */
interface TradingDashboardProps {
  onLogout: () => void;
  onOpenDynamics: () => void;
}

/* ─── Assets from API ─── */

/* ─── Indicators ─── */
const indicators: Indicator[] = [
  { id: "phase", name: "حالة المرحلة", nameEn: "PHASE STATE", type: "tz", color: "#a78bfa", icon: "Gauge" },
  { id: "displacement", name: "حالة الإزاحة", nameEn: "DISPLACEMENT STATE", type: "tz", color: "#60a5fa", icon: "Move" },
  { id: "reference", name: "حالة المرجع", nameEn: "REFERENCE STATE", type: "tz", color: "#34d399", icon: "Target" },
  { id: "oscillation", name: "حالة التذبذب", nameEn: "OSCILLATION STATE", type: "tz", color: "#fbbf24", icon: "Activity" },
  { id: "direction", name: "حالة الاتجاه", nameEn: "DIRECTION STATE", type: "tz", color: "#f87171", icon: "Navigation" },
  { id: "envelop", name: "حالة الغلاف", nameEn: "ENVELOP STATE", type: "tz", color: "#f472b6", icon: "Layers" },
  { id: "momentum", name: "حالة الزخم", nameEn: "MOMENTUM STATE", type: "tz", color: "#fb923c", icon: "Gauge", locked: true, lockType: "coming_soon" },
  { id: "volatility", name: "حالة التقلب", nameEn: "VOLATILITY STATE", type: "tz", color: "#38bdf8", icon: "Activity", locked: true, lockType: "upgrade" },
];
const indicatorIcons: Record<string, any> = { Gauge, Move, Target, Activity, Navigation, Layers, Lock };

/* ─── Chart Data Generator ─── */
function generateChartData(asset: Asset, indicator: Indicator, timeframe: number) {
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
      case "envelop": value = Math.sin(i / 10) * 40 + (Math.random() - 0.5) * 15; break;
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

export function TradingDashboard({ onLogout, onOpenDynamics }: TradingDashboardProps) {
  const [chartLayout, setChartLayout] = useState<"single" | "split" | "quad">("single");
  const { toggleTheme } = useTheme();
  const tk = useThemeTokens();
  const { subscriptionStatus, subscriptionPlan } = useAuth();
  const { language, setLanguageKey, t } = useLanguage();
  const isRTL = language === "ar";
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);

  // Close language dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languageOptions = [
    { code: "ar", label: "العربية", flagUrl: "sa" },
    { code: "en", label: "English", flagUrl: "gb" },
    { code: "ru", label: "Русский", flagUrl: "ru" },
    { code: "tr", label: "Türkçe", flagUrl: "tr" },
    { code: "fr", label: "Français", flagUrl: "fr" },
    { code: "es", label: "Español", flagUrl: "es" }
  ];

  const currentLangObj = languageOptions.find(l => l.code === language) || languageOptions[1];

  // Markets + Symbols API (two-step: markets on load, symbols on tab change)
  const {
    markets: apiMarkets,
    marketsLoading,
    selectedMarket,
    setSelectedMarket,
    filteredAssets,
    symbolsLoading,
  } = useMarketsAPI();

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [liveChartData, setLiveChartData] = useState<any[]>([]);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMarketListCollapsed, setIsMarketListCollapsed] = useState(false);
  const [timeframe, setTimeframe] = useState<number>(15);
  const [mtfEnabled, setMtfEnabled] = useState(false);
  const [mtfSmallTimeframe, setMtfSmallTimeframe] = useState<number>(5);
  const [mtfLargeTimeframe, setMtfLargeTimeframe] = useState<number>(240);
  const hasOpenedModalRef = useRef(false);

  useEffect(() => {
    if (subscriptionStatus === 'none' && !hasOpenedModalRef.current) {
        setIsSubscriptionOpen(true);
        hasOpenedModalRef.current = true;
    }
  }, [subscriptionStatus]);

  const subInfo = { isActive: subscriptionStatus === 'active', daysRemaining: subscriptionStatus === 'active' ? 14 : 0 };

  // Live WebSocket prices
  const { prices: livePrices, initialPrices, connected: wsConnected } = useLivePrices();

  // WebSocket symbol aliases: WS name → API symbol code
  const WS_ALIASES: Record<string, string> = {
    "GOLD": "XAUUSD",
    "SILVER": "XAGUSD",
    "UKOIL": "UKOILRoll",
    "USOIL": "USOILRoll",
    "BRENT": "UKOILRoll",
    "WTI": "USOILRoll",
    "UK100": "UK100Roll",
    "US30": "US30Roll",
    "US500": "US500Roll",
    "US100": "UT100Roll",
    "UT100": "UT100Roll",
  };
  // Reverse map: API symbol → all possible WS names
  const API_TO_WS: Record<string, string[]> = {};
  for (const [ws, api] of Object.entries(WS_ALIASES)) {
    if (!API_TO_WS[api]) API_TO_WS[api] = [];
    API_TO_WS[api].push(ws);
  }

  // Merge live prices into filtered assets from API
  const liveAssets = useMemo(() => {
    return filteredAssets.map((asset) => {
      // Try: exact symbol → .p suffix → all WS aliases
      const aliases = API_TO_WS[asset.symbol] || [];
      let live = livePrices[asset.symbol]
        || livePrices[asset.symbol + ".p"]
        || undefined;
      let matchedKey = livePrices[asset.symbol] ? asset.symbol
        : livePrices[asset.symbol + ".p"] ? asset.symbol + ".p"
          : "";

      if (!live) {
        for (const alias of aliases) {
          if (livePrices[alias]) {
            live = livePrices[alias];
            matchedKey = alias;
            break;
          }
        }
      }

      if (!live) return asset;

      const livePrice = (live.bid + live.ask) / 2;
      const basePrice = initialPrices[matchedKey] || livePrice;
      const change = livePrice - basePrice;
      const changePercent = basePrice !== 0 ? (change / basePrice) * 100 : 0;
      const priceDec = livePrice < 10 ? 4 : livePrice < 1000 ? 2 : 2;
      return {
        ...asset,
        price: +livePrice.toFixed(priceDec),
        change: +change.toFixed(livePrice < 10 ? 4 : 2),
        changePercent: +changePercent.toFixed(2),
      };
    });
  }, [filteredAssets, livePrices, initialPrices]);

  /* ─── Data Generation ─── */
  const pickAsset = (a: Asset) => { setSelectedAsset(a); if (selectedIndicator) setChartData(generateChartData(a, selectedIndicator, timeframe)); };
  const pickIndicator = (ind: Indicator) => { setSelectedIndicator(ind); if (selectedAsset) setChartData(generateChartData(selectedAsset, ind, timeframe)); };
  const pickTimeframe = (tf: number) => { setTimeframe(tf); if (selectedAsset && selectedIndicator) setChartData(generateChartData(selectedAsset, selectedIndicator, tf)); };

  // Keep selectedAsset in sync with live prices
  const liveSelectedAsset = useMemo(() => {
    if (!selectedAsset) return null;
    return liveAssets.find((a) => a.id === selectedAsset.id) || selectedAsset;
  }, [selectedAsset, liveAssets]);

  // Default selections: Gold (XAUUSD) + Phase State
  useEffect(() => {
    if (!selectedIndicator) {
      const phaseInd = indicators.find((i) => i.id === "phase");
      if (phaseInd) setSelectedIndicator(phaseInd);
    }
  }, [selectedIndicator]);

  useEffect(() => {
    // Wait for the complete symbol list to load so that we definitely find Gold
    if (!selectedAsset && liveAssets && liveAssets.length > 0 && !symbolsLoading) {
      const gold = liveAssets.find((a) => a.symbol === "XAUUSD" || a.id === "GOLD") || liveAssets[0];
      if (gold) {
        setSelectedAsset(gold);
        const ind = selectedIndicator || indicators.find((i) => i.id === "phase");
        if (ind) setChartData(generateChartData(gold, ind, timeframe));
      }
    }
  }, [selectedAsset, liveAssets, selectedIndicator, timeframe, symbolsLoading]);

  // Fetch Live State API data for the AI context
  const formatTfStr = (tf: number) => tf >= 1440 ? `D${tf / 1440}` : tf >= 60 ? `H${tf / 60}` : `M${tf}`;
  const aiTf1 = mtfEnabled ? formatTfStr(mtfLargeTimeframe) : formatTfStr(timeframe >= 60 ? timeframe : 60);
  const aiTf2 = mtfEnabled ? formatTfStr(mtfSmallTimeframe) : formatTfStr(timeframe);

  const { candles: phaseCandles } = usePhaseStateAPI(selectedAsset?.symbol, aiTf1, aiTf2, true);
  const { candles: dirCandles } = useDirectionStateAPI(selectedAsset?.symbol, mtfEnabled ? mtfSmallTimeframe : timeframe, true);
  const { candles: oscCandles } = useOscillationStateAPI(selectedAsset?.symbol, mtfEnabled ? mtfSmallTimeframe : timeframe, true);
  const { candles: dispCandles } = useDisplacementStateAPI(selectedAsset?.symbol, mtfEnabled ? mtfSmallTimeframe : timeframe, true);
  const { candles: refCandles } = useReferenceStateAPI(selectedAsset?.symbol, mtfEnabled ? mtfSmallTimeframe : timeframe, true);
  const { candles: envCandles } = useEnvelopStateAPI(selectedAsset?.symbol, mtfEnabled ? mtfSmallTimeframe : timeframe, true);

  // Generate dynamic market context for the AI
  const aiMarketContext = useMemo(() => {
    if (!selectedAsset) return "No asset selected.";
    const liveMatch = liveAssets.find(a => a.id === selectedAsset.id);
    const p = liveMatch ? liveMatch.price : selectedAsset.price;
    const c = liveMatch ? liveMatch.changePercent : selectedAsset.changePercent;
    
    // Get the latest reading from each state indicator
    const currentPhase = phaseCandles.length > 0 ? phaseCandles[phaseCandles.length - 1].value : 'No Data';
    const currentDir = dirCandles.length > 0 ? dirCandles[dirCandles.length - 1].value : 'No Data';
    const currentOsc = oscCandles.length > 0 ? oscCandles[oscCandles.length - 1].value : 'No Data';
    const currentDisp = dispCandles.length > 0 ? dispCandles[dispCandles.length - 1].value : 'No Data';
    const currentRef = refCandles.length > 0 ? refCandles[refCandles.length - 1].value : 'No Data';
    const currentEnv = envCandles.length > 0 ? envCandles[envCandles.length - 1].value : 'No Data';

    const activeTfStr = mtfEnabled ? `${formatTfStr(mtfLargeTimeframe)} -> ${formatTfStr(mtfSmallTimeframe)} (MTF)` : formatTfStr(timeframe);

    // Extract recent OHLC data from the live chart table (last 15 candles)
    const renderData = liveChartData.length > 0 ? liveChartData : chartData;
    const recentCandles = renderData.slice(-100).map(c => {
      const oStr = c.open !== undefined ? c.open.toFixed(4) : (c.value ? c.value.toFixed(4) : "N/A");
      const hStr = c.high !== undefined ? c.high.toFixed(4) : (c.value ? c.value.toFixed(4) : "N/A");
      const lStr = c.low !== undefined ? c.low.toFixed(4) : (c.value ? c.value.toFixed(4) : "N/A");
      const cStr = c.close !== undefined ? c.close.toFixed(4) : (c.value ? c.value.toFixed(4) : "N/A");
      const timeStr = (c.fullTime || c.time || "").replace(/\n/g, ' ');
      return `[${timeStr}] O: ${oStr}, H: ${hStr}, L: ${lStr}, C: ${cStr}`;
    }).join('\n    ');

    return `
    Asset: ${selectedAsset.symbol} (${selectedAsset.name})
    Current Price: ${p}
    Change (24h): ${c}%
    Active Timeframe Focus: ${activeTfStr}
    Current Selected Indicator Focus: ${selectedIndicator?.nameEn || 'None'}
    
    ### Current Active Live Indicators Readings (Very Important to use these): 
    - Phase X State: ${currentPhase}
    - Direction State: ${currentDir}
    - Oscillation State: ${currentOsc}
    - Displacement State: ${currentDisp}
    - Reference State: ${currentRef}
    - Envelop State: ${currentEnv}
    
    ### Recent Price Action (OHLC Data - Oldest to Newest):
    ${recentCandles || "No Recent OHLC Data Available"}
    
    ### Task: A value like "1" or "0" often signifies "Up" or "Down" depending on the indicator logic. A value of "No Data" means the AI cannot confidently answer related to that indicator.
    `.trim();
  }, [selectedAsset, liveAssets, timeframe, selectedIndicator, phaseCandles, dirCandles, oscCandles, dispCandles, refCandles, envCandles,
    liveChartData,
  mtfEnabled, mtfLargeTimeframe, mtfSmallTimeframe, chartData]);

  return (
    <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"} style={{ background: tk.bg, fontFamily: "'Inter', system-ui, sans-serif", transition: "background 0.3s" }}>

      {/* ═══════════════ HEADER ═══════════════ */}
      <header className="relative overflow-hidden" style={{ 
        background: `linear-gradient(180deg, rgba(6,10,16,0.95) 0%, rgba(6,10,16,0.85) 100%)`,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid rgba(99,102,241,0.08)`,
        transition: "background 0.3s, border-color 0.3s"
      }}>
        {/* Animated top LED strip */}
        <motion.div className="absolute top-0 left-0 right-0 h-[1.5px] z-10"
          style={{ background: 'linear-gradient(90deg, transparent, #6366f1 30%, #a855f7 50%, #6366f1 70%, transparent)' }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }} />
        
        {/* Subtle animated scan line */}
        <motion.div className="absolute inset-0 pointer-events-none z-0"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.03), transparent)', width: '30%' }}
          animate={{ x: ['-100%', '400%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.015) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="flex items-center justify-between px-5 py-2.5 relative z-10">
          {/* Logo */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
            <motion.div className="relative"
              whileHover={{ scale: 1.05 }}
              style={{ 
                background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 100%)", 
                padding: "7px 20px", 
                borderRadius: 12,
                border: '1px solid rgba(99,102,241,0.25)',
                boxShadow: '0 4px 20px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
              }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 15, letterSpacing: 3.5 }}>PHASE X</span>
              {/* Orbiting dot */}
              <motion.div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                style={{ background: '#818cf8', boxShadow: '0 0 8px #818cf8' }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }} />
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-[8px] font-bold tracking-[0.25em] uppercase" style={{ color: 'rgba(99,102,241,0.4)' }}>
                STRUCTURAL DYNAMICS
              </span>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Structural Dynamics Link */}
            <motion.button
              onClick={onOpenDynamics}
              whileHover={{ scale: 1.04, boxShadow: '0 4px 15px rgba(99,102,241,0.15)' }} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold cursor-pointer"
              style={{
                color: "#818cf8",
                background: "rgba(99,102,241,0.06)",
                border: "1px solid rgba(99,102,241,0.12)",
                backdropFilter: 'blur(8px)',
              }}>
              <Network className="w-3.5 h-3.5" />
              <span>{t("structuralDynamics")}</span>
            </motion.button>

            <motion.button onClick={() => setIsNewsOpen(!isNewsOpen)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold cursor-pointer"
              style={{ 
                color: isNewsOpen ? '#f87171' : '#64748b',
                background: isNewsOpen ? 'rgba(239,68,68,0.06)' : 'rgba(99,102,241,0.03)',
                border: `1px solid ${isNewsOpen ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.08)'}`,
                backdropFilter: 'blur(8px)',
              }}>
              <RadioTower className={`w-3.5 h-3.5 ${isNewsOpen ? "animate-pulse" : ""}`} />
              {t("breakingNews")}
            </motion.button>

            <motion.button onClick={() => setIsProfileOpen(true)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold cursor-pointer"
              style={{ color: '#64748b', background: 'rgba(99,102,241,0.03)', border: '1px solid rgba(99,102,241,0.08)', backdropFilter: 'blur(8px)' }}>
              <User className="w-3.5 h-3.5" /> {t("userProfile") || "Profile"}
            </motion.button>

            <motion.button onClick={onLogout} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold cursor-pointer"
              style={{ color: '#64748b', background: 'rgba(99,102,241,0.03)', border: '1px solid rgba(99,102,241,0.08)', backdropFilter: 'blur(8px)' }}>
              <LogOut className="w-3.5 h-3.5" /> {t("logout")}
            </motion.button>

            <motion.button onClick={toggleTheme} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }}
              className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer"
              style={{ color: tk.isDark ? "#fbbf24" : "#6366f1", background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)' }}>
              {tk.isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </motion.button>

            {/* Language Dropdown */}
            <div className="relative mr-3" ref={dropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black tracking-widest transition-colors cursor-pointer"
                style={{
                  color: '#94a3b8',
                  border: '1px solid rgba(99,102,241,0.1)',
                  backgroundColor: 'rgba(99,102,241,0.04)',
                }}
              >
                <img src={`https://flagcdn.com/${currentLangObj.flagUrl}.svg`} alt={currentLangObj.code} className="w-5 h-auto rounded-sm object-cover" />
                <span className="uppercase">{currentLangObj.code}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ml-1 ${langDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 w-36 rounded-xl shadow-2xl overflow-hidden z-[60]"
                    style={{ background: 'rgba(6,10,16,0.95)', border: '1px solid rgba(99,102,241,0.12)', backdropFilter: 'blur(20px)', right: isRTL ? 'auto' : 0, left: isRTL ? 0 : 'auto' }}
                  >
                    <div className="py-1 flex flex-col">
                      {languageOptions.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguageKey(lang.code as any);
                            setLangDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-xs transition-colors text-left"
                          style={{
                            color: language === lang.code ? '#818cf8' : '#64748b',
                            background: language === lang.code ? 'rgba(99,102,241,0.08)' : 'transparent'
                          }}
                        >
                          <img src={`https://flagcdn.com/${lang.flagUrl}.svg`} alt={lang.code} className="w-5 h-auto rounded-sm object-cover" />
                          <span className={language === lang.code ? "font-bold" : ""}>{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button onClick={() => setIsSubscriptionOpen(true)} whileHover={{ scale: 1.04, boxShadow: '0 6px 25px rgba(250,204,21,0.15)' }} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12px] font-black cursor-pointer relative overflow-hidden"
              style={{ color: "#facc15", background: "rgba(250,204,21,0.04)", border: '1px solid rgba(250,204,21,0.15)', boxShadow: '0 0 20px rgba(250,204,21,0.03)' }}>
              {/* Shimmer on subscription button */}
              <motion.div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(250,204,21,0.06), transparent)' }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
              <Crown className="w-4 h-4 relative z-10" />
              <span className="tracking-wide relative z-10">{t("subscription")}</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-lg ml-1 relative z-10" style={{ background: "rgba(250,204,21,0.1)", color: "#facc15", border: '1px solid rgba(250,204,21,0.15)' }}>
                {subInfo.daysRemaining} {t("daysRemaining")}
              </span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* ═══════════════ BREAKING NEWS (TOGGLED) ═══════════════ */}
      <AnimatePresence>
        {isNewsOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 8 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            style={{ overflow: "hidden" }}
            className="px-5 w-full"
          >
            <BreakingNews selectedSymbol={selectedAsset?.symbol || "EURUSD"} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════ BODY ═══════════════ */}
      <div className="flex gap-0 py-3" style={{ minHeight: "calc(100vh - 52px)" }}>

        {/* ── LEFT: Market List ── */}
        <motion.div initial={false} animate={{ width: isMarketListCollapsed ? 64 : 280 }}
          transition={{ type: "spring", damping: 26, stiffness: 220 }} className="flex-shrink-0 sticky top-0 self-start" style={{ height: "calc(100vh - 64px)" }}>
          <MarketList
            assets={liveAssets}
            selectedAsset={selectedAsset}
            onSelectAsset={pickAsset}
            isCollapsed={isMarketListCollapsed}
            onToggleCollapse={() => setIsMarketListCollapsed(!isMarketListCollapsed)}
            markets={apiMarkets}
            marketsLoading={marketsLoading}
            selectedMarket={selectedMarket}
            onMarketSelect={setSelectedMarket}
            symbolsLoading={symbolsLoading}
          />
        </motion.div>

        {/* ── CENTER: Indicators + Chart + Signals ── */}
        <div className="flex-1 flex flex-col gap-3 min-w-0 px-0 ml-3">

          {/* Indicator Ribbon (Compact & Horizontal with Scroll Arrows) */}
          <div className="rounded-2xl overflow-hidden mb-1 flex-shrink-0 relative"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.04) 0%, rgba(6,10,16,0.95) 60%)', border: '1px solid rgba(99,102,241,0.1)', backdropFilter: 'blur(16px)', transition: "background 0.3s" }}>
            {/* Grid bg */}
            <div className="absolute inset-0 pointer-events-none z-0" style={{
              backgroundImage: 'linear-gradient(rgba(99,102,241,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.015) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />
            {/* Left Arrow */}
            <button
              onClick={() => ribbonRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
              className="absolute left-0 top-0 bottom-0 z-20 flex items-center justify-center w-7 cursor-pointer"
              style={{ background: 'linear-gradient(90deg, rgba(6,10,16,0.9) 60%, transparent 100%)' }}
            >
              <ChevronLeft className="w-4 h-4" style={{ color: '#818cf8' }} />
            </button>
            {/* Right Arrow */}
            <button
              onClick={() => ribbonRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
              className="absolute right-0 top-0 bottom-0 z-20 flex items-center justify-center w-7 cursor-pointer"
              style={{ background: 'linear-gradient(270deg, rgba(6,10,16,0.9) 60%, transparent 100%)' }}
            >
              <ChevronRight className="w-4 h-4" style={{ color: '#818cf8' }} />
            </button>
            <div ref={ribbonRef} className="flex items-center p-1 gap-1 overflow-x-auto hide-scrollbar mx-7 relative z-10" style={{ scrollBehavior: "smooth" }}>
              {indicators.map((ind) => {
                const Icon = indicatorIcons[ind.icon] || Lock;
                const active = selectedIndicator?.id === ind.id;
                const isLocked = ind.locked === true;
                return (
                  <motion.button key={ind.id} onClick={() => pickIndicator(ind)}
                    whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                    className="flex-shrink-0 flex flex-row items-center justify-center gap-2 py-2 px-3 rounded-xl cursor-pointer transition-all relative"
                    style={{
                      background: active ? (isLocked ? 'rgba(148,163,184,0.06)' : `rgba(99,102,241,0.08)`) : "transparent",
                      border: active ? `1px solid ${isLocked ? 'rgba(148,163,184,0.15)' : 'rgba(99,102,241,0.2)'}` : "1px solid transparent",
                      boxShadow: active && !isLocked ? '0 2px 12px rgba(99,102,241,0.08)' : 'none',
                      minWidth: "140px",
                      opacity: isLocked ? 0.55 : 1
                    }}>
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 relative" style={{
                      background: active ? (isLocked ? 'rgba(148,163,184,0.1)' : `rgba(99,102,241,0.15)`) : 'rgba(99,102,241,0.04)',
                      border: `1px solid ${active && !isLocked ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.06)'}`,
                    }}>
                      {isLocked ? <Lock className="w-3 h-3" style={{ color: '#94a3b8' }} /> : <Icon className="w-3 h-3" style={{ color: active ? "#818cf8" : '#475569' }} />}
                    </div>
                    <span className="text-[10px] font-bold tracking-wide whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: active ? (isLocked ? '#94a3b8' : '#818cf8') : '#475569' }}>
                      {isRTL ? ind.name : ind.nameEn}
                    </span>
                    {isLocked && (
                      <Lock className="w-3 h-3 flex-shrink-0" style={{ color: '#94a3b8' }} />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Chart */}
          <div className="flex-shrink-0 relative" style={{ minHeight: "420px", height: "calc(100vh - 280px)" }}>
            {/* Lock Overlay */}
            {selectedIndicator?.locked && (() => {
              const isUpgrade = selectedIndicator.lockType === 'upgrade';
              const accentColor = isUpgrade ? '#fb923c' : '#6366f1';
              const accentRgb = isUpgrade ? '251,146,60' : '99,102,241';
              return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-xl overflow-hidden"
                style={{
                  background: `radial-gradient(ellipse at 50% 30%, rgba(${accentRgb},0.06) 0%, rgba(6,10,16,0.95) 70%)`,
                  backdropFilter: "blur(16px)",
                  border: `1px solid rgba(${accentRgb},0.12)`,
                }}
              >
                {/* Animated grid background */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  backgroundImage: `linear-gradient(rgba(${accentRgb},0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(${accentRgb},0.03) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }} />

                {/* Scan line effect */}
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background: `linear-gradient(transparent 0%, rgba(${accentRgb},0.03) 50%, transparent 100%)`, backgroundSize: '100% 4px' }}
                  animate={{ backgroundPosition: ['0 0', '0 100%'] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />

                {/* Outer orbital ring */}
                <div className="absolute" style={{ width: '340px', height: '340px' }}>
                  <motion.div className="w-full h-full rounded-full absolute"
                    style={{ border: `1px dashed rgba(${accentRgb},0.15)` }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} />
                </div>
                {/* Middle orbital ring */}
                <div className="absolute" style={{ width: '260px', height: '260px' }}>
                  <motion.div className="w-full h-full rounded-full absolute"
                    style={{ border: `1px solid rgba(${accentRgb},0.1)` }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} />
                </div>

                {/* Radial glow behind icon */}
                <motion.div className="absolute rounded-full"
                  style={{ width: '200px', height: '200px', background: `radial-gradient(circle, rgba(${accentRgb},0.12) 0%, transparent 70%)`, filter: 'blur(30px)' }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity }} />

                {/* PHASE-X CORE brand tag */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 relative z-10"
                  style={{ background: `rgba(${accentRgb},0.08)`, border: `1px solid rgba(${accentRgb},0.2)` }}>
                  <motion.div className="w-2 h-2 rounded-full"
                    style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }} />
                  <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: accentColor }}>
                    PHASE-X CORE
                  </span>
                </motion.div>

                {/* Main icon container with hexagonal feel */}
                <motion.div
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="relative z-10 w-28 h-28 flex items-center justify-center mb-6">
                  {/* Spinning border */}
                  <motion.div className="absolute inset-0 rounded-2xl"
                    style={{ border: `2px solid rgba(${accentRgb},0.25)`, borderTopColor: accentColor, borderBottomColor: 'transparent' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
                  {/* Inner glow box */}
                  <div className="absolute inset-2 rounded-xl"
                    style={{ background: `linear-gradient(135deg, rgba(${accentRgb},0.1) 0%, rgba(${accentRgb},0.02) 100%)`, border: `1px solid rgba(${accentRgb},0.15)` }} />
                  {/* Icon */}
                  {isUpgrade
                    ? <Crown size={40} style={{ color: accentColor, filter: `drop-shadow(0 0 12px rgba(${accentRgb},0.5))` }} className="relative z-10" />
                    : <Lock size={40} style={{ color: accentColor, filter: `drop-shadow(0 0 12px rgba(${accentRgb},0.5))` }} className="relative z-10" />
                  }
                </motion.div>

                {/* Indicator name */}
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-black text-white mb-1 relative z-10 tracking-wide"
                  style={{ textShadow: `0 0 30px rgba(${accentRgb},0.3)` }}>
                  {isRTL ? selectedIndicator.name : selectedIndicator.nameEn}
                </motion.h3>

                {/* Status line */}
                <div className="flex items-center gap-2 mb-5 relative z-10">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: isUpgrade ? '#f97316' : '#94a3b8' }} />
                  <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: isUpgrade ? '#f97316' : '#94a3b8' }}>
                    {isUpgrade
                      ? (isRTL ? 'يتطلب ترقية' : 'UPGRADE REQUIRED')
                      : (isRTL ? 'قيد التطوير' : 'IN DEVELOPMENT')
                    }
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: isUpgrade ? '#f97316' : '#94a3b8' }} />
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 max-w-xs text-center leading-relaxed mb-6 relative z-10 font-medium">
                  {isUpgrade
                    ? (isRTL ? 'هذا المؤشر متاح فقط للمشتركين المميزين. قم بترقية خطتك للوصول الكامل لجميع أدوات التحليل المتقدمة.' : 'This indicator is available exclusively for premium subscribers. Upgrade your plan to unlock all advanced analysis tools.')
                    : (isRTL ? 'فريقنا يعمل على تطوير هذا المؤشر المتقدم. سيكون متاحاً قريباً ضمن منظومة Phase-X.' : 'Our team is developing this advanced indicator. It will be available soon within the Phase-X ecosystem.')
                  }
                </p>

                {/* Action */}
                {isUpgrade ? (
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: `0 15px 40px rgba(${accentRgb},0.4)` }}
                    whileTap={{ scale: 0.95 }}
                    className="relative z-10 px-8 py-3 rounded-xl text-sm font-black uppercase tracking-[0.2em] cursor-pointer flex items-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${accentColor}, #f97316)`, color: '#000', boxShadow: `0 8px 30px rgba(${accentRgb},0.3)` }}>
                    <motion.div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
                      <motion.div className="absolute inset-0"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1 }} />
                    </motion.div>
                    <Crown size={16} />
                    {isRTL ? 'ترقية الاشتراك' : 'Upgrade Plan'}
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative z-10 flex items-center gap-3 px-6 py-3 rounded-xl"
                    style={{ background: `rgba(${accentRgb},0.06)`, border: `1px solid rgba(${accentRgb},0.15)` }}>
                    <motion.div className="w-2.5 h-2.5 rounded-full"
                      style={{ background: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
                      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }} />
                    <span className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: accentColor }}>
                      {isRTL ? 'قريباً' : 'Coming Soon'}
                    </span>
                  </motion.div>
                )}

                {/* Bottom corner branding */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <span className="text-[9px] tracking-[0.4em] uppercase font-semibold" style={{ color: `rgba(${accentRgb},0.25)` }}>
                    PHASE-X · STRUCTURAL DYNAMICS · CORE
                  </span>
                </div>
              </motion.div>
              );
            })()}
            <AnimatePresence mode="wait">
              <IndicatorChart
                key={`${selectedAsset?.id}-${selectedIndicator?.id}-${timeframe}`}
                currency={liveSelectedAsset} indicator={selectedIndicator} data={selectedIndicator?.locked ? [] : chartData}
                timeframe={timeframe} onTimeframeChange={pickTimeframe}
                mtfEnabled={mtfEnabled} mtfSmallTimeframe={mtfSmallTimeframe} mtfLargeTimeframe={mtfLargeTimeframe}
                onMtfEnabledChange={setMtfEnabled} onMtfSmallTimeframeChange={setMtfSmallTimeframe} onMtfLargeTimeframeChange={setMtfLargeTimeframe}
                generateCandlesFromReal={generateCandlesFromReal}
                onLiveChartData={setLiveChartData}
              />
            </AnimatePresence>
          </div>

          {/* ═══ SIGNALS TABLE (Centered and Resized) ═══ */}
          <div className="flex justify-center w-full">
            <div className="w-full max-w-[1000px]">
               <TradingSignalsTable />
            </div>
          </div>
        </div>

        {/* ── RIGHT: AI Scanner & Ads ── */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="w-64 ml-4 flex-shrink-0 hidden xl:flex flex-col gap-4 sticky top-0 self-start" style={{ height: "calc(100vh - 64px)" }}>
          {/* Sci-Fi AI Trader Scanner */}
          <AITradeSignalWidget 
            marketContext={aiMarketContext} 
            assetSymbol={selectedAsset?.symbol} 
            timeframe={timeframe} 
            mtfEnabled={mtfEnabled}
            mtfSmallTimeframe={mtfSmallTimeframe}
            mtfLargeTimeframe={mtfLargeTimeframe}
            indicatorName={selectedIndicator?.nameEn}
          />
          
          <AdSpace />
        </motion.div>
      </div>

      <SubscriptionPanel isOpen={isSubscriptionOpen} onClose={() => setIsSubscriptionOpen(false)} />
      
      {/* ═══ AI ChatBot Floating Button & Widget ═══ */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.button
             initial={{ scale: 0, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0, opacity: 0 }}
             onClick={() => setIsChatOpen(true)}
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             className="fixed bottom-6 z-40 rounded-full flex items-center justify-center cursor-pointer shadow-2xl"
             style={{
                width: 56, height: 56,
                right: isRTL ? 'auto' : '24px', left: isRTL ? '24px' : 'auto',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                border: '2px solid rgba(255,255,255,0.1)'
             }}
          >
             <Bot className="w-7 h-7 text-white" />
             <motion.div 
               className="absolute -top-1 -right-1"
               animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
               transition={{ duration: 2, repeat: Infinity }}
             >
                <Sparkles className="w-4 h-4 text-emerald-300" />
             </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AIChatBot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        marketContext={aiMarketContext}
        assetSymbol={selectedAsset?.symbol}
      />

      <AnimatePresence>
        {isProfileOpen && (
          <UserProfile onClose={() => setIsProfileOpen(false)} onTopUp={() => { setIsProfileOpen(false); setIsSubscriptionOpen(true); }} />
        )}
      </AnimatePresence>
    </div>
  );
}