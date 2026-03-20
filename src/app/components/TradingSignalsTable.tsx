import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { Upload, CheckCircle, FileJson, ChevronDown, ChevronUp, Rocket, Search, X, Maximize2, Minimize2, Zap, Play, ToggleLeft, ToggleRight, Clock, History, Download, Info, Edit2, Check } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useThemeTokens } from "../hooks/useThemeTokens";
import { useLivePrices } from "../hooks/useLivePrices";
import { SciFiClock } from "./SciFiClock";
import { useMT5, type MT5TradeResult, type MT5Position, type MT5Account } from "../hooks/useMT5";

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
    candles_showed?: string | number;
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

    const tk = useThemeTokens();
    const baseColor = isLive ? tk.info : tk.textSecondary;
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

/* ═══════════ Trade History Entry ═══════════ */
interface TradeHistoryEntry {
    id: string;
    symbol: string;
    tf: string;
    action: string;
    volume: number;
    entryPrice: number;
    sl: number | null;
    tp: number | null;
    ticket: number | null;
    status: 'filled' | 'failed' | 'pending' | 'closed';
    error?: string;
    executedAt: string;
    signalPrice: number;
    profit?: number | null;
    closePrice?: number | null;
    closedAt?: string;
    signalFulfilled?: boolean;
    autoExecuted?: boolean;
}

/* ═══════════ Props ═══════════ */
interface TradingSignalsTableProps {
    mt5Connected?: boolean;
    executeTrade?: (symbol: string, action: string, volume: number, sl?: number, tp?: number, comment?: string) => Promise<MT5TradeResult | null>;
    mt5Positions?: MT5Position[];
    closePosition?: (ticket: number) => Promise<boolean>;
    closeAllPositions?: () => Promise<boolean>;
    symbolOverrides?: Record<string, string>;
    setSymbolOverride?: (dashboardName: string, brokerName: string) => Promise<boolean>;
    mt5Account?: MT5Account | null;
    // Server-side auto-trade
    serverAutoTrades?: Record<string, any>;
    addAutoTrade?: (key: string, symbol: string, tf: string, lot: number, direction: string, signalPrice: number, sl?: number | null, tp?: number | null, ticket?: string) => Promise<boolean>;
    removeAutoTrade?: (key: string) => Promise<boolean>;
    // Server-side trade history
    serverTradeHistory?: any[];
    addTradeToHistory?: (entry: any) => Promise<boolean>;
    clearServerHistory?: () => Promise<boolean>;
    fetchTradeHistory?: () => Promise<void>;
}

