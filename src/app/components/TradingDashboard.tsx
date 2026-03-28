import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { upgradeSubscription, getAddons } from "../api/subscriptionsApi";
import { MarketList, Asset } from "./MarketList";
import { IndicatorChart, Indicator } from "./IndicatorChart";
import { Logo } from "./Logo";
import { SubscriptionPanel } from "./SubscriptionPanel";
import { AdSpace } from "./AdSpace";
import { TradingSignalsTable } from "./TradingSignalsTable";
import { TradeErrorPopup } from "./TradeErrorPopup";
import { MarketWatchModal } from "./MarketWatchModal";
import {
  LineChart,
  Activity,
  LogOut,
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  Sun,
  Moon,
  Map,
  User,
  KeySquare,
  MonitorDot,
  AlertTriangle,
  ArrowRight,
  X,
  Maximize2,
  Minimize2,
  Calendar,
  Layers,
  Filter,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Lock,
  ShieldAlert,
  Cpu,
  Crown,
  Clock,
  Flame,
  BarChart3,
  RadioTower,
  Languages,
  Gauge,
  Move,
  Target,
  Navigation,
  Network,
  PowerOff,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { useLivePrices } from "../hooks/useLivePrices";
import { useThemeTokens } from "../hooks/useThemeTokens";
import { useTheme, themeOptions } from "../contexts/ThemeContext";
import { useMarketsAPI } from "../hooks/useMarketsAPI";
import { usePhaseStateAPI } from "../hooks/usePhaseStateAPI";
import { useDirectionStateAPI } from "../hooks/useDirectionStateAPI";
import { useEnvelopStateAPI } from "../hooks/useEnvelopStateAPI";
import { useOscillationStateAPI } from "../hooks/useOscillationStateAPI";
import { useDisplacementStateAPI } from "../hooks/useDisplacementStateAPI";
import { useReferenceStateAPI } from "../hooks/useReferenceStateAPI";
import { BreakingNews } from "./BreakingNews";

import { AITradeSignalWidget } from "./AITradeSignalWidget";
import { UserProfile } from "./UserProfile";
import { useAuth } from "../contexts/AuthContext";
import { useMT5, MT5Credentials } from "../hooks/useMT5";
import {
  Bot,
  Sparkles,
  Wifi,
  WifiOff,
  RefreshCw,
  ChevronUp,
  DollarSign,
  TrendingUp as TrendUp,
  ArrowUpDown,
  Eye,
  EyeOff,
  Server,
  CircleCheck,
  Check,
  Copy,
} from "lucide-react";

/* ─── Types ─── */
interface TradingDashboardProps {
  onLogout: () => void;
  onOpenDynamics: () => void;
}

/* ─── Assets from API ─── */

/* ─── Indicators ─── */
const indicators: Indicator[] = [
  {
    id: "phase",
    name: "حالة المرحلة",
    nameEn: "PHASE STATE",
    type: "tz",
    color: "#a78bfa",
    icon: "Gauge",
  },
  {
    id: "displacement",
    name: "حالة الإزاحة",
    nameEn: "DISPLACEMENT STATE",
    type: "tz",
    color: "#60a5fa",
    icon: "Move",
  },
  {
    id: "reference",
    name: "حالة المرجع",
    nameEn: "REFERENCE STATE",
    type: "tz",
    color: "#34d399",
    icon: "Target",
  },
  {
    id: "oscillation",
    name: "حالة التذبذب",
    nameEn: "OSCILLATION STATE",
    type: "tz",
    color: "#fbbf24",
    icon: "Activity",
  },
  {
    id: "direction",
    name: "حالة الاتجاه",
    nameEn: "DIRECTION STATE",
    type: "tz",
    color: "#f87171",
    icon: "Navigation",
  },
  {
    id: "envelop",
    name: "حالة الغلاف",
    nameEn: "ENVELOP STATE",
    type: "tz",
    color: "#f472b6",
    icon: "Layers",
  },
  {
    id: "momentum",
    name: "حالة الزخم",
    nameEn: "MOMENTUM STATE",
    type: "tz",
    color: "#fb923c",
    icon: "Gauge",
    locked: true,
    lockType: "coming_soon",
  },
  {
    id: "volatility",
    name: "حالة التقلب",
    nameEn: "VOLATILITY STATE",
    type: "tz",
    color: "#38bdf8",
    icon: "Activity",
    locked: true,
    lockType: "upgrade",
  },
];
const indicatorIcons: Record<string, any> = {
  Gauge,
  Move,
  Target,
  Activity,
  Navigation,
  Layers,
  Lock,
};

/* ─── Chart Data Generator ─── */
function generateChartData(
  asset: Asset,
  indicator: Indicator,
  timeframe: number,
) {
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
      case "phase":
        value = Math.sin(i / 20) * 50 + (Math.random() - 0.5) * 30;
        break;
      case "displacement":
        value =
          base +
          Math.cos(i / 15) * base * 0.01 +
          Math.sin(i / 25) * base * 0.005 +
          (Math.random() - 0.5) * base * 0.003;
        break;
      case "reference":
        value =
          base +
          Math.sin(i / 30) * base * 0.008 +
          (Math.random() - 0.5) * base * 0.002;
        break;
      case "oscillation":
        value = Math.max(
          -100,
          Math.min(100, Math.sin(i / 18) * 70 + (Math.random() - 0.5) * 20),
        );
        break;
      case "direction":
        value = Math.cos(i / 12) * 50 + (Math.random() - 0.5) * 25;
        break;
      case "envelop":
        value = Math.sin(i / 10) * 40 + (Math.random() - 0.5) * 15;
        break;
      default: {
        const v = timeframe === 5 ? 0.003 : timeframe === 15 ? 0.005 : 0.008;
        value =
          base +
          Math.sin(i / 15) * base * v * 2 +
          (Math.random() - 0.5) * base * v;
      }
    }
    data.push({
      time: displayTime,
      fullTime: fullDate,
      timestamp: t.getTime(),
      value: +value.toFixed(4),
    });
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
    M5: 5,
    M10: 10,
    M15: 15,
    M20: 20,
    M30: 30,
    H1: 60,
    H2: 120,
    H3: 180,
    H4: 240,
    H6: 360,
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

export function TradingDashboard({
  onLogout,
  onOpenDynamics,
}: TradingDashboardProps) {
  const [chartLayout, setChartLayout] = useState<"single" | "split" | "quad">(
    "single",
  );
  const { theme, setTheme } = useTheme();
  const currentThemeOption =
    themeOptions.find((o) => o.key === theme) || themeOptions[0];
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const tk = useThemeTokens();
  const {
    subscriptionStatus,
    subscriptionPlan,
    subscriptionDetails,
    hasMT5Access,
    activateMT5,
    accessToken,
  } = useAuth();
  const { language, setLanguageKey, t } = useLanguage();
  const isRTL = language === "ar";
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setLangDropdownOpen(false);
      }
      if (
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(event.target as Node)
      ) {
        setThemeDropdownOpen(false);
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
    { code: "es", label: "Español", flagUrl: "es" },
  ];

  const currentLangObj =
    languageOptions.find((l) => l.code === language) || languageOptions[1];

  // Markets + Symbols API (two-step: markets on load, symbols on tab change)
  const {
    markets: apiMarkets,
    marketsLoading,
    selectedMarket,
    setSelectedMarket,
    filteredAssets,
    symbolsLoading,
  } = useMarketsAPI(accessToken);

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(
    null,
  );
  const [chartData, setChartData] = useState<any[]>([]);
  const [liveChartData, setLiveChartData] = useState<any[]>([]);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMarketListCollapsed, setIsMarketListCollapsed] = useState(false);
  const [timeframe, setTimeframe] = useState<number>(15);
  const [mtfEnabled, setMtfEnabled] = useState(false);
  const [isMT5PanelOpen, setIsMT5PanelOpen] = useState(true);
  const [isMT5LoginOpen, setIsMT5LoginOpen] = useState(false);
  const [isMT5SubscribeOpen, setIsMT5SubscribeOpen] = useState(false);
  const [mt5SubscribeTermsAccepted, setMt5SubscribeTermsAccepted] =
    useState(false);
  const [isMT5Processing, setIsMT5Processing] = useState(false);
  const [isMT5Pending, setIsMT5Pending] = useState(false);
  const [isMT5DisconnectOpen, setIsMT5DisconnectOpen] = useState(false);
  const [mt5Creds, setMT5Creds] = useState<MT5Credentials>(() => {
    try {
      const saved = localStorage.getItem("mt5_credentials");
      if (saved) return JSON.parse(saved);
    } catch {}
    return { login: "", password: "", server: "" };
  });
  const [showMT5Password, setShowMT5Password] = useState(false);
  const [mtfSmallTimeframe, setMtfSmallTimeframe] = useState<number>(5);
  const [mtfLargeTimeframe, setMtfLargeTimeframe] = useState<number>(240);
  const hasOpenedModalRef = useRef(false);

  // Quick Trade Modal state
  const [quickTradeModal, setQuickTradeModal] = useState<{
    symbol: string;
    action: string;
    source?: "Chart" | "AI";
  } | null>(null);

  const [showMarketWatch, setShowMarketWatch] = useState(false);
  const [qtSL, setQtSL] = useState("");
  const [qtTP, setQtTP] = useState("");
  const [qtSymbol, setQtSymbol] = useState("");
  const [qtError, setQtError] = useState<string | null>(null);
  const [qtExecuting, setQtExecuting] = useState(false);
  const [qtLot, setQtLot] = useState("0.01");
  const [recentlyExecuted, setRecentlyExecuted] = useState<Set<string>>(new Set());
  const executedTradesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (subscriptionStatus === "none" && !hasOpenedModalRef.current) {
      setIsSubscriptionOpen(true);
      hasOpenedModalRef.current = true;
    }
  }, [subscriptionStatus]);

  const subInfo = {
    isActive: subscriptionStatus === "active",
    daysRemaining: subscriptionStatus === "active" && subscriptionDetails
      ? Math.max(0, Math.ceil((new Date(subscriptionDetails.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : 0,
  };

  // Derive list of symbol names from the active tab's backend data
  const activeSymbols = useMemo(
    () => filteredAssets.map((a) => a.symbol),
    [filteredAssets],
  );

  // Live WebSocket prices
  const {
    prices: livePrices,
    initialPrices,
    connected: wsConnected,
  } = useLivePrices(activeSymbols);

  // MT5 Live Connection
  const {
    connected: mt5Connected,
    connecting: mt5Connecting,
    connectStatus: mt5ConnectStatus,
    connectMT5,
    disconnectMT5,
    account: mt5Account,
    positions: mt5Positions,
    positionsLoading: mt5PositionsLoading,
    error: mt5Error,
    tradeError,
    clearTradeError,
    history,
    refreshHistory,
    refreshAccount: refreshMT5Account,
    refreshPositions: refreshMT5Positions,
    executeTrade,
    bulkExecuteTrades,
    closePosition,
    closeAllPositions,
    symbolOverrides,
    setSymbolOverride,
    // Server-side trade history
    serverTradeHistory,
    fetchTradeHistory,
    addTradeToHistory,
    clearServerHistory,
    // Auto-Trade integration
    autoTrades,
    autoTradeWorker,
    autoTradeHistory,
    autoTradeSubscribe,
    autoTradeUnsubscribe,
    stopAllAutoTrades,
    fetchAutoTradeHistory,
    autoFlipCounts,
  } = useMT5();

  // Clear recentlyExecuted entries once positions confirm them
  useEffect(() => {
    if (recentlyExecuted.size === 0 || mt5Positions.length === 0) return;
    const posSyms = new Set(mt5Positions.map((p: any) => p.symbol.toUpperCase().replace(/\.(raw|p|sd|lv)|micro|m$/i, '')));
    const toKeep = new Set<string>();
    recentlyExecuted.forEach(s => { if (!posSyms.has(s)) toKeep.add(s); });
    if (toKeep.size !== recentlyExecuted.size) setRecentlyExecuted(toKeep);
  }, [mt5Positions, recentlyExecuted]);

  // WebSocket symbol aliases: WS name → API symbol code
  const WS_ALIASES: Record<string, string> = {
    GOLD: "XAUUSD",
    SILVER: "XAGUSD",
    UKOIL: "UKOILRoll",
    USOIL: "USOILRoll",
    BRENT: "UKOILRoll",
    WTI: "USOILRoll",
    UK100: "UK100Roll",
    US30: "US30Roll",
    US500: "US500Roll",
    US100: "UT100Roll",
    UT100: "UT100Roll",
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
      let live =
        livePrices[asset.symbol] ||
        livePrices[asset.symbol + ".p"] ||
        undefined;
      let matchedKey = livePrices[asset.symbol]
        ? asset.symbol
        : livePrices[asset.symbol + ".p"]
          ? asset.symbol + ".p"
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

      // Dynamic Loose Match for new symbols (e.g. 'COFFEERoll' -> 'COFFEE', 'USCOCOARoll' -> 'COCOA')
      if (!live) {
        const cleanSymbol = asset.symbol.replace(/Roll$/i, "").toUpperCase();
        const availableKeys = Object.keys(livePrices);
        for (const wsKey of availableKeys) {
          const cleanWsKey = wsKey.replace(/\.p$/i, "").toUpperCase();
          if (
            cleanSymbol.includes(cleanWsKey) ||
            cleanWsKey.includes(cleanSymbol)
          ) {
            live = livePrices[wsKey];
            matchedKey = wsKey;
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
  const pickAsset = (a: Asset) => {
    setSelectedAsset(a);
    if (selectedIndicator)
      setChartData(generateChartData(a, selectedIndicator, timeframe));
  };
  const pickIndicator = (ind: Indicator) => {
    setSelectedIndicator(ind);
    if (selectedAsset)
      setChartData(generateChartData(selectedAsset, ind, timeframe));
  };
  const pickTimeframe = (tf: number) => {
    setTimeframe(tf);
    if (selectedAsset && selectedIndicator)
      setChartData(generateChartData(selectedAsset, selectedIndicator, tf));
  };

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
    if (
      !selectedAsset &&
      liveAssets &&
      liveAssets.length > 0 &&
      !symbolsLoading
    ) {
      const gold =
        liveAssets.find((a) => a.symbol === "XAUUSD" || a.id === "GOLD") ||
        liveAssets[0];
      if (gold) {
        setSelectedAsset(gold);
        const ind =
          selectedIndicator || indicators.find((i) => i.id === "phase");
        if (ind) setChartData(generateChartData(gold, ind, timeframe));
      }
    }
  }, [selectedAsset, liveAssets, selectedIndicator, timeframe, symbolsLoading]);

  // Fetch Live State API data for the AI context
  const formatTfStr = (tf: number) =>
    tf >= 1440 ? `D${tf / 1440}` : tf >= 60 ? `H${tf / 60}` : `M${tf}`;
  const aiTf1 = mtfEnabled
    ? formatTfStr(mtfLargeTimeframe)
    : formatTfStr(timeframe >= 60 ? timeframe : 60);
  const aiTf2 = mtfEnabled
    ? formatTfStr(mtfSmallTimeframe)
    : formatTfStr(timeframe);

  const { candles: phaseCandles } = usePhaseStateAPI(
    selectedAsset?.symbol,
    aiTf1,
    aiTf2,
    selectedIndicator?.id === "phase",
    accessToken,
  );
  const { candles: dirCandles } = useDirectionStateAPI(
    selectedAsset?.symbol,
    mtfEnabled ? mtfSmallTimeframe : timeframe,
    selectedIndicator?.id === "direction",
    accessToken,
  );
  const { candles: oscCandles } = useOscillationStateAPI(
    selectedAsset?.symbol,
    mtfEnabled ? mtfSmallTimeframe : timeframe,
    selectedIndicator?.id === "oscillation",
    accessToken,
  );
  const { candles: dispCandles } = useDisplacementStateAPI(
    selectedAsset?.symbol,
    mtfEnabled ? mtfSmallTimeframe : timeframe,
    selectedIndicator?.id === "displacement",
    accessToken,
  );
  const { candles: refCandles } = useReferenceStateAPI(
    selectedAsset?.symbol,
    mtfEnabled ? mtfSmallTimeframe : timeframe,
    selectedIndicator?.id === "reference",
    accessToken,
  );
  const { candles: envCandles } = useEnvelopStateAPI(
    selectedAsset?.symbol,
    mtfEnabled ? mtfSmallTimeframe : timeframe,
    selectedIndicator?.id === "envelop",
    accessToken,
  );

  // Generate dynamic market context for the AI
  const aiMarketContext = useMemo(() => {
    if (!selectedAsset) return "No asset selected.";
    const liveMatch = liveAssets.find((a) => a.id === selectedAsset.id);
    const p = liveMatch ? liveMatch.price : selectedAsset.price;
    const c = liveMatch ? liveMatch.changePercent : selectedAsset.changePercent;

    // Get the latest reading from each state indicator
    const currentPhase =
      phaseCandles.length > 0
        ? phaseCandles[phaseCandles.length - 1].value
        : "No Data";
    const currentDir =
      dirCandles.length > 0
        ? dirCandles[dirCandles.length - 1].value
        : "No Data";
    const currentOsc =
      oscCandles.length > 0
        ? oscCandles[oscCandles.length - 1].value
        : "No Data";
    const currentDisp =
      dispCandles.length > 0
        ? dispCandles[dispCandles.length - 1].value
        : "No Data";
    const currentRef =
      refCandles.length > 0
        ? refCandles[refCandles.length - 1].value
        : "No Data";
    const currentEnv =
      envCandles.length > 0
        ? envCandles[envCandles.length - 1].value
        : "No Data";

    const activeTfStr = mtfEnabled
      ? `${formatTfStr(mtfLargeTimeframe)} -> ${formatTfStr(mtfSmallTimeframe)} (MTF)`
      : formatTfStr(timeframe);

    // Extract recent OHLC data from the live chart table (last 15 candles)
    const renderData = liveChartData.length > 0 ? liveChartData : chartData;
    const recentCandles = renderData
      .slice(-100)
      .map((c) => {
        const oStr =
          c.open !== undefined
            ? c.open.toFixed(4)
            : c.value
              ? c.value.toFixed(4)
              : "N/A";
        const hStr =
          c.high !== undefined
            ? c.high.toFixed(4)
            : c.value
              ? c.value.toFixed(4)
              : "N/A";
        const lStr =
          c.low !== undefined
            ? c.low.toFixed(4)
            : c.value
              ? c.value.toFixed(4)
              : "N/A";
        const cStr =
          c.close !== undefined
            ? c.close.toFixed(4)
            : c.value
              ? c.value.toFixed(4)
              : "N/A";
        const timeStr = (c.fullTime || c.time || "").replace(/\n/g, " ");
        return `[${timeStr}] O: ${oStr}, H: ${hStr}, L: ${lStr}, C: ${cStr}`;
      })
      .join("\n    ");

    return `
    Asset: ${selectedAsset.symbol} (${selectedAsset.name})
    Current Price: ${p}
    Change (24h): ${c}%
    Active Timeframe Focus: ${activeTfStr}
    Current Selected Indicator Focus: ${selectedIndicator?.nameEn || "None"}
    
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
  }, [
    selectedAsset,
    liveAssets,
    timeframe,
    selectedIndicator,
    phaseCandles,
    dirCandles,
    oscCandles,
    dispCandles,
    refCandles,
    envCandles,
    liveChartData,
    mtfEnabled,
    mtfLargeTimeframe,
    mtfSmallTimeframe,
    chartData,
  ]);

  return (
    <>
    <TradeErrorPopup error={tradeError} onClose={clearTradeError} />
    <div
      className="min-h-screen overflow-x-hidden"
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        background: tk.bg,
        fontFamily: "'Inter', system-ui, sans-serif",
        transition: "background 0.3s",
      }}
    >
      {/* ═══════════════ HEADER ═══════════════ */}
      <header
        className="relative z-40"
        style={{
          background: tk.isDark
            ? "linear-gradient(180deg, rgba(6,10,16,0.95) 0%, rgba(6,10,16,0.85) 100%)"
            : tk.headerBg,
          backdropFilter: tk.isDark ? "blur(20px)" : undefined,
          borderBottom: `1px solid ${tk.isDark ? "rgba(99,102,241,0.08)" : tk.headerBorder}`,
          transition: "background 0.3s, border-color 0.3s",
        }}
      >
        {/* Animated top LED strip — dark only */}
        {tk.isDark && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-[1.5px] z-10"
            style={{
              background:
                "linear-gradient(90deg, transparent, #6366f1 30%, #a855f7 50%, #6366f1 70%, transparent)",
            }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}

        {/* Subtle animated scan line — dark only */}
        {tk.isDark && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(99,102,241,0.03), transparent)",
              width: "30%",
            }}
            animate={{ x: ["-100%", "400%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Grid pattern — dark only */}
        {tk.isDark && (
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(99,102,241,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.015) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        )}

        <div className="flex items-center justify-between px-5 py-2.5 relative z-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <Logo size="sm" showText={false} animated={false} />
          </motion.div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Structure Dynamics Link */}
            <motion.button
              onClick={onOpenDynamics}
              whileHover={{
                scale: 1.04,
                boxShadow: tk.isDark ? "0 4px 15px rgba(99,102,241,0.15)" : "0 4px 15px rgba(79,70,229,0.2)",
              }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-colors"
              style={{
                color: tk.textPrimary,
                background: tk.isDark ? "rgba(99,102,241,0.08)" : "rgba(79,70,229,0.1)",
                border: `1px solid ${tk.isDark ? "rgba(99,102,241,0.2)" : "rgba(79,70,229,0.3)"}`,
                backdropFilter: tk.isDark ? "blur(8px)" : undefined,
              }}
            >
              <Layers className="w-3.5 h-3.5 flex-shrink-0 drop-shadow-sm" style={{ color: tk.isDark ? "#818cf8" : "#4f46e5" }} />
              <span className="drop-shadow-sm tracking-wide uppercase whitespace-nowrap">{isRTL ? "S. داينمك" : "S. DYNAMIC"}</span>
            </motion.button>

            {/* Market Watch Link */}
            <motion.button
              onClick={() => setShowMarketWatch(true)}
              whileHover={{
                scale: 1.04,
                boxShadow: tk.isDark ? "0 4px 15px rgba(251,191,36,0.15)" : "0 4px 15px rgba(245,158,11,0.2)",
              }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold cursor-pointer transition-colors"
              style={{
                color: tk.textPrimary,
                background: tk.isDark ? "rgba(251,191,36,0.08)" : "rgba(245,158,11,0.1)",
                border: `1px solid ${tk.isDark ? "rgba(251,191,36,0.2)" : "rgba(245,158,11,0.3)"}`,
                backdropFilter: tk.isDark ? "blur(8px)" : undefined,
              }}
            >
              <Activity className="w-3.5 h-3.5 drop-shadow-sm" style={{ color: tk.isDark ? "#fcd34d" : "#d97706" }} />
              <span className="drop-shadow-sm tracking-wide">MARKET WATCH</span>
            </motion.button>

            {/* MT5 Account Details */}
            <AnimatePresence>
              {mt5Connected && mt5Account && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="hidden md:flex items-center gap-4 px-4 py-1.5 rounded-xl relative overflow-hidden"
                  style={{
                    background: tk.isDark ? "linear-gradient(90deg, rgba(16,185,129,0.04), rgba(99,102,241,0.04))" : "linear-gradient(90deg, rgba(16,185,129,0.08), rgba(99,102,241,0.08))",
                    border: `1px solid ${tk.isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.25)"}`,
                    boxShadow: tk.isDark ? "inset 0 0 20px rgba(16,185,129,0.02)" : "0 2px 10px rgba(0,0,0,0.02)",
                    backdropFilter: tk.isDark ? "blur(12px)" : undefined,
                  }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                      width: "50%",
                    }}
                    animate={{ x: ["-200%", "400%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  />

                  <div className="flex flex-col relative z-10 pr-1 text-right">
                    <span className="text-[8px] font-black uppercase tracking-widest line-clamp-1 max-w-[120px]" style={{ color: tk.textDim }}>
                      {mt5Account.server || mt5Account.name || "Broker"}
                    </span>
                    <span className="text-[10px] font-black tabular-nums tracking-tight" style={{ color: tk.textPrimary }}>
                      {mt5Account.login}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MT5 Connection Button */}
            <motion.button
              onClick={() => {
                if (!hasMT5Access) {
                  setIsMT5SubscribeOpen(true);
                  return;
                }
                mt5Connected ? setIsMT5DisconnectOpen(true) : setIsMT5LoginOpen(true);
              }}
              whileHover={{
                scale: 1.04,
                boxShadow: mt5Connected
                  ? "0 4px 15px rgba(16,185,129,0.15)"
                  : "0 4px 15px rgba(239,68,68,0.15)",
              }}
              whileTap={{ scale: 0.96 }}
              disabled={mt5Connecting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold cursor-pointer relative overflow-hidden"
              style={{
                color: mt5Connecting
                  ? tk.warning
                  : mt5Connected
                    ? "#10b981"
                    : "#ef4444",
                background: mt5Connecting
                  ? tk.warningBg
                  : mt5Connected
                    ? "rgba(16,185,129,0.08)"
                    : "rgba(239,68,68,0.08)",
                border: `1px solid ${mt5Connecting ? "rgba(250,204,21,0.15)" : mt5Connected ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                backdropFilter: tk.isDark ? "blur(8px)" : undefined,
                opacity: mt5Connecting ? 0.8 : 1,
              }}
            >
              {mt5Connecting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </motion.div>
              ) : mt5Connected ? (
                <Wifi className="w-3.5 h-3.5" />
              ) : (
                <WifiOff className="w-3.5 h-3.5" />
              )}
              <span>
                {mt5Connecting
                  ? (mt5ConnectStatus || "Connecting...")
                  : mt5Connected
                    ? "MT5 Live"
                    : "MT5 Connect"}
              </span>
              {mt5Connected && (
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "#10b981",
                    boxShadow: "0 0 6px #10b981",
                  }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>

            <motion.button
              onClick={() => setIsNewsOpen(!isNewsOpen)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold cursor-pointer"
              style={{
                color: isNewsOpen ? tk.negative : tk.textMuted,
                background: isNewsOpen ? tk.negativeBg : tk.buttonGhost,
                border: `1px solid ${isNewsOpen ? tk.negativeBorder : tk.buttonGhostBorder}`,
                backdropFilter: tk.isDark ? "blur(8px)" : undefined,
              }}
            >
              <RadioTower
                className={`w-3.5 h-3.5 ${isNewsOpen ? "animate-pulse" : ""}`}
              />
              {t("breakingNews")}
            </motion.button>

            <motion.button
              onClick={() => setIsProfileOpen(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold cursor-pointer"
              style={{
                color: tk.textMuted,
                background: tk.buttonGhost,
                border: `1px solid ${tk.buttonGhostBorder}`,
                backdropFilter: tk.isDark ? "blur(8px)" : undefined,
              }}
            >
              <User className="w-3.5 h-3.5" /> {t("userProfile") || "Profile"}
            </motion.button>

            <motion.button
              onClick={onLogout}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold cursor-pointer"
              style={{
                color: tk.textMuted,
                background: tk.buttonGhost,
                border: `1px solid ${tk.buttonGhostBorder}`,
                backdropFilter: tk.isDark ? "blur(8px)" : undefined,
              }}
            >
              <LogOut className="w-3.5 h-3.5" /> {t("logout")}
            </motion.button>

            {/* Theme Mode Dropdown */}
            <div className="relative" ref={themeDropdownRef}>
              <motion.button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer text-[16px]"
                style={{
                  background: tk.buttonGhost,
                  border: `1px solid ${tk.buttonGhostBorder}`,
                }}
              >
                {currentThemeOption.icon}
              </motion.button>
              <AnimatePresence>
                {themeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 w-36 rounded-xl shadow-2xl overflow-hidden z-[60]"
                    style={{
                      background: tk.isDark
                        ? "rgba(6,10,16,0.95)"
                        : tk.surfaceElevated,
                      border: `1px solid ${tk.isDark ? "rgba(99,102,241,0.12)" : tk.border}`,
                      backdropFilter: tk.isDark ? "blur(20px)" : undefined,
                      right: isRTL ? "auto" : 0,
                      left: isRTL ? 0 : "auto",
                    }}
                  >
                    <div className="py-1 flex flex-col">
                      {themeOptions.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => {
                            setTheme(opt.key);
                            setThemeDropdownOpen(false);
                          }}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors text-left cursor-pointer"
                          style={{
                            color: theme === opt.key ? tk.info : tk.textMuted,
                            background:
                              theme === opt.key ? tk.infoBg : "transparent",
                          }}
                        >
                          <span className="text-[16px]">{opt.icon}</span>
                          <span
                            className={theme === opt.key ? "font-bold" : ""}
                          >
                            {isRTL ? opt.labelAr : opt.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language Dropdown */}
            <div className="relative mr-3 z-50" ref={dropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black tracking-widest transition-colors cursor-pointer"
                style={{
                  color: tk.buttonGhostText,
                  border: `1px solid ${tk.buttonGhostBorder}`,
                  backgroundColor: tk.buttonGhost,
                }}
              >
                <img
                  src={`https://flagcdn.com/${currentLangObj.flagUrl}.svg`}
                  alt={currentLangObj.code}
                  className="w-5 h-auto rounded-sm object-cover"
                />
                <span className="uppercase">{currentLangObj.code}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-300 ml-1 ${langDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 w-36 rounded-xl shadow-2xl overflow-hidden z-[60]"
                    style={{
                      background: tk.isDark
                        ? "rgba(6,10,16,0.95)"
                        : tk.surfaceElevated,
                      border: `1px solid ${tk.isDark ? "rgba(99,102,241,0.12)" : tk.border}`,
                      backdropFilter: tk.isDark ? "blur(20px)" : undefined,
                      right: isRTL ? "auto" : 0,
                      left: isRTL ? 0 : "auto",
                    }}
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
                            color:
                              language === lang.code ? tk.info : tk.textMuted,
                            background:
                              language === lang.code
                                ? tk.infoBg
                                : "transparent",
                          }}
                        >
                          <img
                            src={`https://flagcdn.com/${lang.flagUrl}.svg`}
                            alt={lang.code}
                            className="w-5 h-auto rounded-sm object-cover"
                          />
                          <span
                            className={
                              language === lang.code ? "font-bold" : ""
                            }
                          >
                            {lang.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={() => setIsSubscriptionOpen(true)}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 6px 25px rgba(250,204,21,0.15)",
              }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12px] font-black cursor-pointer relative overflow-hidden"
              style={{
                color: tk.warning,
                background: tk.warningBg,
                border: `1px solid ${tk.isDark ? "rgba(250,204,21,0.15)" : "rgba(217,119,6,0.2)"}`,
                boxShadow: tk.isDark
                  ? "0 0 20px rgba(250,204,21,0.03)"
                  : "none",
              }}
            >
              {/* Shimmer on subscription button */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${tk.isDark ? "rgba(250,204,21,0.06)" : "rgba(217,119,6,0.06)"}, transparent)`,
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <Crown className="w-4 h-4 relative z-10" />
              <span className="tracking-wide relative z-10">
                {t("subscription")}
              </span>
              <span
                className="text-[10px] font-black px-2 py-0.5 rounded-lg ml-1 relative z-10"
                style={{
                  background: tk.warningBg,
                  color: tk.warning,
                  border: `1px solid ${tk.isDark ? "rgba(250,204,21,0.15)" : "rgba(217,119,6,0.15)"}`,
                }}
              >
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
      <div
        className="flex gap-0 py-3"
        style={{ minHeight: "calc(100vh - 52px)" }}
      >
        {/* ── LEFT: Market List ── */}
        <motion.div
          initial={false}
          animate={{ width: isMarketListCollapsed ? 64 : 280 }}
          transition={{ type: "spring", damping: 26, stiffness: 220 }}
          className="flex-shrink-0 sticky top-0 self-start"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <MarketList
            assets={liveAssets}
            selectedAsset={selectedAsset}
            onSelectAsset={pickAsset}
            isCollapsed={isMarketListCollapsed}
            onToggleCollapse={() =>
              setIsMarketListCollapsed(!isMarketListCollapsed)
            }
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
          <div
            className="rounded-2xl overflow-hidden mb-1 flex-shrink-0 relative"
            style={{
              background: tk.isDark
                ? "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.04) 0%, rgba(6,10,16,0.95) 60%)"
                : tk.surface,
              border: `1px solid ${tk.isDark ? "rgba(99,102,241,0.1)" : tk.border}`,
              backdropFilter: tk.isDark ? "blur(16px)" : undefined,
              transition: "background 0.3s",
            }}
          >
            {/* Grid bg — dark only */}
            {tk.isDark && (
              <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(99,102,241,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.015) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
            )}
            {/* Left Arrow */}
            <button
              onClick={() =>
                ribbonRef.current?.scrollBy({ left: -200, behavior: "smooth" })
              }
              className="absolute left-0 top-0 bottom-0 z-20 flex items-center justify-center w-7 cursor-pointer"
              style={{
                background: tk.isDark
                  ? "linear-gradient(90deg, rgba(6,10,16,0.9) 60%, transparent 100%)"
                  : `linear-gradient(90deg, ${tk.surface} 60%, transparent 100%)`,
              }}
            >
              <ChevronLeft className="w-4 h-4" style={{ color: tk.info }} />
            </button>
            {/* Right Arrow */}
            <button
              onClick={() =>
                ribbonRef.current?.scrollBy({ left: 200, behavior: "smooth" })
              }
              className="absolute right-0 top-0 bottom-0 z-20 flex items-center justify-center w-7 cursor-pointer"
              style={{
                background: tk.isDark
                  ? "linear-gradient(270deg, rgba(6,10,16,0.9) 60%, transparent 100%)"
                  : `linear-gradient(270deg, ${tk.surface} 60%, transparent 100%)`,
              }}
            >
              <ChevronRight className="w-4 h-4" style={{ color: tk.info }} />
            </button>
            <div
              ref={ribbonRef}
              className="flex items-center p-1 gap-1 overflow-x-auto hide-scrollbar mx-7 relative z-10"
              style={{ scrollBehavior: "smooth" }}
            >
              {indicators.map((ind) => {
                const Icon = indicatorIcons[ind.icon] || Lock;
                const active = selectedIndicator?.id === ind.id;
                const isLocked = ind.locked === true;
                const activeColor = ind.color || tk.info;

                return (
                  <motion.button
                    key={ind.id}
                    onClick={() => pickIndicator(ind)}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-shrink-0 flex flex-row items-center justify-center gap-2 py-2 px-3 rounded-xl cursor-pointer transition-all relative"
                    style={{
                      background: active
                        ? isLocked
                          ? "rgba(148,163,184,0.06)"
                          : `${activeColor}1a`
                        : "transparent",
                      border: `1px solid ${active ? (isLocked ? "rgba(148,163,184,0.15)" : `${activeColor}40`) : "transparent"}`,
                      boxShadow:
                        active && !isLocked && tk.isDark
                          ? `0 2px 12px ${activeColor}1a`
                          : "none",
                      minWidth: "140px",
                      opacity: isLocked ? 0.55 : 1,
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 relative"
                      style={{
                        background: active
                          ? isLocked
                            ? "rgba(148,163,184,0.1)"
                            : `${activeColor}33`
                          : tk.surfaceHover,
                        border: `1px solid ${active && !isLocked ? `${activeColor}50` : tk.border}`,
                      }}
                    >
                      {isLocked ? (
                        <Lock
                          className="w-3.5 h-3.5"
                          style={{ color: tk.textMuted }}
                        />
                      ) : (
                        <Icon
                          className="w-4 h-4"
                          style={{ color: active ? activeColor : tk.textMuted }}
                          strokeWidth={active ? 2.5 : 2}
                        />
                      )}
                    </div>
                    <span
                      className="text-[11px] font-bold tracking-wide whitespace-nowrap overflow-hidden text-ellipsis transition-colors"
                      style={{
                        color: active
                          ? isLocked
                            ? tk.textDim
                            : activeColor
                          : tk.textMuted,
                      }}
                    >
                      {isRTL ? ind.name : ind.nameEn}
                    </span>
                    {isLocked && (
                      <Lock
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: tk.textDim }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Chart */}
          <div
            className="flex-shrink-0 relative"
            style={{ minHeight: "420px", height: "calc(100vh - 280px)" }}
          >
            {/* Lock Overlay */}
            {selectedIndicator?.locked &&
              (() => {
                const isUpgrade = selectedIndicator.lockType === "upgrade";
                const accentColor = isUpgrade ? "#fb923c" : "#6366f1";
                const accentRgb = isUpgrade ? "251,146,60" : "99,102,241";
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
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: `linear-gradient(rgba(${accentRgb},0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(${accentRgb},0.03) 1px, transparent 1px)`,
                        backgroundSize: "40px 40px",
                      }}
                    />

                    {/* Scan line effect */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(transparent 0%, rgba(${accentRgb},0.03) 50%, transparent 100%)`,
                        backgroundSize: "100% 4px",
                      }}
                      animate={{ backgroundPosition: ["0 0", "0 100%"] }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    {/* Outer orbital ring */}
                    <div
                      className="absolute"
                      style={{ width: "340px", height: "340px" }}
                    >
                      <motion.div
                        className="w-full h-full rounded-full absolute"
                        style={{ border: `1px dashed rgba(${accentRgb},0.15)` }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 30,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </div>
                    {/* Middle orbital ring */}
                    <div
                      className="absolute"
                      style={{ width: "260px", height: "260px" }}
                    >
                      <motion.div
                        className="w-full h-full rounded-full absolute"
                        style={{ border: `1px solid rgba(${accentRgb},0.1)` }}
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </div>

                    {/* Radial glow behind icon */}
                    <motion.div
                      className="absolute rounded-full"
                      style={{
                        width: "200px",
                        height: "200px",
                        background: `radial-gradient(circle, rgba(${accentRgb},0.12) 0%, transparent 70%)`,
                        filter: "blur(30px)",
                      }}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />

                    {/* PHASE-X CORE brand tag */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 relative z-10"
                      style={{
                        background: `rgba(${accentRgb},0.08)`,
                        border: `1px solid rgba(${accentRgb},0.2)`,
                      }}
                    >
                      <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: accentColor,
                          boxShadow: `0 0 8px ${accentColor}`,
                        }}
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span
                        className="text-[10px] font-black tracking-[0.25em] uppercase"
                        style={{ color: accentColor }}
                      >
                        PHASE-X CORE
                      </span>
                    </motion.div>

                    {/* Main icon container with hexagonal feel */}
                    <motion.div
                      animate={{ scale: [1, 1.04, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="relative z-10 w-28 h-28 flex items-center justify-center mb-6"
                    >
                      {/* Spinning border */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          border: `2px solid rgba(${accentRgb},0.25)`,
                          borderTopColor: accentColor,
                          borderBottomColor: "transparent",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      {/* Inner glow box */}
                      <div
                        className="absolute inset-2 rounded-xl"
                        style={{
                          background: `linear-gradient(135deg, rgba(${accentRgb},0.1) 0%, rgba(${accentRgb},0.02) 100%)`,
                          border: `1px solid rgba(${accentRgb},0.15)`,
                        }}
                      />
                      {/* Icon */}
                      {isUpgrade ? (
                        <Crown
                          size={40}
                          style={{
                            color: accentColor,
                            filter: `drop-shadow(0 0 12px rgba(${accentRgb},0.5))`,
                          }}
                          className="relative z-10"
                        />
                      ) : (
                        <Lock
                          size={40}
                          style={{
                            color: accentColor,
                            filter: `drop-shadow(0 0 12px rgba(${accentRgb},0.5))`,
                          }}
                          className="relative z-10"
                        />
                      )}
                    </motion.div>

                    {/* Indicator name */}
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl font-black text-white mb-1 relative z-10 tracking-wide"
                      style={{ textShadow: `0 0 30px rgba(${accentRgb},0.3)` }}
                    >
                      {isRTL
                        ? selectedIndicator.name
                        : selectedIndicator.nameEn}
                    </motion.h3>

                    {/* Status line */}
                    <div className="flex items-center gap-2 mb-5 relative z-10">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: isUpgrade ? "#f97316" : "#94a3b8",
                        }}
                      />
                      <span
                        className="text-[11px] font-bold tracking-widest uppercase"
                        style={{ color: isUpgrade ? "#f97316" : "#94a3b8" }}
                      >
                        {isUpgrade
                          ? isRTL
                            ? "يتطلب ترقية"
                            : "UPGRADE REQUIRED"
                          : isRTL
                            ? "قيد التطوير"
                            : "IN DEVELOPMENT"}
                      </span>
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: isUpgrade ? "#f97316" : "#94a3b8",
                        }}
                      />
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-500 max-w-xs text-center leading-relaxed mb-6 relative z-10 font-medium">
                      {isUpgrade
                        ? isRTL
                          ? "هذا المؤشر متاح فقط للمشتركين المميزين. قم بترقية خطتك للوصول الكامل لجميع أدوات التحليل المتقدمة."
                          : "This indicator is available exclusively for premium subscribers. Upgrade your plan to unlock all advanced analysis tools."
                        : isRTL
                          ? "فريقنا يعمل على تطوير هذا المؤشر المتقدم. سيكون متاحاً قريباً ضمن منظومة Phase-X."
                          : "Our team is developing this advanced indicator. It will be available soon within the Phase-X ecosystem."}
                    </p>

                    {/* Action */}
                    {isUpgrade ? (
                      <motion.button
                        whileHover={{
                          scale: 1.05,
                          boxShadow: `0 15px 40px rgba(${accentRgb},0.4)`,
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="relative z-10 px-8 py-3 rounded-xl text-sm font-black uppercase tracking-[0.2em] cursor-pointer flex items-center gap-2"
                        style={{
                          background: `linear-gradient(135deg, ${accentColor}, #f97316)`,
                          color: "#000",
                          boxShadow: `0 8px 30px rgba(${accentRgb},0.3)`,
                        }}
                      >
                        <motion.div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
                          <motion.div
                            className="absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                            }}
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                              delay: 1,
                            }}
                          />
                        </motion.div>
                        <Crown size={16} />
                        {isRTL ? "ترقية الاشتراك" : "Upgrade Plan"}
                      </motion.button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="relative z-10 flex items-center gap-3 px-6 py-3 rounded-xl"
                        style={{
                          background: `rgba(${accentRgb},0.06)`,
                          border: `1px solid rgba(${accentRgb},0.15)`,
                        }}
                      >
                        <motion.div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            background: accentColor,
                            boxShadow: `0 0 10px ${accentColor}`,
                          }}
                          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span
                          className="text-xs font-black tracking-[0.2em] uppercase"
                          style={{ color: accentColor }}
                        >
                          {isRTL ? "قريباً" : "Coming Soon"}
                        </span>
                      </motion.div>
                    )}

                    {/* Bottom corner branding */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <span
                        className="text-[9px] tracking-[0.4em] uppercase font-semibold"
                        style={{ color: `rgba(${accentRgb},0.25)` }}
                      >
                        PHASE-X · STRUCTURAL DYNAMICS · CORE
                      </span>
                    </div>
                  </motion.div>
                );
              })()}
            <AnimatePresence mode="wait">
              <IndicatorChart
                key={`${selectedAsset?.id}-${selectedIndicator?.id}-${timeframe}`}
                currency={liveSelectedAsset}
                autoTrades={autoTrades}
                autoTradeWorker={autoTradeWorker}
                autoTradeSubscribe={autoTradeSubscribe}
                autoTradeUnsubscribe={autoTradeUnsubscribe}
                indicator={selectedIndicator}
                data={selectedIndicator?.locked ? [] : chartData}
                timeframe={timeframe}
                onTimeframeChange={pickTimeframe}
                mtfEnabled={mtfEnabled}
                mtfSmallTimeframe={mtfSmallTimeframe}
                mtfLargeTimeframe={mtfLargeTimeframe}
                onMtfEnabledChange={setMtfEnabled}
                onMtfSmallTimeframeChange={setMtfSmallTimeframe}
                onMtfLargeTimeframeChange={setMtfLargeTimeframe}
                generateCandlesFromReal={generateCandlesFromReal}
                onLiveChartData={setLiveChartData}
                accessToken={accessToken}
                mt5Connected={mt5Connected}
                executeTrade={executeTrade}
                bulkExecuteTrades={bulkExecuteTrades}
                mt5Positions={mt5Positions}
                addTradeToHistory={addTradeToHistory}
                serverTradeHistory={history}
                renderTradeButtons={
                  selectedAsset
                    ? () => {
                        const buyComment = `PX-Chart ${selectedAsset.symbol} ${timeframe} BUY`.slice(0, 31);
                        const sellComment = `PX-Chart ${selectedAsset.symbol} ${timeframe} SELL`.slice(0, 31);
                        const hasBuyPos = mt5Positions.some((p: any) => p.comment === buyComment);
                        const hasSellPos = mt5Positions.some((p: any) => p.comment === sellComment);

                        return (
                        <div className="flex items-center gap-1.5 ml-2">
                          <motion.button
                            whileHover={hasBuyPos ? {} : { scale: 1.06 }}
                            whileTap={hasBuyPos ? {} : { scale: 0.94 }}
                            disabled={hasBuyPos}
                            title={hasBuyPos ? '✅ صفقة منفذة على هذا التايم فريم' : undefined}
                            onClick={() => {
                              if (hasBuyPos) return;
                              setQuickTradeModal({
                                symbol: selectedAsset.symbol,
                                action: "BUY",
                                source: "Chart",
                              });
                              setQtSL("");
                              setQtTP("");
                              setQtSymbol(selectedAsset.symbol);
                              setQtError(null);
                            }}
                            className="px-3 py-1 rounded-lg text-[10px] font-black tracking-wider cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{
                              background: hasBuyPos ? "rgba(100,116,139,0.08)" : "rgba(16,185,129,0.15)",
                              color: hasBuyPos ? "#64748b" : "#34d399",
                              border: hasBuyPos ? "1px solid rgba(100,116,139,0.2)" : "1px solid rgba(16,185,129,0.3)",
                            }}
                          >
                            {hasBuyPos ? '✅' : 'BUY'}
                          </motion.button>
                          <motion.button
                            whileHover={hasSellPos ? {} : { scale: 1.06 }}
                            whileTap={hasSellPos ? {} : { scale: 0.94 }}
                            disabled={hasSellPos}
                            title={hasSellPos ? '✅ صفقة منفذة على هذا التايم فريم' : undefined}
                            onClick={() => {
                              if (hasSellPos) return;
                              setQuickTradeModal({
                                symbol: selectedAsset.symbol,
                                action: "SELL",
                                source: "Chart",
                              });
                              setQtSL("");
                              setQtTP("");
                              setQtSymbol(selectedAsset.symbol);
                              setQtError(null);
                            }}
                            className="px-3 py-1 rounded-lg text-[10px] font-black tracking-wider cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{
                              background: hasSellPos ? "rgba(100,116,139,0.08)" : "rgba(239,68,68,0.15)",
                              color: hasSellPos ? "#64748b" : "#f87171",
                              border: hasSellPos ? "1px solid rgba(100,116,139,0.2)" : "1px solid rgba(239,68,68,0.3)",
                            }}
                          >
                            {hasSellPos ? (language === 'ar' ? 'مُنفّذة' : 'Executed') : 'SELL'}
                          </motion.button>
                        </div>
                      );
                      }
                    : undefined
                }
              />
            </AnimatePresence>
          </div>

          {/* ═══ SIGNALS TABLE (Centered and Resized) ═══ */}
          <div className="flex justify-center w-full">
            <div className="w-full max-w-[1400px]">
              <TradingSignalsTable
                mt5Connected={mt5Connected}
                executeTrade={executeTrade}
                mt5Positions={mt5Positions}
                closePosition={closePosition}
                closeAllPositions={closeAllPositions}
                symbolOverrides={symbolOverrides}
                setSymbolOverride={setSymbolOverride}
                mt5Account={mt5Account}
                serverTradeHistory={history}
                serverAutoLogs={autoTradeHistory}
                fetchAutoLogs={fetchAutoTradeHistory}
                serverAutoTrades={autoTrades}
                removeAutoTrade={autoTradeUnsubscribe}
                stopAllAutoTrades={stopAllAutoTrades}
                autoTradeWorker={autoTradeWorker}
                addTradeToHistory={addTradeToHistory}
                clearServerHistory={clearServerHistory}
                fetchTradeHistory={fetchTradeHistory}
                addAutoTrade={async (key, symbol, tf, lot, direction, signalPrice, sl, tp, ticket) => {
                  const res = await autoTradeSubscribe([{
                    symbol, main_tf: mtfEnabled ? formatTfStr(mtfLargeTimeframe) : formatTfStr(timeframe >= 60 ? timeframe : 60), sub_tf: tf, window_size: 10, direction, lot_size: lot, sl: sl || undefined, comment: `PX-Dash ${symbol} ${tf}`.slice(0, 31)
                  }]);
                  return res.errors.length === 0;
                }}
                addAutoTradesBulk={async (trades) => {
                  const res = await autoTradeSubscribe(trades.map(t => ({
                    symbol: t.symbol, main_tf: mtfEnabled ? formatTfStr(mtfLargeTimeframe) : formatTfStr(timeframe >= 60 ? timeframe : 60), sub_tf: t.tf, window_size: 10, direction: t.direction, lot_size: t.lot, sl: t.sl || undefined, comment: `PX-Dash ${t.symbol} ${t.tf}`.slice(0, 31)
                  })));
                  return res.errors.length === 0;
                }}
              />
            </div>
          </div>
          {/* MT5 Error Display */}
          {mt5Error && !mt5Connected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-3 flex items-center gap-2 mt-2"
              style={{
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.15)",
              }}
            >
              <AlertTriangle
                className="w-4 h-4 flex-shrink-0"
                style={{ color: "#ef4444" }}
              />
              <span
                className="text-[11px] font-bold"
                style={{ color: "#ef4444" }}
              >
                {mt5Error}
              </span>
            </motion.div>
          )}
        </div>

        {/* ── RIGHT: AI Scanner & Ads ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="w-64 ml-4 flex-shrink-0 hidden xl:flex flex-col gap-4 sticky top-0 self-start"
          style={{ height: "calc(100vh - 64px)" }}
        >
          {/* Sci-Fi AI Trader Scanner */}
          <AITradeSignalWidget
            marketContext={aiMarketContext}
            assetSymbol={selectedAsset?.symbol}
            timeframe={timeframe}
            mtfEnabled={mtfEnabled}
            mtfSmallTimeframe={mtfSmallTimeframe}
            mtfLargeTimeframe={mtfLargeTimeframe}
            indicatorName={selectedIndicator?.nameEn}
            onExecuteTrade={(action: string, sl?: number, tp?: number, lot?: number) => {
              if (!selectedAsset) return;
              setQuickTradeModal({ symbol: selectedAsset.symbol, action });
              setQtSL(sl ? String(sl) : "");
              setQtTP(tp ? String(tp) : "");
              if (lot) setQtLot(String(lot));
              setQtSymbol(selectedAsset.symbol);
              setQtError(null);
            }}
          />

          <AdSpace />
        </motion.div>
      </div>

      <SubscriptionPanel
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
      />

      {/* ═══ QUICK TRADE MODAL ═══ */}
      <AnimatePresence>
        {quickTradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setQuickTradeModal(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md mx-4 rounded-2xl overflow-hidden relative"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.06) 0%, rgba(6,10,16,0.98) 60%)",
                border: "1px solid rgba(99,102,241,0.15)",
                boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
              }}
            >
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: quickTradeModal.action.includes("BUY")
                          ? "rgba(16,185,129,0.12)"
                          : "rgba(239,68,68,0.12)",
                      }}
                    >
                      {quickTradeModal.action.includes("BUY") ? (
                        <TrendingUp
                          className="w-4 h-4"
                          style={{ color: "#34d399" }}
                        />
                      ) : (
                        <TrendingDown
                          className="w-4 h-4"
                          style={{ color: "#f87171" }}
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-[14px] font-black text-white">
                        {quickTradeModal.action} {quickTradeModal.symbol}
                      </h3>
                      <p className="text-[10px] text-gray-500">Execute Order</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setQuickTradeModal(null)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setQtError(null);
                    if (!mt5Connected) {
                      setQtError("⚠️ Connect to MT5 first");
                      return;
                    }
                    setQtExecuting(true);
                    try {
                      const actionType = quickTradeModal.action.includes("BUY")
                        ? "BUY"
                        : "SELL";
                      const slVal = qtSL ? parseFloat(qtSL) : undefined;
                      const tpVal = qtTP ? parseFloat(qtTP) : undefined;
                      const dashComment = quickTradeModal.source === "Chart" 
                        ? `PX-Chart ${qtSymbol} ${timeframe} ${actionType}`.slice(0, 31)
                        : `PX-AI ${qtSymbol} ${timeframe} ${actionType}`.slice(0, 31);
                      await executeTrade(
                        qtSymbol,
                        actionType,
                        parseFloat(qtLot) || 0.01,
                        slVal,
                        tpVal,
                        dashComment,
                      );
                      // Track locally to prevent duplicate before positions refresh
                      const exSym = qtSymbol.toUpperCase().replace(/\.(raw|p|sd|lv)|micro|m$/i, '');
                      setRecentlyExecuted(prev => new Set(prev).add(exSym));
                      setQuickTradeModal(null);
                      // Force refresh positions immediately
                      refreshMT5Positions();
                    } catch (err: any) {
                      const rawMsg = err.message || "Trade failed";
                      // Sanitize the internal service name from the inline error just like TradeErrorPopup does
                      const safeMsg = rawMsg.replace(/MetaApi[i]?/gi, 'Broker').replace(/metaapi/gi, 'Broker').replace(/meta-api/gi, 'Broker');
                      setQtError(safeMsg);
                    } finally {
                      setQtExecuting(false);
                    }
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-[10px] font-bold tracking-widest uppercase mb-1 block text-gray-500">
                      Symbol Override
                    </label>
                    <input
                      type="text"
                      value={qtSymbol}
                      onChange={(e) => setQtSymbol(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-[13px] font-bold outline-none"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#fff",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold tracking-widest uppercase mb-1 block text-gray-500">
                      Lot Size
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="100"
                      value={qtLot}
                      onChange={(e) => setQtLot(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-[13px] font-bold outline-none"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#fff",
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold tracking-widest uppercase mb-1 block text-gray-500">
                        Stop Loss
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={qtSL}
                        onChange={(e) => setQtSL(e.target.value)}
                        placeholder="Optional"
                        className="w-full px-3 py-2 rounded-xl text-[13px] font-bold outline-none"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#fff",
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold tracking-widest uppercase mb-1 block text-gray-500">
                        Take Profit
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={qtTP}
                        onChange={(e) => setQtTP(e.target.value)}
                        placeholder="Optional"
                        className="w-full px-3 py-2 rounded-xl text-[13px] font-bold outline-none"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#fff",
                        }}
                      />
                    </div>
                  </div>
                  {qtError && (
                    <div
                      className="text-[11px] font-bold px-3 py-2 rounded-lg"
                      style={{
                        color: "#f87171",
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.15)",
                      }}
                    >
                      {qtError}
                    </div>
                  )}
                  <motion.button
                    type="submit"
                    disabled={qtExecuting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl text-[12px] font-black tracking-widest uppercase cursor-pointer"
                    style={{
                      background: quickTradeModal.action.includes("BUY")
                        ? "rgba(16,185,129,0.2)"
                        : "rgba(239,68,68,0.2)",
                      color: quickTradeModal.action.includes("BUY")
                        ? "#34d399"
                        : "#f87171",
                      border: `1px solid ${quickTradeModal.action.includes("BUY") ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                    }}
                  >
                    {qtExecuting
                      ? "Executing..."
                      : `Execute ${quickTradeModal.action}`}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProfileOpen && (
          <UserProfile
            onClose={() => setIsProfileOpen(false)}
            onTopUp={() => {
              setIsProfileOpen(false);
              setIsSubscriptionOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* ═══ MT5 LOGIN MODAL ═══ */}
      <AnimatePresence>
        {isMT5LoginOpen && !mt5Connected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsMT5LoginOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md mx-4 rounded-2xl overflow-hidden relative"
              style={{
                background: tk.isDark
                  ? "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.06) 0%, rgba(6,10,16,0.98) 60%)"
                  : tk.surfaceElevated,
                border: `1px solid ${tk.isDark ? "rgba(99,102,241,0.15)" : tk.border}`,
                boxShadow: tk.isDark
                  ? "0 25px 80px rgba(0,0,0,0.5)"
                  : "0 25px 60px rgba(0,0,0,0.15)",
              }}
            >
              {/* Grid pattern bg */}
              {tk.isDark && (
                <div
                  className="absolute inset-0 pointer-events-none z-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(99,102,241,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.02) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />
              )}

              {/* Header */}
              <div className="relative z-10 p-6 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: tk.isDark
                          ? "rgba(99,102,241,0.1)"
                          : tk.infoBg,
                        border: `1px solid ${tk.isDark ? "rgba(99,102,241,0.2)" : "rgba(79,70,229,0.15)"}`,
                      }}
                    >
                      <Server className="w-5 h-5" style={{ color: tk.info }} />
                    </div>
                    <div>
                      <h3
                        className="text-[16px] font-black tracking-wide"
                        style={{ color: tk.textPrimary }}
                      >
                        MetaTrader 5
                      </h3>
                      <p
                        className="text-[10px] font-bold tracking-widest uppercase"
                        style={{ color: tk.textDim }}
                      >
                        LIVE CONNECTION
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMT5LoginOpen(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
                    style={{
                      background: tk.surfaceHover,
                      border: `1px solid ${tk.border}`,
                    }}
                  >
                    <X className="w-4 h-4" style={{ color: tk.textDim }} />
                  </motion.button>
                </div>
              </div>

              {/* Form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    localStorage.setItem("mt5_credentials", JSON.stringify(mt5Creds));
                  } catch {}
                  await connectMT5(mt5Creds);
                  if (!mt5Error) setIsMT5LoginOpen(false);
                }}
                className="relative z-10 px-6 pb-6 flex flex-col gap-3"
              >
                {/* Server */}
                <div>
                  <label
                    className="text-[10px] font-bold tracking-widest uppercase mb-1.5 block"
                    style={{ color: tk.textDim }}
                  >
                    Server
                  </label>
                  <input
                    type="text"
                    value={mt5Creds.server}
                    onChange={(e) =>
                      setMT5Creds({ ...mt5Creds, server: e.target.value })
                    }
                    placeholder="e.g. EquitiBrokerageSC-Demo"
                    className="w-full px-3 py-2.5 rounded-xl text-[13px] font-medium outline-none transition-colors"
                    style={{
                      background: tk.inputBg,
                      border: `1px solid ${tk.inputBorder}`,
                      color: tk.inputText,
                    }}
                    required
                  />
                </div>

                {/* Login */}
                <div>
                  <label
                    className="text-[10px] font-bold tracking-widest uppercase mb-1.5 block"
                    style={{ color: tk.textDim }}
                  >
                    Login
                  </label>
                  <input
                    type="text"
                    value={mt5Creds.login}
                    onChange={(e) =>
                      setMT5Creds({ ...mt5Creds, login: e.target.value })
                    }
                    placeholder="e.g. 1110835"
                    className="w-full px-3 py-2.5 rounded-xl text-[13px] font-medium outline-none transition-colors"
                    style={{
                      background: tk.inputBg,
                      border: `1px solid ${tk.inputBorder}`,
                      color: tk.inputText,
                    }}
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    className="text-[10px] font-bold tracking-widest uppercase mb-1.5 block"
                    style={{ color: tk.textDim }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showMT5Password ? "text" : "password"}
                      value={mt5Creds.password}
                      onChange={(e) =>
                        setMT5Creds({ ...mt5Creds, password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 rounded-xl text-[13px] font-medium outline-none transition-colors"
                      style={{
                        background: tk.inputBg,
                        border: `1px solid ${tk.inputBorder}`,
                        color: tk.inputText,
                        paddingRight: "40px",
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowMT5Password(!showMT5Password)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer"
                      style={{ color: tk.textDim }}
                    >
                      {showMT5Password ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {mt5Error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.15)",
                    }}
                  >
                    <AlertTriangle
                      className="w-3.5 h-3.5 flex-shrink-0"
                      style={{ color: "#ef4444" }}
                    />
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: "#ef4444" }}
                    >
                      {mt5Error.replace(/MetaApi[i]?/gi, 'Broker').replace(/metaapi/gi, 'Broker').replace(/meta-api/gi, 'Broker')}
                    </span>
                  </motion.div>
                )}

                {/* Connect Button */}
                <motion.button
                  type="submit"
                  disabled={
                    mt5Connecting ||
                    !mt5Creds.login ||
                    !mt5Creds.password ||
                    !mt5Creds.server
                  }
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 8px 30px rgba(99,102,241,0.25)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl text-[13px] font-black tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2 mt-1 relative overflow-hidden"
                  style={{
                    background: mt5Connecting
                      ? tk.surfaceHover
                      : "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                    color: mt5Connecting ? tk.textDim : "#fff",
                    border: `1px solid ${mt5Connecting ? tk.border : "rgba(99,102,241,0.3)"}`,
                    opacity:
                      !mt5Creds.login || !mt5Creds.password || !mt5Creds.server
                        ? 0.5
                        : 1,
                  }}
                >
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  {mt5Connecting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <Wifi className="w-4 h-4" />
                  )}
                  <span className="relative z-10">
                    {mt5Connecting ? (mt5ConnectStatus || "Connecting...") : "Connect to MT5"}
                  </span>
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MT5 DISCONNECT CONFIRMATION MODAL ═══ */}
      <AnimatePresence>
        {isMT5DisconnectOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
            }}
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
                background: tk.isDark ? "radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.06) 0%, rgba(6,10,16,0.98) 60%)" : tk.surfaceElevated,
                border: `1px solid ${tk.isDark ? "rgba(239,68,68,0.15)" : tk.border}`,
                boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
              }}
            >
              <h3 className="text-lg font-black mb-2" style={{ color: tk.textPrimary }}>
                {isRTL ? "تأكيد قطع الاتصال" : "Confirm Disconnect"}
              </h3>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: tk.textSecondary }}>
                {isRTL 
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
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    disconnectMT5();
                    setIsMT5DisconnectOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl font-bold cursor-pointer transition-colors flex items-center justify-center gap-2"
                  style={{ background: "#ef4444", color: "#fff", border: "1px solid rgba(239,68,68,0.5)" }}
                >
                  <LogOut className="w-4 h-4" />
                  {isRTL ? "فصل الاتصال" : "Disconnect"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MT5 SUBSCRIBE MODAL ═══ */}
      <AnimatePresence>
        {isMT5SubscribeOpen && !hasMT5Access && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsMT5SubscribeOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md mx-4 rounded-[24px] overflow-hidden relative"
              style={{
                background: tk.isDark
                  ? "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.06) 0%, rgba(6,10,16,0.98) 60%)"
                  : tk.surfaceElevated,
                border: `1px solid ${tk.isDark ? "rgba(99,102,241,0.15)" : tk.border}`,
                boxShadow: tk.isDark
                  ? "0 30px 80px rgba(0,0,0,0.8)"
                  : "0 25px 60px rgba(0,0,0,0.15)",
              }}
            >
              {/* Grid pattern bg */}
              {tk.isDark && (
                <div
                  className="absolute inset-0 pointer-events-none z-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(99,102,241,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.02) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />
              )}

              <div className="relative z-10 p-6">
                {!isMT5Pending ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{
                            background: tk.isDark
                              ? "rgba(99,102,241,0.1)"
                              : tk.infoBg,
                            border: `1px solid ${tk.isDark ? "rgba(99,102,241,0.2)" : "rgba(79,70,229,0.15)"}`,
                          }}
                        >
                          <Crown
                            className="w-6 h-6"
                            style={{ color: tk.info }}
                          />
                        </div>
                        <div>
                          <h3
                            className="text-lg font-black tracking-wide leading-tight"
                            style={{ color: tk.textPrimary }}
                          >
                            {t("mt5Title")}
                          </h3>
                          <p
                            className="text-[10px] font-bold tracking-widest uppercase mt-0.5"
                            style={{ color: tk.textDim }}
                          >
                            Integration Add-on
                          </p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => setIsMT5SubscribeOpen(false)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
                        style={{
                          background: tk.surfaceHover,
                          border: `1px solid ${tk.border}`,
                        }}
                      >
                        <X className="w-4 h-4" style={{ color: tk.textDim }} />
                      </motion.button>
                    </div>

                    <div
                      className="p-4 rounded-xl mb-5"
                      style={{
                        background: tk.isDark
                          ? "rgba(99,102,241,0.05)"
                          : tk.surfaceHover,
                        border: `1px solid ${tk.isDark ? "rgba(99,102,241,0.1)" : tk.border}`,
                      }}
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span
                          className="text-sm font-bold"
                          style={{ color: tk.textPrimary }}
                        >
                          {t("mt5Price")}
                        </span>
                      </div>
                      <p
                        className="text-xs leading-relaxed font-medium"
                        style={{ color: tk.textDim }}
                      >
                        {t("mt5Desc")}
                      </p>
                    </div>

                    <div className="mb-6 flex flex-col gap-3">
                      <h4
                        className="font-bold text-sm flex items-center gap-2"
                        style={{ color: tk.textPrimary }}
                      >
                        Payment Instructions
                      </h4>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: tk.textDim }}
                      >
                        Send <strong className="text-white">$30</strong> via{" "}
                        <a
                          href="https://t.me/PhaseX_Ai"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0088cc] font-bold no-underline hover:underline"
                        >
                          Telegram
                        </a>{" "}
                        or USDT TRC20 to the following address:
                      </p>
                      <div
                        className="flex items-center justify-between p-3 rounded-xl border cursor-pointer hover:border-[#f7931a]/40 transition-colors group"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            "TQwFCKK5JjZACHdE888zG5iUx8wQ2RtnAV",
                          )
                        }
                        style={{
                          background: tk.surface,
                          borderColor: tk.border,
                        }}
                      >
                        <span
                          className="font-mono text-xs break-all pr-3"
                          style={{ color: tk.textMuted }}
                        >
                          TQwFCKK5JjZACHdE888zG5iUx8wQ2RtnAV
                        </span>
                        <span className="text-[#f7931a] group-hover:text-white group-hover:bg-[#f7931a] transition-colors p-2 bg-[#f7931a]/15 rounded-lg shrink-0">
                          <Copy size={14} />
                        </span>
                      </div>
                    </div>

                    <label
                      className="flex items-start gap-3 p-4 rounded-xl cursor-pointer mb-6 transition-colors"
                      style={{
                        background: tk.surfaceHover,
                        border: `1px solid ${mt5SubscribeTermsAccepted ? "#6366f1" : tk.border}`,
                      }}
                    >
                      <div className="pt-0.5 relative shrink-0">
                        <input
                          type="checkbox"
                          checked={mt5SubscribeTermsAccepted}
                          onChange={(e) =>
                            setMt5SubscribeTermsAccepted(e.target.checked)
                          }
                          className="peer sr-only"
                        />
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center transition-colors"
                          style={{
                            border: `2px solid ${mt5SubscribeTermsAccepted ? "#6366f1" : tk.border}`,
                            background: mt5SubscribeTermsAccepted
                              ? "#6366f1"
                              : "transparent",
                          }}
                        >
                          <Check
                            className={`w-3.5 h-3.5 text-white transition-opacity ${mt5SubscribeTermsAccepted ? "opacity-100" : "opacity-0"}`}
                            strokeWidth={3}
                          />
                        </div>
                      </div>
                      <span
                        className="text-xs leading-relaxed font-medium"
                        style={{ color: tk.textMuted }}
                      >
                        {t("mt5Terms")}
                      </span>
                    </label>

                    <motion.button
                      disabled={!mt5SubscribeTermsAccepted || isMT5Processing}
                      onClick={async () => {
                        setIsMT5Processing(true);
                        try {
                          // Fetch addons to get mt5_inte ID
                          const addons = await getAddons(accessToken || undefined);
                          const mt5Addon = addons.find((a: any) => a.code === 'mt5_intgration');
                          if (mt5Addon && accessToken) {
                            const result = await upgradeSubscription(accessToken, {
                              plan_id: subscriptionDetails?.planId || 0,
                              addon_ids: [mt5Addon.id],
                              addons_mode: 'add',
                            });
                            console.log('[PhaseX] MT5 upgrade submitted:', result);
                          } else {
                            console.warn('[PhaseX] mt5_inte addon not found or no token');
                          }
                          setIsMT5Processing(false);
                          setIsMT5Pending(true);
                        } catch (err: any) {
                          console.error('[PhaseX] MT5 upgrade error:', err);
                          setIsMT5Processing(false);
                          alert(err?.message || 'Failed to submit MT5 upgrade request');
                        }
                      }}
                      whileHover={
                        mt5SubscribeTermsAccepted && !isMT5Processing
                          ? {
                              scale: 1.02,
                              boxShadow: "0 8px 30px rgba(99,102,241,0.25)",
                            }
                          : {}
                      }
                      whileTap={
                        mt5SubscribeTermsAccepted && !isMT5Processing
                          ? { scale: 0.98 }
                          : {}
                      }
                      className={`w-full py-4 rounded-xl text-sm font-black uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-2 ${!mt5SubscribeTermsAccepted || isMT5Processing ? "opacity-50 grayscale cursor-not-allowed" : ""}`}
                      style={{
                        background: tk.info,
                        color: "#fff",
                        boxShadow:
                          mt5SubscribeTermsAccepted && !isMT5Processing
                            ? `0 8px 30px ${tk.isDark ? "rgba(99,102,241,0.25)" : "rgba(79,70,229,0.25)"}`
                            : "none",
                      }}
                    >
                      {isMT5Processing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />{" "}
                          Processing...
                        </>
                      ) : (
                        <>
                          <CircleCheck className="w-5 h-5" /> I Have Paid $30
                        </>
                      )}
                    </motion.button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <motion.div
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-6 relative"
                      style={{
                        background: `linear-gradient(135deg, rgba(250,204,21,0.15) 0%, transparent 100%)`,
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 border-4 rounded-full border-t-[#facc15] border-r-transparent border-b-[#facc15] border-l-transparent"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <Clock size={32} color="#facc15" />
                    </motion.div>
                    <h2
                      className="text-2xl font-black mb-2"
                      style={{ color: tk.textPrimary }}
                    >
                      Payment Pending
                    </h2>
                    <p
                      className="text-sm max-w-[280px] mx-auto leading-relaxed font-medium"
                      style={{ color: tk.textDim }}
                    >
                      Your payment is being verified by the administration. This
                      may take a few minutes.
                    </p>
                    <button
                      onClick={() => {
                        setIsMT5SubscribeOpen(false);
                        // Optionally reset states so next time they open it's initially pending or fresh?
                        // The user requested it stays pending, so we will not reset isMT5Pending here.
                      }}
                      className="mt-8 px-6 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      style={{
                        background: tk.surfaceHover,
                        border: `1px solid ${tk.border}`,
                        color: tk.textPrimary,
                      }}
                    >
                      Close Window
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MarketWatchModal 
        isOpen={showMarketWatch} 
        onClose={() => setShowMarketWatch(false)} 
        mt5Positions={mt5Positions} 
        serverAutoTrades={autoTrades} 
        autoFlipCounts={autoFlipCounts}
        closePosition={closePosition} 
        autoTradeUnsubscribe={autoTradeUnsubscribe}
      />

    </div>
    </>
  );
}
