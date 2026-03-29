import { motion } from "motion/react";
import type { LandingT } from "../landingTypes";

interface Props {
  state: { color: string };
  t: LandingT;
}

export function StateReadMoreReference({ state, t }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="mt-5 pt-5 space-y-4" style={{ borderTop: `1px solid ${state.color}20` }}>
        <h4 className="text-lg font-black" style={{ color: state.color }}>{t("stateReferenceReadMoreTitle")}</h4>

        <p className="text-sm text-gray-300 leading-relaxed font-medium italic" style={{ borderLeft: `3px solid ${state.color}`, paddingLeft: 12 }}>
          {t("stateReferenceReadMoreP1")}
        </p>

        <p className="text-sm text-gray-400 leading-relaxed">{t("stateReferenceReadMoreP2")}</p>
        <p className="text-sm text-gray-400 leading-relaxed">{t("stateReferenceReadMoreP3")}</p>

        <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

        <motion.p
          className="text-sm font-black text-center pt-2"
          style={{ color: state.color }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {t("stateReferenceReadMoreP4")}
        </motion.p>
      </div>
    </motion.div>
  );
}
