import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import { useMT5 } from "../../hooks/useMT5";
import { useThemeTokens } from "../../hooks/useThemeTokens";
import type { MarketCategory, AnalysisTab, TrendLabel, SymbolData } from "../PhaseX/types";
import { symbolsData } from "../PhaseX/symbolsData";
import { marketCategories } from "../PhaseX/marketCategories";
import {
    symbolToJsonKey,
    defaultAnalysisSources,
    trendAr,
    trendRu,
    trendTr,
    trendFr,
    trendEs,
    i18n,
} from "../PhaseX/constants";
import { getDynamicLayerData, getTrendColor } from "./phaseXDynamicsHelpers";

export function usePhaseXDynamicsPage(
    onBack: () => void,
    initialSymbol?: string,
    initialTab?: string
) {
    const { user, logout, hasMT5Access } = useAuth();
    const isLoggedIn = !!user;
    const {
        connected: mt5Connected,
        connectMT5,
        disconnectMT5,
        connecting: mt5Connecting,
        connectStatus: mt5ConnectStatus,
        executeTrade,
        positions: mt5Positions,
        stopAllAutoTrades,
    } = useMT5();
    const tk = useThemeTokens();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
    const [isMT5SubscribeOpen, setIsMT5SubscribeOpen] = useState(false);
    const [isMT5LoginOpen, setIsMT5LoginOpen] = useState(false);
    const [isMT5DisconnectOpen, setIsMT5DisconnectOpen] = useState(false);
    const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
    const [mt5Creds, setMT5Creds] = useState(() => {
        try {
            const saved = localStorage.getItem("mt5_credentials");
            if (saved) return JSON.parse(saved);
        } catch {}
        return { login: "", password: "", server: "" };
    });
    const [showMT5Password, setShowMT5Password] = useState(false);
    const [mt5Error, setMT5Error] = useState<string | null>(null);

    const [tradeModalState, setTradeModalState] = useState<{
        isOpen: boolean;
        symbol: string;
        decision: string;
    } | null>(null);
    const [tradeSymbolOverride, setTradeSymbolOverride] = useState("");
    const [tradeSL, setTradeSL] = useState("");
    const [tradeTP, setTradeTP] = useState("");
    const [tradeError, setTradeError] = useState<string | null>(null);
    const [isExecuting, setIsExecuting] = useState(false);
    const [tradeLot, setTradeLot] = useState("0.01");
    const executedTradesRef = useRef<Set<string>>(new Set());

    const { language, setLanguageKey, t: globalT } = useLanguage();
    const isRTL = language === "ar";
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setLangDropdownOpen(false);
            }
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

    const currentLangObj =
        languageOptions.find((l) => l.code === language) || languageOptions[1];
    const lang = ["ar", "ru", "tr", "fr", "es"].includes(language)
        ? language
        : "en";
    const t = i18n[lang];

    const tv = useCallback(
        (v: string) =>
            lang === "ar"
                ? trendAr[v] || v
                : lang === "ru"
                  ? trendRu[v] || v
                  : lang === "tr"
                    ? trendTr[v] || v
                    : lang === "fr"
                      ? (trendFr as Record<string, string>)[v] || v
                      : lang === "es"
                        ? (trendEs as Record<string, string>)[v] || v
                        : v,
        [lang]
    );

    const tvTab = useCallback(
        (v: string) => {
            switch (v) {
                case "Vector Core": return t.vectorCore;
                case "Delta Engine": return t.deltaEngine;
                case "Pulse Matrix": return t.pulseMatrix;
                case "Boundary Shell": return t.boundaryShell;
                case "Power Field": return t.powerField;
                case "Phase X Layer": return t.phaseXLayer;
                case "Decision Engine": return t.decisionEngine;
                default: return v;
            }
        },
        [t]
    );

    const [selectedCategory, setSelectedCategory] =
        useState<MarketCategory>("Forex");
    const [selectedSymbol, setSelectedSymbol] = useState(
        initialSymbol || "EURUSD"
    );
    const [lastSystemUpdate, setLastSystemUpdate] = useState<number | null>(
        Date.now()
    );
    const [selectedTab, setSelectedTab] = useState<AnalysisTab>(
        (initialTab as AnalysisTab) || "Vector Core"
    );
    const [filterOpen, setFilterOpen] = useState(true);
    const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
    const [isNewsOpen, setIsNewsOpen] = useState(false);

    useEffect(() => {
        if (initialSymbol) {
            const cat = marketCategories.find(
                (c) => c.name !== "All" && c.symbols.includes(initialSymbol)
            );
            if (cat) setSelectedCategory(cat.name as MarketCategory);
        }
    }, [initialSymbol]);

    const [sources, setSources] =
        useState<Record<AnalysisTab, any[]>>(defaultAnalysisSources);
    const [uploadStatus, setUploadStatus] = useState<
        Record<AnalysisTab, boolean[]>
    >({
        "Vector Core": [false, false, false],
        "Delta Engine": [false, false, false],
        "Pulse Matrix": [false, false, false],
        "Boundary Shell": [false, false, false],
        "Power Field": [false, false, false],
        "Phase X Layer": [false, false, false],
        "Decision Engine": [false, false, false],
    });

    const layerData = useMemo(
        () => getDynamicLayerData(selectedSymbol, sources),
        [selectedSymbol, sources]
    );

    useEffect(() => {
        const SD_API_BASE =
            "https://phase-x-qc8dy.ondigitalocean.app/api/v1/structural-dynamics";
        const stages: { endpoint: string; idx: number }[] = [
            { endpoint: "fast", idx: 0 },
            { endpoint: "medium", idx: 1 },
            { endpoint: "slow", idx: 2 },
        ];

        const fileNameToTab = (name: string): AnalysisTab | null => {
            const n = name.toLowerCase();
            if (n.includes("vector_core") || n.includes("vector-core")) return "Vector Core";
            if (n.includes("delta_engine") || n.includes("delta-engine")) return "Delta Engine";
            if (n.includes("pulse_matrix") || n.includes("pulse-matrix")) return "Pulse Matrix";
            if (n.includes("boundary_shell") || n.includes("boundary-shell")) return "Boundary Shell";
            if (n.includes("power_field") || n.includes("power-field")) return "Power Field";
            if (n.includes("vector")) return "Vector Core";
            if (n.includes("delta")) return "Delta Engine";
            if (n.includes("pulse")) return "Pulse Matrix";
            if (n.includes("boundary")) return "Boundary Shell";
            if (n.includes("power")) return "Power Field";
            return null;
        };

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

        const fetchAll = async () => {
            const newSources: Record<AnalysisTab, any[]> = {
                "Vector Core": [null, null, null], "Delta Engine": [null, null, null],
                "Pulse Matrix": [null, null, null], "Boundary Shell": [null, null, null],
                "Power Field": [null, null, null], "Phase X Layer": [null, null, null],
                "Decision Engine": [null, null, null],
            };
            const newStatus: Record<AnalysisTab, boolean[]> = {
                "Vector Core": [false, false, false], "Delta Engine": [false, false, false],
                "Pulse Matrix": [false, false, false], "Boundary Shell": [false, false, false],
                "Power Field": [false, false, false], "Phase X Layer": [false, false, false],
                "Decision Engine": [false, false, false],
            };

            await Promise.all(
                stages.map(async ({ endpoint, idx }) => {
                    try {
                        const res = await fetch(`${SD_API_BASE}/${endpoint}`);
                        if (!res.ok) return;
                        const data = await res.json();
                        if (!data?.files) return;

                        if (idx === 0) {
                            const firstFile = data.files[0];
                            if (firstFile?.payload) {
                                const keys = Object.keys(firstFile.payload);
                                if (keys.length > 0) {
                                    const catMap: Record<string, Set<string>> = {
                                        Forex: new Set(), Commodities: new Set(),
                                        Indices: new Set(), Crypto: new Set(), Other: new Set(),
                                    };
                                    keys.forEach((k) => {
                                        const parts = k.split(" - ");
                                        if (parts.length === 2) {
                                            const sym = parts[0].split(".")[0];
                                            symbolToJsonKey[sym] = k;
                                            let targetCat = "Other";
                                            if (parts[1] === "FOREX") targetCat = "Forex";
                                            else if (parts[1] === "COMMODITY") targetCat = "Commodities";
                                            else if (parts[1] === "INDEX") targetCat = "Indices";
                                            else if (parts[1] === "CRYPTO") targetCat = "Crypto";
                                            catMap[targetCat].add(sym);
                                        }
                                    });
                                    marketCategories.forEach((mc) => {
                                        if (mc.name !== "All") mc.symbols = Array.from(catMap[mc.name] || []);
                                    });
                                    const allCat = marketCategories.find((c) => c.name === "All");
                                    if (allCat) allCat.symbols = marketCategories.filter((c) => c.name !== "All").flatMap((c) => c.symbols);
                                }
                            }
                        }

                        for (const file of data.files) {
                            const tab = fileNameToTab(file.name);
                            if (tab && file.payload) {
                                newSources[tab][idx] = file.payload;
                                newStatus[tab][idx] = true;
                            }
                        }
                    } catch (err) {
                        console.error(`SD API fetch error (${endpoint}):`, err);
                    }
                })
            );

            if (!cancelled) {
                setSources(newSources);
                setUploadStatus(newStatus);
                setLastSystemUpdate(getLatestAPIInterval());
            }
        };

        fetchAll();

        const scheduleNextFetch = () => {
            const now = new Date();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            let targetMinute = Math.floor(minutes / 5) * 5;
            if (minutes % 5 !== 0 || seconds >= 30) targetMinute += 5;
            const targetDate = new Date(now);
            targetDate.setMinutes(targetMinute);
            targetDate.setSeconds(30);
            targetDate.setMilliseconds(0);
            return setTimeout(() => {
                if (!cancelled) {
                    fetchAll();
                    setInterval(fetchAll, 5 * 60 * 1000);
                }
            }, targetDate.getTime() - now.getTime());
        };

        const initialTimeout = scheduleNextFetch();
        return () => { cancelled = true; clearTimeout(initialTimeout); };
    }, []);

    const resetSources = useCallback(() => {
        setSources(defaultAnalysisSources);
        setUploadStatus({
            "Vector Core": [false, false, false], "Delta Engine": [false, false, false],
            "Pulse Matrix": [false, false, false], "Boundary Shell": [false, false, false],
            "Power Field": [false, false, false], "Phase X Layer": [false, false, false],
            "Decision Engine": [false, false, false],
        });
    }, []);

    const data = useMemo((): SymbolData => {
        const gs = layerData.globalScorePct / 100;
        const dsrST = layerData.byTeam[0]?.overall.dsr ?? 0;
        const dsrMT = layerData.byTeam[1]?.overall.dsr ?? 0;
        const dsrLT = layerData.byTeam[2]?.overall.dsr ?? 0;

        const primaryTrend: TrendLabel = gs > 0.6 ? "Bullish" : gs > 0.2 ? "Bullish" : gs >= -0.2 ? "Neutral" : gs >= -0.6 ? "Bearish" : "Bearish";
        const primaryTrendFull = gs > 0.6 ? "Strong Uptrend" : gs > 0.2 ? "Bullish" : gs >= -0.2 ? "Neutral" : gs >= -0.6 ? "Bearish" : "Strong Downtrend";
        const momentumState = dsrST >= 0.6 ? "Strong" : dsrST >= 0.2 ? "Moderate" : dsrST <= -0.6 ? "Strong" : dsrST <= -0.2 ? "Moderate" : "Weak";
        const structuralBias = dsrLT > 0 ? "Upward" : dsrLT < 0 ? "Downward" : "Neutral";
        const rRange = Math.max(dsrST, dsrMT, dsrLT) - Math.min(dsrST, dsrMT, dsrLT);
        const reversalRisk = rRange < 0.2 ? "Low" : rRange < 0.5 ? "Moderate" : "High";
        const phaseAvg = (dsrST + dsrMT + dsrLT) / 3;
        const p = phaseAvg > 0.5 ? "Directional" : phaseAvg >= 0.2 ? "Developing" : "Range";

        const deltaEngineData = layerData.byIndicator.find((b) => b.indicator === "Delta Engine");
        const deDsrST = deltaEngineData?.teams[0]?.dsr ?? 0;
        const deDsrMT = deltaEngineData?.teams[1]?.dsr ?? 0;
        const deDsrLT = deltaEngineData?.teams[2]?.dsr ?? 0;
        const deAvg = (deDsrST + deDsrMT + deDsrLT) / 3;
        const v = deAvg > 0.3 ? "Elevated" : deAvg >= 0.1 ? "Moderate" : "Low";
        const tDir = gs > 0.2 ? "Up" : gs < -0.2 ? "Down" : "Flat";

        let marketPhase: string;
        if (p === "Range") marketPhase = "Range";
        else if (p === "Directional" && v === "Elevated" && tDir === "Up") marketPhase = "Bullish Expansion";
        else if (p === "Directional" && v === "Elevated" && tDir === "Down") marketPhase = "Bearish Expansion";
        else if (p === "Directional" && v === "Low") marketPhase = "Compression";
        else marketPhase = "Transition";

        const confStr = layerData.confidence >= 70 ? "High Confidence" : layerData.confidence >= 40 ? "Medium Confidence" : "Low Confidence";
        const sPt = primaryTrendFull === "Strong Uptrend" ? 4 : primaryTrendFull === "Bullish" ? 2 : primaryTrendFull === "Bearish" ? -2 : primaryTrendFull === "Strong Downtrend" ? -4 : 0;
        const sMom = momentumState === "Strong" ? 2 : momentumState === "Moderate" ? 1 : 0;
        const sBias = structuralBias === "Upward" ? 2 : structuralBias === "Downward" ? -2 : 0;
        const sPhase = p === "Directional" ? 2 : p === "Developing" ? 1 : 0;
        const sVol = v === "Elevated" ? 1 : v === "Moderate" ? 2 : 0;
        const sConf = confStr === "High Confidence" ? 2 : confStr === "Medium Confidence" ? 1 : 0;
        const sMph = marketPhase === "Bullish Expansion" ? 3 : marketPhase === "Bearish Expansion" ? -3 : 0;
        const coreSum = sPt + sBias + sMph;
        const extraSum = sMom + sPhase + sVol + sConf;
        const totalScore = Math.sign(coreSum) * (Math.abs(coreSum) + extraSum);

        let decision = "NO TRADE";
        if (totalScore >= 13) decision = "STRONG BUY";
        else if (totalScore > 7) decision = "BUY";
        else if (totalScore > 0) decision = "WEAK BUY";
        else if (totalScore === 0) decision = "NO TRADE";
        else if (totalScore > -7) decision = "WEAK SELL";
        else if (totalScore > -13) decision = "SELL";
        else decision = "STRONG SELL";

        return {
            symbol: selectedSymbol, globalScore: gs, confidence: layerData.confidence,
            marketState: primaryTrendFull, phase: p, volatility: v, risk: reversalRisk,
            dominantLayer: [...layerData.byTeam].sort((a, b) => Math.abs(b.overall.dsr) - Math.abs(a.overall.dsr))[0].team,
            strength: Math.abs(gs), alignment: layerData.confidence > 70 ? "Strong" : "Medium",
            primaryTrend, decision,
            layerSummary: {
                shortTerm: layerData.byTeam[0].overall.classification as TrendLabel,
                mediumTerm: layerData.byTeam[1].overall.classification as TrendLabel,
                longTerm: layerData.byTeam[2].overall.classification as TrendLabel,
            },
            dynamics: {
                primaryTrend: primaryTrendFull as TrendLabel,
                momentumState, structuralBias, marketPhase, reversalRisk,
            },
        };
    }, [selectedSymbol, layerData]);

    const bullish = data.globalScore >= 0;
    const accent = data.marketState === "Strong Uptrend" ? "#00c853" : data.marketState === "Bullish" ? "#00e676" : data.marketState === "Neutral" ? "#ffc400" : data.marketState === "Bearish" ? "#ff6d00" : "#ff1744";
    const accentG = data.marketState === "Strong Uptrend" ? "rgba(0,200,83," : data.marketState === "Bullish" ? "rgba(0,230,118," : data.marketState === "Neutral" ? "rgba(255,196,0," : data.marketState === "Bearish" ? "rgba(255,109,0," : "rgba(255,23,68,";
    const confColor = data.confidence >= 85 ? "#00e5ff" : data.confidence >= 70 ? "#448aff" : data.confidence >= 55 ? "#26c6da" : data.confidence >= 40 ? "#ffab00" : "#ff6e40";
    const confColorG = data.confidence >= 85 ? "rgba(0,229,255," : data.confidence >= 70 ? "rgba(68,138,255," : data.confidence >= 55 ? "rgba(38,198,218," : data.confidence >= 40 ? "rgba(255,171,0," : "rgba(255,110,64,";

    const handleCategoryChange = useCallback(
        (cat: MarketCategory) => {
            setSelectedCategory(cat);
            const cd = marketCategories.find((c) => c.name === cat);
            if (cd?.symbols.length) setSelectedSymbol(cd.symbols[0]);
        },
        []
    );

    return {
        onBack, user, logout, isLoggedIn, hasMT5Access,
        mt5Connected, connectMT5, disconnectMT5, mt5Connecting, mt5ConnectStatus,
        executeTrade, mt5Positions, stopAllAutoTrades, tk,
        isProfileOpen, setIsProfileOpen, isSubscriptionOpen, setIsSubscriptionOpen,
        isMT5SubscribeOpen, setIsMT5SubscribeOpen, isMT5LoginOpen, setIsMT5LoginOpen,
        isMT5DisconnectOpen, setIsMT5DisconnectOpen, isLoginPromptOpen, setIsLoginPromptOpen,
        mt5Creds, setMT5Creds, showMT5Password, setShowMT5Password, mt5Error, setMT5Error,
        tradeModalState, setTradeModalState, tradeSymbolOverride, setTradeSymbolOverride,
        tradeSL, setTradeSL, tradeTP, setTradeTP, tradeError, setTradeError,
        isExecuting, setIsExecuting, tradeLot, setTradeLot, executedTradesRef,
        language, setLanguageKey, globalT, isRTL,
        langDropdownOpen, setLangDropdownOpen, dropdownRef,
        languageOptions, currentLangObj, lang, t, tv, tvTab,
        selectedCategory, setSelectedCategory, selectedSymbol, setSelectedSymbol,
        lastSystemUpdate, selectedTab, setSelectedTab,
        filterOpen, setFilterOpen, isAiPanelOpen, setIsAiPanelOpen,
        isNewsOpen, setIsNewsOpen,
        sources, uploadStatus, layerData, resetSources,
        data, bullish, accent, accentG, confColor, confColorG,
        handleCategoryChange,
    };
}

export type PhaseXCtx = ReturnType<typeof usePhaseXDynamicsPage>;
