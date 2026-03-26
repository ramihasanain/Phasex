import { motion } from "motion/react";
import { SectionTitle } from "../section-title/SectionTitle";
import { GlassCard } from "../glass-card/GlassCard";
import { Ban, BellOff, HeartOff } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import WhatIsPhaseXItemCard from "./WhatIsPhaseXItemCard";

const WhatIsPhaseX = () => {
  const { t } = useLanguage();

  const featureCards = [
    { id: "no-predictions", icon: Ban, text: t("noPredictions"), color: "#ff1744" },
    { id: "no-signals", icon: BellOff, text: t("noSignals"), color: "#ff9100" },
    { id: "no-emotional-noise", icon: HeartOff, text: t("noEmotionalNoise"), color: "#ff1744" },
  ];

  return (
    <section id="what-is" className="py-20 scroll-mt-16 relative z-10">
      <div className="container mx-auto px-4">
        <SectionTitle sub={t("isPerceptionPlatform")}>
          {t("whatIsPhaseX")}
        </SectionTitle>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-10"
        >
          <GlassCard className="p-6 md:p-10 text-center">
            <p className="text-lg text-gray-300 leading-relaxed mb-4">
              {t("insteadOfCharts")}
            </p>
            <p className="text-base text-gray-500">{t("eachStateAnswers")}</p>
          </GlassCard>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {featureCards.map((item, i) => (
            <WhatIsPhaseXItemCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIsPhaseX;
