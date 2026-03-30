import { useEffect, useRef, useState } from "react";
import type { Asset } from "./types";

export function useMarketListFlash(assets: Asset[]) {
    const prevPrices = useRef<Record<string, number>>({});
    const [flashMap, setFlashMap] = useState<Record<string, "up" | "down" | null>>({});
    const flashTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    useEffect(() => {
        const newFlashes: Record<string, "up" | "down" | null> = {};
        let hasChange = false;
        for (const asset of assets) {
            const prev = prevPrices.current[asset.symbol];
            if (prev !== undefined && prev !== asset.price) {
                const dir = asset.price > prev ? "up" : "down";
                newFlashes[asset.symbol] = dir;
                hasChange = true;
                if (flashTimers.current[asset.symbol]) clearTimeout(flashTimers.current[asset.symbol]);
                flashTimers.current[asset.symbol] = setTimeout(() => {
                    setFlashMap((p) => ({ ...p, [asset.symbol]: null }));
                }, 1200);
            }
            prevPrices.current[asset.symbol] = asset.price;
        }
        if (hasChange) setFlashMap((prev) => ({ ...prev, ...newFlashes }));
    }, [assets]);

    return { flashMap };
}
