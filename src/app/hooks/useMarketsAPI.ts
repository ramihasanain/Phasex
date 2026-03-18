import { useState, useEffect, useRef, useCallback } from "react";

const API_BASE = "https://phase-x-qc8dy.ondigitalocean.app/api/v1";

/* ─── API Types ─── */
export interface MarketInfo {
    id: number;
    code: string;
}

interface APISymbol {
    id: number;
    code: string;
    market_id: number | null;
}

export interface MarketAsset {
    id: string;
    name: string;
    nameEn: string;
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    market: string;
    marketId: number | null;
}

/* ─── Symbol Display Names ─── */
const SYMBOL_NAMES: Record<string, { ar: string; en: string }> = {
    ADAUSD: { ar: "كاردانو", en: "Cardano" },
    ATOMUSD: { ar: "أتوم", en: "Cosmos" },
    AVAXUSD: { ar: "أفالانش", en: "Avalanche" },
    AXSUSD: { ar: "أكسي إنفينيتي", en: "Axie" },
    BCHUSD: { ar: "بتكوين كاش", en: "Bitcoin Cash" },
    BNBUSD: { ar: "بينانس كوين", en: "Binance Coin" },
    BTCUSD: { ar: "بتكوين", en: "Bitcoin" },
    COMPUSD: { ar: "كومباوند", en: "Compound" },
    DOTUSD: { ar: "بولكادوت", en: "Polkadot" },
    DASHUSD: { ar: "داش", en: "Dash" },
    ETCUSD: { ar: "إيثريوم كلاسيك", en: "Ethereum Classic" },
    ETHUSD: { ar: "إيثريوم", en: "Ethereum" },
    LINKUSD: { ar: "تشينلينك", en: "Chainlink" },
    LTCUSD: { ar: "لايتكوين", en: "Litecoin" },
    SOLUSD: { ar: "سولانا", en: "Solana" },
    TRUMPUSD: { ar: "ترامب", en: "Trump" },
    UNIUSD: { ar: "يوني سواب", en: "Uniswap" },
    XRPUSD: { ar: "ريبل", en: "Ripple" },
    YFIUSD: { ar: "يرن فاينانس", en: "Yearn Finance" },
    AUDCAD: { ar: "أسترالي/كندي", en: "AUD/CAD" },
    AUDCHF: { ar: "أسترالي/فرنك", en: "AUD/CHF" },
    AUDJPY: { ar: "أسترالي/ين", en: "AUD/JPY" },
    AUDNZD: { ar: "أسترالي/نيوزيلندي", en: "AUD/NZD" },
    AUDUSD: { ar: "أسترالي/دولار", en: "AUD/USD" },
    CADCHF: { ar: "كندي/فرنك", en: "CAD/CHF" },
    CADJPY: { ar: "كندي/ين", en: "CAD/JPY" },
    CHFJPY: { ar: "فرنك/ين", en: "CHF/JPY" },
    EURAUD: { ar: "يورو/أسترالي", en: "EUR/AUD" },
    EURCAD: { ar: "يورو/كندي", en: "EUR/CAD" },
    EURCHF: { ar: "يورو/فرنك", en: "EUR/CHF" },
    EURGBP: { ar: "يورو/باوند", en: "EUR/GBP" },
    EURJPY: { ar: "يورو/ين", en: "EUR/JPY" },
    EURNZD: { ar: "يورو/نيوزيلندي", en: "EUR/NZD" },
    EURUSD: { ar: "يورو/دولار", en: "EUR/USD" },
    GBPAUD: { ar: "باوند/أسترالي", en: "GBP/AUD" },
    GBPCAD: { ar: "باوند/كندي", en: "GBP/CAD" },
    GBPCHF: { ar: "باوند/فرنك", en: "GBP/CHF" },
    GBPJPY: { ar: "باوند/ين", en: "GBP/JPY" },
    GBPNZD: { ar: "باوند/نيوزيلندي", en: "GBP/NZD" },
    GBPUSD: { ar: "باوند/دولار", en: "GBP/USD" },
    NZDCAD: { ar: "نيوزيلندي/كندي", en: "NZD/CAD" },
    NZDCHF: { ar: "نيوزيلندي/فرنك", en: "NZD/CHF" },
    NZDJPY: { ar: "نيوزيلندي/ين", en: "NZD/JPY" },
    NZDUSD: { ar: "نيوزيلندي/دولار", en: "NZD/USD" },
    USDCAD: { ar: "دولار/كندي", en: "USD/CAD" },
    USDCHF: { ar: "دولار/فرنك", en: "USD/CHF" },
    USDJPY: { ar: "دولار/ين", en: "USD/JPY" },
    XAUUSD: { ar: "ذهب/دولار", en: "Gold/USD" },
    XAGUSD: { ar: "فضة/دولار", en: "Silver/USD" },
    UKOILRoll: { ar: "نفط برنت", en: "Brent Oil" },
    USOILRoll: { ar: "نفط أمريكي", en: "US Oil" },
    AUS200Roll: { ar: "أستراليا 200", en: "AUS200" },
    CHINA50Roll: { ar: "الصين 50", en: "CHINA50" },
    CHshares: { ar: "الأسهم الصينية", en: "CH Shares" },
    DE40Roll: { ar: "ألمانيا 40", en: "GER40" },
    ESP35Roll: { ar: "إسبانيا 35", en: "ESP35" },
    EU50Roll: { ar: "أوروبا 50", en: "EU50" },
    FRA40Roll: { ar: "فرنسا 40", en: "FRA40" },
    HK50Roll: { ar: "هونج كونج 50", en: "HK50" },
    JP225Roll: { ar: "اليابان 225", en: "JP225" },
    NL25Roll: { ar: "هولندا 25", en: "NL25" },
    NORWAY25Roll: { ar: "النرويج 25", en: "NORWAY25" },
    RUSS2000: { ar: "روسل 2000", en: "RUSS2000" },
    SWISS20Roll: { ar: "سويسرا 20", en: "SWISS20" },
    UK100Roll: { ar: "بريطانيا 100", en: "UK100" },
    US30Roll: { ar: "داو جونز", en: "US30" },
    US500Roll: { ar: "يو إس 500", en: "US500" },
    UT100Roll: { ar: "يو إس 100", en: "US100" },
    VIXRoll: { ar: "فيكس", en: "VIX" },
};

