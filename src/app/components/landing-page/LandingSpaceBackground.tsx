import { motion } from "motion/react";
import { ACCENT_G } from "./constants";

type Star = { id: number; x: number; y: number; size: number; opacity: number; twinkle: number; delay: number };
type WarpStreak = { id: number; y: number; width: number; height: number; duration: number; delay: number; color: string };
type Comet = { id: number; startY: number; duration: number; delay: number; size: number; tailLen: number; color: string };

interface LandingSpaceBackgroundProps {
  stars: Star[];
  warpStreaks: WarpStreak[];
  comets: Comet[];
}

export function LandingSpaceBackground({ stars, warpStreaks, comets }: LandingSpaceBackgroundProps) {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {stars.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
            animate={{ opacity: [s.opacity * 0.3, s.opacity, s.opacity * 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: s.twinkle, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {warpStreaks.map((s) => (
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
            transition={{ duration: s.duration, repeat: Infinity, ease: "linear", delay: s.delay }}
          />
        ))}
      </div>

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {comets.map((c) => (
          <motion.div
            key={c.id}
            className="absolute"
            style={{ top: `${c.startY}%` }}
            animate={{ left: ["-10%", "115%"] }}
            transition={{ duration: c.duration, repeat: Infinity, ease: "easeIn", delay: c.delay }}
          >
            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                right: c.size / 2,
                width: c.tailLen,
                height: c.size * 0.6,
                background: `linear-gradient(90deg, transparent 0%, ${c.color}10 30%, ${c.color}50 70%, ${c.color} 100%)`,
                borderRadius: "50% 0 0 50%",
                filter: "blur(1px)",
              }}
            />
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
        ))}
      </div>

      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(6,10,16,0.4) 70%, rgba(6,10,16,0.8) 100%)",
        }}
      />

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            top: "-20%",
            left: "-15%",
            background: `radial-gradient(circle, ${ACCENT_G}0.04) 0%, transparent 60%)`,
            filter: "blur(100px)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            bottom: "-10%",
            right: "-10%",
            background: "radial-gradient(circle, rgba(168,85,247,0.03) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            top: "50%",
            left: "60%",
            background: "radial-gradient(circle, rgba(68,138,255,0.025) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 3 }}
        />
      </div>
    </>
  );
}
