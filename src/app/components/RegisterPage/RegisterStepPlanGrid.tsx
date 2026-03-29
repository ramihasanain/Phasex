import { motion } from "motion/react";
import { Star, Check, CheckCircle2, X } from "lucide-react";
import type { RegisterWizardValue } from "./useRegisterWizard";

type Props = { w: RegisterWizardValue };

export function RegisterStepPlanGrid({ w }: Props) {
  const { isRTL, billingCycle, formData, setFormData, subscriptionTypes, accent, t } = w;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {subscriptionTypes.map((sub) => {
        const Icon = sub.icon;
        const isSelected = formData.subscriptionType === sub.id;
        const price = billingCycle === "yearly" ? sub.priceAnnualTotal : sub.priceMonthly;
        return (
          <motion.button
            key={sub.id}
            type="button"
            onClick={() => setFormData({ ...formData, subscriptionType: sub.id })}
            className={`relative p-4 rounded-2xl transition-all text-left cursor-pointer`}
            style={{
              background: isSelected ? `linear-gradient(135deg, ${sub.color}20 0%, ${sub.color}08 100%)` : "rgba(255,255,255,0.02)",
              border: `1px solid ${isSelected ? `${sub.color}40` : "rgba(255,255,255,0.05)"}`,
              boxShadow: isSelected ? `0 0 30px ${sub.color}15, inset 0 0 20px ${sub.color}05` : "none",
            }}
            whileHover={{ scale: 1.01, boxShadow: `0 0 25px ${sub.color}20` }}
            whileTap={{ scale: 0.99 }}
          >
            {sub.popular && (
              <div className={`absolute -top-2.5 ${isRTL ? "right-3" : "left-3"}`}>
                <div
                  className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider text-black"
                  style={{ background: `linear-gradient(90deg, ${accent}, #00c890)`, boxShadow: `0 0 15px ${accent}50` }}
                >
                  <Star className="w-2.5 h-2.5" />
                  {t("planTraderBadge")}
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: isSelected ? `linear-gradient(135deg, ${sub.color}, ${sub.color}88)` : `${sub.color}15`,
                  border: `1px solid ${sub.color}30`,
                }}
              >
                <Icon className="w-5 h-5" style={{ color: isSelected ? "#fff" : sub.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black text-white leading-tight">{sub.name}</h4>
                <p className="text-[10px] text-gray-500 font-medium leading-snug mt-0.5">{sub.description}</p>
              </div>

              {isSelected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex-shrink-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${sub.color}20`, border: `2px solid ${sub.color}` }}>
                    <Check className="w-3.5 h-3.5" style={{ color: sub.color }} />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-xl font-black" style={{ color: sub.color }}>
                ${price}
              </span>
              <span className="text-[10px] text-gray-500 font-medium">/{billingCycle === "yearly" ? t("perYear") : t("perMonth")}</span>
              {billingCycle === "yearly" && <span className="text-[9px] text-gray-600 line-through ml-1">${sub.priceMonthly * 12}</span>}
            </div>
            {billingCycle === "yearly" && (
              <p className="text-[9px] text-[#00e5a0] font-bold mb-2">
                {t("billedAnnually")} — {isRTL ? `وفّر ${sub.savePercentage}%` : `Save ${sub.savePercentage}%`}
              </p>
            )}

            <div className="h-px w-full mb-2" style={{ background: `linear-gradient(90deg, transparent, ${sub.color}25, transparent)` }} />

            <div className="mb-2">
              <p className="text-[9px] uppercase tracking-widest font-black mb-1.5" style={{ color: sub.color }}>
                {t("chartAccess")}
              </p>
              <div className="space-y-1">
                {sub.charts.map((chart, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full" style={{ background: sub.color }} />
                    <span className="text-[10px] text-gray-300 font-medium">{chart}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px w-full mb-2" style={{ background: `linear-gradient(90deg, transparent, ${sub.color}12, transparent)` }} />

            <div className="mb-2">
              <p className="text-[9px] uppercase tracking-widest font-black mb-1.5" style={{ color: sub.color }}>
                {t("subFeatures")}
              </p>
              <ul className="space-y-0.5">
                {sub.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-[10px]">
                    <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: isSelected ? sub.color : "#4b5563" }} />
                    <span className={isSelected ? "text-gray-300" : "text-gray-500"}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {sub.limitations && sub.limitations.length > 0 && (
              <div className="mb-2">
                <p className="text-[9px] uppercase tracking-widest font-black mb-1.5 text-red-500/70">{t("subLimitations")}</p>
                <ul className="space-y-0.5">
                  {sub.limitations.map((lim, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-[10px]">
                      <X className="w-3 h-3 flex-shrink-0 text-red-500/60" />
                      <span className="text-gray-500">{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