function getSymbolName(code: string): { ar: string; en: string } {
    if (SYMBOL_NAMES[code]) return SYMBOL_NAMES[code];
    // Auto-generate for forex pairs like "EURUSD"
    if (code.length === 6 && /^[A-Z]{6}$/.test(code)) {
        return { ar: `${code.slice(0, 3)}/${code.slice(3)}`, en: `${code.slice(0, 3)}/${code.slice(3)}` };
    }
    return { ar: code, en: code };
}

/* ─── Hook Return Type ─── */
export interface UseMarketsAPIResult {
    // Markets (loaded on page init)
    markets: MarketInfo[];
    marketsLoading: boolean;
    marketsError: string | null;
    // Selected market
    selectedMarket: MarketInfo | null;
    setSelectedMarket: (market: MarketInfo) => void;
    // Symbols for selected market
    filteredAssets: MarketAsset[];
    symbolsLoading: boolean;
    symbolsError: string | null;
}

/* ─── Hook ─── */
export function useMarketsAPI(accessToken?: string | null): UseMarketsAPIResult {
    // Markets state
    const [markets, setMarkets] = useState<MarketInfo[]>([]);
    const [marketsLoading, setMarketsLoading] = useState(true);
    const [marketsError, setMarketsError] = useState<string | null>(null);

    // Selected market
    const [selectedMarket, setSelectedMarket] = useState<MarketInfo | null>(null);

    // All symbols (raw from API)
    const [allSymbols, setAllSymbols] = useState<APISymbol[]>([]);
    const [symbolsLoading, setSymbolsLoading] = useState(false);
    const [symbolsError, setSymbolsError] = useState<string | null>(null);

    // Prevent concurrent symbol fetches
    const fetchingRef = useRef(false);
    const abortRef = useRef<AbortController | null>(null);

    // ─── Step 1: Fetch MARKETS on page load ───
    useEffect(() => {
        let cancelled = false;
        async function fetchMarkets() {
            try {
                const headers: Record<string, string> = {};
                if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
                const res = await fetch(`${API_BASE}/markets`, { headers });
                if (!res.ok) throw new Error(`Markets API error: ${res.status}`);
                const json = await res.json();
                if (cancelled) return;

                const apiMarkets: MarketInfo[] = json.markets || [];
                const marketsWithAll = [{ id: -1, code: "ALL" }, ...apiMarkets];
                setMarkets(marketsWithAll);
                setMarketsError(null);

                // Auto-select default market (FOREX if available, otherwise first)
                if (marketsWithAll.length > 0) {
                    const defaultMarket = marketsWithAll.find((m) => m.code === "FOREX") || marketsWithAll[0];
                    setSelectedMarket(defaultMarket);
                }
            } catch (err: any) {
                if (!cancelled) setMarketsError(err.message || "Failed to fetch markets");
            } finally {
                if (!cancelled) setMarketsLoading(false);
            }
        }
        fetchMarkets();
        return () => { cancelled = true; };
    }, [accessToken]);

    // ─── Step 2: Fetch SYMBOLS whenever selectedMarket changes ───
    useEffect(() => {
        if (!selectedMarket) return;

        // Abort previous request
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        async function fetchSymbols() {
            setSymbolsLoading(true);
            setSymbolsError(null);
            try {
                const headers: Record<string, string> = {};
                if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
                const res = await fetch(`${API_BASE}/symbols`, { signal: controller.signal, headers });
                if (!res.ok) throw new Error(`Symbols API error: ${res.status}`);
                const json = await res.json();
                if (controller.signal.aborted) return;

                setAllSymbols(json.symbols || []);
            } catch (err: any) {
                if (err.name === "AbortError") return;
                setSymbolsError(err.message || "Failed to fetch symbols");
            } finally {
                if (!controller.signal.aborted) setSymbolsLoading(false);
            }
        }
        fetchSymbols();

        return () => { controller.abort(); };
    }, [selectedMarket]);

    // ─── Filter symbols by selected market and transform to MarketAsset ───
    const filteredAssets: MarketAsset[] = (() => {
        if (!selectedMarket || allSymbols.length === 0) return [];

        const matched = selectedMarket.code === "ALL" 
            ? allSymbols 
            : allSymbols.filter((sym) => sym.market_id === selectedMarket.id);

        return matched
            .map((sym) => {
                const names = getSymbolName(sym.code);
                return {
                    id: `sym-${sym.id}`,
                    name: names.ar,
                    nameEn: names.en,
                    symbol: sym.code,
                    price: 0,
                    change: 0,
                    changePercent: 0,
                    market: selectedMarket.code,
                    marketId: sym.market_id,
                };
            })
            .sort((a, b) => a.symbol.localeCompare(b.symbol));
    })();

    return {
        markets,
        marketsLoading,
        marketsError,
        selectedMarket,
        setSelectedMarket,
        filteredAssets,
        symbolsLoading,
        symbolsError,
    };
}
