import {
  TrendingUp,
  TrendingDown,
  Lightbulb,
  BarChart3,
  Ghost,
  Target,
  Waves,
  BarChart2,
  AlignHorizontalJustifyCenter,
  Ruler,
  Calendar,
  Box,
  Move,
  Crosshair,
  Minus,
  DivideSquare,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Circle,
  Square,
  Triangle,
  Type,
  Eraser,
  Pencil,
} from "lucide-react";
import type { ToolbarToolItem } from "./types";

export function getDrawingToolbarToolLists(isRTL: boolean): {
  projectionTools: ToolbarToolItem[];
  volumeTools: ToolbarToolItem[];
  measurerTools: ToolbarToolItem[];
  basicTools: ToolbarToolItem[];
} {
  const projectionTools: ToolbarToolItem[] = [
    { id: "long-position", icon: TrendingUp, label: isRTL ? "مركز شراء" : "Long Position", description: isRTL ? "تحليل مركز شراء" : "Long position analysis" },
    { id: "short-position", icon: TrendingDown, label: isRTL ? "مركز بيع" : "Short Position", description: isRTL ? "تحليل مركز بيع" : "Short position analysis" },
    { id: "forecast", icon: Lightbulb, label: isRTL ? "توقع" : "Forecast", description: isRTL ? "توقع حركة السعر" : "Price movement forecast" },
    { id: "bars-pattern", icon: BarChart3, label: isRTL ? "نمط الأعمدة" : "Bars Pattern", description: isRTL ? "تحليل نمط الأعمدة" : "Bar pattern analysis" },
    { id: "ghost-feed", icon: Ghost, label: isRTL ? "تغذية الظل" : "Ghost Feed", description: isRTL ? "عرض بيانات سابقة" : "Historical data overlay" },
    { id: "projection", icon: Target, label: isRTL ? "إسقاط" : "Projection", description: isRTL ? "إسقاط الأسعار" : "Price projection" },
  ];

  const volumeTools: ToolbarToolItem[] = [
    { id: "anchored-vwap", icon: Waves, label: isRTL ? "VWAP مثبت" : "Anchored VWAP", description: isRTL ? "متوسط السعر المرجح بالحجم" : "Volume weighted average price" },
    { id: "fixed-range-volume", icon: BarChart2, label: isRTL ? "ملف حجم ثابت" : "Fixed Range Volume Profile", description: isRTL ? "ملف تعريف الحجم لنطاق ثابت" : "Volume profile for fixed range" },
    { id: "anchored-volume", icon: AlignHorizontalJustifyCenter, label: isRTL ? "ملف حجم مثبت" : "Anchored Volume Profile", description: isRTL ? "ملف تعريف الحجم المثبت" : "Anchored volume profile" },
  ];

  const measurerTools: ToolbarToolItem[] = [
    { id: "price-range", icon: Ruler, label: isRTL ? "نطاق السعر" : "Price Range", description: isRTL ? "قياس نطاق الأسعار" : "Measure price range" },
    { id: "date-range", icon: Calendar, label: isRTL ? "نطاق التاريخ" : "Date Range", description: isRTL ? "قياس نطاق التواريخ" : "Measure date range" },
    { id: "date-price-range", icon: Box, label: isRTL ? "نطاق التاريخ والسعر" : "Date and Price Range", description: isRTL ? "قياس نطاق التاريخ والسعر" : "Measure date and price range" },
  ];

  const basicTools: ToolbarToolItem[] = [
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

  return { projectionTools, volumeTools, measurerTools, basicTools };
}
