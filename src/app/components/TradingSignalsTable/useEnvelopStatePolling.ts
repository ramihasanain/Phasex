import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { normalizeSignal } from "./constants";
import type { AssetSignals } from "./types";

const SD_API_FAST = "https://phase-x-qc8dy.ondigitalocean.app/api/v1/structural-dynamics/fast";

export function useEnvelopStatePolling(
    setSignalData: Dispatch<SetStateAction<AssetSignals>>,
    setFetchError: Dispatch<SetStateAction<string>>,
    setIsFetching: Dispatch<SetStateAction<boolean>>,
    setLastSystemUpdate: Dispatch<SetStateAction<number | null>>,
) {
    const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        let cancelled = false;

        const getLatestAPIInterval = () => {
            const now = new Date();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            let targetMinute = Math.floor(minutes / 5) * 5;
            if (minutes % 5 === 0 && seconds < 30) targetMinute -= 5;
            const targetDate = new Date(now);
            targetDate.setMinutes(targetMinute);
            targetDate.setSeconds(30);
            targetDate.setMilliseconds(0);
            return targetDate.getTime();
        };

        const fetchEnvelopState = async () => {
            if (!cancelled) setIsFetching(true);
            try {
                const res = await fetch(SD_API_FAST);
                if (!res.ok) throw new Error("Network response was not ok");
                const data = await res.json();

                const envelopFile = data?.files?.find((f: { name?: string }) => f.name === "envelop_state");
                if (envelopFile && envelopFile.payload) {
                    const newData: AssetSignals = {};
                    for (const [key, value] of Object.entries(envelopFile.payload)) {
                        if (key === "exported_at") continue;
                        const parts = key.split(" - ");
                        const displayAsset = parts[0].trim();
                        const market = parts[1]?.trim() || "UNKNOWN";
                        const tfData = value as Record<string, Record<string, unknown>>;

                        for (const [tfKey, entry] of Object.entries(tfData)) {
                            const e = entry as Record<string, unknown>;
                            if (!newData[displayAsset]) newData[displayAsset] = {};
                            const displayTF =
                                (e.tf_candle as string) || tfKey.split("_").pop()?.toUpperCase() || tfKey;
                            newData[displayAsset][displayTF] = {
                                time: (e.time as string) || "",
                                open: (e.open as number) ?? 0,
                                high: (e.high as number) ?? 0,
                                low: (e.low as number) ?? 0,
                                close: (e.close as number) ?? 0,
                                net_signal: normalizeSignal(
                                    (e.net_signal as string) ||
                                        ((e.close as number) > (e.open as number)
                                            ? "buy"
                                            : (e.close as number) < (e.open as number)
                                              ? "sell"
                                              : ""),
                                ),
                                stop_loss: (e.stop_loss as number) ?? 0,
                                take_profit: (e.take_profit as number) ?? 0,
                                market,
                            };
                        }
                    }
                    if (!cancelled) {
                        setSignalData(newData);
                        setFetchError("");
                        setLastSystemUpdate(getLatestAPIInterval());
                    }
                } else {
                    if (!cancelled) setFetchError("envelop_state not found in API response.");
                }
            } catch (err) {
                console.error("Error fetching envelop_state:", err);
                if (!cancelled) setFetchError("Failed to fetch data from server.");
            } finally {
                if (!cancelled) setIsFetching(false);
            }
        };

        void fetchEnvelopState();

        const scheduleNextFetch = () => {
            const now = new Date();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            let targetMinute = Math.floor(minutes / 5) * 5;
            if (minutes % 5 !== 0 || seconds >= 30) {
                targetMinute += 5;
            }

            const targetDate = new Date(now);
            targetDate.setMinutes(targetMinute);
            targetDate.setSeconds(30);
            targetDate.setMilliseconds(0);

            const delayMs = targetDate.getTime() - now.getTime();

            return window.setTimeout(() => {
                if (cancelled) return;
                void fetchEnvelopState();
                if (pollIntervalRef.current !== null) {
                    clearInterval(pollIntervalRef.current);
                    pollIntervalRef.current = null;
                }
                pollIntervalRef.current = setInterval(() => {
                    void fetchEnvelopState();
                }, 5 * 60 * 1000);
            }, delayMs);
        };

        const initialTimeoutId = scheduleNextFetch();

        return () => {
            cancelled = true;
            clearTimeout(initialTimeoutId);
            if (pollIntervalRef.current !== null) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
            }
        };
    }, []);
}
