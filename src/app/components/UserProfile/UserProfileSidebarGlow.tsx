import { motion } from "motion/react";
import type { PlanTheme } from "./types";

export function UserProfileSidebarGlow({ theme }: { theme: PlanTheme }) {
    return (
        <>
            <motion.div
                className="absolute top-[-100px] left-[-50px] w-[300px] h-[300px] rounded-full pointer-events-none"
                animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ background: `radial-gradient(circle, ${theme.color}30 0%, transparent 70%)`, filter: "blur(60px)" }}
            />
            <motion.div
                className="absolute bottom-[-80px] right-[-60px] w-[250px] h-[250px] rounded-full pointer-events-none"
                animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{ background: `radial-gradient(circle, ${theme.color}20 0%, transparent 70%)`, filter: "blur(50px)" }}
            />
        </>
    );
}
