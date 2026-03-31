import { useState, useEffect } from "react";

/* ═══════════ Decision Engine Hook — mirrors PhaseXDynamicsPage scoring exactly ═══════════ */
const _decisionCache: { data: Record<string, string>; ts: number } = { data: {}, ts: 0 };

// Timeframe→team mapping (same as PhaseXDynamicsPage getDynamicLayerData)
const _shortTfs = new Set(['M5', 'M10', 'M15', 'M20', 'M30']);
const _mediumTfs = new Set(['H1', 'H2', 'H3', 'H4']);
const _longTfs = new Set(['H6', 'H8', 'D1']);

function _getClassification(dsr: number): string {
  const t = dsr * 100;
  if (t > 60) return 'Strong Uptrend';
  if (t > 20) return 'Bullish';
  if (t >= -20) return 'Neutral';
  if (t >= -60) return 'Bearish';
  return 'Strong Downtrend';
}

export function useDecisionEngine(symbol: string | undefined): string | null {
  const [decisions, setDecisions] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!symbol) return;
    if (Date.now() - _decisionCache.ts < 300_000 && _decisionCache.data[symbol]) {
      setDecisions(_decisionCache.data);
      return;
    }

    let cancelled = false;
    const BASE = 'https://phase-x-qc8dy.ondigitalocean.app/api/v1/structural-dynamics';

    (async () => {
      try {
        const [rFast, rMed, rSlow] = await Promise.all([
          fetch(`${BASE}/fast`), fetch(`${BASE}/medium`), fetch(`${BASE}/slow`)
        ]);
        const [jFast, jMed, jSlow] = await Promise.all([
          rFast.ok ? rFast.json() : { files: [] },
          rMed.ok ? rMed.json() : { files: [] },
          rSlow.ok ? rSlow.json() : { files: [] },
        ]);

        // Organize payloads per indicator tab (5 tabs only, matching indicatorTabs)
        const tabNameMap: Record<string, string> = {
          vector_core: 'VC', delta_engine: 'DE', pulse_matrix: 'PM',
          boundary_shell: 'BS', power_field: 'PF',
        };
        // sources[tab] = array of payload objects (one per speed)
        const sources: Record<string, any[]> = { VC: [], DE: [], PM: [], BS: [], PF: [] };

        for (const speedJson of [jFast, jMed, jSlow]) {
          for (const file of (speedJson?.files || [])) {
            const fname: string = file.name || '';
            for (const [key, tab] of Object.entries(tabNameMap)) {
              if (fname.includes(key)) {
                sources[tab].push(file.payload || {});
                break;
              }
            }
          }
        }

        // Build reverse map: cleanSymbol → jsonKey (from symbolToJsonKey in constants)
        // We dynamically discover symbols from the payloads instead
        const allJsonKeys = new Set<string>();
        for (const tab of Object.keys(sources)) {
          for (const payload of sources[tab]) {
            for (const key of Object.keys(payload)) {
              if (key !== 'exported_at' && key !== 'stage') allJsonKeys.add(key);
            }
          }
        }

        // For each symbol, compute the decision using the exact same pipeline
        const result: Record<string, string> = {};

        for (const jsonKey of allJsonKeys) {
          // Extract clean symbol name
          const rawSym = jsonKey.split(' - ')[0]?.trim();
          if (!rawSym) continue;
          const cleanSym = rawSym.replace(/\.\w+$/, '');

          // Per-tab: aggregate indicators across sources, then count Buy/Sell per team
          type TeamCounts = { buy: number; sell: number };
          const tabTeamData: { st: TeamCounts; mt: TeamCounts; lt: TeamCounts }[] = [];

          for (const tab of ['VC', 'DE', 'PM', 'BS', 'PF']) {
            const st: TeamCounts = { buy: 0, sell: 0 };
            const mt: TeamCounts = { buy: 0, sell: 0 };
            const lt: TeamCounts = { buy: 0, sell: 0 };

            // Merge indicators from all 3 speed sources for this tab & symbol
            const mergedIndicators: Record<string, Record<string, string>> = {};
            for (const payload of sources[tab]) {
              const symData = payload[jsonKey];
              if (!symData?.indicators) continue;
              for (const [param, tfs] of Object.entries(symData.indicators as Record<string, Record<string, string>>)) {
                if (!mergedIndicators[param]) mergedIndicators[param] = {};
                for (const [tf, signal] of Object.entries(tfs)) {
                  if (!mergedIndicators[param][tf] || mergedIndicators[param][tf] === 'NA') {
                    mergedIndicators[param][tf] = signal;
                  }
                }
              }
            }

            // Count Buy/Sell per team across all indicator rows
            for (const tfs of Object.values(mergedIndicators)) {
              for (const [tf, signal] of Object.entries(tfs)) {
                const s = signal;
                if (s !== 'Buy' && s !== 'Sell') continue;
                const isBuy = s === 'Buy';
                if (_shortTfs.has(tf)) { if (isBuy) st.buy++; else st.sell++; }
                else if (_mediumTfs.has(tf)) { if (isBuy) mt.buy++; else mt.sell++; }
                else if (_longTfs.has(tf)) { if (isBuy) lt.buy++; else lt.sell++; }
              }
            }

            tabTeamData.push({ st, mt, lt });
          }

          // Aggregate across all 5 tabs per team (same as getDynamicLayerData → byTeam)
          let stBuy = 0, stSell = 0, mtBuy = 0, mtSell = 0, ltBuy = 0, ltSell = 0;
          for (const td of tabTeamData) {
            stBuy += td.st.buy; stSell += td.st.sell;
            mtBuy += td.mt.buy; mtSell += td.mt.sell;
            ltBuy += td.lt.buy; ltSell += td.lt.sell;
          }

          const dsrST = (stBuy + stSell) > 0 ? (stBuy - stSell) / (stBuy + stSell) : 0;
          const dsrMT = (mtBuy + mtSell) > 0 ? (mtBuy - mtSell) / (mtBuy + mtSell) : 0;
          const dsrLT = (ltBuy + ltSell) > 0 ? (ltBuy - ltSell) / (ltBuy + ltSell) : 0;

          // Global Score = (LT*0.5) + (MT*0.3) + (ST*0.2) — same as getDynamicLayerData
          const gs = (dsrLT * 0.5) + (dsrMT * 0.3) + (dsrST * 0.2);

          // Confidence
          const maxDsr = Math.max(dsrST, dsrMT, dsrLT);
          const minDsr = Math.min(dsrST, dsrMT, dsrLT);
          const confidence = Math.round((1 - (maxDsr - minDsr) / 2) * 100);

          // Derived metrics — same as TradingDecisionEngineTable (lines 920-973)
          const primaryTrendFull = gs > 0.6 ? 'Strong Uptrend' : gs > 0.2 ? 'Bullish' : gs >= -0.2 ? 'Neutral' : gs >= -0.6 ? 'Bearish' : 'Strong Downtrend';
          const momentumState = dsrST >= 0.6 ? 'Strong' : dsrST >= 0.2 ? 'Moderate' : dsrST <= -0.6 ? 'Strong' : dsrST <= -0.2 ? 'Moderate' : 'Weak';
          const structuralBias = dsrLT > 0 ? 'Upward' : dsrLT < 0 ? 'Downward' : 'Neutral';
          const rRange = maxDsr - minDsr;
          const reversalRisk = rRange < 0.2 ? 'Low' : rRange < 0.5 ? 'Moderate' : 'High';
          const phaseAvg = (dsrST + dsrMT + dsrLT) / 3;
          const phase = phaseAvg > 0.5 ? 'Directional' : phaseAvg >= 0.2 ? 'Developing' : 'Range';

          // Delta Engine volatility
          const deData = tabTeamData[1]; // index 1 = DE
          const deST = (deData.st.buy + deData.st.sell) > 0 ? (deData.st.buy - deData.st.sell) / (deData.st.buy + deData.st.sell) : 0;
          const deMT = (deData.mt.buy + deData.mt.sell) > 0 ? (deData.mt.buy - deData.mt.sell) / (deData.mt.buy + deData.mt.sell) : 0;
          const deLT = (deData.lt.buy + deData.lt.sell) > 0 ? (deData.lt.buy - deData.lt.sell) / (deData.lt.buy + deData.lt.sell) : 0;
          const deAvg = (deST + deMT + deLT) / 3;
          const v = deAvg > 0.3 ? 'Elevated' : deAvg >= 0.1 ? 'Moderate' : 'Low';
          const t = gs > 0.2 ? 'Up' : gs < -0.2 ? 'Down' : 'Flat';

          let marketPhase: string;
          if (phase === 'Range') marketPhase = 'Range';
          else if (phase === 'Directional' && v === 'Elevated' && t === 'Up') marketPhase = 'Bullish Expansion';
          else if (phase === 'Directional' && v === 'Elevated' && t === 'Down') marketPhase = 'Bearish Expansion';
          else if (phase === 'Directional' && v === 'Low') marketPhase = 'Compression';
          else marketPhase = 'Transition';

          const confStr = confidence >= 70 ? 'High Confidence' : confidence >= 40 ? 'Medium Confidence' : 'Low Confidence';

          // --- SCORES (exact same formula) ---
          const sPt = primaryTrendFull === 'Strong Uptrend' ? 4 : primaryTrendFull === 'Bullish' ? 2 : primaryTrendFull === 'Bearish' ? -2 : primaryTrendFull === 'Strong Downtrend' ? -4 : 0;
          const sMom = momentumState === 'Strong' ? 2 : momentumState === 'Moderate' ? 1 : 0;
          const sBias = structuralBias === 'Upward' ? 2 : structuralBias === 'Downward' ? -2 : 0;
          const sPhase = phase === 'Directional' ? 2 : phase === 'Developing' ? 1 : 0;
          const sVol = v === 'Elevated' ? 1 : v === 'Moderate' ? 2 : 0;
          const sConf = confStr === 'High Confidence' ? 2 : confStr === 'Medium Confidence' ? 1 : 0;
          const sMph = marketPhase === 'Bullish Expansion' ? 3 : marketPhase === 'Bearish Expansion' ? -3 : 0;

          const coreSum = sPt + sBias + sMph;
          const extraSum = sMom + sPhase + sVol + sConf;
          const totalScore = Math.sign(coreSum) * (Math.abs(coreSum) + extraSum);

          result[cleanSym] = primaryTrendFull;
        }

        _decisionCache.data = result;
        _decisionCache.ts = Date.now();
        if (!cancelled) setDecisions(result);
      } catch { /* silent */ }
    })();

    return () => { cancelled = true; };
  }, [symbol]);

  if (!symbol) return null;
  return decisions[symbol] || _decisionCache.data[symbol] || null;
}

export const decisionStyle = (d: string): { color: string; bg: string; border: string; glow: string } => {
  switch (d) {
    case 'Strong Uptrend': return { color: '#34d399', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', glow: '0 0 15px rgba(16,185,129,0.4)' };
    case 'Bullish': return { color: '#a3e635', bg: 'rgba(163,230,53,0.12)', border: 'rgba(163,230,53,0.3)', glow: '0 0 10px rgba(163,230,53,0.25)' };
    case 'Neutral': return { color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)', glow: 'none' };
    case 'Bearish': return { color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)', glow: '0 0 10px rgba(248,113,113,0.25)' };
    case 'Strong Downtrend': return { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', glow: '0 0 15px rgba(239,68,68,0.4)' };
    default: return { color: '#94a3b8', bg: 'rgba(148,163,184,0.05)', border: 'rgba(148,163,184,0.1)', glow: 'none' };
  }
};

export const decisionLabelAr: Record<string, string> = {
  'Strong Uptrend': 'اتجاه صاعد قوي', 'Bullish': 'صاعد', 'Neutral': 'محايد', 'Bearish': 'هابط', 'Strong Downtrend': 'اتجاه هابط قوي'
};
