import { motion } from "motion/react";
import type { LandingT } from "../landingTypes";

interface Props {
  state: { color: string };
  t: LandingT;
}

export function StateReadMorePhase({ state, t }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="mt-5 pt-5 space-y-5" style={{ borderTop: `1px solid ${state.color}20` }}>
        <h4 className="text-lg font-black" style={{ color: state.color }}>{t("statePhaseReadMoreTitle")}</h4>

        <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreIntro")}</p>
        <div className="space-y-1">
          <p className="text-sm font-bold text-gray-300">{t("statePhaseReadMoreNotBuying")}</p>
          <p className="text-sm font-bold text-gray-300">{t("statePhaseReadMoreNotSelling")}</p>
          <p className="text-sm font-bold" style={{ color: state.color }}>{t("statePhaseReadMoreTransitioning")}</p>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreTraditional")}</p>
        <p className="text-sm font-bold" style={{ color: state.color }}>{t("statePhaseReadMoreChallenge")}</p>

        <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

        <h5 className="text-base font-black text-white">{t("statePhaseReadMoreS2Title")}</h5>
        <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreS2Intro")}</p>
        <p className="text-sm text-gray-300 leading-relaxed font-medium italic" style={{ borderLeft: `3px solid ${state.color}`, paddingLeft: 12 }}>
          {t("statePhaseReadMoreS2Sub")}
        </p>
        <div className="space-y-2">
          {["statePhaseReadMoreS2Bullet1", "statePhaseReadMoreS2Bullet2", "statePhaseReadMoreS2Bullet3"].map((key, bi) => (
            <div key={bi} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: state.color }} />
              <span className="text-sm text-gray-300">{t(key)}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreS2Closing")}</p>

        <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

        <h5 className="text-base font-black text-white">{t("statePhaseReadMoreS3Title")}</h5>
        <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreS3P1")}</p>
        <p className="text-sm font-bold" style={{ color: state.color }}>{t("statePhaseReadMoreS3Question")}</p>
        <p className="text-sm text-gray-400">{t("statePhaseReadMoreS3Helps")}</p>
        <div className="space-y-2" style={{ paddingLeft: 4 }}>
          {["statePhaseReadMoreS3Bullet1", "statePhaseReadMoreS3Bullet2", "statePhaseReadMoreS3Bullet3"].map((key, ci) => (
            <div key={ci} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: state.color }} />
              <span className="text-sm text-gray-300">{t(key)}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreS3Closing")}</p>

        <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

        <h5 className="text-base font-black text-white">{t("statePhaseReadMoreS4Title")}</h5>
        <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreS4P1")}</p>
        <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreS4P2")}</p>
        <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreS4P3")}</p>
        <p className="text-sm font-bold" style={{ color: state.color }}>{t("statePhaseReadMoreS4P4")}</p>

        <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

        <h5 className="text-base font-black text-white">{t("statePhaseReadMoreS5Title")}</h5>
        <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreS5P1")}</p>
        <p className="text-sm text-gray-300">{t("statePhaseReadMoreS5P2")}</p>
        <p className="text-sm text-gray-300">{t("statePhaseReadMoreS5P3")}</p>
        <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreS5P4")}</p>

        <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

        <motion.p
          className="text-sm font-black text-center pt-2"
          style={{ color: state.color }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {t("statePhaseReadMoreTagline")}
        </motion.p>
      </div>
    </motion.div>
  );
}
