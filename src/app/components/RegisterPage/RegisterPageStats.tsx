import { motion } from "motion/react";
import { Rocket, Star, Trophy } from "lucide-react";
import type { RegisterWizardValue } from "./useRegisterWizard";

type Props = { w: RegisterWizardValue };

export function RegisterPageStats({ w }: Props) {
  const { step, isRTL, currentColor } = w;

  if (step > 2) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-5 grid grid-cols-3 gap-3">
      {[
        { icon: Rocket, text: "10,000+", label: isRTL ? "متداول" : "Traders" },
        { icon: Star, text: "4.9/5", label: isRTL ? "تقييم" : "Rating" },
        { icon: Trophy, text: "50+", label: isRTL ? "سوق" : "Markets" },
      ].map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, borderColor: `${currentColor}30` }}
            className="p-3 rounded-xl text-center"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <Icon className="w-4 h-4 mx-auto mb-1" style={{ color: currentColor }} />
            <p className="font-black text-sm text-white">{stat.text}</p>
            <p className="text-[10px] text-gray-500 font-medium">{stat.label}</p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
