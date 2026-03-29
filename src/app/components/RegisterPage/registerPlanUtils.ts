import type { LucideIcon } from "lucide-react";
import { Zap, Star, Crown, Trophy } from "lucide-react";
import type { APIPlan, PlanIndicator } from "../../api/types";
import type { RegisterSubscriptionPlanRow } from "./types";

export function getPlanKey(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("core")) return "core";
  if (lower.includes("trader")) return "trader";
  if (lower.includes("professional") || lower.includes("pro")) return "professional";
  if (lower.includes("institutional") || lower.includes("inst")) return "institutional";
  return "core";
}

export function planColorMap(accent: string): Record<string, { color: string; icon: LucideIcon }> {
  return {
    core: { color: "#3b82f6", icon: Zap },
    trader: { color: accent, icon: Star },
    professional: { color: "#a855f7", icon: Crown },
    institutional: { color: "#facc15", icon: Trophy },
  };
}

export function mapPlansToRows(apiPlans: APIPlan[], accent: string): RegisterSubscriptionPlanRow[] {
  const colors = planColorMap(accent);
  return apiPlans.map((plan) => {
    const key = getPlanKey(plan.name);
    const mapping = colors[key] || { color: "#3b82f6", icon: Zap };
    return {
      id: String(plan.id),
      apiId: plan.id,
      name: plan.name,
      priceMonthly: parseFloat(plan.price_monthly),
      priceAnnualMonthly: parseFloat(plan.price_annual_monthly),
      priceAnnualTotal: parseFloat(plan.price_annual_total),
      savePercentage: parseFloat(plan.save_percentage),
      color: mapping.color,
      icon: mapping.icon,
      popular: plan.is_popular,
      charts: plan.indicators.map((ind: PlanIndicator) => ind.name),
      features: plan.features,
      limitations: plan.limitations,
      description: plan.description,
    };
  });
}
