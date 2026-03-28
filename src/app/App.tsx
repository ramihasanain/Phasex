import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { ResetPasswordPage } from "./components/ResetPasswordPage";
import { PhaseXDynamicsPage } from "./components/PhaseXDynamicsPage";
import { TradingDashboard } from "./components/TradingDashboard";
import { SubscriptionOnboarding } from "./components/SubscriptionOnboarding";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function LandingRoute() {
  const navigate = useNavigate();
  return (
    <LandingPage
      onGetStarted={() => navigate("/login")}
      onRegister={() => navigate("/register")}
      onOpenDynamics={(symbol?: string, tab?: string) => navigate("/phasex-dynamics", { state: { from: "landing", symbol, tab } })}
    />
  );
}

function LoginRoute() {
  const navigate = useNavigate();
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <LoginPage
      onLogin={() => navigate("/dashboard")}
      onRegister={() => navigate("/register")}
    />
  );
}

function RegisterRoute() {
  const navigate = useNavigate();
  // Don't redirect to dashboard when user exists —
  // the user needs to complete email verification + plan selection steps
  return (
    <RegisterPage
      onRegister={() => navigate("/dashboard", { state: { fromRegister: true } })}
      onBackToLogin={() => navigate("/login")}
    />
  );
}

function DashboardRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, subscriptionStatus, logout } = useAuth();
  const fromRegister = location.state?.fromRegister === true;

  if (!user) return <Navigate to="/" replace />;

  if (fromRegister && subscriptionStatus === "none") {
    return (
      <SubscriptionOnboarding
        onComplete={() => navigate("/dashboard", { replace: true, state: {} })}
      />
    );
  }

  return (
    <TradingDashboard
      onLogout={() => {
        logout();
        navigate("/");
      }}
      onOpenDynamics={(symbol?: string, tab?: string) => navigate("/phasex-dynamics", { state: { from: "dashboard", symbol, tab } })}
    />
  );
}

function PhaseXDynamicsRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state?.from as string) || "landing";
  const symbol = location.state?.symbol as string | undefined;
  const tab = location.state?.tab as string | undefined;
  const backPath = from === "dashboard" ? "/dashboard" : "/";

  return <PhaseXDynamicsPage onBack={() => navigate(backPath)} initialSymbol={symbol} initialTab={tab} />;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<LandingRoute />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/register" element={<RegisterRoute />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/dashboard" element={<DashboardRoute />} />
      <Route path="/phasex-dynamics" element={<PhaseXDynamicsRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
