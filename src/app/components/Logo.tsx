import { motion } from "motion/react";
import { useTheme } from "../contexts/ThemeContext";
const logoImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'%3E%3Crect width='200' height='60' fill='%231a1a2e'/%3E%3Ctext x='100' y='38' font-family='Arial,sans-serif' font-size='24' font-weight='bold' fill='%236366f1' text-anchor='middle'%3EPHASE X%3C/text%3E%3C/svg%3E";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, animated = true, className = "" }: LogoProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sizes = {
    sm: {
      imageWidth: "120px",
      imageHeight: "40px",
    },
    md: {
      imageWidth: "180px",
      imageHeight: "60px",
    },
    lg: {
      imageWidth: "240px",
      imageHeight: "80px",
    },
  };

  const currentSize = sizes[size];

  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`relative rounded-2xl p-3 ${isDark
            ? "bg-gradient-to-br from-gray-800/50 to-gray-900/50 shadow-lg shadow-indigo-500/20"
            : "bg-gradient-to-br from-white to-gray-50 shadow-lg shadow-indigo-300/30"
          }`}
        animate={animated ? {
          boxShadow: isDark
            ? [
              "0 10px 30px rgba(99, 102, 241, 0.2)",
              "0 10px 40px rgba(139, 92, 246, 0.3)",
              "0 10px 30px rgba(99, 102, 241, 0.2)",
            ]
            : [
              "0 10px 30px rgba(99, 102, 241, 0.3)",
              "0 10px 40px rgba(139, 92, 246, 0.4)",
              "0 10px 30px rgba(99, 102, 241, 0.3)",
            ],
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.img
          src={logoImage}
          alt="PHASE X"
          style={{
            width: currentSize.imageWidth,
            height: currentSize.imageHeight,
            objectFit: "contain",
            // Add slight brightness boost in dark mode for better visibility
            filter: isDark ? "brightness(1.1) contrast(1.05)" : "brightness(1) contrast(1)",
          }}
          animate={animated ? {
            scale: [1, 1.02, 1],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
