import { motion } from "motion/react";

import { BarChart3, Brain, Eye, TrendingUp, Zap } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { SectionTitle } from "../section-title/SectionTitle";
import { GlassCard } from "../glass-card/GlassCard";
import WhyPhaseXExistsItemCard from "./WhyPhaseXExistsItemCard";

const accent = "#00e5a0";

const WhyPhaseXExists = () => {
  const { t } = useLanguage();

  const featureCards = [
    {
      id: "candlesticks-fragment",
      icon: TrendingUp,
      text: t("candlesticksFragment"),
    },
    { id: "indicators-overlap", icon: Zap, text: t("indicatorsOverlap") },
    { id: "traders-interpret", icon: Brain, text: t("tradersInterpret") },
    { id: "decisions-emotional", icon: Eye, text: t("decisionsEmotional") },
  ];

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <SectionTitle>{t("whyPhaseXExists")}</SectionTitle>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mb-10"
        >
          <GlassCard glow="#ff1744" className="p-5 md:p-8">
            <div className="text-center mb-6">
              <div
                className="inline-flex w-14 h-14 rounded-xl items-center justify-center mb-3"
                style={{ background: "rgba(255,23,68,0.12)" }}
              >
                <BarChart3 className="w-7 h-7" style={{ color: "#ff1744" }} />
              </div>
              <h3 className="text-2xl font-black text-white">
                {t("whyChartsFail")}
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {featureCards.map((item, i) => (
                <WhyPhaseXExistsItemCard key={item.id} item={item} index={i} />
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <GlassCard glow={accent} className="p-6 md:p-10 text-center">
            <p className="text-2xl font-black text-white mb-3">
              {t("marketsComplex")}
            </p>
            <p className="text-xl font-light" style={{ color: accent }}>
              {t("representationShouldntBe")}
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyPhaseXExists;
