import { useState } from "react";
import { motion } from "motion/react";
import { SectionTitle } from "../section-title/SectionTitle";
import { GlassCard } from "../glass-card/GlassCard";
import { useLanguage } from "@/app/contexts/LanguageContext";
import {
  Activity,
  Gauge,
  Layers,
  Move,
  Navigation,
  Target,
} from "lucide-react";
import PhaseStateCard from "./PhaseStateCard";
import PhaseStateExpandedContent from "./PhaseStateExpandedContent";

type PhaseStateId =
  | "phase"
  | "displacement"
  | "reference"
  | "oscillation"
  | "direction"
  | "envelope";

const stateColors = [
  "#a855f7",
  "#448aff",
  "#00e676",
  "#ff9100",
  "#ff1744",
  "#00bcd4",
];

const PhaseStates = () => {
  const [expandedState, setExpandedState] = useState<number | null>(null);
  const { t } = useLanguage();

  const states: Array<{
    id: PhaseStateId;
    icon: any;
    name: string;
    nameAr: string;
    question: string;
    description: string;
    color: string;
  }> = [
    {
      id: "phase",
      icon: Gauge,
      name: t("statePhaseName"),
      nameAr: t("statePhaseNameAr"),
      question: t("statePhaseQuestion"),
      description: t("statePhaseDesc"),
      color: stateColors[0],
    },
    {
      id: "displacement",
      icon: Move,
      name: t("stateDisplacementName"),
      nameAr: t("stateDisplacementNameAr"),
      question: t("stateDisplacementQuestion"),
      description: t("stateDisplacementDesc"),
      color: stateColors[1],
    },
    {
      id: "reference",
      icon: Target,
      name: t("stateReferenceName"),
      nameAr: t("stateReferenceNameAr"),
      question: t("stateReferenceQuestion"),
      description: t("stateReferenceDesc"),
      color: stateColors[2],
    },
    {
      id: "oscillation",
      icon: Activity,
      name: t("stateOscillationName"),
      nameAr: t("stateOscillationNameAr"),
      question: t("stateOscillationQuestion"),
      description: t("stateOscillationDesc"),
      color: stateColors[3],
    },
    {
      id: "direction",
      icon: Navigation,
      name: t("stateDirectionName"),
      nameAr: t("stateDirectionNameAr"),
      question: t("stateDirectionQuestion"),
      description: t("stateDirectionDesc"),
      color: stateColors[4],
    },
    {
      id: "envelope",
      icon: Layers,
      name: t("stateEnvelopeName"),
      nameAr: t("stateEnvelopeNameAr"),
      question: t("stateEnvelopeQuestion"),
      description: t("stateEnvelopeDesc"),
      color: stateColors[5],
    },
  ];

  return (
    <section id="states" className="py-20 scroll-mt-16 relative z-10">
      <div className="container mx-auto px-4">
        <SectionTitle sub={t("oneMarketFiveStates")}>
          {t("marketLanguage")}
        </SectionTitle>

        <div className="grid gap-4 max-w-5xl mx-auto">
          {states.map((state, i) => (
            <PhaseStateCard
              key={state.id}
              state={state}
              index={i}
              expandedState={expandedState}
              setExpandedState={setExpandedState}
              t={t}
            >
              <PhaseStateExpandedContent
                stateId={state.id}
                isOpen={expandedState === i}
                stateColor={state.color}
                t={t}
              />
            </PhaseStateCard>
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
};

export default PhaseStates;
