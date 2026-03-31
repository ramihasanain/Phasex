import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSubscriptionOnboarding } from "./useSubscriptionOnboarding";

type Ctx = ReturnType<typeof useSubscriptionOnboarding>;

export function SubscriptionOnboardingPlanGrid({ ctx }: { ctx: Ctx }) {
    const {
        t,
        billingCycle,
        setBillingCycle,
        plans,
        selectedPlan,
        setSelectedPlan,
        getPrice,
    } = ctx;

    return (
        <>
            <div className="text-center mb-8 relative z-10 mt-6">
                <h1
                    className="text-4xl md:text-5xl font-black mb-3 tracking-tight text-[#6366f1]"
                    style={{ textShadow: "0 0 30px rgba(99,102,241,0.4)" }}
                >
                    {t("chooseYourPlan")}
                </h1>
                <p className="text-gray-400 text-lg font-medium">{t("chooseYourPlanSub")}</p>
            </div>

            <div className="flex items-center justify-center gap-3 mb-6 relative z-10">
                <div
                    className="flex items-center rounded-full p-1 gap-1"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                    <button
                        type="button"
                        onClick={() => setBillingCycle("monthly")}
                        className={`px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest transition-all cursor-pointer ${billingCycle === "monthly" ? "text-black bg-[#6366f1]" : "text-gray-400 hover:text-white"}`}
                    >
                        {t("billingMonthly")}
                    </button>
                    <button
                        type="button"
                        onClick={() => setBillingCycle("yearly")}
                        className={`px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest transition-all cursor-pointer ${billingCycle === "yearly" ? "text-black bg-[#6366f1]" : "text-gray-400 hover:text-white"}`}
                    >
                        {t("billingYearly")}
                    </button>
                </div>
                {billingCycle === "yearly" && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-3 py-1.5 rounded-full text-xs font-black tracking-wider text-black"
                        style={{ background: "linear-gradient(90deg, #00e5a0, #00c890)" }}
                    >
                        {t("save20")}
                    </motion.span>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-[1400px] mx-auto relative z-10 px-4">
                {plans.map((plan) => {
                    const isActive = selectedPlan === plan.id;
                    return (
                        <motion.div
                            key={plan.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedPlan(plan.id)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setSelectedPlan(plan.id);
                                }
                            }}
                            whileHover={{ y: -5 }}
                            className={`relative rounded-[24px] cursor-pointer p-6 flex flex-col transition-all duration-300 ${isActive ? "shadow-2xl" : "hover:bg-[#151a26]"}`}
                            style={{
                                backgroundColor: isActive ? `${plan.iconColor}08` : "#10141d",
                                border: `1px solid ${isActive ? plan.iconColor : "#1c2230"}`,
                                boxShadow: isActive
                                    ? `0 20px 50px -10px ${plan.iconColor}30, inset 0 0 20px ${plan.iconColor}10`
                                    : "none",
                                minHeight: "420px",
                            }}
                        >
                            {plan.badge && (
                                <div
                                    className="absolute top-0 left-5 px-3 py-1 rounded-b-xl text-[9px] font-black text-black shadow-lg uppercase tracking-widest"
                                    style={{ backgroundColor: plan.badge.color }}
                                >
                                    {plan.badge.text}
                                </div>
                            )}

                            {isActive && (
                                <div
                                    className="absolute top-5 right-5 rounded-full bg-transparent border-2 p-0.5 z-20"
                                    style={{ color: plan.iconColor, borderColor: plan.iconColor }}
                                >
                                    <Check size={16} strokeWidth={4} />
                                </div>
                            )}

                            <div className="mt-6 mb-3">
                                <h3 className="text-base font-black text-white mb-0.5">{plan.title}</h3>
                                <p className="text-[11px] text-gray-500 font-medium leading-snug">{plan.description}</p>
                            </div>

                            <div className="flex items-baseline gap-1 mb-3">
                                <span className="text-3xl font-black" style={{ color: isActive ? plan.iconColor : "#fff" }}>
                                    ${getPrice(plan.price)}
                                </span>
                                <span className="text-xs text-gray-500 font-bold">
                                    / {billingCycle === "yearly" ? t("perYear") : t("perMonth")}
                                </span>
                                {billingCycle === "yearly" && (
                                    <span className="text-[10px] text-gray-600 line-through ml-1">${plan.price * 12}</span>
                                )}
                            </div>
                            {billingCycle === "yearly" && (
                                <p className="text-[9px] text-[#00e5a0] font-bold mb-2">
                                    {t("billedAnnually")} — {t("save20")}
                                </p>
                            )}

                            <div
                                className="h-px w-full mb-3"
                                style={{ background: `linear-gradient(90deg, transparent, ${plan.iconColor}30, transparent)` }}
                            />

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

                            <div
                                className="h-px w-full mb-3"
                                style={{ background: `linear-gradient(90deg, transparent, ${plan.iconColor}15, transparent)` }}
                            />

                            <div className="mb-3 flex-1">
                                <p className="text-[10px] uppercase tracking-widest font-black mb-2" style={{ color: plan.iconColor }}>
                                    {t("subFeatures")}
                                </p>
                                <ul className="space-y-1.5">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-[11px]">
                                            <div className="shrink-0 mt-0.5" style={{ color: isActive ? plan.iconColor : "#64748b" }}>
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <span className={isActive ? "text-gray-200 font-medium" : "text-gray-400 font-medium"}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {plan.limitations && (
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
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </>
    );
}
