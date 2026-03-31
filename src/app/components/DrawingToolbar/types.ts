import type { ComponentType } from "react";

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

export interface DrawingToolbarProps {
  selectedTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onClear: () => void;
  magnetEnabled?: boolean;
  onMagnetToggle?: () => void;
  locked?: boolean;
  onLockToggle?: () => void;
  visible?: boolean;
  onVisibilityToggle?: () => void;
  onClose?: () => void;
}

export type ToolbarToolItem = {
  id: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  description?: string;
};
