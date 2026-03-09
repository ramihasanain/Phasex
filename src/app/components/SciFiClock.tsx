import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface SciFiClockProps {
    isLive: boolean;
    label: string;
    timeMs?: number | null;
    isRTL?: boolean;
    accent?: string;
    mode?: "lastUpdate" | "currentTime";
    size?: "normal" | "sm";
}

export const SciFiClock = ({ isLive, label, timeMs, isRTL, accent = "#00e676", mode = "lastUpdate", size = "normal" }: SciFiClockProps) => {
    const [time, setTime] = useState(timeMs ? new Date(timeMs) : new Date());

    useEffect(() => {
        if (mode === "currentTime") {
            const interval = setInterval(() => setTime(new Date()), 1000);
            return () => clearInterval(interval);
        } else if (timeMs) {
            setTime(new Date(timeMs));
        }
    }, [mode, timeMs]);

    const hh = time.getHours().toString().padStart(2, '0');
    const mm = time.getMinutes().toString().padStart(2, '0');
    const ss = time.getSeconds().toString().padStart(2, '0');

    const primaryColor = mode === "currentTime" ? "#00c8ff" : accent;
    const shadowColor = mode === "currentTime" ? "rgba(0, 200, 255, " : "rgba(0, 230, 118, ";

    const isSm = size === "sm";

    return (
        <div className={`flex flex-col items-center justify-center relative ${isSm ? "p-1.5 min-w-[100px] rounded-lg" : "p-3 min-w-[150px] rounded-2xl"} overflow-hidden`}
            style={{
                background: "linear-gradient(180deg, rgba(16,25,35,0.7) 0%, rgba(8,12,20,0.95) 100%)",
                border: `1px solid ${primaryColor}40`,
                boxShadow: `0 0 15px ${shadowColor}0.15), inset 0 0 20px ${shadowColor}0.05)`,
                backdropFilter: "blur(12px)"
            }}>

            {/* Radar / Sweep effect */}
            {mode === "currentTime" && (
                <motion.div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{ background: `linear-gradient(90deg, transparent, ${shadowColor}0.15), transparent)` }}
                    animate={{ left: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
            )}
            {mode === "lastUpdate" && isLive && (
                <motion.div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{ background: `linear-gradient(180deg, transparent, ${shadowColor}0.1), transparent)` }}
                    animate={{ top: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
            )}

            <div className={`${isSm ? "text-[8px] mb-0.5" : "text-[10px] mb-1"} text-gray-400 tracking-[0.2em] font-bold uppercase z-10 flex items-center gap-1.5`}
                style={{ direction: isRTL ? "rtl" : "ltr" }}>
                {mode === "currentTime" && (
                    <motion.div className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: primaryColor, boxShadow: `0 0 6px ${primaryColor}` }}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1.5, repeat: Infinity }} />
                )}
                {label}
            </div>

            <div className={`flex items-center gap-1 font-mono ${isSm ? "text-xl" : "text-3xl"} font-black italic tracking-wider z-10`}
                style={{
                    color: primaryColor,
                    textShadow: `0 0 10px ${shadowColor}0.4), 0 0 25px ${shadowColor}0.2)`
                }}>
                <span>{hh}</span>
                <motion.span
                    animate={mode === "currentTime" ? { opacity: [1, 0.2, 1] } : {}}
                    transition={mode === "currentTime" ? { duration: 1, repeat: Infinity } : {}}>
                    :
                </motion.span>
                <span>{mm}</span>
                <motion.span
                    className={`${isSm ? "text-xs mt-1" : "text-lg mt-1.5"} opacity-70 ml-0.5`}
                    animate={mode === "currentTime" ? { opacity: [0.7, 0.1, 0.7] } : {}}
                    transition={mode === "currentTime" ? { duration: 1, repeat: Infinity, delay: 0.1 } : {}}>
                    {ss}
                </motion.span>
            </div>

            {/* Hexagon tech overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${primaryColor} 2px, ${primaryColor} 3px)`,
                    backgroundSize: "100% 4px"
                }}
            />
        </div>
    );
};
