import { motion } from "motion/react";
import { ArrowRight, ArrowLeft, Loader2, Send, CircleCheck } from "lucide-react";
import type { RegisterWizardValue } from "./useRegisterWizard";

type Props = { w: RegisterWizardValue };

export function RegisterWizardNav({ w }: Props) {
  const { step, setStep, isRTL, onBackToLogin, handleNext, handleConfirmPayment, apiLoading, currentColor, accent, accentG } = w;

  if (!(step <= 2 || (step >= 4 && step <= 5))) return null;

  return (
    <div className="flex gap-3 mt-6">
      {step > 1 && step <= 2 && (
        <motion.button
          type="button"
          onClick={() => setStep(step - 1)}
          className="flex-1 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
          style={{ background: "rgba(255,255,255,0.03)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.08)" }}
          whileHover={{ background: "rgba(255,255,255,0.06)", scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className={`w-4 h-4 transition-transform ${isRTL ? "rotate-180" : ""}`} />
          {isRTL ? "رجوع" : "Back"}
        </motion.button>
      )}

      {step === 4 && (
        <motion.button
          type="button"
          onClick={() => setStep(3)}
          className="flex-1 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
          style={{ background: "rgba(255,255,255,0.03)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.08)" }}
          whileHover={{ background: "rgba(255,255,255,0.06)", scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className={`w-4 h-4 transition-transform ${isRTL ? "rotate-180" : ""}`} />
          {isRTL ? "رجوع" : "Back"}
        </motion.button>
      )}

      {step === 1 && (
        <motion.button
          type="button"
          onClick={onBackToLogin}
          className="flex-1 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
          style={{ background: "rgba(255,255,255,0.03)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.08)" }}
          whileHover={{ background: "rgba(255,255,255,0.06)", scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isRTL ? "لديك حساب؟" : "Have Account?"}
        </motion.button>
      )}

      {step < 3 ? (
        <motion.button
          type="button"
          onClick={handleNext}
          disabled={apiLoading}
          className="flex-1 py-3.5 rounded-xl text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer disabled:opacity-60"
          style={{
            background: `linear-gradient(135deg, ${currentColor}, ${currentColor}cc)`,
            color: "#060a10",
            boxShadow: `0 8px 30px ${currentColor}30`,
          }}
          whileHover={!apiLoading ? { scale: 1.02, boxShadow: `0 12px 40px ${currentColor}40` } : {}}
          whileTap={!apiLoading ? { scale: 0.98 } : {}}
        >
          {apiLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isRTL ? "جاري التسجيل..." : "Registering..."}
            </>
          ) : (
            <>
              {isRTL ? "التالي" : "Next"}
              <ArrowRight className={`w-4 h-4 transition-transform ${isRTL ? "rotate-180" : ""}`} />
            </>
          )}
          {!apiLoading && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
              animate={{ left: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
            />
          )}
        </motion.button>
      ) : step === 4 ? (
        <motion.button
          type="button"
          onClick={() => setStep(5)}
          className="flex-1 py-3.5 rounded-xl text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer"
          style={{
            background: `linear-gradient(135deg, #facc15, #f59e0b)`,
            color: "#060a10",
            boxShadow: `0 8px 30px rgba(250,204,21,0.3)`,
          }}
          whileHover={{ scale: 1.02, boxShadow: `0 12px 40px rgba(250,204,21,0.4)` }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
            animate={{ left: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
          />
          <Send className="w-4 h-4" />
          {isRTL ? "متابعة الدفع" : "Proceed to Pay"}
        </motion.button>
      ) : step === 5 ? (
        <motion.button
          type="button"
          onClick={handleConfirmPayment}
          className="flex-1 py-3.5 rounded-xl text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer"
          style={{
            background: `linear-gradient(135deg, ${accent}, #00c890)`,
            color: "#060a10",
            boxShadow: `0 8px 30px ${accentG}0.3)`,
          }}
          whileHover={{ scale: 1.02, boxShadow: `0 12px 40px ${accentG}0.4)` }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
            animate={{ left: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
          />
          <CircleCheck className="w-4 h-4" />
          {isRTL ? "أؤكد تحويل المبلغ" : "Confirm Payment Sent"}
        </motion.button>
      ) : null}
    </div>
  );
}
