import type { Dispatch, SetStateAction } from "react";
import { motion } from "motion/react";
import type { MarketStateItem } from "./buildMarketStates";
import { GlassCard } from "./GlassCard";
import type { LandingT } from "./landingTypes";
import { MarketStateRow } from "./MarketStateRow";
import { SectionTitle } from "./SectionTitle";

interface LandingMarketStatesSectionProps {
  states: MarketStateItem[];
  expandedState: number | null;
  setExpandedState: Dispatch<SetStateAction<number | null>>;
  t: LandingT;
}

export function LandingMarketStatesSection({ states, expandedState, setExpandedState, t }: LandingMarketStatesSectionProps) {
  return (
    <section id="states" className="py-20 scroll-mt-16 relative z-10">
      <div className="container mx-auto px-4">
        <SectionTitle sub={t("oneMarketFiveStates")}>{t("marketLanguage")}</SectionTitle>

        <div className="grid gap-4 max-w-5xl mx-auto">
          {states.map((state, i) => (
            <MarketStateRow
              key={i}
              state={state}
              index={i}
              expandedState={expandedState}
              setExpandedState={setExpandedState}
              t={t}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mt-10"
        >
          <GlassCard glow="#a855f7" className="p-8 text-center">
            <p className="text-lg font-bold" style={{ color: "#a855f7" }}>
              {t("togetherCompleteSystem")}
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
