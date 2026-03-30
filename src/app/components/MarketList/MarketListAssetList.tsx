import { Search, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { MarketInfo } from "../../hooks/useMarketsAPI";
import type { ThemeTokens } from "../../hooks/useThemeTokens";
import { symbolIcons } from "./marketListConstants";
import type { Asset } from "./types";

type Props = {
    tk: ThemeTokens;
    d: boolean;
    accent: string;
    isRTL: boolean;
    t: (key: string) => string;
    symbolsLoading: boolean;
    filtered: Asset[];
    selectedAsset: Asset | null;
    onSelectAsset: (asset: Asset) => void;
    selectedMarket: MarketInfo | null;
    flashMap: Record<string, "up" | "down" | null>;
};

export function MarketListAssetList({
    tk,
    d,
    accent,
    isRTL,
    t,
    symbolsLoading,
    filtered,
    selectedAsset,
    onSelectAsset,
    selectedMarket,
    flashMap,
}: Props) {
    return (
        <div
            className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5 relative z-10"
            style={{ scrollbarWidth: "thin", scrollbarColor: `${tk.scrollbar} transparent` }}
        >
            {symbolsLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="relative w-12 h-12">
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ border: `2px solid ${accent}0.1)`, borderTopColor: tk.info }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                    <p className="text-[10px] font-bold tracking-wider" style={{ color: tk.textDim }}>
                        {t("loadingSymbols")}
                    </p>
                </div>
            ) : (
                <AnimatePresence mode="popLayout">
                    {filtered.length > 0 ? (
                        filtered.map((asset) => {
                            const pos = asset.change >= 0;
                            const selected = selectedAsset?.id === asset.id;
                            const decimals =
                                selectedMarket?.code === "CRYPTO" || selectedMarket?.code === "INDEX" ? 2 : 4;
                            const icon = symbolIcons[asset.symbol] || "📌";
                            const flash = flashMap[asset.symbol];
                            const priceColor = pos ? tk.positive : tk.negative;

                            return (
                                <motion.button
                                    key={asset.id}
                                    type="button"
                                    onClick={() => onSelectAsset(asset)}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    whileHover={{ x: isRTL ? -2 : 2 }}
                                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                                    style={{
                                        background: selected ? `${accent}0.06)` : "transparent",
                                        border: selected ? `1px solid ${accent}0.12)` : "1px solid transparent",
                                        boxShadow: selected && d ? "0 2px 12px rgba(99,102,241,0.06)" : "none",
                                    }}
                                >
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <span className="text-[14px] flex-shrink-0 w-5 text-center">{icon}</span>
                                        <div className="min-w-0">
                                            <div className="text-[11px] font-black truncate tracking-wider" style={{ color: tk.textPrimary }}>
                                                {asset.symbol.replace(".p", "")}
                                            </div>
                                            <div className="text-[8px] font-bold" style={{ color: tk.textDim }}>
                                                {isRTL ? asset.name : asset.nameEn}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        key={`${asset.symbol}-${asset.price}`}
                                        className={`text-[11px] font-black tabular-nums px-2 py-0.5 rounded-lg ${flash === "up" ? "price-flash-up" : flash === "down" ? "price-flash-down" : ""}`}
                                        style={{ color: priceColor }}
                                    >
                                        {asset.price.toLocaleString(undefined, {
                                            minimumFractionDigits: decimals,
                                            maximumFractionDigits: decimals,
                                        })}
                                    </div>
                                    <div
                                        className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg text-[10px] font-black"
                                        style={{
                                            background: pos ? tk.positiveBg : tk.negativeBg,
                                            color: pos ? tk.positive : tk.negative,
                                            border: `1px solid ${pos ? tk.positiveBorder : tk.negativeBorder}`,
                                        }}
                                    >
                                        {pos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                        {pos ? "+" : ""}
                                        {asset.changePercent.toFixed(2)}%
                                    </div>
                                </motion.button>
                            );
                        })
                    ) : (
                        <div className="text-center py-12">
                            <Search className="w-8 h-8 mx-auto mb-2" style={{ color: tk.textDim }} />
                            <p className="text-[10px] font-bold" style={{ color: tk.textDim }}>
                                {t("noResults")}
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}
