import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Zap } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useLivePrices } from "../../hooks/useLivePrices";
import { useThemeTokens } from "../../hooks/useThemeTokens";
import type { AnalysisTab, MarketCategory } from "../PhaseX/types";
import { marketCategories, symbolIcons } from "../PhaseX/marketCategories";
import { symbolToJsonKey, trendAr, trendRu, trendTr, trendFr, trendEs, i18n } from "../PhaseX/constants";
import { getDynamicLayerData, getTrendColor } from "./phaseXDynamicsHelpers";

const PriceCell = ({ price, isLive, fmt }: { price: number; isLive: boolean; fmt: (v: number) => string }) => {
    const prevPriceRef = useRef(price);
    const [flashStyle, setFlashStyle] = useState<React.CSSProperties>({});
    const tk = useThemeTokens();

    useEffect(() => {
        if (!isLive || price === 0) return;
        if (price > prevPriceRef.current && prevPriceRef.current !== 0) {
            setFlashStyle({ color: "#4ade80", textShadow: "0 0 12px rgba(74,222,128,0.8)", transition: "none" });
            const timer = setTimeout(() => setFlashStyle({ transition: "all 1s ease-out" }), 150);
            prevPriceRef.current = price;
            return () => clearTimeout(timer);
        } else if (price < prevPriceRef.current && prevPriceRef.current !== 0) {
            setFlashStyle({ color: "#f87171", textShadow: "0 0 12px rgba(248,113,113,0.8)", transition: "none" });
            const timer = setTimeout(() => setFlashStyle({ transition: "all 1s ease-out" }), 150);
            prevPriceRef.current = price;
            return () => clearTimeout(timer);
        }
        prevPriceRef.current = price;
    }, [price, isLive]);

    const baseColor = isLive ? tk.info : tk.textSecondary;
    return <span style={{ color: baseColor, ...flashStyle }}>{price > 0 ? fmt(price) : "—"}</span>;
};

