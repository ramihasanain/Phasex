import type { CandlestickRow } from "./types";
import type { useTZCandlestickChartModel } from "./useTZCandlestickChartModel";

type M = ReturnType<typeof useTZCandlestickChartModel>;

export function TZCandlestickInfoBar({ m }: { m: M }) {
    const { tooltip, candlestickData, tk } = m;
    const activeData: CandlestickRow | null =
        tooltip?.data || (candlestickData.length > 0 ? candlestickData[candlestickData.length - 1] : null);

    if (!activeData || activeData.isNaNCandle) return <div className="h-8 mt-2" />;

    const val = activeData.close;
    const dec = val < 1 ? 5 : val < 100 ? 4 : val < 1000 ? 2 : val < 10000 ? 1 : 0;

    return (
        <div
            className="mt-2 flex flex-wrap items-center justify-between gap-4 px-3 py-2 rounded-xl border text-xs shadow-sm"
            style={{ background: tk.tooltipBg, borderColor: tk.tooltipBorder }}
        >
            <div className="flex items-center gap-3">
                <span className="font-mono font-bold flex items-center gap-1.5" style={{ color: tk.textDim }}>
                    📅 {activeData.fullTime || activeData.time}
                    {activeData.isReal && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: tk.accentGlow15, color: tk.accent }}>
                            ★ JSON
                        </span>
                    )}
                </span>
                <span
                    className="font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider"
                    style={{
                        background: activeData.isGreen ? tk.positiveBg : tk.negativeBg,
                        color: activeData.isGreen ? tk.chartCandleGreen : tk.chartCandleRed,
                    }}
                >
                    {activeData.isGreen ? "▲ Bullish" : "▼ Bearish"}
                </span>
            </div>

            <div className="flex items-center gap-4 xl:gap-6 font-mono font-medium" style={{ color: tk.textSecondary }}>
                <div className="flex items-center gap-1.5">
                    <span style={{ opacity: 0.5 }}>O:</span>
                    <span style={{ color: tk.textBright }}>{activeData.open.toFixed(dec)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span style={{ opacity: 0.5 }}>H:</span>
                    <span style={{ color: tk.positive }}>{activeData.high.toFixed(dec)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span style={{ opacity: 0.5 }}>L:</span>
                    <span style={{ color: tk.negative }}>{activeData.low.toFixed(dec)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span style={{ opacity: 0.5 }}>C:</span>
                    <span style={{ color: tk.textBright }}>{activeData.close.toFixed(dec)}</span>
                </div>
            </div>
        </div>
    );
}
