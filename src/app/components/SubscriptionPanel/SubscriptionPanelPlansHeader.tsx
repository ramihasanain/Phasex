import { Clock, Crown } from "lucide-react";
import { motion } from "motion/react";
import type { SubscriptionPanelViewModel } from "./useSubscriptionPanel";

export function SubscriptionPanelPlansHeader({ p }: { p: SubscriptionPanelViewModel }) {
    const {
        t,
        isRTL,
        isActive,
        subscriptionStatus,
        subscriptionPlan,
        daysRemaining,
        progressPercent,
        endDateFormatted,
        billingLabel,
        subscriptionDetails,
    } = p;

    return (
        <>
            <div
                className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
                style={{ background: `radial-gradient(circle, #6366f1 0%, transparent 60%)`, filter: "blur(60px)" }}
            />

            <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative bg-[#10141d] border border-[#6366f1]/30 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                    <Crown size={32} className="text-[#6366f1]" />
                </div>
                <div>
                    <h2 className="text-4xl font-black text-white">{t("subscriptionTitle")}</h2>
                    <p className="text-gray-400 font-medium mt-1">{t("subscriptionSubtitle")}</p>
                </div>
            </div>

            <div
                className="p-8 rounded-[32px] border mb-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
                style={{
                    borderColor: isActive ? "#00e5a0" : "#1c2230",
                    background: "#10141d",
                    boxShadow: isActive ? `0 10px 40px rgba(0,229,160,0.05), inset 0 0 20px rgba(0,229,160,0.05)` : "none",
                }}
            >
                <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                        <span
                            className={`px-4 py-1.5 rounded-xl text-sm font-black uppercase tracking-widest ${
                                isActive
                                    ? "bg-[#00e5a0]/15 text-[#00e5a0]"
                                    : subscriptionStatus === "pending"
                                      ? "bg-[#facc15]/15 text-[#facc15]"
                                      : "bg-red-500/15 text-red-500"
                            }`}
                        >
                            {isActive ? t("planActive") : subscriptionStatus === "pending" ? t("planPending") : t("planNone")}
                        </span>
                        <span className="text-xl font-bold text-white capitalize">
                            {subscriptionPlan === "none" ? t("guestAccess") : subscriptionPlan}
                        </span>
                    </div>

                    {isActive ? (
                        <div className="space-y-4 max-w-lg mt-8">
                            <div className="flex items-center justify-between text-sm font-bold">
                                <span className="text-gray-400">
                                    {daysRemaining} {t("subDaysRemaining")}
                                </span>
                                <span className="text-[#00e5a0]">{t("nextBilling")}</span>
                            </div>
                            <div className="h-3 rounded-full bg-[#1c2230] overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="h-full bg-[#00e5a0]" />
                            </div>
                        </div>
                    ) : null}
                </div>

                {isActive && subscriptionDetails ? (
                    <div className="flex items-center gap-6 p-6 rounded-2xl bg-[#0b0e14] border border-[#1c2230] shrink-0">
                        <div className="text-center px-4">
                            <Clock className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                            <div className="text-xs text-gray-400 uppercase tracking-widest font-black">{t("validUntil")}</div>
                            <div className="text-white font-bold mt-1">{endDateFormatted}</div>
                            <div className="text-[10px] text-gray-500 mt-1 font-bold">{billingLabel}</div>
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
}