export function TradingDecisionEngineTable({
    category,
    onCategoryChange,
    selectedSymbol,
    onSymbolSelect,
    isRTL,
    sources,
    onExecuteAction,
    mt5Positions,
}: {
    category: MarketCategory;
    onCategoryChange: (c: MarketCategory) => void;
    selectedSymbol: string;
    onSymbolSelect: (s: string) => void;
    isRTL: boolean;
    sources: Record<AnalysisTab, any[]>;
    onExecuteAction?: (symbol: string, decision: string, lot?: number) => void;
    mt5Positions?: any[];
}) {
    const { language, t: globalT } = useLanguage();
    const { prices: livePrices } = useLivePrices();
    const lang = ["ar", "ru", "tr", "fr", "es"].includes(language) ? language : "en";
    const t = i18n[lang];
    const [decisionFilter, setDecisionFilter] = useState<"ALL" | "STRONG BUY" | "BUY" | "WEAK BUY" | "NO TRADE" | "WEAK SELL" | "SELL" | "STRONG SELL">("ALL");
    const [lotSizes, setLotSizes] = useState<Record<string, number>>({});

    const cat = marketCategories.find(c => c.name === category);
    const symbols = cat?.symbols.filter(sym => {
        const jsonKey = symbolToJsonKey[sym];
        if (!jsonKey) return false;
        for (const tab in sources) {
            for (const stageData of sources[tab as AnalysisTab]) {
                if (stageData && stageData[jsonKey]) return true;
            }
        }
        return false;
    }) || [];

    const tv = (v: string) => lang === "ar" ? (trendAr[v] || v) : lang === "ru" ? (trendRu[v] || v) : lang === "tr" ? (trendTr[v] || v) : v;

    // Translation logic for headers
    const tvh = (h: string) => {
        if (lang === "ar") {
            return {
                "Symbol": "الرمز", "Primary Trend": "الاتجاه الرئيسي", "Structural Bias": "الانحياز الهيكلي",
                "Momentum": "الزخم", "Phase": "المرحلة", "Volatility": "التذبذب", "Reversal Risk": "مخاطر الانعكاس",
                "Confidence": "الثقة", "Market Phase": "مرحلة السوق", "Decision": "القرار", "Lot": "اللوت"
            }[h] || h;
        } else if (lang === "ru") {
            return {
                "Symbol": "Символ", "Primary Trend": "Основной тренд", "Structural Bias": "Структ. смещение",
                "Momentum": "Импульс", "Phase": "Фаза", "Volatility": "Волатильность", "Reversal Risk": "Риск разворота",
                "Confidence": "Уверенность", "Market Phase": "Фаза рынка", "Decision": "Решение", "Lot": "Лот"
            }[h] || h;
        } else if (lang === "tr") {
            return {
                "Symbol": "Sembol", "Primary Trend": "Ana Trend", "Structural Bias": "Yapısal Eğilim",
                "Momentum": "İvme", "Phase": "Aşama", "Volatility": "Volatilite", "Reversal Risk": "Dönüş Riski",
                "Confidence": "Güven", "Market Phase": "Piyasa Aşaması", "Decision": "Karar", "Lot": "Lot"
            }[h] || h;
        } else if (lang === "fr") {
            return {
                "Symbol": "Symbole", "Primary Trend": "Tendance Principale", "Structural Bias": "Biais Structurel",
                "Momentum": "Dynamique", "Phase": "Phase", "Volatility": "Volatilité", "Reversal Risk": "Risque Renvers.",
                "Confidence": "Confiance", "Market Phase": "Phase du Marché", "Decision": "Décision", "Lot": "Lot"
            }[h] || h;
        } else if (lang === "es") {
            return {
                "Symbol": "Símbolo", "Primary Trend": "Tendencia Primaria", "Structural Bias": "Sesgo Estructural",
                "Momentum": "Impulso", "Phase": "Fase", "Volatility": "Volatilidad", "Reversal Risk": "Riesgo Revers.",
                "Confidence": "Confianza", "Market Phase": "Fase del Mercado", "Decision": "Decisión", "Lot": "Lote"
            }[h] || h;
        }
        return h;
    };

    const rows = symbols.map(sym => {
        const layerData = getDynamicLayerData(sym, sources);
        const gs = layerData.globalScorePct / 100;
        const dsrST = layerData.byTeam[0]?.overall.dsr ?? 0;
        const dsrMT = layerData.byTeam[1]?.overall.dsr ?? 0;
        const dsrLT = layerData.byTeam[2]?.overall.dsr ?? 0;

        const primaryTrendFull = gs > 0.6 ? "Strong Uptrend" : gs > 0.2 ? "Bullish" : gs >= -0.2 ? "Neutral" : gs >= -0.6 ? "Bearish" : "Strong Downtrend";
        const momentumState = dsrST >= 0.6 ? "Strong" : dsrST >= 0.2 ? "Moderate" : dsrST <= -0.6 ? "Strong" : dsrST <= -0.2 ? "Moderate" : "Weak";
        const structuralBias = dsrLT > 0 ? "Upward" : dsrLT < 0 ? "Downward" : "Neutral";
        const rRange = Math.max(dsrST, dsrMT, dsrLT) - Math.min(dsrST, dsrMT, dsrLT);
        const reversalRisk = rRange < 0.2 ? "Low" : rRange < 0.5 ? "Moderate" : "High";
        const phaseAvg = (dsrST + dsrMT + dsrLT) / 3;
        const phase = phaseAvg > 0.5 ? "Directional" : phaseAvg >= 0.2 ? "Developing" : "Range";

        const deltaEngineData = layerData.byIndicator.find(b => b.indicator === "Delta Engine");
        const deDsrST = deltaEngineData?.teams[0]?.dsr ?? 0;
        const deDsrMT = deltaEngineData?.teams[1]?.dsr ?? 0;
        const deDsrLT = deltaEngineData?.teams[2]?.dsr ?? 0;
        const deAvg = (deDsrST + deDsrMT + deDsrLT) / 3;
        const v = deAvg > 0.3 ? "Elevated" : deAvg >= 0.1 ? "Moderate" : "Low";
        const t = gs > 0.2 ? "Up" : gs < -0.2 ? "Down" : "Flat";

        let marketPhase: string;
        if (phase === "Range") marketPhase = "Range";
        else if (phase === "Directional" && v === "Elevated" && t === "Up") marketPhase = "Bullish Expansion";
        else if (phase === "Directional" && v === "Elevated" && t === "Down") marketPhase = "Bearish Expansion";
        else if (phase === "Directional" && v === "Low") marketPhase = "Compression";
        else marketPhase = "Transition";

        const confStr = layerData.confidence >= 70 ? "High Confidence" : layerData.confidence >= 40 ? "Medium Confidence" : "Low Confidence";

        // ----- SCORES -----
        const sPt = primaryTrendFull === "Strong Uptrend" ? 4 : primaryTrendFull === "Bullish" ? 2 : primaryTrendFull === "Bearish" ? -2 : primaryTrendFull === "Strong Downtrend" ? -4 : 0;
        const sMom = momentumState === "Strong" ? 2 : momentumState === "Moderate" ? 1 : 0;
        const sBias = structuralBias === "Upward" ? 2 : structuralBias === "Downward" ? -2 : 0;
        const sPhase = phase === "Directional" ? 2 : phase === "Developing" ? 1 : 0;
        const sVol = v === "Elevated" ? 1 : v === "Moderate" ? 2 : 0;
        // Reversal risk doesn't add to score
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

        return { sym, primaryTrendFull, structuralBias, momentumState, phase, volatility: v, reversalRisk, confStr, marketPhase, decision, confidence: layerData.confidence, score: gs, totalScore };
    });

    const filteredRows = rows.filter(r => decisionFilter === "ALL" || r.decision === decisionFilter);

    return (
        <div className="flex justify-center w-full">
            <div className="w-full max-w-[1400px] space-y-4">
                {/* Local Filters for Decision Engine */}
                <div className="grid grid-cols-1 gap-4 mb-2">
                    {/* Market Filter */}
                    <div className="p-3 rounded-xl flex items-center gap-2 flex-wrap" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span className="text-[11px] font-black tracking-widest text-gray-500 mx-1">{lang === "ar" ? "السوق:" : lang === "ru" ? "РЫНОК:" : lang === "tr" ? "PİYASA:" : "MARKET:"}</span>
                        {marketCategories.map(c => (
                            <button key={c.name} onClick={() => onCategoryChange(c.name)}
                                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1.5 transition-all
                                ${category === c.name ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-transparent text-gray-400 hover:bg-white/5"}`}>
                                <span className="text-sm">{c.icon}</span>
                                <span>{lang === "ar" ? c.nameAr : lang === "ru" ? t[c.name.toLowerCase() as keyof typeof t] : lang === "tr" ? t[c.name.toLowerCase() as keyof typeof t] : c.name}</span>
                            </button>
                        ))}
                    </div>
                    {/* Decision Filter */}
                    <div className="p-3 rounded-xl flex items-center justify-between gap-2 flex-wrap" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-black tracking-widest text-gray-500 mx-1">{globalT("decision")}:</span>
                            {["ALL", "STRONG BUY", "BUY", "WEAK BUY", "NO TRADE", "WEAK SELL", "SELL", "STRONG SELL"].map(df => {
                                let styleCls = "bg-transparent text-gray-400 hover:bg-white/5";
                                if (decisionFilter === df) {
                                    switch (df) {
                                        case "STRONG BUY": styleCls = "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]"; break;
                                        case "BUY": styleCls = "bg-lime-500/20 text-lime-400 border border-lime-500/30 shadow-[0_0_10px_rgba(132,204,22,0.15)]"; break;
                                        case "WEAK BUY": styleCls = "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.15)]"; break;
                                        case "NO TRADE": styleCls = "bg-slate-500/20 text-slate-300 border border-slate-500/30 shadow-[0_0_10px_rgba(100,116,139,0.15)]"; break;
                                        case "WEAK SELL": styleCls = "bg-orange-500/15 text-orange-400 border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.15)]"; break;
                                        case "SELL": styleCls = "bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-[0_0_10px_rgba(225,29,72,0.15)]"; break;
                                        case "STRONG SELL": styleCls = "bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.25)]"; break;
                                        case "ALL": styleCls = "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]"; break;
                                    }
                                }

                                const getDecLabel = (d: string) => {
                                    if (lang === "ar") return { "ALL": "الكل", "STRONG BUY": "شراء قوي", "BUY": "شراء", "WEAK BUY": "شراء ضعيف", "NO TRADE": "لا تداول", "WEAK SELL": "بيع ضعيف", "SELL": "بيع", "STRONG SELL": "بيع قوي" }[d] || d;
                                    if (lang === "ru") return { "ALL": "Все", "STRONG BUY": "СИЛЬНО ПОКУПАТЬ", "BUY": "ПОКУПАТЬ", "WEAK BUY": "СЛАБО ПОКУПАТЬ", "NO TRADE": "ВНЕ РЫНКА", "WEAK SELL": "СЛАБО ПРОДАВАТЬ", "SELL": "ПРОДАВАТЬ", "STRONG SELL": "СИЛЬНО ПРОДАВАТЬ" }[d] || d;
                                    if (lang === "tr") return { "ALL": "Tümü", "STRONG BUY": "GÜÇLÜ AL", "BUY": "AL", "WEAK BUY": "ZAYIF AL", "NO TRADE": "İŞLEM YOK", "WEAK SELL": "ZAYIF SAT", "SELL": "SAT", "STRONG SELL": "GÜÇLÜ SAT" }[d] || d;
                                    if (lang === "fr") return { "ALL": "Tout", "STRONG BUY": "ACHAT FORT", "BUY": "ACHAT", "WEAK BUY": "ACHAT FAIBLE", "NO TRADE": "AUCUN TRADE", "WEAK SELL": "VENTE FAIBLE", "SELL": "VENTE", "STRONG SELL": "VENTE FORTE" }[d] || d;
                                    if (lang === "es") return { "ALL": "Todo", "STRONG BUY": "COMPRA FUERTE", "BUY": "COMPRA", "WEAK BUY": "COMPRA DÉBIL", "NO TRADE": "SIN TRADE", "WEAK SELL": "VENTA DÉBIL", "SELL": "VENTA", "STRONG SELL": "VENTA FUERTE" }[d] || d;
                                    return d;
                                };

                                const count = df === "ALL" ? rows.length : rows.filter(r => r.decision === df).length;

                                return (
                                    <button key={df} onClick={() => setDecisionFilter(df as any)}
                                        className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center gap-1.5 ${styleCls} ${count === 0 ? "opacity-50" : ""}`}>
                                        <span>{getDecLabel(df)}</span>
                                        <span className="bg-black/20 px-1.5 py-0.5 rounded text-[10px] ml-1">{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl w-full" style={{ border: `1px solid rgba(0, 200, 255, 0.15)` }}>
                    <table className="w-full border-collapse whitespace-nowrap">
                        <thead>
                            <tr style={{ background: "rgba(10,16,28,0.98)" }}>
                                {["Symbol", "Primary Trend", "Structural Bias", "Momentum", "Phase", "Volatility", "Reversal Risk", "Confidence", "Market Phase", "m.PRICE", "Decision", "Lot", "Execute"].map((h, i) => (
                                    <th key={i} className="text-left py-2 px-3 text-[10px] font-black tracking-widest uppercase text-cyan-400 border-r border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }} dir="auto">
                                        {tvh(h)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.map((r, i) => (
                                <motion.tr key={r.sym}
                                    onClick={(e) => {
                                        if ((e.target as HTMLElement).closest('.execute-btn')) return;
                                        onSymbolSelect(r.sym);
                                    }}
                                    className={`cursor-pointer transition-colors ${selectedSymbol === r.sym ? "bg-cyan-500/10" : "hover:bg-white/[0.04]"}`}
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                                    <td className="py-2 px-3 border-r border-b text-[11px] font-bold text-white flex items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                        <span className="text-base">{symbolIcons[r.sym]?.icon || '📈'}</span> {r.sym}
                                    </td>
                                    <td className="py-2 px-3 border-r border-b text-[11px] font-bold" style={{ borderColor: 'rgba(255,255,255,0.06)', color: getTrendColor(r.primaryTrendFull) }}>{tv(r.primaryTrendFull)}</td>
                                    <td className="py-2 px-3 border-r border-b text-[11px] font-bold" style={{ borderColor: 'rgba(255,255,255,0.06)', color: getTrendColor(r.structuralBias) }}>{tv(r.structuralBias)}</td>
                                    <td className="py-2 px-3 border-r border-b text-[11px] font-bold" style={{ borderColor: 'rgba(255,255,255,0.06)', color: getTrendColor(r.momentumState) }}>{tv(r.momentumState)}</td>
                                    <td className="py-2 px-3 border-r border-b text-[11px] font-bold" style={{ borderColor: 'rgba(255,255,255,0.06)', color: r.phase === "Directional" ? "#00e676" : r.phase === "Developing" ? "#ffc400" : "#ff1744" }}>{tv(r.phase)}</td>
                                    <td className="py-2 px-3 border-r border-b text-[11px] font-bold" style={{ borderColor: 'rgba(255,255,255,0.06)', color: r.volatility === "Elevated" ? "#ff1744" : r.volatility === "Moderate" ? "#ffc400" : "#00e676" }}>{tv(r.volatility)}</td>
                                    <td className="py-2 px-3 border-r border-b text-[11px] font-bold" style={{ borderColor: 'rgba(255,255,255,0.06)', color: r.reversalRisk === "Low" ? "#00e676" : r.reversalRisk === "Moderate" ? "#ffc400" : "#ff1744" }}>{tv(r.reversalRisk)}</td>
                                    <td className="py-2 px-3 border-r border-b text-[11px] font-bold" style={{ borderColor: 'rgba(255,255,255,0.06)', color: r.confidence >= 70 ? "#00e5ff" : r.confidence >= 40 ? "#ffab00" : "#ff6e40" }}>
                                        {lang === "en" ? r.confStr : r.confidence >= 70 ? t.aiHigh : r.confidence >= 40 ? t.aiMed : t.aiLow}
                                    </td>
                                    <td className="py-2 px-3 border-r border-b text-[11px] font-bold" style={{ borderColor: 'rgba(255,255,255,0.06)', color: getTrendColor(r.marketPhase) }}>{tv(r.marketPhase)}</td>
                                    <td className="py-2 px-3 border-r border-b text-[12px] font-black font-mono text-center tabular-nums" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                        {(() => {
                                            const baseAsset = r.sym.replace(/\.(sd|lv|p)$/i, '');
                                            let alias = baseAsset;
                                            if (baseAsset === "XAUUSD") alias = "GOLD";
                                            else if (baseAsset === "XAGUSD") alias = "SILVER";
                                            else if (baseAsset === "UKOILRoll" || baseAsset === "UKOIL") alias = livePrices["BRENT"] ? "BRENT" : "UKOIL";
                                            else if (baseAsset === "USOILRoll" || baseAsset === "USOIL") alias = livePrices["WTI"] ? "WTI" : "USOIL";
                                            else if (baseAsset === "US500Roll") alias = "US500";
                                            else if (baseAsset === "US30Roll") alias = "US30";
                                            else if (baseAsset === "UK100Roll") alias = "UK100";
                                            else if (baseAsset === "UT100Roll") alias = "US100";

                                            const liveMatch = livePrices[r.sym] || livePrices[baseAsset] || livePrices[alias] || livePrices[baseAsset + ".p"] || null;
                                            const mPrice = liveMatch ? (liveMatch.bid + liveMatch.ask) / 2 : 0;
                                            
                                            const fmt = (v: number) => {
                                                if (v === 0) return "—";
                                                if (v > 10000) return v.toFixed(1);
                                                if (v > 1000) return v.toFixed(2);
                                                if (v > 100) return v.toFixed(3);
                                                if (v > 10) return v.toFixed(4);
                                                return v.toFixed(5);
                                            };

                                            return <PriceCell price={mPrice} isLive={!!liveMatch} fmt={fmt} />;
                                        })()}
                                    </td>
                                    <td className="py-2 px-3 border-r border-b text-[11px] font-black tracking-wider" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                        {r.decision === "STRONG BUY" && <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.4)] block text-center min-w-[75px] border border-emerald-500/40">{globalT("strongBuyStr")}</span>}
                                        {r.decision === "BUY" && <span className="bg-lime-500/20 text-lime-400 px-2 py-1 rounded-md shadow-[0_0_10px_rgba(132,204,22,0.2)] block text-center min-w-[75px] border border-lime-500/30">{globalT("buyStr")}</span>}
                                        {r.decision === "WEAK BUY" && <span className="bg-yellow-500/15 text-yellow-500 px-2 py-1 rounded-md block text-center min-w-[75px] border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.15)]">{globalT("weakBuyStr")}</span>}
                                        {r.decision === "STRONG SELL" && <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-md shadow-[0_0_15px_rgba(239,68,68,0.4)] block text-center min-w-[75px] border border-red-500/40">{globalT("strongSellStr")}</span>}
                                        {r.decision === "SELL" && <span className="bg-rose-500/20 text-rose-400 px-2 py-1 rounded-md shadow-[0_0_10px_rgba(225,29,72,0.2)] block text-center min-w-[75px] border border-rose-500/30">{globalT("sellStr")}</span>}
                                        {r.decision === "WEAK SELL" && <span className="bg-orange-500/15 text-orange-500 px-2 py-1 rounded-md block text-center min-w-[75px] border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.15)]">{globalT("weakSellStr")}</span>}
                                        {r.decision === "NO TRADE" && <span className="bg-slate-500/20 text-slate-400 px-2 py-1 rounded-md block text-center min-w-[75px] border border-slate-500/30">{globalT("noTradeStr")}</span>}
                                    </td>
                                    <td className="py-2 px-3 border-r border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            max="100"
                                            value={lotSizes[r.sym] ?? 0.01}
                                            onChange={(e) => setLotSizes(prev => ({ ...prev, [r.sym]: Math.max(0.01, parseFloat(e.target.value) || 0.01) }))}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-16 px-2 py-1 rounded-lg text-[11px] font-black text-center outline-none"
                                            style={{
                                                background: 'rgba(245,158,11,0.08)',
                                                border: '1px solid rgba(245,158,11,0.25)',
                                                color: '#fbbf24',
                                            }}
                                        />
                                    </td>
                                    <td className="py-2 px-3 border-r border-b text-center relative z-50 pointer-events-auto" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                        {(() => {
                                            let action = "BUY";
                                            if (r.decision.includes("SELL")) action = "SELL";
                                            const expectedComment = `PX-SD ${r.sym} ${action}`.slice(0, 31);
                                            const hasPos = (mt5Positions || []).some((p: any) => p.comment === expectedComment);
                                            return (
                                        <button
                                            disabled={hasPos || r.decision === "NO TRADE" || !onExecuteAction}
                                            title={hasPos ? '✅ صفقة منفذة بالفعل' : undefined}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (!hasPos && r.decision !== "NO TRADE" && onExecuteAction) {
                                                    onExecuteAction(r.sym, r.decision, lotSizes[r.sym] ?? 0.01);
                                                }
                                            }}
                                            className="execute-btn px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-1.5 mx-auto disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-500/20"
                                            style={hasPos ? { background: 'rgba(100,116,139,0.08)', color: '#64748b', border: '1px solid rgba(100,116,139,0.2)', position: 'relative', zIndex: 100 } : { background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)', position: 'relative', zIndex: 100 }}
                                            type="button"
                                        >
                                            {hasPos ? (
                                                <><span className="pointer-events-none">✅</span><span className="pointer-events-none">مُنفَّذة</span></>
                                            ) : (
                                                <><Zap className="w-3 h-3 pointer-events-none" /><span className="pointer-events-none">Execute</span></>
                                            )}
                                        </button>
                                            );
                                        })()}
                                    </td>
                                </motion.tr>
                            ))}
                            {filteredRows.length === 0 && (
                                <tr>
                                    <td colSpan={13} className="py-8 text-center text-gray-500 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                        {lang === "ar" ? "لا يوجد بيانات لهذه التصفية" : lang === "ru" ? "Нет данных по этому фильтру" : lang === "tr" ? "Bu filtreyle eşleşen veri yok" : "No symbols match this filter"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
