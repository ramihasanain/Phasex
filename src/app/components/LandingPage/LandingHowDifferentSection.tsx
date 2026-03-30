import { motion } from "motion/react";
import { Ban, Brain, Eye, Gauge, Shield, Sparkles, Target, TrendingUp, X } from "lucide-react";
import { ACCENT, ACCENT_G } from "./constants";
import { GlassCard } from "./GlassCard";
import type { LandingT } from "./landingTypes";
import { SectionTitle } from "./SectionTitle";

interface LandingHowDifferentSectionProps {
  t: LandingT;
}

export function LandingHowDifferentSection({ t }: LandingHowDifferentSectionProps) {
  const accent = ACCENT;
  const accentG = ACCENT_G;

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <SectionTitle sub={t("notIndicatorsStates")} color="#448aff">
          {t("howPhaseXIsDifferent")}
        </SectionTitle>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5 mb-10">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <GlassCard glow="#ff1744" className="p-5 md:p-8 h-full">
              <div className="text-center mb-6">
                <motion.div
                  className="inline-flex w-16 h-16 rounded-xl items-center justify-center mb-3"
                  style={{ background: "rgba(255,23,68,0.12)" }}
                  animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <X className="w-8 h-8" style={{ color: "#ff1744" }} />
                </motion.div>
                <h3 className="text-xl font-black" style={{ color: "#ff1744" }}>{t("phaseXDoesNot")}</h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: Ban, text: t("tellYouWhatToDo") },
                  { icon: TrendingUp, text: t("giveTradingSignals") },
                  { icon: Brain, text: t("forceInterpretations") },
                  { icon: Target, text: t("makeDecisionsForYou") },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,23,68,0.05)" }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,23,68,0.12)" }}>
                        <Icon className="w-4 h-4" style={{ color: "#ff1744" }} />
                      </div>
                      <p className="text-sm font-bold" style={{ color: "#ff5252" }}>{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <GlassCard glow={accent} className="p-5 md:p-8 h-full">
              <div className="text-center mb-6">
                <motion.div
                  className="inline-flex w-16 h-16 rounded-xl items-center justify-center mb-3"
                  style={{ background: `${accentG}0.12)` }}
                  animate={{ scale: [1, 1.1, 1], rotate: 360 }}
                  transition={{ scale: { duration: 2, repeat: Infinity }, rotate: { duration: 20, repeat: Infinity, ease: "linear" } }}
                >
                  <Eye className="w-8 h-8" style={{ color: accent }} />
                </motion.div>
                <h3 className="text-xl font-black" style={{ color: accent }}>{t("phaseXDoes")}</h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: Eye, text: t("showWhatIsHappening"), c: accent },
                  { icon: Gauge, text: t("revealTrueStates"), c: "#a855f7" },
                  { icon: Shield, text: t("keepYouDecisionMaker"), c: "#448aff" },
                  { icon: Sparkles, text: t("removeTheFog"), c: "#ffc400" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={i} whileHover={{ scale: 1.03 }} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all" style={{ background: `${item.c}06` }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.c}15`, boxShadow: `0 0 10px ${item.c}15` }}>
                        <Icon className="w-4 h-4" style={{ color: item.c }} />
                      </div>
                      <p className="text-sm font-bold" style={{ color: item.c }}>{item.text}</p>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
          <GlassCard glow="#a855f7" className="p-6 md:p-10 text-center">
            <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 3, repeat: Infinity }}>
              <p className="text-2xl font-black text-white mb-3">{t("youRemainDecisionMaker")}</p>
              <p className="text-lg font-light" style={{ color: "#a855f7" }}>{t("phaseXRemovesFog")}</p>
            </motion.div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
