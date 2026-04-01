import React from "react";
import { motion } from "motion/react";
import { ChevronDown, Search, X } from "lucide-react";
import type { ThemeTokens } from "../../hooks/useThemeTokens";
import { ACTION_FILTERS, getIcon, MARKET_FILTERS } from "./constants";

export function TradingSignalsFiltersStrip({
    tk,
    t,
    language,
    searchQuery,
    setSearchQuery,
    marketFilter,
    setMarketFilter,
    actionFilter,
    setActionFilter,
    assetFilter,
    setAssetFilter,
    showAssetDropdown,
    setShowAssetDropdown,
    dropdownAssets,
    tfFilter,
    setTfFilter,
    allTimeframes,
    filteredAssets,
    allAssetNames,
}: {
    tk: ThemeTokens;
    t: (k: string) => string;
    language: string;
    searchQuery: string;
    setSearchQuery: (v: string) => void;
    marketFilter: string;
    setMarketFilter: (v: string) => void;
    actionFilter: string;
    setActionFilter: (v: string) => void;
    assetFilter: string;
    setAssetFilter: (v: string) => void;
    showAssetDropdown: boolean;
    setShowAssetDropdown: (v: boolean) => void;
    dropdownAssets: string[];
    tfFilter: string;
    setTfFilter: (v: string) => void;
    allTimeframes: string[];
    filteredAssets: string[];
    allAssetNames: string[];
}) {
    return (
        <>
            <div
                className="px-3 sm:px-5 py-4 mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-3 rounded-t-lg mx-0 overflow-visible max-[800px]:flex-col max-[800px]:items-stretch max-[800px]:gap-4"
                style={{
                    borderTop: "2px solid rgba(99,102,241,0.25)",
                    background:
                        "linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(168,85,247,0.025) 50%, rgba(99,102,241,0.05) 100%)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
            >
                <div className="relative flex-shrink-0 w-full max-w-[180px] max-[800px]:max-w-none">
                    <Search
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                        style={{ color: "#475569" }}
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t("searchAsset")}
                        className="w-full rounded-lg text-xs font-medium py-2 pl-8 pr-7 outline-none"
                        style={{
                            background: tk.inputBg,
                            color: tk.inputText,
                            border: "1px solid rgba(99,102,241,0.1)",
                        }}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                        >
                            <X className="w-3 h-3" style={{ color: "#475569" }} />
                        </button>
                    )}
                </div>

                <div className="w-px h-6 shrink-0 max-[800px]:hidden self-center" style={{ background: "rgba(99,102,241,0.1)" }} />

                <div className="flex flex-wrap items-center gap-1 w-full min-[801px]:w-auto">
                    {MARKET_FILTERS.map((f) => {
                        const active = marketFilter === f.key;
                        return (
                            <motion.button
                                type="button"
                                key={f.key}
                                onClick={() => {
                                    setMarketFilter(f.key);
                                    setAssetFilter("ALL");
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all"
                                style={{
                                    color: active ? f.color : "#475569",
                                    background: active ? `${f.color}12` : "transparent",
                                    border: active ? `1px solid ${f.color}25` : "1px solid transparent",
                                    boxShadow: active ? `0 0 8px ${f.color}10` : "none",
                                }}
                            >
                                <span className="text-xs">{f.emoji}</span>{" "}
                                {f.key === "ALL" ? t("allAssetsStr") : t(f.key.toLowerCase())}
                            </motion.button>
                        );
                    })}
                </div>

                <div className="w-px h-6" style={{ background: "rgba(99,102,241,0.1)" }} />

                <div className="flex items-center gap-1">
                    {ACTION_FILTERS.map((f) => {
                        const active = actionFilter === f.key;
                        return (
                            <motion.button
                                type="button"
                                key={f.key}
                                onClick={() => setActionFilter(f.key)}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all"
                                style={{
                                    color: active ? f.color : "#475569",
                                    background: active ? `${f.color}12` : "transparent",
                                    border: active ? `1px solid ${f.color}25` : "1px solid transparent",
                                    boxShadow: active ? `0 0 8px ${f.color}10` : "none",
                                }}
                            >
                                {f.key === "ALL" ? t("allAssetsStr") : t(f.key.toLowerCase())}
                            </motion.button>
                        );
                    })}
                </div>

                <div className="w-px h-6 shrink-0 max-[800px]:hidden self-center" style={{ background: "rgba(99,102,241,0.1)" }} />

                <div className="relative w-full min-[801px]:w-auto overflow-visible">
                    <motion.button
                        type="button"
                        onClick={() => setShowAssetDropdown(!showAssetDropdown)}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer"
                        style={{
                            color: assetFilter !== "ALL" ? "#e2e8f0" : "#475569",
                            background:
                                assetFilter !== "ALL" ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)",
                            border:
                                assetFilter !== "ALL"
                                    ? "1px solid rgba(99,102,241,0.2)"
                                    : "1px solid rgba(255,255,255,0.05)",
                        }}
                    >
                        {assetFilter !== "ALL" && <span className="text-sm">{getIcon(assetFilter)}</span>}
                        {assetFilter !== "ALL" ? assetFilter : t("assetSingular")}
                        <ChevronDown className="w-3 h-3" />
                    </motion.button>

                    {showAssetDropdown && (
                        <div
                            className="absolute top-full left-0 max-[800px]:left-0 max-[800px]:right-0 mt-1 z-50 rounded-xl shadow-2xl overflow-x-visible"
                            style={{
                                background: "#0d1225",
                                border: "1px solid rgba(99,102,241,0.15)",
                                minWidth: 220,
                                maxHeight: 320,
                            }}
                        >
                            <div className="overflow-y-auto overflow-x-visible rounded-xl" style={{ maxHeight: 320 }}>
                                <button
                                    onClick={() => {
                                        setAssetFilter("ALL");
                                        setShowAssetDropdown(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-bold cursor-pointer hover:bg-white/5 transition-colors"
                                    style={{
                                        color: assetFilter === "ALL" ? "#818cf8" : "#94a3b8",
                                        borderBottom: "1px solid rgba(255,255,255,0.03)",
                                    }}
                                >
                                    🌐{" "}
                                    {language === "ar"
                                        ? "الكل"
                                        : language === "ru"
                                          ? "Все активы"
                                          : language === "tr"
                                            ? "Tüm Varlıklar"
                                            : language === "fr"
                                              ? "Tous les Actifs"
                                              : language === "es"
                                                ? "Todos los Activos"
                                                : "All Assets"}
                                </button>
                                {dropdownAssets.map((a) => (
                                    <button
                                        key={a}
                                        onClick={() => {
                                            setAssetFilter(a);
                                            setShowAssetDropdown(false);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-bold cursor-pointer hover:bg-white/5 transition-colors"
                                        style={{
                                            color: assetFilter === a ? "#e2e8f0" : "#94a3b8",
                                            background: assetFilter === a ? "rgba(99,102,241,0.08)" : "transparent",
                                            borderBottom: "1px solid rgba(255,255,255,0.02)",
                                        }}
                                    >
                                        <span className="text-sm w-6 text-center">{getIcon(a)}</span>
                                        <span className="tracking-wide">{a}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-px h-6 shrink-0 max-[800px]:hidden self-center" style={{ background: "rgba(99,102,241,0.1)" }} />

                <div className="flex flex-wrap items-center gap-1 gap-y-2 w-full min-[801px]:flex-1 min-[801px]:min-w-0">
                    <motion.button
                        type="button"
                        onClick={() => setTfFilter("ALL")}
                        whileTap={{ scale: 0.95 }}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                        style={{
                            color: tfFilter === "ALL" ? "#818cf8" : "#475569",
                            background: tfFilter === "ALL" ? "rgba(99,102,241,0.12)" : "transparent",
                            border: tfFilter === "ALL" ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent",
                        }}
                    >
                        {language === "ar"
                            ? "الكل"
                            : language === "ru"
                              ? "Все"
                              : language === "tr"
                                ? "Tümü"
                                : language === "fr"
                                  ? "Tout"
                                  : language === "es"
                                    ? "Todo"
                                    : "All"}
                    </motion.button>
                    {allTimeframes.map((tf) => {
                        const active = tfFilter === tf;
                        return (
                            <motion.button
                                type="button"
                                key={tf}
                                onClick={() => setTfFilter(tf)}
                                whileTap={{ scale: 0.95 }}
                                className="px-2 py-1 rounded-lg text-[10px] font-black font-mono cursor-pointer transition-all"
                                style={{
                                    color: active ? "#a5b4fc" : "#475569",
                                    background: active ? "rgba(99,102,241,0.12)" : "transparent",
                                    border: active ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent",
                                    textShadow: active ? "0 0 6px rgba(99,102,241,0.3)" : "none",
                                }}
                            >
                                {tf}
                            </motion.button>
                        );
                    })}
                </div>

                <span className="text-[10px] font-mono ml-auto max-[800px]:ml-0 max-[800px]:w-full max-[800px]:text-center min-[801px]:shrink-0 pt-1 min-[801px]:pt-0" style={{ color: "#475569" }}>
                    {filteredAssets.length}/{allAssetNames.length}
                </span>
            </div>

            {showAssetDropdown && (
                <div className="fixed inset-0 z-40" onClick={() => setShowAssetDropdown(false)} />
            )}
        </>
    );
}
