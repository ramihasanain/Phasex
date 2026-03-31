import { useRef, useEffect, useState } from "react";
import type { Drawing, DrawingCanvasProps, Point } from "./drawingCanvasTypes";
import { drawShape } from "./drawingCanvasDrawShape";

export type UseDrawingCanvasOptions = DrawingCanvasProps & { isDark: boolean };

export function useDrawingCanvas({
  selectedTool,
  magnetEnabled,
  locked,
  visible,
  data,
  priceRange,
  onDrawingsChange,
  onClearAll,
  isDark,
}: UseDrawingCanvasOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [currentDrawing, setCurrentDrawing] = useState<Drawing | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const clearAllDrawings = () => {
    setDrawings([]);
    setCurrentDrawing(null);
    setIsDrawing(false);
    onDrawingsChange?.([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  useEffect(() => {
    if (onClearAll) {
      (window as unknown as { __clearDrawings?: () => void }).__clearDrawings = clearAllDrawings;
    }
  }, [onClearAll]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      redrawAll();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const redrawAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!visible) return;

    [...drawings, ...(currentDrawing ? [currentDrawing] : [])].forEach((drawing) => {
      drawShape(ctx, drawing, isDark);
    });
  };

  useEffect(() => {
    redrawAll();
  }, [drawings, currentDrawing, visible, isDark]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (magnetEnabled) {
      const gridSize = 20;
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;
    }

    const priceAtY = priceRange.max - (y / canvas.height) * (priceRange.max - priceRange.min);
    const indexAtX = Math.floor((x / canvas.width) * data.length);

    return { x, y, price: priceAtY, index: indexAtX };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (locked || selectedTool === "cursor" || selectedTool === "crosshair") return;

    const point = getMousePos(e);
    setIsDrawing(true);

    if (selectedTool === "text") {
      const text = prompt("أدخل النص / Enter text:");
      if (text) {
        const newDrawing: Drawing = {
          id: Date.now().toString(),
          tool: selectedTool,
          points: [point],
          color: isDark ? "#60a5fa" : "#3b82f6",
          text,
          width: 2,
        };
        setDrawings([...drawings, newDrawing]);
        onDrawingsChange?.([...drawings, newDrawing]);
      }
      setIsDrawing(false);
      return;
    }

    if (selectedTool === "emoji") {
      const emoji = prompt("أدخل الرمز / Enter emoji:", "📈");
      if (emoji) {
        const newDrawing: Drawing = {
          id: Date.now().toString(),
          tool: selectedTool,
          points: [point],
          color: isDark ? "#60a5fa" : "#3b82f6",
          text: emoji,
          width: 2,
        };
        setDrawings([...drawings, newDrawing]);
        onDrawingsChange?.([...drawings, newDrawing]);
      }
      setIsDrawing(false);
      return;
    }

    setCurrentDrawing({
      id: Date.now().toString(),
      tool: selectedTool,
      points: [point],
      color: isDark ? "#60a5fa" : "#3b82f6",
      width: 2,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    if (!isDrawing || !currentDrawing || locked) return;

    const point = getMousePos(e);

    if (selectedTool === "brush") {
      setCurrentDrawing({
        ...currentDrawing,
        points: [...currentDrawing.points, point],
      });
    } else {
      setCurrentDrawing({
        ...currentDrawing,
        points: [currentDrawing.points[0], point],
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentDrawing) return;

    if (currentDrawing.points.length >= 1) {
      const newDrawings = [...drawings, currentDrawing];
      setDrawings(newDrawings);
      onDrawingsChange?.(newDrawings);
    }

    setCurrentDrawing(null);
    setIsDrawing(false);
  };

  const getCursor = () => {
    if (locked) return "not-allowed";
    if (selectedTool === "cursor") return "default";
    if (selectedTool === "crosshair") return "crosshair";
    if (selectedTool === "text") return "text";
    return "crosshair";
  };

  return {
    canvasRef,
    containerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    getCursor,
    locked,
    selectedTool,
    visible,
  };
}
