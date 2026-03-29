import { KeyRound } from "lucide-react";
import { Logo } from "../Logo";
import { motion } from "motion/react";

export function ResetPasswordPageCardHeader({
    isRTL,
    accent,
    accentG,
}: {
    isRTL: boolean;
    accent: string;
    accentG: string;
}) {
    return (
        <div className="text-center mb-8">
            <motion.div className="flex justify-center mb-4" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}>
                <div className="relative">
                    <Logo className="w-16 h-16 relative z-10" />
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ background: `radial-gradient(circle, ${accentG}0.2) 0%, transparent 70%)`, filter: "blur(12px)" }}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                    />
                </div>
            </motion.div>

            <div className="flex items-center justify-center gap-2 mb-2">
                <KeyRound className="w-5 h-5" style={{ color: accent }} />
                <h1 className="text-2xl font-black" style={{ color: accent }}>
                    {isRTL ? "إعادة تعيين كلمة السر" : "Reset Password"}
                </h1>
            </div>
            <p className="text-gray-500 text-sm font-medium">{isRTL ? "أدخل كلمة السر الجديدة" : "Enter your new password"}</p>
        </div>
    );
}
