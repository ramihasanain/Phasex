import React, { useState, useRef, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { Upload, CheckCircle, FileJson, ChevronDown, ChevronUp, Rocket, Search, X, Maximize2, Minimize2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

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

const getIcon = (asset: string): string => symbolIcons[asset] || "📈";

/* ═══════════ Types ═══════════ */
interface SignalEntry {
    time: string;
    open: number; high: number; low: number; close: number;
    net_signal: string;
    stop_loss: number; take_profit: number;
    market: string;
}

type AssetSignals = Record<string, Record<string, SignalEntry>>;

const TF_ORDER: Record<string, number> = { M1: 1, M2: 2, M3: 3, M4: 4, M5: 5, M6: 6, M10: 7, M12: 8, M15: 9, M20: 10, M30: 11, H1: 12, H2: 13, H3: 14, H4: 15, H6: 16, H8: 17, H12: 18, D1: 19, W1: 20, MN1: 21 };
const sortTF = (a: string, b: string) => (TF_ORDER[a] || 99) - (TF_ORDER[b] || 99);

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
    const { language } = useLanguage();
    const isRTL = language === "ar";

    const [signalData, setSignalData] = useState<AssetSignals>({});
    const [uploadedCount, setUploadedCount] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [collapsedAssets, setCollapsedAssets] = useState<Set<string>>(new Set());
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [marketFilter, setMarketFilter] = useState("ALL");
    const [actionFilter, setActionFilter] = useState("ALL");
    const [assetFilter, setAssetFilter] = useState("ALL");
    const [tfFilter, setTfFilter] = useState("ALL");
    const [showAssetDropdown, setShowAssetDropdown] = useState(false);

    const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setIsUploading(true);
        const newData: AssetSignals = { ...signalData };

        for (const file of Array.from(files)) {
            try {
                const text = await file.text();
                const json = JSON.parse(text);
                for (const [key, value] of Object.entries(json)) {
                    if (key === "exported_at") continue;
                    const parts = key.split(" - ");
                    const assetName = parts[0].trim();
                    const market = parts[1]?.trim() || "UNKNOWN";
                    const tfData = value as Record<string, any>;
                    for (const [tfKey, entry] of Object.entries(tfData)) {
                        if (!newData[assetName]) newData[assetName] = {};
                        const displayTF = entry.tf_candle || tfKey.split("_").pop()?.toUpperCase() || tfKey;
                        newData[assetName][displayTF] = {
                            time: entry.time || "",
                            open: entry.open ?? 0, high: entry.high ?? 0,
                            low: entry.low ?? 0, close: entry.close ?? 0,
                            net_signal: normalizeSignal(entry.net_signal || (entry.close > entry.open ? "buy" : entry.close < entry.open ? "sell" : "")),
                            stop_loss: entry.stop_loss ?? 0, take_profit: entry.take_profit ?? 0,
                            market,
                        };
                    }
                }
            } catch (err) { console.error(`Error parsing ${file.name}:`, err); }
        }

        setSignalData(newData);
        setUploadedCount((prev) => prev + Array.from(files).length);
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [signalData]);

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

    const calcProfit = (e: SignalEntry): number => {
        if (!e.net_signal) return 0;
        return e.net_signal === "Buy" ? e.close - e.open : e.net_signal === "Sell" ? e.open - e.close : 0;
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
                background: "linear-gradient(135deg, #080c15 0%, #0d1225 50%, #0a0f1a 100%)",
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
                            <h3 className="text-base font-black tracking-wide" style={{ color: "#e2e8f0" }}>
                                PHASE <span style={{ color: "#ef4444", textShadow: "0 0 12px rgba(239,68,68,0.4)" }}>X</span> Trading Dashboard
                            </h3>
                            <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
                                {isRTL ? "ارفع ملف JSON لعرض إشارات التداول" : "Upload JSON to launch trading signals"}
                            </p>
                        </div>
                    </div>
                    <input ref={fileInputRef} type="file" accept=".json" multiple onChange={handleUpload} className="hidden" />
                    <motion.button onClick={() => fileInputRef.current?.click()}
                        whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(99,102,241,0.3)" }} whileTap={{ scale: 0.96 }}
                        className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer"
                        style={{ color: "#a5b4fc", background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))", border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 0 15px rgba(99,102,241,0.08)" }}>
                        <FileJson className="w-4 h-4" /> {isRTL ? "رفع ملف JSON" : "Upload JSON"}
                    </motion.button>
                </div>
                <div className="px-6 py-10 text-center">
                    <p className="text-sm" style={{ color: "#334155" }}>⚡ {isRTL ? "لم يتم رفع أي بيانات بعد" : "No data uploaded yet"}</p>
                </div>
            </div>
        );
    }

    /* ─── DATA STATE ─── */
    return (
        <div className="flex-shrink-0 mt-3 rounded-2xl overflow-hidden relative" style={{
            background: "linear-gradient(135deg, #080c15 0%, #0d1225 50%, #0a0f1a 100%)",
            border: "1px solid rgba(99,102,241,0.1)", boxShadow: "0 0 40px rgba(99,102,241,0.04)",
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
                        <h3 className="text-base font-black tracking-wide" style={{ color: "#e2e8f0" }}>
                            PHASE <span style={{ color: "#ef4444", textShadow: "0 0 12px rgba(239,68,68,0.4)" }}>X</span> Trading Dashboard
                        </h3>
                        <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[11px]" style={{ color: "#475569" }}>⚡ {allAssetNames.length} {isRTL ? "أصل" : "assets"}</span>
                            <span className="text-[11px] font-bold" style={{ color: "#4ade80" }}>▲ {totalBuy}</span>
                            <span className="text-[11px] font-bold" style={{ color: "#f87171" }}>▼ {totalSell}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Expand/Collapse All */}
                    <motion.button onClick={expandAll} whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-[11px] font-bold cursor-pointer"
                        style={{ color: "#818cf8", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.1)" }}
                        title={isRTL ? "فتح الكل" : "Expand All"}>
                        <Maximize2 className="w-3.5 h-3.5" />
                    </motion.button>
                    <motion.button onClick={collapseAll} whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-[11px] font-bold cursor-pointer"
                        style={{ color: "#818cf8", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.1)" }}
                        title={isRTL ? "إغلاق الكل" : "Collapse All"}>
                        <Minimize2 className="w-3.5 h-3.5" />
                    </motion.button>

                    <div className="w-px h-6" style={{ background: "rgba(99,102,241,0.1)" }} />

                    <input ref={fileInputRef} type="file" accept=".json" multiple onChange={handleUpload} className="hidden" />
                    <motion.button onClick={() => fileInputRef.current?.click()}
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                        style={{
                            color: uploadedCount > 0 ? "#4ade80" : "#a5b4fc",
                            background: uploadedCount > 0 ? "rgba(74,222,128,0.06)" : "rgba(99,102,241,0.08)",
                            border: uploadedCount > 0 ? "1px solid rgba(74,222,128,0.15)" : "1px solid rgba(99,102,241,0.15)",
                        }}>
                        {isUploading ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Upload className="w-3.5 h-3.5" /></motion.div>
                        ) : uploadedCount > 0 ? <CheckCircle className="w-3.5 h-3.5" /> : <FileJson className="w-3.5 h-3.5" />}
                        {isUploading ? "..." : uploadedCount > 0 ? `+ ${isRTL ? "إضافة" : "Add"}` : (isRTL ? "رفع" : "Upload")}
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
                        placeholder={isRTL ? "بحث..." : "Search..."}
                        className="w-full rounded-lg text-xs font-medium py-2 pl-8 pr-7 outline-none"
                        style={{ background: "rgba(255,255,255,0.03)", color: "#e2e8f0", border: "1px solid rgba(99,102,241,0.1)" }} />
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
                                <span className="text-xs">{f.emoji}</span> {isRTL ? f.labelAr : f.label}
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
                                {isRTL ? f.labelAr : f.label}
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
                        {assetFilter !== "ALL" ? assetFilter : (isRTL ? "🎯 عملة" : "🎯 Asset")}
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
                                    🌐 {isRTL ? "الكل" : "All Assets"}
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
                        {isRTL ? "الكل" : "All"}
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
                    <thead className="sticky top-0 z-10" style={{ background: "#080c15" }}>
                        <tr style={{ borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
                            <th className="p-3 text-[13px] font-black text-left tracking-wider" style={{ color: "#64748b" }}>{isRTL ? "الأصل" : "ASSET"}</th>
                            <th className="p-3 text-[13px] font-black text-center tracking-wider" style={{ color: "#64748b" }}>{isRTL ? "الإجراء" : "ACTION"}</th>
                            <th className="p-3 text-[13px] font-black text-left tracking-wider" style={{ color: "#64748b" }}>{isRTL ? "الوقت" : "TIME"}</th>
                            <th className="p-3 text-[13px] font-black text-right tracking-wider" style={{ color: "#64748b" }}>{isRTL ? "السعر" : "PRICE"}</th>
                            <th className="p-3 text-[13px] font-black text-right tracking-wider" style={{ color: "#f87171" }}>SL</th>
                            <th className="p-3 text-[13px] font-black text-right tracking-wider" style={{ color: "#4ade80" }}>TP</th>
                            <th className="p-3 text-[13px] font-black text-right tracking-wider" style={{ color: "#94a3b8" }}>m.PRICE</th>
                            <th className="p-3 text-[13px] font-black text-right tracking-wider" style={{ color: "#fbbf24" }}>{isRTL ? "الربح" : "PROFIT"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAssets.length === 0 ? (
                            <tr><td colSpan={8} className="p-8 text-center text-sm" style={{ color: "#334155" }}>{isRTL ? "لا توجد نتائج" : "No results"}</td></tr>
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
                                                    <span className="text-sm font-black tracking-wide" style={{ color: "#e2e8f0", letterSpacing: "0.05em" }}>{asset}</span>
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
                                        const profit = calcProfit(entry);
                                        const profitPos = profit >= 0;
                                        const midPrice = (entry.high + entry.low) / 2;

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
                                                <td className="p-2.5 text-xs font-bold font-mono text-right tabular-nums" style={{ color: "#cbd5e1" }}>{fmt(midPrice)}</td>
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
    );
}
