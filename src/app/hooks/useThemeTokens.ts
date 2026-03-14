import { useMemo } from "react";
import { useTheme } from "../contexts/ThemeContext";
import type { Theme } from "../contexts/ThemeContext";

export interface ThemeTokens {
    // ── Page & Surfaces ──
    bg: string;
    bgPage: string;
    surface: string;
    surfaceElevated: string;
    surfaceHover: string;
    surfaceActive: string;

    // ── Borders ──
    border: string;
    borderStrong: string;

    // ── Text ──
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textDim: string;
    textBright: string;

    // ── Header ──
    headerBg: string;
    headerBorder: string;

    // ── Trading Signals ──
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

    // ── Accent (Indigo) ──
    accent: string;
    accentLight: string;
    accentGlow08: string;
    accentGlow15: string;
    accentGlow25: string;

    // ── Charts ──
    chartBg: string;
    chartGrid: string;
    chartText: string;
    chartCrosshair: string;
    chartCandleGreen: string;
    chartCandleRed: string;
    chartCandleLive: string;

    // ── Tooltip ──
    tooltipBg: string;
    tooltipBorder: string;
    tooltipText: string;

    // ── Buttons ──
    buttonGhost: string;
    buttonGhostBorder: string;
    buttonGhostText: string;

    // ── Input ──
    inputBg: string;
    inputBorder: string;
    inputText: string;
    inputPlaceholder: string;

    // ── Table ──
    tableBg: string;
    tableBorder: string;
    totalHighlight: string;
    classificationHighlight: string;
    amberLabel: string;
    cyanLabel: string;

    // ── Signals (PhaseX Dynamics) ──
    signalBuy: string;
    signalSell: string;
    signalNeutral: string;
    signalBuyBg: string;
    signalSellBg: string;
    signalNeutralBg: string;

    // ── Misc ──
    scrollbar: string;
    liveIndicator: string;
    lockOverlayBg: string;
    upgradeOrange: string;
    statusGray: string;

    // ── Meta ──
    isDark: boolean;
    themeKey: Theme;
}

// ═══════════════════════════════════════════════════════
// 🌑  DARK  — الأساس (لا يتغيّر أبداً)
// ═══════════════════════════════════════════════════════
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
    textBright: "#f8fafc",

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

    accent: "#6366f1",
    accentLight: "#a855f7",
    accentGlow08: "rgba(99,102,241,0.08)",
    accentGlow15: "rgba(99,102,241,0.15)",
    accentGlow25: "rgba(99,102,241,0.25)",

    chartBg: "#0a0e1a",
    chartGrid: "rgba(255,255,255,0.04)",
    chartText: "#64748b",
    chartCrosshair: "rgba(255,255,255,0.3)",
    chartCandleGreen: "#059669",
    chartCandleRed: "#dc2626",
    chartCandleLive: "#38bdf8",

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

    tableBg: "rgba(10,16,28,0.98)",
    tableBorder: "rgba(255,255,255,0.03)",
    totalHighlight: "rgba(255,200,0,0.04)",
    classificationHighlight: "rgba(0,200,255,0.03)",
    amberLabel: "#fbbf24",
    cyanLabel: "#22d3ee",

    signalBuy: "#00e676",
    signalSell: "#ff1744",
    signalNeutral: "#ffc400",
    signalBuyBg: "rgba(0,230,118,0.06)",
    signalSellBg: "rgba(255,23,68,0.06)",
    signalNeutralBg: "rgba(255,196,0,0.06)",

    scrollbar: "#1e293b",
    liveIndicator: "#00e5a0",
    lockOverlayBg: "rgba(6,10,16,0.95)",
    upgradeOrange: "#f97316",
    statusGray: "#94a3b8",

    isDark: true,
    themeKey: "dark",
};

