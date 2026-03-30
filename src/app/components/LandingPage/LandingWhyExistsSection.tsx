import { motion } from "motion/react";
import { BarChart3, Brain, Eye, TrendingUp, Zap } from "lucide-react";
import { ACCENT } from "./constants";
import { GlassCard } from "./GlassCard";
import type { LandingT } from "./landingTypes";
import { SectionTitle } from "./SectionTitle";

interface LandingWhyExistsSectionProps {
  t: LandingT;
}

export function LandingWhyExistsSection({ t }: LandingWhyExistsSectionProps) {
  const accent = ACCENT;

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <SectionTitle>{t("whyPhaseXExists")}</SectionTitle>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-5xl mx-auto mb-10">
          <GlassCard glow="#ff1744" className="p-5 md:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex w-14 h-14 rounded-xl items-center justify-center mb-3" style={{ background: "rgba(255,23,68,0.12)" }}>
                <BarChart3 className="w-7 h-7" style={{ color: "#ff1744" }} />
              </div>
              <h3 className="text-2xl font-black text-white">{t("whyChartsFail")}</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: TrendingUp, text: t("candlesticksFragment") },
                { icon: Zap, text: t("indicatorsOverlap") },
                { icon: Brain, text: t("tradersInterpret") },
                { icon: Eye, text: t("decisionsEmotional") },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: "rgba(255,23,68,0.05)" }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,23,68,0.12)" }}>
                      <Icon className="w-4 h-4" style={{ color: "#ff1744" }} />
                    </div>
                    <p className="text-sm text-gray-400 pt-1.5">{item.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
          <GlassCard glow={accent} className="p-6 md:p-10 text-center">
            <p className="text-2xl font-black text-white mb-3">{t("marketsComplex")}</p>
            <p className="text-xl font-light" style={{ color: accent }}>{t("representationShouldntBe")}</p>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
