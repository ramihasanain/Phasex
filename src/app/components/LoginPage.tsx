import { useCallback, useState } from "react";
import { motion } from "motion/react";
import { useLanguage, type Language } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useThemeTokens } from "../hooks/useThemeTokens";
import { loginUser, requestPasswordReset } from "../api/authApi";
import { TermsModal } from "./TermsAndConditions";
import { LOGIN_LANGUAGE_OPTIONS } from "./LoginPage/languageOptions";
import { LoginPageAuthCard } from "./LoginPage/LoginPageAuthCard";
import { LoginPageBackdrop } from "./LoginPage/LoginPageBackdrop";
import { LoginPageForgotPasswordModal } from "./LoginPage/LoginPageForgotPasswordModal";
import { LoginPageLanguageMenu } from "./LoginPage/LoginPageLanguageMenu";
import { LoginPageLoginForm } from "./LoginPage/LoginPageLoginForm";
import { useLoginAmbient } from "./LoginPage/useLoginAmbient";
import type { LoginPageProps } from "./LoginPage/types";

export type { LoginPageProps } from "./LoginPage/types";
export function LoginPage({ onLogin, onRegister }: LoginPageProps) {
    const { t, language, setLanguageKey } = useLanguage();
    const setLanguageFromMenu = useCallback(
        (code: string) => setLanguageKey(code as Language),
        [setLanguageKey]
    );
    const { loginWithApi } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [focused, setFocused] = useState<string | null>(null);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [termsOpen, setTermsOpen] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [apiLoading, setApiLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetLoading, setResetLoading] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [resetError, setResetError] = useState<string | null>(null);

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetEmail) return;
        setResetLoading(true);
        setResetError(null);
        try {
            await requestPasswordReset(resetEmail);
            setResetSuccess(true);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "";
            setResetError(msg || (isRTL ? "فشل إرسال رابط إعادة التعيين" : "Failed to send reset link."));
        } finally {
            setResetLoading(false);
        }
    };

    const currentLangObj = LOGIN_LANGUAGE_OPTIONS.find((l) => l.code === language) || LOGIN_LANGUAGE_OPTIONS[0];
    const isRTL = language === "ar";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        setApiLoading(true);
        setApiError(null);
        try {
            const res = await loginUser(email, password);
            loginWithApi(res.user, res.access, res.refresh);
            onLogin();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "";
            setApiError(msg || (isRTL ? "فشل تسجيل الدخول" : "Login failed. Please try again."));
        } finally {
            setApiLoading(false);
        }
    };

    const tk = useThemeTokens();
    const accent = "#00e5a0";
    const accentG = "rgba(0,229,160,";

    const { particles, streaks } = useLoginAmbient();

    return (
        <div
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            dir="auto"
            style={{ background: tk.isDark ? "#060a10" : "#dcdfe5", fontFamily: "'Inter', system-ui, sans-serif" }}
        >
            <LoginPageBackdrop accent={accent} accentG={accentG} particles={particles} streaks={streaks} />

            <LoginPageLanguageMenu
                accent={accent}
                accentG={accentG}
                language={language}
                langDropdownOpen={langDropdownOpen}
                setLangDropdownOpen={setLangDropdownOpen}
                setLanguageKey={setLanguageFromMenu}
                languageOptions={LOGIN_LANGUAGE_OPTIONS}
                currentLangObj={currentLangObj}
            />

            <LoginPageAuthCard accent={accent} accentG={accentG} t={t}>
                <LoginPageLoginForm
                    accent={accent}
                    accentG={accentG}
                    isRTL={isRTL}
                    t={t}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    focused={focused}
                    setFocused={setFocused}
                    apiError={apiError}
                    setApiError={setApiError}
                    apiLoading={apiLoading}
                    agreedToTerms={agreedToTerms}
                    setAgreedToTerms={setAgreedToTerms}
                    setTermsOpen={setTermsOpen}
                    onSubmit={handleSubmit}
                    onRegister={onRegister}
                    onOpenForgot={() => {
                        setShowForgotPassword(true);
                        setResetEmail(email);
                        setResetSuccess(false);
                        setResetError(null);
                    }}
                />
            </LoginPageAuthCard>

            <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
            {showForgotPassword ? (
                <LoginPageForgotPasswordModal
                    accent={accent}
                    accentG={accentG}
                    isRTL={isRTL}
                    resetEmail={resetEmail}
                    setResetEmail={setResetEmail}
                    resetLoading={resetLoading}
                    resetSuccess={resetSuccess}
                    resetError={resetError}
                    onClose={() => setShowForgotPassword(false)}
                    onSubmit={handleForgotPassword}
                />
            ) : null}

            <motion.div className="absolute bottom-6 text-center z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                <span className="text-[10px] text-gray-700 tracking-[0.3em] uppercase font-semibold">PHASE X — STRUCTURAL DYNAMICS</span>
            </motion.div>
        </div>
    );
}
