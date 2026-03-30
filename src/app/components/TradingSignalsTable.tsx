import type { TradingSignalsTableProps } from "./TradingSignalsTable/types";
import { TradingSignalsTableShell } from "./TradingSignalsTable/TradingSignalsTableShell";

export type {
    AssetSignals,
    SignalEntry,
    TradeHistoryEntry,
    TradingSignalsTableProps,
} from "./TradingSignalsTable/types";

export function TradingSignalsTable(props: TradingSignalsTableProps) {
    return <TradingSignalsTableShell {...props} />;
}
