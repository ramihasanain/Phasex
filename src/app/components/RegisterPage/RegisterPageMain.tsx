import { motion, AnimatePresence } from "motion/react";
import { X, AlertCircle } from "lucide-react";
import type { RegisterWizardValue } from "./useRegisterWizard";
import { RegisterPageCardHeader } from "./RegisterPageCardHeader";
import { RegisterStepsEarly } from "./RegisterStepsEarly";
import { RegisterStepPlan } from "./RegisterStepPlan";
import { RegisterStepPayment } from "./RegisterStepPayment";
import { RegisterStepPending } from "./RegisterStepPending";
import { RegisterWizardNav } from "./RegisterWizardNav";
import { RegisterPageStats } from "./RegisterPageStats";

type Props = { w: RegisterWizardValue };

export function RegisterPageMain({ w }: Props) {
  const { step, currentColor, apiError, setApiError } = w;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
      className={`w-full relative z-10 ${step <= 3 ? "max-w-2xl" : "max-w-4xl"}`}
    >
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{
          background: "linear-gradient(160deg, rgba(14,20,33,0.92) 0%, rgba(8,12,22,0.96) 100%)",
          border: `1px solid ${currentColor}18`,
          boxShadow: `0 25px 80px rgba(0,0,0,0.5), 0 0 60px ${currentColor}08, inset 0 1px 0 rgba(255,255,255,0.04)`,
          maxHeight: step === 6 ? "auto" : "85vh",
          overflowY: "auto",
        }}
      >
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] z-30"
          style={{ background: `linear-gradient(90deg, transparent 5%, ${currentColor} 30%, ${currentColor} 70%, transparent 95%)` }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <RegisterPageCardHeader w={w} />

        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-8 mb-3 p-3 rounded-xl flex items-center gap-3"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-xs font-bold text-red-400">{apiError}</p>
            <button onClick={() => setApiError(null)} className="ml-auto text-red-400 hover:text-red-300 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        <div className="px-8 pb-6">
          <AnimatePresence mode="wait">
            {step <= 3 && <RegisterStepsEarly key={step} w={w} />}
            {step === 4 && <RegisterStepPlan key="s3" w={w} />}
            {step === 5 && <RegisterStepPayment key="s4" w={w} />}
            {step === 6 && <RegisterStepPending key="s6" w={w} />}
          </AnimatePresence>

          <RegisterWizardNav w={w} />
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: `linear-gradient(90deg, transparent 10%, ${currentColor}50 40%, ${currentColor}50 60%, transparent 90%)` }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      <RegisterPageStats w={w} />
    </motion.div>
  );
}
