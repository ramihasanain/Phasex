import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useThemeTokens } from "../hooks/useThemeTokens";
import { MarketListAssetList } from "./MarketList/MarketListAssetList";
import { MarketListCollapsed } from "./MarketList/MarketListCollapsed";
import { MarketListTopSection } from "./MarketList/MarketListTopSection";
import { flashStyles } from "./MarketList/marketListConstants";
import type { MarketListProps } from "./MarketList/types";
import { useMarketListFlash } from "./MarketList/useMarketListFlash";

export type { Asset, MarketListProps } from "./MarketList/types";

export function MarketList({
    assets,
    selectedAsset,
    onSelectAsset,
    isCollapsed,
    onToggleCollapse,
    markets,
    marketsLoading,
    selectedMarket,
    onMarketSelect,
    symbolsLoading,
}: MarketListProps) {
    const { language, t } = useLanguage();
    const isRTL = language === "ar";
    const tk = useThemeTokens();
    const d = tk.isDark;
    const accent = d ? "rgba(99,102,241," : "rgba(79,70,229,";
    const [search, setSearch] = useState("");

    const { flashMap } = useMarketListFlash(assets);

    const filtered = assets.filter(
        (a) =>
            a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.nameEn.toLowerCase().includes(search.toLowerCase()) ||
            a.symbol.toLowerCase().includes(search.toLowerCase())
    );

    const positiveCount = assets.filter((a) => a.change >= 0).length;
    const negativeCount = assets.length - positiveCount;
    const positivePct = assets.length > 0 ? Math.round((positiveCount / assets.length) * 100) : 0;

    if (isCollapsed) {
        return (
            <MarketListCollapsed
                tk={tk}
                d={d}
                accent={accent}
                markets={markets}
                marketsLoading={marketsLoading}
                selectedMarket={selectedMarket}
                onMarketSelect={onMarketSelect}
                onToggleCollapse={onToggleCollapse}
            />
        );
    }

    return (
        <div
            className="h-full rounded-2xl flex flex-col overflow-hidden relative"
            style={{
                background: d
                    ? "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.04) 0%, rgba(6,10,16,0.95) 60%)"
                    : tk.surface,
                border: `1px solid ${d ? "rgba(99,102,241,0.1)" : tk.border}`,
                backdropFilter: d ? "blur(16px)" : undefined,
            }}
        >
            <style dangerouslySetInnerHTML={{ __html: flashStyles }} />

            {d && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(99,102,241,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.015) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
            )}

            <MarketListTopSection
                tk={tk}
                d={d}
                accent={accent}
                isRTL={isRTL}
                t={t}
                search={search}
                setSearch={setSearch}
                markets={markets}
                marketsLoading={marketsLoading}
                selectedMarket={selectedMarket}
                onMarketSelect={onMarketSelect}
                onToggleCollapse={onToggleCollapse}
                symbolsLoading={symbolsLoading}
                assetsLength={assets.length}
                positivePct={positivePct}
                positiveCount={positiveCount}
                negativeCount={negativeCount}
            />

            <MarketListAssetList
                tk={tk}
                d={d}
                accent={accent}
                isRTL={isRTL}
                t={t}
                symbolsLoading={symbolsLoading}
                filtered={filtered}
                selectedAsset={selectedAsset}
                onSelectAsset={onSelectAsset}
                selectedMarket={selectedMarket}
                flashMap={flashMap}
            />
        </div>
    );
}
