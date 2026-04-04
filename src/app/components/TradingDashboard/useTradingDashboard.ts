import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme, themeOptions } from "../../contexts/ThemeContext";
import { useThemeTokens } from "../../hooks/useThemeTokens";
import { useAuth } from "../../contexts/AuthContext";
import { useLivePrices } from "../../hooks/useLivePrices";
import { useMarketsAPI } from "../../hooks/useMarketsAPI";
import { usePhaseStateAPI } from "../../hooks/usePhaseStateAPI";
import { useDirectionStateAPI } from "../../hooks/useDirectionStateAPI";
import { useEnvelopStateAPI } from "../../hooks/useEnvelopStateAPI";
import { useOscillationStateAPI } from "../../hooks/useOscillationStateAPI";
import { useDisplacementStateAPI } from "../../hooks/useDisplacementStateAPI";
import { useReferenceStateAPI } from "../../hooks/useReferenceStateAPI";
import { useMT5, MT5Credentials } from "../../hooks/useMT5";
import type { Asset } from "../MarketList";
import type { Indicator } from "../IndicatorChart";
import { indicators } from "./indicatorsConfig";
import { generateChartData } from "./chartGenerators";

/** Viewport width at or below this uses a collapsed-by-default market list and an overlay when expanded. */
export const MARKET_LIST_NARROW_MAX_PX = 800;