/* ═══════════ Component ═══════════ */
export function TradingSignalsTable({ mt5Connected = false, executeTrade, mt5Positions = [], closePosition, closeAllPositions, symbolOverrides = {}, setSymbolOverride, mt5Account, serverAutoTrades = {}, addAutoTrade, removeAutoTrade, serverTradeHistory = [], addTradeToHistory, clearServerHistory, fetchTradeHistory }: TradingSignalsTableProps) {
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

    // Trade Execution State
    const [lotSizes, setLotSizes] = useState<Record<string, number>>({});  // key: "ASSET-TF"
    const [executingTrades, setExecutingTrades] = useState<Set<string>>(new Set());
    // Use server trade history (read from props, backed by backend)
    const tradeHistory = serverTradeHistory;
    const [showHistory, setShowHistory] = useState(false);
    const [showPositions, setShowPositions] = useState(true);
    const [showAutoTrades, setShowAutoTrades] = useState(false);
    const [closingTickets, setClosingTickets] = useState<Set<number>>(new Set());
    const [expandedHistoryRows, setExpandedHistoryRows] = useState<Set<string>>(new Set());
    const [editingSymbol, setEditingSymbol] = useState<string | null>(null);
    const [editingBrokerName, setEditingBrokerName] = useState('');
    // Derive autoTrades set from server state
    const autoTrades = useMemo(() => new Set(Object.keys(serverAutoTrades)), [serverAutoTrades]);
    const autoTradesRef = useRef(autoTrades);
    autoTradesRef.current = autoTrades;
    const lotSizesRef = useRef(lotSizes);
    lotSizesRef.current = lotSizes;

    // Track previous positions to detect when they close
    const prevPositionsRef = useRef<MT5Position[]>([]);

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

    // Execute a trade from signal row
    const handleExecuteTrade = useCallback(async (asset: string, tf: string, entry: SignalEntry, isAuto = false) => {
        if (!executeTrade || !mt5Connected) return;

        const tradeComment = `PX-Dash ${asset} ${tf} ${entry.net_signal}`.slice(0, 31);
        const hasPos = mt5Positions?.some(p => p.comment === tradeComment) || false;
        if (hasPos) return;

        const key = `${asset}-${tf}`;
        const lot = lotSizes[key] || 0.01;

        setExecutingTrades(prev => new Set(prev).add(key));

        const newEntry: TradeHistoryEntry = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            symbol: asset, tf, action: entry.net_signal,
            volume: lot, entryPrice: 0,
            sl: entry.stop_loss || null, tp: entry.take_profit || null,
            ticket: null, status: 'pending', executedAt: new Date().toISOString(),
            signalPrice: entry.close,
            autoExecuted: isAuto,
        };

        try {
            const result = await executeTrade(
                asset, entry.net_signal.toUpperCase(), lot,
                entry.stop_loss || undefined, entry.take_profit || undefined,
                tradeComment
            );

            if (result) {
                newEntry.status = 'filled';
                newEntry.ticket = result.ticket;
                newEntry.entryPrice = result.price;
            } else {
                newEntry.status = 'failed';
                newEntry.error = 'Execution returned null';
            }
        } catch (err: any) {
            newEntry.status = 'failed';
            newEntry.error = err?.message || 'Unknown error';
        }

        addTradeToHistory?.(newEntry);
        setExecutingTrades(prev => { const n = new Set(prev); n.delete(key); return n; });
    }, [executeTrade, mt5Connected, lotSizes, addTradeToHistory, mt5Positions]);

    // ─── Bulk Execution Handlers ───
    const handleExecuteAsset = async (asset: string) => {
        if (!executeTrade || !mt5Connected) return;
        const tfs = signalData[asset];
        if (!tfs) return;
        let tfKeys = Object.keys(tfs).sort(sortTF);
        if (actionFilter !== "ALL") tfKeys = tfKeys.filter(tf => tfs[tf].net_signal === actionFilter);
        if (tfFilter !== "ALL") tfKeys = tfKeys.filter(tf => tf === tfFilter);

        for (const tf of tfKeys) {
            const entry = tfs[tf];
            if (!entry.net_signal) continue;
            await handleExecuteTrade(asset, tf, entry, false);
        }
    };

    const handleAutoAsset = async (asset: string) => {
        if (!addAutoTrade || !mt5Connected) return;
        const tfs = signalData[asset];
        if (!tfs) return;
        let tfKeys = Object.keys(tfs).sort(sortTF);
        if (actionFilter !== "ALL") tfKeys = tfKeys.filter(tf => tfs[tf].net_signal === actionFilter);
        if (tfFilter !== "ALL") tfKeys = tfKeys.filter(tf => tf === tfFilter);

        for (const tf of tfKeys) {
            const entry = tfs[tf];
            if (!entry.net_signal) continue;
            const key = `${asset}-${tf}`;
            
            // PREVENT DUPLICATE TICKETS: Skip if already executing or if already in Auto Mode!
            if (executingTrades.has(key)) continue;
            if (serverAutoTrades[key]) continue;

            const lot = lotSizes[key] || 0.01;
            const effectiveSymbol = symbolOverrides[asset] || asset;
            const direction = entry.net_signal;

            // Immediately execute trade!
            setExecutingTrades(prev => new Set(prev).add(key));
            let ticket = '';
            try {
                if (executeTrade) {
                    const tradeComment = `SD ${tf} ${entry.candles_showed || '31'}`;
                    const res = await executeTrade(effectiveSymbol, direction, lot, entry.stop_loss || undefined, entry.take_profit || undefined, tradeComment);
                    if (res && res.ticket) {
                        ticket = String(res.ticket);
                        addTradeToHistory?.({
                            id: `auto-${Date.now()}-${key}`,
                            symbol: asset, tf, action: direction,
                            volume: lot, entryPrice: Number(res.price || 0),
                            sl: entry.stop_loss || null, tp: entry.take_profit || null,
                            ticket: Number(res.ticket), status: 'filled', 
                            executedAt: new Date().toISOString(),
                            signalPrice: entry.close,
                            autoExecuted: true,
                        });
                    }
                }
            } catch (err: any) {
                console.error("Failed initial auto execute", err);
            }
            setExecutingTrades(prev => { const n = new Set(prev); n.delete(key); return n; });

            await addAutoTrade(
                key, effectiveSymbol, tf, lot, direction, 
                entry.close, entry.stop_loss || null, entry.take_profit || null, 
                ticket
            );
        }
    };

    const [closingAllPositions, setClosingAllPositions] = useState(false);
    const handleCloseAllPositions = async () => {
        if (!closeAllPositions || mt5Positions.length === 0) return;
        setClosingAllPositions(true);
        // Note: For history purposes, we close all. The history tracking handles individual tickets in backend.
        await closeAllPositions();
        setClosingAllPositions(false);
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
                border: `1px solid ${tk.accentGlow08}`, boxShadow: `0 0 40px ${tk.accentGlow08}`,
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
    return (<>
        <div className="flex justify-center w-full mt-3 flex-shrink-0">
            <div className="rounded-2xl overflow-hidden relative" style={{
                background: tk.isDark ? "linear-gradient(135deg, #080c15 0%, #0d1225 50%, #0a0f1a 100%)" : `linear-gradient(135deg, ${tk.surface} 0%, ${tk.surfaceElevated} 50%, ${tk.surface} 100%)`,
                border: `1px solid ${tk.accentGlow08}`, boxShadow: `0 0 40px ${tk.accentGlow08}`,
                width: "96%", maxWidth: "1400px"
            }}>
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
                    background: "linear-gradient(90deg, transparent 0%, #6366f1 20%, #ef4444 50%, #6366f1 80%, transparent 100%)", opacity: 0.6,
                }} />

                {/* ═══ HEADER ═══ */}
                <div style={{ borderBottom: "1px solid rgba(99,102,241,0.06)" }}>
                    {/* Row 1: Title + Stats */}
                    <div className="px-6 pt-4 pb-2 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-11 h-11 rounded-xl flex items-center justify-center relative"
                                style={{
                                    background: "linear-gradient(135deg, #ef4444 0%, #6366f1 50%, #a855f7 100%)",
                                    boxShadow: "0 4px 20px rgba(239,68,68,0.2), 0 0 30px rgba(99,102,241,0.1)",
                                }}>
                                <Rocket className="w-5 h-5 text-white" />
                            </motion.div>
                            <div>
                                <h3 className="text-lg font-black tracking-wider flex items-center gap-1" style={{ color: tk.textPrimary, letterSpacing: '0.05em' }}>
                                    PHASE <span className="text-xl" style={{ color: "#ef4444", textShadow: "0 0 20px rgba(239,68,68,0.5)" }}>X</span>
                                    <span className="text-[10px] font-bold tracking-widest uppercase ml-2 px-2 py-0.5 rounded-md" style={{
                                        color: '#818cf8',
                                        background: 'rgba(99,102,241,0.08)',
                                        border: '1px solid rgba(99,102,241,0.12)',
                                    }}>Trading Dashboard</span>
                                </h3>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Stats Badges */}
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.08)' }}>
                                <Zap className="w-3 h-3" style={{ color: '#818cf8' }} />
                                <span className="text-[11px] font-black" style={{ color: '#818cf8' }}>{allAssetNames.length}</span>
                                <span className="text-[10px]" style={{ color: tk.textDim }}>{t("assetsStr")}</span>
                            </div>
                            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.1)' }}>
                                <span className="text-[10px]" style={{ color: '#4ade80' }}>▲</span>
                                <span className="text-[11px] font-black" style={{ color: "#4ade80" }}>{totalBuy}</span>
                            </div>
                            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.1)' }}>
                                <span className="text-[10px]" style={{ color: '#f87171' }}>▼</span>
                                <span className="text-[11px] font-black" style={{ color: "#f87171" }}>{totalSell}</span>
                            </div>
                            <div className="w-px h-5 mx-1" style={{ background: "rgba(99,102,241,0.08)" }} />
                            {/* Live Sync */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{
                                background: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.03) 100%)",
                                border: "1px solid rgba(16,185,129,0.15)",
                            }}>
                                <div className="relative">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" style={{ boxShadow: "0 0 8px rgba(16,185,129,0.6)" }} />
                                    {isFetching && <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                                </div>
                                <span className="text-[10px] font-black tracking-wider uppercase" style={{ color: "#10b981" }}>
                                    {isFetching ? t("syncingStr") : t("live")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Controls */}
                    <div className="px-6 pb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <SciFiClock label={t("lastUpdateStr")} timeMs={lastSystemUpdate} isLive={true} isRTL={isRTL} size="sm" />
                            <SciFiClock label={t("currentTimeStr")} mode="currentTime" isLive={true} isRTL={isRTL} size="sm" />
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Expand/Collapse */}
                            <motion.button onClick={expandAll} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer"
                                style={{ color: "#818cf8", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.1)" }}
                                title={t("expandAllStr")}>
                                <Maximize2 className="w-3.5 h-3.5" />
                            </motion.button>
                            <motion.button onClick={collapseAll} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer"
                                style={{ color: "#818cf8", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.1)" }}
                                title={t("collapseAllStr")}>
                                <Minimize2 className="w-3.5 h-3.5" />
                            </motion.button>

                            {mt5Connected && (
                                <>
                                    <div className="w-px h-6 mx-1" style={{ background: "rgba(99,102,241,0.1)" }} />
                                    {/* Trade History Button */}
                                    <motion.button onClick={() => setShowHistory(true)}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black cursor-pointer"
                                        style={{
                                            color: '#e9d5ff',
                                            background: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(139,92,246,0.08) 100%)',
                                            border: '1px solid rgba(168,85,247,0.25)',
                                            boxShadow: '0 2px 12px rgba(168,85,247,0.12), inset 0 1px 0 rgba(255,255,255,0.05)',
                                        }}>
                                        <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.2)' }}>
                                            <History className="w-3 h-3" style={{ color: '#c084fc' }} />
                                        </div>
                                        <span>History</span>
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(168,85,247,0.2)', color: '#c084fc' }}>{tradeHistory.length}</span>
                                    </motion.button>
                                    {/* Live Positions Button */}
                                    <motion.button onClick={() => setShowPositions(!showPositions)}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black cursor-pointer"
                                        style={{
                                            color: showPositions ? '#fff' : '#a7f3d0',
                                            background: showPositions
                                                ? 'linear-gradient(135deg, rgba(16,185,129,0.3) 0%, rgba(5,150,105,0.2) 100%)'
                                                : 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.06) 100%)',
                                            border: `1px solid ${showPositions ? 'rgba(16,185,129,0.45)' : 'rgba(16,185,129,0.2)'}`,
                                            boxShadow: showPositions
                                                ? '0 2px 12px rgba(16,185,129,0.2), inset 0 1px 0 rgba(255,255,255,0.08)'
                                                : '0 2px 12px rgba(16,185,129,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
                                        }}>
                                        <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{
                                            background: showPositions ? 'rgba(16,185,129,0.25)' : 'rgba(16,185,129,0.15)',
                                        }}>
                                            <Zap className="w-3 h-3" style={{ color: showPositions ? '#fff' : '#34d399' }} />
                                        </div>
                                        <span>Live</span>
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{
                                            background: showPositions ? 'rgba(255,255,255,0.15)' : 'rgba(16,185,129,0.2)',
                                            color: showPositions ? '#fff' : '#34d399',
                                        }}>{mt5Positions.length}</span>
                                        {showPositions
                                            ? <ChevronUp className="w-3 h-3 ml-0.5" />
                                            : <ChevronDown className="w-3 h-3 ml-0.5" />
                                        }
                                    </motion.button>
                                    {/* Auto-Trades Button */}
                                    <motion.button onClick={() => setShowAutoTrades(!showAutoTrades)}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black cursor-pointer"
                                        style={{
                                            color: showAutoTrades ? '#fff' : '#c4b5fd',
                                            background: showAutoTrades
                                                ? 'linear-gradient(135deg, rgba(168,85,247,0.3) 0%, rgba(139,92,246,0.2) 100%)'
                                                : 'linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(139,92,246,0.06) 100%)',
                                            border: `1px solid ${showAutoTrades ? 'rgba(168,85,247,0.45)' : 'rgba(168,85,247,0.2)'}`,
                                            boxShadow: showAutoTrades
                                                ? '0 2px 12px rgba(168,85,247,0.2), inset 0 1px 0 rgba(255,255,255,0.08)'
                                                : '0 2px 12px rgba(168,85,247,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
                                        }}>
                                        <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{
                                            background: showAutoTrades ? 'rgba(168,85,247,0.25)' : 'rgba(168,85,247,0.15)',
                                        }}>
                                            <Zap className="w-3 h-3" style={{ color: showAutoTrades ? '#fff' : '#a855f7' }} />
                                        </div>
                                        <span>Auto</span>
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{
                                            background: showAutoTrades ? 'rgba(255,255,255,0.15)' : 'rgba(168,85,247,0.2)',
                                            color: showAutoTrades ? '#fff' : '#a855f7',
                                        }}>{autoTrades.size}</span>
                                        {showAutoTrades
                                            ? <ChevronUp className="w-3 h-3 ml-0.5" />
                                            : <ChevronDown className="w-3 h-3 ml-0.5" />
                                        }
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* ═══ LIVE POSITIONS INLINE PANEL ═══ */}
                {mt5Connected && showPositions && (
                    <div style={{ borderBottom: '1px solid rgba(16,185,129,0.08)', background: tk.isDark ? 'rgba(16,185,129,0.02)' : 'rgba(16,185,129,0.02)' }}>
                        {/* Account Stats Grid */}
                        {mt5Account && (
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 px-4 pt-3 pb-2">
                                {[
                                    { label: 'Balance', value: `$${(mt5Account.balance || 0).toLocaleString()}`, color: '#10b981' },
                                    { label: 'Equity', value: `$${(mt5Account.equity || 0).toLocaleString()}`, color: '#6366f1' },
                                    { label: 'Profit', value: `$${(mt5Account.profit || 0) >= 0 ? '+' : ''}${(mt5Account.profit || 0).toLocaleString()}`, color: (mt5Account.profit || 0) >= 0 ? '#10b981' : '#ef4444' },
                                    { label: 'Free Margin', value: `$${(mt5Account.free_margin || 0).toLocaleString()}`, color: '#a855f7' },
                                    { label: 'Margin', value: `$${(mt5Account.margin || 0).toLocaleString()}`, color: '#f59e0b' },
                                    { label: 'Leverage', value: `1:${mt5Account.leverage || 0}`, color: '#3b82f6' },
                                ].map((stat) => (
                                    <div key={stat.label} className="rounded-lg px-2.5 py-1.5" style={{ background: tk.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: `1px solid ${tk.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` }}>
                                        <div className="text-[8px] font-bold tracking-widest uppercase" style={{ color: tk.textDim }}>{stat.label}</div>
                                        <div className="text-[13px] font-black" style={{ color: stat.color }}>{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Live Positions Header Actions */}
                        <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid rgba(16,185,129,0.06)' }}>
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: tk.textDim }}>Active Tickets</span>
                            {mt5Positions.length > 0 && closeAllPositions && (
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    disabled={closingAllPositions}
                                    onClick={handleCloseAllPositions}
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black cursor-pointer"
                                    style={{
                                        color: closingAllPositions ? tk.textDim : '#ef4444',
                                        background: closingAllPositions ? tk.surfaceHover : 'rgba(239,68,68,0.1)',
                                        border: `1px solid ${closingAllPositions ? tk.border : 'rgba(239,68,68,0.2)'}`,
                                    }}
                                >
                                    {closingAllPositions ? '...' : <X className="w-2.5 h-2.5" />}
                                    {closingAllPositions ? 'Closing All...' : 'Close All Positions'}
                                </motion.button>
                            )}
                        </div>
                        <div className="overflow-auto" style={{ maxHeight: 240 }}>
                            {mt5Positions.length === 0 ? (
                                <div className="px-5 py-4 text-center">
                                    <span className="text-[11px] font-bold" style={{ color: tk.textDim }}>No open positions</span>
                                </div>
                            ) : (
                                <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                                    <thead className="sticky top-0" style={{ background: tk.isDark ? '#080c15' : tk.surface }}>
                                        <tr style={{ borderBottom: '1px solid rgba(16,185,129,0.06)' }}>
                                            {['Symbol', 'Type', 'Vol', 'Open', 'Current', 'SL', 'TP', 'Profit', 'Swap', ''].map(h => (
                                                <th key={h} className="px-2.5 py-1.5 text-[9px] font-bold tracking-wider uppercase text-left" style={{ color: tk.textDim }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mt5Positions.map((pos) => {
                                            const isProfit = pos.profit >= 0;
                                            const isClosing = closingTickets.has(pos.ticket);
                                            return (
                                                <tr key={pos.ticket} style={{
                                                    borderBottom: `1px solid ${tk.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)'}`,
                                                    background: isProfit ? 'rgba(16,185,129,0.02)' : 'rgba(239,68,68,0.02)',
                                                }}>
                                                    <td className="px-2.5 py-1.5 text-[11px] font-bold" style={{ color: tk.textPrimary }}>{pos.symbol}</td>
                                                    <td className="px-2.5 py-1.5">
                                                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{
                                                            color: pos.type === 'BUY' ? '#10b981' : '#ef4444',
                                                            background: pos.type === 'BUY' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                        }}>{pos.type}</span>
                                                    </td>
                                                    <td className="px-2.5 py-1.5 text-[10px] font-bold font-mono" style={{ color: '#f59e0b' }}>{pos.volume}</td>
                                                    <td className="px-2.5 py-1.5 text-[10px] font-mono" style={{ color: tk.textSecondary }}>{fmt(pos.open_price)}</td>
                                                    <td className="px-2.5 py-1.5 text-[10px] font-mono font-bold" style={{ color: tk.textPrimary }}>{fmt(pos.current_price)}</td>
                                                    <td className="px-2.5 py-1.5 text-[10px] font-mono" style={{ color: pos.sl ? '#ef4444' : tk.textDim }}>{pos.sl ? fmt(pos.sl) : '—'}</td>
                                                    <td className="px-2.5 py-1.5 text-[10px] font-mono" style={{ color: pos.tp ? '#10b981' : tk.textDim }}>{pos.tp ? fmt(pos.tp) : '—'}</td>
                                                    <td className="px-2.5 py-1.5">
                                                        <span className="text-[10px] font-black font-mono" style={{ color: isProfit ? '#10b981' : '#ef4444' }}>
                                                            {isProfit ? '+' : ''}{pos.profit.toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="px-2.5 py-1.5 text-[9px] font-mono" style={{ color: tk.textDim }}>{pos.swap.toFixed(2)}</td>
                                                    <td className="px-2.5 py-1.5">
                                                        <motion.button
                                                            whileTap={{ scale: 0.95 }}
                                                            disabled={isClosing || !closePosition}
                                                            onClick={async () => {
                                                                if (!closePosition) return;
                                                                setClosingTickets(prev => new Set(prev).add(pos.ticket));
                                                                const success = await closePosition(pos.ticket);
                                                                if (success) {
                                                                    // Record close in trade history with profit
                                                                    const closeEntry: TradeHistoryEntry = {
                                                                        id: `close-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                                                                        symbol: pos.symbol,
                                                                        tf: '-',
                                                                        action: pos.type === 'BUY' ? 'Buy' : 'Sell',
                                                                        volume: pos.volume,
                                                                        entryPrice: pos.open_price,
                                                                        sl: pos.sl || null,
                                                                        tp: pos.tp || null,
                                                                        ticket: pos.ticket,
                                                                        status: 'closed',
                                                                        executedAt: pos.time_open || new Date().toISOString(),
                                                                        signalPrice: pos.open_price,
                                                                        profit: pos.profit,
                                                                        closePrice: pos.current_price,
                                                                        closedAt: new Date().toISOString(),
                                                                    };
                                                                    // Also update any existing open entry for this ticket (backend handles close detection)
                                                                    // Add close entry to backend history
                                                                    addTradeToHistory?.(closeEntry);
                                                                }
                                                                setClosingTickets(prev => { const n = new Set(prev); n.delete(pos.ticket); return n; });
                                                            }}
                                                            className="flex items-center gap-0.5 px-2 py-0.5 rounded text-[9px] font-black cursor-pointer"
                                                            style={{
                                                                color: isClosing ? tk.textDim : '#ef4444',
                                                                background: isClosing ? tk.surfaceHover : 'rgba(239,68,68,0.08)',
                                                                border: `1px solid ${isClosing ? tk.border : 'rgba(239,68,68,0.15)'}`,
                                                                opacity: isClosing ? 0.5 : 1,
                                                            }}>
                                                            {isClosing ? '⏳' : <X className="w-2.5 h-2.5" />}
                                                            {isClosing ? '...' : 'Close'}
                                                        </motion.button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* ═══ ACTIVE AUTO-TRADES INLINE PANEL ═══ */}
                {mt5Connected && showAutoTrades && (
                    <div style={{ borderBottom: '1px solid rgba(168,85,247,0.08)', background: tk.isDark ? 'rgba(168,85,247,0.02)' : 'rgba(168,85,247,0.02)' }}>
                        <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid rgba(168,85,247,0.06)' }}>
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: tk.textDim }}>Active Background Auto-Trades</span>
                        </div>
                        <div className="overflow-auto" style={{ maxHeight: 240 }}>
                            {Object.keys(serverAutoTrades).length === 0 ? (
                                <div className="px-5 py-4 text-center">
                                    <span className="text-[11px] font-bold" style={{ color: tk.textDim }}>No active background trades</span>
                                </div>
                            ) : (
                                <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                                    <thead className="sticky top-0" style={{ background: tk.isDark ? '#080c15' : tk.surface }}>
                                        <tr style={{ borderBottom: '1px solid rgba(168,85,247,0.06)' }}>
                                            {['Key', 'Symbol', 'TF', 'Type', 'Target Entry', 'Vol', 'Status', 'Ticket', 'Stop Auto'].map(h => (
                                                <th key={h} className="px-2.5 py-1.5 text-[9px] font-bold tracking-wider uppercase text-left" style={{ color: tk.textDim }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(serverAutoTrades).map(([key, autoTrade]) => {
                                            const isBuy = autoTrade.direction?.toLowerCase() === 'buy';
                                            return (
                                                <tr key={key} style={{
                                                    borderBottom: `1px solid ${tk.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)'}`,
                                                }}>
                                                    <td className="px-2.5 py-1.5 text-[10px] font-mono font-bold" style={{ color: tk.textSecondary }}>{key}</td>
                                                    <td className="px-2.5 py-1.5 text-[11px] font-bold" style={{ color: tk.textPrimary }}>{autoTrade.symbol}</td>
                                                    <td className="px-2.5 py-1.5 text-[10px] font-bold" style={{ color: tk.textSecondary }}>{autoTrade.tf}</td>
                                                    <td className="px-2.5 py-1.5">
                                                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{
                                                            color: isBuy ? '#10b981' : '#ef4444',
                                                            background: isBuy ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                        }}>{autoTrade.direction?.toUpperCase() || 'UNKNOWN'}</span>
                                                    </td>
                                                    <td className="px-2.5 py-1.5 text-[10px] font-mono" style={{ color: tk.textPrimary }}>{autoTrade.signal_price ? fmt(autoTrade.signal_price) : '—'}</td>
                                                    <td className="px-2.5 py-1.5 text-[10px] font-bold font-mono" style={{ color: '#f59e0b' }}>{autoTrade.lot || 0.01}</td>
                                                    <td className="px-2.5 py-1.5">
                                                        <span 
                                                            className="text-[9px] font-bold px-1.5 py-0.5 rounded cursor-help" 
                                                            title={autoTrade.last_error || 'No recent errors'}
                                                            style={{
                                                                color: autoTrade.status === 'executed' || autoTrade.status === 'watching' ? '#10b981' : autoTrade.status?.startsWith('failed') ? '#ef4444' : '#a855f7',
                                                                background: autoTrade.status === 'executed' || autoTrade.status === 'watching' ? 'rgba(16,185,129,0.1)' : autoTrade.status?.startsWith('failed') ? 'rgba(239,68,68,0.1)' : 'rgba(168,85,247,0.1)',
                                                            }}
                                                        >
                                                            {autoTrade.status || 'watching'}
                                                        </span>
                                                    </td>
                                                    <td className="px-2.5 py-1.5 text-[10px] font-mono" style={{ color: tk.textSecondary }}>{autoTrade.active_ticket || autoTrade.ticket || '—'}</td>
                                                    <td className="px-2.5 py-1.5">
                                                        <motion.button
                                                            whileTap={{ scale: 0.95 }}
                                                            disabled={!removeAutoTrade}
                                                            onClick={async () => {
                                                                if (removeAutoTrade) await removeAutoTrade(key);
                                                            }}
                                                            className="flex items-center gap-0.5 px-2 py-0.5 rounded text-[9px] font-black cursor-pointer"
                                                            style={{
                                                                color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)'
                                                            }}>
                                                            <X className="w-2.5 h-2.5" /> Stop
                                                        </motion.button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* ═══ FILTERS ═══ */}
                <div className="px-5 py-4 mt-3 flex flex-wrap items-center gap-2.5 rounded-t-lg mx-0" style={{
                    borderTop: "2px solid rgba(99,102,241,0.25)",
                    background: "linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(168,85,247,0.025) 50%, rgba(99,102,241,0.05) 100%)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
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
                        <thead className="sticky top-0 z-10">
                            <tr style={{ borderBottom: "2px solid rgba(99,102,241,0.3)", background: tk.isDark ? 'linear-gradient(180deg, rgba(10,16,30,1) 0%, rgba(6,10,20,0.98) 100%)' : tk.surface }}>
                                <th className="p-3 text-[13px] font-black text-left tracking-wider uppercase" style={{ color: '#818cf8', textShadow: '0 0 12px rgba(99,102,241,0.3)' }}>{t("assetCol")}</th>
                                <th className="p-3 text-[13px] font-black text-center tracking-wider uppercase" style={{ color: '#818cf8', textShadow: '0 0 12px rgba(99,102,241,0.3)' }}>{t("actionStr")}</th>
                                <th className="p-3 text-[13px] font-black text-left tracking-wider uppercase" style={{ color: '#818cf8', textShadow: '0 0 12px rgba(99,102,241,0.3)' }}>{t("timeStr")}</th>
                                <th className="p-3 text-[13px] font-black text-right tracking-wider uppercase" style={{ color: '#818cf8', textShadow: '0 0 12px rgba(99,102,241,0.3)' }}>{t("priceStr")}</th>
                                <th className="p-3 text-[13px] font-black text-right tracking-wider uppercase" style={{ color: '#ef4444', textShadow: '0 0 10px rgba(239,68,68,0.25)' }}>SL</th>
                                <th className="p-3 text-[13px] font-black text-right tracking-wider uppercase" style={{ color: '#10b981', textShadow: '0 0 10px rgba(16,185,129,0.25)' }}>TP</th>
                                <th className="p-3 text-[13px] font-black text-right tracking-wider uppercase" style={{ color: '#38bdf8', textShadow: '0 0 10px rgba(56,189,248,0.2)' }}>m.PRICE</th>
                                <th className="p-3 text-[13px] font-black text-right tracking-wider uppercase" style={{ color: '#f59e0b', textShadow: '0 0 10px rgba(245,158,11,0.25)' }}>{t("profitStr")}</th>
                                {mt5Connected && (
                                    <>
                                        <th className="p-3 text-[13px] font-black text-center tracking-wider uppercase" style={{ color: '#fbbf24', textShadow: '0 0 10px rgba(251,191,36,0.3)', borderLeft: '2px solid rgba(245,158,11,0.25)' }}>Lot</th>
                                        <th className="p-3 text-[13px] font-black text-center tracking-wider uppercase" style={{ color: '#818cf8', textShadow: '0 0 10px rgba(99,102,241,0.3)' }}>Execute</th>
                                        <th className="p-3 text-[13px] font-black text-center tracking-wider uppercase" style={{ color: '#a855f7', textShadow: '0 0 10px rgba(168,85,247,0.3)' }}>Auto</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAssets.length === 0 ? (
                                <tr><td colSpan={mt5Connected ? 11 : 8} className="p-8 text-center text-sm" style={{ color: "#334155" }}>{t("noResults")}</td></tr>
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
                                            <td colSpan={mt5Connected ? 11 : 8} className="p-3 px-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xl leading-none">{icon}</span>
                                                        <span className="text-sm font-black tracking-wide" style={{ color: tk.textPrimary, letterSpacing: "0.05em" }}>{asset}</span>
                                                        {/* Broker Symbol Mapping */}
                                                        {mt5Connected && (
                                                            editingSymbol === asset ? (
                                                                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                                    <span className="text-[9px]" style={{ color: tk.textDim }}>→</span>
                                                                    <input
                                                                        autoFocus
                                                                        value={editingBrokerName}
                                                                        onChange={(e) => setEditingBrokerName(e.target.value)}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter' && editingBrokerName.trim() && setSymbolOverride) {
                                                                                setSymbolOverride(asset, editingBrokerName.trim());
                                                                                setEditingSymbol(null);
                                                                            } else if (e.key === 'Escape') {
                                                                                setEditingSymbol(null);
                                                                            }
                                                                        }}
                                                                        placeholder="Broker symbol..."
                                                                        className="px-2 py-0.5 rounded text-[10px] font-mono font-bold outline-none"
                                                                        style={{
                                                                            background: 'rgba(99,102,241,0.1)',
                                                                            border: '1px solid rgba(99,102,241,0.3)',
                                                                            color: '#a5b4fc',
                                                                            width: 110,
                                                                        }}
                                                                    />
                                                                    <motion.button whileTap={{ scale: 0.9 }}
                                                                        onClick={() => {
                                                                            if (editingBrokerName.trim() && setSymbolOverride) {
                                                                                setSymbolOverride(asset, editingBrokerName.trim());
                                                                            }
                                                                            setEditingSymbol(null);
                                                                        }}
                                                                        className="w-5 h-5 flex items-center justify-center rounded cursor-pointer"
                                                                        style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)' }}>
                                                                        <Check className="w-3 h-3" />
                                                                    </motion.button>
                                                                    <motion.button whileTap={{ scale: 0.9 }}
                                                                        onClick={() => setEditingSymbol(null)}
                                                                        className="w-5 h-5 flex items-center justify-center rounded cursor-pointer"
                                                                        style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>
                                                                        <X className="w-3 h-3" />
                                                                    </motion.button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                                    {symbolOverrides[asset.toUpperCase()] && (
                                                                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{
                                                                            color: '#34d399',
                                                                            background: 'rgba(16,185,129,0.08)',
                                                                            border: '1px solid rgba(16,185,129,0.12)',
                                                                        }}>→ {symbolOverrides[asset.toUpperCase()]}</span>
                                                                    )}
                                                                    <motion.button whileTap={{ scale: 0.9 }}
                                                                        onClick={() => {
                                                                            setEditingSymbol(asset);
                                                                            setEditingBrokerName(symbolOverrides[asset.toUpperCase()] || '');
                                                                        }}
                                                                        className="w-4 h-4 flex items-center justify-center rounded cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
                                                                        style={{ color: '#818cf8' }}
                                                                        title="Set broker symbol name">
                                                                        <Edit2 className="w-2.5 h-2.5" />
                                                                    </motion.button>
                                                                </div>
                                                            )
                                                        )}
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
                                                    <div className="flex items-center gap-3">
                                                        {mt5Connected && (
                                                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                                                <motion.button onClick={() => handleExecuteAsset(asset)}
                                                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black cursor-pointer"
                                                                    style={{ color: "#10b981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
                                                                    title="Execute all signals for this asset"
                                                                >
                                                                    <Play className="w-2.5 h-2.5" /> Execute {asset}
                                                                </motion.button>
                                                                <motion.button onClick={() => handleAutoAsset(asset)}
                                                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black cursor-pointer"
                                                                    style={{ color: "#a855f7", background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}
                                                                    title="Auto-trade all signals for this asset"
                                                                >
                                                                    <Zap className="w-2.5 h-2.5" /> Auto {asset}
                                                                </motion.button>
                                                            </div>
                                                        )}
                                                        {isCollapsed ? <ChevronDown className="w-4 h-4" style={{ color: "#6366f1" }} /> : <ChevronUp className="w-4 h-4" style={{ color: "#6366f1" }} />}
                                                    </div>
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
                                                            color: isBuy ? tk.positive : isSell ? tk.negative : tk.textDim,
                                                            background: isBuy ? tk.positiveBg : isSell ? tk.negativeBg : "transparent",
                                                            border: isBuy ? `1px solid ${tk.positiveBorder}` : isSell ? `1px solid ${tk.negativeBorder}` : "1px solid transparent",
                                                            textShadow: tk.isDark ? (isBuy ? `0 0 10px ${tk.positiveBg}` : isSell ? `0 0 10px ${tk.negativeBg}` : "none") : "none",
                                                        }}>{entry.net_signal || "—"}</span>
                                                    </td>
                                                    <td className="p-2.5 text-xs font-mono font-medium" style={{ color: tk.textSecondary }}>{entry.time}</td>
                                                    <td className="p-2.5 text-sm font-black font-mono text-right tabular-nums" style={{ color: tk.textBright }}>{fmt(entry.close)}</td>
                                                    <td className="p-2.5 text-xs font-bold font-mono text-right tabular-nums" style={{ color: entry.stop_loss ? tk.negative : tk.textDim }}>{entry.stop_loss ? fmt(entry.stop_loss) : "—"}</td>
                                                    <td className="p-2.5 text-xs font-bold font-mono text-right tabular-nums" style={{ color: entry.take_profit ? tk.positive : tk.textDim }}>{entry.take_profit ? fmt(entry.take_profit) : "—"}</td>
                                                    <td className="p-2.5 text-xs font-bold font-mono text-right tabular-nums">
                                                        <PriceCell price={mPrice} isLive={!!liveMatch} fmt={fmt} />
                                                    </td>
                                                    <td className="p-2.5 text-right">
                                                        <span className="text-xs font-black font-mono tabular-nums px-2.5 py-1 rounded-lg" style={{
                                                            color: profitPos ? tk.positive : tk.negative,
                                                            background: profitPos ? tk.positiveBg : tk.negativeBg,
                                                            border: profitPos ? `1px solid ${tk.positiveBorder}` : `1px solid ${tk.negativeBorder}`,
                                                            textShadow: tk.isDark ? (profitPos ? `0 0 8px ${tk.positiveBg}` : `0 0 8px ${tk.negativeBg}`) : "none",
                                                        }}>{profit !== 0 ? `${profitPos ? "+" : ""}${fmt(Math.abs(profit))}` : "—"}</span>
                                                    </td>
                                                    {mt5Connected && (() => {
                                                        const rowKey = `${asset}-${tf}`;
                                                        const effectiveSymbol = symbolOverrides[asset] || asset;
                                                        const isExecuting = executingTrades.has(rowKey);
                                                        const isAuto = autoTrades.has(rowKey);
                                                        const lotVal = lotSizes[rowKey] ?? 0.01;
                                                        const tradeComment = `PX-Dash ${asset} ${tf} ${entry.net_signal}`.slice(0, 31);
                                                        const hasPos = mt5Positions?.some(p => p.comment === tradeComment) || false;
                                                        const disableExec = isExecuting || hasPos;
                                                        return (
                                                            <>
                                                                {/* Lot */}
                                                                <td className="p-2.5 text-center" style={{ borderLeft: '2px solid rgba(245,158,11,0.2)' }}>
                                                                    <input
                                                                        type="number" step="0.01" min="0.01" max="100"
                                                                        value={lotVal}
                                                                        onChange={(e) => setLotSizes(prev => ({ ...prev, [rowKey]: Math.max(0.01, parseFloat(e.target.value) || 0.01) }))}
                                                                        className="w-16 text-center text-[11px] font-bold font-mono py-1 px-1 rounded-lg outline-none"
                                                                        style={{
                                                                            background: 'rgba(245,158,11,0.08)',
                                                                            border: '1px solid rgba(245,158,11,0.25)',
                                                                            color: '#fbbf24',
                                                                        }}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    />
                                                                </td>
                                                                <td className="p-2.5 text-center">
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        disabled={disableExec}
                                                                        title={hasPos ? '✅ صفقة منفذة بالفعل' : undefined}
                                                                        onClick={(e) => { e.stopPropagation(); handleExecuteTrade(asset, tf, entry); }}
                                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer"
                                                                        style={{
                                                                            color: disableExec ? tk.textDim : isBuy ? '#10b981' : '#ef4444',
                                                                            background: disableExec ? tk.surfaceHover : isBuy ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                                            border: `1px solid ${disableExec ? tk.border : isBuy ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                                                                            opacity: disableExec ? 0.6 : 1,
                                                                        }}
                                                                    >
                                                                        {isExecuting ? (
                                                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
                                                                                <Zap className="w-3 h-3" />
                                                                            </motion.div>
                                                                        ) : hasPos ? (
                                                                            <CheckCircle className="w-3 h-3" />
                                                                        ) : (
                                                                            <Play className="w-3 h-3" />
                                                                        )}
                                                                        {isExecuting ? '...' : hasPos ? 'DONE' : isBuy ? 'BUY' : 'SELL'}
                                                                    </motion.button>
                                                                </td>
                                                                {/* Auto */}
                                                                <td className="p-2.5 text-center" style={{ minWidth: 100 }}>
                                                                    {(() => {
                                                                        // Calculate progress when auto is ON
                                                                        let progress = 0;
                                                                        if (isAuto && entry.net_signal && mPrice > 0 && entry.close > 0) {
                                                                            const diff = Math.abs(mPrice - entry.close);
                                                                            const range = entry.close * 0.02; // 2% range as baseline
                                                                            if (entry.net_signal === 'Buy') {
                                                                                // Buy: closer when price drops TO signal price
                                                                                progress = mPrice <= entry.close ? 100 : Math.max(0, Math.min(99, (1 - diff / range) * 100));
                                                                            } else {
                                                                                // Sell: closer when price rises TO signal price
                                                                                progress = mPrice >= entry.close ? 100 : Math.max(0, Math.min(99, (1 - diff / range) * 100));
                                                                            }
                                                                        }
                                                                        const isNear = progress >= 80;
                                                                        return (
                                                                            <div className="flex flex-col items-center gap-1">
                                                                                <motion.button
                                                                                    whileHover={{ scale: 1.05 }}
                                                                                    whileTap={{ scale: 0.95 }}
                                                                                    onClick={async (e) => {
                                                                                        e.stopPropagation();
                                                                                        if (!mt5Connected) return;
                                                                                        const rowKey = `${asset}-${tf}`;
                                                                                        
                                                                                        if (isAuto) {
                                                                                            removeAutoTrade?.(rowKey);
                                                                                        } else {
                                                                                            // PREVENT DUPLICATE EXECUTION: Skip if currently dispatching or already auto-trading from server!
                                                                                            if (executingTrades.has(rowKey) || serverAutoTrades[rowKey]) return;
                                                                                            
                                                                                            const lot = lotSizes[rowKey] || 0.01;
                                                                                            const direction = entry.net_signal || '';
                                                                                            
                                                                                            setExecutingTrades(prev => new Set(prev).add(rowKey));
                                                                                            let ticket = '';
                                                                                            if (executeTrade) {
                                                                                                const tradeComment = `SD ${tf} ${entry.candles_showed || '31'}`;
                                                                                                executeTrade(effectiveSymbol, direction, lot, entry.stop_loss || undefined, entry.take_profit || undefined, tradeComment).then(res => {
                                                                                                    if (res && res.ticket) {
                                                                                                        ticket = String(res.ticket);
                                                                                                        addTradeToHistory?.({
                                                                                                            id: `auto-${Date.now()}-${rowKey}`,
                                                                                                            symbol: asset, tf, action: direction,
                                                                                                            volume: lot, entryPrice: Number(res.price || 0),
                                                                                                            sl: entry.stop_loss || null, tp: entry.take_profit || null,
                                                                                                            ticket: Number(res.ticket), status: 'filled', 
                                                                                                            executedAt: new Date().toISOString(),
                                                                                                            signalPrice: entry.close,
                                                                                                            autoExecuted: true,
                                                                                                        });
                                                                                                    }
                                                                                                    
                                                                                                    addAutoTrade?.(
                                                                                                        rowKey, effectiveSymbol, tf, lot, direction, 
                                                                                                        entry.close, entry.stop_loss || null, entry.take_profit || null, 
                                                                                                        ticket
                                                                                                    );
                                                                                                    setExecutingTrades(prev => { const n = new Set(prev); n.delete(rowKey); return n; });
                                                                                                }).catch(err => {
                                                                                                    console.error("Failed initial auto execute", err);
                                                                                                    addAutoTrade?.(
                                                                                                        rowKey, effectiveSymbol, tf, lot, direction, 
                                                                                                        entry.close, entry.stop_loss || null, entry.take_profit || null, 
                                                                                                        ""
                                                                                                    );
                                                                                                    setExecutingTrades(prev => { const n = new Set(prev); n.delete(rowKey); return n; });
                                                                                                });
                                                                                            } else {
                                                                                                addAutoTrade?.(
                                                                                                    rowKey, effectiveSymbol, tf, lot, direction, 
                                                                                                    entry.close, entry.stop_loss || null, entry.take_profit || null, 
                                                                                                    Object.keys(autoTrades).length.toString()
                                                                                                );
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black cursor-pointer"
                                                                                    style={{
                                                                                        color: isAuto ? '#a855f7' : tk.textDim,
                                                                                        background: isAuto ? 'rgba(168,85,247,0.1)' : 'transparent',
                                                                                        border: `1px solid ${isAuto ? 'rgba(168,85,247,0.2)' : tk.border}`,
                                                                                    }}
                                                                                >
                                                                                    {isAuto ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                                                                                    {isAuto ? 'ON' : 'OFF'}
                                                                                </motion.button>
                                                                                {isAuto && (
                                                                                    <div className="w-full">
                                                                                        <div className="relative w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(168,85,247,0.1)' }}>
                                                                                            <motion.div
                                                                                                className="h-full rounded-full"
                                                                                                style={{
                                                                                                    width: `${Math.max(5, progress)}%`,
                                                                                                    background: isNear
                                                                                                        ? 'linear-gradient(90deg, #a855f7, #10b981)'
                                                                                                        : 'linear-gradient(90deg, rgba(168,85,247,0.4), #a855f7)',
                                                                                                    boxShadow: isNear ? '0 0 8px rgba(16,185,129,0.5)' : '0 0 4px rgba(168,85,247,0.3)',
                                                                                                }}
                                                                                                animate={isNear ? { opacity: [1, 0.6, 1] } : {}}
                                                                                                transition={isNear ? { duration: 0.8, repeat: Infinity } : {}}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="text-[8px] font-bold mt-0.5 text-center" style={{ color: isNear ? '#10b981' : '#a855f7' }}>
                                                                                            {Math.round(progress)}%
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                </td>
                                                            </>
                                                        );
                                                    })()}
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

        {/* ═══ TRADE HISTORY MODAL ═══ */}
        {showHistory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                onClick={() => setShowHistory(false)}>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="relative w-[90vw] max-w-[900px] max-h-[75vh] rounded-2xl overflow-hidden"
                    style={{ background: tk.isDark ? '#0a0e1a' : '#fff', border: '1px solid rgba(168,85,247,0.15)', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}
                    onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(168,85,247,0.1)', background: 'rgba(168,85,247,0.03)' }}>
                        <div className="flex items-center gap-2">
                            <History className="w-5 h-5" style={{ color: '#a855f7' }} />
                            <span className="text-sm font-black tracking-wide" style={{ color: '#a855f7' }}>Trade History ({tradeHistory.length})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {tradeHistory.length > 0 && (
                                <>
                                    <motion.button whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            const headers = ['Symbol', 'TF', 'Action', 'Lot', 'Signal Price', 'Entry Price', 'Close Price', 'SL', 'TP', 'Profit', 'Ticket', 'Status', 'Executed At', 'Closed At'];
                                            const rows = tradeHistory.map(t => [
                                                t.symbol, t.tf, t.action, t.volume,
                                                t.signalPrice || '', t.entryPrice || '', t.closePrice || '',
                                                t.sl || '', t.tp || '', t.profit ?? '',
                                                t.ticket || '', t.status, t.executedAt, t.closedAt || ''
                                            ].map(v => `"${v}"`).join(','));
                                            const csv = [headers.join(','), ...rows].join('\n');
                                            const blob = new Blob([csv], { type: 'text/csv' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `phasex_trade_history_${new Date().toISOString().slice(0, 10)}.csv`;
                                            a.click();
                                            URL.revokeObjectURL(url);
                                        }}
                                        className="flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-lg cursor-pointer"
                                        style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)' }}
                                    ><Download className="w-3 h-3" /> CSV</motion.button>
                                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => clearServerHistory?.()}
                                        className="text-[10px] font-bold px-3 py-1 rounded-lg cursor-pointer"
                                        style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.15)' }}
                                    >Clear All</motion.button>
                                </>
                            )}
                            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowHistory(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer"
                                style={{ color: tk.textDim, background: tk.surfaceHover }}>
                                <X className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                    {/* Body */}
                    <div className="overflow-auto" style={{ maxHeight: 'calc(75vh - 60px)' }}>
                        {tradeHistory.length === 0 ? (
                            <div className="py-16 text-center">
                                <History className="w-10 h-10 mx-auto mb-3" style={{ color: tk.textDim, opacity: 0.4 }} />
                                <span className="text-sm font-bold" style={{ color: tk.textDim }}>No trades executed yet</span>
                            </div>
                        ) : (
                            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                                <thead className="sticky top-0" style={{ background: tk.isDark ? '#0a0e1a' : '#fff' }}>
                                    <tr style={{ borderBottom: '1px solid rgba(99,102,241,0.06)' }}>
                                        {['', 'Symbol', 'TF', 'Action', 'Lot', 'Entry', 'Close', 'Profit', 'Ticket', 'Time', 'Status'].map(h => (
                                            <th key={h} className="px-3 py-2.5 text-[10px] font-bold tracking-wider uppercase text-left" style={{ color: tk.textDim }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tradeHistory.map((th) => {
                                        const isExpanded = expandedHistoryRows.has(th.id);
                                        return (
                                            <React.Fragment key={th.id}>
                                                <tr style={{ borderBottom: isExpanded ? 'none' : `1px solid ${tk.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'}` }}>
                                                    <td className="px-2 py-2.5">
                                                        <motion.button whileTap={{ scale: 0.9 }}
                                                            onClick={() => setExpandedHistoryRows(prev => {
                                                                const n = new Set(prev);
                                                                n.has(th.id) ? n.delete(th.id) : n.add(th.id);
                                                                return n;
                                                            })}
                                                            className="w-5 h-5 flex items-center justify-center rounded cursor-pointer"
                                                            style={{ color: '#818cf8', background: 'rgba(99,102,241,0.08)' }}>
                                                            <Info className="w-3 h-3" />
                                                        </motion.button>
                                                    </td>
                                                    <td className="px-3 py-2.5 text-[11px] font-bold" style={{ color: tk.textPrimary }}>{th.symbol}</td>
                                                    <td className="px-3 py-2.5 text-[10px] font-mono font-bold" style={{ color: '#a5b4fc' }}>{th.tf}</td>
                                                    <td className="px-3 py-2.5">
                                                        <span className="text-[9px] font-black px-2 py-0.5 rounded" style={{
                                                            color: th.action === 'Buy' ? '#10b981' : '#ef4444',
                                                            background: th.action === 'Buy' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                        }}>{th.action}</span>
                                                    </td>
                                                    <td className="px-3 py-2.5 text-[11px] font-bold font-mono" style={{ color: '#f59e0b' }}>{th.volume}</td>
                                                    <td className="px-3 py-2.5 text-[11px] font-mono font-bold" style={{ color: tk.textPrimary }}>{th.entryPrice ? fmt(th.entryPrice) : '—'}</td>
                                                    <td className="px-3 py-2.5 text-[11px] font-mono" style={{ color: tk.textSecondary }}>{th.closePrice ? fmt(th.closePrice) : '—'}</td>
                                                    <td className="px-3 py-2.5">
                                                        {th.profit != null ? (
                                                            <span className="text-[11px] font-black font-mono px-2 py-0.5 rounded" style={{
                                                                color: th.profit >= 0 ? '#10b981' : '#ef4444',
                                                                background: th.profit >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                            }}>
                                                                {th.profit >= 0 ? '+' : ''}{th.profit.toFixed(2)}$
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] font-mono" style={{ color: tk.textDim }}>—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2.5 text-[11px] font-mono" style={{ color: '#6366f1' }}>{th.ticket || '—'}</td>
                                                    <td className="px-3 py-2.5 text-[10px] font-mono" style={{ color: tk.textSecondary }}>
                                                        {new Date(th.executedAt).toLocaleString()}
                                                    </td>
                                                    <td className="px-3 py-2.5">
                                                        <div className="flex flex-wrap items-center gap-1">
                                                            <span className="text-[9px] font-black px-2 py-0.5 rounded" style={{
                                                                color: th.status === 'filled' ? '#10b981' : th.status === 'closed' ? '#6366f1' : th.status === 'pending' ? '#f59e0b' : '#ef4444',
                                                                background: th.status === 'filled' ? 'rgba(16,185,129,0.1)' : th.status === 'closed' ? 'rgba(99,102,241,0.1)' : th.status === 'pending' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                                                            }}>
                                                                {th.status === 'filled' ? '✓ OPEN' : th.status === 'closed' ? '✔ CLOSED' : th.status === 'pending' ? '⏳ PENDING' : `✗ ${th.error?.slice(0, 30) || 'FAILED'}`}
                                                            </span>
                                                            {th.autoExecuted && (
                                                                <span className="text-[8px] font-black px-1.5 py-0.5 rounded" style={{ color: '#a855f7', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.15)' }}>
                                                                    ⚡ AUTO
                                                                </span>
                                                            )}
                                                            {th.signalFulfilled != null && th.status === 'closed' && (
                                                                <span className="text-[8px] font-black px-1.5 py-0.5 rounded" style={{
                                                                    color: th.signalFulfilled ? '#10b981' : '#ef4444',
                                                                    background: th.signalFulfilled ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                                    border: `1px solid ${th.signalFulfilled ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
                                                                }}>
                                                                    {th.signalFulfilled ? '✓ TP HIT' : '✗ SL HIT'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                                {/* Signal Details Row */}
                                                {isExpanded && (
                                                    <tr style={{ borderBottom: `1px solid ${tk.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'}` }}>
                                                        <td colSpan={11} className="px-6 py-2" style={{ background: tk.isDark ? 'rgba(99,102,241,0.03)' : 'rgba(99,102,241,0.02)' }}>
                                                            <div className="flex items-center gap-6 text-[10px] font-mono">
                                                                <span style={{ color: tk.textDim }}>📡 Signal Details:</span>
                                                                <span style={{ color: tk.textSecondary }}>Signal Price: <b style={{ color: tk.textPrimary }}>{fmt(th.signalPrice)}</b></span>
                                                                <span style={{ color: '#ef4444' }}>SL: <b>{th.sl ? fmt(th.sl) : '—'}</b></span>
                                                                <span style={{ color: '#10b981' }}>TP: <b>{th.tp ? fmt(th.tp) : '—'}</b></span>
                                                                {th.closedAt && <span style={{ color: tk.textDim }}>Closed: <b>{new Date(th.closedAt).toLocaleString()}</b></span>}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </motion.div>
            </div>
        )}


    </>);
}
