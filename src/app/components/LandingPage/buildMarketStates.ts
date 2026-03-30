import type { LucideIcon } from "lucide-react";
import { Activity, Gauge, Layers, Move, Navigation, Target } from "lucide-react";

const stateColors = ["#a855f7", "#448aff", "#00e676", "#ff9100", "#ff1744", "#00bcd4"];

export interface MarketStateItem {
  icon: LucideIcon;
  name: string;
  nameAr: string;
  question: string;
  description: string;
  color: string;
}

export function buildMarketStates(t: (key: string) => string): MarketStateItem[] {
  return [
    {
      icon: Gauge,
      name: t("statePhaseName"),
      nameAr: t("statePhaseNameAr"),
      question: t("statePhaseQuestion"),
      description: t("statePhaseDesc"),
      color: stateColors[0],
    },
    {
      icon: Move,
      name: t("stateDisplacementName"),
      nameAr: t("stateDisplacementNameAr"),
      question: t("stateDisplacementQuestion"),
      description: t("stateDisplacementDesc"),
      color: stateColors[1],
    },
    {
      icon: Target,
      name: t("stateReferenceName"),
      nameAr: t("stateReferenceNameAr"),
      question: t("stateReferenceQuestion"),
      description: t("stateReferenceDesc"),
      color: stateColors[2],
    },
    {
      icon: Activity,
      name: t("stateOscillationName"),
      nameAr: t("stateOscillationNameAr"),
      question: t("stateOscillationQuestion"),
      description: t("stateOscillationDesc"),
      color: stateColors[3],
    },
    {
      icon: Navigation,
      name: t("stateDirectionName"),
      nameAr: t("stateDirectionNameAr"),
      question: t("stateDirectionQuestion"),
      description: t("stateDirectionDesc"),
      color: stateColors[4],
    },
    {
      icon: Layers,
      name: t("stateEnvelopeName"),
      nameAr: t("stateEnvelopeNameAr"),
      question: t("stateEnvelopeQuestion"),
      description: t("stateEnvelopeDesc"),
      color: stateColors[5],
    },
  ];
}
