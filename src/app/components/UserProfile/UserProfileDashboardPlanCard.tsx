import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { SubscriptionPlan } from "../../contexts/AuthContext";
import { PlanIcon } from "./PlanIcon";
import type { PlanTheme } from "./types";

interface UserProfileDashboardPlanCardProps {
    theme: PlanTheme;
    subscriptionPlan: SubscriptionPlan;
    planDisplayName: string;
    currentPlanLabel: string;
    onManage: () => void;
}

export function UserProfileDashboardPlanCard({
    theme,
    subscriptionPlan,
    planDisplayName,
    currentPlanLabel,
    onManage,
}: UserProfileDashboardPlanCardProps) {
    return (
        <motion.div
            whileHover={{ y: -3 }}
            className="p-6 rounded-[24px] border bg-[#10141d] hover:border-opacity-60 transition-all flex flex-col cursor-pointer relative overflow-hidden group"
            onClick={onManage}
            style={{ borderColor: `${theme.color}20` }}
        >
            <div
                className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                    background: `radial-gradient(circle, ${theme.color}15, transparent 70%)`,
                    filter: "blur(30px)",
                }}
            />
            <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner" style={{ background: `${theme.color}15` }}>
                    <PlanIcon plan={subscriptionPlan} size={24} />
                </div>
                <span
                    className="text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest"
                    style={{ background: `${theme.color}12`, color: theme.color }}
                >
                    {currentPlanLabel || "Current Plan"}
                </span>
            </div>
            <div className="text-2xl font-black capitalize mb-1 text-white">{planDisplayName}</div>
            <p className="text-[11px] font-medium text-gray-500 mb-4 leading-relaxed">
                {subscriptionPlan === "none" ? "Upgrade to access full terminal systems." : "Full phase-state terminal access enabled."}
            </p>
            <div className="mt-auto pt-3 border-t flex items-center justify-between" style={{ borderColor: `${theme.color}10` }}>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {subscriptionPlan === "none" ? "Upgrade Plan" : "Manage"}
                </span>
                <ArrowRight size={14} className="text-gray-500" />
            </div>
        </motion.div>
    );
}
