import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { Upload, CheckCircle, FileJson, ChevronDown, ChevronUp, Rocket, Search, X, Maximize2, Minimize2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useThemeTokens } from "../hooks/useThemeTokens";
import { useLivePrices } from "../hooks/useLivePrices";
import { SciFiClock } from "./SciFiClock";

/* ═══════════ Symbol Icons ═══════════ */
const symbolIcons: Record<string, string> = {
    "ADAUSD.p": "🔵", "ATMUSD.p": "⚡", "AVAUSD.p": "🔺", "AXSUSD.p": "🎮",
    "BCHUSD.p": "💚", "BNBUSD.p": "💛", "BTCUSD.p": "₿", "COMUSD.p": "🌐",
    "DOTUSD.p": "⚪", "DSHUSD.p": "🔷", "ETCUSD.p": "💎", "ETHUSD.p": "⟠",
    "LNKUSD.p": "🔗", "LTCUSD.p": "🪨", "SOLUSD.p": "◎", "TRUUSD.p": "🟢",
    "UNIUSD.p": "🦄", "XRPUSD.p": "💧", "YFIUSD.p": "💰",
    "AUDCAD": "🇦🇺", "AUDCHF": "🇦🇺", "AUDJPY": "🇦🇺", "AUDNZD": "🇦🇺", "AUDUSD": "🇦🇺",
    "CADCHF": "🇨🇦", "CADJPY": "🇨🇦",
    "CHFJPY": "🇨🇭",
    "EURAUD": "🇪🇺", "EURCAD": "🇪🇺", "EURCHF": "🇪🇺", "EURGBP": "🇪🇺",
    "EURJPY": "🇪🇺", "EURNZD": "🇪🇺", "EURUSD": "🇪🇺",
    "GBPAUD": "🇬🇧", "GBPCAD": "🇬🇧", "GBPCHF": "🇬🇧",
    "GBPJPY": "🇬🇧", "GBPNZD": "🇬🇧", "GBPUSD": "🇬🇧",
    "NZDCAD": "🇳🇿", "NZDCHF": "🇳🇿", "NZDJPY": "🇳🇿", "NZDUSD": "🇳🇿",
    "USDCAD": "🇺🇸", "USDCHF": "🇺🇸", "USDJPY": "🇺🇸",
    "BRENT": "🛢️", "WTI": "🛢️", "USOIL": "🛢️",
    "GOLD": "🥇", "SILVER": "🥈", "XAUUSD": "🥇", "XAGUSD": "🥈",
    "GER30": "🏭", "JAP225": "⛩️", "UK100": "🏰",
    "US100": "💻", "US30": "🏛️", "US500": "📊",
    "VIXRoll": "📉", "NL25Roll": "🌷", "NORWAY25Roll": "⛷️",
    "RUSS2000": "📈", "EU50Roll": "🏦", "FRA40Roll": "🗼",
    "AUS200Roll": "🏛️", "CHshares": "⛰️", "SWISS20Roll": "⛰️",
    "CHINA50Roll": "🏮", "ESP35Roll": "🏟️", "HK50Roll": "🏙️",
};

const getIcon = (asset: string): string => {
    if (symbolIcons[asset]) return symbolIcons[asset];
    const base = asset.replace(/\.(sd|lv|p)$/i, '');
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

/* ═══════════ Types ═══════════ */
interface SignalEntry {
    time: string;
    open: number; high: number; low: number; close: number;
    net_signal: string;
    stop_loss: number; take_profit: number;
    market: string;
}

type AssetSignals = Record<string, Record<string, SignalEntry>>;

const parseTF = (tf: string): number => {
    const s = tf.trim().toLowerCase();
    const num = parseInt(s.replace(/[^0-9]/g, "")) || 1;
    if (s.includes("m") && !s.includes("mn")) return num;
    if (s.includes("h")) return num * 60;
    if (s.includes("d")) return num * 60 * 24;
    if (s.includes("w")) return num * 60 * 24 * 7;
    if (s.includes("mn")) return num * 60 * 24 * 30;
    return 9999;
};
const sortTF = (a: string, b: string) => parseTF(a) - parseTF(b);

const PriceCell = ({ price, isLive, fmt }: { price: number; isLive: boolean; fmt: (v: number) => string }) => {
    const prevPriceRef = useRef(price);
    const [flashStyle, setFlashStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        if (!isLive) return;
        if (price > prevPriceRef.current) {
            setFlashStyle({ color: "#4ade80", textShadow: "0 0 12px rgba(74,222,128,0.8)", transition: "none" });
            const timer = setTimeout(() => setFlashStyle({ transition: "all 1s ease-out" }), 150);
            prevPriceRef.current = price;
            return () => clearTimeout(timer);
        } else if (price < prevPriceRef.current) {
            setFlashStyle({ color: "#f87171", textShadow: "0 0 12px rgba(248,113,113,0.8)", transition: "none" });
            const timer = setTimeout(() => setFlashStyle({ transition: "all 1s ease-out" }), 150);
            prevPriceRef.current = price;
            return () => clearTimeout(timer);
        }
        prevPriceRef.current = price;
    }, [price, isLive]);

    const baseColor = isLive ? "#38bdf8" : "#cbd5e1";
    return <span style={{ color: baseColor, ...flashStyle }}>{fmt(price)}</span>;
};

