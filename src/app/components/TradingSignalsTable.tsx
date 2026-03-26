import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, CheckCircle, FileJson, ChevronDown, ChevronUp, Rocket, Search, X, Maximize2, Minimize2, Zap, Play, ToggleLeft, ToggleRight, Clock, History, Download, Info, Edit2, Check, Trash2, TrendingUp, TrendingDown, Target, Hash, AlertTriangle } from "lucide-react";
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
    stopAllAutoTrades?: () => Promise<boolean>;
    // Server-side auto-trade
    serverAutoTrades?: any[];
    autoTradeWorker?: any;
    addAutoTrade?: (key: string, symbol: string, tf: string, lot: number, direction: string, signalPrice: number, sl?: number | null, tp?: number | null, ticket?: string) => Promise<boolean>;
    addAutoTradesBulk?: (trades: any[]) => Promise<boolean>;
    removeAutoTrade?: (comments: string[]) => Promise<void>;
    // Server-side trade history
    serverTradeHistory?: any[];
    addTradeToHistory?: (entry: any) => Promise<boolean>;
    clearServerHistory?: () => Promise<boolean>;
    fetchTradeHistory?: () => Promise<void>;
    // Server-side Logs
    serverAutoLogs?: any[];
    fetchAutoLogs?: () => Promise<void>;
}

