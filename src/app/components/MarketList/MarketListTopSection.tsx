import { Search, ChevronsLeft, TrendingUp, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import type { MarketInfo } from "../../hooks/useMarketsAPI";
import type { ThemeTokens } from "../../hooks/useThemeTokens";
import { getMarketVisual } from "./marketListConstants";

type TFn = (key: string) => string;

type Props = {
    tk: ThemeTokens;
    d: boolean;
    accent: string;
    isRTL: boolean;
    t: TFn;
    search: string;
    setSearch: (v: string) => void;
    markets: MarketInfo[];
    marketsLoading: boolean;
    selectedMarket: MarketInfo | null;
    onMarketSelect: (market: MarketInfo) => void;
    onToggleCollapse?: () => void;
    symbolsLoading: boolean;
    assetsLength: number;
    positivePct: number;
    positiveCount: number;
    negativeCount: number;
};

export function MarketListTopSection({
    tk,
    d,
    accent,
    isRTL,
    t,
    search,
    setSearch,
    markets,
    marketsLoading,
    selectedMarket,
    onMarketSelect,
    onToggleCollapse,
    symbolsLoading,
    assetsLength,
    positivePct,
    positiveCount,
    negativeCount,
}: Props) {
    return (
        <>
            <div
                className="px-4 pt-4 pb-2 flex items-center justify-between relative z-10"
                style={{ borderBottom: `1px solid ${d ? "rgba(99,102,241,0.06)" : tk.border}` }}
            >
                <div className="flex items-center gap-2.5">
                    <motion.div
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: `${accent}0.08)`, border: `1px solid ${accent}0.15)` }}
                        animate={
                            d
                                ? {
                                      boxShadow: [
                                          "0 0 0 rgba(99,102,241,0)",
                                          "0 0 15px rgba(99,102,241,0.1)",
                                          "0 0 0 rgba(99,102,241,0)",
                                      ],
                                  }
                                : {}
                        }
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <TrendingUp className="w-4 h-4" style={{ color: tk.info }} />
                    </motion.div>
                    <div>
                        <h2 className="text-sm font-black tracking-wide" style={{ color: tk.textPrimary }}>
                            {t("markets")}
                        </h2>
                        <span className="text-[9px] font-bold tracking-wider" style={{ color: tk.textDim }}>
                            {symbolsLoading ? t("loadingMarkets") : `${assetsLength} ${t("total")}`}
                        </span>
                    </div>
                </div>
                {onToggleCollapse && (
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer"
                        style={{
                            color: tk.textMuted,
                            background: d ? "rgba(99,102,241,0.06)" : tk.surfaceHover,
                            border: `1px solid ${d ? "rgba(99,102,241,0.1)" : tk.border}`,
                        }}
                    >
                        <ChevronsLeft className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            <div className="px-3 py-2.5 relative z-10">
                <div
                    className="flex gap-1 p-1 rounded-xl"
                    style={{
                        background: d ? "rgba(99,102,241,0.03)" : tk.surfaceHover,
                        border: `1px solid ${d ? "rgba(99,102,241,0.06)" : tk.border}`,
                    }}
                >
                    {marketsLoading ? (
                        <div className="flex-1 flex items-center justify-center py-3">
                            <Loader2 className="w-5 h-5 animate-spin" style={{ color: tk.info }} />
                        </div>
                    ) : (
                        markets.map((m) => {
                            const active = selectedMarket?.id === m.id;
                            return (
                                <motion.button
                                    key={m.id}
                                    type="button"
                                    onClick={() => {
                                        onMarketSelect(m);
                                        setSearch("");
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg cursor-pointer transition-all"
                                    style={{
                                        background: active ? `${accent}0.08)` : "transparent",
                                        border: active ? `1px solid ${accent}0.15)` : "1px solid transparent",
                                        boxShadow: active && d ? "0 2px 10px rgba(99,102,241,0.08)" : "none",
                                    }}
                                >
                                    <span className="text-[18px] leading-none">{getMarketVisual(m.code).emoji}</span>
                                    <span className="text-[9px] font-bold tracking-wider" style={{ color: active ? tk.info : tk.textDim }}>
                                        {t(m.code.toLowerCase())}
                                    </span>
                                    {active && (
                                        <motion.div
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{ background: tk.info, boxShadow: d ? `0 0 6px ${tk.info}` : "none" }}
                                            animate={{ scale: [1, 1.3, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    )}
                                </motion.button>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="px-4 py-1.5 relative z-10">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold tracking-wider" style={{ color: tk.textMuted }}>
                        {positivePct}% {t("positive")}
                    </span>
                    <div className="flex items-center gap-3 text-[9px]">
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span style={{ color: tk.textDim }}>{positiveCount}</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            <span style={{ color: tk.textDim }}>{negativeCount}</span>
                        </span>
                    </div>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: d ? "rgba(99,102,241,0.06)" : tk.surfaceHover }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${positivePct}%` }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${tk.info}, ${accent}0.4))` }}
                    />
                </div>
            </div>

            <div className="px-3 py-2 relative z-10">
                <div className="relative">
                    <Search
                        className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                        style={{ color: tk.textDim, [isRTL ? "right" : "left"]: 10 }}
                    />
                    <input
                        type="text"
                        placeholder={t("searchAsset")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        dir={isRTL ? "rtl" : "ltr"}
                        className="w-full h-8 rounded-xl text-xs outline-none font-medium"
                        style={{
                            background: tk.inputBg,
                            border: `1px solid ${tk.inputBorder}`,
                            color: tk.inputText,
                            paddingLeft: isRTL ? 10 : 32,
                            paddingRight: isRTL ? 32 : 10,
                            caretColor: tk.info,
                        }}
                    />
                </div>
            </div>
        </>
    );
}
