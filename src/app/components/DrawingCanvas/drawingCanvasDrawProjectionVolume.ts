import type { Drawing } from "./drawingCanvasTypes";

export function drawingCanvasDrawProjectionVolume(
  ctx: CanvasRenderingContext2D,
  drawing: Drawing,
  isDark: boolean,
  points: Drawing["points"]
): void {
  switch (drawing.tool) {
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
    default:
      break;
  }
}
