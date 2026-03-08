import React, { useRef, useEffect, useState } from "react";
import { DrawingTool } from "./DrawingToolbar";
import { useTheme } from "../contexts/ThemeContext";

interface Point {
  x: number;
  y: number;
  price?: number;
  index?: number;
}

interface Drawing {
  id: string;
  tool: DrawingTool;
  points: Point[];
  color: string;
  text?: string;
  width: number;
}

interface DrawingCanvasProps {
  selectedTool: DrawingTool;
  magnetEnabled: boolean;
  locked: boolean;
  visible: boolean;
  data: any[];
  priceRange: { min: number; max: number };
  onDrawingsChange?: (drawings: Drawing[]) => void;
  onClearAll?: () => void;
}

export const DrawingCanvas = React.memo(function DrawingCanvas({
  selectedTool,
  magnetEnabled,
  locked,
  visible,
  data,
  priceRange,
  onDrawingsChange,
  onClearAll,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [currentDrawing, setCurrentDrawing] = useState<Drawing | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Clear all drawings function
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

  // Expose clear function
  useEffect(() => {
    if (onClearAll) {
      (window as any).__clearDrawings = clearAllDrawings;
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

  useEffect(() => {
    redrawAll();
  }, [drawings, currentDrawing, visible, isDark]);

  const redrawAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!visible) return;

    [...drawings, ...(currentDrawing ? [currentDrawing] : [])].forEach((drawing) => {
      drawShape(ctx, drawing);
    });
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Snap to grid if magnet enabled
    if (magnetEnabled) {
      const gridSize = 20;
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;
    }

    // Calculate price at this point
    const priceAtY = priceRange.max - ((y / canvas.height) * (priceRange.max - priceRange.min));
    const indexAtX = Math.floor((x / canvas.width) * data.length);

    return { x, y, price: priceAtY, index: indexAtX };
  };

  const drawShape = (ctx: CanvasRenderingContext2D, drawing: Drawing) => {
    ctx.strokeStyle = drawing.color;
    ctx.fillStyle = drawing.color;
    ctx.lineWidth = drawing.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const points = drawing.points;
    if (points.length === 0) return;

    switch (drawing.tool) {
      case "trend-line":
      case "horizontal-line":
      case "vertical-line":
        if (points.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          if (drawing.tool === "horizontal-line") {
            ctx.lineTo(ctx.canvas.width, points[0].y);
          } else if (drawing.tool === "vertical-line") {
            ctx.lineTo(points[0].x, ctx.canvas.height);
          } else {
            ctx.lineTo(points[1].x, points[1].y);
          }
          ctx.stroke();

          // Draw price labels
          if (points[0].price !== undefined) {
            ctx.font = "600 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
            ctx.fillStyle = isDark ? "#ffffff" : "#000000";
            ctx.shadowColor = isDark ? "#000000" : "#ffffff";
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            // Background for price label
            const priceText = points[0].price.toFixed(4);
            const textMetrics = ctx.measureText(priceText);
            const padding = 6;
            const bgX = points[0].x + 5;
            const bgY = points[0].y - 18;

            ctx.fillStyle = drawing.color;
            ctx.globalAlpha = 0.9;
            ctx.fillRect(bgX - padding / 2, bgY - padding, textMetrics.width + padding, 16 + padding);
            ctx.globalAlpha = 1;

            ctx.fillStyle = isDark ? "#ffffff" : "#000000";
            ctx.shadowBlur = 0;
            ctx.fillText(priceText, bgX, bgY + 10);
          }
        }
        break;

      case "ray":
        if (points.length >= 2) {
          const dx = points[1].x - points[0].x;
          const dy = points[1].y - points[0].y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const extendLength = Math.max(ctx.canvas.width, ctx.canvas.height) * 2;
          const endX = points[0].x + (dx / length) * extendLength;
          const endY = points[0].y + (dy / length) * extendLength;

          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
        break;

      case "arrow":
        if (points.length >= 2) {
          const p1 = points[0];
          const p2 = points[1];

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          // Arrowhead
          const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
          const headLength = 10;
          ctx.beginPath();
          ctx.moveTo(p2.x, p2.y);
          ctx.lineTo(
            p2.x - headLength * Math.cos(angle - Math.PI / 6),
            p2.y - headLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(p2.x, p2.y);
          ctx.lineTo(
            p2.x - headLength * Math.cos(angle + Math.PI / 6),
            p2.y - headLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
        }
        break;

      case "rectangle":
        if (points.length >= 2) {
          const width = points[1].x - points[0].x;
          const height = points[1].y - points[0].y;
          ctx.strokeRect(points[0].x, points[0].y, width, height);
          ctx.fillStyle = drawing.color + "20";
          ctx.fillRect(points[0].x, points[0].y, width, height);

          // Show dimensions with better styling
          if (points[0].price && points[1].price) {
            const priceDiff = Math.abs(points[1].price - points[0].price);
            const percentage = ((priceDiff / points[0].price) * 100).toFixed(2);
            const text = `${priceDiff.toFixed(4)} (${percentage}%)`;

            ctx.font = "600 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
            const textMetrics = ctx.measureText(text);
            const padding = 6;
            const bgX = points[0].x + 5;
            const bgY = points[0].y + 5;

            // Background
            ctx.fillStyle = drawing.color;
            ctx.globalAlpha = 0.9;
            ctx.fillRect(bgX - padding / 2, bgY - padding / 2, textMetrics.width + padding, 16 + padding);
            ctx.globalAlpha = 1;

            // Text
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "#000000";
            ctx.shadowBlur = 3;
            ctx.fillText(text, bgX, bgY + 10);
            ctx.shadowBlur = 0;
          }
        }
        break;

      case "circle":
        if (points.length >= 2) {
          const radius = Math.sqrt(
            Math.pow(points[1].x - points[0].x, 2) + Math.pow(points[1].y - points[0].y, 2)
          );
          ctx.beginPath();
          ctx.arc(points[0].x, points[0].y, radius, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.fillStyle = drawing.color + "20";
          ctx.fill();
        }
        break;

      case "triangle":
        if (points.length >= 2) {
          const p1 = points[0];
          const p2 = points[1];
          const p3 = { x: p2.x, y: p1.y };

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo((p1.x + p2.x) / 2, p2.y);
          ctx.closePath();
          ctx.stroke();
          ctx.fillStyle = drawing.color + "20";
          ctx.fill();
        }
        break;

      case "fibonacci":
        if (points.length >= 2) {
          const fibLevels = [
            { level: 0, color: "#ef4444", name: "0.0%" },
            { level: 0.236, color: "#f97316", name: "23.6%" },
            { level: 0.382, color: "#f59e0b", name: "38.2%" },
            { level: 0.5, color: "#eab308", name: "50.0%" },
            { level: 0.618, color: "#84cc16", name: "61.8%" },
            { level: 0.786, color: "#22c55e", name: "78.6%" },
            { level: 1, color: "#10b981", name: "100%" }
          ];
          const startY = points[0].y;
          const endY = points[1].y;
          const range = endY - startY;
          const priceStart = points[0].price || 0;
          const priceEnd = points[1].price || 0;
          const priceRange = priceEnd - priceStart;

          // Enable high-quality rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          fibLevels.forEach((fib, index) => {
            const y = startY + range * fib.level;
            const price = priceStart + priceRange * fib.level;

            // Draw filled zone between lines first (bottom layer)
            if (index < fibLevels.length - 1) {
              const nextY = startY + range * fibLevels[index + 1].level;
              const gradient = ctx.createLinearGradient(0, y, 0, nextY);
              gradient.addColorStop(0, fib.color + "25");
              gradient.addColorStop(0.5, fib.color + "15");
              gradient.addColorStop(1, fib.color + "08");
              ctx.fillStyle = gradient;
              ctx.fillRect(0, y, ctx.canvas.width, nextY - y);
            }

            // Draw main line with enhanced glow
            ctx.strokeStyle = fib.color;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = fib.color;
            ctx.shadowBlur = 20;
            ctx.setLineDash([10, 5]);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(ctx.canvas.width, y);
            ctx.stroke();

            // Second glow layer for more intensity
            ctx.shadowBlur = 10;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.setLineDash([]);
            ctx.shadowBlur = 0;

            // Draw label with ultra-clear text
            const decimals = Math.abs(price) > 1000 ? 2 : Math.abs(price) > 1 ? 4 : 6;
            const priceText = price.toFixed(decimals);
            const fullText = `${fib.name} - $${priceText}`;

            // Ultra-high-quality font rendering with larger size
            ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif";
            ctx.textBaseline = "middle";
            ctx.textAlign = "left";
            const textMetrics = ctx.measureText(fullText);
            const padding = 14;
            const bgX = 25;
            const bgY = y - 18;
            const bgWidth = textMetrics.width + padding * 2;
            const bgHeight = 36;

            // Enhanced gradient background with more opacity
            const bgGradient = ctx.createLinearGradient(bgX, bgY, bgX + bgWidth, bgY + bgHeight);
            bgGradient.addColorStop(0, fib.color);
            bgGradient.addColorStop(1, fib.color + "e0");

            // Outer glow - stronger
            ctx.shadowColor = fib.color;
            ctx.shadowBlur = 30;
            ctx.fillStyle = bgGradient;
            ctx.beginPath();
            ctx.roundRect(bgX, bgY, bgWidth, bgHeight, 8);
            ctx.fill();

            // Inner border highlight - brighter
            ctx.shadowBlur = 0;
            ctx.strokeStyle = "#ffffff60";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(bgX + 1.5, bgY + 1.5, bgWidth - 3, bgHeight - 3, 7);
            ctx.stroke();

            // Ultra-clear text with multiple layers
            // Layer 1: Dark shadow for depth
            ctx.fillStyle = "#000000";
            ctx.shadowColor = "#000000";
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillText(fullText, bgX + padding, y);

            // Layer 2: Main white text - crisp and clear
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "#000000";
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 1;
            ctx.fillText(fullText, bgX + padding, y);

            // Layer 3: Bright highlight on top
            ctx.fillStyle = "#ffffff";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.globalAlpha = 0.3;
            ctx.fillText(fullText, bgX + padding, y - 0.5);
            ctx.globalAlpha = 1;

            // Reset all styles
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.textAlign = "start";
          });
        }
        break;

      case "brush":
        if (points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.stroke();
        }
        break;

      case "text":
        if (points.length > 0 && drawing.text) {
          ctx.font = "16px sans-serif";
          ctx.fillStyle = drawing.color;
          ctx.fillText(drawing.text, points[0].x, points[0].y);
        }
        break;

      case "emoji":
        if (points.length > 0 && drawing.text) {
          ctx.font = "32px sans-serif";
          ctx.fillText(drawing.text, points[0].x, points[0].y);
        }
        break;

      case "long-position":
        if (points.length >= 2) {
          const startX = points[0].x;
          const startY = points[0].y;
          const endX = points[1].x;
          const endY = points[1].y;

          // Enable high-quality rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw entry line with glow
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 3;
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = 15;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, startY);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Draw projection line with enhanced glow
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 4;
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.moveTo(endX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Draw enhanced arrow
          const arrowSize = 16;
          ctx.fillStyle = "#10b981";
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX - arrowSize / 2, endY + arrowSize);
          ctx.lineTo(endX + arrowSize / 2, endY + arrowSize);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;

          // Gradient background box
          const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
          gradient.addColorStop(0, "rgba(16, 185, 129, 0.15)");
          gradient.addColorStop(1, "rgba(16, 185, 129, 0.05)");
          ctx.fillStyle = gradient;
          ctx.fillRect(startX, Math.min(startY, endY), endX - startX, Math.abs(endY - startY));

          // Premium Labels
          if (points[0].price && points[1].price) {
            const priceDiff = Math.abs(points[1].price - points[0].price);
            const percentage = ((priceDiff / points[0].price) * 100).toFixed(2);

            ctx.font = "700 13px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
            const entryText = `Entry: $${points[0].price.toFixed(4)}`;
            const targetText = `Target: $${points[1].price.toFixed(4)} (+${percentage}%)`;

            // Entry label with gradient
            const entryMetrics = ctx.measureText(entryText);
            const entryGradient = ctx.createLinearGradient(startX + 5, startY - 30, startX + entryMetrics.width + 20, startY - 10);
            entryGradient.addColorStop(0, "#10b981");
            entryGradient.addColorStop(1, "#059669");

            ctx.fillStyle = entryGradient;
            ctx.shadowColor = "#10b981";
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.roundRect(startX + 5, startY - 30, entryMetrics.width + 16, 24, 6);
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "#000000";
            ctx.shadowBlur = 8;
            ctx.fillText(entryText, startX + 13, startY - 14);
            ctx.shadowBlur = 0;

            // Target label with gradient
            const targetMetrics = ctx.measureText(targetText);
            const targetGradient = ctx.createLinearGradient(endX - targetMetrics.width - 21, endY - 30, endX - 5, endY - 10);
            targetGradient.addColorStop(0, "#10b981");
            targetGradient.addColorStop(1, "#059669");

            ctx.fillStyle = targetGradient;
            ctx.shadowColor = "#10b981";
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.roundRect(endX - targetMetrics.width - 21, endY - 30, targetMetrics.width + 16, 24, 6);
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "#000000";
            ctx.shadowBlur = 8;
            ctx.fillText(targetText, endX - targetMetrics.width - 13, endY - 14);
            ctx.shadowBlur = 0;
          }
        }
        break;

      case "short-position":
        if (points.length >= 2) {
          const startX = points[0].x;
          const startY = points[0].y;
          const endX = points[1].x;
          const endY = points[1].y;

          // Draw entry line
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 2;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, startY);
          ctx.stroke();

          // Draw projection line
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(endX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          // Draw arrow
          const arrowSize = 12;
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX - arrowSize / 2, endY - arrowSize);
          ctx.lineTo(endX + arrowSize / 2, endY - arrowSize);
          ctx.closePath();
          ctx.fill();

          // Background box
          ctx.fillStyle = "rgba(239, 68, 68, 0.1)";
          ctx.fillRect(startX, Math.min(startY, endY), endX - startX, Math.abs(endY - startY));

          // Labels
          if (points[0].price && points[1].price) {
            const priceDiff = Math.abs(points[0].price - points[1].price);
            const percentage = ((priceDiff / points[0].price) * 100).toFixed(2);

            ctx.font = "bold 14px sans-serif";
            const entryText = `Entry: ${points[0].price.toFixed(4)}`;
            const targetText = `Target: ${points[1].price.toFixed(4)} (-${percentage}%)`;

            // Entry label
            ctx.fillStyle = "#ef4444";
            ctx.globalAlpha = 0.9;
            const entryMetrics = ctx.measureText(entryText);
            ctx.fillRect(startX + 5, startY - 25, entryMetrics.width + 12, 20);
            ctx.globalAlpha = 1;
            ctx.fillStyle = "#ffffff";
            ctx.fillText(entryText, startX + 11, startY - 11);

            // Target label
            ctx.fillStyle = "#ef4444";
            ctx.globalAlpha = 0.9;
            const targetMetrics = ctx.measureText(targetText);
            ctx.fillRect(endX - targetMetrics.width - 17, endY + 5, targetMetrics.width + 12, 20);
            ctx.globalAlpha = 1;
            ctx.fillStyle = "#ffffff";
            ctx.fillText(targetText, endX - targetMetrics.width - 11, endY + 19);
          }
        }
        break;

      case "price-range":
        if (points.length >= 2) {
          const x = points[0].x + 20;
          const y1 = points[0].y;
          const y2 = points[1].y;

          // Draw vertical line
          ctx.strokeStyle = drawing.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y1);
          ctx.lineTo(x, y2);
          ctx.stroke();

          // Draw end caps
          ctx.beginPath();
          ctx.moveTo(x - 8, y1);
          ctx.lineTo(x + 8, y1);
          ctx.moveTo(x - 8, y2);
          ctx.lineTo(x + 8, y2);
          ctx.stroke();

          // Draw label
          if (points[0].price && points[1].price) {
            const priceDiff = Math.abs(points[0].price - points[1].price);
            const percentage = ((priceDiff / Math.min(points[0].price, points[1].price)) * 100).toFixed(2);
            const text = `${priceDiff.toFixed(4)} (${percentage}%)`;

            ctx.font = "bold 14px sans-serif";
            const textMetrics = ctx.measureText(text);
            const midY = (y1 + y2) / 2;

            ctx.fillStyle = drawing.color;
            ctx.globalAlpha = 0.9;
            ctx.fillRect(x + 12, midY - 12, textMetrics.width + 12, 20);
            ctx.globalAlpha = 1;
            ctx.fillStyle = "#ffffff";
            ctx.fillText(text, x + 18, midY + 2);
          }
        }
        break;

      case "date-range":
        if (points.length >= 2) {
          const x1 = points[0].x;
          const x2 = points[1].x;
          const y = points[0].y - 20;

          // Draw horizontal line
          ctx.strokeStyle = drawing.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.stroke();

          // Draw end caps
          ctx.beginPath();
          ctx.moveTo(x1, y - 8);
          ctx.lineTo(x1, y + 8);
          ctx.moveTo(x2, y - 8);
          ctx.lineTo(x2, y + 8);
          ctx.stroke();

          // Draw label
          if (points[0].index !== undefined && points[1].index !== undefined) {
            const barsDiff = Math.abs(points[1].index - points[0].index);
            const text = `${barsDiff} bars`;

            ctx.font = "bold 14px sans-serif";
            const textMetrics = ctx.measureText(text);
            const midX = (x1 + x2) / 2;

            ctx.fillStyle = drawing.color;
            ctx.globalAlpha = 0.9;
            ctx.fillRect(midX - textMetrics.width / 2 - 6, y - 30, textMetrics.width + 12, 20);
            ctx.globalAlpha = 1;
            ctx.fillStyle = "#ffffff";
            ctx.fillText(text, midX - textMetrics.width / 2, y - 16);
          }
        }
        break;

      case "date-price-range":
        if (points.length >= 2) {
          const x1 = points[0].x;
          const y1 = points[0].y;
          const x2 = points[1].x;
          const y2 = points[1].y;

          // Draw box
          ctx.strokeStyle = drawing.color;
          ctx.lineWidth = 2;
          ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
          ctx.fillStyle = drawing.color + "15";
          ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

          // Draw labels
          if (points[0].price && points[1].price && points[0].index !== undefined && points[1].index !== undefined) {
            const priceDiff = Math.abs(points[0].price - points[1].price);
            const barsDiff = Math.abs(points[1].index - points[0].index);
            const percentage = ((priceDiff / Math.min(points[0].price, points[1].price)) * 100).toFixed(2);

            const priceText = `${priceDiff.toFixed(4)} (${percentage}%)`;
            const barsText = `${barsDiff} bars`;

            ctx.font = "bold 13px sans-serif";

            // Price label (vertical)
            const priceMetrics = ctx.measureText(priceText);
            ctx.fillStyle = drawing.color;
            ctx.globalAlpha = 0.9;
            ctx.fillRect(x1 + 5, y1 + 5, priceMetrics.width + 12, 20);
            ctx.globalAlpha = 1;
            ctx.fillStyle = "#ffffff";
            ctx.fillText(priceText, x1 + 11, y1 + 19);

            // Bars label (horizontal)
            const barsMetrics = ctx.measureText(barsText);
            ctx.fillStyle = drawing.color;
            ctx.globalAlpha = 0.9;
            ctx.fillRect(x1 + 5, y1 + 30, barsMetrics.width + 12, 20);
            ctx.globalAlpha = 1;
            ctx.fillStyle = "#ffffff";
            ctx.fillText(barsText, x1 + 11, y1 + 44);
          }
        }
        break;

      case "anchored-vwap":
        if (points.length >= 1) {
          const startX = points[0].x;
          const startY = points[0].y;

          // Draw anchor point
          ctx.fillStyle = "#8b5cf6";
          ctx.beginPath();
          ctx.arc(startX, startY, 6, 0, 2 * Math.PI);
          ctx.fill();

          // Draw VWAP line (simulated)
          ctx.strokeStyle = "#8b5cf6";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(startX, startY);

          // Simulate VWAP curve
          const endX = ctx.canvas.width;
          let prevY = startY;
          for (let x = startX; x < endX; x += 20) {
            const noise = (Math.random() - 0.5) * 10;
            const y = startY + noise + (x - startX) * 0.05;
            ctx.lineTo(x, y);
            prevY = y;
          }
          ctx.stroke();

          // Draw label
          ctx.font = "bold 13px sans-serif";
          const text = "VWAP";
          const textMetrics = ctx.measureText(text);

          ctx.fillStyle = "#8b5cf6";
          ctx.globalAlpha = 0.9;
          ctx.fillRect(startX + 10, startY - 25, textMetrics.width + 12, 20);
          ctx.globalAlpha = 1;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(text, startX + 16, startY - 11);
        }
        break;

      case "forecast":
      case "projection":
        if (points.length >= 2) {
          const startX = points[0].x;
          const startY = points[0].y;
          const endX = points[1].x;
          const endY = points[1].y;

          // Draw base line (solid)
          ctx.strokeStyle = "#f59e0b";
          ctx.lineWidth = 2;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          // Draw projection (dashed)
          const dx = endX - startX;
          const dy = endY - startY;
          ctx.setLineDash([10, 5]);
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX + dx, endY + dy);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw confidence zone
          ctx.fillStyle = "rgba(245, 158, 11, 0.1)";
          ctx.beginPath();
          ctx.moveTo(endX, endY - 20);
          ctx.lineTo(endX + dx, endY + dy - 30);
          ctx.lineTo(endX + dx, endY + dy + 30);
          ctx.lineTo(endX, endY + 20);
          ctx.closePath();
          ctx.fill();

          // Label
          ctx.font = "bold 13px sans-serif";
          const text = drawing.tool === "forecast" ? "Forecast" : "Projection";
          const textMetrics = ctx.measureText(text);

          ctx.fillStyle = "#f59e0b";
          ctx.globalAlpha = 0.9;
          ctx.fillRect(endX + 10, endY - 12, textMetrics.width + 12, 20);
          ctx.globalAlpha = 1;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(text, endX + 16, endY + 2);
        }
        break;

      case "fixed-range-volume":
      case "anchored-volume":
        if (points.length >= 2) {
          const x1 = Math.min(points[0].x, points[1].x);
          const x2 = Math.max(points[0].x, points[1].x);
          const y1 = Math.min(points[0].y, points[1].y);
          const y2 = Math.max(points[0].y, points[1].y);
          const height = y2 - y1;

          // Draw volume bars (simulated)
          ctx.fillStyle = "rgba(99, 102, 241, 0.3)";
          const barCount = 20;
          const barHeight = height / barCount;

          for (let i = 0; i < barCount; i++) {
            const y = y1 + i * barHeight;
            const volume = Math.random();
            const barWidth = (x2 - x1) * volume * 0.3;

            ctx.fillStyle = volume > 0.7 ? "rgba(239, 68, 68, 0.5)" : "rgba(99, 102, 241, 0.3)";
            ctx.fillRect(x2 - barWidth, y, barWidth, barHeight - 1);
          }

          // Draw POC line (Point of Control)
          const pocY = y1 + height * 0.6;
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 3]);
          ctx.beginPath();
          ctx.moveTo(x1, pocY);
          ctx.lineTo(x2, pocY);
          ctx.stroke();
          ctx.setLineDash([]);

          // Label
          ctx.font = "bold 12px sans-serif";
          const text = "POC";
          ctx.fillStyle = "#ef4444";
          ctx.globalAlpha = 0.9;
          ctx.fillRect(x2 + 5, pocY - 10, 40, 18);
          ctx.globalAlpha = 1;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(text, x2 + 11, pocY + 3);
        }
        break;

      case "bars-pattern":
      case "ghost-feed":
        if (points.length >= 2) {
          const x1 = points[0].x;
          const x2 = points[1].x;
          const baseY = points[0].y;

          // Draw historical bars pattern
          ctx.strokeStyle = "rgba(147, 51, 234, 0.6)";
          ctx.fillStyle = "rgba(147, 51, 234, 0.2)";
          ctx.lineWidth = 2;

          const barCount = Math.floor(Math.abs(x2 - x1) / 10);
          const barWidth = 6;

          for (let i = 0; i < barCount; i++) {
            const x = x1 + (i * (x2 - x1)) / barCount;
            const variation = (Math.random() - 0.5) * 40;
            const barHeight = 20 + Math.abs(variation);

            ctx.beginPath();
            ctx.rect(x - barWidth / 2, baseY + variation - barHeight / 2, barWidth, barHeight);
            ctx.fill();
            ctx.stroke();
          }

          // Label
          ctx.font = "bold 13px sans-serif";
          const text = drawing.tool === "bars-pattern" ? "Pattern" : "Ghost";
          const textMetrics = ctx.measureText(text);

          ctx.fillStyle = "#9333ea";
          ctx.globalAlpha = 0.9;
          ctx.fillRect(x1 + 5, baseY - 40, textMetrics.width + 12, 20);
          ctx.globalAlpha = 1;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(text, x1 + 11, baseY - 26);
        }
        break;
    }
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

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ cursor: getCursor() }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="absolute inset-0 w-full h-full"
        style={{
          pointerEvents: (locked || selectedTool === "cursor" || selectedTool === "crosshair") ? "none" : "auto",
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
});