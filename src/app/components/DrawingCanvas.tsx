import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { DrawingCanvasView } from "./DrawingCanvas/DrawingCanvasView";
import { useDrawingCanvas } from "./DrawingCanvas/useDrawingCanvas";
import type { DrawingCanvasProps } from "./DrawingCanvas/drawingCanvasTypes";

export type { Drawing, DrawingCanvasProps } from "./DrawingCanvas/drawingCanvasTypes";

export const DrawingCanvas = React.memo(function DrawingCanvas(props: DrawingCanvasProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const model = useDrawingCanvas({
    ...props,
    isDark,
  });

  return <DrawingCanvasView {...model} />;
});