// ═══════════════════════════════════════════════════════
// ☀️  LIGHT
// ═══════════════════════════════════════════════════════
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
    textBright: "#0f172a",

    headerBg: "linear-gradient(180deg, #ffffff 0%, #f8f9fb 100%)",
    headerBorder: "rgba(0,0,0,0.06)",

    positive: "#0d7a3a",
    positiveBg: "rgba(13,122,58,0.10)",
    positiveBorder: "rgba(13,122,58,0.20)",
    negative: "#b91c1c",
    negativeBg: "rgba(185,28,28,0.10)",
    negativeBorder: "rgba(185,28,28,0.20)",
    warning: "#b45309",
    warningBg: "rgba(180,83,9,0.10)",
    info: "#4338ca",
    infoBg: "rgba(67,56,202,0.10)",

    accent: "#4f46e5",
    accentLight: "#7c3aed",
    accentGlow08: "rgba(79,70,229,0.08)",
    accentGlow15: "rgba(79,70,229,0.15)",
    accentGlow25: "rgba(79,70,229,0.25)",

    chartBg: "#ffffff",
    chartGrid: "rgba(0,0,0,0.06)",
    chartText: "#94a3b8",
    chartCrosshair: "rgba(0,0,0,0.2)",
    chartCandleGreen: "#15803d",
    chartCandleRed: "#b91c1c",
    chartCandleLive: "#4338ca",

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

    tableBg: "#e8eaef",
    tableBorder: "rgba(0,0,0,0.08)",
    totalHighlight: "rgba(217,119,6,0.03)",
    classificationHighlight: "rgba(8,145,178,0.03)",
    amberLabel: "#d97706",
    cyanLabel: "#0891b2",

    signalBuy: "#0d7a3a",
    signalSell: "#b91c1c",
    signalNeutral: "#b45309",
    signalBuyBg: "rgba(13,122,58,0.08)",
    signalSellBg: "rgba(185,28,28,0.08)",
    signalNeutralBg: "rgba(180,83,9,0.08)",

    scrollbar: "#cbd5e1",
    liveIndicator: "#0d7a3a",
    lockOverlayBg: "rgba(0,0,0,0.6)",
    upgradeOrange: "#ea580c",
    statusGray: "#64748b",

    isDark: false,
    themeKey: "light",
};

// ═══════════════════════════════════════════════════════
// 🌊  OCEAN  — أزرق بحري عميق
// ═══════════════════════════════════════════════════════
const oceanTokens: ThemeTokens = {
    bg: "#0a1929",
    bgPage: "#071420",
    surface: "#0f2236",
    surfaceElevated: "#163050",
    surfaceHover: "rgba(100,200,255,0.06)",
    surfaceActive: "rgba(100,200,255,0.1)",

    border: "rgba(100,180,255,0.08)",
    borderStrong: "rgba(100,180,255,0.15)",

    textPrimary: "#c8e0f8",
    textSecondary: "#7ba3c4",
    textMuted: "#5a8aab",
    textDim: "#3d6d8e",
    textBright: "#e0f0ff",

    headerBg: "linear-gradient(180deg, #0c1f35 0%, #081828 100%)",
    headerBorder: "rgba(100,180,255,0.06)",

    positive: "#00e5a0",
    positiveBg: "rgba(0,229,160,0.1)",
    positiveBorder: "rgba(0,229,160,0.2)",
    negative: "#ff6b6b",
    negativeBg: "rgba(255,107,107,0.1)",
    negativeBorder: "rgba(255,107,107,0.2)",
    warning: "#ffd166",
    warningBg: "rgba(255,209,102,0.08)",
    info: "#64b5f6",
    infoBg: "rgba(100,181,246,0.08)",

    accent: "#42a5f5",
    accentLight: "#90caf9",
    accentGlow08: "rgba(66,165,245,0.08)",
    accentGlow15: "rgba(66,165,245,0.15)",
    accentGlow25: "rgba(66,165,245,0.25)",

    chartBg: "#0A192F",
    chartGrid: "rgba(100,180,255,0.06)",
    chartText: "#5a8aab",
    chartCrosshair: "rgba(100,200,255,0.3)",
    chartCandleGreen: "#3EB489",
    chartCandleRed: "#CC5500",
    chartCandleLive: "#E8F0FE",

    tooltipBg: "#163050",
    tooltipBorder: "rgba(100,180,255,0.15)",
    tooltipText: "#c8e0f8",

    buttonGhost: "rgba(100,180,255,0.06)",
    buttonGhostBorder: "rgba(100,180,255,0.08)",
    buttonGhostText: "#7ba3c4",

    inputBg: "rgba(100,180,255,0.05)",
    inputBorder: "rgba(100,180,255,0.08)",
    inputText: "#c8e0f8",
    inputPlaceholder: "#3d6d8e",

    tableBg: "rgba(10,25,45,0.98)",
    tableBorder: "rgba(100,180,255,0.05)",
    totalHighlight: "rgba(255,209,102,0.04)",
    classificationHighlight: "rgba(100,200,255,0.03)",
    amberLabel: "#ffd166",
    cyanLabel: "#4dd0e1",

    signalBuy: "#00e5a0",
    signalSell: "#ff6b6b",
    signalNeutral: "#ffd166",
    signalBuyBg: "rgba(0,229,160,0.06)",
    signalSellBg: "rgba(255,107,107,0.06)",
    signalNeutralBg: "rgba(255,209,102,0.06)",

    scrollbar: "#163050",
    liveIndicator: "#00e5a0",
    lockOverlayBg: "rgba(8,20,38,0.95)",
    upgradeOrange: "#ff9800",
    statusGray: "#7ba3c4",

    isDark: true,
    themeKey: "ocean",
};

