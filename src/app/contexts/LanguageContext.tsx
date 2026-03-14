import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "ar" | "en" | "ru" | "tr" | "fr" | "es";

interface LanguageContextType {
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

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar");

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
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}