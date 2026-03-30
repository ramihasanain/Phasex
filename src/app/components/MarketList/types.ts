import type { MarketInfo } from "../../hooks/useMarketsAPI";

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

export interface MarketListProps {
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
