import { motion } from "motion/react";
import type { RegisterWizardValue } from "./useRegisterWizard";
import { RegisterStepPlanHeader } from "./RegisterStepPlanHeader";
import { RegisterStepPlanGrid } from "./RegisterStepPlanGrid";
import { RegisterStepPlanFooter } from "./RegisterStepPlanFooter";

type Props = { w: RegisterWizardValue };

export function RegisterStepPlan({ w }: Props) {
  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-4">
      <RegisterStepPlanHeader w={w} />
      <RegisterStepPlanGrid w={w} />
      <RegisterStepPlanFooter w={w} />
    </motion.div>
  );
}
