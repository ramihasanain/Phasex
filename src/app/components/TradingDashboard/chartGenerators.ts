import type { Asset } from "../MarketList";
import type { Indicator } from "../IndicatorChart";
import type { PhaseCandle } from "./types";

export function generateChartData(asset: Asset, indicator: Indicator, timeframe: number) {
    const data: Array<{
        time: string;
        fullTime: string;
        timestamp: number;
        value: number;
    }> = [];
    const base = asset.price;
    const points = timeframe === 5 ? 120 : timeframe === 15 ? 96 : 48;
    const now = new Date();
    for (let i = points - 1; i >= 0; i--) {
        const t = new Date(now.getTime() - i * timeframe * 60000);
        const hh = t.getHours().toString().padStart(2, "0");
        const mm = t.getMinutes().toString().padStart(2, "0");
        const dd = t.getDate().toString().padStart(2, "0");
        const mo = (t.getMonth() + 1).toString().padStart(2, "0");
        const yr = t.getFullYear();
        const isNewDay = hh === "00" && mm === "00";
        const displayTime = isNewDay ? `${dd}/${mo}\n${hh}:${mm}` : `${hh}:${mm}`;
        const fullDate = `${dd}/${mo}/${yr} ${hh}:${mm}`;
        let value: number;
        switch (indicator.id) {
            case "phase":
                value = Math.sin(i / 20) * 50 + (Math.random() - 0.5) * 30;
                break;
            case "displacement":
                value =
                    base +
                    Math.cos(i / 15) * base * 0.01 +
                    Math.sin(i / 25) * base * 0.005 +
                    (Math.random() - 0.5) * base * 0.003;
                break;
            case "reference":
                value =
                    base +
                    Math.sin(i / 30) * base * 0.008 +
                    (Math.random() - 0.5) * base * 0.002;
                break;
            case "oscillation":
                value = Math.max(
                    -100,
                    Math.min(100, Math.sin(i / 18) * 70 + (Math.random() - 0.5) * 20)
                );
                break;
            case "direction":
                value = Math.cos(i / 12) * 50 + (Math.random() - 0.5) * 25;
                break;
            case "envelop":
                value = Math.sin(i / 10) * 40 + (Math.random() - 0.5) * 15;
                break;
            default: {
                const v = timeframe === 5 ? 0.003 : timeframe === 15 ? 0.005 : 0.008;
                value = base + Math.sin(i / 15) * base * v * 2 + (Math.random() - 0.5) * base * v;
            }
        }
        data.push({
            time: displayTime,
            fullTime: fullDate,
            timestamp: t.getTime(),
            value: +value.toFixed(4),
        });
    }
    return data;
}

export function generateCandlesFromReal(real: PhaseCandle, count: number = 90): any[] {
    const range = real.high - real.low;
    const volatility = range * 0.6;
    const candles: any[] = [];

    const timeParts = real.time.replace(".", "-").replace(".", "-");
    const baseTime = new Date(timeParts.replace(" ", "T") + ":00");

    const tfMap: Record<string, number> = {
        M5: 5,
        M10: 10,
        M15: 15,
        M20: 20,
        M30: 30,
        H1: 60,
        H2: 120,
        H3: 180,
        H4: 240,
        H6: 360,
    };
    const intervalMin = tfMap[real.tf_candle] || 15;

    const rHH = baseTime.getHours().toString().padStart(2, "0");
    const rMM = baseTime.getMinutes().toString().padStart(2, "0");
    const rDD = baseTime.getDate().toString().padStart(2, "0");
    const rMO = (baseTime.getMonth() + 1).toString().padStart(2, "0");
    const rYR = baseTime.getFullYear();
    candles.push({
        time: `${rDD}/${rMO}\n${rHH}:${rMM}`,
        fullTime: `${rDD}/${rMO}/${rYR} ${rHH}:${rMM}`,
        timestamp: baseTime.getTime(),
        open: real.open,
        high: real.high,
        low: real.low,
        close: real.close,
        value: real.close,
        isReal: true,
    });

    let prevClose = real.close;

    for (let i = 1; i <= count; i++) {
        const t = new Date(baseTime.getTime() + i * intervalMin * 60000);
        const hh = t.getHours().toString().padStart(2, "0");
        const mm = t.getMinutes().toString().padStart(2, "0");
        const dd = t.getDate().toString().padStart(2, "0");
        const mo = (t.getMonth() + 1).toString().padStart(2, "0");
        const yr = t.getFullYear();
        const isNewDay = hh === "00" && mm === "00";

        const open = prevClose;
        const bodySize = (Math.random() - 0.5) * volatility * 0.4;
        const close = open + bodySize;
        const wickUp = Math.random() * volatility * 0.2;
        const wickDown = Math.random() * volatility * 0.2;
        const high = Math.max(open, close) + wickUp;
        const low = Math.min(open, close) - wickDown;

        candles.push({
            time: isNewDay ? `${dd}/${mo}\n${hh}:${mm}` : `${hh}:${mm}`,
            fullTime: `${dd}/${mo}/${yr} ${hh}:${mm}`,
            timestamp: t.getTime(),
            open: +open.toFixed(6),
            high: +high.toFixed(6),
            low: +low.toFixed(6),
            close: +close.toFixed(6),
            value: +close.toFixed(6),
        });

        prevClose = close + (Math.random() - 0.5) * volatility * 0.08;
    }

    return candles;
}
