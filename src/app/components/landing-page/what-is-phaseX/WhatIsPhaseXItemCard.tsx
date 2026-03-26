import { motion } from "motion/react";

type WhatIsPhaseXItem = {
  id: string;
  icon: any;
  text: string;
  color: string;
};

export default function WhatIsPhaseXItemCard({
  item,
  index,
}: {
  item: WhatIsPhaseXItem;
  index: number;
}) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <div
        className="p-6 rounded-xl text-center"
        style={{
          background: `${item.color}08`,
          border: `1px solid ${item.color}20`,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: index * 0.5,
          }}
        >
          <Icon
            className="w-7 h-7 mx-auto mb-3"
            style={{ color: item.color }}
            strokeWidth={2.5}
          />
        </motion.div>
        <p className="text-sm font-bold" style={{ color: item.color }}>
          {item.text}
        </p>
      </div>
    </motion.div>
  );
}

