import { useMemo } from "react";
import { useTheme } from "../contexts/ThemeContext";

export interface ThemeTokens {
    // Page & surfaces
    bg: string;
    bgPage: string;
    surface: string;
    surfaceElevated: string;
    surfaceHover: string;
    surfaceActive: string;

    // Borders
    border: string;
    borderStrong: string;

    // Text
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textDim: string;

    // Header
    headerBg: string;
    headerBorder: string;

    // Semantic trading
    positive: string;
    positiveBg: string;
    positiveBorder: string;
    negative: string;
    negativeBg: string;
    negativeBorder: string;
    warning: string;
    warningBg: string;
    info: string;
    infoBg: string;

    // Charts
    chartGrid: string;
    chartText: string;
    chartCrosshair: string;
    chartCandleGreen: string;
    chartCandleRed: string;

    // Tooltip
    tooltipBg: string;
    tooltipBorder: string;
    tooltipText: string;

    // Buttons
    buttonGhost: string;
    buttonGhostBorder: string;
    buttonGhostText: string;

    // Input
    inputBg: string;
    inputBorder: string;
    inputText: string;
    inputPlaceholder: string;

    // Misc
    scrollbar: string;
    isDark: boolean;
}

const darkTokens: ThemeTokens = {
    bg: "#0b0e14",
    bgPage: "#070a10",
    surface: "#111520",
    surfaceElevated: "#1a1f2e",
    surfaceHover: "rgba(255,255,255,0.04)",
    surfaceActive: "rgba(255,255,255,0.08)",

    border: "rgba(255,255,255,0.05)",
    borderStrong: "rgba(255,255,255,0.1)",

    textPrimary: "#e2e8f0",
    textSecondary: "#94a3b8",
    textMuted: "#64748b",
    textDim: "#475569",

    headerBg: "linear-gradient(180deg, #12161f 0%, #0d1017 100%)",
    headerBorder: "rgba(255,255,255,0.04)",

    positive: "#22c55e",
    positiveBg: "rgba(34,197,94,0.1)",
    positiveBorder: "rgba(34,197,94,0.2)",
    negative: "#ef4444",
    negativeBg: "rgba(239,68,68,0.1)",
    negativeBorder: "rgba(239,68,68,0.2)",
    warning: "#fbbf24",
    warningBg: "rgba(251,191,36,0.08)",
    info: "#818cf8",
    infoBg: "rgba(99,102,241,0.08)",

    chartGrid: "rgba(255,255,255,0.04)",
    chartText: "#64748b",
    chartCrosshair: "rgba(255,255,255,0.3)",
    chartCandleGreen: "#059669",
    chartCandleRed: "#dc2626",

    tooltipBg: "#1e2535",
    tooltipBorder: "rgba(255,255,255,0.1)",
    tooltipText: "#e2e8f0",

    buttonGhost: "rgba(255,255,255,0.04)",
    buttonGhostBorder: "rgba(255,255,255,0.06)",
    buttonGhostText: "#94a3b8",

    inputBg: "rgba(255,255,255,0.03)",
    inputBorder: "rgba(255,255,255,0.06)",
    inputText: "#e2e8f0",
    inputPlaceholder: "#475569",

    scrollbar: "#1e293b",
    isDark: true,
};

const lightTokens: ThemeTokens = {
    bg: "#e4e7ec",
    bgPage: "#dcdfe5",
    surface: "#f0f1f4",
    surfaceElevated: "#e8eaef",
    surfaceHover: "rgba(0,0,0,0.05)",
    surfaceActive: "rgba(0,0,0,0.08)",

    border: "rgba(0,0,0,0.10)",
    borderStrong: "rgba(0,0,0,0.15)",

    textPrimary: "#1e293b",
    textSecondary: "#475569",
    textMuted: "#64748b",
    textDim: "#94a3b8",

    headerBg: "linear-gradient(180deg, #ffffff 0%, #f8f9fb 100%)",
    headerBorder: "rgba(0,0,0,0.06)",

    positive: "#16a34a",
    positiveBg: "rgba(22,163,74,0.08)",
    positiveBorder: "rgba(22,163,74,0.15)",
    negative: "#dc2626",
    negativeBg: "rgba(220,38,38,0.08)",
    negativeBorder: "rgba(220,38,38,0.15)",
    warning: "#d97706",
    warningBg: "rgba(217,119,6,0.08)",
    info: "#4f46e5",
    infoBg: "rgba(79,70,229,0.08)",

    chartGrid: "rgba(0,0,0,0.06)",
    chartText: "#94a3b8",
    chartCrosshair: "rgba(0,0,0,0.2)",
    chartCandleGreen: "#15803d",
    chartCandleRed: "#b91c1c",

    tooltipBg: "#ebedf1",
    tooltipBorder: "rgba(0,0,0,0.12)",
    tooltipText: "#1e293b",

    buttonGhost: "rgba(0,0,0,0.06)",
    buttonGhostBorder: "rgba(0,0,0,0.10)",
    buttonGhostText: "#64748b",

    inputBg: "rgba(0,0,0,0.05)",
    inputBorder: "rgba(0,0,0,0.12)",
    inputText: "#1e293b",
    inputPlaceholder: "#94a3b8",

    scrollbar: "#cbd5e1",
    isDark: false,
};

export function useThemeTokens(): ThemeTokens {
    const { theme } = useTheme();
    return useMemo(() => (theme === "dark" ? darkTokens : lightTokens), [theme]);
}
