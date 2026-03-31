import type { Drawing } from "./drawingCanvasTypes";

export function drawingCanvasDrawLongShort(
  ctx: CanvasRenderingContext2D,
  drawing: Drawing,
  _isDark: boolean,
  points: Drawing["points"]
): void {
  switch (drawing.tool) {
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
    default:
      break;
  }
}
