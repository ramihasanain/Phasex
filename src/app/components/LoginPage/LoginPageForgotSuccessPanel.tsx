import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";

interface LoginPageForgotSuccessPanelProps {
    accent: string;
    accentG: string;
    isRTL: boolean;
    resetEmail: string;
    onClose: () => void;
}

export function LoginPageForgotSuccessPanel({ accent, accentG, isRTL, resetEmail, onClose }: LoginPageForgotSuccessPanelProps) {
    return (
        <div className="text-center py-4">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: `${accentG}0.1)`, border: `2px solid ${accentG}0.3)` }}
            >
                <CheckCircle className="w-8 h-8" style={{ color: accent }} />
            </motion.div>
            <h3 className="text-xl font-black mb-2" style={{ color: accent }}>
                {isRTL ? "تم الإرسال!" : "Email Sent!"}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
                {isRTL
                    ? `تم إرسال رابط إعادة تعيين كلمة السر إلى ${resetEmail}. تحقق من بريدك الإلكتروني.`
                    : `A password reset link has been sent to ${resetEmail}. Check your inbox.`}
            </p>
            <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 rounded-xl text-sm font-bold cursor-pointer"
                style={{ background: `${accentG}0.1)`, color: accent, border: `1px solid ${accentG}0.25)` }}
            >
                {isRTL ? "حسناً" : "Got it"}
            </motion.button>
        </div>
    );
}
