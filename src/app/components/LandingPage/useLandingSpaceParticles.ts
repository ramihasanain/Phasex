import { useMemo } from "react";
import { ACCENT } from "./constants";

export function useLandingSpaceParticles() {
  const stars = useMemo(
    () =>
      Array.from({ length: 120 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        twinkle: 2 + Math.random() * 5,
        delay: Math.random() * 4,
      })),
    []
  );

  const warpStreaks = useMemo(
    () =>
      Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        y: Math.random() * 100,
        width: 100 + Math.random() * 300,
        height: 0.5 + Math.random() * 1.5,
        duration: 1 + Math.random() * 2,
        delay: Math.random() * 5,
        color: i % 3 === 0 ? ACCENT : i % 3 === 1 ? "#448aff" : "#a855f7",
      })),
    []
  );

  const comets = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        startY: 10 + Math.random() * 80,
        duration: 2 + Math.random() * 3,
        delay: i * 2.5 + Math.random() * 2,
        size: 3 + Math.random() * 4,
        tailLen: 80 + Math.random() * 120,
        color: [ACCENT, "#448aff", "#a855f7", "#00e5ff", "#ffc400", "#ff6e40"][i],
      })),
    []
  );

  return { stars, warpStreaks, comets };
}
