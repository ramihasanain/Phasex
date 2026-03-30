import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { languageOptions } from "../utils/languageOptions";
import { buildMarketStates } from "../components/LandingPage/buildMarketStates";
import { buildScreenshots } from "../components/LandingPage/screenshotsData";
import { LandingBreakingNewsStrip } from "../components/LandingPage/LandingBreakingNewsStrip";
import { LandingBrokerPartnersSection } from "../components/LandingPage/LandingBrokerPartnersSection";
import { LandingDecisionEngineSection } from "../components/LandingPage/LandingDecisionEngineSection";
import { LandingFinalStatement } from "../components/LandingPage/LandingFinalStatement";
import { LandingFooter } from "../components/LandingPage/LandingFooter";
import { LandingHeader } from "../components/LandingPage/LandingHeader";
import { LandingHero } from "../components/LandingPage/LandingHero";
import { LandingHowDifferentSection } from "../components/LandingPage/LandingHowDifferentSection";
import { LandingLegalModals } from "../components/LandingPage/LandingLegalModals";
import { LandingMarketStatesSection } from "../components/LandingPage/LandingMarketStatesSection";
import { LandingPlatformAccessSection } from "../components/LandingPage/LandingPlatformAccessSection";
import { LandingScreenshotsSection } from "../components/LandingPage/LandingScreenshotsSection";
import { LandingSpaceBackground } from "../components/LandingPage/LandingSpaceBackground";
import { LandingWhatIsSection } from "../components/LandingPage/LandingWhatIsSection";
import { LandingWhoIsItForSection } from "../components/LandingPage/LandingWhoIsItForSection";
import { LandingWhyExistsSection } from "../components/LandingPage/LandingWhyExistsSection";
import type { NavLinkItem } from "../components/LandingPage/landingNavTypes";
import { useLandingSpaceParticles } from "../components/LandingPage/useLandingSpaceParticles";

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenDynamics: () => void;
}

export function LandingPage({ onGetStarted, onOpenDynamics }: LandingPageProps) {
  const { language, setLanguageKey, t } = useLanguage();
  const isRTL = language === "ar";
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [termsOpen, setTermsOpen] = useState(false);
  const [cookieOpen, setCookieOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [manifestoOpen, setManifestoOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [riskOpen, setRiskOpen] = useState(false);
  const [expandedState, setExpandedState] = useState<number | null>(null);
  const [flippedBroker, setFlippedBroker] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLangObj = languageOptions.find((l) => l.code === language) || languageOptions[1];

  const navLinks: NavLinkItem[] = useMemo(
    () => [
      { label: t("home") || (isRTL ? "الرئيسية" : "Home"), href: "#home" },
      { label: t("whatIsPhaseX") || (isRTL ? "ما هو PHASE X" : "What is PHASE X"), href: "#what-is" },
      { label: t("states") || (isRTL ? "المؤشرات" : "States"), href: "#states" },
      { label: t("access") || (isRTL ? "الوصول" : "Access"), href: "#access" },
      { label: t("structuralDynamics") || (isRTL ? "التحليل الهيكلي" : "Structural Dynamics"), href: "#dynamics", action: onOpenDynamics },
    ],
    [t, isRTL, onOpenDynamics]
  );

  const screenshots = useMemo(() => buildScreenshots(isRTL), [isRTL]);
  const states = useMemo(() => buildMarketStates(t), [t]);
  const { stars, warpStreaks, comets } = useLandingSpaceParticles();

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" dir={isRTL ? "rtl" : "ltr"} style={{ background: "#060a10", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <LandingSpaceBackground stars={stars} warpStreaks={warpStreaks} comets={comets} />

      <LandingHeader
        dropdownRef={dropdownRef}
        navLinks={navLinks}
        scrollToSection={scrollToSection}
        onGetStarted={onGetStarted}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        langDropdownOpen={langDropdownOpen}
        setLangDropdownOpen={setLangDropdownOpen}
        currentLangObj={currentLangObj}
        language={language}
        onLanguageChange={setLanguageKey}
        isRTL={isRTL}
        t={t}
      />

      <LandingBreakingNewsStrip />

      <LandingHero t={t} onGetStarted={onGetStarted} />
      <LandingWhatIsSection t={t} />
      <LandingWhyExistsSection t={t} />
      <LandingMarketStatesSection states={states} expandedState={expandedState} setExpandedState={setExpandedState} t={t} />
      <LandingDecisionEngineSection t={t} isRTL={isRTL} />
      <LandingScreenshotsSection
        t={t}
        isRTL={isRTL}
        screenshots={screenshots}
        currentScreenshot={currentScreenshot}
        setCurrentScreenshot={setCurrentScreenshot}
      />
      <LandingBrokerPartnersSection t={t} flippedBroker={flippedBroker} setFlippedBroker={setFlippedBroker} />
      <LandingHowDifferentSection t={t} />
      <LandingWhoIsItForSection t={t} />
      <LandingPlatformAccessSection t={t} onGetStarted={onGetStarted} />
      <LandingFinalStatement t={t} />

      <LandingFooter
        t={t}
        setTermsOpen={setTermsOpen}
        setCookieOpen={setCookieOpen}
        setDisclaimerOpen={setDisclaimerOpen}
        setManifestoOpen={setManifestoOpen}
        setPrivacyOpen={setPrivacyOpen}
        setRiskOpen={setRiskOpen}
      />

      <LandingLegalModals
        termsOpen={termsOpen}
        cookieOpen={cookieOpen}
        disclaimerOpen={disclaimerOpen}
        manifestoOpen={manifestoOpen}
        privacyOpen={privacyOpen}
        riskOpen={riskOpen}
        setTermsOpen={setTermsOpen}
        setCookieOpen={setCookieOpen}
        setDisclaimerOpen={setDisclaimerOpen}
        setManifestoOpen={setManifestoOpen}
        setPrivacyOpen={setPrivacyOpen}
        setRiskOpen={setRiskOpen}
      />
    </div>
  );
}
