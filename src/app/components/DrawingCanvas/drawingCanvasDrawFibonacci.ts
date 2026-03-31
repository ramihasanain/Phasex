import type { Drawing } from "./drawingCanvasTypes";

export function drawingCanvasDrawFibonacci(
  ctx: CanvasRenderingContext2D,
  drawing: Drawing,
  isDark: boolean,
  points: Drawing["points"]
): void {
  switch (drawing.tool) {
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
    default:
      break;
  }
}
