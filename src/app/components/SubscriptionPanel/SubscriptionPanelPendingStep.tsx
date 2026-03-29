import { Check } from "lucide-react";
import { motion } from "motion/react";
import type { SubscriptionPanelViewModel } from "./useSubscriptionPanel";

export function SubscriptionPanelPendingStep({ p }: { p: SubscriptionPanelViewModel }) {
    const { t } = p;
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-16 text-center h-[600px] relative z-20">
            <motion.div
                className="w-32 h-32 rounded-full flex items-center justify-center mb-8 relative"
                style={{ background: `linear-gradient(135deg, rgba(0,229,160,0.2) 0%, transparent 100%)` }}
            >
                <motion.div
                    className="absolute inset-0 border-4 rounded-full border-t-[#00e5a0] border-r-transparent border-b-[#00e5a0] border-l-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <Check size={56} color="#00e5a0" />
            </motion.div>
            <h2 className="text-4xl font-black mb-4 text-white">{t("verificationPending")}</h2>
            <p className="text-lg text-gray-400 max-w-md mx-auto leading-relaxed font-medium">{t("verificationPendingDesc")}</p>
        </div>
    );
}
