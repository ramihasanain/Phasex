import { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirmPasswordReset } from "../../api/authApi";
import { useLanguage } from "../../contexts/LanguageContext";

export function useResetPasswordState() {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const uid = searchParams.get("uid") || "";
    const token = searchParams.get("token") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const accent = "#00e5a0";
    const accentG = "rgba(0,229,160,";

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!newPassword || !confirmPassword) return;
            if (newPassword !== confirmPassword) {
                setError(isRTL ? "كلمتا المرور غير متطابقتين" : "Passwords do not match");
                return;
            }
            if (newPassword.length < 6) {
                setError(isRTL ? "كلمة المرور قصيرة جداً (6 أحرف على الأقل)" : "Password too short (min 6 characters)");
                return;
            }
            if (!uid || !token) {
                setError(isRTL ? "رابط إعادة التعيين غير صالح" : "Invalid reset link. Please request a new one.");
                return;
            }

            setLoading(true);
            setError(null);
            try {
                await confirmPasswordReset(uid, token, newPassword);
                setSuccess(true);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : undefined;
                setError(message || (isRTL ? "فشل إعادة تعيين كلمة المرور" : "Failed to reset password."));
            } finally {
                setLoading(false);
            }
        },
        [confirmPassword, isRTL, newPassword, token, uid]
    );

    const particles = useMemo(
        () =>
            Array.from({ length: 25 }).map((_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 3 + 1,
                duration: 3 + Math.random() * 6,
                delay: Math.random() * 5,
                driftX: (Math.random() - 0.5) * 60,
                driftY: -(20 + Math.random() * 50),
            })),
        []
    );

    return {
        isRTL,
        navigate,
        uid,
        token,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        setShowPassword,
        loading,
        error,
        setError,
        success,
        accent,
        accentG,
        handleSubmit,
        particles,
    };
}
