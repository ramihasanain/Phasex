import React, { useMemo } from "react";
import { motion } from "framer-motion";

/* ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  F1 Racing Cinematic Effects ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  */

/* Speed Streaks — horizontal racing lines that fly across the banner */
export const SpeedStreaks = ({ color }: { color: string }) => {
    const streaks = useMemo(() => Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        y: 8 + Math.random() * 84,
        width: 60 + Math.random() * 200,
        height: 0.5 + Math.random() * 1.5,
        duration: 1.2 + Math.random() * 2,
        delay: Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.5,
    })), []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {streaks.map(s => (
                <motion.div
                    key={s.id}
                    className="absolute rounded-full"
                    style={{
                        top: `${s.y}%`,
                        width: s.width,
                        height: s.height,
                        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                        filter: `blur(${s.height > 1 ? 1 : 0}px)`,
                        boxShadow: `0 0 8px ${color}`,
                    }}
                    animate={{ left: ["-15%", "115%"] }}
                    transition={{
                        duration: s.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: s.delay,
                    }}
                />
            ))}
        </div>
    );
};

/* Energy Wave — powerful SVG wave grid */
export const EnergyWaves = ({ color }: { color: string }) => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="w-full h-full" preserveAspectRatio="none" style={{ opacity: 0.4 }}>
            {[20, 40, 55, 70, 85].map((y, i) => (
                <motion.path
                    key={i}
                    d={`M-200 ${y} Q 300 ${y - 30}, 600 ${y} T 1400 ${y} T 2200 ${y}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={1.5 - i * 0.2}
                    animate={{
                        d: [
                            `M-200 ${y} Q 300 ${y - 30}, 600 ${y} T 1400 ${y} T 2200 ${y}`,
                            `M-200 ${y} Q 300 ${y + 40}, 600 ${y} T 1400 ${y} T 2200 ${y}`,
                            `M-200 ${y} Q 300 ${y - 30}, 600 ${y} T 1400 ${y} T 2200 ${y}`,
                        ],
                        opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{ duration: 4 + i * 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
                />
            ))}
        </svg>
    </div>
);

/* Particle Emitter — sparks flying like exhaust particles */
export const RacingParticles = ({ color }: { color: string }) => {
    const particles = useMemo(() => Array.from({ length: 90 }).map((_, i) => ({
        id: i,
        startX: Math.random() * 50 + 25,
        startY: Math.random() * 100,
        size: Math.random() * 2.5 + 0.4,
        duration: 2 + Math.random() * 5,
        delay: Math.random() * 6,
        driftX: (Math.random() - 0.5) * 80,
        driftY: -(20 + Math.random() * 60),
    })), []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map(p => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${p.startX}%`,
                        top: `${p.startY}%`,
                        width: p.size,
                        height: p.size,
                        backgroundColor: color,
                        boxShadow: `0 0 ${6 + p.size * 4}px ${color}`,
                    }}
                    animate={{
                        x: [0, p.driftX],
                        y: [0, p.driftY],
                        opacity: [0, 0.9, 0],
                        scale: [0.5, 1.5, 0.2],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: p.delay,
                    }}
                />
            ))}
        </div>
    );
};

/* LED Border Pulse — racing car LED strips */
export const LEDBorderPulse = ({ color }: { color: string }) => (
    <>
        {/* Top LED strip */}
        <motion.div className="absolute top-0 left-0 right-0 h-[2px] z-30"
            style={{ background: `linear-gradient(90deg, transparent 5%, ${color} 30%, ${color} 70%, transparent 95%)` }}
            animate={{ opacity: [0.2, 1, 0.2], scaleX: [0.7, 1, 0.7] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Bottom LED strip */}
        <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] z-30"
            style={{ background: `linear-gradient(90deg, transparent 10%, ${color}80 40%, ${color}80 60%, transparent 90%)` }}
            animate={{ opacity: [0.1, 0.7, 0.1], scaleX: [0.8, 1.1, 0.8] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        {/* Left LED strip */}
        <motion.div className="absolute top-0 bottom-0 left-0 w-[2px] z-30"
            style={{ background: `linear-gradient(180deg, ${color} 0%, transparent 60%)` }}
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Right LED strip */}
        <motion.div className="absolute top-0 bottom-0 right-0 w-[2px] z-30"
            style={{ background: `linear-gradient(180deg, ${color} 0%, transparent 60%)` }}
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
    </>
);

/* Heat Haze — radial glow that breathes intensely */
export const HeatHaze = ({ color }: { color: string }) => (
    <>
        <motion.div className="absolute inset-0 z-0"
            animate={{
                background: [
                    `radial-gradient(ellipse 60% 80% at 75% 50%, ${color}22 0%, transparent 50%), radial-gradient(ellipse 40% 60% at 20% 40%, ${color}11 0%, transparent 40%)`,
                    `radial-gradient(ellipse 80% 100% at 75% 50%, ${color}33 0%, transparent 50%), radial-gradient(ellipse 50% 70% at 25% 60%, ${color}22 0%, transparent 40%)`,
                    `radial-gradient(ellipse 60% 80% at 75% 50%, ${color}22 0%, transparent 50%), radial-gradient(ellipse 40% 60% at 20% 40%, ${color}11 0%, transparent 40%)`,
                ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Corner bloom */}
        <motion.div className="absolute -top-10 -right-10 w-72 h-72 rounded-full z-0"
            style={{ background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`, filter: "blur(30px)" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
    </>
);
