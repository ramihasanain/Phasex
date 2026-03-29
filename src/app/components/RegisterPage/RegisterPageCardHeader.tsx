import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Logo } from "../Logo";
import type { RegisterWizardValue } from "./useRegisterWizard";

type Props = { w: RegisterWizardValue };

export function RegisterPageCardHeader({ w }: Props) {
  const { t, step, steps, stepColors, currentColor } = w;

  return (
    <>
      <div className="px-8 pt-7 pb-3 text-center">
        <motion.div className="flex justify-center mb-3" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}>
          <div className="relative">
            <Logo className="w-12 h-12 relative z-10" />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: `radial-gradient(circle, ${currentColor}30 0%, transparent 70%)`, filter: "blur(10px)" }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
        <motion.h1
          className="text-2xl font-black mb-1"
          style={{ color: currentColor }}
          animate={{ textShadow: [`0 0 15px ${currentColor}40`, `0 0 30px ${currentColor}60`, `0 0 15px ${currentColor}40`] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          {t("joinTitle")}
        </motion.h1>
        <p className="text-gray-500 text-xs font-medium tracking-wide">{t("joinSub")}</p>
      </div>

      <div className="px-8 pb-5">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => {
            const StepIcon = s.icon;
            const isActive = step === s.id;
            const isCompleted = step > s.id;
            const sColor = stepColors[i];
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    className="w-9 h-9 rounded-full flex items-center justify-center relative"
                    style={{
                      background:
                        isCompleted || isActive ? `linear-gradient(135deg, ${sColor}, ${sColor}aa)` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${isCompleted || isActive ? `${sColor}60` : "rgba(255,255,255,0.06)"}`,
                      boxShadow: isActive ? `0 0 20px ${sColor}40, 0 0 40px ${sColor}15` : "none",
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <StepIcon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-600"}`} />
                    )}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ background: `radial-gradient(circle, ${sColor}30 0%, transparent 70%)` }}
                        animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                  <span className={`text-[9px] mt-1 font-bold tracking-wide ${isActive ? "text-white" : "text-gray-600"}`}>{s.title}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="h-[2px] flex-1 mx-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: sColor, width: isCompleted ? "100%" : "0%" }}
                      animate={{ width: isCompleted ? "100%" : "0%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
