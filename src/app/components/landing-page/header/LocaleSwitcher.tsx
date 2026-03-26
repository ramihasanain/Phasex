import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { languageOptions } from "@/app/utils/languageOptions";
import { ChevronDown } from "lucide-react";

export default function LocaleSwitcher() {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { language, setLanguageKey } = useLanguage();
  const isRTL = language === "ar";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLangObj =
    languageOptions.find((l) => l.code === language) || languageOptions[1];

  return (
    <div className="relative hidden md:block" ref={dropdownRef}>
      <motion.button
        onClick={() => setLangDropdownOpen(!langDropdownOpen)}
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer border border-white/5 hover:border-white/10"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <img
          src={`https://flagcdn.com/${currentLangObj.flagUrl}.svg`}
          alt={currentLangObj.code}
          className="w-5 h-auto rounded-sm object-cover"
        />
        <span className="hidden lg:inline-block">{currentLangObj.label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            langDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {langDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-40 rounded-xl shadow-2xl border border-white/10 overflow-hidden"
            style={{
              background: "rgba(10,14,23,0.95)",
              backdropFilter: "blur(12px)",
              right: isRTL ? "auto" : 0,
              left: isRTL ? 0 : "auto",
            }}
          >
            <div className="py-1 flex flex-col">
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguageKey(lang.code as any);
                    setLangDropdownOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
                    language === lang.code
                      ? "bg-white/10 text-white font-bold"
                      : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                  }`}
                >
                  <img
                    src={`https://flagcdn.com/${lang.flagUrl}.svg`}
                    alt={lang.code}
                    className="w-5 h-auto rounded-sm object-cover"
                  />
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

