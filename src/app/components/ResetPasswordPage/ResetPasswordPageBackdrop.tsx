import { motion } from "motion/react";

type Particle = {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    driftX: number;
    driftY: number;
};

export function ResetPasswordPageBackdrop({
    accent,
    accentG,
    particles,
}: {
    accent: string;
    accentG: string;
    particles: Particle[];
}) {
    return (
        <>
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full"
                    style={{
                        top: "-20%",
                        left: "-10%",
                        background: `radial-gradient(circle, ${accentG}0.08) 0%, transparent 70%)`,
                        filter: "blur(60px)",
                    }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full"
                    style={{
                        bottom: "-15%",
                        right: "-5%",
                        background: `radial-gradient(circle, ${accentG}0.06) 0%, transparent 70%)`,
                        filter: "blur(50px)",
                    }}
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        backgroundColor: accent,
                        opacity: 0,
                    }}
                    animate={{ opacity: [0, 0.6, 0], x: p.driftX, y: p.driftY }}
                    transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeOut" }}
                />
            ))}
        </>
    );
}
