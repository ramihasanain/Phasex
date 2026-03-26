import { motion } from "motion/react";
export function PlatformAccessFeatureCard({
  icon: Icon,
  text,
  color,
  index,
}: {
  icon: any;
  text: string;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      className="p-5 rounded-xl transition-all"
      style={{
        background: `${color}06`,
        border: `1px solid ${color}12`,
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
        style={{
          background: `${color}15`,
          boxShadow: `0 0 15px ${color}15`,
        }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <p className="text-sm font-bold text-white">{text}</p>
    </motion.div>
  );
}
