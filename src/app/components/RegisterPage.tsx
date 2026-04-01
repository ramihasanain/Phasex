import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage, type Language } from "../contexts/LanguageContext";
import type { RegisterPageProps } from "./RegisterPage/types";
import { useRegisterWizard } from "./RegisterPage/useRegisterWizard";
import { RegisterPageBackdrop } from "./RegisterPage/RegisterPageBackdrop";
import { RegisterPageMain } from "./RegisterPage/RegisterPageMain";
import { LoginPageLanguageMenu } from "./LoginPage/LoginPageLanguageMenu";

export type { RegisterPageProps, RegisterSubscriptionPlanRow } from "./RegisterPage/types";

export function RegisterPage({ onRegister, onBackToLogin, onBackToHome }: RegisterPageProps) {
  const w = useRegisterWizard({ onRegister, onBackToLogin });
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden p-4"
      dir="auto"
      style={{ background: "#060a10", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="absolute top-6 start-6 z-50 flex items-center gap-4">
        <motion.button
          type="button"
          onClick={onBackToHome}
          title={t("home")}
          aria-label={t("home")}
          initial={{ opacity: 0, x: isRTL ? 12 : -12 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex shrink-0 items-center justify-center w-11 h-11 rounded-xl cursor-pointer backdrop-blur-md transition-colors border border-white/10 text-white bg-[#0e1421]/80"
        >
          {isRTL ? <ArrowRight className="w-5 h-5" strokeWidth={2.5} /> : <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />}
        </motion.button>

        <LoginPageLanguageMenu
          accent={w.accent}
          accentG={w.accentG}
          language={w.language}
          langDropdownOpen={w.langDropdownOpen}
          setLangDropdownOpen={w.setLangDropdownOpen}
          setLanguageKey={(code) => w.setLanguageKey(code as Language)}
          languageOptions={w.languageOptions}
          currentLangObj={w.currentLangObj}
        />
      </div>

      <RegisterPageBackdrop w={w} />
      <RegisterPageMain w={w} />

      <motion.div className="absolute bottom-4 text-center z-10 left-0 right-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <span className="text-[10px] text-gray-700 tracking-[0.3em] uppercase font-semibold">PHASE X — STRUCTURAL DYNAMICS</span>
      </motion.div>
    </div>
  );
}
