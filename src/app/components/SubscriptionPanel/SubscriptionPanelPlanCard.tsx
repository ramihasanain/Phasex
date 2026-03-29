import { Check, X } from "lucide-react";
import { motion } from "motion/react";
import type { SubscriptionPlanRow } from "./types";

export function SubscriptionPanelPlanCard({
    plan,
    isSelected,
    isCurrentPlan,
    billingCycle,
    t,
    getPrice,
    setSelectedPlan,
}: {
    plan: SubscriptionPlanRow;
    isSelected: boolean;
    isCurrentPlan: boolean;
    billingCycle: "monthly" | "yearly";
    t: (key: string) => string;
    getPrice: (n: number) => number;
    setSelectedPlan: (id: string) => void;
}) {
    return (
        <motion.div
            onClick={() => !isCurrentPlan && setSelectedPlan(plan.id)}
            whileHover={{ y: isCurrentPlan ? 0 : -5 }}
            className={`relative rounded-[24px] p-5 flex flex-col transition-all duration-300 ${
                isSelected ? "shadow-2xl" : isCurrentPlan ? "opacity-80" : "cursor-pointer hover:bg-[#151a26]"
            }`}
            style={{
                backgroundColor: isSelected || isCurrentPlan ? `${plan.iconColor}08` : "#10141d",
                border: `1px solid ${isSelected || isCurrentPlan ? plan.iconColor : "#1c2230"}`,
                boxShadow: isSelected ? `0 20px 50px -10px ${plan.iconColor}30, inset 0 0 20px ${plan.iconColor}10` : "none",
            }}
        >
            {isCurrentPlan ? (
                <div
                    className="absolute top-0 left-5 px-3 py-1 rounded-b-xl text-[9px] uppercase tracking-widest font-black text-white shadow-lg"
                    style={{ backgroundColor: "#22c55e" }}
                >
                    {t("currentPlan")}
                </div>
            ) : null}

            {plan.badge && !isCurrentPlan ? (
                <div
                    className="absolute top-0 right-5 px-3 py-1 rounded-b-xl text-[9px] uppercase tracking-widest font-black text-black shadow-lg"
                    style={{ backgroundColor: plan.badge.color }}
                >
                    {plan.badge.text}
                </div>
            ) : null}

            {(isSelected || isCurrentPlan) && (
                <div
                    className="absolute top-5 right-5 rounded-full p-0.5 z-20"
                    style={{
                        color: isCurrentPlan ? "#22c55e" : plan.iconColor,
                        background: isCurrentPlan ? "#22c55e20" : `${plan.iconColor}20`,
                    }}
                >
                    <Check size={16} strokeWidth={4} />
                </div>
            )}

            <div className="mb-3 mt-2">
                <h4 className="text-base font-black text-white mb-0.5">{plan.name}</h4>
                <p className="text-[11px] text-gray-500 font-medium leading-snug">{plan.description}</p>
            </div>

            <div className="mb-4">
                <div className="flex items-baseline gap-1">
                    <div className="text-3xl font-black" style={{ color: isSelected || isCurrentPlan ? plan.iconColor : "#fff" }}>
                        ${getPrice(plan.price)}
                    </div>
                    <span className="text-xs text-gray-500 font-bold">/ {billingCycle === "yearly" ? t("perYear") : t("perMonth")}</span>
                    {billingCycle === "yearly" ? (
                        <span className="text-[10px] text-gray-600 line-through ml-1">${plan.price * 12}</span>
                    ) : null}
                </div>
                {billingCycle === "yearly" ? (
                    <p className="text-[9px] text-[#00e5a0] font-bold mt-1">
                        {t("billedAnnually")} — {t("save20")}
                    </p>
                ) : null}
            </div>

            <div className="h-px w-full mb-3" style={{ background: `linear-gradient(90deg, transparent, ${plan.iconColor}30, transparent)` }} />

            <div className="mb-3">
                <p className="text-[10px] uppercase tracking-widest font-black mb-2" style={{ color: plan.iconColor }}>
                    {t("chartAccess")}
                </p>
                <div className="space-y-1.5">
                    {plan.charts.map((chart, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: plan.iconColor }} />
                            <span className="text-[11px] text-gray-300 font-medium">{chart}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-px w-full mb-3" style={{ background: `linear-gradient(90deg, transparent, ${plan.iconColor}15, transparent)` }} />

            <div className="mb-3 flex-1">
                <p className="text-[10px] uppercase tracking-widest font-black mb-2" style={{ color: plan.iconColor }}>
                    {t("subFeatures")}
                </p>
                <ul className="space-y-1.5">
                    {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px]">
                            <div className="shrink-0 mt-0.5" style={{ color: isSelected || isCurrentPlan ? plan.iconColor : "#64748b" }}>
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <span className={isSelected || isCurrentPlan ? "text-gray-200 font-medium" : "text-gray-400 font-medium"}>
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {plan.limitations ? (
                <div className="mb-2">
                    <ul className="space-y-1.5">
                        {plan.limitations.map((lim, i) => (
                            <li key={i} className="flex items-start gap-2 text-[11px]">
                                <div className="shrink-0 mt-0.5 text-red-500/60">
                                    <X size={12} strokeWidth={3} />
                                </div>
                                <span className="text-gray-500 font-medium">{lim}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}

            <div className="mt-auto pt-3" style={{ borderTop: `1px solid ${plan.iconColor}10` }}>
                <p className="text-[10px] text-gray-500 leading-relaxed italic">{plan.suitableFor}</p>
            </div>
        </motion.div>
    );
}
