import { motion } from "motion/react";

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    driftX: number;
    driftY: number;
}

interface Streak {
    id: number;
    y: number;
    width: number;
    height: number;
    duration: number;
    delay: number;
}

interface LoginPageBackdropProps {
    accent: string;
    accentG: string;
    particles: Particle[];
    streaks: Streak[];
}

export function LoginPageBackdrop({ accent, accentG, particles, streaks }: LoginPageBackdropProps) {
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
                <motion.div
                    className="absolute w-[300px] h-[300px] rounded-full"
                    style={{
                        top: "40%",
                        left: "50%",
                        background: "radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%)",
                        filter: "blur(40px)",
                    }}
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute rounded-full"
                        style={{
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            width: p.size,
                            height: p.size,
                            backgroundColor: accent,
                            boxShadow: `0 0 ${4 + p.size * 3}px ${accent}`,
                        }}
                        animate={{ x: [0, p.driftX], y: [0, p.driftY], opacity: [0, 0.7, 0], scale: [0.5, 1.3, 0.2] }}
                        transition={{ duration: p.duration, repeat: Infinity, ease: "easeOut", delay: p.delay }}
                    />
                ))}
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {streaks.map((s) => (
                    <motion.div
                        key={s.id}
                        className="absolute rounded-full"
                        style={{
                            top: `${s.y}%`,
                            width: s.width,
                            height: s.height,
                            background: `linear-gradient(90deg, transparent, ${accent}40, transparent)`,
                        }}
                        animate={{ left: ["-15%", "115%"] }}
                        transition={{ duration: s.duration, repeat: Infinity, ease: "linear", delay: s.delay }}
                    />
                ))}
            </div>

            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(${accentG}0.02) 1px, transparent 1px), linear-gradient(90deg, ${accentG}0.02) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />
        </>
    );
}
