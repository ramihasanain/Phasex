import { Ban, Brain, Eye, Gauge, Shield, Sparkles, Target, TrendingUp } from "lucide-react";

export function buildDifferenceItems({
  t,
  accent,
}: {
  t: (key: string) => string;
  accent: string;
}) {
  const doesNotItems = [
    {
      icon: Ban,
      text: t("tellYouWhatToDo"),
      color: "#ff5252",
      bg: "rgba(255,23,68,0.05)",
      iconBg: "rgba(255,23,68,0.12)",
    },
    {
      icon: TrendingUp,
      text: t("giveTradingSignals"),
      color: "#ff5252",
      bg: "rgba(255,23,68,0.05)",
      iconBg: "rgba(255,23,68,0.12)",
    },
    {
      icon: Brain,
      text: t("forceInterpretations"),
      color: "#ff5252",
      bg: "rgba(255,23,68,0.05)",
      iconBg: "rgba(255,23,68,0.12)",
    },
    {
      icon: Target,
      text: t("makeDecisionsForYou"),
      color: "#ff5252",
      bg: "rgba(255,23,68,0.05)",
      iconBg: "rgba(255,23,68,0.12)",
    },
  ];

  const doesItems = [
    {
      icon: Eye,
      text: t("showWhatIsHappening"),
      color: accent,
      bg: `${accent}06`,
      iconBg: `${accent}15`,
      iconShadow: `0 0 10px ${accent}15`,
      hoverable: true,
    },
    {
      icon: Gauge,
      text: t("revealTrueStates"),
      color: "#a855f7",
      bg: "#a855f706",
      iconBg: "#a855f715",
      iconShadow: "0 0 10px #a855f715",
      hoverable: true,
    },
    {
      icon: Shield,
      text: t("keepYouDecisionMaker"),
      color: "#448aff",
      bg: "#448aff06",
      iconBg: "#448aff15",
      iconShadow: "0 0 10px #448aff15",
      hoverable: true,
    },
    {
      icon: Sparkles,
      text: t("removeTheFog"),
      color: "#ffc400",
      bg: "#ffc40006",
      iconBg: "#ffc40015",
      iconShadow: "0 0 10px #ffc40015",
      hoverable: true,
    },
  ];

  return { doesNotItems, doesItems };
}

