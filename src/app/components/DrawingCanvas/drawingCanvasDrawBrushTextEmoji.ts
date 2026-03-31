import type { Drawing } from "./drawingCanvasTypes";

export function drawingCanvasDrawBrushTextEmoji(
  ctx: CanvasRenderingContext2D,
  drawing: Drawing,
  _isDark: boolean,
  points: Drawing["points"]
): void {
  switch (drawing.tool) {
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
    default:
      break;
  }
}
