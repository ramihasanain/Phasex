import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  Move,
  Circle,
  Square,
  Triangle,
  Type,
  Eraser,
  Pencil,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Ruler,
  Calendar,
  Crosshair,
  Minus,
  DivideSquare,
  Target,
  BarChart3,
  Waves,
  PieChart,
  TrendingDown,
  Lightbulb,
  Ghost,
  Eye,
  Layers,
  Box,
  BarChart2,
  AlignHorizontalJustifyCenter,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

export type DrawingTool =
  | "cursor"
  | "crosshair"
  | "trend-line"
  | "horizontal-line"
  | "vertical-line"
  | "ray"
  | "arrow"
  | "fibonacci"
  | "rectangle"
  | "circle"
  | "triangle"
  | "brush"
  | "text"
  | "emoji"
  | "eraser"
  | "long-position"
  | "short-position"
  | "forecast"
  | "bars-pattern"
  | "ghost-feed"
  | "projection"
  | "anchored-vwap"
  | "fixed-range-volume"
  | "anchored-volume"
  | "price-range"
  | "date-range"
  | "date-price-range";

interface DrawingToolbarProps {
  selectedTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onClear: () => void;
  onExport?: () => void;
  magnetEnabled?: boolean;
  onMagnetToggle?: () => void;
  locked?: boolean;
  onLockToggle?: () => void;
  visible?: boolean;
  onVisibilityToggle?: () => void;
  onClose?: () => void;
}

