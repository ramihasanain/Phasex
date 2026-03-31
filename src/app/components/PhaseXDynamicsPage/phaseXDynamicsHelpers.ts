import type { AnalysisTab, Signal, VCRow } from "../PhaseX/types";
import { vcTfColumns, tfColumns, symbolToJsonKey } from "../PhaseX/constants";

export function getComponentDataFromJson(tab: AnalysisTab, symbol: string, sources: any[]): VCRow[] | null {
    const jsonKey = symbolToJsonKey[symbol];
    if (!jsonKey) return null;

    if (!sources || sources.length === 0) return null;

    // Merge multiple sources for the same period
    const aggregatedIndicators: Record<string, Record<string, string>> = {};

    sources.forEach((source, sourceIdx) => {
        const symbolData = (source as Record<string, any>)?.[jsonKey];
        if (!symbolData || !symbolData.indicators) return;

        Object.entries(symbolData.indicators as Record<string, Record<string, string>>).forEach(([param, tfs]) => {
            if (!aggregatedIndicators[param]) aggregatedIndicators[param] = {};
            Object.entries(tfs).forEach(([tf, signal]) => {
                // If collision, we could prioritize or average. 
                // For simplicity, we'll keep the first non-NA signal found for that specific timeframe in any of the 3 files.
                if (!aggregatedIndicators[param][tf] || aggregatedIndicators[param][tf] === "NA") {
                    aggregatedIndicators[param][tf] = signal;
                }
            });
        });
    });

    if (Object.keys(aggregatedIndicators).length === 0) return null;

    const rows: VCRow[] = [];
    const paramKeys = Object.keys(aggregatedIndicators).sort((a, b) => {
        const partsA = a.match(/(\d+|\D+)/g) || [];
        const partsB = b.match(/(\d+|\D+)/g) || [];

        for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
            const pA = partsA[i];
            const pB = partsB[i];

            const nA = parseInt(pA, 10);
            const nB = parseInt(pB, 10);

            if (!isNaN(nA) && !isNaN(nB)) {
                if (nA !== nB) return nA - nB;
            } else if (pA !== pB) {
                return pA.localeCompare(pB);
            }
        }
        return a.length - b.length;
    });

    for (const paramKey of paramKeys) {
        const tfData = aggregatedIndicators[paramKey];
        const signals: Signal[] = vcTfColumns.map(tf => {
            const val = tfData[tf];
            if (val === "Buy") return "Buy";
            if (val === "Sell") return "Sell";
            if (val === "Neutral") return "Neutral";
            return "NA";
        });

        const buyCount = signals.filter(s => s === "Buy").length;
        const sellCount = signals.filter(s => s === "Sell").length;
        const total = (buyCount - sellCount) / 12; // Use fixed divisor of 12 as requested
        const classification = getClassification(total);

        const displayParam = paramKey.replace(/^[A-Z]{2,}_/, "").replace(/_/g, ",");

        rows.push({
            param: displayParam,
            signals,
            total: Math.round(total * 100),
            classification
        });
    }
    return rows.length > 0 ? rows : null;
}




export function getTrendColor(t: string): string {

    const v = t.toLowerCase();
    if (["bullish", "upward", "expansion", "low", "strong", "strong uptrend", "strong uptren"].includes(v)) return "#00e676";
    if (["bearish", "downward", "contraction", "high", "strong downtrend", "strong downtre"].includes(v)) return "#ff1744";
    return "#ffc400";
}

export function getClassColor(c: string): string {
    if (c.includes("Strong Uptrend") || c.includes("Strong Upt")) return "#00c853";
    if (c.includes("Strong Downtrend") || c.includes("Strong Dow")) return "#d50000";
    if (c === "Bullish") return "#00e676";
    if (c === "Bearish") return "#ff1744";
    return "#ffc400";
}

export function getTotalColor(p: number): string {
    if (p >= 50) return "#00e676";
    if (p >= 17) return "#76ff03";
    if (p > -17) return "#ffc400";
    if (p > -50) return "#ff6d00";
    return "#ff1744";
}
// Generate signal data based on score bias

