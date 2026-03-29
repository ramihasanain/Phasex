import { AlertCircle, CircleCheck, Loader2, X } from "lucide-react";
import { motion } from "motion/react";
import { SubscriptionPanelConfirmSuccess } from "./SubscriptionPanelConfirmSuccess";
import { SubscriptionPanelPlanComparison } from "./SubscriptionPanelPlanComparison";
import type { SubscriptionPanelViewModel } from "./useSubscriptionPanel";

export function SubscriptionPanelConfirmChangeStep({ p }: { p: SubscriptionPanelViewModel }) {
    const {
        isRTL,
        subscriptionPlans,
        subscriptionPlan,
        selectedPlan,
        billingCycle,
        getPrice,
        isUpgrade,
        isDowngrade,
        aiAddon,
        mt5Addon,
        changeSuccess,
        changeError,
        setChangeError,
        changeLoading,
        handlePlanChange,
        setStep,
        onClose,
        setSelectedPlan,
    } = p;

    const currentPlanObj = subscriptionPlans.find((pl) => pl.id === subscriptionPlan);
    const newPlanObj = subscriptionPlans.find((pl) => pl.id === selectedPlan);
    const changeColor = isUpgrade ? "#6366f1" : isDowngrade ? "#f59e0b" : "#00e5a0";
    const changeBg = isUpgrade ? "rgba(99,102,241," : isDowngrade ? "rgba(245,158,11," : "rgba(0,229,160,";

    return (
        <div className="p-10 relative">
            <button
                onClick={() => setStep("plans")}
                className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest cursor-pointer"
            >
                {isRTL ? "← العودة" : "← Back"}
            </button>

            {changeSuccess ? (
                <SubscriptionPanelConfirmSuccess
                    isRTL={isRTL}
                    isUpgrade={isUpgrade}
                    isDowngrade={isDowngrade}
                    changeColor={changeColor}
                    changeBg={changeBg}
                    onClose={onClose}
                    setStep={setStep}
                    setSelectedPlan={setSelectedPlan}
                />
            ) : (
                <div className="max-w-2xl mx-auto mt-8">
                    <SubscriptionPanelPlanComparison
                        isRTL={isRTL}
                        subscriptionPlan={subscriptionPlan}
                        selectedPlan={selectedPlan}
                        currentPlanObj={currentPlanObj}
                        newPlanObj={newPlanObj}
                        billingCycle={billingCycle}
                        getPrice={getPrice}
                        aiAddon={aiAddon}
                        mt5Addon={mt5Addon}
                        changeColor={changeColor}
                        changeBg={changeBg}
                        isUpgrade={isUpgrade}
                        isDowngrade={isDowngrade}
                    />

                    {isDowngrade ? (
                        <div
                            className="p-4 rounded-xl mb-6 flex items-start gap-3"
                            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}
                        >
                            <AlertCircle className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-300 leading-relaxed">
                                {isRTL
                                    ? "سيتم تطبيق التخفيض في نهاية دورة الفوترة الحالية. ستظل تستمتع بخطتك الحالية حتى ذلك الحين."
                                    : "The downgrade will take effect at the end of your current billing cycle. You will continue to enjoy your current plan until then."}
                            </p>
                        </div>
                    ) : null}

                    {changeError ? (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl mb-6 flex items-center gap-3"
                            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}
                        >
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <p className="text-sm font-bold text-red-400">{changeError}</p>
                            <button type="button" onClick={() => setChangeError(null)} className="ml-auto text-red-400 cursor-pointer">
                                <X size={16} />
                            </button>
                        </motion.div>
                    ) : null}

                    <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 border-t border-[#1c2230] pt-8">
                        <button
                            onClick={() => setStep("plans")}
                            className="font-bold text-gray-500 hover:text-white transition-colors px-6 py-4 w-full sm:w-auto cursor-pointer"
                        >
                            {isRTL ? "إلغاء" : "Cancel"}
                        </button>
                        <button
                            onClick={handlePlanChange}
                            disabled={changeLoading}
                            className="px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.03] flex items-center justify-center gap-3 w-full sm:w-auto cursor-pointer disabled:opacity-60"
                            style={{ background: changeColor, boxShadow: `0 10px 40px ${changeBg}0.3)` }}
                        >
                            {changeLoading ? (
                                <>
                                    <Loader2 size={22} className="animate-spin" />
                                    {isRTL ? "جاري التنفيذ..." : "Processing..."}
                                </>
                            ) : (
                                <>
                                    <CircleCheck size={22} />
                                    {isUpgrade
                                        ? isRTL
                                            ? "تأكيد الترقية"
                                            : "Confirm Upgrade"
                                        : isDowngrade
                                          ? isRTL
                                              ? "تأكيد التخفيض"
                                              : "Confirm Downgrade"
                                          : isRTL
                                            ? "تأكيد التحديث"
                                            : "Confirm Update"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
