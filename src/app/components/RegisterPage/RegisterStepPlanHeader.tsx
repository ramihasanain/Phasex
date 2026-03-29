import { motion } from "motion/react";
import { Crown, Loader2, AlertCircle } from "lucide-react";
import type { RegisterWizardValue } from "./useRegisterWizard";

type Props = { w: RegisterWizardValue };

export function RegisterStepPlanHeader({ w }: Props) {
  const { t, isRTL, billingCycle, setBillingCycle, accent, stepColors, plansLoading, subscriptionTypes } = w;

  return (
    <>
      <div className="text-center mb-4">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: `${stepColors[2]}12`, border: `1px solid ${stepColors[2]}25` }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Crown className="w-4 h-4" style={{ color: stepColors[2] }} />
          <span className="text-sm font-bold" style={{ color: stepColors[2] }}>
            {t("chooseYourPlanSub")}
          </span>
        </motion.div>
      </div>

      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="flex items-center rounded-full p-1 gap-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${billingCycle === "monthly" ? "text-black" : "text-gray-400 hover:text-white"}`}
            style={{ background: billingCycle === "monthly" ? accent : "transparent" }}
          >
            {t("billingMonthly")}
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-black" : "text-gray-400 hover:text-white"}`}
            style={{ background: billingCycle === "yearly" ? accent : "transparent" }}
          >
            {t("billingYearly")}
          </button>
        </div>
        {billingCycle === "yearly" && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider text-black"
            style={{ background: `linear-gradient(90deg, ${accent}, #00c890)` }}
          >
            {t("save20")}
          </motion.span>
        )}
      </div>

      {plansLoading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#a855f7]" />
          <p className="text-sm text-gray-400 font-medium">{isRTL ? "جاري تحميل الباقات..." : "Loading plans..."}</p>
        </div>
      ) : subscriptionTypes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <AlertCircle className="w-8 h-8 text-red-400" />
          <p className="text-sm text-gray-400 font-medium">{isRTL ? "لا توجد باقات متاحة" : "No plans available"}</p>
        </div>
      ) : null}
    </>
  );
}
