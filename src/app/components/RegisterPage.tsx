import { motion } from "motion/react";
import type { RegisterPageProps } from "./RegisterPage/types";
import { useRegisterWizard } from "./RegisterPage/useRegisterWizard";
import { RegisterPageBackdrop } from "./RegisterPage/RegisterPageBackdrop";
import { RegisterPageMain } from "./RegisterPage/RegisterPageMain";

export type { RegisterPageProps, RegisterSubscriptionPlanRow } from "./RegisterPage/types";

export function RegisterPage({ onRegister, onBackToLogin }: RegisterPageProps) {
  const w = useRegisterWizard({ onRegister, onBackToLogin });

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden p-4"
      dir="auto"
      style={{ background: "#060a10", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <RegisterPageBackdrop w={w} />
      <RegisterPageMain w={w} />

      <motion.div className="absolute bottom-4 text-center z-10 left-0 right-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <span className="text-[10px] text-gray-700 tracking-[0.3em] uppercase font-semibold">PHASE X — STRUCTURAL DYNAMICS</span>
      </motion.div>
    </div>
  );
}
