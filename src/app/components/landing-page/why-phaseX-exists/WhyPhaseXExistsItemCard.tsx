import { motion } from "motion/react";

type WhyPhaseXExistsItem = {
  id: string;
  icon: any;
  text: string;
};

export default function WhyPhaseXExistsItemCard({
  item,
  index,
}: {
  item: WhyPhaseXExistsItem;
  index: number;
}) {
  const Icon = item.icon;

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start gap-3 p-4 rounded-xl"
      style={{ background: "rgba(255,23,68,0.05)" }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(255,23,68,0.12)" }}
      >
        <Icon className="w-4 h-4" style={{ color: "#ff1744" }} />
      </div>
      <p className="text-sm text-gray-400 pt-1.5">{item.text}</p>
    </motion.div>
  );
}

