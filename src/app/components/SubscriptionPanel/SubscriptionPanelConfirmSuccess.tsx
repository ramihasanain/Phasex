import { Check } from "lucide-react";
import { motion } from "motion/react";

export function SubscriptionPanelConfirmSuccess({
    isRTL,
    isUpgrade,
    isDowngrade,
    changeColor,
    changeBg,
    onClose,
    setStep,
    setSelectedPlan,
}: {
    isRTL: boolean;
    isUpgrade: boolean;
    isDowngrade: boolean;
    changeColor: string;
    changeBg: string;
    onClose: () => void;
    setStep: (s: SubscriptionPanelStep) => void;
    setSelectedPlan: (v: string | null) => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-16"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                style={{ background: `${changeBg}0.15)`, border: `3px solid ${changeColor}` }}
            >
                <Check size={48} color={changeColor} />
            </motion.div>
            <h2 className="text-3xl font-black text-white mb-3">
                {isUpgrade
                    ? isRTL
                        ? "تمت الترقية بنجاح! 🎉"
                        : "Upgrade Successful! 🎉"
                    : isDowngrade
                      ? isRTL
                          ? "تم طلب التخفيض"
                          : "Downgrade Requested"
                      : isRTL
                        ? "تم التحديث بنجاح!"
                        : "Updated Successfully!"}
            </h2>
            <p className="text-gray-400 text-base max-w-md leading-relaxed mb-8">
                {isUpgrade
                    ? isRTL
                        ? "تم ترقية اشتراكك فوراً. استمتع بالميزات الجديدة!"
                        : "Your subscription has been upgraded instantly. Enjoy the new features!"
                    : isDowngrade
                      ? isRTL
                          ? "تم تقديم طلب التخفيض. سيتم تطبيقه في نهاية دورة الفوترة الحالية."
                          : "Your downgrade request has been submitted. It will take effect at the end of the current billing cycle."
                      : isRTL
                        ? "تم تحديث إضافات اشتراكك."
                        : "Your subscription add-ons have been updated."}
            </p>
            <button
                onClick={() => {
                    onClose();
                    setStep("plans");
                    setSelectedPlan(null);
                }}
                className="px-10 py-4 rounded-xl font-black text-black text-lg cursor-pointer hover:scale-[1.02] transition-transform"
                style={{ background: changeColor, boxShadow: `0 8px 30px ${changeBg}0.3)` }}
            >
                {isRTL ? "تم" : "Done"}
            </button>
        </motion.div>
    );
}
