import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "ar" | "en" | "ru" | "tr" | "fr" | "es";

export interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguageKey: (lang: Language) => void;
  t: (key: string) => string;
}

import { ar } from "../locales/ar";
import { en } from "../locales/en";
import { ru } from "../locales/ru";
import { tr } from "../locales/tr";
import { fr } from "../locales/fr";
import { es } from "../locales/es";

const translations = {
  ar,
  en,
  ru,
  tr,
  fr,
  es,
};

/** Used when no provider is mounted (should not happen in production). Stops crashes during Vite HMR when the context module reloads and briefly desyncs from the tree. */
const defaultLanguageContext: LanguageContextType = {
  language: "en",
  toggleLanguage: () => {},
  setLanguageKey: () => {},
  t: (key: string) => (en as Record<string, string>)[key] || key,
};

const LanguageContext = createContext<LanguageContextType>(defaultLanguageContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
      document.documentElement.setAttribute("lang", savedLanguage);
      document.documentElement.setAttribute("dir", savedLanguage === "ar" ? "rtl" : "ltr");
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === "ar" ? "en" : "ar";
    setLanguageKey(newLanguage);
  };

  const setLanguageKey = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
    document.documentElement.setAttribute("lang", newLanguage);
    document.documentElement.setAttribute("dir", newLanguage === "ar" ? "rtl" : "ltr");
  };

  const t = (key: string): string => {
    return (translations[language] as Record<string, string>)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguageKey, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}