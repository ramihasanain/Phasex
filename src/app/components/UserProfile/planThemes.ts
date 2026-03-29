import type { PlanTheme } from "./types";

export const planThemes: Record<string, PlanTheme> = {
    core: { color: "#3b82f6", gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)", glow: "rgba(59,130,246,0.25)", icon: "⚡", bg: "rgba(59,130,246,0.08)" },
    trader: { color: "#00e5a0", gradient: "linear-gradient(135deg, #00e5a0, #00b37e)", glow: "rgba(0,229,160,0.25)", icon: "⭐", bg: "rgba(0,229,160,0.08)" },
    professional: { color: "#a855f7", gradient: "linear-gradient(135deg, #a855f7, #7c3aed)", glow: "rgba(168,85,247,0.25)", icon: "🏆", bg: "rgba(168,85,247,0.08)" },
    institutional: { color: "#facc15", gradient: "linear-gradient(135deg, #facc15, #eab308)", glow: "rgba(250,204,21,0.25)", icon: "👑", bg: "rgba(250,204,21,0.08)" },
    none: { color: "#64748b", gradient: "linear-gradient(135deg, #64748b, #475569)", glow: "rgba(100,116,139,0.15)", icon: "🔒", bg: "rgba(100,116,139,0.08)" },
};
