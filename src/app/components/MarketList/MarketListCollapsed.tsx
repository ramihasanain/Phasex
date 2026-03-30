import { ChevronsRight, Loader2 } from "lucide-react";
import type { MarketInfo } from "../../hooks/useMarketsAPI";
import type { ThemeTokens } from "../../hooks/useThemeTokens";
import { getMarketVisual } from "./marketListConstants";

type Props = {
    tk: ThemeTokens;
    d: boolean;
    accent: string;
    markets: MarketInfo[];
    marketsLoading: boolean;
    selectedMarket: MarketInfo | null;
    onMarketSelect: (market: MarketInfo) => void;
    onToggleCollapse?: () => void;
};

export function MarketListCollapsed({
    tk,
    d,
    accent,
    markets,
    marketsLoading,
    selectedMarket,
    onMarketSelect,
    onToggleCollapse,
}: Props) {
    return (
        <div
            className="h-full rounded-2xl flex flex-col items-center py-3 gap-2 relative overflow-hidden"
            style={{
                background: d
                    ? "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.04) 0%, rgba(6,10,16,0.95) 60%)"
                    : tk.surface,
                border: `1px solid ${d ? "rgba(99,102,241,0.1)" : tk.border}`,
                backdropFilter: d ? "blur(16px)" : undefined,
            }}
        >
            {onToggleCollapse && (
                <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-2 cursor-pointer"
                    style={{
                        color: tk.textMuted,
                        background: d ? "rgba(99,102,241,0.06)" : tk.surfaceHover,
                        border: `1px solid ${d ? "rgba(99,102,241,0.1)" : tk.border}`,
                    }}
                >
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
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => onMarketSelect(m)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all text-sm"
                            style={{
                                background: active ? `${accent}0.08)` : "transparent",
                                border: active ? `1px solid ${accent}0.15)` : "1px solid transparent",
                            }}
                        >
                            {vis.emoji}
                        </button>
                    );
                })
            )}
        </div>
    );
}
