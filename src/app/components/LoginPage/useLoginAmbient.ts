import { useMemo } from "react";

export function useLoginAmbient() {
    const particles = useMemo(
        () =>
            Array.from({ length: 40 }).map((_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 3 + 1,
                duration: 3 + Math.random() * 6,
                delay: Math.random() * 5,
                driftX: (Math.random() - 0.5) * 60,
                driftY: -(20 + Math.random() * 50),
            })),
        []
    );

    const streaks = useMemo(
        () =>
            Array.from({ length: 8 }).map((_, i) => ({
                id: i,
                y: 10 + Math.random() * 80,
                width: 80 + Math.random() * 200,
                height: 0.5 + Math.random() * 1,
                duration: 2 + Math.random() * 3,
                delay: Math.random() * 4,
            })),
        []
    );

    return { particles, streaks };
}
