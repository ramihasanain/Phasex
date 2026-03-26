import { motion } from "motion/react";
export const Tagline = ({
  textKey,
  color,
  t,
}: {
  textKey: string;
  color: string;
  t: (key: string) => string;
}) => (
  <motion.p
    className="text-sm font-black text-center pt-2"
    style={{ color }}
    animate={{ scale: [1, 1.02, 1] }}
    transition={{ duration: 3, repeat: Infinity }}
  >
    {t(textKey)}
  </motion.p>
);
