import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import type { Language } from "../../contexts/LanguageContext";
import type { RegisterWizardValue } from "./useRegisterWizard";

type Props = { w: RegisterWizardValue };

export function RegisterPageBackdrop({ w }: Props) {
  const {
    currentColor,
    accent,
    accentG,
    particles,
    languageOptions,
    currentLangObj,
    language,
    langDropdownOpen,
    setLangDropdownOpen,
    setLanguageKey,
  } = w;

  return (
    <>
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            top: "-20%",
            left: "-10%",
            background: `radial-gradient(circle, ${currentColor}14 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            bottom: "-15%",
            right: "-5%",
            background: `radial-gradient(circle, ${currentColor}10 0%, transparent 70%)`,
            filter: "blur(50px)",
          }}
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="absolute top-6 right-6 z-50">
        <div className="relative">
          <motion.button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer backdrop-blur-md"
            style={{
              background: "rgba(14,20,33,0.7)",
              border: `1px solid ${accentG}0.3)`,
              color: "#fff",
              boxShadow: `0 4px 20px ${accentG}0.1)`,
            }}
          >
            <img src={currentLangObj.flag} alt={currentLangObj.label} className="w-5 h-5 rounded-full object-cover border border-white/20" />
            <span className="hidden sm:block">{currentLangObj.label}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </motion.button>

          {langDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-40 rounded-xl overflow-hidden backdrop-blur-xl"
              style={{
                background: "rgba(14,20,33,0.9)",
                border: `1px solid ${accentG}0.2)`,
                boxShadow: `0 10px 40px ${accentG}0.15)`,
              }}
            >
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    if (setLanguageKey) setLanguageKey(lang.code as Language);
                    setLangDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors cursor-pointer"
                  style={{
                    background: language === lang.code ? "rgba(255,255,255,0.05)" : "transparent",
                    color: language === lang.code ? accent : "#e2e8f0",
                  }}
                >
                  <img src={lang.flag} alt={lang.label} className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-sm font-bold">{lang.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: currentColor,
              boxShadow: `0 0 ${4 + p.size * 3}px ${currentColor}`,
            }}
            animate={{ x: [0, p.driftX], y: [0, p.driftY], opacity: [0, 0.6, 0], scale: [0.5, 1.2, 0.2] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "easeOut", delay: p.delay }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${currentColor}05 1px, transparent 1px), linear-gradient(90deg, ${currentColor}05 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </>
  );
}
