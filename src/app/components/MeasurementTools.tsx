import { useState } from "react";
import { motion } from "motion/react";
import { Ruler, Percent, Hash, TrendingUp, Calculator } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

interface MeasurementInfo {
  priceDiff: number;
  percentage: number;
  candleCount: number;
  points: number;
  startPrice: number;
  endPrice: number;
}

interface MeasurementToolsProps {
  visible: boolean;
  measurement: MeasurementInfo | null;
}

export function MeasurementTools({ visible, measurement }: MeasurementToolsProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isDark = theme === "dark";
  const isRTL = language === "ar";
  const [isMinimized, setIsMinimized] = useState(false);

  if (!visible || !measurement) return null;

  const tools = [
    {
      icon: Ruler,
      label: isRTL ? "المسافة السعرية" : "Price Distance",
      value: measurement.priceDiff.toFixed(4),
      color: "#6366f1",
    },
    {
      icon: Percent,
      label: isRTL ? "النسبة المئوية" : "Percentage",
      value: `${measurement.percentage.toFixed(2)}%`,
      color: measurement.percentage >= 0 ? "#10b981" : "#ef4444",
    },
    {
      icon: Hash,
      label: isRTL ? "عدد الشموع" : "Candles",
      value: measurement.candleCount.toString(),
      color: "#f59e0b",
    },
    {
      icon: TrendingUp,
      label: isRTL ? "النقاط" : "Points",
      value: Math.abs(measurement.points).toString(),
      color: "#8b5cf6",
    },
  ];

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`fixed top-40 right-4 z-30 ${
          isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
        } border rounded-lg shadow-xl p-3`}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMinimized(false)}
          className="w-8 h-8"
        >
          <Calculator className="w-4 h-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-40 ${isRTL ? "left-24" : "right-24"} z-30 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700"
          : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
      } border-2 rounded-xl shadow-2xl overflow-hidden min-w-[280px]`}
    >
      {/* Header */}
      <div
        className={`p-3 ${
          isDark ? "bg-indigo-950/50 border-b border-indigo-800" : "bg-indigo-50 border-b border-indigo-200"
        } flex items-center justify-between`}
      >
        <div className="flex items-center gap-2">
          <Calculator className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
          <span className={`font-bold text-sm ${isDark ? "text-indigo-300" : "text-indigo-700"}`}>
            {isRTL ? "أدوات القياس" : "Measurement Tools"}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)} className="w-7 h-7">
          <Hash className="w-3 h-3" />
        </Button>
      </div>

      {/* Tools Grid */}
      <div className="p-3 space-y-2">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg ${
                isDark ? "bg-gray-800/50" : "bg-white"
              } border ${isDark ? "border-gray-700" : "border-gray-200"} hover:border-opacity-50 transition-all`}
              style={{ borderColor: tool.color + "40" }}
            >
              <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: tool.color + "20" }}
                  >
                    <Icon className="w-4 h-4" style={{ color: tool.color }} />
                  </div>
                  <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {tool.label}
                  </span>
                </div>
                <span
                  className="font-bold text-sm"
                  style={{ color: tool.color }}
                >
                  {tool.value}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Price Info */}
      <div className={`p-3 ${isDark ? "bg-gray-800/30" : "bg-gray-50"} border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
        <div className={`flex justify-between text-xs ${isRTL ? "flex-row-reverse" : ""}`}>
          <span className={isDark ? "text-gray-500" : "text-gray-600"}>
            {isRTL ? "من" : "From"}
          </span>
          <span className={`font-mono ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {measurement.startPrice.toFixed(4)}
          </span>
        </div>
        <div className={`flex justify-between text-xs mt-1 ${isRTL ? "flex-row-reverse" : ""}`}>
          <span className={isDark ? "text-gray-500" : "text-gray-600"}>
            {isRTL ? "إلى" : "To"}
          </span>
          <span className={`font-mono ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {measurement.endPrice.toFixed(4)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
