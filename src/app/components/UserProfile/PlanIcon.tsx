import { Crown, Shield, Star, Trophy, Zap } from "lucide-react";
import { planThemes } from "./planThemes";

export function PlanIcon({ plan, size }: { plan: string; size: number }) {
    const theme = planThemes[plan] || planThemes.none;
    if (plan === "core") return <Zap size={size} style={{ color: theme.color }} />;
    if (plan === "trader") return <Star size={size} style={{ color: theme.color }} />;
    if (plan === "professional") return <Trophy size={size} style={{ color: theme.color }} />;
    if (plan === "institutional") return <Crown size={size} style={{ color: theme.color }} />;
    return <Shield size={size} style={{ color: theme.color }} />;
}
