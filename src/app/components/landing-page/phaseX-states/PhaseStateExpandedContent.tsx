import { AnimatePresence, motion } from "motion/react";
import { Divider } from "./Divider";
import { BulletList } from "./BulletList";
import { Tagline } from "./TagLine";
import { Block, PhaseStateExpandedContentProps, PhaseStateId } from "./types";
import { STATE_CONFIG } from "./utils/stateConfig";

function renderBlock({
  block,
  color,
  t,
}: {
  block: Block;
  color: string;
  t: (key: string) => string;
}) {
  switch (block.type) {
    case "title": {
      if (block.level === 4) {
        return (
          <h4 className="text-lg font-black" style={{ color }}>
            {t(block.textKey)}
          </h4>
        );
      }
      return (
        <h5 className="text-base font-black text-white">{t(block.textKey)}</h5>
      );
    }
    case "text":
      return (
        <p className="text-sm text-gray-400 leading-relaxed">
          {t(block.textKey)}
        </p>
      );
    case "textBoldGray":
      return (
        <p className="text-sm font-bold text-gray-300">{t(block.textKey)}</p>
      );
    case "textBoldColor":
      return (
        <p className="text-sm font-bold" style={{ color }}>
          {t(block.textKey)}
        </p>
      );
    case "textGray":
      return (
        <p
          className={
            block.tone === 300
              ? "text-sm text-gray-300"
              : "text-sm text-gray-400"
          }
        >
          {t(block.textKey)}
        </p>
      );
    case "italicQuote":
      return (
        <p
          className="text-sm text-gray-300 leading-relaxed font-medium italic"
          style={{
            borderLeft: `3px solid ${color}`,
            paddingLeft: 12,
          }}
        >
          {t(block.textKey)}
        </p>
      );
    case "bullets": {
      const list = (
        <BulletList
          keys={block.keys}
          variant={block.variant}
          color={color}
          t={t}
        />
      );
      return block.indentLeft ? (
        <div className="space-y-2" style={{ paddingLeft: 4 }}>
          {list}
        </div>
      ) : (
        list
      );
    }
    case "divider":
      return <Divider color={color} />;
    case "tagline":
      return <Tagline textKey={block.textKey} color={color} t={t} />;
    default:
      return null;
  }
}

export default function PhaseStateExpandedContent({
  stateId,
  isOpen,
  stateColor,
  t,
}: PhaseStateExpandedContentProps) {
  const { blocks, containerClassName } = STATE_CONFIG[stateId];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div
            className="mt-5 pt-5"
            style={{
              borderTop: `1px solid ${stateColor}20`,
            }}
          >
            <div className={containerClassName}>
              {blocks.map((block, idx) => (
                <div key={`${block.type}-${idx}`}>
                  {renderBlock({ block, color: stateColor, t })}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