/* ═══════════ Component ═══════════ */
export function TradingSignalsTable({ mt5Connected = false, executeTrade, mt5Positions = [], closePosition, closeAllPositions, symbolOverrides = {}, setSymbolOverride, mt5Account, stopAllAutoTrades, serverAutoTrades = [], autoTradeWorker, addAutoTrade, addAutoTradesBulk, removeAutoTrade, serverTradeHistory = [], addTradeToHistory, clearServerHistory, fetchTradeHistory, serverAutoLogs = [], fetchAutoLogs }: TradingSignalsTableProps) {
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
    const [executingAssetBulk, setExecutingAssetBulk] = useState<string | null>(null);
    const [globalAutoCooldown, setGlobalAutoCooldown] = useState(false);

    // Optimistic UI Locks
    const [localAutoActive, setLocalAutoActive] = useState<Set<string>>(new Set());
    const [localPosActive, setLocalPosActive] = useState<Set<string>>(new Set());
    
    // Use server trade history (read from props, backed by backend)
    const tradeHistory = serverTradeHistory || [];
    const [showHistory, setShowHistory] = useState(false);
    const [historyLimit, setHistoryLimit] = useState(100);
    const [showPositions, setShowPositions] = useState(true);
    const [showAutoTrades, setShowAutoTrades] = useState(false);
    const [showAutoLogs, setShowAutoLogs] = useState(false);
    const [autoFilterSymbol, setAutoFilterSymbol] = useState('ALL');
    const [autoFilterDir, setAutoFilterDir] = useState('ALL');
    const [autoFilterSource, setAutoFilterSource] = useState('ALL');
    const [posFilterSymbol, setPosFilterSymbol] = useState('ALL');
    const [posFilterDir, setPosFilterDir] = useState('ALL');
    const [closingTickets, setClosingTickets] = useState<Set<number>>(new Set());
    const [expandedHistoryRows, setExpandedHistoryRows] = useState<Set<string>>(new Set());
    const [editingSymbol, setEditingSymbol] = useState<string | null>(null);
    const [editingBrokerName, setEditingBrokerName] = useState('');
    // Derive autoTrades set from server state array (key: "SYMBOL-SUB_TF")
    const autoTrades = useMemo(() => {
        const s = new Set<string>();
        serverAutoTrades.forEach(at => s.add(`${at.symbol}-${at.sub_tf}`));
        return s;
    }, [serverAutoTrades]);
    const autoTradesRef = useRef(autoTrades);
    autoTradesRef.current = autoTrades;
    const lotSizesRef = useRef(lotSizes);
    lotSizesRef.current = lotSizes;

    const [showAutoHistoryModal, setShowAutoHistoryModal] = useState(false);
    const [nextCheckStr, setNextCheckStr] = useState<string>('');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            
            let targetMinute = Math.floor(minutes / 5) * 5;
            
            if (minutes % 5 === 0 && seconds >= 42) {
                targetMinute += 5;
            } else if (minutes % 5 !== 0) {
                targetMinute = Math.ceil(minutes / 5) * 5;
            }
            
            const targetDate = new Date(now);
            targetDate.setMinutes(targetMinute);
            targetDate.setSeconds(42);
            targetDate.setMilliseconds(0);
            
            const diff = Math.floor((targetDate.getTime() - now.getTime()) / 1000);
            
            if (diff <= 0) {
                setNextCheckStr('00:00');
            } else {
                const m = Math.floor(diff / 60);
                const s = Math.floor(diff % 60);
                setNextCheckStr(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

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

        const tradeComment = `PX-Dash ${asset} ${tf}`.slice(0, 31);
        const hasPos = mt5Positions?.some(p => p.comment === tradeComment) || false;
        if (hasPos) return;

        const key = `${asset}-${tf}`;
        const lot = lotSizes[key] || 0.01;
        // SL = entry price (breakeven) if no explicit stop_loss from signal
        const effectiveSL = entry.stop_loss || entry.close;

        setExecutingTrades(prev => new Set(prev).add(key));
        setLocalPosActive(prev => new Set(prev).add(key));

        const newEntry: TradeHistoryEntry = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            symbol: asset, tf, action: entry.net_signal,
            volume: lot, entryPrice: 0,
            sl: effectiveSL, tp: entry.take_profit || null,
            ticket: null, status: 'pending', executedAt: new Date().toISOString(),
            signalPrice: entry.close,
            autoExecuted: isAuto,
        };

        try {
            const result = await executeTrade(
                asset, entry.net_signal.toUpperCase(), lot,
                effectiveSL, entry.take_profit || undefined,
                tradeComment
            );

            if (result) {
                newEntry.status = 'filled';
                newEntry.ticket = result.ticket;
                newEntry.entryPrice = result.price;
            } else {
                newEntry.status = 'failed';
                newEntry.error = 'Execution returned null';
                setLocalPosActive(prev => { const n = new Set(prev); n.delete(key); return n; });
            }
        } catch (err: any) {
            newEntry.status = 'failed';
            newEntry.error = err?.message || 'Unknown error';
            setLocalPosActive(prev => { const n = new Set(prev); n.delete(key); return n; });
        }

        addTradeToHistory?.(newEntry);
        setExecutingTrades(prev => { const n = new Set(prev); n.delete(key); return n; });
    }, [executeTrade, mt5Connected, lotSizes, addTradeToHistory, mt5Positions]);

    // ─── Bulk Execution Handlers ───
    const handleExecuteAsset = async (asset: string) => {
        if (!executeTrade || !mt5Connected || executingAssetBulk) return;
        setExecutingAssetBulk(asset);
        try {
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
        } finally {
            setExecutingAssetBulk(null);
        }
    };

    const handleAutoAsset = async (asset: string) => {
        if (!addAutoTrade || !mt5Connected || executingAssetBulk || globalAutoCooldown) return;
        setGlobalAutoCooldown(true);
        setTimeout(() => setGlobalAutoCooldown(false), 7000);
        setExecutingAssetBulk(asset);
        try {
            const tfs = signalData[asset];
            if (!tfs) return;
            let tfKeys = Object.keys(tfs).sort(sortTF);
            if (actionFilter !== "ALL") tfKeys = tfKeys.filter(tf => tfs[tf].net_signal === actionFilter);
            if (tfFilter !== "ALL") tfKeys = tfKeys.filter(tf => tf === tfFilter);

            const bulkTrades = [];

            for (const tf of tfKeys) {
                const entry = tfs[tf];
                if (!entry.net_signal) continue;
                const key = `${asset}-${tf}`;

                // PREVENT DUPLICATE TICKETS: Skip if already executing or if already in Auto Mode!
                if (executingTrades.has(key)) continue;
                if (autoTrades.has(key)) continue;

                const lot = lotSizes[key] || 0.01;
                const effectiveSymbol = symbolOverrides[asset] || asset;
                const direction = entry.net_signal;

                setExecutingTrades(prev => new Set(prev).add(key));
                setLocalAutoActive(prev => new Set(prev).add(key));
                let ticket = '';
                const tradeComment = `PX-Dash ${asset} ${tf}`.slice(0, 31);
                const existingManualPos = mt5Positions?.find(p => p.comment === tradeComment);

                if (existingManualPos) {
                    ticket = String(existingManualPos.ticket);
                }

                bulkTrades.push({
                    key, symbol: effectiveSymbol, tf, lot, direction,
                    signalPrice: entry.close, sl: entry.stop_loss || null, tp: entry.take_profit || null, ticket
                });
            }

            if (bulkTrades.length > 0) {
                if (addAutoTradesBulk) {
                    await addAutoTradesBulk(bulkTrades);
                } else {
                    for (const t of bulkTrades) {
                        await addAutoTrade(t.key, t.symbol, t.tf, t.lot, t.direction, t.signalPrice, t.sl, t.tp, t.ticket);
                    }
                }
            }

        } finally {
            setExecutingAssetBulk(null);
            setExecutingTrades(prev => new Set([...prev].filter(k => !k.startsWith(`${asset}-`))));
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
                                    {/* Buttons moved individually to Accordion Headers */}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* ═══ LIVE POSITIONS INLINE PANEL (Accordion) ═══ */}
                {mt5Connected && (
                    <div className="mx-6 mb-3 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(16,185,129,0.15)', background: tk.isDark ? 'rgba(16,185,129,0.02)' : 'rgba(16,185,129,0.02)' }}>
                        {/* Live Positions Header Actions */}
                        <div 
                            className="flex items-center justify-between px-5 py-3 cursor-pointer select-none transition-colors hover:bg-emerald-500/10" 
                            style={{ borderBottom: showPositions ? '1px solid rgba(16,185,129,0.06)' : 'none', background: 'rgba(16,185,129,0.05)' }}
                            onClick={() => setShowPositions(!showPositions)}
                        >
                            <div className="flex items-center gap-3">
                                <Zap className="w-5 h-5 text-emerald-400" />
                                <span className="text-[12px] font-black uppercase tracking-wider text-emerald-400">Active Tickets</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400">{mt5Positions.length}</span>
                                {showPositions && mt5Positions.length > 0 && (() => {
                                    const activeBuyCount = mt5Positions.filter(p => p.type?.toUpperCase() === 'BUY').length;
                                    const activeSellCount = mt5Positions.filter(p => p.type?.toUpperCase() === 'SELL').length;
                                    return (
                                        <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-black/20 rounded-lg border border-emerald-500/10">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{isRTL ? "مراكز حالية" : "Current"}</span>
                                                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-1 rounded shadow-sm drop-shadow whitespace-nowrap">{activeBuyCount} B</span>
                                                <span className="text-[10px] font-black text-red-400 bg-red-500/10 px-1 rounded shadow-sm drop-shadow whitespace-nowrap">{activeSellCount} S</span>
                                            </div>
                                        </div>
                                    );
                                })()}
                                {showPositions ? <ChevronUp className="w-4 h-4 text-emerald-400 opacity-50 ml-2" /> : <ChevronDown className="w-4 h-4 text-emerald-400 opacity-50 ml-2" />}
                            </div>
                            {showPositions && mt5Positions.length > 0 && closeAllPositions && (
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    disabled={closingAllPositions}
                                    onClick={(e) => { e.stopPropagation(); handleCloseAllPositions(); }}
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
                        
                        {showPositions && (
                            <div>
                                {/* Account Stats Grid */}
                                {mt5Account && (
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 px-4 pt-3 pb-2 border-b border-emerald-500/10">
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
                                {(() => {
                                    const uniquePosSymbols = Array.from(new Set(mt5Positions.map(p => p.symbol).filter(Boolean))).sort();
                                    const filteredPositions = mt5Positions.filter(p => {
                                        if (posFilterSymbol !== 'ALL' && p.symbol !== posFilterSymbol) return false;
                                        if (posFilterDir !== 'ALL' && p.type?.toUpperCase() !== posFilterDir) return false;
                                        return true;
                                    });
                                    const hasActivePosFilters = posFilterSymbol !== 'ALL' || posFilterDir !== 'ALL';

                                    return (
                                        <>
                                            {mt5Positions.length > 0 && (
                                                <div className="flex flex-wrap items-center gap-2 px-4 py-2.5" style={{ background: tk.isDark ? 'rgba(16,185,129,0.03)' : 'rgba(16,185,129,0.02)', borderBottom: '1px solid rgba(16,185,129,0.06)' }}>
                                                    {/* Symbol Filter */}
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mr-0.5">Symbol</span>
                                                        <button onClick={() => setPosFilterSymbol('ALL')} className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${posFilterSymbol === 'ALL' ? 'text-emerald-300 bg-emerald-500/20 shadow-sm' : 'text-slate-500 hover:text-slate-300 bg-transparent'}`} style={{ border: posFilterSymbol === 'ALL' ? '1px solid rgba(16,185,129,0.3)' : '1px solid transparent' }}>All</button>
                                                        {uniquePosSymbols.map(sym => (
                                                            <button key={sym} onClick={() => setPosFilterSymbol(posFilterSymbol === sym ? 'ALL' : sym)} className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${posFilterSymbol === sym ? 'text-emerald-300 bg-emerald-500/20 shadow-sm' : 'text-slate-500 hover:text-slate-300 bg-transparent'}`} style={{ border: posFilterSymbol === sym ? '1px solid rgba(16,185,129,0.3)' : '1px solid transparent' }}>{sym}</button>
                                                        ))}
                                                    </div>
                                                    <div className="w-px h-4 bg-emerald-500/10" />
                                                    {/* Direction Filter */}
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mr-0.5">Dir</span>
                                                        {['ALL', 'BUY', 'SELL'].map(d => (
                                                            <button key={d} onClick={() => setPosFilterDir(d)} className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${posFilterDir === d ? (d === 'BUY' ? 'text-emerald-300 bg-emerald-500/20' : d === 'SELL' ? 'text-red-300 bg-red-500/20' : 'text-emerald-300 bg-emerald-500/20') + ' shadow-sm' : 'text-slate-500 hover:text-slate-300 bg-transparent'}`} style={{ border: posFilterDir === d ? `1px solid ${d === 'BUY' ? 'rgba(16,185,129,0.3)' : d === 'SELL' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}` : '1px solid transparent' }}>{d === 'ALL' ? 'All' : d}</button>
                                                        ))}
                                                    </div>
                                                    
                                                    {/* Close Filtered Button */}
                                                    {hasActivePosFilters && filteredPositions.length > 0 && closePosition && (
                                                        <>
                                                            <div className="w-px h-4 bg-emerald-500/10" />
                                                            <motion.button whileTap={{ scale: 0.95 }}
                                                                onClick={async () => {
                                                                    setClosingAllPositions(true);
                                                                    for (const p of filteredPositions) {
                                                                        await closePosition(p.ticket);
                                                                    }
                                                                    setClosingAllPositions(false);
                                                                }}
                                                                className="px-3 py-1 rounded-lg text-[9px] font-black cursor-pointer transition-all flex items-center gap-1"
                                                                style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                                                            >
                                                                <X className="w-2.5 h-2.5" /> Close Filtered ({filteredPositions.length})
                                                            </motion.button>
                                                        </>
                                                    )}
                                                    {hasActivePosFilters && (
                                                        <button onClick={() => { setPosFilterSymbol('ALL'); setPosFilterDir('ALL'); }} className="ml-auto text-[9px] font-bold text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 pr-2">
                                                            <X className="w-2 h-2" /> Clear Filters
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            <div className="overflow-auto custom-scrollbar" style={{ maxHeight: 240 }}>
                                                {filteredPositions.length === 0 ? (
                                                    <div className="px-5 py-8 text-center" style={{ background: 'rgba(16,185,129,0.02)' }}>
                                                        <span className="text-[12px] font-black uppercase tracking-widest drop-shadow-sm" style={{ color: 'rgba(16,185,129,0.4)' }}>No active live positions{hasActivePosFilters ? ' matched' : ''}</span>
                                                    </div>
                                                ) : (
                                                    <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                                                        <thead className="sticky top-0 z-10" style={{ background: tk.isDark ? '#020617' : tk.surface }}>
                                                            <tr style={{ borderBottom: '1px solid rgba(16,185,129,0.1)' }}>
                                                                {['Symbol', 'Type', 'Vol', 'Open', 'Current', 'SL', 'TP', 'Profit', 'Swap', ''].map(h => (
                                                                    <th key={h} className="px-3 py-2 text-[10px] font-black tracking-wider uppercase text-left" style={{ color: tk.textDim }}>{h}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredPositions.map((pos) => {
                                                    const isProfit = pos.profit >= 0;
                                                    const isClosing = closingTickets.has(pos.ticket);
                                                    return (
                                                        <tr key={pos.ticket} className="hover:bg-emerald-500/5 transition-colors group" style={{
                                                            borderBottom: `1px solid ${tk.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)'}`,
                                                            background: isProfit ? 'rgba(16,185,129,0.03)' : 'rgba(239,68,68,0.03)',
                                                        }}>
                                                            <td className="px-3 py-2 text-[11px] font-black" style={{ color: tk.textPrimary }}>{pos.symbol}</td>
                                                            <td className="px-3 py-2">
                                                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{
                                                                    color: pos.type === 'BUY' ? '#10b981' : '#ef4444',
                                                                    background: pos.type === 'BUY' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                                }}>{pos.type}</span>
                                                            </td>
                                                            <td className="px-3 py-2 text-[10px] font-bold font-mono drop-shadow-sm" style={{ color: '#f59e0b' }}>{pos.volume}</td>
                                                            <td className="px-3 py-2 text-[10px] font-mono" style={{ color: tk.textSecondary }}>{fmt(pos.open_price)}</td>
                                                            <td className="px-3 py-2 text-[10px] font-mono font-bold" style={{ color: tk.textPrimary }}>{fmt(pos.current_price)}</td>
                                                            <td className="px-3 py-2 text-[10px] font-mono" style={{ color: pos.sl ? '#ef4444' : tk.textDim }}>{pos.sl ? fmt(pos.sl) : '—'}</td>
                                                            <td className="px-3 py-2 text-[10px] font-mono" style={{ color: pos.tp ? '#10b981' : tk.textDim }}>{pos.tp ? fmt(pos.tp) : '—'}</td>
                                                            <td className="px-3 py-2">
                                                                <span className="text-[11px] font-black font-mono drop-shadow-sm" style={{ color: isProfit ? '#10b981' : '#ef4444' }}>
                                                                    {isProfit ? '+' : ''}{pos.profit.toFixed(2)}
                                                                </span>
                                                            </td>
                                                            <td className="px-3 py-2 text-[9px] font-mono" style={{ color: tk.textDim }}>{pos.swap.toFixed(2)}</td>
                                                            <td className="px-3 py-2 text-right">
                                                                <motion.button
                                                                    whileTap={{ scale: 0.95 }}
                                                                    disabled={isClosing || !closePosition}
                                                                    onClick={async () => {
                                                                        if (!closePosition) return;
                                                                        setClosingTickets(prev => new Set(prev).add(pos.ticket));
                                                                        const success = await closePosition(pos.ticket);
                                                                        if (success) {
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
                                                                            addTradeToHistory?.(closeEntry);
                                                                        }
                                                                        setClosingTickets(prev => { const n = new Set(prev); n.delete(pos.ticket); return n; });
                                                                    }}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-black cursor-pointer transition-colors opacity-80 group-hover:opacity-100"
                                                                    style={{
                                                                        color: isClosing ? tk.textDim : '#ef4444',
                                                                        background: isClosing ? tk.surfaceHover : 'rgba(239,68,68,0.08)',
                                                                        border: `1px solid ${isClosing ? tk.border : 'rgba(239,68,68,0.15)'}`,
                                                                    }}>
                                                                    {isClosing ? '⏳' : <X className="w-3 h-3" />}
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
                                        </>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══ AUTO TRADE LOGS INLINE PANEL (Accordion) ═══ */}
                {mt5Connected && (
                    <div className="mx-6 mb-3 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(236,72,153,0.15)', background: tk.isDark ? 'rgba(236,72,153,0.02)' : 'rgba(236,72,153,0.02)' }}>
                        <div 
                            className="flex items-center justify-between px-5 py-3 cursor-pointer select-none transition-colors hover:bg-pink-500/10" 
                            style={{ borderBottom: showAutoLogs ? '1px solid rgba(236,72,153,0.06)' : 'none', background: 'rgba(236,72,153,0.05)' }}
                            onClick={() => {
                                setShowAutoLogs(!showAutoLogs);
                                if (!showAutoLogs && fetchAutoLogs) fetchAutoLogs();
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <History className="w-5 h-5 text-pink-400" />
                                <span className="text-[12px] font-black uppercase tracking-wider text-pink-400 whitespace-nowrap">Background Auto Trades</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-400">{(autoFilterSymbol !== 'ALL' || autoFilterDir !== 'ALL' || autoFilterSource !== 'ALL') ? `${serverAutoTrades.filter(at => { if (autoFilterSymbol !== 'ALL' && at.symbol !== autoFilterSymbol) return false; if (autoFilterDir !== 'ALL' && at.current_direction?.toUpperCase() !== autoFilterDir) return false; if (autoFilterSource !== 'ALL' && `${at.main_tf}/${at.sub_tf}` !== autoFilterSource) return false; return true; }).length}/${serverAutoTrades.length}` : serverAutoTrades.length}</span>
                                
                                {showAutoLogs && serverAutoTrades.length > 0 && (() => {
                                    const activeBuyCount = serverAutoTrades.filter(at => at.current_direction?.toUpperCase() === 'BUY').length;
                                    const activeSellCount = serverAutoTrades.filter(at => at.current_direction?.toUpperCase() === 'SELL').length;
                                    return (
                                        <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-black/20 rounded-lg border border-pink-500/10">
                                            <div className="flex items-center gap-1.5 border-r border-pink-500/10 pr-2">
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{isRTL ? "مراكز حالية" : "Current"}</span>
                                                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-1 rounded shadow-sm drop-shadow whitespace-nowrap">{activeBuyCount} B</span>
                                                <span className="text-[10px] font-black text-red-400 bg-red-500/10 px-1 rounded shadow-sm drop-shadow whitespace-nowrap">{activeSellCount} S</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 pl-1">
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{isRTL ? "بانتظار" : "Waiting"}</span>
                                                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-1 rounded shadow-sm drop-shadow opacity-80 whitespace-nowrap">{activeSellCount} B</span>
                                                <span className="text-[10px] font-black text-red-400 bg-red-500/5 border border-red-500/20 px-1 rounded shadow-sm drop-shadow opacity-80 whitespace-nowrap">{activeBuyCount} S</span>
                                            </div>
                                        </div>
                                    );
                                })()}
                                {showAutoLogs ? <ChevronUp className="w-4 h-4 text-pink-400 opacity-50 ml-auto" /> : <ChevronDown className="w-4 h-4 text-pink-400 opacity-50 ml-auto" />}
                            </div>
                            {showAutoLogs && (
                                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                    {nextCheckStr && (
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded border border-pink-500/20 bg-pink-500/10 animate-pulse">
                                            <span className="text-[9px] font-black uppercase tracking-wider text-pink-300">
                                                {isRTL ? "الفحص القادم" : "Next Check"}:
                                            </span>
                                            <span className="text-[10px] font-mono font-black text-pink-200">{nextCheckStr}</span>
                                        </div>
                                    )}
                                    {serverAutoTrades.length > 0 && stopAllAutoTrades && (
                                        <motion.button whileTap={{ scale: 0.95 }}
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                const btn = document.getElementById('mt5-stop-btn') as HTMLButtonElement;
                                                if (btn) btn.innerHTML = 'Stopping...';
                                                await stopAllAutoTrades();
                                                setTimeout(() => { if (btn) btn.innerHTML = 'Stop All'; }, 1000);
                                            }}
                                            id="mt5-stop-btn"
                                            className="text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                                            style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                                        >Stop All</motion.button>
                                    )}
                                    <motion.button whileTap={{ scale: 0.95 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (fetchAutoLogs) fetchAutoLogs();
                                            setShowAutoHistoryModal(true);
                                        }}
                                        className="flex items-center justify-center p-1.5 rounded-lg cursor-pointer transition-colors"
                                        style={{ color: '#ec4899', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.15)' }}
                                        title="Auto Trade History"
                                    >
                                        <History className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            )}
                        </div>
                        
                        {showAutoLogs && (() => {
                            // ─── Compute unique filter options ───
                            const uniqueSymbols = Array.from(new Set(serverAutoTrades.map(at => at.symbol).filter(Boolean))).sort();
                            const uniqueSources = Array.from(new Set(serverAutoTrades.map(at => `${at.main_tf}/${at.sub_tf}`).filter(Boolean))).sort();

                            // ─── Apply filters ───
                            const filteredAutoTrades = serverAutoTrades.filter(at => {
                                if (autoFilterSymbol !== 'ALL' && at.symbol !== autoFilterSymbol) return false;
                                if (autoFilterDir !== 'ALL' && at.current_direction?.toUpperCase() !== autoFilterDir) return false;
                                if (autoFilterSource !== 'ALL' && `${at.main_tf}/${at.sub_tf}` !== autoFilterSource) return false;
                                return true;
                            });

                            const hasActiveFilters = autoFilterSymbol !== 'ALL' || autoFilterDir !== 'ALL' || autoFilterSource !== 'ALL';

                            return (
                            <div>
                                {/* ─── Filter Bar ─── */}
                                {serverAutoTrades.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-2 px-4 py-2.5" style={{ background: tk.isDark ? 'rgba(236,72,153,0.03)' : 'rgba(236,72,153,0.02)', borderBottom: '1px solid rgba(236,72,153,0.06)' }}>
                                        {/* Symbol Filter */}
                                        <div className="flex items-center gap-1">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mr-0.5">Symbol</span>
                                            <button onClick={() => setAutoFilterSymbol('ALL')} className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${autoFilterSymbol === 'ALL' ? 'text-pink-300 bg-pink-500/20 shadow-sm' : 'text-slate-500 hover:text-slate-300 bg-transparent'}`} style={{ border: autoFilterSymbol === 'ALL' ? '1px solid rgba(236,72,153,0.3)' : '1px solid transparent' }}>All</button>
                                            {uniqueSymbols.map(sym => (
                                                <button key={sym} onClick={() => setAutoFilterSymbol(autoFilterSymbol === sym ? 'ALL' : sym)} className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${autoFilterSymbol === sym ? 'text-pink-300 bg-pink-500/20 shadow-sm' : 'text-slate-500 hover:text-slate-300 bg-transparent'}`} style={{ border: autoFilterSymbol === sym ? '1px solid rgba(236,72,153,0.3)' : '1px solid transparent' }}>{sym}</button>
                                            ))}
                                        </div>
                                        <div className="w-px h-4 bg-pink-500/10" />
                                        {/* Direction Filter */}
                                        <div className="flex items-center gap-1">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mr-0.5">Dir</span>
                                            {['ALL', 'BUY', 'SELL'].map(d => (
                                                <button key={d} onClick={() => setAutoFilterDir(d)} className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${autoFilterDir === d ? (d === 'BUY' ? 'text-emerald-300 bg-emerald-500/20' : d === 'SELL' ? 'text-red-300 bg-red-500/20' : 'text-pink-300 bg-pink-500/20') + ' shadow-sm' : 'text-slate-500 hover:text-slate-300 bg-transparent'}`} style={{ border: autoFilterDir === d ? `1px solid ${d === 'BUY' ? 'rgba(16,185,129,0.3)' : d === 'SELL' ? 'rgba(239,68,68,0.3)' : 'rgba(236,72,153,0.3)'}` : '1px solid transparent' }}>{d === 'ALL' ? 'All' : d}</button>
                                            ))}
                                        </div>
                                        <div className="w-px h-4 bg-pink-500/10" />
                                        {/* Source Filter */}
                                        <div className="flex items-center gap-1">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mr-0.5">TF</span>
                                            <button onClick={() => setAutoFilterSource('ALL')} className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${autoFilterSource === 'ALL' ? 'text-pink-300 bg-pink-500/20 shadow-sm' : 'text-slate-500 hover:text-slate-300 bg-transparent'}`} style={{ border: autoFilterSource === 'ALL' ? '1px solid rgba(236,72,153,0.3)' : '1px solid transparent' }}>All</button>
                                            {uniqueSources.map(src => (
                                                <button key={src} onClick={() => setAutoFilterSource(autoFilterSource === src ? 'ALL' : src)} className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono cursor-pointer transition-all ${autoFilterSource === src ? 'text-purple-300 bg-purple-500/20 shadow-sm' : 'text-slate-500 hover:text-slate-300 bg-transparent'}`} style={{ border: autoFilterSource === src ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent' }}>{src}</button>
                                            ))}
                                        </div>
                                        {/* Stop Filtered Button */}
                                        {hasActiveFilters && filteredAutoTrades.length > 0 && removeAutoTrade && (
                                            <>
                                                <div className="w-px h-4 bg-pink-500/10" />
                                                <motion.button whileTap={{ scale: 0.95 }}
                                                    onClick={async () => {
                                                        const comments = filteredAutoTrades.map(at => at.comment).filter(Boolean);
                                                        if (comments.length > 0) await removeAutoTrade(comments);
                                                    }}
                                                    className="px-3 py-1 rounded-lg text-[9px] font-black cursor-pointer transition-all flex items-center gap-1"
                                                    style={{ color: '#ef4444', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}
                                                >
                                                    <X className="w-3 h-3" /> Stop Filtered ({filteredAutoTrades.length})
                                                </motion.button>
                                            </>
                                        )}
                                        {hasActiveFilters && (
                                            <button onClick={() => { setAutoFilterSymbol('ALL'); setAutoFilterDir('ALL'); setAutoFilterSource('ALL'); }} className="text-[9px] font-bold text-slate-500 hover:text-pink-400 cursor-pointer transition-colors ml-auto">✕ Clear Filters</button>
                                        )}
                                    </div>
                                )}
                                {/* ─── Table ─── */}
                                <div className="overflow-auto custom-scrollbar" style={{ maxHeight: 240 }}>
                                    {serverAutoTrades.length === 0 ? (
                                        <div className="py-10 text-center" style={{ background: tk.surface }}>
                                            <History className="w-10 h-10 mx-auto mb-3" style={{ color: tk.textDim, opacity: 0.4 }} />
                                            <span className="text-sm font-bold" style={{ color: tk.textDim }}>No active background trades</span>
                                        </div>
                                    ) : filteredAutoTrades.length === 0 ? (
                                        <div className="py-6 text-center" style={{ background: tk.surface }}>
                                            <span className="text-xs font-bold" style={{ color: tk.textDim }}>No auto trades match current filters</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col">
                                            <table className="w-full text-left" style={{ borderCollapse: 'collapse', background: tk.surface }}>
                                                <thead className="sticky top-0 z-10" style={{ background: tk.isDark ? '#020617' : tk.surface }}>
                                                    <tr style={{ borderBottom: '1px solid rgba(236,72,153,0.06)' }}>
                                                        {['Symbol', 'Source', 'Current Dir.', 'Waiting For', 'Lot', 'Ticket', 'Status', 'Action'].map(h => (
                                                            <th key={h} className="px-3 py-2 text-[10px] font-black tracking-wider uppercase text-center" style={{ color: tk.textDim }}>{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredAutoTrades.map((autoTrade, i) => {
                                                        const isBuy = autoTrade.current_direction?.toLowerCase() === 'buy';
                                                        return (
                                                            <tr key={autoTrade.id || i} className="hover:bg-pink-500/5 transition-colors group text-center" style={{ borderBottom: `1px solid ${tk.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'}` }}>
                                                                <td className="px-3 py-2 text-[11px] font-black drop-shadow-sm" style={{ color: tk.textPrimary }}>{autoTrade.symbol || '-'}</td>
                                                                <td className="px-3 py-2 text-[10px] font-bold font-mono text-purple-400/80">
                                                                    {autoTrade.main_tf}/{autoTrade.sub_tf} <span className="text-pink-500/70">(W{autoTrade.window_size})</span>
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    <span className="text-[10px] font-black px-2 py-0.5 rounded shadow-sm" style={{
                                                                        color: isBuy ? '#10b981' : '#ef4444',
                                                                        background: isBuy ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                                    }}>{autoTrade.current_direction?.toUpperCase() || '-'}</span>
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    <span className="text-[10px] font-black px-2 py-0.5 rounded opacity-80 shadow-sm" style={{
                                                                        color: !isBuy ? '#10b981' : '#ef4444',
                                                                        background: !isBuy ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                                        border: `1px dashed ${!isBuy ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`
                                                                    }}>⏳ {!isBuy ? 'BUY' : 'SELL'}</span>
                                                                </td>
                                                                <td className="px-3 py-2 text-[11px] font-mono font-bold text-amber-500">{autoTrade.lot_size || '0.01'}</td>
                                                                <td className="px-3 py-2 text-[10px] font-mono text-purple-400">{autoTrade.last_ticket || '-'}</td>
                                                                <td className="px-3 py-2">
                                                                    <span
                                                                        className="text-[10px] font-black px-2 py-1 rounded shadow-sm cursor-help"
                                                                        title={autoTrade.last_error || 'Active and monitoring'}
                                                                        style={{
                                                                            color: autoTrade.last_ticket ? '#ef4444' : '#fbbf24',
                                                                            background: autoTrade.last_ticket ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                                                                            border: `1px solid ${autoTrade.last_ticket ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`
                                                                        }}
                                                                    >
                                                                        {autoTrade.last_ticket ? 'EXECUTED' : 'WATCHING'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    <motion.button
                                                                        whileTap={{ scale: 0.95 }}
                                                                        disabled={!removeAutoTrade}
                                                                        onClick={async () => {
                                                                            if (removeAutoTrade && autoTrade.comment) await removeAutoTrade([autoTrade.comment]);
                                                                        }}
                                                                        className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded text-[10px] font-black cursor-pointer transition-colors opacity-80 hover:opacity-100 mx-auto"
                                                                        style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                                                                        <X className="w-3 h-3" /> Stop
                                                                    </motion.button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                            );
                        })()}
                    </div>
                )}

                {/* ═══ TRADE HISTORY INLINE PANEL (Accordion) ═══ */}
                {mt5Connected && (
                    <div className="mx-6 mb-3 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(168,85,247,0.15)', background: tk.isDark ? 'rgba(168,85,247,0.02)' : 'rgba(168,85,247,0.02)' }}>
                        <div 
                            className="flex items-center justify-between px-5 py-3 cursor-pointer select-none transition-colors hover:bg-indigo-500/10" 
                            style={{ borderBottom: showHistory ? '1px solid rgba(168,85,247,0.06)' : 'none', background: 'rgba(99,102,241,0.05)' }}
                            onClick={() => setShowHistory(!showHistory)}
                        >
                            <div className="flex items-center gap-3">
                                <History className="w-5 h-5 text-indigo-400" />
                                <span className="text-[12px] font-black uppercase tracking-wider text-indigo-400">Trade History</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400">{tradeHistory.length}</span>
                                {showHistory ? <ChevronUp className="w-4 h-4 text-indigo-400 opacity-50 ml-2" /> : <ChevronDown className="w-4 h-4 text-indigo-400 opacity-50 ml-2" />}
                            </div>
                            {showHistory && tradeHistory.length > 0 && (
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <motion.button whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            const headers = ['Symbol', 'Deal', 'Order', 'Position', 'Time', 'Type', 'Direction', 'Size', 'Close price', 'Commission', 'Swap', 'Comment'];
                                            const rows = tradeHistory.map((t: any) => [
                                                t.symbol || '', t.ticket || '', t.order || '', t.position || '',
                                                t.time || '', t.type || '', t.entry || '', t.volume || '',
                                                t.price || '', t.commission || '', t.swap || '', t.comment || ''
                                            ].map(v => `"${v}"`).join(','));
                                            const csv = [headers.join(','), ...rows].join('\n');
                                            const blob = new Blob([csv], { type: 'text/csv' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `phasex_deals_history_${new Date().toISOString().slice(0, 10)}.csv`;
                                            a.click();
                                            URL.revokeObjectURL(url);
                                        }}
                                        className="flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                                        style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)' }}
                                    ><Download className="w-3 h-3" /> CSV</motion.button>
                                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => clearServerHistory?.()}
                                        className="text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                                        style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.15)' }}
                                    >Clear All</motion.button>
                                </div>
                            )}
                        </div>
                        
                        {showHistory && (
                            <div className="overflow-auto custom-scrollbar" style={{ maxHeight: 400 }}>
                                {tradeHistory.length === 0 ? (
                                    <div className="py-10 text-center" style={{ background: tk.surface }}>
                                        <History className="w-10 h-10 mx-auto mb-3" style={{ color: tk.textDim, opacity: 0.4 }} />
                                        <span className="text-sm font-bold" style={{ color: tk.textDim }}>No trades executed yet</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col">
                                        <table className="w-full text-left" style={{ borderCollapse: 'collapse', background: tk.surface }}>
                                            <thead className="sticky top-0 z-10" style={{ background: tk.isDark ? '#020617' : tk.surface }}>
                                                <tr style={{ borderBottom: '1px solid rgba(99,102,241,0.06)' }}>
                                                    {['Symbol', 'Deal', 'Order', 'Position', 'Time', 'Type', 'Direction', 'Size', 'Close price', 'Comission', 'Swap'].map(h => (
                                                        <th key={h} className="px-3 py-2 text-[10px] font-black tracking-wider uppercase" style={{ color: tk.textDim }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tradeHistory.slice(0, historyLimit).map((th: any, i) => (
                                                    <tr key={`${th.ticket}-${i}`} className="hover:bg-indigo-500/5 transition-colors" style={{ borderBottom: `1px solid ${tk.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'}` }}>
                                                        <td className="px-3 py-2 text-[11px] font-black drop-shadow-sm" style={{ color: tk.textPrimary }}>{th.symbol}</td>
                                                        <td className="px-3 py-2 text-[10px] font-mono" style={{ color: tk.textSecondary }}>{th.ticket}</td>
                                                        <td className="px-3 py-2 text-[10px] font-mono" style={{ color: tk.textSecondary }}>{th.order}</td>
                                                        <td className="px-3 py-2 text-[10px] font-mono" style={{ color: tk.textSecondary }}>{th.position}</td>
                                                        <td className="px-3 py-2 text-[10px] font-mono" style={{ color: tk.textSecondary }}>{th.time}</td>
                                                        <td className="px-3 py-2 text-[11px] font-bold" style={{ color: tk.textPrimary }}>{th.type}</td>
                                                        <td className="px-3 py-2 text-[11px] font-bold" style={{ color: tk.textSecondary }}>{th.entry}</td>
                                                        <td className="px-3 py-2 text-[11px] font-bold font-mono text-amber-500">{th.volume > 0 ? th.volume : ''}</td>
                                                        <td className="px-3 py-2 text-[11px] font-mono" style={{ color: tk.textPrimary }}>{th.price > 0 ? th.price : ''}</td>
                                                        <td className="px-3 py-2 text-[11px] font-mono" style={{ color: tk.textSecondary }}>{th.commission !== undefined ? th.commission.toFixed(2) : ''}</td>
                                                        <td className="px-3 py-2 text-[11px] font-mono" style={{ color: tk.textSecondary }}>{th.swap !== undefined ? th.swap.toFixed(2) : ''}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {tradeHistory.length > historyLimit && (
                                            <div className="flex justify-center p-3" style={{ background: tk.surface }}>
                                                <button
                                                    onClick={() => setHistoryLimit(p => p + 100)}
                                                    className="px-4 py-1.5 text-[11px] font-black rounded cursor-pointer transition-all hover:bg-indigo-500/20"
                                                    style={{ color: '#818cf8', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
                                                >
                                                    Load More
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
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
                                                                    disabled={executingAssetBulk !== null}
                                                                    whileHover={executingAssetBulk === null ? { scale: 1.05 } : {}} whileTap={executingAssetBulk === null ? { scale: 0.95 } : {}}
                                                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black cursor-pointer transition-colors"
                                                                    style={{ 
                                                                        color: executingAssetBulk === asset ? "#fff" : executingAssetBulk ? "#475569" : "#10b981", 
                                                                        background: executingAssetBulk === asset ? "#10b981" : executingAssetBulk ? "rgba(255,255,255,0.05)" : "rgba(16,185,129,0.1)", 
                                                                        border: executingAssetBulk ? "1px solid transparent" : "1px solid rgba(16,185,129,0.2)",
                                                                        opacity: executingAssetBulk && executingAssetBulk !== asset ? 0.5 : 1
                                                                    }}
                                                                    title={executingAssetBulk === asset ? "Executing..." : executingAssetBulk ? "Wait for current batch to finish" : "Execute all signals for this asset"}
                                                                >
                                                                    {executingAssetBulk === asset ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Play className="w-2.5 h-2.5" /></motion.div> : <Play className="w-2.5 h-2.5" />} 
                                                                    {executingAssetBulk === asset ? "EXEC..." : `Execute ${asset}`}
                                                                </motion.button>
                                                                <motion.button onClick={() => handleAutoAsset(asset)}
                                                                    disabled={executingAssetBulk !== null || globalAutoCooldown}
                                                                    whileHover={(executingAssetBulk === null && !globalAutoCooldown) ? { scale: 1.05 } : {}} whileTap={(executingAssetBulk === null && !globalAutoCooldown) ? { scale: 0.95 } : {}}
                                                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black cursor-pointer transition-colors"
                                                                    style={{ 
                                                                        color: executingAssetBulk === asset ? "#fff" : (executingAssetBulk || globalAutoCooldown) ? "#475569" : "#a855f7", 
                                                                        background: executingAssetBulk === asset ? "#a855f7" : (executingAssetBulk || globalAutoCooldown) ? "rgba(255,255,255,0.05)" : "rgba(168,85,247,0.1)", 
                                                                        border: (executingAssetBulk || globalAutoCooldown) ? "1px solid transparent" : "1px solid rgba(168,85,247,0.2)",
                                                                        opacity: (executingAssetBulk && executingAssetBulk !== asset) || globalAutoCooldown ? 0.5 : 1
                                                                    }}
                                                                    title={executingAssetBulk === asset ? "Applying Auto..." : globalAutoCooldown ? "Cooldown active (Wait 7s)" : executingAssetBulk ? "Wait for current batch to finish" : "Auto-trade all signals for this asset"}
                                                                >
                                                                    {executingAssetBulk === asset ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Zap className="w-2.5 h-2.5" /></motion.div> : <Zap className="w-2.5 h-2.5" />} 
                                                                    {executingAssetBulk === asset ? "AUTO..." : globalAutoCooldown ? "WAIT..." : `Auto ${asset}`}
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
                                                        const isAuto = autoTrades.has(rowKey) || localAutoActive.has(rowKey);
                                                        const lotVal = lotSizes[rowKey] ?? 0.01;
                                                        const tradeComment = `PX-Dash ${asset} ${tf}`.slice(0, 31);
                                                        const hasPos = mt5Positions?.some(p => p.comment === tradeComment) || localPosActive.has(rowKey);
                                                        const disableExec = isExecuting || hasPos || isAuto;
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
                                                                        ) : isAuto ? (
                                                                            <Zap className="w-3 h-3" />
                                                                        ) : (
                                                                            <Play className="w-3 h-3" />
                                                                        )}
                                                                        {isExecuting ? '...' : hasPos ? 'DONE' : isAuto ? 'AUTO' : isBuy ? 'BUY' : 'SELL'}
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
                                                                                    whileHover={(isAuto || hasPos || isExecuting) ? {} : { scale: 1.05 }}
                                                                                    whileTap={(isAuto || hasPos || isExecuting) ? {} : { scale: 0.95 }}
                                                                                    disabled={isAuto || hasPos || isExecuting}
                                                                                    onClick={async (e) => {
                                                                                        e.stopPropagation();
                                                                                        if (!mt5Connected) return;
                                                                                        const rowKey = `${asset}-${tf}`;

                                                                                        // PREVENT DUPLICATE EXECUTION OR REMOVAL FROM TABLE
                                                                                        if (isAuto || hasPos || executingTrades.has(rowKey) || autoTrades.has(rowKey)) return;

                                                                                        const lot = lotSizes[rowKey] || 0.01;
                                                                                        const direction = entry.net_signal || '';

                                                                                        setExecutingTrades(prev => new Set(prev).add(rowKey));
                                                                                        setLocalAutoActive(prev => new Set(prev).add(rowKey));
                                                                                        let ticket = '';
                                                                                        const tradeComment = `PX-Dash ${asset} ${tf}`.slice(0, 31);
                                                                                        const existingManualPos = mt5Positions?.find(p => p.comment === tradeComment);

                                                                                        if (existingManualPos) {
                                                                                            ticket = String(existingManualPos.ticket);
                                                                                        }
                                                                                        // Tell server to Auto-Trade!
                                                                                        // The backend Python worker will now execute the trade. No frontend interference.
                                                                                        addAutoTrade?.(
                                                                                            rowKey, effectiveSymbol, tf, lot, direction,
                                                                                            entry.close, entry.stop_loss || null, entry.take_profit || null,
                                                                                            ticket
                                                                                        ).finally(() => {
                                                                                            setExecutingTrades(prev => { const n = new Set(prev); n.delete(rowKey); return n; });
                                                                                        });
                                                                                    }}
                                                                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black cursor-pointer shadow-sm relative overflow-hidden"
                                                                                    style={{
                                                                                        color: (isExecuting || hasPos || isAuto) ? tk.textDim : '#a855f7',
                                                                                        background: (isExecuting || hasPos || isAuto) ? tk.surfaceHover : 'transparent',
                                                                                        border: `1px solid ${(isExecuting || hasPos || isAuto) ? tk.border : tk.border}`,
                                                                                        opacity: (isExecuting || hasPos || isAuto) ? 0.6 : 1,
                                                                                    }}
                                                                                >
                                                                                    {isExecuting ? (
                                                                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}><Zap className="w-3.5 h-3.5" /></motion.div>
                                                                                    ) : isAuto ? (
                                                                                        <ToggleRight className="w-3.5 h-3.5" />
                                                                                    ) : (
                                                                                        <ToggleLeft className="w-3.5 h-3.5" />
                                                                                    )}
                                                                                    {isExecuting ? '...' : isAuto ? 'ON' : 'OFF'}
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

        {/* Auto History Modal */}
        <AnimatePresence>
            {showAutoHistoryModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAutoHistoryModal(false)} className="absolute inset-0 top-0 left-0 w-full h-full bg-black/80 backdrop-blur-sm" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
                        style={{ background: tk.surface, border: `1px solid ${tk.border}` }}
                    >
                        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: tk.border, background: tk.surfaceElevated }}>
                            <div className="flex items-center gap-3">
                                <History className="w-5 h-5 text-pink-400" />
                                <h3 className="text-sm font-black tracking-widest uppercase text-pink-400">Auto Trade Event Logs</h3>
                            </div>
                            <button onClick={() => setShowAutoHistoryModal(false)} className="p-1.5 rounded-lg hover:bg-slate-500/10 transition-colors">
                                <X className="w-5 h-5" style={{ color: tk.textDim }} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                            {serverAutoLogs.length === 0 ? (
                                <div className="py-10 text-center flex flex-col items-center justify-center opacity-70">
                                    <History className="w-10 h-10 mb-3 text-slate-500" />
                                    <span className="text-sm font-bold text-slate-400">No auto trade history found</span>
                                </div>
                            ) : (
                                <table className="w-full text-left" style={{ borderCollapse: 'collapse', background: tk.surface }}>
                                    <thead className="sticky top-0 z-10" style={{ background: tk.isDark ? '#020617' : tk.surface }}>
                                        <tr style={{ borderBottom: `1px solid ${tk.border}` }}>
                                            {['Time', 'Symbol', 'Source', 'Action', 'Direction', 'Details'].map(h => (
                                                <th key={h} className="px-3 py-2 text-[10px] font-black tracking-wider uppercase" style={{ color: tk.textDim }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {serverAutoLogs.map((log, i) => {
                                            const isBuy = log.new_direction?.toLowerCase() === 'buy';
                                            const isError = log.action === 'ERROR';
                                            return (
                                                <tr key={log.id || i} className="hover:bg-slate-500/5 transition-colors group" style={{ borderBottom: `1px solid ${tk.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'}` }}>
                                                    <td className="px-3 py-2 text-[10px] whitespace-nowrap" style={{ color: tk.textDim }}>
                                                        {new Date(log.created_at).toLocaleString('en-US', { hour12: false, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                    </td>
                                                    <td className="px-3 py-2 text-[11px] font-black drop-shadow-sm" style={{ color: tk.textPrimary }}>{log.symbol || '-'}</td>
                                                    <td className="px-3 py-2 text-[10px] font-bold font-mono text-purple-400/80">
                                                        {log.main_tf}/{log.sub_tf} <span className="text-pink-500/70">(W{log.window_size})</span>
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase" style={{
                                                            color: isError ? '#ef4444' : log.action === 'CREATED' ? '#3b82f6' : log.action === 'CLOSED' ? '#64748b' : '#f59e0b',
                                                            background: isError ? 'rgba(239,68,68,0.1)' : log.action === 'CREATED' ? 'rgba(59,130,246,0.1)' : log.action === 'CLOSED' ? 'rgba(100,116,139,0.1)' : 'rgba(245,158,11,0.1)',
                                                        }}>
                                                            {log.action}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm" style={{
                                                            color: isBuy ? '#10b981' : '#ef4444',
                                                            background: isBuy ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                        }}>{log.new_direction?.toUpperCase() || '-'}</span>
                                                    </td>
                                                    <td className="px-3 py-2 text-[10px] leading-relaxed" style={{ color: tk.textDim }}>
                                                        {log.details || '-'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

    </>);
}
