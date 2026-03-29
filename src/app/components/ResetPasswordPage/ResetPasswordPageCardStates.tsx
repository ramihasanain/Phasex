import { AlertCircle, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import type { NavigateFunction } from "react-router-dom";

export function ResetPasswordPageSuccessBlock({
    isRTL,
    navigate,
    accent,
    accentG,
}: {
    isRTL: boolean;
    navigate: NavigateFunction;
    accent: string;
    accentG: string;
}) {
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
                {isRTL ? "تم بنجاح!" : "Password Reset!"}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
                {isRTL
                    ? "تم إعادة تعيين كلمة السر بنجاح. يمكنك الآن تسجيل الدخول."
                    : "Your password has been reset successfully. You can now log in."}
            </p>
            <motion.button
                onClick={() => navigate("/login")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 rounded-xl text-sm font-black tracking-wider flex items-center justify-center gap-2 mx-auto cursor-pointer"
                style={{
                    background: `linear-gradient(135deg, ${accent} 0%, #00c890 100%)`,
                    color: "#060a10",
                    boxShadow: `0 6px 25px ${accentG}0.3)`,
                }}
            >
                {isRTL ? "تسجيل الدخول" : "Go to Login"}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </motion.button>
        </div>
    );
}

export function ResetPasswordPageInvalidBlock({
    isRTL,
    navigate,
    accent,
    accentG,
}: {
    isRTL: boolean;
    navigate: NavigateFunction;
    accent: string;
    accentG: string;
}) {
    return (
        <div className="text-center py-4">
            <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: "rgba(239,68,68,0.1)", border: "2px solid rgba(239,68,68,0.3)" }}
            >
                <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-black mb-2 text-red-400">{isRTL ? "رابط غير صالح" : "Invalid Reset Link"}</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
                {isRTL
                    ? "رابط إعادة التعيين غير صالح أو منتهي الصلاحية. أعد طلب إعادة التعيين."
                    : "This reset link is invalid or has expired. Please request a new one."}
            </p>
            <motion.button
                onClick={() => navigate("/login")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 rounded-xl text-sm font-bold cursor-pointer"
                style={{ background: `${accentG}0.1)`, color: accent, border: `1px solid ${accentG}0.25)` }}
            >
                {isRTL ? "العودة لتسجيل الدخول" : "Back to Login"}
            </motion.button>
        </div>
    );
}
