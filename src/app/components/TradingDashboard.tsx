import type { TradingDashboardProps } from "./TradingDashboard/types";
import { TradingDashboardInner } from "./TradingDashboard/TradingDashboardInner";

export type { PhaseCandle, PhaseStateDataMap } from "./TradingDashboard/types";
export { generateCandlesFromReal } from "./TradingDashboard/chartGenerators";

export function TradingDashboard(props: TradingDashboardProps) {
    return <TradingDashboardInner {...props} />;
}
