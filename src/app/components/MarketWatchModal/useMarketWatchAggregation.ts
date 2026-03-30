import { useMemo } from "react";
import type { MT5Account, MT5Position } from "../../hooks/useMT5";
import type { AggregatedSymbolRow, MarketWatchSummary, ServerAutoTrade } from "./types";

export function useMarketWatchAggregation(
    mt5Positions: MT5Position[],
    serverAutoTrades: ServerAutoTrade[],
    autoFlipCounts: Record<string, number>,
    mt5Account?: MT5Account | null
): { summary: MarketWatchSummary; aggregated: AggregatedSymbolRow[] } {
    return useMemo(() => {
        let totalProfit = 0;

        const symMap: Record<string, AggregatedSymbolRow> = {};

        const autoTicketsSet = new Set(serverAutoTrades.map((at) => String(at.last_ticket)).filter(Boolean));

        mt5Positions.forEach((pos) => {
            totalProfit += pos.profit;
            const sym = pos.symbol;
            if (!symMap[sym]) {
                symMap[sym] = {
                    symbol: sym,
                    totalPos: 0,
                    buyCount: 0,
                    sellCount: 0,
                    autoCount: 0,
                    manualCount: 0,
                    flipCount: autoFlipCounts[sym] || 0,
                    profit: 0,
                    autoTickets: [],
                    allTickets: [],
                };
            }

            const isAuto =
                autoTicketsSet.has(String(pos.ticket)) ||
                (pos.comment &&
                    (pos.comment.toLowerCase().includes("auto") || pos.comment.startsWith("PX-Chart-")));

            symMap[sym].totalPos++;
            symMap[sym].allTickets.push(pos.ticket);

            if (pos.type === "BUY") symMap[sym].buyCount++;
            else symMap[sym].sellCount++;

            if (isAuto) {
                symMap[sym].autoCount++;
                symMap[sym].autoTickets.push(pos.ticket);
            } else {
                symMap[sym].manualCount++;
            }

            symMap[sym].profit += pos.profit;
        });

        const aggregatedArray = Object.values(symMap).sort((a, b) => b.profit - a.profit);

        if (mt5Account && aggregatedArray.length > 0) {
            const trueTotal = mt5Account.profit;
            const currentSum = aggregatedArray.reduce((acc, row) => acc + row.profit, 0);

            if (aggregatedArray.length === 1) {
                aggregatedArray[0].profit = trueTotal;
            } else if (currentSum !== trueTotal) {
                const absSum = aggregatedArray.reduce((acc, row) => acc + Math.abs(row.profit), 0);
                if (absSum !== 0) {
                    const diff = trueTotal - currentSum;
                    aggregatedArray.forEach((row) => {
                        row.profit += diff * (Math.abs(row.profit) / absSum);
                    });
                } else {
                    const perSymbolDiff = trueTotal / aggregatedArray.length;
                    aggregatedArray.forEach((row) => {
                        row.profit += perSymbolDiff;
                    });
                }
            }
        }

        aggregatedArray.sort((a, b) => b.profit - a.profit);

        const bestSymbol =
            aggregatedArray.length > 0 && aggregatedArray[0].profit > 0 ? aggregatedArray[0] : null;
        const worstSymbol =
            aggregatedArray.length > 0 && aggregatedArray[aggregatedArray.length - 1].profit < 0
                ? aggregatedArray[aggregatedArray.length - 1]
                : null;

        return {
            summary: {
                totalProfit: mt5Account ? mt5Account.profit : totalProfit,
                bestSymbol,
                worstSymbol,
            },
            aggregated: aggregatedArray,
        };
    }, [mt5Positions, serverAutoTrades, autoFlipCounts, mt5Account]);
}
