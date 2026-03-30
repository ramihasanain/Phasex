import { motion } from "motion/react";
import type { LandingT } from "../landingTypes";

interface Props {
  state: { color: string };
  t: LandingT;
}

export function StateReadMoreOscillation({ state, t }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="mt-5 pt-5 space-y-4" style={{ borderTop: `1px solid ${state.color}20` }}>
        <h4 className="text-lg font-black" style={{ color: state.color }}>{t("stateOscillationReadMoreTitle")}</h4>

        <p className="text-sm text-gray-300 leading-relaxed font-medium italic" style={{ borderLeft: `3px solid ${state.color}`, paddingLeft: 12 }}>
          {t("stateOscillationReadMoreP1")}
        </p>

        <p className="text-sm text-gray-400 leading-relaxed">{t("stateOscillationReadMoreP2")}</p>
        <p className="text-sm text-gray-400 leading-relaxed">{t("stateOscillationReadMoreP3")}</p>
        <p className="text-sm font-bold" style={{ color: state.color }}>{t("stateOscillationReadMoreP4")}</p>

        <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

        <p className="text-sm text-gray-400">{t("stateOscillationReadMoreP5")}</p>
        <div className="space-y-2">
          {["stateOscillationReadMoreBullet1", "stateOscillationReadMoreBullet2", "stateOscillationReadMoreBullet3", "stateOscillationReadMoreBullet4"].map((key, bi) => (
            <div key={bi} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: state.color }} />
              <span className="text-sm text-gray-300 font-medium">{t(key)}</span>
            </div>
          ))}
        </div>
        <p className="text-sm font-bold" style={{ color: state.color }}>{t("stateOscillationReadMoreP6")}</p>

        <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

        <p className="text-sm text-gray-400 leading-relaxed">{t("stateOscillationReadMoreP7")}</p>
        <div className="space-y-2" style={{ paddingLeft: 4 }}>
          {["stateOscillationReadMoreBullet5", "stateOscillationReadMoreBullet6", "stateOscillationReadMoreBullet7", "stateOscillationReadMoreBullet8"].map((key, ci) => (
            <div key={ci} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: state.color }} />
              <span className="text-sm text-gray-300">{t(key)}</span>
            </div>
          ))}
        </div>

        <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

        <p className="text-sm text-gray-400 leading-relaxed">{t("stateOscillationReadMoreP8")}</p>
        <p className="text-sm text-gray-400 leading-relaxed">{t("stateOscillationReadMoreP9")}</p>
        <p className="text-sm font-bold" style={{ color: state.color }}>{t("stateOscillationReadMoreP10")}</p>
        <p className="text-sm text-gray-300 leading-relaxed">{t("stateOscillationReadMoreP11")}</p>

        <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

        <motion.p
          className="text-sm font-black text-center pt-2"
          style={{ color: state.color }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {t("stateOscillationReadMoreTagline")}
        </motion.p>
      </div>
    </motion.div>
  );
}
