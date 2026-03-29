import { motion } from "motion/react";
import { Shield, X } from "lucide-react";
import type { SubscriptionDetails, SubscriptionPlan, SubscriptionStatus } from "../../contexts/AuthContext";
import { billingCycleLabel } from "./billingLabel";
import { UserProfileDashboardAITokensCard } from "./UserProfileDashboardAITokensCard";
import { UserProfileDashboardBillingCard } from "./UserProfileDashboardBillingCard";
import { UserProfileDashboardPlanCard } from "./UserProfileDashboardPlanCard";
import { UserProfileDashboardReferralCard } from "./UserProfileDashboardReferralCard";
import { UserProfileSidebar } from "./UserProfileSidebar";
import type { PlanTheme } from "./types";

interface UserProfileDashboardViewProps {
    theme: PlanTheme;
    subscriptionPlan: SubscriptionPlan;
    planDisplayName: string;
    subscriptionStatus: SubscriptionStatus;
    subscriptionDetails: SubscriptionDetails | null;
    hasMT5Access: boolean;
    userName: string;
    userEmail: string;
    referralCode: string;
    referralBalance: number;
    referralCountLabel: string;
    aiTokens: number;
    codeCopied: boolean;
    onClose: () => void;
    onTopUp: () => void;
    onCopyReferralCode: () => void;
    onOpenTopup: () => void;
    onOpenReferral: () => void;
    yourReferralCode: string;
    copyCode: string;
    codeCopiedLabel: string;
    currentPlanLabel: string;
    referralTabLabel: string;
    referralEarningsLabel: string;
}

export function UserProfileDashboardView({
    theme,
    subscriptionPlan,
    planDisplayName,
    subscriptionStatus,
    subscriptionDetails,
    hasMT5Access,
    userName,
    userEmail,
    referralCode,
    referralBalance,
    referralCountLabel,
    aiTokens,
    codeCopied,
    onClose,
    onTopUp,
    onCopyReferralCode,
    onOpenTopup,
    onOpenReferral,
    yourReferralCode,
    copyCode,
    codeCopiedLabel,
    currentPlanLabel,
    referralTabLabel,
    referralEarningsLabel,
}: UserProfileDashboardViewProps) {
    const billingText = billingCycleLabel(subscriptionPlan, subscriptionDetails);

    return (
        <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col md:flex-row h-full"
        >
            <UserProfileSidebar
                theme={theme}
                subscriptionPlan={subscriptionPlan}
                planDisplayName={planDisplayName}
                subscriptionStatus={subscriptionStatus}
                hasMT5Access={hasMT5Access}
                userName={userName}
                userEmail={userEmail}
                referralCode={referralCode}
                codeCopied={codeCopied}
                onCopyReferralCode={onCopyReferralCode}
                yourReferralCode={yourReferralCode}
                copyCode={copyCode}
                codeCopiedLabel={codeCopiedLabel}
            />

            <div className="md:w-[62%] p-8 relative bg-[#0b0e14] flex flex-col h-full overflow-y-auto">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 z-20 cursor-pointer"
                >
                    <X size={22} />
                </button>

                <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-white">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${theme.color}15` }}>
                        <Shield size={22} style={{ color: theme.color }} />
                    </div>
                    Terminal Dashboard
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 flex-shrink-0">
                    <UserProfileDashboardPlanCard
                        theme={theme}
                        subscriptionPlan={subscriptionPlan}
                        planDisplayName={planDisplayName}
                        currentPlanLabel={currentPlanLabel}
                        onManage={() => {
                            onClose();
                            onTopUp();
                        }}
                    />
                    <UserProfileDashboardAITokensCard aiTokens={aiTokens} onOpenTopup={onOpenTopup} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-shrink-0">
                    <UserProfileDashboardReferralCard
                        referralBalance={referralBalance}
                        referralEarningsLabel={referralEarningsLabel}
                        referralTabLabel={referralTabLabel}
                        referralCountLabel={referralCountLabel}
                        onOpenReferral={onOpenReferral}
                    />
                    <UserProfileDashboardBillingCard billingText={billingText} />
                </div>
            </div>
        </motion.div>
    );
}
