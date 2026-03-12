import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { MarketList, Asset } from "./MarketList";
import { IndicatorChart, Indicator } from "./IndicatorChart";
import { SubscriptionPanel } from "./SubscriptionPanel";
import { AdSpace } from "./AdSpace";
import { TradingSignalsTable } from "./TradingSignalsTable";
import {
  LineChart, Activity, LogOut, Search, Star,
  TrendingUp, TrendingDown, Sun, Moon, Map, User, KeySquare, MonitorDot, AlertTriangle, ArrowRight, X, Maximize2, Minimize2,
  Calendar, Layers, Filter, CheckCircle2, ChevronDown, Lock, ShieldAlert, Cpu, Crown, Clock, Flame, BarChart3, RadioTower, Languages,
  Gauge, Move, Target, Navigation, Network
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { useLivePrices } from "../hooks/useLivePrices";
import { useThemeTokens } from "../hooks/useThemeTokens";
import { useTheme } from "../contexts/ThemeContext";
import { useMarketsAPI } from "../hooks/useMarketsAPI";
import { BreakingNews } from "./BreakingNews";

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
];
const indicatorIcons: Record<string, any> = { Gauge, Move, Target, Activity, Navigation };

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
  const { language, setLanguageKey, t } = useLanguage();
  const isRTL = language === "ar";
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    { code: "tr", label: "Türkçe", flagUrl: "tr" }
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
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isMarketListCollapsed, setIsMarketListCollapsed] = useState(false);
  const [timeframe, setTimeframe] = useState<number>(15);
  const [mtfEnabled, setMtfEnabled] = useState(false);
  const [mtfSmallTimeframe, setMtfSmallTimeframe] = useState<number>(5);
  const [mtfLargeTimeframe, setMtfLargeTimeframe] = useState<number>(240);

  const subInfo = { isActive: true, daysRemaining: 3 };

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

  return (
    <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"} style={{ background: tk.bg, fontFamily: "'Inter', system-ui, sans-serif", transition: "background 0.3s" }}>

      {/* ═══════════════ HEADER ═══════════════ */}
      <header style={{ background: tk.headerBg, borderBottom: `1px solid ${tk.headerBorder}`, transition: "background 0.3s, border-color 0.3s" }}>
        <div className="flex items-center justify-between px-5 py-2.5">
          {/* Logo */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <div style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", padding: "6px 18px", borderRadius: 10 }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 16, letterSpacing: 2 }}>PHASE X</span>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Structural Dynamics Link */}
            <motion.button
              onClick={onOpenDynamics}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium cursor-pointer"
              style={{
                color: "#818cf8",
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.15)",
              }}>
              <Network className="w-3.5 h-3.5" />
              <span>
                {t("structuralDynamics")}
              </span>
            </motion.button>

            <motion.button onClick={() => setIsNewsOpen(!isNewsOpen)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium cursor-pointer transition-colors ${isNewsOpen ? "bg-red-500/10 text-red-500 border-red-500/20" : "text-gray-400 hover:text-red-400"}`}
              style={{ border: isNewsOpen ? `1px solid rgba(239,68,68,0.3)` : `1px solid ${tk.buttonGhostBorder}` }}>
              <RadioTower className={`w-3.5 h-3.5 ${isNewsOpen ? "animate-pulse" : ""}`} />
              {t("breakingNews")}
            </motion.button>

            <motion.button onClick={onLogout} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium cursor-pointer"
              style={{ color: tk.buttonGhostText, background: tk.buttonGhost, border: `1px solid ${tk.buttonGhostBorder}` }}>
              <LogOut className="w-3.5 h-3.5" /> {t("logout")}
            </motion.button>

            <motion.button onClick={toggleTheme} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }}
              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
              style={{ color: tk.isDark ? "#fbbf24" : "#6366f1", background: tk.buttonGhost, border: `1px solid ${tk.buttonGhostBorder}` }}>
              {tk.isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </motion.button>

            {/* Language Dropdown */}
            <div className="relative mr-3" ref={dropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black tracking-widest transition-colors border cursor-pointer"
                style={{
                  color: tk.textPrimary,
                  borderColor: tk.border,
                  backgroundColor: tk.surface,
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
                    style={{ background: tk.surface, border: `1px solid ${tk.border}`, right: isRTL ? 'auto' : 0, left: isRTL ? 0 : 'auto' }}
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
                            color: language === lang.code ? tk.textPrimary : tk.textMuted,
                            background: language === lang.code ? tk.buttonGhost : 'transparent'
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

            <motion.button onClick={() => setIsSubscriptionOpen(true)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold cursor-pointer"
              style={{ color: tk.warning, background: tk.warningBg, border: `1px solid ${tk.isDark ? 'rgba(251,191,36,0.15)' : 'rgba(217,119,6,0.15)'}` }}>
              <Crown className="w-3.5 h-3.5" />
              <span>{t("subscription")}</span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md" style={{ background: tk.warningBg }}>
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
        <div className="flex-1 flex flex-col gap-3 min-w-0 px-0">

          {/* Indicator Ribbon */}
          <div className="rounded-xl overflow-hidden" style={{ background: tk.surface, border: `1px solid ${tk.border}`, transition: "background 0.3s" }}>
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
                      background: active ? `linear-gradient(135deg, ${ind.color}, ${ind.color}88)` : tk.surfaceHover,
                      boxShadow: active ? `0 4px 20px ${ind.color}25` : "none",
                    }}>
                      <Icon className="w-5 h-5" style={{ color: active ? "#fff" : tk.textDim }} />
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: ind.color, opacity: active ? 1 : 0.25 }} />
                    <span className="text-[10px] font-bold leading-tight text-center" style={{ color: active ? ind.color : tk.textMuted }}>
                      {t((ind.id + "State") as any)}
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
                currency={liveSelectedAsset} indicator={selectedIndicator} data={chartData}
                timeframe={timeframe} onTimeframeChange={pickTimeframe}
                mtfEnabled={mtfEnabled} mtfSmallTimeframe={mtfSmallTimeframe} mtfLargeTimeframe={mtfLargeTimeframe}
                onMtfEnabledChange={setMtfEnabled} onMtfSmallTimeframeChange={setMtfSmallTimeframe} onMtfLargeTimeframeChange={setMtfLargeTimeframe}
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