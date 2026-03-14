import { motion } from "motion/react";
import { useTheme } from "../contexts/ThemeContext";
import logoDark from "../../assets/phasex logo Dark.png";
import logoLight from "../../assets/phasex logo Light.png";

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
    sm: { imageWidth: "160px", imageHeight: "55px" },
    md: { imageWidth: "220px", imageHeight: "75px" },
    lg: { imageWidth: "300px", imageHeight: "100px" },
  };

  const currentSize = sizes[size];
  const logoSrc = isDark ? logoDark : logoLight;

  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src={logoSrc}
        alt="PHASE X"
        style={{
          width: currentSize.imageWidth,
          height: currentSize.imageHeight,
          objectFit: "contain",
        }}
        animate={animated ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
