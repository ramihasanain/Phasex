import { motion } from "motion/react";
import { GlassCard } from "../glass-card/GlassCard";

type Item = {
  icon: any;
  text: string;
  color: string;
  bg: string;
  iconBg: string;
  iconShadow?: string;
  hoverable?: boolean;
};

export default function PhaseXDifferenceCard({
  glow,
  headerBg,
  headerIcon: HeaderIcon,
  headerIconColor,
  headerAnimate,
  title,
  items,
}: {
  glow: string;
  headerBg: string;
  headerIcon: any;
  headerIconColor: string;
  headerAnimate: {
    animate: any;
    transition: any;
  };
  title: { text: string; color: string };
  items: Item[];
}) {
  return (
    <GlassCard glow={glow} className="p-5 md:p-8 h-full">
      <div className="text-center mb-6">
        <motion.div
          className="inline-flex w-16 h-16 rounded-xl items-center justify-center mb-3"
          style={{ background: headerBg }}
          animate={headerAnimate.animate}
          transition={headerAnimate.transition}
        >
          <HeaderIcon className="w-8 h-8" style={{ color: headerIconColor }} />
        </motion.div>
        <h3 className="text-xl font-black" style={{ color: title.color }}>
          {title.text}
        </h3>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => {
          const Icon = item.icon;
          const Wrapper: any = item.hoverable ? motion.div : "div";
          return (
            <Wrapper
              key={i}
              {...(item.hoverable ? { whileHover: { scale: 1.03 } } : null)}
              className={`flex items-center gap-3 p-3 rounded-xl ${item.hoverable ? "cursor-pointer transition-all" : ""}`}
              style={{ background: item.bg }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: item.iconBg,
                  boxShadow: item.iconShadow,
                }}
              >
                <Icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <p className="text-sm font-bold" style={{ color: item.color }}>
                {item.text}
              </p>
            </Wrapper>
          );
        })}
      </div>
    </GlassCard>
  );
}

