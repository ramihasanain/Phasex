import { motion } from "motion/react";
import { Linkedin, Mail, Twitter } from "lucide-react";
import {
  CookieButton,
  LegalDisclaimerButton,
  ManifestoButton,
  PrivacyPolicyButton,
  RiskDisclosureButton,
  TermsButton,
} from "../TermsAndConditions";
import { Logo } from "../Logo";
import { ACCENT, ACCENT_G } from "./constants";
import type { LandingT } from "./landingTypes";

interface LandingFooterProps {
  t: LandingT;
  setTermsOpen: (v: boolean) => void;
  setCookieOpen: (v: boolean) => void;
  setDisclaimerOpen: (v: boolean) => void;
  setManifestoOpen: (v: boolean) => void;
  setPrivacyOpen: (v: boolean) => void;
  setRiskOpen: (v: boolean) => void;
}

export function LandingFooter({
  t,
  setTermsOpen,
  setCookieOpen,
  setDisclaimerOpen,
  setManifestoOpen,
  setPrivacyOpen,
  setRiskOpen,
}: LandingFooterProps) {
  const accent = ACCENT;
  const accentG = ACCENT_G;

  return (
    <footer className="py-12 relative z-10" style={{ borderTop: `1px solid ${accentG}0.06)` }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-8">
          <div className="text-center md:text-left flex-shrink-0">
            <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
              <Logo size="sm" animated={false} />
              <span className="text-2xl font-black" style={{ color: accent }}>PHASE X</span>
            </div>
            <p className="text-sm text-gray-400 font-light">The Market, Rewritten</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end">
            {[
              { icon: Twitter, hc: "#1da1f2" },
              { icon: Linkedin, hc: "#0077b5" },
              { icon: Mail, hc: accent },
            ].map((social, i) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={`s-${i}`}
                  href="#"
                  whileHover={{ scale: 1.12, y: -2 }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-all cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              );
            })}

            <div className="w-[1px] h-6 mx-1" style={{ background: "rgba(255,255,255,0.08)" }} />

            <TermsButton onClick={() => setTermsOpen(true)} />
            <PrivacyPolicyButton onClick={() => setPrivacyOpen(true)} />
            <CookieButton onClick={() => setCookieOpen(true)} />
            <LegalDisclaimerButton onClick={() => setDisclaimerOpen(true)} />
            <RiskDisclosureButton onClick={() => setRiskOpen(true)} />
            <ManifestoButton onClick={() => setManifestoOpen(true)} />
          </div>
        </div>

        <div className="pt-5 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <p className="text-[11px] text-gray-600">
            © 2024 PHASE X AI. {t("allRightsReserved")} — Structural Market Intelligence Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