export function generateSignals(score: number, rowCount: number, paramType: string): {
    param: string;
    signals: Signal[];
    total: number;
    classification: string;
}[] {

    const params: Record<string, string[]> = {
        "MA": ["10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90", "95", "100", "105", "110", "115", "120", "125", "130", "135", "140", "145", "150", "155", "160", "165", "170", "175", "180", "185", "190", "195", "200"],
        "MACD": ["(5,11,4)", "(10,22,8)", "(15,32,11)", "(20,43,15)", "(25,54,19)", "(30,65,23)", "(35,76,26)", "(40,86,30)", "(45,97,34)", "(50,108,38)", "(55,119,41)", "(60,130,45)", "(65,140,49)", "(70,151,53)", "(75,162,56)", "(80,173,60)", "(85,184,64)", "(90,194,68)", "(95,205,71)", "(100,216,75)", "(105,227,79)", "(110,238,83)", "(115,248,86)", "(120,259,90)", "(125,270,94)", "(130,281,98)", "(135,292,101)", "(140,302,105)", "(145,313,109)", "(150,324,113)", "(155,335,116)", "(160,346,120)", "(165,356,124)", "(170,367,128)", "(175,378,131)", "(180,389,135)", "(185,400,139)", "(190,410,143)", "(195,421,146)"],
        "RSI": ["10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90", "95", "100", "105", "110", "115", "120", "125", "130", "135", "140", "145", "150", "155", "160", "165", "170", "175", "180", "185", "190", "195", "200"],
        "Bollinger": ["10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90", "95", "100", "105", "110", "115", "120", "125", "130", "135", "140", "145", "150", "155", "160", "165", "170", "175", "180", "185", "190", "195", "200"],
    };

    const paramList = params[paramType] || params["MA"];

    const bias = (score + 1) / 2; // 0..1
    return paramList.slice(0, rowCount).map((param, ri) => {
        // Create realistic pattern: early periods follow short-term, later periods follow long-term

        const rowBias = bias + (ri < 5 ? 0.15 : ri < 10 ? 0.05 : ri < 25 ? -0.1 : -0.2);

        const clampedBias = Math.max(0.05, Math.min(0.95, rowBias));

        const signals: Signal[] = tfColumns.map((_, ci) => {
            // Higher timeframes (later columns) tend to follow the underlying trend more

            const tfAdjust = ci < 5 ? 0.1 : ci < 8 ? -0.05 : -0.1;

            const prob = clampedBias + tfAdjust + (Math.sin(ri * 3.7 + ci * 5.3) * 0.15);
            return prob > 0.5 ? "Buy" : "Sell";
        });

        const buyCount = signals.filter(s => s === "Buy").length;
        const sellCount = signals.filter(s => s === "Sell").length;
        const totalPct = Math.round(((buyCount - sellCount) / signals.length) * 100);
        let classification = "Neutral";
        if (totalPct > 60) classification = "Strong Uptrend";
        else if (totalPct > 20) classification = "Bullish";
        else if (totalPct >= -20) classification = "Neutral";
        else if (totalPct >= -60) classification = "Bearish";
        else classification = "Strong Downtrend";
        return { param, signals, total: totalPct, classification };
    });
}
export function getTabData(tab: AnalysisTab, symbol: string, currentSources: Record<AnalysisTab, any[]>) {
    const paramLabels: Record<AnalysisTab, string> = {
        "Vector Core": "VC",
        "Delta Engine": "DE",
        "Pulse Matrix": "PM",
        "Boundary Shell": "BS",
        "Power Field": "PF",
        "Phase X Layer": "PX",
        "Decision Engine": "DX",
    };

    const rows = getComponentDataFromJson(tab, symbol, currentSources[tab]) || [];

    if (rows.length === 0) {
        return { paramLabel: paramLabels[tab], rows: [], colTotals: [], colClassifications: [], overallTotal: 0, overallClass: "Neutral" };
    }

    const colTotals = vcTfColumns.map((_, ci) => {
        const buyC = rows.filter(r => r.signals[ci] === "Buy").length;
        const sellC = rows.filter(r => r.signals[ci] === "Sell").length;
        return rows.length > 0 ? Math.round(((buyC - sellC) / rows.length) * 100) : 0;
    });

    const colClassifications = colTotals.map(t => getClassification(t / 100));

    const overallTotal = rows.length > 0 ? Math.round(rows.reduce((a, b) => a + b.total, 0) / rows.length) : 0;
    const overallClass = getClassification(overallTotal / 100);
    return { paramLabel: paramLabels[tab], rows, colTotals, colClassifications, overallTotal, overallClass };
}
/* ═══════════ Dynamic Layer Aggregation ═══════════ */

type TeamLabel = "Short Term" | "Medium Term" | "Long Term" | "Overall";

const teamLabelsAr: Record<string, string> = { "Short Term": "قصير المدى", "Medium Term": "متوسط المدى", "Long Term": "طويل المدى", "Overall": "الإجمالي" };

const indicatorTabs: AnalysisTab[] = ["Vector Core", "Delta Engine", "Pulse Matrix", "Boundary Shell", "Power Field"];

export function getClassification(dsr: number): string {
    const t = dsr * 100;
    if (t > 60) return "Strong Uptrend";
    if (t > 20) return "Bullish";
    if (t >= -20) return "Neutral";
    if (t >= -60) return "Bearish";
    return "Strong Downtrend";
}

