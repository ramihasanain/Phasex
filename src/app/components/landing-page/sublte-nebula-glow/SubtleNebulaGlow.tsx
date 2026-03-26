import { motion } from "motion/react";
const accentG = "rgba(0,229,160,";

const SubtleNebulaGlow = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          top: "-20%",
          left: "-15%",
          background: `radial-gradient(circle, ${accentG}0.04) 0%, transparent 60%)`,
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
          background:
            "radial-gradient(circle, rgba(168,85,247,0.03) 0%, transparent 60%)",
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
          background:
            "radial-gradient(circle, rgba(68,138,255,0.025) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 10, repeat: Infinity, delay: 3 }}
      />
    </div>
  );
};

export default SubtleNebulaGlow;
