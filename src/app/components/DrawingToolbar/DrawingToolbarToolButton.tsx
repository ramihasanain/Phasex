import { motion, AnimatePresence } from "motion/react";
import type { DrawingTool } from "./types";
import type { ToolbarToolItem } from "./types";

type Props = {
  tool: ToolbarToolItem;
  selectedTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  isCollapsed: boolean;
  isDark: boolean;
  isRTL: boolean;
};

export function DrawingToolbarToolButton({
  tool,
  selectedTool,
  onToolChange,
  isCollapsed,
  isDark,
  isRTL,
}: Props) {
  const Icon = tool.icon;
  const isSelected = selectedTool === tool.id;

  return (
    <motion.button
      type="button"
      whileHover={{ x: isRTL ? -4 : 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onToolChange(tool.id as DrawingTool)}
      className={`
          w-full flex items-center gap-3 px-3 py-2 text-sm transition-all
          ${isRTL ? "flex-row-reverse text-right" : "text-left"}
          ${isSelected
            ? isDark
              ? "bg-indigo-600 text-white"
              : "bg-indigo-500 text-white"
            : isDark
              ? "text-gray-300 hover:text-white hover:bg-indigo-600/10"
              : "text-gray-700 hover:text-gray-900 hover:bg-indigo-500/5"
          }
          rounded-lg group relative
        `}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-white" : ""}`} />
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="font-medium whitespace-nowrap overflow-hidden"
          >
            {tool.label}
          </motion.span>
        )}
      </AnimatePresence>

      {isCollapsed && (
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
      )}
    </motion.button>
  );
}
