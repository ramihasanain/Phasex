import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { TradingDashboard } from "./components/TradingDashboard";
import { PhaseXDynamicsPage } from "./components/PhaseXDynamicsPage";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"landing" | "login" | "register" | "dashboard" | "phasex-dynamics">("landing");

  return (
    <ThemeProvider>
      <LanguageProvider>
        {currentPage === "landing" && (
          <LandingPage
            onGetStarted={() => setCurrentPage("login")}
            onRegister={() => setCurrentPage("register")}
            onOpenDynamics={() => setCurrentPage("phasex-dynamics")}
          />
        )}
        {currentPage === "login" && (
          <LoginPage
            onLogin={() => setCurrentPage("dashboard")}
            onRegister={() => setCurrentPage("register")}
          />
        )}
        {currentPage === "register" && (
          <RegisterPage
            onRegister={() => setCurrentPage("dashboard")}
            onBackToLogin={() => setCurrentPage("login")}
          />
        )}
        {currentPage === "dashboard" && (
          <TradingDashboard onLogout={() => setCurrentPage("landing")} />
        )}
        {currentPage === "phasex-dynamics" && (
          <PhaseXDynamicsPage onBack={() => setCurrentPage("landing")} />
        )}
      </LanguageProvider>
    </ThemeProvider>
  );
}