import { motion } from "motion/react";
import { useMemo } from "react";

import { useLanguage } from "@/app/contexts/LanguageContext";
import { SectionTitle } from "../section-title/SectionTitle";
import { GlassCard } from "../glass-card/GlassCard";
import PhaseXDifferenceCard from "./PhaseXDifferenceCard";
import { buildDifferenceItems } from "./utils/differenceItems";
import { buildDifferenceCards } from "./utils/differenceCards";

const accent = "#00e5a0";
const accentG = "rgba(0,229,160,";

const HowPhaseXIsDifferent = () => {
  const { t } = useLanguage();
  const { doesNotItems, doesItems } = useMemo(
    () => buildDifferenceItems({ t, accent }),
    [t],
  );

  const cards = useMemo(
    () =>
      buildDifferenceCards({
        t,
        accent,
        accentG,
        doesNotItems,
        doesItems,
      }),
    [t, doesNotItems, doesItems],
  );

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <SectionTitle sub={t("notIndicatorsStates")} color="#448aff">
          {t("howPhaseXIsDifferent")}
        </SectionTitle>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5 mb-10">
          {cards.map((c) => (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, x: c.initialX }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <PhaseXDifferenceCard {...c.cardProps} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <GlassCard glow="#a855f7" className="p-6 md:p-10 text-center">
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <p className="text-2xl font-black text-white mb-3">
                {t("youRemainDecisionMaker")}
              </p>
              <p className="text-lg font-light" style={{ color: "#a855f7" }}>
                {t("phaseXRemovesFog")}
              </p>
            </motion.div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

export default HowPhaseXIsDifferent;
