import type { ThemeTokens } from "../../hooks/useThemeTokens";

export function TZCandlestickDefs({ tk }: { tk: ThemeTokens }) {
    return (
        <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feFlood floodColor="currentColor" floodOpacity="0.3" />
                <feComposite in2="blur" operator="in" />
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <filter id="liveGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feFlood floodColor="currentColor" floodOpacity="0.6" />
                <feComposite in2="blur" operator="in" />
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <filter id="liveGlowWide" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feFlood floodColor="currentColor" floodOpacity="0.4" />
                <feComposite in2="blur" operator="in" />
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <linearGradient id="liveGradGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={tk.chartCandleGreen} stopOpacity="1" />
                <stop offset="50%" stopColor={tk.chartCandleGreen} stopOpacity="0.95" />
                <stop offset="100%" stopColor={tk.chartCandleGreen} stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="liveGradRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={tk.chartCandleRed} stopOpacity="1" />
                <stop offset="50%" stopColor={tk.chartCandleRed} stopOpacity="0.95" />
                <stop offset="100%" stopColor={tk.chartCandleRed} stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="priceLabelGreen" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={tk.chartCandleGreen} />
                <stop offset="100%" stopColor={tk.chartCandleGreen} />
            </linearGradient>
            <linearGradient id="priceLabelRed" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={tk.chartCandleRed} />
                <stop offset="100%" stopColor={tk.chartCandleRed} />
            </linearGradient>
        </defs>
    );
}
