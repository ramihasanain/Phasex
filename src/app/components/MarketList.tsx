import { useState, useRef, useEffect } from "react";
import { Search, ArrowUpRight, ArrowDownRight, ChevronsLeft, ChevronsRight, TrendingUp, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { useThemeTokens } from "../hooks/useThemeTokens";
import type { MarketInfo } from "../hooks/useMarketsAPI";

export interface Asset {
  id: string;
  name: string;
  nameEn: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  market: string;
}

interface MarketListProps {
  assets: Asset[];
  selectedAsset: Asset | null;
  onSelectAsset: (asset: Asset) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  markets: MarketInfo[];
  marketsLoading: boolean;
  selectedMarket: MarketInfo | null;
  onMarketSelect: (market: MarketInfo) => void;
  symbolsLoading: boolean;
}

const flashStyles = `
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

const MARKET_VISUALS: Record<string, { labelAr: string; labelEn: string; accent: string; emoji: string }> = {
  ALL: { labelAr: "الكل", labelEn: "All", accent: "#0ea5e9", emoji: "🌐" },
  FOREX: { labelAr: "فوركس", labelEn: "Forex", accent: "#3b82f6", emoji: "💱" },
  COMMODITY: { labelAr: "سلع", labelEn: "Commodities", accent: "#f97316", emoji: "🛢️" },
  INDEX: { labelAr: "مؤشرات", labelEn: "Indices", accent: "#a855f7", emoji: "📊" },
  CRYPTO: { labelAr: "رقمية", labelEn: "Crypto", accent: "#10b981", emoji: "₿" },
};
const DEFAULT_VISUAL = { labelAr: "سوق", labelEn: "Market", accent: "#6366f1", emoji: "📈" };

function getMarketVisual(code: string) {
  return MARKET_VISUALS[code] || DEFAULT_VISUAL;
}

const symbolIcons: Record<string, string> = {
  "ADAUSD": "🔵", "AXSUSD": "🎮", "BCHUSD": "💚", "BNBUSD": "💛", "BTCUSD": "₿",
  "DOTUSD": "⚪", "ETCUSD": "💎", "ETHUSD": "⟠", "LTCUSD": "🪨", "SOLUSD": "◎",
  "UNIUSD": "🦄", "XRPUSD": "💧", "YFIUSD": "💰", "LINKUSD": "🔗", "COMPUSD": "🌐",
  "DASHUSD": "🔷", "TRUMPUSD": "🟡", "ATOMUSD": "⚡", "AVAXUSD": "🔺",
  "AUDCAD": "🇦🇺", "AUDCHF": "🇦🇺", "AUDJPY": "🇦🇺", "AUDNZD": "🇦🇺", "AUDUSD": "🇦🇺",
  "CADCHF": "🇨🇦", "CADJPY": "🇨🇦", "CHFJPY": "🇨🇭",
  "EURAUD": "🇪🇺", "EURCAD": "🇪🇺", "EURCHF": "🇪🇺", "EURGBP": "🇪🇺",
  "EURJPY": "🇪🇺", "EURNZD": "🇪🇺", "EURUSD": "🇪🇺",
  "GBPAUD": "🇬🇧", "GBPCAD": "🇬🇧", "GBPCHF": "🇬🇧",
  "GBPJPY": "🇬🇧", "GBPNZD": "🇬🇧", "GBPUSD": "🇬🇧",
  "NZDCAD": "🇳🇿", "NZDCHF": "🇳🇿", "NZDJPY": "🇳🇿", "NZDUSD": "🇳🇿",
  "USDCAD": "🇺🇸", "USDCHF": "🇺🇸", "USDJPY": "🇺🇸",
  "XAUUSD": "🥇", "XAGUSD": "🥈", "UKOILRoll": "🛢️", "USOILRoll": "🛢️",
  "VIXRoll": "📉", "NL25Roll": "🌷", "NORWAY25Roll": "⛷️",
  "RUSS2000": "📈", "EU50Roll": "🏦", "FRA40Roll": "🗼",
  "AUS200Roll": "🏛️", "CHshares": "⛰️", "SWISS20Roll": "⛰️",
  "CHINA50Roll": "🏮", "ESP35Roll": "🏟️", "HK50Roll": "🏙️",
  "DE40Roll": "🏭", "JP225Roll": "⛩️", "UK100Roll": "🏰",
  "US30Roll": "🏛️", "US500Roll": "📊", "UT100Roll": "💻",
};

export function MarketList({
  assets, selectedAsset, onSelectAsset, isCollapsed, onToggleCollapse,
  markets, marketsLoading, selectedMarket, onMarketSelect, symbolsLoading,
}: MarketListProps) {
  const { language, t } = useLanguage();
  const isRTL = language === "ar";
  const tk = useThemeTokens();
  const d = tk.isDark;
  const [search, setSearch] = useState("");

  // Accent color helper
  const accent = d ? 'rgba(99,102,241,' : 'rgba(79,70,229,';

  const prevPrices = useRef<Record<string, number>>({});
  const [flashMap, setFlashMap] = useState<Record<string, "up" | "down" | null>>({});
  const flashTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    const newFlashes: Record<string, "up" | "down" | null> = {};
    let hasChange = false;
    for (const asset of assets) {
      const prev = prevPrices.current[asset.symbol];
      if (prev !== undefined && prev !== asset.price) {
        const dir = asset.price > prev ? "up" : "down";
        newFlashes[asset.symbol] = dir;
        hasChange = true;
        if (flashTimers.current[asset.symbol]) clearTimeout(flashTimers.current[asset.symbol]);
        flashTimers.current[asset.symbol] = setTimeout(() => {
          setFlashMap((prev) => ({ ...prev, [asset.symbol]: null }));
        }, 1200);
      }
      prevPrices.current[asset.symbol] = asset.price;
    }
    if (hasChange) setFlashMap((prev) => ({ ...prev, ...newFlashes }));
  }, [assets]);

  const filtered = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      a.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const positiveCount = assets.filter((a) => a.change >= 0).length;
  const negativeCount = assets.length - positiveCount;
  const positivePct = assets.length > 0 ? Math.round((positiveCount / assets.length) * 100) : 0;

  const currentVisual = selectedMarket ? getMarketVisual(selectedMarket.code) : DEFAULT_VISUAL;

  /* ── Collapsed State ── */
  if (isCollapsed) {
    return (
      <div className="h-full rounded-2xl flex flex-col items-center py-3 gap-2 relative overflow-hidden"
        style={{
          background: d ? 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.04) 0%, rgba(6,10,16,0.95) 60%)' : tk.surface,
          border: `1px solid ${d ? 'rgba(99,102,241,0.1)' : tk.border}`,
          backdropFilter: d ? 'blur(16px)' : undefined,
        }}>
        {onToggleCollapse && (
          <button onClick={onToggleCollapse} className="w-9 h-9 rounded-xl flex items-center justify-center mb-2 cursor-pointer"
            style={{ color: tk.textMuted, background: d ? 'rgba(99,102,241,0.06)' : tk.surfaceHover, border: `1px solid ${d ? 'rgba(99,102,241,0.1)' : tk.border}` }}>
            <ChevronsRight className="w-4 h-4" />
          </button>
        )}
        {marketsLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: tk.info }} />
        ) : (
          markets.map((m) => {
            const active = selectedMarket?.id === m.id;
            const vis = getMarketVisual(m.code);
            return (
              <button key={m.id} onClick={() => onMarketSelect(m)}
                className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all text-sm"
                style={{
                  background: active ? `${accent}0.08)` : "transparent",
                  border: active ? `1px solid ${accent}0.15)` : "1px solid transparent",
                }}>
                {vis.emoji}
              </button>
            );
          })
        )}
      </div>
    );
  }

  return (
    <div className="h-full rounded-2xl flex flex-col overflow-hidden relative"
      style={{
        background: d ? 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.04) 0%, rgba(6,10,16,0.95) 60%)' : tk.surface,
        border: `1px solid ${d ? 'rgba(99,102,241,0.1)' : tk.border}`,
        backdropFilter: d ? 'blur(16px)' : undefined,
      }}>

      <style dangerouslySetInnerHTML={{ __html: flashStyles }} />

      {/* Grid bg — dark only */}
      {d && <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.015) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />}

      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between relative z-10"
        style={{ borderBottom: `1px solid ${d ? 'rgba(99,102,241,0.06)' : tk.border}` }}>
        <div className="flex items-center gap-2.5">
          <motion.div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: `${accent}0.08)`, border: `1px solid ${accent}0.15)` }}
            animate={d ? { boxShadow: ['0 0 0 rgba(99,102,241,0)', '0 0 15px rgba(99,102,241,0.1)', '0 0 0 rgba(99,102,241,0)'] } : {}}
            transition={{ duration: 3, repeat: Infinity }}>
            <TrendingUp className="w-4 h-4" style={{ color: tk.info }} />
          </motion.div>
          <div>
            <h2 className="text-sm font-black tracking-wide" style={{ color: tk.textPrimary }}>{t("markets")}</h2>
            <span className="text-[9px] font-bold tracking-wider" style={{ color: tk.textDim }}>
              {symbolsLoading ? t("loadingMarkets") : `${assets.length} ${t("total")}`}
            </span>
          </div>
        </div>
        {onToggleCollapse && (
          <button onClick={onToggleCollapse} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer"
            style={{ color: tk.textMuted, background: d ? 'rgba(99,102,241,0.06)' : tk.surfaceHover, border: `1px solid ${d ? 'rgba(99,102,241,0.1)' : tk.border}` }}>
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Market Tabs */}
      <div className="px-3 py-2.5 relative z-10">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: d ? 'rgba(99,102,241,0.03)' : tk.surfaceHover, border: `1px solid ${d ? 'rgba(99,102,241,0.06)' : tk.border}` }}>
          {marketsLoading ? (
            <div className="flex-1 flex items-center justify-center py-3">
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: tk.info }} />
            </div>
          ) : (
            markets.map((m) => {
              const active = selectedMarket?.id === m.id;
              return (
                <motion.button key={m.id} onClick={() => { onMarketSelect(m); setSearch(""); }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: active ? `${accent}0.08)` : "transparent",
                    border: active ? `1px solid ${accent}0.15)` : "1px solid transparent",
                    boxShadow: active && d ? '0 2px 10px rgba(99,102,241,0.08)' : 'none',
                  }}>
                  <span className="text-[18px] leading-none">{getMarketVisual(m.code).emoji}</span>
                  <span className="text-[9px] font-bold tracking-wider" style={{ color: active ? tk.info : tk.textDim }}>
                    {t(m.code.toLowerCase())}
                  </span>
                  {active && (
                    <motion.div className="w-1.5 h-1.5 rounded-full"
                      style={{ background: tk.info, boxShadow: d ? `0 0 6px ${tk.info}` : 'none' }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }} />
                  )}
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      {/* Sentiment Bar */}
      <div className="px-4 py-1.5 relative z-10">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold tracking-wider" style={{ color: tk.textMuted }}>{positivePct}% {t("positive")}</span>
          <div className="flex items-center gap-3 text-[9px]">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span style={{ color: tk.textDim }}>{positiveCount}</span></span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /><span style={{ color: tk.textDim }}>{negativeCount}</span></span>
          </div>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: d ? 'rgba(99,102,241,0.06)' : tk.surfaceHover }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${positivePct}%` }}
            className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${tk.info}, ${accent}0.4))` }} />
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 relative z-10">
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: tk.textDim, [isRTL ? "right" : "left"]: 10 }} />
          <input type="text" placeholder={t("searchAsset")} value={search} onChange={(e) => setSearch(e.target.value)}
            dir={isRTL ? "rtl" : "ltr"}
            className="w-full h-8 rounded-xl text-xs outline-none font-medium"
            style={{
              background: tk.inputBg,
              border: `1px solid ${tk.inputBorder}`,
              color: tk.inputText,
              paddingLeft: isRTL ? 10 : 32,
              paddingRight: isRTL ? 32 : 10,
              caretColor: tk.info,
            }} />
        </div>
      </div>

      {/* Asset List */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5 relative z-10" style={{ scrollbarWidth: "thin", scrollbarColor: `${tk.scrollbar} transparent` }}>
        {symbolsLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="relative w-12 h-12">
              <motion.div className="absolute inset-0 rounded-full"
                style={{ border: `2px solid ${accent}0.1)`, borderTopColor: tk.info }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
            </div>
            <p className="text-[10px] font-bold tracking-wider" style={{ color: tk.textDim }}>{t("loadingSymbols")}</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? filtered.map((asset) => {
              const pos = asset.change >= 0;
              const selected = selectedAsset?.id === asset.id;
              const decimals = (selectedMarket?.code === "CRYPTO" || selectedMarket?.code === "INDEX") ? 2 : 4;
              const icon = symbolIcons[asset.symbol] || "📌";
              const flash = flashMap[asset.symbol];
              const priceColor = pos ? tk.positive : tk.negative;

              return (
                <motion.button key={asset.id} onClick={() => onSelectAsset(asset)}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  whileHover={{ x: isRTL ? -2 : 2 }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: selected ? `${accent}0.06)` : 'transparent',
                    border: selected ? `1px solid ${accent}0.12)` : '1px solid transparent',
                    boxShadow: selected && d ? '0 2px 12px rgba(99,102,241,0.06)' : 'none',
                  }}>
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-[14px] flex-shrink-0 w-5 text-center">{icon}</span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-black truncate tracking-wider" style={{ color: tk.textPrimary }}>
                        {asset.symbol.replace(".p", "")}
                      </div>
                      <div className="text-[8px] font-bold" style={{ color: tk.textDim }}>{isRTL ? asset.name : asset.nameEn}</div>
                    </div>
                  </div>
                  <div
                    key={`${asset.symbol}-${asset.price}`}
                    className={`text-[11px] font-black tabular-nums px-2 py-0.5 rounded-lg ${flash === "up" ? "price-flash-up" : flash === "down" ? "price-flash-down" : ""}`}
                    style={{ color: priceColor }}>
                    {asset.price.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
                  </div>
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg text-[10px] font-black"
                    style={{ background: pos ? tk.positiveBg : tk.negativeBg, color: pos ? tk.positive : tk.negative, border: `1px solid ${pos ? tk.positiveBorder : tk.negativeBorder}` }}>
                    {pos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {pos ? "+" : ""}{asset.changePercent.toFixed(2)}%
                  </div>
                </motion.button>
              );
            }) : (
              <div className="text-center py-12">
                <Search className="w-8 h-8 mx-auto mb-2" style={{ color: tk.textDim }} />
                <p className="text-[10px] font-bold" style={{ color: tk.textDim }}>{t("noResults")}</p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}