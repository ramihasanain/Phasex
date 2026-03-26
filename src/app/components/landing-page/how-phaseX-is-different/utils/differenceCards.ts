import { Eye, X } from "lucide-react";

import PhaseXDifferenceCard from "../PhaseXDifferenceCard";
import type { ComponentProps } from "react";

type Item = {
  icon: any;
  text: string;
  color: string;
  bg: string;
  iconBg: string;
  iconShadow?: string;
  hoverable?: boolean;
};

type CardProps = ComponentProps<typeof PhaseXDifferenceCard>;

export type DifferenceCardConfig = {
  key: string;
  initialX: number;
  cardProps: CardProps;
};

export function buildDifferenceCards({
  t,
  accent,
  accentG,
  doesNotItems,
  doesItems,
}: {
  t: (key: string) => string;
  accent: string;
  accentG: string;
  doesNotItems: Item[];
  doesItems: Item[];
}): DifferenceCardConfig[] {
  return [
    {
      key: "does-not",
      initialX: -30,
      cardProps: {
        glow: "#ff1744",
        headerBg: "rgba(255,23,68,0.12)",
        headerIcon: X,
        headerIconColor: "#ff1744",
        headerAnimate: {
          animate: { rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] },
          transition: { duration: 2, repeat: Infinity },
        },
        title: { text: t("phaseXDoesNot"), color: "#ff1744" },
        items: doesNotItems,
      },
    },
    {
      key: "does",
      initialX: 30,
      cardProps: {
        glow: accent,
        headerBg: `${accentG}0.12)`,
        headerIcon: Eye,
        headerIconColor: accent,
        headerAnimate: {
          animate: { scale: [1, 1.1, 1], rotate: 360 },
          transition: {
            scale: { duration: 2, repeat: Infinity },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          },
        },
        title: { text: t("phaseXDoes"), color: accent },
        items: doesItems,
      },
    },
  ];
}

