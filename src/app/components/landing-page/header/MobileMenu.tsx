import { AnimatePresence, motion } from "motion/react";
import MobileNavLink from "./MobileNavLink";
import MobileLocaleSelector from "./MobileLocaleSelector";
import LoginButton from "./LoginButton";

type NavLinkItem = {
  label: string;
  href: string;
  action?: () => void;
};

export default function MobileMenu({
  mobileMenuOpen,
  onClose,
  navLinks,
  scrollToSection,
  onGetStarted,
}: {
  mobileMenuOpen: boolean;
  onClose: () => void;
  navLinks: NavLinkItem[];
  scrollToSection: (href: string) => void;
  onGetStarted: () => void;
}) {
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
            {navLinks.map((link) => {
              const key = `${link.href}-${link.label}`;
              return (
                <MobileNavLink
                  key={key}
                  link={link}
                  onNavigate={() => {
                    if (link.action) {
                      link.action();
                    } else {
                      scrollToSection(link.href);
                    }
                    onClose();
                  }}
                />
              );
            })}

            {/* Mobile Language Selector */}
            <div className="pt-2 border-t border-white/5 md:hidden">
              <MobileLocaleSelector onSelect={onClose} />
            </div>

            <div className="pt-2 border-t border-white/5">
              <LoginButton
                onClick={() => {
                  onGetStarted();
                  onClose();
                }}
                variant="mobile"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