// ═══════════════════════════════════════════════════════
// 🌅  SUNSET  — بنفسجي دافئ
// ═══════════════════════════════════════════════════════
const sunsetTokens: ThemeTokens = {
    bg: "#1a0f1e",
    bgPage: "#150c18",
    surface: "#221528",
    surfaceElevated: "#2d1c34",
    surfaceHover: "rgba(255,150,100,0.06)",
    surfaceActive: "rgba(255,150,100,0.1)",

    border: "rgba(255,150,100,0.08)",
    borderStrong: "rgba(255,150,100,0.15)",

    textPrimary: "#eddcd5",
    textSecondary: "#b89a8e",
    textMuted: "#9a7a6e",
    textDim: "#7a5e55",
    textBright: "#ffeee6",

    headerBg: "linear-gradient(180deg, #1f1225 0%, #18101e 100%)",
    headerBorder: "rgba(255,150,100,0.06)",

    positive: "#4ade80",
    positiveBg: "rgba(74,222,128,0.1)",
    positiveBorder: "rgba(74,222,128,0.2)",
    negative: "#f87171",
    negativeBg: "rgba(248,113,113,0.1)",
    negativeBorder: "rgba(248,113,113,0.2)",
    warning: "#fbbf24",
    warningBg: "rgba(251,191,36,0.08)",
    info: "#c084fc",
    infoBg: "rgba(192,132,252,0.08)",

    accent: "#a855f7",
    accentLight: "#e879f9",
    accentGlow08: "rgba(168,85,247,0.08)",
    accentGlow15: "rgba(168,85,247,0.15)",
    accentGlow25: "rgba(168,85,247,0.25)",

    chartBg: "#1C0A28",
    chartGrid: "rgba(255,150,100,0.04)",
    chartText: "#9a7a6e",
    chartCrosshair: "rgba(255,150,100,0.3)",
    chartCandleGreen: "#F4D03F",
    chartCandleRed: "#4A235A",
    chartCandleLive: "#F8C471",

    tooltipBg: "#2d1c34",
    tooltipBorder: "rgba(255,150,100,0.15)",
    tooltipText: "#eddcd5",

    buttonGhost: "rgba(255,150,100,0.06)",
    buttonGhostBorder: "rgba(255,150,100,0.08)",
    buttonGhostText: "#b89a8e",

    inputBg: "rgba(255,150,100,0.05)",
    inputBorder: "rgba(255,150,100,0.08)",
    inputText: "#eddcd5",
    inputPlaceholder: "#7a5e55",

    tableBg: "rgba(26,16,30,0.98)",
    tableBorder: "rgba(255,150,100,0.05)",
    totalHighlight: "rgba(251,191,36,0.04)",
    classificationHighlight: "rgba(192,132,252,0.03)",
    amberLabel: "#fbbf24",
    cyanLabel: "#c084fc",

    signalBuy: "#4ade80",
    signalSell: "#f87171",
    signalNeutral: "#fbbf24",
    signalBuyBg: "rgba(74,222,128,0.06)",
    signalSellBg: "rgba(248,113,113,0.06)",
    signalNeutralBg: "rgba(251,191,36,0.06)",

    scrollbar: "#2d1c34",
    liveIndicator: "#4ade80",
    lockOverlayBg: "rgba(20,12,24,0.95)",
    upgradeOrange: "#fb923c",
    statusGray: "#b89a8e",

    isDark: true,
    themeKey: "sunset",
};

