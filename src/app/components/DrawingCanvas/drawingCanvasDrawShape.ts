import type { Drawing } from "./drawingCanvasTypes";
import { drawingCanvasDrawGeometric } from "./drawingCanvasDrawGeometric";
import { drawingCanvasDrawFibonacci } from "./drawingCanvasDrawFibonacci";
import { drawingCanvasDrawBrushTextEmoji } from "./drawingCanvasDrawBrushTextEmoji";
import { drawingCanvasDrawLongShort } from "./drawingCanvasDrawLongShort";
import { drawingCanvasDrawMeasure } from "./drawingCanvasDrawMeasure";
import { drawingCanvasDrawProjectionVolume } from "./drawingCanvasDrawProjectionVolume";

const GEOMETRIC = new Set<Drawing["tool"]>([
  "trend-line", "horizontal-line", "vertical-line", "ray", "arrow",
  "rectangle", "circle", "triangle",
]);
const FIB = new Set<Drawing["tool"]>(["fibonacci"]);
const BRUSH_TEXT = new Set<Drawing["tool"]>(["brush", "text", "emoji"]);
const POSITION = new Set<Drawing["tool"]>(["long-position", "short-position"]);
const MEASURE = new Set<Drawing["tool"]>([
  "price-range", "date-range", "date-price-range", "anchored-vwap",
]);
const PROJ = new Set<Drawing["tool"]>([
  "forecast", "projection", "fixed-range-volume", "anchored-volume",
  "bars-pattern", "ghost-feed",
]);

export function drawShape(
  ctx: CanvasRenderingContext2D,
  drawing: Drawing,
  isDark: boolean
): void {
  ctx.strokeStyle = drawing.color;
  ctx.fillStyle = drawing.color;
  ctx.lineWidth = drawing.width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const points = drawing.points;
  if (points.length === 0) return;

  const tool = drawing.tool;
  if (GEOMETRIC.has(tool)) {
    drawingCanvasDrawGeometric(ctx, drawing, isDark, points);
    return;
  }
  if (FIB.has(tool)) {
    drawingCanvasDrawFibonacci(ctx, drawing, isDark, points);
    return;
  }
  if (BRUSH_TEXT.has(tool)) {
    drawingCanvasDrawBrushTextEmoji(ctx, drawing, isDark, points);
    return;
  }
  if (POSITION.has(tool)) {
    drawingCanvasDrawLongShort(ctx, drawing, isDark, points);
    return;
  }
  if (MEASURE.has(tool)) {
    drawingCanvasDrawMeasure(ctx, drawing, isDark, points);
    return;
  }
  if (PROJ.has(tool)) {
    drawingCanvasDrawProjectionVolume(ctx, drawing, isDark, points);
    return;
  }
}
