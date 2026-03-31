import type { DrawingTool } from "../DrawingToolbar/types";

export interface Point {
  x: number;
  y: number;
  price?: number;
  index?: number;
}

export interface Drawing {
  id: string;
  tool: DrawingTool;
  points: Point[];
  color: string;
  text?: string;
  width: number;
}

export interface DrawingCanvasProps {
  selectedTool: DrawingTool;
  magnetEnabled: boolean;
  locked: boolean;
  visible: boolean;
  data: unknown[];
  priceRange: { min: number; max: number };
  onDrawingsChange?: (drawings: Drawing[]) => void;
  onClearAll?: () => void;
}
