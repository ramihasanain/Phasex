import { useState, useMemo } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { BreakingNews } from "../components/BreakingNews";
import {
  CookiePolicyModal,
  LegalDisclaimerModal,
  ManifestoModal,
  PrivacyPolicyModal,
  RiskDisclosureModal,
  TermsModal,
} from "../components/TermsAndConditions";
import { StartField } from "../components/landing-page/star-field/StarField";
import WrapStreak from "../components/landing-page/wrap-streak/WrapStreak";
import CometWithTails from "../components/landing-page/comet-with-tails/CometWithTails";
import SubtleNebulaGlow from "../components/landing-page/sublte-nebula-glow/SubtleNebulaGlow";
import Hero from "../components/landing-page/hero/Hero";
import DecisionEngine from "../components/landing-page/decision-engine/DecisionEngine";
import BrokerPartners from "../components/landing-page/broker-partners/BrokerPartners";
import WhoPaseXIsFor from "../components/landing-page/who-phaseX-is-for/WhoPaseXIsFor";
import Footer from "../components/landing-page/footer/Footer";
import Header from "../components/landing-page/header/Header";
import {
  generateComets,
  generateStars,
  generateWarpStreaks,
} from "../utils/landingPageBackground";
import ScreenshotsCarousel from "../components/landing-page/screenshots-carousel/ScreenshotsCarousel";
import WhatIsPhaseX from "../components/landing-page/what-is-phaseX/WhatIsPhaseX";
import WhyPhaseXExists from "../components/landing-page/why-phaseX-exists/WhyPhaseXExists";
import PhaseStates from "../components/landing-page/phaseX-states/PhaseStates";
import HowPhaseXIsDifferent from "../components/landing-page/how-phaseX-is-different/HowPhaseXIsDifferent";
import PlatformAccess from "../components/landing-page/platform-access/PlatformAccess";
import FinalStatement from "../components/landing-page/final-statement/FinalStatement";

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenDynamics: () => void;
}

export function LandingPage({
  onGetStarted,
  onOpenDynamics,
}: LandingPageProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [termsOpen, setTermsOpen] = useState(false);
  const [cookieOpen, setCookieOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [manifestoOpen, setManifestoOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [riskOpen, setRiskOpen] = useState(false);

  const accent = "#00e5a0";

  const stars = useMemo(() => generateStars(120), []);
  const warpStreaks = useMemo(() => generateWarpStreaks(15, accent), [accent]);
  const comets = useMemo(() => generateComets(6, accent), [accent]);

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        background: "#060a10",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {stars.map((s) => (
          <StartField key={s.id} s={s} />
        ))}
      </div>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {warpStreaks.map((s) => (
          <WrapStreak key={s.id} s={s} />
        ))}
      </div>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {comets.map((c) => (
          <CometWithTails key={c.id} c={c} />
        ))}
      </div>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(6,10,16,0.4) 70%, rgba(6,10,16,0.8) 100%)",
        }}
      />
      <SubtleNebulaGlow />
      <Header onOpenDynamics={onOpenDynamics} onGetStarted={onGetStarted} />
      <div className="relative z-40 bg-black/40 border-b border-white/5 py-2 overflow-hidden">
        <div className="container mx-auto px-4 max-w-[1700px]">
          <BreakingNews selectedSymbol="EURUSD" selectedCategory="All" />
        </div>
      </div>
      <Hero onGetStarted={onGetStarted} />
      <WhatIsPhaseX />
      <WhyPhaseXExists />
      <PhaseStates />
      <DecisionEngine />
      <ScreenshotsCarousel />
      <BrokerPartners />
      <HowPhaseXIsDifferent />
      <WhoPaseXIsFor />
      <PlatformAccess onGetStarted={onGetStarted} />
      <FinalStatement />
      <Footer
        setTermsOpen={setTermsOpen}
        setPrivacyOpen={setPrivacyOpen}
        setCookieOpen={setCookieOpen}
        setDisclaimerOpen={setDisclaimerOpen}
        setManifestoOpen={setManifestoOpen}
        setRiskOpen={setRiskOpen}
      />
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
      <CookiePolicyModal
        isOpen={cookieOpen}
        onClose={() => setCookieOpen(false)}
      />
      <LegalDisclaimerModal
        isOpen={disclaimerOpen}
        onClose={() => setDisclaimerOpen(false)}
      />
      <ManifestoModal
        isOpen={manifestoOpen}
        onClose={() => setManifestoOpen(false)}
      />
      <PrivacyPolicyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />
      <RiskDisclosureModal
        isOpen={riskOpen}
        onClose={() => setRiskOpen(false)}
      />
    </div>
  );
}
