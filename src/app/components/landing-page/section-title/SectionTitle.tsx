import { motion } from "motion/react";
const accent = "#00e5a0";

export const SectionTitle = ({
  children,
  sub,
  color = accent,
}: {
  children: React.ReactNode;
  sub?: string;
  color?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-center mb-14"
  >
    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
      {children}
    </h2>
    {sub && (
      <p className="text-xl md:text-2xl font-light" style={{ color }}>
        {sub}
      </p>
    )}
    <motion.div
      className="h-0.5 w-20 mx-auto mt-5"
      style={{
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      }}
      animate={{ width: ["80px", "160px", "80px"] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
  </motion.div>
);
