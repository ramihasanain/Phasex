import { AnimatePresence, motion } from "motion/react";
import type { SubscriptionOnboardingProps } from "./types";
import { useSubscriptionOnboarding } from "./useSubscriptionOnboarding";
import { SubscriptionOnboardingPlanGrid } from "./SubscriptionOnboardingPlanGrid";
import { SubscriptionOnboardingPlanExtras } from "./SubscriptionOnboardingPlanExtras";
import {
    SubscriptionOnboardingPaymentStep,
    SubscriptionOnboardingPendingStep,
} from "./SubscriptionOnboardingPaymentAndPending";

export function SubscriptionOnboardingRoot({ onComplete }: SubscriptionOnboardingProps) {
    const ctx = useSubscriptionOnboarding(onComplete);
    const { isRTL, step } = ctx;

    return (
        <div
            className="min-h-screen flex flex-col pt-10 pb-20 px-4 relative overflow-x-hidden overflow-y-auto"
            style={{ background: "#0b0e14", fontFamily: "'Inter', sans-serif" }}
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div className="fixed inset-0 pointer-events-none z-0">
                <div
                    className="absolute top-[0%] left-[20%] w-[600px] h-[600px] rounded-full"
                    style={{
                        background: `radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 60%)`,
                        filter: "blur(80px)",
                    }}
                />
                <div
                    className="absolute bottom-[0%] right-[20%] w-[600px] h-[600px] rounded-full"
                    style={{
                        background: `radial-gradient(circle, rgba(250, 204, 21, 0.02) 0%, transparent 60%)`,
                        filter: "blur(80px)",
                    }}
                />
            </div>

            <AnimatePresence mode="wait">
                {step === "plans" && (
                    <motion.div
                        key="plans"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center"
                    >
                        <SubscriptionOnboardingPlanGrid ctx={ctx} />
                        <SubscriptionOnboardingPlanExtras ctx={ctx} />
                    </motion.div>
                )}

                {step === "payment" && <SubscriptionOnboardingPaymentStep ctx={ctx} />}

                {step === "pending" && <SubscriptionOnboardingPendingStep ctx={ctx} />}
            </AnimatePresence>
        </div>
    );
}
