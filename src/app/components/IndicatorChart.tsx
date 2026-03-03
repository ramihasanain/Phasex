import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { Asset } from "./MarketList";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, TrendingDown, Activity, Maximize2, Minimize2, Table, BarChart3, X, Clock, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Layers } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { TZCandlestickChart } from "./TZCandlestickChart";
import { DrawingToolbar, DrawingTool } from "./DrawingToolbar";
import { DrawingCanvas } from "./DrawingCanvas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export interface Indicator {
  id: string;
  name: string;
  nameEn: string;
  type: "line" | "area" | "bar" | "tz";
  color: string;
  icon: string;
}

interface IndicatorChartProps {
  currency: Asset | null;
  indicator: Indicator | null;
  data: any[];
  timeframe: 5 | 15 | 30 | 60;
  onTimeframeChange: (timeframe: 5 | 15 | 30 | 60) => void;
  // Multi-Timeframe props
  mtfEnabled?: boolean;
  mtfSmallTimeframe?: 5 | 15 | 30 | 60;
  mtfLargeTimeframe?: 240 | 720 | 1440;
  onMtfEnabledChange?: (enabled: boolean) => void;
  onMtfSmallTimeframeChange?: (timeframe: 5 | 15 | 30 | 60) => void;
  onMtfLargeTimeframeChange?: (timeframe: 240 | 720 | 1440) => void;
}

