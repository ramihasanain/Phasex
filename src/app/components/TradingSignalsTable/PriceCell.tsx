import React, { useEffect, useRef, useState } from "react";
import { useThemeTokens } from "../../hooks/useThemeTokens";

export function PriceCell({
    price,
    isLive,
    fmt,
}: {
    price: number;
    isLive: boolean;
    fmt: (v: number) => string;
}) {
    const prevPriceRef = useRef(price);
    const [flashStyle, setFlashStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        if (!isLive) return;
        if (price > prevPriceRef.current) {
            setFlashStyle({ color: "#4ade80", textShadow: "0 0 12px rgba(74,222,128,0.8)", transition: "none" });
            const timer = setTimeout(() => setFlashStyle({ transition: "all 1s ease-out" }), 150);
            prevPriceRef.current = price;
            return () => clearTimeout(timer);
        } else if (price < prevPriceRef.current) {
            setFlashStyle({ color: "#f87171", textShadow: "0 0 12px rgba(248,113,113,0.8)", transition: "none" });
            const timer = setTimeout(() => setFlashStyle({ transition: "all 1s ease-out" }), 150);
            prevPriceRef.current = price;
            return () => clearTimeout(timer);
        }
        prevPriceRef.current = price;
    }, [price, isLive]);

    const tk = useThemeTokens();
    const baseColor = isLive ? tk.info : tk.textSecondary;
    return <span style={{ color: baseColor, ...flashStyle }}>{fmt(price)}</span>;
}