// ═══════════════════════════════════════════════════════
// ⚡  NEON CYBER  — أسود فحمي مع نيون ساطع
// ═══════════════════════════════════════════════════════
const neonTokens: ThemeTokens = {
    bg: "#0a0a0a",
    bgPage: "#050505",
    surface: "#111111",
    surfaceElevated: "#1a1a1a",
    surfaceHover: "rgba(0,255,136,0.06)",
    surfaceActive: "rgba(0,255,136,0.1)",

    border: "rgba(0,255,136,0.08)",
    borderStrong: "rgba(0,255,136,0.18)",

    textPrimary: "#e0ffe0",
    textSecondary: "#88cc88",
    textMuted: "#55aa55",
    textDim: "#337733",
    textBright: "#f0fff0",

    headerBg: "linear-gradient(180deg, #0d0d0d 0%, #080808 100%)",
    headerBorder: "rgba(0,255,136,0.06)",

    positive: "#00ff88",
    positiveBg: "rgba(0,255,136,0.1)",
    positiveBorder: "rgba(0,255,136,0.25)",
    negative: "#ff0066",
    negativeBg: "rgba(255,0,102,0.1)",
    negativeBorder: "rgba(255,0,102,0.25)",
    warning: "#ffff00",
    warningBg: "rgba(255,255,0,0.08)",
    info: "#00ccff",
    infoBg: "rgba(0,204,255,0.08)",

    accent: "#00ff88",
    accentLight: "#ff00ff",
    accentGlow08: "rgba(0,255,136,0.08)",
    accentGlow15: "rgba(0,255,136,0.15)",
    accentGlow25: "rgba(0,255,136,0.25)",

    chartBg: "#000000",
    chartGrid: "rgba(0,255,136,0.04)",
    chartText: "#55aa55",
    chartCrosshair: "rgba(0,255,136,0.3)",
    chartCandleGreen: "#00FFFF",
    chartCandleRed: "#FF00FF",
    chartCandleLive: "#39FF14",

    tooltipBg: "#1a1a1a",
    tooltipBorder: "rgba(0,255,136,0.15)",
    tooltipText: "#e0ffe0",

    buttonGhost: "rgba(0,255,136,0.06)",
    buttonGhostBorder: "rgba(0,255,136,0.1)",
    buttonGhostText: "#88cc88",

    inputBg: "rgba(0,255,136,0.04)",
    inputBorder: "rgba(0,255,136,0.1)",
    inputText: "#e0ffe0",
    inputPlaceholder: "#337733",

    tableBg: "rgba(10,10,10,0.98)",
    tableBorder: "rgba(0,255,136,0.05)",
    totalHighlight: "rgba(255,255,0,0.04)",
    classificationHighlight: "rgba(0,204,255,0.03)",
    amberLabel: "#ffff00",
    cyanLabel: "#00ccff",

    signalBuy: "#00ff88",
    signalSell: "#ff0066",
    signalNeutral: "#ffff00",
    signalBuyBg: "rgba(0,255,136,0.06)",
    signalSellBg: "rgba(255,0,102,0.06)",
    signalNeutralBg: "rgba(255,255,0,0.06)",

    scrollbar: "#1a1a1a",
    liveIndicator: "#00ff88",
    lockOverlayBg: "rgba(5,5,5,0.95)",
    upgradeOrange: "#ff6600",
    statusGray: "#88cc88",

    isDark: true,
    themeKey: "neon",
};

