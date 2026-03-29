import { motion } from "motion/react";
import { ResetPasswordPageBackdrop } from "./ResetPasswordPage/ResetPasswordPageBackdrop";
import { ResetPasswordPageCard } from "./ResetPasswordPage/ResetPasswordPageCard";
import { useResetPasswordState } from "./ResetPasswordPage/useResetPasswordState";

export function ResetPasswordPage() {
    const s = useResetPasswordState();

    return (
        <div
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            dir="auto"
            style={{ background: "#060a10", fontFamily: "'Inter', system-ui, sans-serif" }}
        >
            <ResetPasswordPageBackdrop accent={s.accent} accentG={s.accentG} particles={s.particles} />
            <ResetPasswordPageCard
                isRTL={s.isRTL}
                navigate={s.navigate}
                uid={s.uid}
                token={s.token}
                newPassword={s.newPassword}
                setNewPassword={s.setNewPassword}
                confirmPassword={s.confirmPassword}
                setConfirmPassword={s.setConfirmPassword}
                showPassword={s.showPassword}
                setShowPassword={s.setShowPassword}
                loading={s.loading}
                error={s.error}
                setError={s.setError}
                success={s.success}
                accent={s.accent}
                accentG={s.accentG}
                handleSubmit={s.handleSubmit}
            />
            <motion.div className="absolute bottom-6 text-center z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                <span className="text-[10px] text-gray-700 tracking-[0.3em] uppercase font-semibold">PHASE X — STRUCTURAL DYNAMICS</span>
            </motion.div>
        </div>
    );
}
