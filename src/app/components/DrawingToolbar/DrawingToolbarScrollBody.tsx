import { motion, AnimatePresence } from "motion/react";
import { DrawingToolbarToolButton } from "./DrawingToolbarToolButton";
import type { DrawingTool, ToolbarToolItem } from "./types";

type Lists = {
  projectionTools: ToolbarToolItem[];
  volumeTools: ToolbarToolItem[];
  measurerTools: ToolbarToolItem[];
  basicTools: ToolbarToolItem[];
};

type Props = {
  isCollapsed: boolean;
  isDark: boolean;
  isRTL: boolean;
  lists: Lists;
  selectedTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
};

function SectionTitle({ title, isCollapsed, isDark, isRTL }: { title: string; isCollapsed: boolean; isDark: boolean; isRTL: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className={`
            px-3 py-2 text-[10px] font-bold tracking-wider
            ${isDark ? "text-gray-500" : "text-gray-400"}
            uppercase
            ${isRTL ? "text-right" : "text-left"}
          `}
        >
          {title}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DrawingToolbarScrollBody({
  isCollapsed,
  isDark,
  isRTL,
  lists,
  selectedTool,
  onToolChange,
}: Props) {
  const { projectionTools, volumeTools, measurerTools, basicTools } = lists;
  const allTools = [...projectionTools, ...volumeTools, ...measurerTools, ...basicTools];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {!isCollapsed && (
        <>
          <div className="py-2">
            <SectionTitle title={isRTL ? "الإسقاط" : "PROJECTION"} isCollapsed={isCollapsed} isDark={isDark} isRTL={isRTL} />
            <div className="space-y-1 px-2">
              {projectionTools.map((tool) => (
                <DrawingToolbarToolButton
                  key={tool.id}
                  tool={tool}
                  selectedTool={selectedTool}
                  onToolChange={onToolChange}
                  isCollapsed={isCollapsed}
                  isDark={isDark}
                  isRTL={isRTL}
                />
              ))}
            </div>
          </div>

          <div className="py-2">
            <SectionTitle title={isRTL ? "على أساس الحجم" : "VOLUME-BASED"} isCollapsed={isCollapsed} isDark={isDark} isRTL={isRTL} />
            <div className="space-y-1 px-2">
              {volumeTools.map((tool) => (
                <DrawingToolbarToolButton
                  key={tool.id}
                  tool={tool}
                  selectedTool={selectedTool}
                  onToolChange={onToolChange}
                  isCollapsed={isCollapsed}
                  isDark={isDark}
                  isRTL={isRTL}
                />
              ))}
            </div>
          </div>

          <div className="py-2">
            <SectionTitle title={isRTL ? "القياس" : "MEASURER"} isCollapsed={isCollapsed} isDark={isDark} isRTL={isRTL} />
            <div className="space-y-1 px-2">
              {measurerTools.map((tool) => (
                <DrawingToolbarToolButton
                  key={tool.id}
                  tool={tool}
                  selectedTool={selectedTool}
                  onToolChange={onToolChange}
                  isCollapsed={isCollapsed}
                  isDark={isDark}
                  isRTL={isRTL}
                />
              ))}
            </div>
          </div>

          <div className={`my-2 mx-3 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`} />

          <div className="py-2">
            <SectionTitle title={isRTL ? "الأدوات الأساسية" : "BASIC TOOLS"} isCollapsed={isCollapsed} isDark={isDark} isRTL={isRTL} />
            <div className="space-y-1 px-2">
              {basicTools.map((tool) => (
                <DrawingToolbarToolButton
                  key={tool.id}
                  tool={tool}
                  selectedTool={selectedTool}
                  onToolChange={onToolChange}
                  isCollapsed={isCollapsed}
                  isDark={isDark}
                  isRTL={isRTL}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {isCollapsed && (
        <div className="py-3 px-2 space-y-2">
          {allTools.map((tool) => {
            const Icon = tool.icon;
            const isSelected = selectedTool === tool.id;
            const toolIndex = allTools.findIndex((t) => t.id === tool.id);
            if (!isSelected && toolIndex > 7) return null;

            return (
              <motion.button
                type="button"
                key={tool.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onToolChange(tool.id as DrawingTool)}
                className={`
                      w-full p-2.5 rounded-lg transition-all relative group
                      ${isSelected
                        ? isDark
                          ? "bg-indigo-600 text-white"
                          : "bg-indigo-500 text-white"
                        : isDark
                          ? "text-gray-400 hover:text-white hover:bg-gray-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }
                    `}
              >
                <Icon className="w-5 h-5 mx-auto" />
                <div
                  className={`
                      absolute ${isRTL ? "right-full mr-2" : "left-full ml-2"} top-1/2 -translate-y-1/2
                      px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap
                      ${isDark ? "bg-gray-900 text-white border border-gray-700" : "bg-gray-800 text-white"}
                      opacity-0 group-hover:opacity-100 transition-all duration-200
                      pointer-events-none z-[110] shadow-xl
                    `}
                >
                  {tool.label}
                  {tool.description && <div className="text-[10px] text-gray-400 mt-1">{tool.description}</div>}
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
