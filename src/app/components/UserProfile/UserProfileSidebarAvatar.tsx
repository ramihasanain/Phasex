import { motion } from "motion/react";
import { User } from "lucide-react";
import type { PlanTheme } from "./types";

export function UserProfileSidebarAvatar({ theme }: { theme: PlanTheme }) {
    return (
        <motion.div
            className="w-28 h-28 rounded-full mb-5 relative flex items-center justify-center z-10"
            animate={{ boxShadow: [`0 0 20px ${theme.glow}`, `0 0 40px ${theme.glow}`, `0 0 20px ${theme.glow}`] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
                background: `linear-gradient(135deg, ${theme.color}15, rgba(0,0,0,0.6))`,
                border: `2px solid ${theme.color}`,
            }}
        >
            <User size={48} style={{ color: theme.color }} strokeWidth={1.5} />
            <div
                className="absolute -bottom-1 -right-1 w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-lg"
                style={{ background: theme.gradient, border: `2px solid #0b0e14` }}
            >
                {theme.icon}
            </div>
        </motion.div>
    );
}
