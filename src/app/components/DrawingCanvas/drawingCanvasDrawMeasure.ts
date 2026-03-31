import type { Drawing } from "./drawingCanvasTypes";

export function drawingCanvasDrawMeasure(
  ctx: CanvasRenderingContext2D,
  drawing: Drawing,
  isDark: boolean,
  points: Drawing["points"]
): void {
  switch (drawing.tool) {
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
    default:
      break;
  }
}
