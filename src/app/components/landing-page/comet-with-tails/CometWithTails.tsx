import { motion } from "motion/react";
const CometWithTails = ({ c }: { c: any }) => {
  return (
    <motion.div
      key={c.id}
      className="absolute"
      style={{ top: `${c.startY}%` }}
      animate={{ left: ["-10%", "115%"] }}
      transition={{
        duration: c.duration,
        repeat: Infinity,
        ease: "easeIn",
        delay: c.delay,
      }}
    >
      {/* Tail */}
      <div
        className="absolute top-1/2 -translate-y-1/2"
        style={{
          right: c.size / 2,
          width: c.tailLen,
          height: c.size * 0.6,
          background: `linear-gradient(90deg, transparent 0%, ${c.color}10 30%, ${c.color}50 70%, ${c.color} 100%)`,
          borderRadius: "50% 0 0 50%",
          filter: `blur(1px)`,
        }}
      />
      {/* Head */}
      <div
        className="rounded-full relative"
        style={{
          width: c.size,
          height: c.size,
          backgroundColor: "#fff",
          boxShadow: `0 0 ${c.size * 3}px ${c.color}, 0 0 ${c.size * 6}px ${c.color}80, 0 0 ${c.size * 10}px ${c.color}30`,
        }}
      />
    </motion.div>
  );
};

export default CometWithTails;