export function useTradingDashboard(
    onLogout: () => void,
    onOpenDynamics: (symbol?: string, tab?: string) => void,
) {
    const [chartLayout, setChartLayout] = useState<"single" | "split" | "quad">("single");
    const { theme, setTheme } = useTheme();
    const currentThemeOption = themeOptions.find((o) => o.key === theme) || themeOptions[0];
    const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
    const themeDropdownRef = useRef<HTMLDivElement>(null);
    const tk = useThemeTokens();
    const {
        subscriptionStatus, subscriptionPlan, subscriptionDetails,
        hasMT5Access, activateMT5, accessToken,
    } = useAuth();
    const { language, setLanguageKey, t } = useLanguage();
    const isRTL = language === "ar";
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const ribbonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node))
                setLangDropdownOpen(false);
            if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node))
                setThemeDropdownOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const languageOptions = [
        { code: "ar", label: "العربية", flagUrl: "sa" },
        { code: "en", label: "English", flagUrl: "gb" },
        { code: "ru", label: "Русский", flagUrl: "ru" },
        { code: "tr", label: "Türkçe", flagUrl: "tr" },
        { code: "fr", label: "Français", flagUrl: "fr" },
        { code: "es", label: "Español", flagUrl: "es" },
    ];
    const currentLangObj = languageOptions.find((l) => l.code === language) || languageOptions[1];

    const {
        markets: apiMarkets, marketsLoading, selectedMarket,
        setSelectedMarket, filteredAssets, symbolsLoading,
    } = useMarketsAPI(accessToken);

    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [liveChartData, setLiveChartData] = useState<any[]>([]);
    const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
    const [isNewsOpen, setIsNewsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMarketListNarrow, setIsMarketListNarrow] = useState(() =>
        typeof window !== "undefined" ? window.innerWidth <= MARKET_LIST_NARROW_MAX_PX : false
    );
    const [isMarketListCollapsed, setIsMarketListCollapsed] = useState(() =>
        typeof window !== "undefined" ? window.innerWidth <= MARKET_LIST_NARROW_MAX_PX : false
    );

    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${MARKET_LIST_NARROW_MAX_PX}px)`);
        const sync = () => {
            const narrow = mq.matches;
            setIsMarketListNarrow(narrow);
            if (narrow) setIsMarketListCollapsed(true);
        };
        sync();
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, []);
    const [timeframe, setTimeframe] = useState<number>(15);
    const [mtfEnabled, setMtfEnabled] = useState(false);
    const [isMT5PanelOpen, setIsMT5PanelOpen] = useState(true);
    const [isMT5LoginOpen, setIsMT5LoginOpen] = useState(false);
    const [isMT5SubscribeOpen, setIsMT5SubscribeOpen] = useState(false);
    const [mt5SubscribeTermsAccepted, setMt5SubscribeTermsAccepted] = useState(false);
    const [isMT5Processing, setIsMT5Processing] = useState(false);
    const [isMT5Pending, setIsMT5Pending] = useState(false);
    const [isMT5DisconnectOpen, setIsMT5DisconnectOpen] = useState(false);
    const [mt5Creds, setMT5Creds] = useState<MT5Credentials>(() => {
        try {
            const saved = localStorage.getItem("mt5_credentials");
            if (saved) return JSON.parse(saved);
        } catch {}
        return { login: "", password: "", server: "" };
    });
    const [showMT5Password, setShowMT5Password] = useState(false);
    const [mtfSmallTimeframe, setMtfSmallTimeframe] = useState<number>(5);
    const [mtfLargeTimeframe, setMtfLargeTimeframe] = useState<number>(240);
    const [quickTradeModal, setQuickTradeModal] = useState<{
        symbol: string; action: string; source?: "Chart" | "AI";
    } | null>(null);
    const [showMarketWatch, setShowMarketWatch] = useState(false);
    const [qtSL, setQtSL] = useState("");
    const [qtTP, setQtTP] = useState("");
    const [qtSymbol, setQtSymbol] = useState("");
    const [qtError, setQtError] = useState<string | null>(null);
    const [qtExecuting, setQtExecuting] = useState(false);
    const [qtLot, setQtLot] = useState("0.01");
    const [recentlyExecuted, setRecentlyExecuted] = useState<Set<string>>(new Set());
    const executedTradesRef = useRef<Set<string>>(new Set());

    const subInfo = {
        isActive: subscriptionStatus === "active",
        daysRemaining:
            subscriptionStatus === "active" && subscriptionDetails
                ? Math.max(0, Math.ceil((new Date(subscriptionDetails.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                : 0,
    };

    const activeSymbols = useMemo(() => filteredAssets.map((a) => a.symbol), [filteredAssets]);
    const { prices: livePrices, initialPrices, connected: wsConnected } = useLivePrices(activeSymbols);

    const {
        connected: mt5Connected, connecting: mt5Connecting, connectStatus: mt5ConnectStatus,
        connectMT5, disconnectMT5, account: mt5Account, positions: mt5Positions,
        positionsLoading: mt5PositionsLoading, error: mt5Error, tradeError, clearTradeError,
        history, refreshHistory, refreshAccount: refreshMT5Account,
        refreshPositions: refreshMT5Positions, executeTrade, bulkExecuteTrades,
        closePosition, closeAllPositions, symbolOverrides, setSymbolOverride,
        serverTradeHistory, fetchTradeHistory, addTradeToHistory, clearServerHistory,
        autoTrades, autoTradeWorker, autoTradeHistory, autoTradeSubscribe,
        autoTradeUnsubscribe, stopAllAutoTrades, fetchAutoTradeHistory, autoFlipCounts,
    } = useMT5();

    useEffect(() => {
        if (recentlyExecuted.size === 0 || mt5Positions.length === 0) return;
        const posSyms = new Set(mt5Positions.map((p: any) => p.symbol.toUpperCase().replace(/\.(raw|p|sd|lv)|micro|m$/i, "")));
        const toKeep = new Set<string>();
        recentlyExecuted.forEach((s) => { if (!posSyms.has(s)) toKeep.add(s); });
        if (toKeep.size !== recentlyExecuted.size) setRecentlyExecuted(toKeep);
    }, [mt5Positions, recentlyExecuted]);

    const WS_ALIASES: Record<string, string> = {
        GOLD: "XAUUSD", SILVER: "XAGUSD", UKOIL: "UKOILRoll", USOIL: "USOILRoll",
        BRENT: "UKOILRoll", WTI: "USOILRoll", UK100: "UK100Roll", US30: "US30Roll",
        US500: "US500Roll", US100: "UT100Roll", UT100: "UT100Roll",
    };
    const API_TO_WS: Record<string, string[]> = {};
    for (const [ws, api] of Object.entries(WS_ALIASES)) {
        if (!API_TO_WS[api]) API_TO_WS[api] = [];
        API_TO_WS[api].push(ws);
    }

    const liveAssets = useMemo(() => {
        return filteredAssets.map((asset) => {
            const aliases = API_TO_WS[asset.symbol] || [];
            let live = livePrices[asset.symbol] || livePrices[asset.symbol + ".p"] || undefined;
            let matchedKey = livePrices[asset.symbol] ? asset.symbol : livePrices[asset.symbol + ".p"] ? asset.symbol + ".p" : "";
            if (!live) {
                for (const alias of aliases) {
                    if (livePrices[alias]) { live = livePrices[alias]; matchedKey = alias; break; }
                }
            }
            if (!live) {
                const cleanSymbol = asset.symbol.replace(/Roll$/i, "").toUpperCase();
                for (const wsKey of Object.keys(livePrices)) {
                    const cleanWsKey = wsKey.replace(/\.p$/i, "").toUpperCase();
                    if (cleanSymbol.includes(cleanWsKey) || cleanWsKey.includes(cleanSymbol)) {
                        live = livePrices[wsKey]; matchedKey = wsKey; break;
                    }
                }
            }
            if (!live) return asset;
            const livePrice = (live.bid + live.ask) / 2;
            const basePrice = initialPrices[matchedKey] || livePrice;
            const change = livePrice - basePrice;
            const changePercent = basePrice !== 0 ? (change / basePrice) * 100 : 0;
            const priceDec = livePrice < 10 ? 4 : 2;
            return {
                ...asset,
                price: +livePrice.toFixed(priceDec),
                change: +change.toFixed(livePrice < 10 ? 4 : 2),
                changePercent: +changePercent.toFixed(2),
            };
        });
    }, [filteredAssets, livePrices, initialPrices]);

    const pickAsset = useCallback((a: Asset) => {
        setSelectedAsset(a);
        if (selectedIndicator) setChartData(generateChartData(a, selectedIndicator, timeframe));
    }, [selectedIndicator, timeframe]);

    const pickIndicator = useCallback((ind: Indicator) => {
        setSelectedIndicator(ind);
        if (selectedAsset) setChartData(generateChartData(selectedAsset, ind, timeframe));
    }, [selectedAsset, timeframe]);

    const pickTimeframe = useCallback((tf: number) => {
        setTimeframe(tf);
        if (selectedAsset && selectedIndicator) setChartData(generateChartData(selectedAsset, selectedIndicator, tf));
    }, [selectedAsset, selectedIndicator]);

    const liveSelectedAsset = useMemo(() => {
        if (!selectedAsset) return null;
        return liveAssets.find((a) => a.id === selectedAsset.id) || selectedAsset;
    }, [selectedAsset, liveAssets]);

    useEffect(() => {
        if (!selectedIndicator) {
            const phaseInd = indicators.find((i) => i.id === "phase");
            if (phaseInd) setSelectedIndicator(phaseInd);
        }
    }, [selectedIndicator]);

    useEffect(() => {
        if (!selectedAsset && liveAssets && liveAssets.length > 0 && !symbolsLoading) {
            const gold = liveAssets.find((a) => a.symbol === "XAUUSD" || a.id === "GOLD") || liveAssets[0];
            if (gold) {
                setSelectedAsset(gold);
                const ind = selectedIndicator || indicators.find((i) => i.id === "phase");
                if (ind) setChartData(generateChartData(gold, ind, timeframe));
            }
        }
    }, [selectedAsset, liveAssets, selectedIndicator, timeframe, symbolsLoading]);

    const formatTfStr = (tf: number) => tf >= 1440 ? `D${tf / 1440}` : tf >= 60 ? `H${tf / 60}` : `M${tf}`;
    const aiTf1 = mtfEnabled ? formatTfStr(mtfLargeTimeframe) : formatTfStr(timeframe >= 60 ? timeframe : 60);
    const aiTf2 = mtfEnabled ? formatTfStr(mtfSmallTimeframe) : formatTfStr(timeframe);

    const { candles: phaseCandles } = usePhaseStateAPI(selectedAsset?.symbol, aiTf1, aiTf2, selectedIndicator?.id === "phase", accessToken);
    const { candles: dirCandles } = useDirectionStateAPI(selectedAsset?.symbol, mtfEnabled ? mtfSmallTimeframe : timeframe, selectedIndicator?.id === "direction", accessToken);
    const { candles: oscCandles } = useOscillationStateAPI(selectedAsset?.symbol, mtfEnabled ? mtfSmallTimeframe : timeframe, selectedIndicator?.id === "oscillation", accessToken);
    const { candles: dispCandles } = useDisplacementStateAPI(selectedAsset?.symbol, mtfEnabled ? mtfSmallTimeframe : timeframe, selectedIndicator?.id === "displacement", accessToken);
    const { candles: refCandles } = useReferenceStateAPI(selectedAsset?.symbol, mtfEnabled ? mtfSmallTimeframe : timeframe, selectedIndicator?.id === "reference", accessToken);
    const { candles: envCandles } = useEnvelopStateAPI(selectedAsset?.symbol, mtfEnabled ? mtfSmallTimeframe : timeframe, selectedIndicator?.id === "envelop", accessToken);

    const aiMarketContext = useMemo(() => {
        if (!selectedAsset) return "No asset selected.";
        const liveMatch = liveAssets.find((a) => a.id === selectedAsset.id);
        const p = liveMatch ? liveMatch.price : selectedAsset.price;
        const c = liveMatch ? liveMatch.changePercent : selectedAsset.changePercent;
        const currentPhase = phaseCandles.length > 0 ? phaseCandles[phaseCandles.length - 1].value : "No Data";
        const currentDir = dirCandles.length > 0 ? dirCandles[dirCandles.length - 1].value : "No Data";
        const currentOsc = oscCandles.length > 0 ? oscCandles[oscCandles.length - 1].value : "No Data";
        const currentDisp = dispCandles.length > 0 ? dispCandles[dispCandles.length - 1].value : "No Data";
        const currentRef = refCandles.length > 0 ? refCandles[refCandles.length - 1].value : "No Data";
        const currentEnv = envCandles.length > 0 ? envCandles[envCandles.length - 1].value : "No Data";
        const activeTfStr = mtfEnabled ? `${formatTfStr(mtfLargeTimeframe)} -> ${formatTfStr(mtfSmallTimeframe)} (MTF)` : formatTfStr(timeframe);
        const renderData = liveChartData.length > 0 ? liveChartData : chartData;
        const recentCandles = renderData.slice(-100).map((cd) => {
            const oStr = cd.open !== undefined ? cd.open.toFixed(4) : cd.value ? cd.value.toFixed(4) : "N/A";
            const hStr = cd.high !== undefined ? cd.high.toFixed(4) : cd.value ? cd.value.toFixed(4) : "N/A";
            const lStr = cd.low !== undefined ? cd.low.toFixed(4) : cd.value ? cd.value.toFixed(4) : "N/A";
            const cStr = cd.close !== undefined ? cd.close.toFixed(4) : cd.value ? cd.value.toFixed(4) : "N/A";
            const timeStr = (cd.fullTime || cd.time || "").replace(/\n/g, " ");
            return `[${timeStr}] O: ${oStr}, H: ${hStr}, L: ${lStr}, C: ${cStr}`;
        }).join("\n    ");
        return `
    Asset: ${selectedAsset.symbol} (${selectedAsset.name})
    Current Price: ${p}
    Change (24h): ${c}%
    Active Timeframe Focus: ${activeTfStr}
    Current Selected Indicator Focus: ${selectedIndicator?.nameEn || "None"}
    
    ### Current Active Live Indicators Readings (Very Important to use these): 
    - Phase X State: ${currentPhase}
    - Direction State: ${currentDir}
    - Oscillation State: ${currentOsc}
    - Displacement State: ${currentDisp}
    - Reference State: ${currentRef}
    - Envelop State: ${currentEnv}
    
    ### Recent Price Action (OHLC Data - Oldest to Newest):
    ${recentCandles || "No Recent OHLC Data Available"}
    
    ### Task: A value like "1" or "0" often signifies "Up" or "Down" depending on the indicator logic. A value of "No Data" means the AI cannot confidently answer related to that indicator.
    `.trim();
    }, [selectedAsset, liveAssets, timeframe, selectedIndicator, phaseCandles, dirCandles, oscCandles, dispCandles, refCandles, envCandles, liveChartData, mtfEnabled, mtfLargeTimeframe, mtfSmallTimeframe, chartData]);

    return {
        onLogout, onOpenDynamics, chartLayout, setChartLayout,
        theme, setTheme, currentThemeOption, themeDropdownOpen, setThemeDropdownOpen, themeDropdownRef, tk,
        subscriptionStatus, subscriptionPlan, subscriptionDetails, hasMT5Access, activateMT5, accessToken,
        language, setLanguageKey, t, isRTL, langDropdownOpen, setLangDropdownOpen, dropdownRef, ribbonRef,
        languageOptions, currentLangObj,
        apiMarkets, marketsLoading, selectedMarket, setSelectedMarket, filteredAssets, symbolsLoading,
        selectedAsset, setSelectedAsset, selectedIndicator, setSelectedIndicator,
        chartData, setChartData, liveChartData, setLiveChartData,
        isSubscriptionOpen, setIsSubscriptionOpen, isNewsOpen, setIsNewsOpen,
        isProfileOpen, setIsProfileOpen,
        isMarketListNarrow, isMarketListCollapsed, setIsMarketListCollapsed,
        timeframe, setTimeframe, mtfEnabled, setMtfEnabled,
        isMT5PanelOpen, setIsMT5PanelOpen, isMT5LoginOpen, setIsMT5LoginOpen,
        isMT5SubscribeOpen, setIsMT5SubscribeOpen, mt5SubscribeTermsAccepted, setMt5SubscribeTermsAccepted,
        isMT5Processing, setIsMT5Processing, isMT5Pending, setIsMT5Pending,
        isMT5DisconnectOpen, setIsMT5DisconnectOpen, mt5Creds, setMT5Creds,
        showMT5Password, setShowMT5Password,
        mtfSmallTimeframe, setMtfSmallTimeframe, mtfLargeTimeframe, setMtfLargeTimeframe,
        quickTradeModal, setQuickTradeModal, showMarketWatch, setShowMarketWatch,
        qtSL, setQtSL, qtTP, setQtTP, qtSymbol, setQtSymbol,
        qtError, setQtError, qtExecuting, setQtExecuting, qtLot, setQtLot,
        recentlyExecuted, setRecentlyExecuted, executedTradesRef,
        subInfo, activeSymbols, livePrices, initialPrices, wsConnected,
        mt5Connected, mt5Connecting, mt5ConnectStatus, connectMT5, disconnectMT5,
        mt5Account, mt5Positions, mt5PositionsLoading, mt5Error, tradeError, clearTradeError,
        history, refreshHistory, refreshMT5Account, refreshMT5Positions,
        executeTrade, bulkExecuteTrades, closePosition, closeAllPositions,
        symbolOverrides, setSymbolOverride,
        serverTradeHistory, fetchTradeHistory, addTradeToHistory, clearServerHistory,
        autoTrades, autoTradeWorker, autoTradeHistory, autoTradeSubscribe,
        autoTradeUnsubscribe, stopAllAutoTrades, fetchAutoTradeHistory, autoFlipCounts,
        liveAssets, pickAsset, pickIndicator, pickTimeframe, liveSelectedAsset,
        formatTfStr, aiMarketContext,
    };
}

export type TradingDashboardCtx = ReturnType<typeof useTradingDashboard>;
