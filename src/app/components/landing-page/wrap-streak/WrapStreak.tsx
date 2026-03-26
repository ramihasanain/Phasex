import { motion } from "motion/react";
const WrapStreak = ({ s }: { s: any }) => {
  return (
    <motion.div
      key={s.id}
      className="absolute rounded-full"
      style={{
        top: `${s.y}%`,
        width: s.width,
        height: s.height,
        background: `linear-gradient(90deg, transparent, ${s.color}60, ${s.color}, ${s.color}60, transparent)`,
        boxShadow: `0 0 8px ${s.color}40`,
      }}
      animate={{ left: ["-20%", "120%"] }}
      transition={{
        duration: s.duration,
        repeat: Infinity,
        ease: "linear",
        delay: s.delay,
      }}
    />
  );
};

export default WrapStreak;
