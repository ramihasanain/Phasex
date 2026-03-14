import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Theme = "dark" | "light" | "ocean" | "sunset" | "neon" | "gold" | "snow";

export interface ThemeOption {
  key: Theme;
  icon: string;
  label: string;
  labelAr: string;
}

export const themeOptions: ThemeOption[] = [
  { key: "dark",   icon: "🌑", label: "Dark",    labelAr: "داكن" },
  { key: "light",  icon: "☀️",  label: "Light",   labelAr: "فاتح" },
  { key: "ocean",  icon: "🌊", label: "Ocean",   labelAr: "محيط" },
  { key: "sunset", icon: "🌅", label: "Sunset",  labelAr: "غروب" },
  { key: "neon",   icon: "⚡", label: "Neon",    labelAr: "نيون" },
  { key: "gold",   icon: "👑", label: "Gold",    labelAr: "ذهبي" },
  { key: "snow",   icon: "❄️",  label: "Snow",    labelAr: "ثلجي" },
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const VALID_THEMES: Theme[] = ["dark", "light", "ocean", "sunset", "neon", "gold", "snow"];

function getInitialTheme(): Theme {
  const saved = localStorage.getItem("theme") as Theme | null;
  if (saved && VALID_THEMES.includes(saved)) return saved;

  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: light)").matches) {
    return "light";
  }

  return "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const initial = getInitialTheme();
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  function applyTheme(t: Theme) {
    const root = document.documentElement;
    // Remove all theme classes
    VALID_THEMES.forEach(v => root.classList.remove(v));
    // Add current theme
    root.classList.add(t);
    root.style.colorScheme = t === "light" ? "light" : "dark";
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  // Cycle through themes in order
  const toggleTheme = () => {
    const idx = VALID_THEMES.indexOf(theme);
    const next = VALID_THEMES[(idx + 1) % VALID_THEMES.length];
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
