import { Crown, Star, Trophy, Zap } from "lucide-react";
import type { SubscriptionPlanRow } from "./types";

type TFn = (key: string) => string;

export function buildSubscriptionPlans(t: TFn): SubscriptionPlanRow[] {
    return [
        {
            id: "core",
            name: t("planCoreName"),
            price: 29,
            iconColor: "#3b82f6",
            icon: <Zap size={24} className="text-[#3b82f6]" />,
            badge: null,
            charts: ["Phase State", "Direction State"],
            features: [t("planCoreF1"), t("planCoreF2"), t("planCoreF3"), t("planCoreF4")],
            limitations: [t("planCoreL1"), t("planCoreL2")],
            description: t("planCoreDesc"),
            suitableFor: t("planCoreSuitable"),
        },
        {
            id: "trader",
            name: t("planTraderName"),
            price: 49,
            iconColor: "#00e5a0",
            icon: <Star size={24} className="text-[#00e5a0]" />,
            badge: { text: t("planTraderBadge"), color: "#00e5a0" },
            charts: ["Phase State", "Direction State", "Oscillation State"],
            features: [t("planTraderF1"), t("planTraderF2"), t("planTraderF3"), t("planTraderF4")],
            limitations: null,
            description: t("planTraderDesc"),
            suitableFor: t("planTraderSuitable"),
        },
        {
            id: "professional",
            name: t("planProName"),
            price: 89,
            iconColor: "#a855f7",
            icon: <Trophy size={24} className="text-[#a855f7]" />,
            badge: { text: t("planProBadge"), color: "#a855f7" },
            charts: ["Phase State", "Direction State", "Oscillation State", "Reference State", "Displacement State"],
            features: [t("planProF1"), t("planProF2"), t("planProF3"), t("planProF4")],
            limitations: null,
            description: t("planProDesc"),
            suitableFor: t("planProSuitable"),
        },
        {
            id: "institutional",
            name: t("planInstName"),
            price: 149,
            iconColor: "#facc15",
            icon: <Crown size={24} className="text-[#facc15]" />,
            badge: { text: t("planInstBadge"), color: "#facc15" },
            charts: [
                "Phase State",
                "Direction State",
                "Oscillation State",
                "Reference State",
                "Displacement State",
                "Envelope State",
            ],
            features: [t("planInstF1"), t("planInstF2"), t("planInstF3"), t("planInstF4"), t("planInstF5")],
            limitations: null,
            description: t("planInstDesc"),
            suitableFor: t("planInstSuitable"),
        },
    ];
}