export function getDynamicLayerData(symbol: string, currentSources: Record<AnalysisTab, any[]>) {
    // Team definition by TIMEFRAME COLUMNS (not rows):
    // Short Term = M5, M10, M15, M20, M30  → column indices 0-4
    // Medium Term = H1, H2, H3, H4         → column indices 5-8
    // Long Term = H6, H8, D1               → column indices 9-11
    const teamColRanges: { name: TeamLabel; cols: number[] }[] = [
        { name: "Short Term", cols: [0, 1, 2, 3, 4] },       // M5 to M30
        { name: "Medium Term", cols: [5, 6, 7, 8] },         // H1 to H4
        { name: "Long Term", cols: [9, 10, 11] },            // H6 to D1
    ];
    const teamNames: TeamLabel[] = ["Short Term", "Medium Term", "Long Term"];

    const byIndicator: { indicator: string; teams: { team: TeamLabel; buy: number; sell: number; net: number; dsr: number; classification: string }[]; overall: { buy: number; sell: number; net: number; dsr: number; classification: string } }[] = [];

    indicatorTabs.forEach(tab => {
        const tabData = getTabData(tab, symbol, currentSources);
        const allRows = tabData.rows;

        // For each team, count Buy/Sell in that team's COLUMNS across ALL rows
        const teams = teamColRanges.map(({ name, cols }) => {
            let buy = 0, sell = 0;
            allRows.forEach(r => {
                cols.forEach(ci => {
                    const s = r.signals[ci];
                    if (s === "Buy") buy++;
                    else if (s === "Sell") sell++;
                });
            });

            const net = buy - sell;
            const totalCount = buy + sell;
            const dsr = totalCount > 0 ? net / totalCount : 0;
            return { team: name, buy, sell, net, dsr: Math.round(dsr * 100) / 100, classification: getClassification(dsr) };
        });

        const totalBuy = teams.reduce((a, t) => a + t.buy, 0);
        const totalSell = teams.reduce((a, t) => a + t.sell, 0);
        const totalNet = totalBuy - totalSell;
        const totalDsr = (totalBuy + totalSell) > 0 ? totalNet / (totalBuy + totalSell) : 0;

        byIndicator.push({
            indicator: tab,
            teams,
            overall: { buy: totalBuy, sell: totalSell, net: totalNet, dsr: Math.round(totalDsr * 100) / 100, classification: getClassification(totalDsr) },
        });
    });

    const byTeam: { team: TeamLabel; indicators: { indicator: string; buy: number; sell: number; net: number; dsr: number; classification: string }[]; overall: { buy: number; sell: number; net: number; dsr: number; classification: string } }[] = [];

    teamNames.forEach((team, ti) => {
        const indicators = indicatorTabs.map(tab => {
            const found = byIndicator.find(b => b.indicator === tab)!;
            return { indicator: tab, ...found.teams[ti] };
        });

        const totalBuy = indicators.reduce((a, t) => a + t.buy, 0);
        const totalSell = indicators.reduce((a, t) => a + t.sell, 0);
        const totalNet = totalBuy - totalSell;
        const totalDsr = (totalBuy + totalSell) > 0 ? totalNet / (totalBuy + totalSell) : 0;

        byTeam.push({
            team,
            indicators,
            overall: { buy: totalBuy, sell: totalSell, net: totalNet, dsr: Math.round(totalDsr * 100) / 100, classification: getClassification(totalDsr) },
        });
    });

    const allBuy = byIndicator.reduce((a, b) => a + b.overall.buy, 0);
    const allSell = byIndicator.reduce((a, b) => a + b.overall.sell, 0);
    const allNet = allBuy - allSell;
    const allDsr = (allBuy + allSell) > 0 ? allNet / (allBuy + allSell) : 0;
    const allRow = { buy: allBuy, sell: allSell, net: allNet, dsr: Math.round(allDsr * 100) / 100, classification: getClassification(allDsr) };

    // byTeam: [0]=Short Term, [1]=Medium Term, [2]=Long Term
    const dsrST = byTeam[0]?.overall.dsr ?? 0;
    const dsrMT = byTeam[1]?.overall.dsr ?? 0;
    const dsrLT = byTeam[2]?.overall.dsr ?? 0;

    // Global Score = (LT*0.5) + (MT*0.3) + (ST*0.2)
    const weightedScore = (dsrLT * 0.5) + (dsrMT * 0.3) + (dsrST * 0.2);
    const globalScorePct = Math.round(weightedScore * 100);

    // Confidence = 1 - (MAX(DSRs) - MIN(DSRs)) / 2
    const maxDsr = Math.max(dsrST, dsrMT, dsrLT);
    const minDsr = Math.min(dsrST, dsrMT, dsrLT);
    const confidence = Math.round((1 - (maxDsr - minDsr) / 2) * 100);

    return { byIndicator, byTeam, allRow, globalScorePct, confidence };
}
