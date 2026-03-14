import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { PhaseXDynamicsPage } from "./components/PhaseXDynamicsPage";
import { TradingDashboard } from "./components/TradingDashboard";
import { SubscriptionOnboarding } from "./components/SubscriptionOnboarding";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<"landing" | "login" | "register" | "dashboard" | "phasex-dynamics">("landing");
  const [lastMainPage, setLastMainPage] = useState<"landing" | "dashboard">("landing");
  const [isNewRegistration, setIsNewRegistration] = useState(false);
  const { subscriptionStatus } = useAuth();

  return (
    <>
      {currentPage === "landing" && (
        <LandingPage
          onGetStarted={() => setCurrentPage("login")}
          onRegister={() => setCurrentPage("register")}
          onOpenDynamics={() => { setLastMainPage("landing"); setCurrentPage("phasex-dynamics"); }}
        />
      )}
      {currentPage === "login" && (
        <LoginPage
          onLogin={() => { setIsNewRegistration(false); setCurrentPage("dashboard"); }}
          onRegister={() => setCurrentPage("register")}
        />
      )}
      {currentPage === "register" && (
        <RegisterPage
          onRegister={() => { setIsNewRegistration(true); setCurrentPage("dashboard"); }}
          onBackToLogin={() => setCurrentPage("login")}
        />
      )}
      {currentPage === "dashboard" && isNewRegistration && subscriptionStatus === "none" && (
        <SubscriptionOnboarding onComplete={() => { setIsNewRegistration(false); window.location.reload(); }} />
      )}
      {currentPage === "dashboard" && !(isNewRegistration && subscriptionStatus === "none") && (
        <TradingDashboard
          onLogout={() => { setIsNewRegistration(false); setCurrentPage("landing"); }}
          onOpenDynamics={() => { setLastMainPage("dashboard"); setCurrentPage("phasex-dynamics"); }}
        />
      )}
      {currentPage === "phasex-dynamics" && (
        <PhaseXDynamicsPage onBack={() => setCurrentPage(lastMainPage)} />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}