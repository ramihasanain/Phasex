import { motion } from "motion/react";
import type { RegisterWizardValue } from "./useRegisterWizard";

type Props = { w: RegisterWizardValue };

export function RegisterPageBackdrop({ w }: Props) {
  const { currentColor, particles } = w;

  return (
    <>
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            top: "-20%",
            left: "-10%",
            background: `radial-gradient(circle, ${currentColor}14 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            bottom: "-15%",
            right: "-5%",
            background: `radial-gradient(circle, ${currentColor}10 0%, transparent 70%)`,
            filter: "blur(50px)",
          }}
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: currentColor,
              boxShadow: `0 0 ${4 + p.size * 3}px ${currentColor}`,
            }}
            animate={{ x: [0, p.driftX], y: [0, p.driftY], opacity: [0, 0.6, 0], scale: [0.5, 1.2, 0.2] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "easeOut", delay: p.delay }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${currentColor}05 1px, transparent 1px), linear-gradient(90deg, ${currentColor}05 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </>
  );
}
