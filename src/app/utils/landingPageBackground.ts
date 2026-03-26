export function generateStars(count: number = 120) {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.6 + 0.2,
    twinkle: 2 + Math.random() * 5,
    delay: Math.random() * 4,
  }));
}

export function generateWarpStreaks(
  count: number = 15,
  accent: string = "#00e5a0",
) {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    y: Math.random() * 100,
    width: 100 + Math.random() * 300,
    height: 0.5 + Math.random() * 1.5,
    duration: 1 + Math.random() * 2,
    delay: Math.random() * 5,
    color: i % 3 === 0 ? accent : i % 3 === 1 ? "#448aff" : "#a855f7",
  }));
}

export function generateComets(
  count: number = 6,
  accent: string = "#00e5a0",
) {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    startY: 10 + Math.random() * 80,
    duration: 2 + Math.random() * 3,
    delay: i * 2.5 + Math.random() * 2,
    size: 3 + Math.random() * 4,
    tailLen: 80 + Math.random() * 120,
    color: [accent, "#448aff", "#a855f7", "#00e5ff", "#ffc400", "#ff6e40"][i],
  }));
}

