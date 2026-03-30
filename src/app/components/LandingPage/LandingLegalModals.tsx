import {
  CookiePolicyModal,
  LegalDisclaimerModal,
  ManifestoModal,
  PrivacyPolicyModal,
  RiskDisclosureModal,
  TermsModal,
} from "../TermsAndConditions";

interface LandingLegalModalsProps {
  termsOpen: boolean;
  cookieOpen: boolean;
  disclaimerOpen: boolean;
  manifestoOpen: boolean;
  privacyOpen: boolean;
  riskOpen: boolean;
  setTermsOpen: (v: boolean) => void;
  setCookieOpen: (v: boolean) => void;
  setDisclaimerOpen: (v: boolean) => void;
  setManifestoOpen: (v: boolean) => void;
  setPrivacyOpen: (v: boolean) => void;
  setRiskOpen: (v: boolean) => void;
}

export function LandingLegalModals({
  termsOpen,
  cookieOpen,
  disclaimerOpen,
  manifestoOpen,
  privacyOpen,
  riskOpen,
  setTermsOpen,
  setCookieOpen,
  setDisclaimerOpen,
  setManifestoOpen,
  setPrivacyOpen,
  setRiskOpen,
}: LandingLegalModalsProps) {
  return (
    <>
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
      <CookiePolicyModal isOpen={cookieOpen} onClose={() => setCookieOpen(false)} />
      <LegalDisclaimerModal isOpen={disclaimerOpen} onClose={() => setDisclaimerOpen(false)} />
      <ManifestoModal isOpen={manifestoOpen} onClose={() => setManifestoOpen(false)} />
      <PrivacyPolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <RiskDisclosureModal isOpen={riskOpen} onClose={() => setRiskOpen(false)} />
    </>
  );
}
