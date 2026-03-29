import { SubscriptionPanelPlanCard } from "./SubscriptionPanelPlanCard";
import type { SubscriptionPanelViewModel } from "./useSubscriptionPanel";

export function SubscriptionPanelPlanGrid({ p }: { p: SubscriptionPanelViewModel }) {
    const {
        t,
        subscriptionPlans,
        selectedPlan,
        setSelectedPlan,
        subscriptionPlan,
        subscriptionStatus,
        billingCycle,
        setBillingCycle,
        getPrice,
    } = p;

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-white">{t("availablePlans")}</h3>
                <div className="flex items-center gap-3">
                    <div
                        className="flex items-center rounded-full p-1 gap-1"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        <button
                            onClick={() => setBillingCycle("monthly")}
                            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                                billingCycle === "monthly" ? "text-black bg-[#6366f1]" : "text-gray-400 hover:text-white"
                            }`}
                        >
                            {t("billingMonthly")}
                        </button>
                        <button
                            onClick={() => setBillingCycle("yearly")}
                            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                                billingCycle === "yearly" ? "text-black bg-[#6366f1]" : "text-gray-400 hover:text-white"
                            }`}
                        >
                            {t("billingYearly")}
                        </button>
                    </div>
                    {billingCycle === "yearly" ? (
                        <span
                            className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider text-black"
                            style={{ background: "linear-gradient(90deg, #00e5a0, #00c890)" }}
                        >
                            {t("save20")}
                        </span>
                    ) : null}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 w-full">
                {subscriptionPlans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    const isCurrentPlan = subscriptionPlan === plan.id && subscriptionStatus === "active";
                    return (
                        <SubscriptionPanelPlanCard
                            key={plan.id}
                            plan={plan}
                            isSelected={isSelected}
                            isCurrentPlan={isCurrentPlan}
                            billingCycle={billingCycle}
                            t={t}
                            getPrice={getPrice}
                            setSelectedPlan={setSelectedPlan}
                        />
                    );
                })}
            </div>
        </>
    );
}
