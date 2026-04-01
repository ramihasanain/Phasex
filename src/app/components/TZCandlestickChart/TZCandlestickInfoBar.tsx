import type { CandlestickRow } from "./types";
import type { useTZCandlestickChartModel } from "./useTZCandlestickChartModel";

type M = ReturnType<typeof useTZCandlestickChartModel>;

export function TZCandlestickInfoBar({ m }: { m: M }) {
    const { tooltip, candlestickData, tk } = m;
    const activeData: CandlestickRow | null =
        tooltip?.data || (candlestickData.length > 0 ? candlestickData[candlestickData.length - 1] : null);

    if (!activeData || activeData.isNaNCandle) return <div className="h-6 sm:h-8 mt-2 mx-1 sm:mx-2" />;

    const val = activeData.close;
    const dec = val < 1 ? 5 : val < 100 ? 4 : val < 1000 ? 2 : val < 10000 ? 1 : 0;

    return (
        <div
            className="mt-2 mx-1 sm:mx-2 md:mx-3 flex flex-wrap items-center justify-between gap-2 max-[800px]:gap-2 px-2 py-1.5 max-[800px]:px-2 max-[800px]:py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border text-xs max-[800px]:text-[10px] shadow-sm" style={{ background: tk.tooltipBg, borderColor: tk.tooltipBorder }}
        >
            <div className="flex items-center gap-2 max-[800px]:gap-1.5 sm:gap-3 min-w-0">
                <span className="font-mono font-bold flex flex-wrap items-center gap-1 max-[800px]:text-[10px]" style={{ color: tk.textDim }}>
                    📅 <span className="truncate max-w-[min(100%,14rem)] sm:max-w-none">{activeData.fullTime || activeData.time}</span>
                    {activeData.isReal && (
                        <span className="text-[8px] max-[800px]:text-[7px] px-1 py-0.5 sm:text-[9px] sm:px-1.5 rounded font-bold shrink-0" style={{ background: tk.accentGlow15, color: tk.accent }}>
                            ★ JSON
                        </span>
                    )}
                </span>
                <span
                    className="font-bold px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded text-[9px] max-[800px]:text-[8px] sm:text-[10px] uppercase tracking-wider shrink-0"
                    style={{
                        background: activeData.isGreen ? tk.positiveBg : tk.negativeBg,
                        color: activeData.isGreen ? tk.chartCandleGreen : tk.chartCandleRed,
                    }}
                >
                    {activeData.isGreen ? "▲ Bullish" : "▼ Bearish"}
                </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 max-[800px]:gap-x-2 max-[800px]:gap-y-0.5 sm:gap-4 xl:gap-6 font-mono font-medium max-[800px]:text-[10px]" style={{ color: tk.textSecondary }}>
                <div className="flex items-center gap-1 max-[800px]:gap-0.5 sm:gap-1.5">
                    <span style={{ opacity: 0.5 }}>O:</span>
                    <span className="tabular-nums" style={{ color: tk.textBright }}>{activeData.open.toFixed(dec)}</span>
                </div>
                <div className="flex items-center gap-1 max-[800px]:gap-0.5 sm:gap-1.5">
                    <span style={{ opacity: 0.5 }}>H:</span>
                    <span className="tabular-nums" style={{ color: tk.positive }}>{activeData.high.toFixed(dec)}</span>
                </div>
                <div className="flex items-center gap-1 max-[800px]:gap-0.5 sm:gap-1.5">
                    <span style={{ opacity: 0.5 }}>L:</span>
                    <span className="tabular-nums" style={{ color: tk.negative }}>{activeData.low.toFixed(dec)}</span>
                </div>
                <div className="flex items-center gap-1 max-[800px]:gap-0.5 sm:gap-1.5">
                    <span style={{ opacity: 0.5 }}>C:</span>
                    <span className="tabular-nums" style={{ color: tk.textBright }}>{activeData.close.toFixed(dec)}</span>
                </div>
            </div>
        </div>
    );
}
