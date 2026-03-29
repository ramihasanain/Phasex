import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import type { RefObject } from "react";
import type { Language, LanguageContextType } from "../../contexts/LanguageContext";
import { Logo } from "../Logo";
import { languageOptions } from "../../utils/languageOptions";
import { ACCENT, ACCENT_G } from "./constants";
import { LandingDesktopNav } from "./LandingDesktopNav";
import { LandingHeaderLanguageMenu } from "./LandingHeaderLanguageMenu";
import { LandingHeaderMobileDrawer } from "./LandingHeaderMobileDrawer";
import type { NavLinkItem } from "./landingNavTypes";

interface LandingHeaderProps {
  dropdownRef: RefObject<HTMLDivElement | null>;
  navLinks: NavLinkItem[];
  scrollToSection: (href: string) => void;
  onGetStarted: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  langDropdownOpen: boolean;
  setLangDropdownOpen: (open: boolean) => void;
  currentLangObj: (typeof languageOptions)[number];
  language: Language;
  onLanguageChange: LanguageContextType["setLanguageKey"];
  isRTL: boolean;
  t: (key: string) => string;
}

export function LandingHeader({
  dropdownRef,
  navLinks,
  scrollToSection,
  onGetStarted,
  mobileMenuOpen,
  setMobileMenuOpen,
  langDropdownOpen,
  setLangDropdownOpen,
  currentLangObj,
  language,
  onLanguageChange,
  isRTL,
  t,
}: LandingHeaderProps) {
  const accent = ACCENT;
  const accentG = ACCENT_G;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: "rgba(6,10,16,0.85)", borderBottom: `1px solid ${accentG}0.08)` }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <Logo size="sm" animated={true} />
          </motion.div>

          <LandingDesktopNav navLinks={navLinks} scrollToSection={scrollToSection} />

          <div className="flex items-center gap-2">
            <LandingHeaderLanguageMenu
              dropdownRef={dropdownRef}
              langDropdownOpen={langDropdownOpen}
              setLangDropdownOpen={setLangDropdownOpen}
              currentLangObj={currentLangObj}
              language={language}
              setLanguageKey={onLanguageChange}
              isRTL={isRTL}
            />

            <motion.button
              onClick={onGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex px-5 py-2 rounded-lg text-sm font-bold tracking-wider cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${accent}, #00c890)`, color: "#060a10" }}
            >
              {t("loginBtn")}
            </motion.button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <LandingHeaderMobileDrawer
          mobileMenuOpen={mobileMenuOpen}
          navLinks={navLinks}
          scrollToSection={scrollToSection}
          onGetStarted={onGetStarted}
          language={language}
          setLanguageKey={onLanguageChange}
          setMobileMenuOpen={setMobileMenuOpen}
          t={t}
        />
      </div>
    </header>
  );
}
