import { motion } from "motion/react";
import type { NavigateFunction } from "react-router-dom";
import { ResetPasswordPageCardHeader } from "./ResetPasswordPageCardHeader";
import { ResetPasswordPageInvalidBlock, ResetPasswordPageSuccessBlock } from "./ResetPasswordPageCardStates";
import { ResetPasswordPageResetForm } from "./ResetPasswordPageResetForm";

export interface ResetPasswordPageCardProps {
    isRTL: boolean;
    navigate: NavigateFunction;
    uid: string;
    token: string;
    newPassword: string;
    setNewPassword: (v: string) => void;
    confirmPassword: string;
    setConfirmPassword: (v: string) => void;
    showPassword: boolean;
    setShowPassword: (v: boolean) => void;
    loading: boolean;
    error: string | null;
    setError: (v: string | null) => void;
    success: boolean;
    accent: string;
    accentG: string;
    handleSubmit: (e: React.FormEvent) => void;
}

export function ResetPasswordPageCard(props: ResetPasswordPageCardProps) {
    const { success, uid, token, isRTL, navigate, accent, accentG, ...formRest } = props;

    return (
        <motion.div
            className="relative z-10 w-full max-w-md mx-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, rgba(10,14,24,0.95), rgba(15,20,35,0.98))",
                    border: `1px solid ${accentG}0.12)`,
                    boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 80px ${accentG}0.06)`,
                    backdropFilter: "blur(20px)",
                }}
            >
                <motion.div
                    className="absolute top-0 left-0 right-0 h-[2px] z-30"
                    style={{ background: `linear-gradient(90deg, transparent 5%, ${accent} 30%, ${accent} 70%, transparent 95%)` }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />

                <div className="px-8 py-8">
                    <ResetPasswordPageCardHeader isRTL={isRTL} accent={accent} accentG={accentG} />
                    {success ? (
                        <ResetPasswordPageSuccessBlock isRTL={isRTL} navigate={navigate} accent={accent} accentG={accentG} />
                    ) : !uid || !token ? (
                        <ResetPasswordPageInvalidBlock isRTL={isRTL} navigate={navigate} accent={accent} accentG={accentG} />
                    ) : (
                        <ResetPasswordPageResetForm
                            isRTL={isRTL}
                            navigate={navigate}
                            accent={accent}
                            accentG={accentG}
                            {...formRest}
                        />
                    )}
                </div>

                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[1px]"
                    style={{ background: `linear-gradient(90deg, transparent 10%, ${accent}50 40%, ${accent}50 60%, transparent 90%)` }}
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                />
            </div>
        </motion.div>
    );
}
