import { motion } from "motion/react";
import { Zap, Check } from "lucide-react";
import type { RegisterWizardValue } from "./useRegisterWizard";

type Props = { w: RegisterWizardValue };

export function RegisterStepPlanFooter({ w }: Props) {
  const {
    t,
    billingCycle,
    aiAddon,
    setAiAddon,
    aiAddonPriceMonthly,
    aiAddonPriceAnnual,
    referralInput,
    setReferralInput,
    referralApplied,
    referralError,
    setReferralError,
    handleApplyReferral,
    handleRemoveReferral,
    referralDiscountAmount,
    totalAmount,
  } = w;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 rounded-2xl flex items-center justify-between cursor-pointer border transition-all"
        onClick={() => setAiAddon(!aiAddon)}
        style={{
          backgroundColor: aiAddon ? `rgba(0, 229, 160, 0.05)` : "rgba(255,255,255,0.02)",
          borderColor: aiAddon ? "#00e5a0" : "rgba(255,255,255,0.06)",
          boxShadow: aiAddon ? `0 5px 20px rgba(0,229,160,0.15)` : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0b0e14] border border-[#00e5a0]/30 shrink-0">
            {aiAddon ? <Zap size={20} className="text-[#00e5a0]" /> : <Zap size={20} className="text-gray-500" />}
          </div>
          <div>
            <h4 className="text-sm font-black text-white flex items-center gap-1.5">
              {t("aiInsightTitle")} <Zap size={12} className="text-[#00e5a0]" />
            </h4>
            <p className="text-[11px] text-gray-400">{t("aiInsightDesc")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-black text-[#00e5a0]">
            {billingCycle === "yearly" ? `$${aiAddonPriceAnnual}/${t("perYear")}` : `$${aiAddonPriceMonthly}/${t("perMonth")}`}
          </span>
          <div
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${aiAddon ? "border-[#00e5a0] bg-[#00e5a0]/20 text-[#00e5a0]" : "border-[#4b5563] text-transparent"}`}
          >
            <Check size={16} strokeWidth={4} />
          </div>
        </div>
      </motion.div>

      <div className="p-3 rounded-xl" style={{ background: "rgba(168,85,247,0.04)", border: "1px solid rgba(168,85,247,0.15)" }}>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#a855f7] mb-2">{t("referralCodeInput")}</p>
        {referralApplied ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-[#00e5a0]" />
              <span className="text-sm font-bold text-[#00e5a0]">{t("referralApplied")}</span>
              <span className="font-mono text-xs text-gray-400 ml-1">{referralInput.toUpperCase()}</span>
            </div>
            <button type="button" onClick={handleRemoveReferral} className="text-xs font-bold text-red-400 hover:text-red-300 cursor-pointer uppercase tracking-widest">
              {t("referralRemove")}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={referralInput}
              onChange={(e) => {
                setReferralInput(e.target.value);
                setReferralError(false);
              }}
              className="flex-1 px-3 py-2 rounded-lg text-sm font-mono font-bold bg-[#0b0e14] border border-[#1c2230] text-white placeholder-gray-600 focus:border-[#a855f7] outline-none uppercase tracking-wider"
              placeholder={t("referralCodePlaceholder")}
            />
            <button
              type="button"
              onClick={handleApplyReferral}
              className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest bg-[#a855f7] text-black cursor-pointer hover:bg-[#9333ea] transition-colors"
            >
              {t("applyCode")}
            </button>
          </div>
        )}
        {referralError && <p className="text-[10px] text-red-400 mt-1 font-bold">{t("referralInvalid")}</p>}
      </div>

      {referralApplied && (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: "rgba(0,229,160,0.05)", border: "1px solid rgba(0,229,160,0.15)" }}>
          <span className="text-xs font-bold text-[#00e5a0]">{t("referralDiscount")}</span>
          <span className="text-sm font-black text-[#00e5a0]">-${referralDiscountAmount.toFixed(2)}</span>
        </div>
      )}

      <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{t("totalDue")}</span>
        <span className="text-xl font-black text-white">${totalAmount.toFixed(2)}</span>
      </div>
    </>
  );
}
