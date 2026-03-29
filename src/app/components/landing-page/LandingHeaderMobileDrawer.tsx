import { AnimatePresence, motion } from "motion/react";
import type { Language } from "../../contexts/LanguageContext";
import { languageOptions } from "../../utils/languageOptions";
import { ACCENT, ACCENT_G } from "./constants";
import type { NavLinkItem } from "./landingNavTypes";

interface LandingHeaderMobileDrawerProps {
  mobileMenuOpen: boolean;
  navLinks: NavLinkItem[];
  scrollToSection: (href: string) => void;
  onGetStarted: () => void;
  language: Language;
  setLanguageKey: (lang: Language) => void;
  setMobileMenuOpen: (open: boolean) => void;
  t: (key: string) => string;
}

export function LandingHeaderMobileDrawer({
  mobileMenuOpen,
  navLinks,
  scrollToSection,
  onGetStarted,
  language,
  setLanguageKey,
  setMobileMenuOpen,
  t,
}: LandingHeaderMobileDrawerProps) {
  const accent = ACCENT;
  const accentG = ACCENT_G;

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden overflow-hidden"
        >
          <div className="py-3 space-y-1">
            {navLinks.map((link, i) => {
              const isSpecial = !!link.action;
              return (
                <a
                  key={i}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    isSpecial ? link.action?.() : scrollToSection(link.href);
                  }}
                  className={`block py-2 px-4 rounded-lg transition-colors text-sm cursor-pointer ${
                    isSpecial ? "font-bold" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                  style={isSpecial ? { color: accent, background: `${accentG}0.06)`, border: `1px solid ${accentG}0.15)` } : undefined}
                >
                  {link.label} {isSpecial && <span className="text-[8px] ml-1">✦</span>}
                </a>
              );
            })}
            <div className="pt-2 border-t border-white/5 md:hidden">
              <div className="flex flex-wrap gap-2 px-4 py-2">
                {languageOptions.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguageKey(lang.code as Language);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      language === lang.code ? "bg-white/10 text-white font-bold" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                    }`}
                    style={{
                      border: language === lang.code ? `1px solid ${accent}40` : "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <img src={`https://flagcdn.com/${lang.flagUrl}.svg`} alt={lang.code} className="w-4 h-auto rounded-sm" />
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-white/5">
              <button onClick={onGetStarted} className="w-full py-2.5 rounded-lg text-sm font-bold cursor-pointer" style={{ background: accent, color: "#060a10" }}>
                {t("loginBtn")}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
