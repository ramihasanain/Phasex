import type { useTZCandlestickChartModel } from "./useTZCandlestickChartModel";
import { TZCandlestickXAxisView } from "./TZCandlestickXAxisView";

type M = ReturnType<typeof useTZCandlestickChartModel>;

export function TZCandlestickXAxis({ m }: { m: M }) {
    return <TZCandlestickXAxisView m={m} />;
}
