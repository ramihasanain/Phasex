import { motion } from "motion/react";
import { ACCENT, ACCENT_G } from "./constants";
import type { NavLinkItem } from "./landingNavTypes";

interface LandingDesktopNavProps {
  navLinks: NavLinkItem[];
  scrollToSection: (href: string) => void;
}

export function LandingDesktopNav({ navLinks, scrollToSection }: LandingDesktopNavProps) {
  const accent = ACCENT;
  const accentG = ACCENT_G;

  return (
    <nav className="hidden lg:flex items-center gap-6">
      {navLinks.map((link, i) => {
        const isSpecial = !!link.action;
        return isSpecial ? (
          <motion.a
            key={i}
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              link.action?.();
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="text-sm font-bold relative group cursor-pointer flex items-center gap-1.5"
            style={{ color: accent }}
          >
            <motion.span
              animate={{ textShadow: [`0 0 8px ${accentG}0.3)`, `0 0 20px ${accentG}0.6)`, `0 0 8px ${accentG}0.3)`] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {link.label}
            </motion.span>
            <motion.span
              className="text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded-md"
              style={{
                background: `${accentG}0.15)`,
                border: `1px solid ${accentG}0.3)`,
                color: accent,
                boxShadow: `0 0 10px ${accentG}0.2)`,
              }}
              animate={{ opacity: [0.7, 1, 0.7], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✦
            </motion.span>
            <motion.span
              className="absolute -bottom-1 left-0 h-[2px] rounded-full"
              style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
              animate={{ width: ["0%", "100%", "0%"], opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.a>
        ) : (
          <motion.a
            key={i}
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(link.href);
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group cursor-pointer"
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] group-hover:w-full transition-all" style={{ background: accent }} />
          </motion.a>
        );
      })}
    </nav>
  );
}
