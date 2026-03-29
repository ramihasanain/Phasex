import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import type { Language } from "../../contexts/LanguageContext";
import type { LoginLanguageOption } from "./types";

interface LoginPageLanguageMenuProps {
    accent: string;
    accentG: string;
    language: Language;
    langDropdownOpen: boolean;
    setLangDropdownOpen: (v: boolean) => void;
    /** Accepts option codes from LOGIN_LANGUAGE_OPTIONS (subset of Language). */
    setLanguageKey: (code: string) => void;
    languageOptions: LoginLanguageOption[];
    currentLangObj: LoginLanguageOption;
}

export function LoginPageLanguageMenu({
    accent,
    accentG,
    language,
    langDropdownOpen,
    setLangDropdownOpen,
    setLanguageKey,
    languageOptions,
    currentLangObj,
}: LoginPageLanguageMenuProps) {
    return (
        <div className="absolute top-6 right-6 z-50">
            <div className="relative">
                <motion.button
                    type="button"
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

                {langDropdownOpen ? (
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
                                type="button"
                                onClick={() => {
                                    setLanguageKey(lang.code);
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
                ) : null}
            </div>
        </div>
    );
}
