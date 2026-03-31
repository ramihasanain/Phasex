import type { Drawing } from "./drawingCanvasTypes";

export function drawingCanvasDrawGeometric(
  ctx: CanvasRenderingContext2D,
  drawing: Drawing,
  isDark: boolean,
  points: Drawing["points"]
): void {
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
    default:
      break;
  }
}
