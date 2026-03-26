import { useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Menu, X } from "lucide-react";
import { Logo } from "../../Logo";
import Nav from "./Nav";
import LocaleSwitcher from "./LocaleSwitcher";
import LoginButton from "./LoginButton";
import MobileMenu from "./MobileMenu";

const accentG = "rgba(0,229,160,";

const Header = ({
  onOpenDynamics,
  onGetStarted,
}: {
  onOpenDynamics: () => void;
  onGetStarted: () => void;
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: t("home"), href: "#home" },
    {
      label: t("whatIsPhaseX"),
      href: "#what-is",
    },
    { label: t("states"), href: "#states" },
    { label: t("access"), href: "#access" },
    {
      label: t("structuralDynamics"),
      href: "#dynamics",
      action: onOpenDynamics,
    },
  ];

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl"
      style={{
        background: "rgba(6,10,16,0.85)",
        borderBottom: `1px solid ${accentG}0.08)`,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Logo size="sm" animated={true} />
          </motion.div>

          <Nav navLinks={navLinks} scrollToSection={scrollToSection} />

          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <LoginButton onClick={onGetStarted} variant="desktop" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          navLinks={navLinks}
          scrollToSection={scrollToSection}
          onGetStarted={onGetStarted}
        />
      </div>
    </header>
  );
};

export default Header;
