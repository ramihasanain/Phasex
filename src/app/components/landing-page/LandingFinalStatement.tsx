import { motion } from "motion/react";
import { ACCENT } from "./constants";
import { GlassCard } from "./GlassCard";
import type { LandingT } from "./landingTypes";

interface LandingFinalStatementProps {
  t: LandingT;
}

export function LandingFinalStatement({ t }: LandingFinalStatementProps) {
  const accent = ACCENT;

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
          <GlassCard className="p-8 md:p-14 text-center space-y-8">
            <div className="space-y-3">
              <p className="text-xl md:text-2xl text-gray-400">{t("marketsDontNeedMoreIndicators")}</p>
              <p className="text-2xl md:text-3xl font-black" style={{ color: accent }}>{t("needBetterRepresentation")}</p>
            </div>
            <div className="h-[1px] w-20 mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
            <div className="space-y-3">
              <p className="text-lg text-gray-500">{t("notAnUpgrade")}</p>
              <p className="text-2xl md:text-3xl font-black" style={{ color: accent }}>{t("isARewrite")}</p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
