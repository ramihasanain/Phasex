import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getPlanDisplayName } from "./UserProfile/planDisplayName";
import { planThemes } from "./UserProfile/planThemes";
import type { ProfileView, TokenPackageSize, UserProfileProps } from "./UserProfile/types";
import { UserProfileDashboardView } from "./UserProfile/UserProfileDashboardView";
import { UserProfilePendingView } from "./UserProfile/UserProfilePendingView";
import { UserProfileReferralView } from "./UserProfile/UserProfileReferralView";
import { UserProfileTopUpView } from "./UserProfile/UserProfileTopUpView";
import { TOPUP_WALLET_ADDRESS } from "./UserProfile/tokenTopUpPackages";

export type { UserProfileProps } from "./UserProfile/types";

export function UserProfile({ onClose, onTopUp }: UserProfileProps) {
    const { t, language } = useLanguage();
    const {
        user,
        subscriptionPlan,
        subscriptionStatus,
        subscriptionDetails,
        aiTokens,
        hasMT5Access,
        addTokens,
        referralCode,
        referralBalance,
        referralHistory,
    } = useAuth();

    const [view, setView] = useState<ProfileView>("dashboard");
    const [selectedPackage, setSelectedPackage] = useState<TokenPackageSize>(700);
    const [isProcessing, setIsProcessing] = useState(false);
    const [codeCopied, setCodeCopied] = useState(false);

    const isRTL = language === "ar";
    const theme = planThemes[subscriptionPlan] || planThemes.none;
    const planDisplayName = getPlanDisplayName(subscriptionPlan, t);
    const referralCountLabel = `${referralHistory.length} ${t("referralTab").toLowerCase()}`;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };
    const copyReferralCode = () => {
        navigator.clipboard.writeText(referralCode);
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
    };
    const handleConfirmTopUp = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            addTokens(selectedPackage);
            setView("pending");
            setTimeout(() => setView("dashboard"), 3000);
        }, 1500);
    };
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/70"
            dir={isRTL ? "rtl" : "ltr"}
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="w-full max-w-5xl rounded-[32px] overflow-hidden relative"
                style={{
                    border: `1px solid ${theme.color}25`,
                    height: "85vh",
                    maxHeight: "800px",
                    boxShadow: `0 30px 80px rgba(0,0,0,0.8), 0 0 60px ${theme.glow}`,
                }}
            >
                <AnimatePresence mode="wait">
                    {view === "dashboard" ? (
                        <UserProfileDashboardView
                            theme={theme}
                            subscriptionPlan={subscriptionPlan}
                            planDisplayName={planDisplayName}
                            subscriptionStatus={subscriptionStatus}
                            subscriptionDetails={subscriptionDetails}
                            hasMT5Access={hasMT5Access}
                            userName={user?.name || "Premium Trader"}
                            userEmail={user?.email || "elite@phasex.ai"}
                            referralCode={referralCode}
                            referralBalance={referralBalance}
                            referralCountLabel={referralCountLabel}
                            aiTokens={aiTokens}
                            codeCopied={codeCopied}
                            onClose={onClose}
                            onTopUp={onTopUp}
                            onCopyReferralCode={copyReferralCode}
                            onOpenTopup={() => setView("topup")}
                            onOpenReferral={() => setView("referral")}
                            yourReferralCode={t("yourReferralCode")}
                            copyCode={t("copyCode")}
                            codeCopiedLabel={t("codeCopied")}
                            currentPlanLabel={t("currentPlan") || "Current Plan"}
                            referralTabLabel={t("referralTab")}
                            referralEarningsLabel={t("referralEarnings")}
                        />
                    ) : null}

                    {view === "referral" ? (
                        <UserProfileReferralView
                            onBack={() => setView("dashboard")}
                            onClose={onClose}
                            referralCode={referralCode}
                            referralBalance={referralBalance}
                            referralHistory={referralHistory}
                            codeCopied={codeCopied}
                            onCopyReferralCode={copyReferralCode}
                            referralTitle={t("referralTitle")}
                            referralDesc={t("referralDesc")}
                            yourReferralCode={t("yourReferralCode")}
                            copyCode={t("copyCode")}
                            codeCopiedLabel={t("codeCopied")}
                            referralBalanceLabel={t("referralBalance")}
                            referralTabLabel={t("referralTab")}
                            referralHistoryLabel={t("referralHistory")}
                            referralNameLabel={t("referralName")}
                            referralPlanLabel={t("referralPlan")}
                            referralDateLabel={t("referralDate")}
                            referralEarnedLabel={t("referralEarned")}
                            noReferralsLabel={t("noReferrals")}
                        />
                    ) : null}

                    {view === "topup" ? (
                        <UserProfileTopUpView
                            onBack={() => setView("dashboard")}
                            onClose={onClose}
                            walletAddress={TOPUP_WALLET_ADDRESS}
                            selectedPackage={selectedPackage}
                            onSelectPackage={setSelectedPackage}
                            onConfirmPaid={handleConfirmTopUp}
                            isProcessing={isProcessing}
                            onCopyAddress={copyToClipboard}
                        />
                    ) : null}

                    {view === "pending" ? <UserProfilePendingView selectedPackage={selectedPackage} /> : null}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