const MARKET_FILTERS = [
    { key: "ALL", label: "All", labelAr: "الكل", color: "#818cf8", emoji: "🌐" },
    { key: "FOREX", label: "Forex", labelAr: "فوركس", color: "#3b82f6", emoji: "💱" },
    { key: "CRYPTO", label: "Crypto", labelAr: "رقمية", color: "#10b981", emoji: "₿" },
    { key: "INDEX", label: "Indices", labelAr: "مؤشرات", color: "#a855f7", emoji: "📊" },
    { key: "COMMODITY", label: "Commodities", labelAr: "سلع", color: "#f59e0b", emoji: "🛢️" },
];

const ACTION_FILTERS = [
    { key: "ALL", label: "All", labelAr: "الكل", color: "#818cf8" },
    { key: "Buy", label: "Buy", labelAr: "شراء", color: "#4ade80" },
    { key: "Sell", label: "Sell", labelAr: "بيع", color: "#f87171" },
];
/* ═══════════ Normalize Signal ═══════════ */
const normalizeSignal = (s: string): string => {
    if (!s) return "";
    const lower = s.trim().toLowerCase();
    if (lower === "buy") return "Buy";
    if (lower === "sell") return "Sell";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

/* ═══════════ Component ═══════════ */
export function TradingSignalsTable() {
    const { language, t } = useLanguage();
    const isRTL = language === "ar";
    const tk = useThemeTokens();

    const [signalData, setSignalData] = useState<AssetSignals>({});
    const [isFetching, setIsFetching] = useState(true);
    const [fetchError, setFetchError] = useState("");
    const [lastSystemUpdate, setLastSystemUpdate] = useState<number | null>(Date.now());

    const { prices: livePrices } = useLivePrices();

    // UI States
    const [collapsedAssets, setCollapsedAssets] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");
    const [marketFilter, setMarketFilter] = useState("ALL");
    const [actionFilter, setActionFilter] = useState("ALL");
    const [assetFilter, setAssetFilter] = useState("ALL");
    const [tfFilter, setTfFilter] = useState("ALL");
    const [showAssetDropdown, setShowAssetDropdown] = useState(false);

    // Auto-fetch structural dynamics data from API
    useEffect(() => {
        const SD_API_FAST = "https://phase-x-qc8dy.ondigitalocean.app/api/v1/structural-dynamics/fast";
        let cancelled = false;

        const getLatestAPIInterval = () => {
            const now = new Date();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            let targetMinute = Math.floor(minutes / 5) * 5;
            if (minutes % 5 === 0 && seconds < 30) targetMinute -= 5;
            const targetDate = new Date(now);
            targetDate.setMinutes(targetMinute);
            targetDate.setSeconds(30);
            targetDate.setMilliseconds(0);
            return targetDate.getTime();
        };

        const fetchEnvelopState = async () => {
            if (!cancelled) setIsFetching(true);
            try {
                const res = await fetch(SD_API_FAST);
                if (!res.ok) throw new Error("Network response was not ok");
                const data = await res.json();

                // Find envelop_state file
                const envelopFile = data?.files?.find((f: any) => f.name === "envelop_state");
                if (envelopFile && envelopFile.payload) {
                    const newData: AssetSignals = {};
                    for (const [key, value] of Object.entries(envelopFile.payload)) {
                        if (key === "exported_at") continue;
                        const parts = key.split(" - ");
                        const displayAsset = parts[0].trim();
                        const market = parts[1]?.trim() || "UNKNOWN";
                        const tfData = value as Record<string, any>;

                        for (const [tfKey, entry] of Object.entries(tfData)) {
                            if (!newData[displayAsset]) newData[displayAsset] = {};
                            const displayTF = entry.tf_candle || tfKey.split("_").pop()?.toUpperCase() || tfKey;
                            newData[displayAsset][displayTF] = {
                                time: entry.time || "",
                                open: entry.open ?? 0, high: entry.high ?? 0,
                                low: entry.low ?? 0, close: entry.close ?? 0,
                                net_signal: normalizeSignal(entry.net_signal || (entry.close > entry.open ? "buy" : entry.close < entry.open ? "sell" : "")),
                                stop_loss: entry.stop_loss ?? 0, take_profit: entry.take_profit ?? 0,
                                market,
                            };
                        }
                    }
                    if (!cancelled) {
                        setSignalData(newData);
                        setFetchError("");
                        setLastSystemUpdate(getLatestAPIInterval());
                    }
                } else {
                    if (!cancelled) setFetchError("envelop_state not found in API response.");
                }
            } catch (err) {
                console.error("Error fetching envelop_state:", err);
                if (!cancelled) setFetchError("Failed to fetch data from server.");
            } finally {
                if (!cancelled) setIsFetching(false);
            }
        };

        fetchEnvelopState();

        // Calculate time until next fetch (exactly at MM:00:30, MM:05:30, MM:10:30, etc.)
        const scheduleNextFetch = () => {
            const now = new Date();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            let targetMinute = Math.floor(minutes / 5) * 5;
            if (minutes % 5 !== 0 || seconds >= 30) {
                targetMinute += 5;
            }

            const targetDate = new Date(now);
            targetDate.setMinutes(targetMinute);
            targetDate.setSeconds(30);
            targetDate.setMilliseconds(0);

            const delayParams = targetDate.getTime() - now.getTime();

            return setTimeout(() => {
                if (!cancelled) {
                    fetchEnvelopState();
                    setInterval(fetchEnvelopState, 5 * 60 * 1000);
                }
            }, delayParams);
        };

        const initialTimeout = scheduleNextFetch();

        return () => {
            cancelled = true;
            clearTimeout(initialTimeout);
        };
    }, []);

    const toggleAsset = (asset: string) => {
        const next = new Set(collapsedAssets);
        next.has(asset) ? next.delete(asset) : next.add(asset);
        setCollapsedAssets(next);
    };

    const expandAll = () => setCollapsedAssets(new Set());
    const collapseAll = () => setCollapsedAssets(new Set(allAssetNames));

    const fmt = (val: number): string => {
        if (val === 0) return "—";
        if (val < 1) return val.toFixed(5);
        if (val < 100) return val.toFixed(4);
        if (val < 1000) return val.toFixed(2);
        return val.toFixed(1);
    };

    const calcProfit = (e: SignalEntry, mPrice: number): number => {
        if (!e.net_signal) return 0;
        return e.net_signal === "Buy" ? mPrice - e.close : e.net_signal === "Sell" ? e.close - mPrice : 0;
    };

    const allAssetNames = useMemo(() => Object.keys(signalData).sort(), [signalData]);

    const filteredAssets = useMemo(() => {
        return allAssetNames.filter((asset) => {
            if (searchQuery && !asset.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            if (assetFilter !== "ALL" && asset !== assetFilter) return false;
            const tfs = signalData[asset];
            const entries = Object.values(tfs);
            if (entries.length === 0) return false;
            if (marketFilter !== "ALL" && !entries.some(e => e.market === marketFilter)) return false;
            if (actionFilter !== "ALL" && !entries.some(e => e.net_signal === actionFilter)) return false;
            return true;
        });
    }, [signalData, searchQuery, marketFilter, actionFilter, assetFilter, allAssetNames]);

    const totalBuy = useMemo(() => {
        let c = 0;
        for (const tfs of Object.values(signalData)) for (const e of Object.values(tfs)) if (e.net_signal === "Buy") c++;
        return c;
    }, [signalData]);

    const totalSell = useMemo(() => {
        let c = 0;
        for (const tfs of Object.values(signalData)) for (const e of Object.values(tfs)) if (e.net_signal === "Sell") c++;
        return c;
    }, [signalData]);

    // Assets filtered by current market for dropdown
    const dropdownAssets = useMemo(() => {
        if (marketFilter === "ALL") return allAssetNames;
        return allAssetNames.filter(a => Object.values(signalData[a]).some(e => e.market === marketFilter));
    }, [allAssetNames, signalData, marketFilter]);

    // All unique timeframes sorted
    const allTimeframes = useMemo(() => {
        const set = new Set<string>();
        for (const tfs of Object.values(signalData)) for (const tf of Object.keys(tfs)) set.add(tf);
        return Array.from(set).sort(sortTF);
    }, [signalData]);

    /* ─── EMPTY STATE ─── */
    if (allAssetNames.length === 0) {
        return (
            <div className="flex-shrink-0 mt-3 rounded-2xl overflow-hidden relative" style={{
                background: tk.isDark ? "linear-gradient(135deg, #080c15 0%, #0d1225 50%, #0a0f1a 100%)" : `linear-gradient(135deg, ${tk.surface} 0%, ${tk.surfaceElevated} 50%, ${tk.surface} 100%)`,
                border: "1px solid rgba(99,102,241,0.12)", boxShadow: "0 0 40px rgba(99,102,241,0.04)",
            }}>
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
                    background: "linear-gradient(90deg, transparent 0%, #6366f1 20%, #ef4444 50%, #6366f1 80%, transparent 100%)", opacity: 0.6,
                }} />
                <div className="px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{
                            background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(99,102,241,0.15))",
                            border: "1px solid rgba(239,68,68,0.2)", boxShadow: "0 0 20px rgba(239,68,68,0.1)",
                        }}><Rocket className="w-5 h-5" style={{ color: "#ef4444" }} /></div>
                        <div>
                            <h3 className="text-base font-black tracking-wide" style={{ color: tk.textPrimary }}>
                                PHASE <span style={{ color: "#ef4444", textShadow: "0 0 12px rgba(239,68,68,0.4)" }}>X</span> Trading Dashboard
                            </h3>
                            <p className="text-xs mt-0.5" style={{ color: tk.textDim }}>
                                {t("fetchSignals")}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-10 flex flex-col items-center justify-center gap-4">
                    {isFetching ? (
                        <>
                            <div className="w-8 h-8 rounded-full border-2 border-t-indigo-500 border-indigo-500/20 animate-spin" />
                            <p className="text-sm font-medium" style={{ color: tk.textDim }}>
                                {language === "ar" ? "جاري تحميل بيانات المنصة..." : language === "ru" ? "Загрузка данных платформы..." : language === "tr" ? "Platform verileri yükleniyor..." : language === "fr" ? "Chargement des données de la plateforme..." : language === "es" ? "Cargando datos de la plataforma..." : "Loading platform data..."}
                            </p>
                        </>
                    ) : (
                        <p className="text-sm" style={{ color: fetchError ? "#ef4444" : "#334155" }}>
                            {fetchError ? `⚠️ ${fetchError}` : `⚡ ${t("noData")}`}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    /* ─── DATA STATE ─── */
    return (
        <div className="flex justify-center w-full mt-3 flex-shrink-0">
            <div className="rounded-2xl overflow-hidden relative" style={{
                background: tk.isDark ? "linear-gradient(135deg, #080c15 0%, #0d1225 50%, #0a0f1a 100%)" : `linear-gradient(135deg, ${tk.surface} 0%, ${tk.surfaceElevated} 50%, ${tk.surface} 100%)`,
                border: "1px solid rgba(99,102,241,0.1)", boxShadow: "0 0 40px rgba(99,102,241,0.04)",
                width: "90%", maxWidth: "1200px"
            }}>
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
                    background: "linear-gradient(90deg, transparent 0%, #6366f1 20%, #ef4444 50%, #6366f1 80%, transparent 100%)", opacity: 0.6,
                }} />

            {/* ═══ HEADER ═══ */}
            <div className="px-6 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                        background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(99,102,241,0.15))",
                        border: "1px solid rgba(239,68,68,0.2)", boxShadow: "0 0 15px rgba(239,68,68,0.08)",
                    }}><Rocket className="w-5 h-5" style={{ color: "#ef4444" }} /></div>
                    <div>
                        <h3 className="text-base font-black tracking-wide" style={{ color: tk.textPrimary }}>
                            PHASE <span style={{ color: "#ef4444", textShadow: "0 0 12px rgba(239,68,68,0.4)" }}>X</span> Trading Dashboard
                        </h3>
                        <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[11px]" style={{ color: tk.textDim }}>⚡ {allAssetNames.length} {t("assetsStr")}</span>
                            <span className="text-[11px] font-bold" style={{ color: "#4ade80" }}>▲ {totalBuy}</span>
                            <span className="text-[11px] font-bold" style={{ color: "#f87171" }}>▼ {totalSell}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Live Sync Indicator */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
                        {isFetching ? (
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ boxShadow: "0 0 8px rgba(16,185,129,0.5)" }} />
                        )}
                        <span className="text-[10px] font-bold tracking-wide" style={{ color: "#10b981" }}>
                            {isFetching ? t("syncingStr") : t("live")}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <SciFiClock label={t("lastUpdateStr")} timeMs={lastSystemUpdate} isLive={true} isRTL={isRTL} size="sm" />
                        <SciFiClock label={t("currentTimeStr")} mode="currentTime" isLive={true} isRTL={isRTL} size="sm" />
                    </div>

                    <div className="w-px h-5" style={{ background: "rgba(99,102,241,0.1)" }} />

                    {/* Expand/Collapse All */}
                    <motion.button onClick={expandAll} whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-[11px] font-bold cursor-pointer"
                        style={{ color: "#818cf8", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.1)" }}
                        title={t("expandAllStr")}>
                        <Maximize2 className="w-3.5 h-3.5" />
                    </motion.button>
                    <motion.button onClick={collapseAll} whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-[11px] font-bold cursor-pointer"
                        style={{ color: "#818cf8", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.1)" }}
                        title={t("collapseAllStr")}>
                        <Minimize2 className="w-3.5 h-3.5" />
                    </motion.button>
                </div>
            </div>

            {/* ═══ FILTERS ═══ */}
            <div className="px-5 py-3 flex flex-wrap items-center gap-2.5" style={{
                borderBottom: "1px solid rgba(99,102,241,0.06)", background: "rgba(99,102,241,0.015)",
            }}>
                {/* Search */}
                <div className="relative flex-shrink-0" style={{ width: 180 }}>
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#475569" }} />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t("searchAsset")}
                        className="w-full rounded-lg text-xs font-medium py-2 pl-8 pr-7 outline-none"
                        style={{ background: tk.inputBg, color: tk.inputText, border: "1px solid rgba(99,102,241,0.1)" }} />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
                            <X className="w-3 h-3" style={{ color: "#475569" }} />
                        </button>
                    )}
                </div>

                <div className="w-px h-6" style={{ background: "rgba(99,102,241,0.1)" }} />

                {/* Market Filters */}
                <div className="flex items-center gap-1">
                    {MARKET_FILTERS.map((f) => {
                        const active = marketFilter === f.key;
                        return (
                            <motion.button key={f.key} onClick={() => { setMarketFilter(f.key); setAssetFilter("ALL"); }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all"
                                style={{
                                    color: active ? f.color : "#475569",
                                    background: active ? `${f.color}12` : "transparent",
                                    border: active ? `1px solid ${f.color}25` : "1px solid transparent",
                                    boxShadow: active ? `0 0 8px ${f.color}10` : "none",
                                }}>
                                <span className="text-xs">{f.emoji}</span> {f.key === "ALL" ? t("allAssetsStr") : t(f.key.toLowerCase())}
                            </motion.button>
                        );
                    })}
                </div>

                <div className="w-px h-6" style={{ background: "rgba(99,102,241,0.1)" }} />

                {/* Action Filters */}
                <div className="flex items-center gap-1">
                    {ACTION_FILTERS.map((f) => {
                        const active = actionFilter === f.key;
                        return (
                            <motion.button key={f.key} onClick={() => setActionFilter(f.key)}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all"
                                style={{
                                    color: active ? f.color : "#475569",
                                    background: active ? `${f.color}12` : "transparent",
                                    border: active ? `1px solid ${f.color}25` : "1px solid transparent",
                                    boxShadow: active ? `0 0 8px ${f.color}10` : "none",
                                }}>
                                {f.key === "ALL" ? t("allAssetsStr") : t(f.key.toLowerCase())}
                            </motion.button>
                        );
                    })}
                </div>

                <div className="w-px h-6" style={{ background: "rgba(99,102,241,0.1)" }} />

                {/* ── Asset Picker ── */}
                <div className="relative">
                    <motion.button
                        onClick={() => setShowAssetDropdown(!showAssetDropdown)}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer"
                        style={{
                            color: assetFilter !== "ALL" ? "#e2e8f0" : "#475569",
                            background: assetFilter !== "ALL" ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)",
                            border: assetFilter !== "ALL" ? "1px solid rgba(99,102,241,0.2)" : "1px solid rgba(255,255,255,0.05)",
                        }}>
                        {assetFilter !== "ALL" && <span className="text-sm">{getIcon(assetFilter)}</span>}
                        {assetFilter !== "ALL" ? assetFilter : t("assetSingular")}
                        <ChevronDown className="w-3 h-3" />
                    </motion.button>

                    {/* Dropdown */}
                    {showAssetDropdown && (
                        <div className="absolute top-full left-0 mt-1 z-50 rounded-xl overflow-hidden shadow-2xl" style={{
                            background: "#0d1225", border: "1px solid rgba(99,102,241,0.15)", minWidth: 220, maxHeight: 320,
                        }}>
                            <div className="overflow-y-auto" style={{ maxHeight: 320 }}>
                                <button onClick={() => { setAssetFilter("ALL"); setShowAssetDropdown(false); }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-bold cursor-pointer hover:bg-white/5 transition-colors"
                                    style={{ color: assetFilter === "ALL" ? "#818cf8" : "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                                    🌐 {language === "ar" ? "الكل" : language === "ru" ? "Все активы" : language === "tr" ? "Tüm Varlıklar" : language === "fr" ? "Tous les Actifs" : language === "es" ? "Todos los Activos" : "All Assets"}
                                </button>
                                {dropdownAssets.map((a) => (
                                    <button key={a} onClick={() => { setAssetFilter(a); setShowAssetDropdown(false); }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-bold cursor-pointer hover:bg-white/5 transition-colors"
                                        style={{
                                            color: assetFilter === a ? "#e2e8f0" : "#94a3b8",
                                            background: assetFilter === a ? "rgba(99,102,241,0.08)" : "transparent",
                                            borderBottom: "1px solid rgba(255,255,255,0.02)",
                                        }}>
                                        <span className="text-sm w-6 text-center">{getIcon(a)}</span>
                                        <span className="tracking-wide">{a}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-px h-6" style={{ background: "rgba(99,102,241,0.1)" }} />

                {/* ── TF Filter ── */}
                <div className="flex items-center gap-1 flex-wrap">
                    <motion.button onClick={() => setTfFilter("ALL")} whileTap={{ scale: 0.95 }}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                        style={{
                            color: tfFilter === "ALL" ? "#818cf8" : "#475569",
                            background: tfFilter === "ALL" ? "rgba(99,102,241,0.12)" : "transparent",
                            border: tfFilter === "ALL" ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent",
                        }}>
                        {language === "ar" ? "الكل" : language === "ru" ? "Все" : language === "tr" ? "Tümü" : language === "fr" ? "Tout" : language === "es" ? "Todo" : "All"}
                    </motion.button>
                    {allTimeframes.map((tf) => {
                        const active = tfFilter === tf;
                        return (
                            <motion.button key={tf} onClick={() => setTfFilter(tf)} whileTap={{ scale: 0.95 }}
                                className="px-2 py-1 rounded-lg text-[10px] font-black font-mono cursor-pointer transition-all"
                                style={{
                                    color: active ? "#a5b4fc" : "#475569",
                                    background: active ? "rgba(99,102,241,0.12)" : "transparent",
                                    border: active ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent",
                                    textShadow: active ? "0 0 6px rgba(99,102,241,0.3)" : "none",
                                }}>
                                {tf}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Count */}
                <span className="text-[10px] font-mono ml-auto" style={{ color: "#475569" }}>
                    {filteredAssets.length}/{allAssetNames.length}
                </span>
            </div>

            {/* Click-away for dropdown */}
            {showAssetDropdown && (
                <div className="fixed inset-0 z-40" onClick={() => setShowAssetDropdown(false)} />
            )}

            {/* ═══ TABLE ═══ */}
            <div className="overflow-auto">
                <table className="w-full" style={{ borderCollapse: "collapse" }}>
                    <thead className="sticky top-0 z-10" style={{ background: tk.isDark ? "#080c15" : tk.surface }}>
                        <tr style={{ borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
                            <th className="p-3 text-[13px] font-black text-left tracking-wider" style={{ color: "#64748b" }}>{t("assetCol")}</th>
                            <th className="p-3 text-[13px] font-black text-center tracking-wider" style={{ color: "#64748b" }}>{t("actionStr")}</th>
                            <th className="p-3 text-[13px] font-black text-left tracking-wider" style={{ color: "#64748b" }}>{t("timeStr")}</th>
                            <th className="p-3 text-[13px] font-black text-right tracking-wider" style={{ color: "#64748b" }}>{t("priceStr")}</th>
                            <th className="p-3 text-[13px] font-black text-right tracking-wider" style={{ color: "#f87171" }}>SL</th>
                            <th className="p-3 text-[13px] font-black text-right tracking-wider" style={{ color: "#4ade80" }}>TP</th>
                            <th className="p-3 text-[13px] font-black text-right tracking-wider" style={{ color: "#94a3b8" }}>m.PRICE</th>
                            <th className="p-3 text-[13px] font-black text-right tracking-wider" style={{ color: "#fbbf24" }}>{t("profitStr")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAssets.length === 0 ? (
                            <tr><td colSpan={8} className="p-8 text-center text-sm" style={{ color: "#334155" }}>{t("noResults")}</td></tr>
                        ) : filteredAssets.map((asset) => {
                            const tfs = signalData[asset];
                            let tfKeys = Object.keys(tfs).sort(sortTF);
                            if (actionFilter !== "ALL") tfKeys = tfKeys.filter(tf => tfs[tf].net_signal === actionFilter);
                            if (tfFilter !== "ALL") tfKeys = tfKeys.filter(tf => tf === tfFilter);
                            const isCollapsed = collapsedAssets.has(asset);
                            const icon = getIcon(asset);

                            // Count buy/sell per asset
                            const allTfKeys = Object.keys(tfs);
                            const buyCount = allTfKeys.filter(tf => tfs[tf].net_signal === "Buy").length;
                            const sellCount = allTfKeys.filter(tf => tfs[tf].net_signal === "Sell").length;

                            return (
                                <React.Fragment key={asset}>
                                    {/* ── Asset Header ── */}
                                    <tr className="cursor-pointer" onClick={() => toggleAsset(asset)}
                                        style={{
                                            background: "linear-gradient(90deg, rgba(99,102,241,0.06) 0%, rgba(99,102,241,0.01) 100%)",
                                            borderTop: "1px solid rgba(99,102,241,0.1)",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "linear-gradient(90deg, rgba(99,102,241,0.1) 0%, rgba(99,102,241,0.03) 100%)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "linear-gradient(90deg, rgba(99,102,241,0.06) 0%, rgba(99,102,241,0.01) 100%)")}>
                                        <td colSpan={8} className="p-3 px-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl leading-none">{icon}</span>
                                                    <span className="text-sm font-black tracking-wide" style={{ color: tk.textPrimary, letterSpacing: "0.05em" }}>{asset}</span>
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{
                                                        background: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.15)",
                                                    }}>{tfKeys.length} TF</span>
                                                    {buyCount > 0 && (
                                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{
                                                            background: "rgba(74,222,128,0.08)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.12)",
                                                        }}>▲ {buyCount}</span>
                                                    )}
                                                    {sellCount > 0 && (
                                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{
                                                            background: "rgba(248,113,113,0.08)", color: "#f87171", border: "1px solid rgba(248,113,113,0.12)",
                                                        }}>▼ {sellCount}</span>
                                                    )}
                                                </div>
                                                {isCollapsed ? <ChevronDown className="w-4 h-4" style={{ color: "#6366f1" }} /> : <ChevronUp className="w-4 h-4" style={{ color: "#6366f1" }} />}
                                            </div>
                                        </td>
                                    </tr>

                                    {/* ── TF Rows ── */}
                                    {!isCollapsed && tfKeys.map((tf) => {
                                        const entry = tfs[tf];
                                        const isBuy = entry.net_signal === "Buy";
                                        const isSell = entry.net_signal === "Sell";
                                        const midPrice = (entry.high + entry.low) / 2;

                                        // Lookup live price from WS
                                        const baseAsset = asset.replace(/\.(sd|lv|p)$/i, '');

                                        // Identify alias if WS dictates different names
                                        let alias = baseAsset;
                                        if (baseAsset === "XAUUSD") alias = "GOLD";
                                        else if (baseAsset === "XAGUSD") alias = "SILVER";
                                        else if (baseAsset === "UKOILRoll" || baseAsset === "UKOIL") alias = livePrices["BRENT"] ? "BRENT" : "UKOIL";
                                        else if (baseAsset === "USOILRoll" || baseAsset === "USOIL") alias = livePrices["WTI"] ? "WTI" : "USOIL";
                                        else if (baseAsset === "US500Roll") alias = "US500";
                                        else if (baseAsset === "US30Roll") alias = "US30";
                                        else if (baseAsset === "UK100Roll") alias = "UK100";
                                        else if (baseAsset === "UT100Roll") alias = "US100"; // Sometimes UT100 or US100

                                        const liveMatch = livePrices[asset]
                                            || livePrices[baseAsset]
                                            || livePrices[alias]
                                            || livePrices[baseAsset + ".p"]
                                            || null;

                                        const mPrice = liveMatch ? (liveMatch.bid + liveMatch.ask) / 2 : midPrice;

                                        const profit = calcProfit(entry, mPrice);
                                        const profitPos = profit >= 0;

                                        // Row background color based on Buy/Sell
                                        const rowBg = isBuy ? "rgba(74,222,128,0.03)" : isSell ? "rgba(248,113,113,0.03)" : "transparent";
                                        const rowHoverBg = isBuy ? "rgba(74,222,128,0.07)" : isSell ? "rgba(248,113,113,0.07)" : "rgba(99,102,241,0.03)";
                                        const rowBorder = isBuy ? "1px solid rgba(74,222,128,0.06)" : isSell ? "1px solid rgba(248,113,113,0.06)" : "1px solid rgba(255,255,255,0.02)";

                                        return (
                                            <tr key={`${asset}-${tf}`}
                                                style={{ borderBottom: rowBorder, background: rowBg }}
                                                onMouseEnter={(e) => (e.currentTarget.style.background = rowHoverBg)}
                                                onMouseLeave={(e) => (e.currentTarget.style.background = rowBg)}>
                                                <td className="p-2.5 px-4">
                                                    <span className="text-xs font-black font-mono px-2.5 py-1 rounded-lg" style={{
                                                        background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06))",
                                                        color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.12)", textShadow: "0 0 6px rgba(99,102,241,0.3)",
                                                    }}>{tf}</span>
                                                </td>
                                                <td className="p-2.5 text-center">
                                                    <span className="text-xs font-black px-3 py-1 rounded-lg" style={{
                                                        color: isBuy ? "#22c55e" : isSell ? "#ef4444" : "#475569",
                                                        background: isBuy ? "rgba(34,197,94,0.12)" : isSell ? "rgba(239,68,68,0.12)" : "transparent",
                                                        border: isBuy ? "1px solid rgba(34,197,94,0.2)" : isSell ? "1px solid rgba(239,68,68,0.2)" : "1px solid transparent",
                                                        textShadow: isBuy ? "0 0 10px rgba(34,197,94,0.4)" : isSell ? "0 0 10px rgba(239,68,68,0.4)" : "none",
                                                    }}>{entry.net_signal || "—"}</span>
                                                </td>
                                                <td className="p-2.5 text-xs font-mono font-medium" style={{ color: "#94a3b8" }}>{entry.time}</td>
                                                <td className="p-2.5 text-sm font-black font-mono text-right tabular-nums" style={{ color: "#f0f4f8" }}>{fmt(entry.close)}</td>
                                                <td className="p-2.5 text-xs font-bold font-mono text-right tabular-nums" style={{ color: entry.stop_loss ? "#fb7185" : "#1e293b" }}>{entry.stop_loss ? fmt(entry.stop_loss) : "—"}</td>
                                                <td className="p-2.5 text-xs font-bold font-mono text-right tabular-nums" style={{ color: entry.take_profit ? "#34d399" : "#1e293b" }}>{entry.take_profit ? fmt(entry.take_profit) : "—"}</td>
                                                <td className="p-2.5 text-xs font-bold font-mono text-right tabular-nums">
                                                    <PriceCell price={mPrice} isLive={!!liveMatch} fmt={fmt} />
                                                </td>
                                                <td className="p-2.5 text-right">
                                                    <span className="text-xs font-black font-mono tabular-nums px-2.5 py-1 rounded-lg" style={{
                                                        color: profitPos ? "#22c55e" : "#ef4444",
                                                        background: profitPos ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                                                        border: profitPos ? "1px solid rgba(34,197,94,0.15)" : "1px solid rgba(239,68,68,0.15)",
                                                        textShadow: profitPos ? "0 0 8px rgba(34,197,94,0.3)" : "0 0 8px rgba(239,68,68,0.3)",
                                                    }}>{profit !== 0 ? `${profitPos ? "+" : ""}${fmt(Math.abs(profit))}` : "—"}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
}