// ═══════════════════════════════════════════════════════
// 👑  GOLD ELITE  — أسود مع ذهبي فاخر
// ═══════════════════════════════════════════════════════
const goldTokens: ThemeTokens = {
    bg: "#0f0d08",
    bgPage: "#0a0905",
    surface: "#1a1608",
    surfaceElevated: "#252010",
    surfaceHover: "rgba(255,215,0,0.06)",
    surfaceActive: "rgba(255,215,0,0.1)",

    border: "rgba(255,215,0,0.08)",
    borderStrong: "rgba(255,215,0,0.18)",

    textPrimary: "#f5e6c8",
    textSecondary: "#c4a56e",
    textMuted: "#9a8050",
    textDim: "#6e5a35",
    textBright: "#fff8e7",

    headerBg: "linear-gradient(180deg, #141108 0%, #0c0a04 100%)",
    headerBorder: "rgba(255,215,0,0.06)",

    positive: "#50e68a",
    positiveBg: "rgba(80,230,138,0.1)",
    positiveBorder: "rgba(80,230,138,0.2)",
    negative: "#ff5555",
    negativeBg: "rgba(255,85,85,0.1)",
    negativeBorder: "rgba(255,85,85,0.2)",
    warning: "#ffd700",
    warningBg: "rgba(255,215,0,0.08)",
    info: "#daa520",
    infoBg: "rgba(218,165,32,0.08)",

    accent: "#ffd700",
    accentLight: "#ffed4a",
    accentGlow08: "rgba(255,215,0,0.08)",
    accentGlow15: "rgba(255,215,0,0.15)",
    accentGlow25: "rgba(255,215,0,0.25)",

    chartBg: "#141210",
    chartGrid: "rgba(255,215,0,0.04)",
    chartText: "#9a8050",
    chartCrosshair: "rgba(255,215,0,0.3)",
    chartCandleGreen: "#C9A84C",
    chartCandleRed: "#8B2500",
    chartCandleLive: "#FFEAA7",

    tooltipBg: "#252010",
    tooltipBorder: "rgba(255,215,0,0.15)",
    tooltipText: "#f5e6c8",

    buttonGhost: "rgba(255,215,0,0.06)",
    buttonGhostBorder: "rgba(255,215,0,0.1)",
    buttonGhostText: "#c4a56e",

    inputBg: "rgba(255,215,0,0.04)",
    inputBorder: "rgba(255,215,0,0.1)",
    inputText: "#f5e6c8",
    inputPlaceholder: "#6e5a35",

    tableBg: "rgba(15,13,8,0.98)",
    tableBorder: "rgba(255,215,0,0.05)",
    totalHighlight: "rgba(255,215,0,0.04)",
    classificationHighlight: "rgba(218,165,32,0.03)",
    amberLabel: "#ffd700",
    cyanLabel: "#daa520",

    signalBuy: "#50e68a",
    signalSell: "#ff5555",
    signalNeutral: "#ffd700",
    signalBuyBg: "rgba(80,230,138,0.06)",
    signalSellBg: "rgba(255,85,85,0.06)",
    signalNeutralBg: "rgba(255,215,0,0.06)",

    scrollbar: "#252010",
    liveIndicator: "#50e68a",
    lockOverlayBg: "rgba(10,9,5,0.95)",
    upgradeOrange: "#ff8c00",
    statusGray: "#c4a56e",

    isDark: true,
    themeKey: "gold",
};

