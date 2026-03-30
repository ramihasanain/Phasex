import { motion } from "motion/react";
import { Ban, BellOff, HeartOff } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { LandingT } from "./landingTypes";
import { SectionTitle } from "./SectionTitle";

interface LandingWhatIsSectionProps {
  t: LandingT;
}

export function LandingWhatIsSection({ t }: LandingWhatIsSectionProps) {
  return (
    <section id="what-is" className="py-20 scroll-mt-16 relative z-10">
      <div className="container mx-auto px-4">
        <SectionTitle sub={t("isPerceptionPlatform")}>{t("whatIsPhaseX")}</SectionTitle>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto mb-10">
          <GlassCard className="p-6 md:p-10 text-center">
            <p className="text-lg text-gray-300 leading-relaxed mb-4">{t("insteadOfCharts")}</p>
            <p className="text-base text-gray-500">{t("eachStateAnswers")}</p>
          </GlassCard>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            { icon: Ban, text: t("noPredictions"), color: "#ff1744" },
            { icon: BellOff, text: t("noSignals"), color: "#ff9100" },
            { icon: HeartOff, text: t("noEmotionalNoise"), color: "#ff1744" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.05 }}>
                <div className="p-6 rounded-xl text-center" style={{ background: `${item.color}08`, border: `1px solid ${item.color}20` }}>
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}>
                    <Icon className="w-7 h-7 mx-auto mb-3" style={{ color: item.color }} strokeWidth={2.5} />
                  </motion.div>
                  <p className="text-sm font-bold" style={{ color: item.color }}>{item.text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
