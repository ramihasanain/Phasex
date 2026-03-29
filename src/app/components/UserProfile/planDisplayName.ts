import type { SubscriptionPlan } from "../../contexts/AuthContext";

export function getPlanDisplayName(plan: SubscriptionPlan, t: (key: string) => string): string {
    if (plan === "none") return "Guest";
    if (plan === "core") return t("planCoreName");
    if (plan === "trader") return t("planTraderName");
    if (plan === "professional") return t("planProName");
    if (plan === "institutional") return t("planInstName");
    return plan;
}