// ═══════════════════════════════════════════════════════
// ❄️  SNOW  — أبيض ثلجي نقي
// ═══════════════════════════════════════════════════════
const snowTokens: ThemeTokens = {
    bg: "#f0f4f8",
    bgPage: "#e8edf3",
    surface: "#f8f9fc",
    surfaceElevated: "#eef1f6",
    surfaceHover: "rgba(74,130,210,0.06)",
    surfaceActive: "rgba(74,130,210,0.1)",

    border: "rgba(74,130,210,0.12)",
    borderStrong: "rgba(74,130,210,0.2)",

    textPrimary: "#1a2740",
    textSecondary: "#3d5a80",
    textMuted: "#6b8ab5",
    textDim: "#9bb5d0",
    textBright: "#0d1b2a",

    headerBg: "linear-gradient(180deg, #ffffff 0%, #f4f7fb 100%)",
    headerBorder: "rgba(74,130,210,0.08)",

    positive: "#0f9960",
    positiveBg: "rgba(15,153,96,0.08)",
    positiveBorder: "rgba(15,153,96,0.18)",
    negative: "#c0392b",
    negativeBg: "rgba(192,57,43,0.08)",
    negativeBorder: "rgba(192,57,43,0.18)",
    warning: "#c87f0a",
    warningBg: "rgba(200,127,10,0.08)",
    info: "#2e86c1",
    infoBg: "rgba(46,134,193,0.08)",

    accent: "#2e86c1",
    accentLight: "#5dade2",
    accentGlow08: "rgba(46,134,193,0.08)",
    accentGlow15: "rgba(46,134,193,0.15)",
    accentGlow25: "rgba(46,134,193,0.25)",

    chartBg: "#F0F4F8",
    chartGrid: "rgba(74,130,210,0.06)",
    chartText: "#9bb5d0",
    chartCrosshair: "rgba(74,130,210,0.25)",
    chartCandleGreen: "#4169E1",
    chartCandleRed: "#2D2D2D",
    chartCandleLive: "#FF69B4",

    tooltipBg: "#eef1f6",
    tooltipBorder: "rgba(74,130,210,0.15)",
    tooltipText: "#1a2740",

    buttonGhost: "rgba(74,130,210,0.06)",
    buttonGhostBorder: "rgba(74,130,210,0.12)",
    buttonGhostText: "#6b8ab5",

    inputBg: "rgba(74,130,210,0.05)",
    inputBorder: "rgba(74,130,210,0.15)",
    inputText: "#1a2740",
    inputPlaceholder: "#9bb5d0",

    tableBg: "#eef1f6",
    tableBorder: "rgba(74,130,210,0.08)",
    totalHighlight: "rgba(200,127,10,0.04)",
    classificationHighlight: "rgba(46,134,193,0.04)",
    amberLabel: "#c87f0a",
    cyanLabel: "#2e86c1",

    signalBuy: "#0f9960",
    signalSell: "#c0392b",
    signalNeutral: "#c87f0a",
    signalBuyBg: "rgba(15,153,96,0.06)",
    signalSellBg: "rgba(192,57,43,0.06)",
    signalNeutralBg: "rgba(200,127,10,0.06)",

    scrollbar: "#ccdbe8",
    liveIndicator: "#0f9960",
    lockOverlayBg: "rgba(0,0,0,0.5)",
    upgradeOrange: "#d35400",
    statusGray: "#6b8ab5",

    isDark: false,
    themeKey: "snow",
};

// ═══════════════════════════════════════════════════════
// Token Lookup
// ═══════════════════════════════════════════════════════
const tokenMap: Record<Theme, ThemeTokens> = {
    dark: darkTokens,
    light: lightTokens,
    ocean: oceanTokens,
    sunset: sunsetTokens,
    neon: neonTokens,
    gold: goldTokens,
    snow: snowTokens,
};

export function useThemeTokens(): ThemeTokens {
    const { theme } = useTheme();
    return useMemo(() => tokenMap[theme] ?? darkTokens, [theme]);
}