export function DrawingToolbar({
  selectedTool,
  onToolChange,
  onZoomIn,
  onZoomOut,
  onClear,
  onExport,
  magnetEnabled = false,
  onMagnetToggle,
  locked = false,
  onLockToggle,
  visible = true,
  onVisibilityToggle,
  onClose
}: DrawingToolbarProps) {
  const { language } = useLanguage();
  const isDark = true;
  const isRTL = language === "ar";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "projection", "volume", "measurer", "basic"
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Tool Categories
  const projectionTools = [
    {
      id: "long-position",
      icon: TrendingUp,
      label: isRTL ? "مركز شراء" : "Long Position",
      description: isRTL ? "تحليل مركز شراء" : "Long position analysis"
    },
    {
      id: "short-position",
      icon: TrendingDown,
      label: isRTL ? "مركز بيع" : "Short Position",
      description: isRTL ? "تحليل مركز بيع" : "Short position analysis"
    },
    {
      id: "forecast",
      icon: Lightbulb,
      label: isRTL ? "توقع" : "Forecast",
      description: isRTL ? "توقع حركة السعر" : "Price movement forecast"
    },
    {
      id: "bars-pattern",
      icon: BarChart3,
      label: isRTL ? "نمط الأعمدة" : "Bars Pattern",
      description: isRTL ? "تحليل نمط الأعمدة" : "Bar pattern analysis"
    },
    {
      id: "ghost-feed",
      icon: Ghost,
      label: isRTL ? "تغذية الظل" : "Ghost Feed",
      description: isRTL ? "عرض بيانات سابقة" : "Historical data overlay"
    },
    {
      id: "projection",
      icon: Target,
      label: isRTL ? "إسقاط" : "Projection",
      description: isRTL ? "إسقاط الأسعار" : "Price projection"
    },
  ];

  const volumeTools = [
    {
      id: "anchored-vwap",
      icon: Waves,
      label: isRTL ? "VWAP مثبت" : "Anchored VWAP",
      description: isRTL ? "متوسط السعر المرجح بالحجم" : "Volume weighted average price"
    },
    {
      id: "fixed-range-volume",
      icon: BarChart2,
      label: isRTL ? "ملف حجم ثابت" : "Fixed Range Volume Profile",
      description: isRTL ? "ملف تعريف الحجم لنطاق ثابت" : "Volume profile for fixed range"
    },
    {
      id: "anchored-volume",
      icon: AlignHorizontalJustifyCenter,
      label: isRTL ? "ملف حجم مثبت" : "Anchored Volume Profile",
      description: isRTL ? "ملف تعريف الحجم المثبت" : "Anchored volume profile"
    },
  ];

  const measurerTools = [
    {
      id: "price-range",
      icon: Ruler,
      label: isRTL ? "نطاق السعر" : "Price Range",
      description: isRTL ? "قياس نطاق الأسعار" : "Measure price range"
    },
    {
      id: "date-range",
      icon: Calendar,
      label: isRTL ? "نطاق التاريخ" : "Date Range",
      description: isRTL ? "قياس نطاق التواريخ" : "Measure date range"
    },
    {
      id: "date-price-range",
      icon: Box,
      label: isRTL ? "نطاق التاريخ والسعر" : "Date and Price Range",
      description: isRTL ? "قياس نطاق التاريخ والسعر" : "Measure date and price range"
    },
  ];

  const basicTools = [
    { id: "cursor", icon: Move, label: isRTL ? "مؤشر" : "Cursor" },
    { id: "crosshair", icon: Crosshair, label: isRTL ? "صليب" : "Crosshair" },
    { id: "trend-line", icon: TrendingUp, label: isRTL ? "خط اتجاه" : "Trend Line" },
    { id: "horizontal-line", icon: Minus, label: isRTL ? "خط أفقي" : "Horizontal Line" },
    { id: "vertical-line", icon: DivideSquare, label: isRTL ? "خط عمودي" : "Vertical Line" },
    { id: "ray", icon: ArrowUpRight, label: isRTL ? "شعاع" : "Ray" },
    { id: "arrow", icon: ArrowDownRight, label: isRTL ? "سهم" : "Arrow" },
    { id: "fibonacci", icon: Activity, label: isRTL ? "فيبوناتشي" : "Fibonacci" },
    { id: "rectangle", icon: Square, label: isRTL ? "مستطيل" : "Rectangle" },
    { id: "circle", icon: Circle, label: isRTL ? "دائرة" : "Circle" },
    { id: "triangle", icon: Triangle, label: isRTL ? "مثلث" : "Triangle" },
    { id: "brush", icon: Pencil, label: isRTL ? "فرشاة" : "Brush" },
    { id: "text", icon: Type, label: isRTL ? "نص" : "Text" },
    { id: "eraser", icon: Eraser, label: isRTL ? "ممحاة" : "Eraser" },
  ];

  const ToolItem = ({ tool }: any) => {
    const Icon = tool.icon;
    const isSelected = selectedTool === tool.id;

    return (
      <motion.button
        whileHover={{
          x: isRTL ? -4 : 4
        }}
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

        {/* Tooltip on collapsed */}
        {isCollapsed && (
          <div className={`
            absolute ${isRTL ? "right-full mr-2" : "left-full ml-2"} top-1/2 -translate-y-1/2
            px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap
            ${isDark ? "bg-gray-900 text-white border border-gray-700" : "bg-gray-800 text-white"}
            opacity-0 group-hover:opacity-100 transition-all duration-200
            pointer-events-none z-[110] shadow-xl
          `}>
            {tool.label}
            {tool.description && (
              <div className="text-[10px] text-gray-400 mt-1">{tool.description}</div>
            )}
          </div>
        )}
      </motion.button>
    );
  };

  const SectionTitle = ({ title }: { title: string }) => (
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

  return (
    <>
      {/* No backdrop — toolbar should NOT block chart interaction */}

      <motion.div
        initial={{ x: isRTL ? 300 : -300 }}
        animate={{
          x: 0,
          width: isCollapsed ? "48px" : "190px"
        }}
        exit={{ x: isRTL ? 300 : -300, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`
          absolute ${isRTL ? "right-0" : "left-0"} top-0 h-full z-[100]
          ${isDark
            ? "bg-gradient-to-b from-gray-900/98 via-gray-900/98 to-gray-800/98 border-gray-700"
            : "bg-white/98 border-gray-200"
          }
          border-${isRTL ? "l" : "r"} shadow-2xl backdrop-blur-md
          flex flex-col
        `}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header with collapse button */}
        <div className={`
          flex items-center justify-between gap-2 p-3 border-b
          ${isDark ? "border-gray-700" : "border-gray-200"}
        `}>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 flex-1"
              >
                <Layers className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
                <h2 className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {isRTL ? "أدوات الرسم" : "Drawing Tools"}
                </h2>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`
                p-1.5 rounded-lg transition-colors
                ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}
              `}
              title={isCollapsed ? (isRTL ? "توسيع" : "Expand") : (isRTL ? "طي" : "Collapse")}
            >
              {isCollapsed ? (
                isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
              ) : (
                isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
              )}
            </motion.button>

            {onClose && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`
                  p-1.5 rounded-lg transition-colors
                  ${isDark
                    ? "hover:bg-red-900/30 text-gray-400 hover:text-red-400"
                    : "hover:bg-red-50 text-gray-600 hover:text-red-600"
                  }
                `}
                title={isRTL ? "إغلاق (ESC)" : "Close (ESC)"}
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Scrollable Tools */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Projection Section */}
          {!isCollapsed && (
            <div className="py-2">
              <SectionTitle title={isRTL ? "الإسقاط" : "PROJECTION"} />
              <div className="space-y-1 px-2">
                {projectionTools.map((tool) => (
                  <ToolItem key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          )}

          {/* Volume-Based Section */}
          {!isCollapsed && (
            <div className="py-2">
              <SectionTitle title={isRTL ? "على أساس الحجم" : "VOLUME-BASED"} />
              <div className="space-y-1 px-2">
                {volumeTools.map((tool) => (
                  <ToolItem key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          )}

          {/* Measurer Section */}
          {!isCollapsed && (
            <div className="py-2">
              <SectionTitle title={isRTL ? "القياس" : "MEASURER"} />
              <div className="space-y-1 px-2">
                {measurerTools.map((tool) => (
                  <ToolItem key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          {!isCollapsed && (
            <div className={`my-2 mx-3 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`} />
          )}

          {/* Basic Drawing Tools */}
          {!isCollapsed && (
            <div className="py-2">
              <SectionTitle title={isRTL ? "الأدوات الأساسية" : "BASIC TOOLS"} />
              <div className="space-y-1 px-2">
                {basicTools.map((tool) => (
                  <ToolItem key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          )}

          {/* Collapsed View - Show Only Icons */}
          {isCollapsed && (
            <div className="py-3 px-2 space-y-2">
              {/* Show only selected categories in collapsed mode */}
              {[...projectionTools, ...volumeTools, ...measurerTools, ...basicTools].map((tool) => {
                const Icon = tool.icon;
                const isSelected = selectedTool === tool.id;

                // Show only first 8 tools or selected tool
                const allTools = [...projectionTools, ...volumeTools, ...measurerTools, ...basicTools];
                const toolIndex = allTools.findIndex(t => t.id === tool.id);

                if (!isSelected && toolIndex > 7) return null;

                return (
                  <motion.button
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

                    {/* Tooltip */}
                    <div className={`
                      absolute ${isRTL ? "right-full mr-2" : "left-full ml-2"} top-1/2 -translate-y-1/2
                      px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap
                      ${isDark ? "bg-gray-900 text-white border border-gray-700" : "bg-gray-800 text-white"}
                      opacity-0 group-hover:opacity-100 transition-all duration-200
                      pointer-events-none z-[110] shadow-xl
                    `}>
                      {tool.label}
                      {(tool as any).description && (
                        <div className="text-[10px] text-gray-400 mt-1">{(tool as any).description}</div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`
                p-3 border-t ${isDark ? "border-gray-700" : "border-gray-200"}
                space-y-2
              `}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClear();
                  if ((window as any).__clearDrawings) {
                    (window as any).__clearDrawings();
                  }
                }}
                className={`
                  w-full py-2 px-3 rounded-lg text-sm font-semibold
                  ${isDark
                    ? "bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800"
                    : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                  }
                  flex items-center justify-center gap-2
                `}
              >
                <Eraser className="w-4 h-4" />
                {isRTL ? "مسح الكل" : "Clear All"}
              </motion.button>

              {onExport && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onExport}
                  className={`
                    w-full py-2 px-3 rounded-lg text-sm font-semibold
                    bg-gradient-to-r from-indigo-600 to-purple-600
                    hover:from-indigo-700 hover:to-purple-700
                    text-white shadow-lg
                    flex items-center justify-center gap-2
                  `}
                >
                  <Eye className="w-4 h-4" />
                  {isRTL ? "حفظ" : "Export"}
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Footer */}
        <AnimatePresence mode="wait">
          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`
                p-2 border-t ${isDark ? "border-gray-700" : "border-gray-200"}
                space-y-2 flex flex-col items-center
              `}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  onClear();
                  if ((window as any).__clearDrawings) {
                    (window as any).__clearDrawings();
                  }
                }}
                className={`
                  p-2 rounded-lg
                  ${isDark
                    ? "bg-red-900/30 hover:bg-red-900/50 text-red-400"
                    : "bg-red-50 hover:bg-red-100 text-red-600"
                  }
                `}
                title={isRTL ? "مسح الكل" : "Clear All"}
              >
                <Eraser className="w-4 h-4" />
              </motion.button>

              {onExport && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onExport}
                  className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                  title={isRTL ? "حفظ" : "Export"}
                >
                  <Eye className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Scrollbar */}
        <style dangerouslySetInnerHTML={{
          __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)'};
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${isDark ? 'rgba(99, 102, 241, 0.5)' : 'rgba(99, 102, 241, 0.4)'};
          }
        `}} />
      </motion.div>
    </>
  );
}