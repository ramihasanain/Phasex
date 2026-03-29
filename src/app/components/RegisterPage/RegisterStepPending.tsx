import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { RegisterWizardValue } from "./useRegisterWizard";

type Props = { w: RegisterWizardValue };

export function RegisterStepPending({ w }: Props) {
  const { t, onRegister } = w;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-10 text-center">
      <motion.div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6 relative"
        style={{ background: `linear-gradient(135deg, rgba(0,229,160,0.2) 0%, transparent 100%)` }}
      >
        <motion.div
          className="absolute inset-0 border-4 rounded-full border-t-[#00e5a0] border-r-transparent border-b-[#00e5a0] border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <Check size={44} color="#00e5a0" />
      </motion.div>
      <h2 className="text-2xl font-black mb-3 text-white">{t("verificationPending")}</h2>
      <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed font-medium mb-6">{t("verificationPendingDescOnboard")}</p>
      <motion.button
        onClick={onRegister}
        className="px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm text-black"
        style={{ background: "#00e5a0", boxShadow: "0 10px 30px rgba(0,229,160,0.3)" }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {t("gotIt")}
      </motion.button>
    </motion.div>
  );
}
