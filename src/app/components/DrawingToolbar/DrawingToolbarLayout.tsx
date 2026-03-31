import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Eraser, Layers, X } from "lucide-react";
import { DrawingToolbarScrollBody } from "./DrawingToolbarScrollBody";
import { getDrawingToolbarToolLists } from "./drawingToolbarToolLists";
import type { DrawingToolbarProps } from "./types";

type LayoutProps = DrawingToolbarProps & { isRTL: boolean };

export function DrawingToolbarLayout(props: LayoutProps) {
  const { selectedTool, onToolChange, onClear, onClose, isRTL } = props;

  const isDark = true;
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const lists = getDrawingToolbarToolLists(isRTL);

  const runClear = () => {
    onClear();
    if ((window as unknown as { __clearDrawings?: () => void }).__clearDrawings) {
      (window as unknown as { __clearDrawings: () => void }).__clearDrawings();
    }
  };

  return (
    <>
      <motion.div
        initial={{ x: isRTL ? 300 : -300 }}
        animate={{
          x: 0,
          width: isCollapsed ? "48px" : "100%",
        }}
        exit={{ x: isRTL ? 300 : -300, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`
          relative h-full z-[100]
          ${isDark ? "bg-gradient-to-b from-gray-900/98 via-gray-900/98 to-gray-800/98 border-gray-700" : "bg-white/98 border-gray-200"}
          border-${isRTL ? "l" : "r"} shadow-2xl backdrop-blur-md
          flex flex-col
        `}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div
          className={`
          flex items-center justify-between gap-2 p-3 border-b
          ${isDark ? "border-gray-700" : "border-gray-200"}
        `}
        >
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 flex-1">
                <Layers className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
                <h2 className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{isRTL ? "أدوات الرسم" : "Drawing Tools"}</h2>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-1">
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`
                p-1.5 rounded-lg transition-colors
                ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}
              `}
              title={isCollapsed ? (isRTL ? "توسيع" : "Expand") : isRTL ? "طي" : "Collapse"}
            >
              {isCollapsed ? isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" /> : isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </motion.button>

            {onClose && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`
                  p-1.5 rounded-lg transition-colors
                  ${isDark ? "hover:bg-red-900/30 text-gray-400 hover:text-red-400" : "hover:bg-red-50 text-gray-600 hover:text-red-600"}
                `}
                title={isRTL ? "إغلاق (ESC)" : "Close (ESC)"}
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>

        <DrawingToolbarScrollBody
          isCollapsed={isCollapsed}
          isDark={isDark}
          isRTL={isRTL}
          lists={lists}
          selectedTool={selectedTool}
          onToolChange={onToolChange}
        />

        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-3 border-t ${isDark ? "border-gray-700" : "border-gray-200"} space-y-2`}
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={runClear}
                className={`
                  w-full py-2 px-3 rounded-lg text-sm font-semibold
                  ${isDark ? "bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800" : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"}
                  flex items-center justify-center gap-2
                `}
              >
                <Eraser className="w-4 h-4" />
                {isRTL ? "مسح الكل" : "Clear All"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`p-2 border-t ${isDark ? "border-gray-700" : "border-gray-200"} space-y-2 flex flex-col items-center`}
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={runClear}
                className={`
                  p-2 rounded-lg
                  ${isDark ? "bg-red-900/30 hover:bg-red-900/50 text-red-400" : "bg-red-50 hover:bg-red-100 text-red-600"}
                `}
                title={isRTL ? "مسح الكل" : "Clear All"}
              >
                <Eraser className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${isDark ? "rgba(99, 102, 241, 0.3)" : "rgba(99, 102, 241, 0.2)"};
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${isDark ? "rgba(99, 102, 241, 0.5)" : "rgba(99, 102, 241, 0.4)"};
          }
        `,
          }}
        />
      </motion.div>
    </>
  );
}