export function IndicatorChart({ currency, indicator, data, timeframe, onTimeframeChange, mtfEnabled, mtfSmallTimeframe, mtfLargeTimeframe, onMtfEnabledChange, onMtfSmallTimeframeChange, onMtfLargeTimeframeChange }: IndicatorChartProps) {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const isDark = theme === "dark";
  const isRTL = language === "ar";

  const [isExpanded, setIsExpanded] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [isMtfDialogOpen, setIsMtfDialogOpen] = useState(false); // Multi-Timeframe Dialog
  
  // Chart navigation state
  const [viewWindow, setViewWindow] = useState(30); // عدد النقاط المعروضة في الشارت
  const [startIndex, setStartIndex] = useState(0); // البداية من أقدم نقطة
  
  // Mouse drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartIndex, setDragStartIndex] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Drawing tools state
  const [selectedTool, setSelectedTool] = useState<DrawingTool>("cursor");
  const [magnetEnabled, setMagnetEnabled] = useState(false);
  const [drawingsLocked, setDrawingsLocked] = useState(false);
  const [drawingsVisible, setDrawingsVisible] = useState(true);
  const [drawings, setDrawings] = useState<any[]>([]);
  const [showDrawingTools, setShowDrawingTools] = useState(false);
  
  // Export chart with watermark
  const handleExportChart = async () => {
    if (!chartRef.current || !currency || !indicator) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: isDark ? "#111827" : "#ffffff",
        scale: 2,
        logging: false
      });
      const newCanvas = document.createElement("canvas");
      const watermarkHeight = 80;
      newCanvas.width = canvas.width;
      newCanvas.height = canvas.height + watermarkHeight;
      const ctx = newCanvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = isDark ? "#111827" : "#ffffff";
      ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
      ctx.drawImage(canvas, 0, 0);
      ctx.fillStyle = isDark ? "#1f2937" : "#f3f4f6";
      ctx.fillRect(0, canvas.height, newCanvas.width, watermarkHeight);
      const padding = 30;
      ctx.font = "bold 32px sans-serif";
      const gradient = ctx.createLinearGradient(padding, canvas.height + 40, padding + 200, canvas.height + 40);
      gradient.addColorStop(0, "#6366f1");
      gradient.addColorStop(0.5, "#a855f7");
      gradient.addColorStop(1, "#ec4899");
      ctx.fillStyle = gradient;
      ctx.textBaseline = "middle";
      ctx.fillText("PHASE X", padding, canvas.height + 40);
      const decimals = currency.market === "CRYPTO" || currency.market === "INDEX" ? 2 : 4;
      ctx.font = "bold 24px sans-serif";
      ctx.fillStyle = isDark ? "#ffffff" : "#111827";
      ctx.textAlign = "right";
      ctx.fillText(`${currency.symbol}: ${currency.price.toFixed(decimals)}`, newCanvas.width - padding, canvas.height + 30);
      ctx.font = "18px sans-serif";
      ctx.fillStyle = currency.change >= 0 ? "#10b981" : "#ef4444";
      ctx.fillText(`${currency.change >= 0 ? "+" : ""}${currency.change.toFixed(2)} (${currency.changePercent.toFixed(2)}%)`, newCanvas.width - padding, canvas.height + 55);
      const link = document.createElement("a");
      link.download = `PHASE_X_${currency.symbol}_${indicator.id}_${Date.now()}.png`;
      link.href = newCanvas.toDataURL("image/png");
      link.click();
      alert(isRTL ? "✅ تم الحفظ!" : "✅ Saved!");
    } catch (error) {
      alert(isRTL ? "❌ خطأ" : "❌ Error");
    }
  };
  
  // تحديث البداية عند تغيير البيانات
  useEffect(() => {
    setStartIndex(Math.max(0, data.length - viewWindow));
  }, [data.length]);
  
  // البيانات المعروضة
  const displayedData = data.slice(startIndex, startIndex + viewWindow);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setStartIndex(prev => Math.max(0, prev - 5));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setStartIndex(prev => Math.min(data.length - viewWindow, prev + 5));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setStartIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setStartIndex(Math.max(0, data.length - viewWindow));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data.length, viewWindow]);
  
  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartIndex(startIndex);
    if (chartRef.current) {
      chartRef.current.style.cursor = 'grabbing';
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !chartRef.current) return;
    
    const deltaX = e.clientX - dragStartX;
    const chartWidth = chartRef.current.offsetWidth;
    const dataPointsToMove = Math.round((deltaX / chartWidth) * viewWindow);
    
    const newIndex = Math.max(0, Math.min(data.length - viewWindow, dragStartIndex - dataPointsToMove));
    setStartIndex(newIndex);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    if (chartRef.current) {
      chartRef.current.style.cursor = 'grab';
    }
  };
  
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (chartRef.current) {
        chartRef.current.style.cursor = 'grab';
      }
    }
  };
  
  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 5 : -5;
    const newViewWindow = Math.max(10, Math.min(100, viewWindow + delta));
    setViewWindow(newViewWindow);
    
    // تعديل startIndex للحفاظ على المركز
    const centerRatio = (startIndex + viewWindow / 2) / data.length;
    const newStartIndex = Math.max(0, Math.min(data.length - newViewWindow, Math.round(centerRatio * data.length - newViewWindow / 2)));
    setStartIndex(newStartIndex);
  };

  if (!currency || !indicator) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`h-full flex items-center justify-center min-h-[500px] ${isDark ? "bg-gray-900 border-gray-700" : "bg-white"} shadow-lg border-2`}>
          <CardContent className="text-center">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-4"
            >
              <Activity className={`w-16 h-16 mx-auto ${isDark ? "text-gray-700" : "text-gray-300"}`} />
            </motion.div>
            <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {t("selectAssetAndIndicator")}
            </p>
            <p className={`text-sm mt-2 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
              {isRTL ? "اختر سوق ومؤشر فني لبدء التحليل" : "Choose a market and technical indicator to start analysis"}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const renderChart = () => {
    const commonProps = {
      data: displayedData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    const gridColor = isDark ? "#374151" : "#e5e7eb";
    const textColor = isDark ? "#9ca3af" : "#6b7280";
    const dateColor = isDark ? "#60a5fa" : "#3b82f6";
    
    // Custom Tick Component for intelligent date display
    const CustomXAxisTick = ({ x, y, payload }: any) => {
      const isNewDay = payload.value.includes('\n');
      
      if (isNewDay) {
        const [date, time] = payload.value.split('\n');
        return (
          <g transform={`translate(${x},${y})`}>
            {/* Date (top line) */}
            <text
              x={0}
              y={0}
              dy={-5}
              textAnchor="middle"
              fill={dateColor}
              fontSize="12"
              fontWeight="700"
            >
              {date}
            </text>
            {/* Time (bottom line) */}
            <text
              x={0}
              y={0}
              dy={10}
              textAnchor="middle"
              fill={textColor}
              fontSize="10"
            >
              {time}
            </text>
          </g>
        );
      }
      
      return (
        <g transform={`translate(${x},${y})`}>
          <text
            x={0}
            y={0}
            dy={5}
            textAnchor="middle"
            fill={textColor}
            fontSize="11"
          >
            {payload.value}
          </text>
        </g>
      );
    };
    
    // Custom ReferenceLine for day separators
    const renderDaySeparators = () => {
      const separators = [];
      for (let i = 0; i < displayedData.length; i++) {
        if (displayedData[i].time.includes('\n')) {
          separators.push(
            <ReferenceLine
              key={`day-sep-${i}`}
              x={displayedData[i].time}
              stroke={isDark ? "#4b5563" : "#d1d5db"}
              strokeWidth={2}
              strokeDasharray="5 5"
              opacity={0.5}
            />
          );
        }
      }
      return separators;
    };
    
    // Custom Tooltip
    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-3 rounded-lg border-2 shadow-xl`}>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
              📅 {payload[0].payload.fullTime}
            </p>
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              💰 {isRTL ? 'القيمة:' : 'Value:'} {payload[0].value.toFixed(currency?.market === "CRYPTO" || currency?.market === "INDEX" ? 2 : 4)}
            </p>
          </div>
        );
      }
      return null;
    };

    switch (indicator.type) {
      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id={`color${indicator.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={indicator.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={indicator.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            {renderDaySeparators()}
            <XAxis 
              dataKey="time" 
              stroke={textColor}
              height={60}
              tick={<CustomXAxisTick />}
              interval="preserveStartEnd"
            />
            <YAxis stroke={textColor} tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="value"
              stroke={indicator.color}
              fillOpacity={1}
              fill={`url(#color${indicator.id})`}
              name={indicator.name}
            />
          </AreaChart>
        );
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            {renderDaySeparators()}
            <XAxis 
              dataKey="time" 
              stroke={textColor}
              height={60}
              tick={<CustomXAxisTick />}
              interval="preserveStartEnd"
            />
            <YAxis stroke={textColor} tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="value" fill={indicator.color} name={indicator.name} />
          </BarChart>
        );
      case "tz":
        return (
          <TZCandlestickChart 
            data={displayedData} 
            height={commonProps.height as number}
          />
        );
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            {renderDaySeparators()}
            <XAxis 
              dataKey="time" 
              stroke={textColor}
              height={60}
              tick={<CustomXAxisTick />}
              interval="preserveStartEnd"
            />
            <YAxis stroke={textColor} tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke={indicator.color}
              strokeWidth={2}
              name={indicator.name}
              dot={false}
            />
          </LineChart>
        );
    }
  };

  const decimals = currency.market === "CRYPTO" || currency.market === "INDEX" ? 2 : 4;
  const isPositive = currency.change >= 0;

  // Chart Component
  const chartComponent = (height: number) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </motion.div>
  );

  // Table Component
  const tableComponent = (maxHeight: string) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxHeight }}
      className={`overflow-auto rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
    >
      <table className="w-full">
        <thead className={`sticky top-0 z-10 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <tr>
            <th className={`p-3 text-${isRTL ? 'right' : 'left'} text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {isRTL ? 'الوقت' : 'Time'}
            </th>
            <th className={`p-3 text-${isRTL ? 'right' : 'left'} text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {isRTL ? 'القيمة' : 'Value'}
            </th>
            <th className={`p-3 text-${isRTL ? 'right' : 'left'} text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {isRTL ? 'التغيير' : 'Change'}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const prevValue = index > 0 ? data[index - 1].value : row.value;
            const change = row.value - prevValue;
            const changePercent = prevValue !== 0 ? (change / prevValue) * 100 : 0;
            const isRowPositive = change >= 0;
            
            return (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`border-b ${isDark ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}
              >
                <td className={`p-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {row.time}
                </td>
                <td className={`p-3 text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {row.value.toFixed(decimals)}
                </td>
                <td className="p-3">
                  {index > 0 && (
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className={`text-sm font-semibold ${
                        isRowPositive 
                          ? isDark ? 'text-green-400' : 'text-green-600'
                          : isDark ? 'text-red-400' : 'text-red-600'
                      }`}>
                        {isRowPositive ? '+' : ''}{change.toFixed(decimals)}
                      </span>
                      <Badge 
                        variant={isRowPositive ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {isRowPositive ? '+' : ''}{changePercent.toFixed(2)}%
                      </Badge>
                    </div>
                  )}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );

  const mainContent = (
    <Card className={`h-full ${isDark ? "bg-gray-900 border-gray-700" : "bg-white"} shadow-lg border-2 overflow-hidden`}>
      <CardHeader className="relative overflow-hidden">
        {/* Background gradient animation */}
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{
            background: [
              `linear-gradient(45deg, ${indicator.color}00, ${indicator.color}30)`,
              `linear-gradient(135deg, ${indicator.color}30, ${indicator.color}00)`,
              `linear-gradient(45deg, ${indicator.color}00, ${indicator.color}30)`,
            ],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        <CardTitle className={`flex items-center justify-between relative z-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${indicator.color}20` }}
            >
              <Activity className="w-5 h-5" style={{ color: indicator.color }} />
            </div>
            <div>
              <span className={`text-base ${isDark ? "text-white" : "text-gray-900"}`}>
                {isRTL ? indicator.name : indicator.nameEn}
              </span>
              <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>
                {currency.symbol}
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Action Buttons */}
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTable(!showTable)}
                className={`${isDark ? "hover:bg-gray-800" : ""} ${showTable ? isDark ? "bg-gray-800" : "bg-gray-100" : ""}`}
                title={isRTL ? "عرض الجدول" : "Show Table"}
              >
                <Table className={`w-4 h-4 ${showTable ? 'text-indigo-500' : isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTable(false)}
                className={`${isDark ? "hover:bg-gray-800" : ""} ${!showTable ? isDark ? "bg-gray-800" : "bg-gray-100" : ""}`}
                title={isRTL ? "عرض الرسم البياني" : "Show Chart"}
              >
                <BarChart3 className={`w-4 h-4 ${!showTable ? 'text-indigo-500' : isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              </Button>
              {!showTable && isExpanded && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDrawingTools(!showDrawingTools)}
                  className={`${isDark ? "hover:bg-gray-800" : ""} ${showDrawingTools ? isDark ? "bg-indigo-900/30" : "bg-indigo-50" : ""}`}
                  title={isRTL ? "أدوات الرسم" : "Drawing Tools"}
                >
                  <Layers className={`w-4 h-4 ${showDrawingTools ? 'text-indigo-500' : isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className={`${isDark ? "hover:bg-gray-800" : ""}`}
                title={isRTL ? (isExpanded ? "تصغير" : "تكبير") : (isExpanded ? "Minimize" : "Expand")}
              >
                {isExpanded ? (
                  <Minimize2 className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                ) : (
                  <Maximize2 className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                )}
              </Button>
            </div>
            
            <div className={`text-${isRTL ? 'left' : 'right'} ml-2`}>
              <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {isRTL ? currency.name : currency.nameEn}
              </div>
              <div className={`font-bold text-lg ${isDark ? "text-white" : "text-gray-900"}`}>
                {currency.price.toFixed(decimals)}
              </div>
            </div>
            <motion.div
              animate={isPositive ? { y: [0, -3, 0] } : { y: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`p-2 rounded-lg ${
                isPositive
                  ? isDark
                    ? "bg-green-500/20"
                    : "bg-green-50"
                  : isDark
                    ? "bg-red-500/20"
                    : "bg-red-50"
              }`}
            >
              {isPositive ? (
                <TrendingUp className={`w-5 h-5 ${isDark ? "text-green-400" : "text-green-600"}`} />
              ) : (
                <TrendingDown className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-600"}`} />
              )}
            </motion.div>
          </motion.div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Timeframe Buttons */}
        <motion.div 
          className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Clock className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-600'} ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {isRTL ? 'الإطار الزمني:' : 'Timeframe:'}
              </span>
            </div>
            {[5, 15, 30, 60].map((tf) => (
              <motion.button
                key={tf}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // For PHASE STATE, open MTF dialog instead
                  if (indicator?.id === "phase") {
                    setIsMtfDialogOpen(true);
                  } else {
                    onTimeframeChange(tf as 5 | 15 | 30 | 60);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  timeframe === tf
                    ? isDark
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                      : 'bg-indigo-600 text-white shadow-lg'
                    : isDark
                      ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tf}{isRTL ? ' دقيقة' : 'M'}
              </motion.button>
            ))}
          </div>

          {/* Navigation Info */}
          <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              {isRTL ? '🖱️ اسحب للتنقل' : '🖱️ Drag to navigate'}
            </span>
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>•</span>
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              {isRTL ? '⚲ عجلة للتكبير' : '⚲ Wheel to zoom'}
            </span>
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>•</span>
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              {isRTL ? '⌨️ أسهم للتحكم' : '⌨️ Arrows to control'}
            </span>
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>•</span>
            <span className={`text-xs font-semibold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
              {isRTL ? `${startIndex + 1} - ${Math.min(startIndex + viewWindow, data.length)} / ${data.length}` 
                     : `${startIndex + 1} - ${Math.min(startIndex + viewWindow, data.length)} / ${data.length}`}
            </span>
          </div>
        </motion.div>

        {/* Multi-Timeframe Panel for TZ Indicator */}
        {indicator.id === 'tz' && onMtfEnabledChange && onMtfSmallTimeframeChange && onMtfLargeTimeframeChange && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`mb-4 p-4 rounded-xl border-2 ${
              mtfEnabled 
                ? isDark 
                  ? 'bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-500/50' 
                  : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300'
                : isDark 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Layers className={`w-5 h-5 ${mtfEnabled ? 'text-purple-500' : isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm font-bold ${mtfEnabled ? 'text-purple-500' : isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {isRTL ? 'الأطر الزمنية المتعددة (MTF)' : 'Multi-Timeframe (MTF)'}
                </span>
                <Badge variant={mtfEnabled ? "default" : "outline"} className={mtfEnabled ? 'bg-purple-500' : ''}>
                  {mtfEnabled ? (isRTL ? 'مفعّل' : 'ACTIVE') : (isRTL ? 'معطّل' : 'OFF')}
                </Badge>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onMtfEnabledChange(!mtfEnabled)}
                className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${
                  mtfEnabled
                    ? isDark
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-purple-600 text-white shadow-lg'
                    : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border-2'
                }`}
              >
                {mtfEnabled ? (isRTL ? '✓ مفعّل' : '✓ Enabled') : (isRTL ? 'تفعيل MTF' : 'Enable MTF')}
              </motion.button>
            </div>

            {mtfEnabled && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`grid grid-cols-2 gap-4`}
              >
                {/* Small Timeframe Selection */}
                <div>
                  <div className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'} ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? '📉 الفريم الصغير (التفصيلي):' : '📉 Small Timeframe (Detailed):'}
                  </div>
                  <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {[5, 15, 30, 60].map((tf) => (
                      <motion.button
                        key={`small-${tf}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onMtfSmallTimeframeChange(tf as 5 | 15 | 30 | 60)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                          mtfSmallTimeframe === tf
                            ? isDark
                              ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                              : 'bg-green-600 text-white shadow-lg'
                            : isDark
                              ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                              : 'bg-white text-gray-600 hover:bg-gray-100 border'
                        }`}
                      >
                        {tf}{isRTL ? 'د' : 'M'}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Large Timeframe Selection */}
                <div>
                  <div className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'} ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? '📈 الفريم الكبير (العام):' : '📈 Large Timeframe (Overview):'}
                  </div>
                  <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {[
                      { value: 240, label: isRTL ? '4س' : '4H' },
                      { value: 720, label: isRTL ? '12س' : '12H' },
                      { value: 1440, label: isRTL ? '1ي' : '1D' }
                    ].map(({ value, label }) => (
                      <motion.button
                        key={`large-${value}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onMtfLargeTimeframeChange(value as 240 | 720 | 1440)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                          mtfLargeTimeframe === value
                            ? isDark
                              ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/50'
                              : 'bg-orange-600 text-white shadow-lg'
                            : isDark
                              ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                              : 'bg-white text-gray-600 hover:bg-gray-100 border'
                        }`}
                      >
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {mtfEnabled && mtfSmallTimeframe && mtfLargeTimeframe && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-3 p-3 rounded-lg ${isDark ? 'bg-gray-900/50' : 'bg-white/50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span>ℹ️</span>
                  <span>
                    {isRTL 
                      ? `سيتم عرض ${mtfLargeTimeframe / mtfSmallTimeframe} شمعة من فريم ${mtfSmallTimeframe}د داخل كل شمعة من فريم ${mtfLargeTimeframe === 1440 ? '1 يوم' : mtfLargeTimeframe === 720 ? '12 ساعة' : '4 ساعات'}`
                      : `Will display ${mtfLargeTimeframe / mtfSmallTimeframe} candles of ${mtfSmallTimeframe}M inside each ${mtfLargeTimeframe === 1440 ? '1 Day' : mtfLargeTimeframe === 720 ? '12 Hour' : '4 Hour'} candle`
                    }
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
        
        {/* Interactive Chart Container */}
        <div
          ref={chartRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
          className="rounded-lg overflow-hidden relative"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <AnimatePresence mode="wait">
            {showTable ? tableComponent(isExpanded ? '600px' : '400px') : chartComponent(isExpanded ? 600 : 400)}
          </AnimatePresence>
          
          {/* Drawing Canvas Overlay - فقط عند التكبير */}
          {isExpanded && !showTable && (
            <DrawingCanvas
              selectedTool={selectedTool}
              magnetEnabled={magnetEnabled}
              locked={drawingsLocked}
              visible={drawingsVisible}
              data={displayedData}
              priceRange={{
                min: Math.min(...displayedData.map(d => d.value)),
                max: Math.max(...displayedData.map(d => d.value))
              }}
              onDrawingsChange={(newDrawings) => setDrawings(newDrawings)}
              onClearAll={() => setDrawings([])}
            />
          )}
        </div>
        
        <motion.div 
          className={`mt-6 grid grid-cols-3 gap-4`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            whileHover={{ scale: 1.05, y: -2 }}
            className={`p-4 rounded-xl ${isDark ? "bg-blue-950/30 border border-blue-800/50" : "bg-blue-50 border border-blue-100"} text-center relative overflow-hidden`}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"} relative z-10`}>
              {t("currentPrice")}
            </div>
            <div className={`font-bold text-lg ${isDark ? "text-blue-400" : "text-blue-600"} relative z-10`}>
              {currency.price.toFixed(decimals)}
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05, y: -2 }}
            className={`p-4 rounded-xl ${isDark ? "bg-green-950/30 border border-green-800/50" : "bg-green-50 border border-green-100"} text-center relative overflow-hidden`}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
            <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"} relative z-10`}>
              {t("highPrice")}
            </div>
            <div className={`font-bold text-lg ${isDark ? "text-green-400" : "text-green-600"} relative z-10`}>
              {Math.max(...data.map(d => d.value)).toFixed(decimals)}
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05, y: -2 }}
            className={`p-4 rounded-xl ${isDark ? "bg-red-950/30 border border-red-800/50" : "bg-red-50 border border-red-100"} text-center relative overflow-hidden`}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
            <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"} relative z-10`}>
              {t("lowPrice")}
            </div>
            <div className={`font-bold text-lg ${isDark ? "text-red-400" : "text-red-600"} relative z-10`}>
              {Math.min(...data.map(d => d.value)).toFixed(decimals)}
            </div>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );

  return (
    <>
      {/* Backdrop for Drawing Toolbar */}
      <AnimatePresence>
        {showDrawingTools && !showTable && isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowDrawingTools(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[99]"
          />
        )}
      </AnimatePresence>

      {/* Drawing Toolbar */}
      <AnimatePresence>
        {showDrawingTools && !showTable && isExpanded && (
          <motion.div
            initial={{ x: isRTL ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isRTL ? 300 : -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <DrawingToolbar
              selectedTool={selectedTool}
              onToolChange={setSelectedTool}
              onZoomIn={() => setViewWindow(prev => Math.max(10, prev - 5))}
              onZoomOut={() => setViewWindow(prev => Math.min(100, prev + 5))}
              onClear={() => {
                if (confirm(isRTL ? "هل تريد مسح جميع الرسومات؟" : "Clear all drawings?")) {
                  setDrawings([]);
                }
              }}
              onExport={handleExportChart}
              magnetEnabled={magnetEnabled}
              onMagnetToggle={() => setMagnetEnabled(!magnetEnabled)}
              locked={drawingsLocked}
              onLockToggle={() => setDrawingsLocked(!drawingsLocked)}
              visible={drawingsVisible}
              onVisibilityToggle={() => setDrawingsVisible(!drawingsVisible)}
              onClose={() => setShowDrawingTools(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {mainContent}
      </motion.div>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          >
            {/* Drawing Toolbar - داخل الـ Modal */}
            {!showTable && (
              <DrawingToolbar
                selectedTool={selectedTool}
                onToolChange={setSelectedTool}
                onZoomIn={() => setViewWindow(prev => Math.max(10, prev - 5))}
                onZoomOut={() => setViewWindow(prev => Math.min(100, prev + 5))}
                onClear={() => {
                  if (confirm(isRTL ? "هل تريد مسح جميع الرسومات؟" : "Clear all drawings?")) {
                    setDrawings([]);
                  }
                }}
                onExport={handleExportChart}
                magnetEnabled={magnetEnabled}
                onMagnetToggle={() => setMagnetEnabled(!magnetEnabled)}
                locked={drawingsLocked}
                onLockToggle={() => setDrawingsLocked(!drawingsLocked)}
                visible={drawingsVisible}
                onVisibilityToggle={() => setDrawingsVisible(!drawingsVisible)}
              />
            )}
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`w-[95vw] h-[95vh] ${isDark ? "bg-gray-900" : "bg-white"} rounded-2xl shadow-2xl overflow-hidden relative`}
              onClick={(e) => e.stopPropagation()}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {/* Full Screen Header */}
              <div className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"} border-b p-4`}>
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${indicator.color}20` }}
                    >
                      <Activity className="w-6 h-6" style={{ color: indicator.color }} />
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                        {isRTL ? indicator.name : indicator.nameEn}
                      </h2>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        {isRTL ? currency.name : currency.nameEn} • {currency.symbol}
                      </p>
                    </div>
                    
                    {/* Drawing Tools Badge */}
                    {!showTable && (
                      <Badge 
                        className={`${isDark ? "bg-indigo-950 text-indigo-300 border-indigo-700" : "bg-indigo-100 text-indigo-700 border-indigo-300"} border-2 animate-pulse`}
                      >
                        {isRTL ? "🎨 أدوات الرسم نشطة" : "🎨 Drawing Tools Active"}
                      </Badge>
                    )}
                  </div>

                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {/* Price Info */}
                    <div className={`${isRTL ? 'text-left' : 'text-right'} ${isRTL ? 'ml-4' : 'mr-4'}`}>
                      <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {isRTL ? "السعر الحالي" : "Current Price"}
                      </div>
                      <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                        {currency.price.toFixed(decimals)}
                      </div>
                      <div className={`text-sm ${
                        isPositive
                          ? isDark ? "text-green-400" : "text-green-600"
                          : isDark ? "text-red-400" : "text-red-600"
                      }`}>
                        {isPositive ? '+' : ''}{currency.change.toFixed(decimals)} ({isPositive ? '+' : ''}{currency.changePercent.toFixed(2)}%)
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowTable(!showTable)}
                        className={`${isDark ? "hover:bg-gray-700" : ""} ${showTable ? isDark ? "bg-gray-700" : "bg-gray-200" : ""}`}
                      >
                        <Table className={`w-5 h-5 ${showTable ? 'text-indigo-500' : isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowTable(false)}
                        className={`${isDark ? "hover:bg-gray-700" : ""} ${!showTable ? isDark ? "bg-gray-700" : "bg-gray-200" : ""}`}
                      >
                        <BarChart3 className={`w-5 h-5 ${!showTable ? 'text-indigo-500' : isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsExpanded(false)}
                        className={isDark ? "hover:bg-gray-700" : ""}
                      >
                        <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Timeframe Controls in Fullscreen */}
                <div className={`flex items-center justify-between mt-4 gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {/* Timeframe Buttons */}
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Clock className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-600'} ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      <span className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {isRTL ? 'الإطار الزمني:' : 'Timeframe:'}
                      </span>
                    </div>
                    {[5, 15, 30, 60].map((tf) => (
                      <motion.button
                        key={tf}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          // For PHASE STATE, open MTF dialog instead
                          if (indicator?.id === "phase") {
                            setIsMtfDialogOpen(true);
                          } else {
                            onTimeframeChange(tf as 5 | 15 | 30 | 60);
                          }
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          timeframe === tf
                            ? isDark
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                              : 'bg-indigo-600 text-white shadow-lg'
                            : isDark
                              ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tf}{isRTL ? ' دقيقة' : 'M'}
                      </motion.button>
                    ))}
                  </div>

                  {/* Navigation Controls */}
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStartIndex(0)}
                      disabled={startIndex === 0}
                      className={`${isDark ? 'border-gray-600 hover:bg-gray-700' : ''}`}
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStartIndex(prev => Math.max(0, prev - 10))}
                      disabled={startIndex === 0}
                      className={`${isDark ? 'border-gray-600 hover:bg-gray-700' : ''}`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                      {startIndex + 1} - {Math.min(startIndex + viewWindow, data.length)} / {data.length}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStartIndex(prev => Math.min(data.length - viewWindow, prev + 10))}
                      disabled={startIndex >= data.length - viewWindow}
                      className={`${isDark ? 'border-gray-600 hover:bg-gray-700' : ''}`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStartIndex(Math.max(0, data.length - viewWindow))}
                      disabled={startIndex >= data.length - viewWindow}
                      className={`${isDark ? 'border-gray-600 hover:bg-gray-700' : ''}`}
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Multi-Timeframe Panel in Fullscreen for TZ */}
                {indicator.id === 'tz' && onMtfEnabledChange && onMtfSmallTimeframeChange && onMtfLargeTimeframeChange && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`mt-4 p-3 rounded-xl border-2 ${
                      mtfEnabled 
                        ? isDark 
                          ? 'bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-500/50' 
                          : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300'
                        : isDark 
                          ? 'bg-gray-700/50 border-gray-600' 
                          : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Layers className={`w-5 h-5 ${mtfEnabled ? 'text-purple-400' : isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                        <span className={`text-sm font-bold ${mtfEnabled ? 'text-purple-400' : isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {isRTL ? 'الأطر الزمنية المتعددة (MTF)' : 'Multi-Timeframe (MTF)'}
                        </span>
                        <Badge variant={mtfEnabled ? "default" : "outline"} className={mtfEnabled ? 'bg-purple-500' : ''}>
                          {mtfEnabled ? (isRTL ? 'مفعّل' : 'ON') : (isRTL ? 'معطّل' : 'OFF')}
                        </Badge>
                      </div>
                      
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {mtfEnabled && (
                          <>
                            {/* Small Timeframe Selection */}
                            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {isRTL ? 'الصغير:' : 'Small:'}
                              </span>
                              {[5, 15, 30, 60].map((tf) => (
                                <motion.button
                                  key={`fs-small-${tf}`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => onMtfSmallTimeframeChange(tf as 5 | 15 | 30 | 60)}
                                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                                    mtfSmallTimeframe === tf
                                      ? isDark
                                        ? 'bg-green-600 text-white shadow-lg'
                                        : 'bg-green-600 text-white shadow-lg'
                                      : isDark
                                        ? 'bg-gray-600 text-gray-400 hover:bg-gray-500'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  {tf}{isRTL ? 'د' : 'M'}
                                </motion.button>
                              ))}
                            </div>

                            {/* Large Timeframe Selection */}
                            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {isRTL ? 'الكبير:' : 'Large:'}
                              </span>
                              {[
                                { value: 240, label: isRTL ? '4س' : '4H' },
                                { value: 720, label: isRTL ? '12س' : '12H' },
                                { value: 1440, label: isRTL ? '1ي' : '1D' }
                              ].map(({ value, label }) => (
                                <motion.button
                                  key={`fs-large-${value}`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => onMtfLargeTimeframeChange(value as 240 | 720 | 1440)}
                                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                                    mtfLargeTimeframe === value
                                      ? isDark
                                        ? 'bg-orange-600 text-white shadow-lg'
                                        : 'bg-orange-600 text-white shadow-lg'
                                      : isDark
                                        ? 'bg-gray-600 text-gray-400 hover:bg-gray-500'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  {label}
                                </motion.button>
                              ))}
                            </div>
                          </>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onMtfEnabledChange(!mtfEnabled)}
                          className={`px-4 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                            mtfEnabled
                              ? isDark
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'bg-purple-600 text-white shadow-lg'
                              : isDark
                                ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border'
                          }`}
                        >
                          {mtfEnabled ? (isRTL ? '✓ مفعّل' : '✓ ON') : (isRTL ? 'تفعيل' : 'Enable')}
                        </motion.button>
                      </div>
                    </div>

                    {mtfEnabled && mtfSmallTimeframe && mtfLargeTimeframe && (
                      <div className={`mt-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} ${isRTL ? 'text-right' : 'text-left'}`}>
                        ℹ️ {isRTL 
                          ? `عرض ${mtfLargeTimeframe / mtfSmallTimeframe} شمعة ${mtfSmallTimeframe}د داخل كل شمعة ${mtfLargeTimeframe === 1440 ? '1 يوم' : mtfLargeTimeframe === 720 ? '12س' : '4س'}`
                          : `Showing ${mtfLargeTimeframe / mtfSmallTimeframe} x ${mtfSmallTimeframe}M candles inside each ${mtfLargeTimeframe === 1440 ? '1D' : mtfLargeTimeframe === 720 ? '12H' : '4H'} candle`
                        }
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Full Screen Content */}
              <div className="p-6 h-[calc(95vh-120px)] overflow-auto">
                <div className="relative">
                  <AnimatePresence mode="wait">
                    {showTable ? tableComponent('calc(95vh - 320px)') : chartComponent(window.innerHeight - 320)}
                  </AnimatePresence>

                  {/* Drawing Canvas Overlay - في الـ Fullscreen */}
                  {!showTable && (
                    <DrawingCanvas
                      selectedTool={selectedTool}
                      magnetEnabled={magnetEnabled}
                      locked={drawingsLocked}
                      visible={drawingsVisible}
                      data={displayedData}
                      priceRange={{
                        min: Math.min(...displayedData.map(d => d.value)),
                        max: Math.max(...displayedData.map(d => d.value))
                      }}
                      onDrawingsChange={(newDrawings) => setDrawings(newDrawings)}
                      onClearAll={() => setDrawings([])}
                    />
                  )}
                </div>

                {/* Stats Grid */}
                <motion.div 
                  className={`mt-6 grid grid-cols-6 gap-4`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div 
                    whileHover={{ scale: 1.03, y: -2 }}
                    className={`p-4 rounded-xl ${isDark ? "bg-blue-950/30 border border-blue-800/50" : "bg-blue-50 border border-blue-100"} text-center relative overflow-hidden`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"} relative z-10`}>
                      {t("currentPrice")}
                    </div>
                    <div className={`font-bold text-lg ${isDark ? "text-blue-400" : "text-blue-600"} relative z-10`}>
                      {currency.price.toFixed(decimals)}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.03, y: -2 }}
                    className={`p-4 rounded-xl ${isDark ? "bg-green-950/30 border border-green-800/50" : "bg-green-50 border border-green-100"} text-center relative overflow-hidden`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
                    />
                    <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"} relative z-10`}>
                      {t("highPrice")}
                    </div>
                    <div className={`font-bold text-lg ${isDark ? "text-green-400" : "text-green-600"} relative z-10`}>
                      {Math.max(...data.map(d => d.value)).toFixed(decimals)}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.03, y: -2 }}
                    className={`p-4 rounded-xl ${isDark ? "bg-red-950/30 border border-red-800/50" : "bg-red-50 border border-red-100"} text-center relative overflow-hidden`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
                    />
                    <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"} relative z-10`}>
                      {t("lowPrice")}
                    </div>
                    <div className={`font-bold text-lg ${isDark ? "text-red-400" : "text-red-600"} relative z-10`}>
                      {Math.min(...data.map(d => d.value)).toFixed(decimals)}
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.03, y: -2 }}
                    className={`p-4 rounded-xl ${isDark ? "bg-purple-950/30 border border-purple-800/50" : "bg-purple-50 border border-purple-100"} text-center relative overflow-hidden`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0.9 }}
                    />
                    <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"} relative z-10`}>
                      {isRTL ? "المتوسط" : "Average"}
                    </div>
                    <div className={`font-bold text-lg ${isDark ? "text-purple-400" : "text-purple-600"} relative z-10`}>
                      {(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(decimals)}
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.03, y: -2 }}
                    className={`p-4 rounded-xl ${isDark ? "bg-orange-950/30 border border-orange-800/50" : "bg-orange-50 border border-orange-100"} text-center relative overflow-hidden`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1.2 }}
                    />
                    <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"} relative z-10`}>
                      {isRTL ? "التذبذ" : "Volatility"}
                    </div>
                    <div className={`font-bold text-lg ${isDark ? "text-orange-400" : "text-orange-600"} relative z-10`}>
                      {((Math.max(...data.map(d => d.value)) - Math.min(...data.map(d => d.value))) / Math.min(...data.map(d => d.value)) * 100).toFixed(2)}%
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.03, y: -2 }}
                    className={`p-4 rounded-xl ${isDark ? "bg-cyan-950/30 border border-cyan-800/50" : "bg-cyan-50 border border-cyan-100"} text-center relative overflow-hidden`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                    />
                    <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"} relative z-10`}>
                      {isRTL ? "عدد النقاط" : "Data Points"}
                    </div>
                    <div className={`font-bold text-lg ${isDark ? "text-cyan-400" : "text-cyan-600"} relative z-10`}>
                      {data.length}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Multi-Timeframe Dialog for PHASE STATE */}
      <Dialog open={isMtfDialogOpen} onOpenChange={setIsMtfDialogOpen}>
        <DialogContent className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white'} max-w-xl`}>
          <DialogHeader>
            <DialogTitle className={`${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-3 text-2xl`}>
              <div className="bg-gradient-to-br from-orange-600 to-orange-500 p-3 rounded-xl shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span>
                {isRTL ? 'اختر الإطار الزمني' : 'Select Timeframe'}
              </span>
            </DialogTitle>
            <DialogDescription className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-base mt-2`}>
              {isRTL 
                ? 'اختر الإطار الزمني الكبير لعرض الشموع' 
                : 'Choose the large timeframe to display candles'}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            {/* Large Timeframe Selection */}
            <div className={`grid grid-cols-3 gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {[
                { value: 240, label: isRTL ? '4 ساعات' : '4 Hours', icon: '🕓' },
                { value: 720, label: isRTL ? '12 ساعة' : '12 Hours', icon: '🕐' },
                { value: 1440, label: isRTL ? 'يوم واحد' : '1 Day', icon: '📅' }
              ].map(({ value, label, icon }) => (
                <motion.button
                  key={value}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onMtfLargeTimeframeChange(value as 240 | 720 | 1440);
                    onMtfEnabledChange(true);
                    setIsMtfDialogOpen(false);
                  }}
                  className={`p-6 rounded-2xl border-2 font-bold transition-all text-center ${
                    mtfLargeTimeframe === value
                      ? isDark
                        ? 'bg-gradient-to-br from-orange-600 to-orange-500 border-orange-400 text-white shadow-2xl shadow-orange-500/40'
                        : 'bg-gradient-to-br from-orange-600 to-orange-500 border-orange-400 text-white shadow-2xl shadow-orange-500/30'
                      : isDark
                        ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600 hover:shadow-lg'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 hover:shadow-lg'
                  }`}
                >
                  <div className="text-3xl mb-2">{icon}</div>
                  <div className="text-lg">{label}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}