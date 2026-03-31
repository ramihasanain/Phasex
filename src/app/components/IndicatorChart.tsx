import { IndicatorChartRoot } from "./IndicatorChart/IndicatorChartRoot";

export type { Indicator, IndicatorChartProps } from "./IndicatorChart/indicatorChartTypesAndControls";
import type { IndicatorChartProps } from "./IndicatorChart/indicatorChartTypesAndControls";

export function IndicatorChart(props: IndicatorChartProps) {
  return <IndicatorChartRoot {...props} />;
}
