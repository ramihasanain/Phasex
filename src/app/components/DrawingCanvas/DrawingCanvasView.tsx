import React from "react";

export type DrawingCanvasViewProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: () => void;
  getCursor: () => string;
  locked: boolean;
  selectedTool: string;
  visible: boolean;
};

export function DrawingCanvasView({
  canvasRef,
  containerRef,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  getCursor,
  locked,
  selectedTool,
  visible,
}: DrawingCanvasViewProps) {
  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-auto" style={{ cursor: getCursor() }}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="absolute inset-0 w-full h-full"
        style={{
          pointerEvents: locked || selectedTool === "cursor" || selectedTool === "crosshair" ? "none" : "auto",
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}
