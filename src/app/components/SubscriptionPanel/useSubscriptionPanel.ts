import { useCallback, useMemo, useState } from "react";
import { useAuth, type SubscriptionPlan } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { downgradeRequest, upgradeSubscription, type APIAddon, type APIPlan } from "../../api/subscriptionsApi";
import { buildSubscriptionPlans } from "./buildSubscriptionPlans";
import { SUBSCRIPTION_PLAN_TIERS, SUBSCRIPTION_WALLET_ADDRESS } from "./subscriptionPanelConstants";
import type { SubscriptionPanelProps, SubscriptionPanelStep } from "./types";
import { useSubscriptionPanelBootstrap } from "./useSubscriptionPanelBootstrap";

export function useSubscriptionPanel({ isOpen, onClose }: SubscriptionPanelProps) {
    const { language, t } = useLanguage();
    const { subscriptionPlan, subscriptionStatus, subscriptionDetails, submitReceipt, applyReferralCode, accessToken, syncSubscription } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [aiAddon, setAiAddon] = useState(false);
    const [mt5Addon, setMt5Addon] = useState(false);
    const [mt5TermsAccepted, setMt5TermsAccepted] = useState(false);
    const [step, setStep] = useState<SubscriptionPanelStep>("plans");
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [referralInput, setReferralInput] = useState("");
    const [referralApplied, setReferralApplied] = useState(false);
    const [referralError, setReferralError] = useState(false);
    const isRTL = language === "ar";

    const [apiPlans, setApiPlans] = useState<APIPlan[]>([]);
    const [apiAddons, setApiAddons] = useState<APIAddon[]>([]);
    const [changeLoading, setChangeLoading] = useState(false);
    const [changeError, setChangeError] = useState<string | null>(null);
    const [changeSuccess, setChangeSuccess] = useState(false);

    const subscriptionPlans = useMemo(() => buildSubscriptionPlans(t), [t]);

    useSubscriptionPanelBootstrap(
        isOpen,
        accessToken,
        syncSubscription,
        setApiPlans,
        setApiAddons,
        setStep,
        setChangeSuccess,
        setChangeError
    );

    const getApiPlanId = useCallback(
        (localId: string): number | null => {
            const nameMap: Record<string, string> = {
                core: "core",
                trader: "trader",
                professional: "professional",
                institutional: "institutional",
            };
            const match = apiPlans.find((p) => p.name.toLowerCase().includes(nameMap[localId] || ""));
            return match?.id || null;
        },
        [apiPlans]
    );

    const getSelectedAddonIds = useCallback((): number[] => {
        const ids: number[] = [];
        if (aiAddon) {
            const aiAd = apiAddons.find((a) => a.code?.toLowerCase().includes("ai"));
            if (aiAd) ids.push(aiAd.id);
        }
        if (mt5Addon) {
            const mt5Ad = apiAddons.find((a) => a.code?.toLowerCase().includes("mt5"));
            if (mt5Ad) ids.push(mt5Ad.id);
        }
        return ids;
    }, [aiAddon, apiAddons, mt5Addon]);

    const isUpgrade = selectedPlan
        ? (SUBSCRIPTION_PLAN_TIERS[selectedPlan] || 0) > (SUBSCRIPTION_PLAN_TIERS[subscriptionPlan] || 0)
        : false;
    const isDowngrade = selectedPlan
        ? (SUBSCRIPTION_PLAN_TIERS[selectedPlan] || 0) < (SUBSCRIPTION_PLAN_TIERS[subscriptionPlan] || 0)
        : false;
    const isSamePlan = selectedPlan === subscriptionPlan;
    const hasActiveSub = subscriptionStatus === "active" && subscriptionPlan !== "none";

    const handlePlanChange = useCallback(async () => {
        if (!selectedPlan || !accessToken) return;
        const apiPlanId = getApiPlanId(selectedPlan);
        if (!apiPlanId) {
            setChangeError(isRTL ? "لم يتم العثور على الخطة. حاول مرة أخرى." : "Plan not found. Please try again.");
            return;
        }
        setChangeLoading(true);
        setChangeError(null);
        try {
            const addonIds = getSelectedAddonIds();
            if (isUpgrade || isSamePlan) {
                await upgradeSubscription(accessToken, {
                    plan_id: apiPlanId,
                    addon_ids: addonIds,
                    addons_mode: "set",
                });
            } else {
                await downgradeRequest(accessToken, {
                    plan_id: apiPlanId,
                    addon_ids: addonIds,
                    addons_mode: "add",
                });
            }
            setChangeSuccess(true);
            await syncSubscription();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : undefined;
            setChangeError(message || (isRTL ? "فشل تحديث الاشتراك" : "Failed to update subscription."));
        } finally {
            setChangeLoading(false);
        }
    }, [
        accessToken,
        getApiPlanId,
        getSelectedAddonIds,
        isRTL,
        isSamePlan,
        isUpgrade,
        selectedPlan,
        syncSubscription,
    ]);

    const handleFinish = useCallback(() => {
        if (!selectedPlan) return;
        submitReceipt(selectedPlan as SubscriptionPlan, aiAddon, mt5Addon);
        setStep("pending");
        setTimeout(() => {
            onClose();
            setStep("plans");
            setAiAddon(false);
            setMt5Addon(false);
            setSelectedPlan(null);
        }, 3000);
    }, [aiAddon, mt5Addon, onClose, selectedPlan, submitReceipt]);

    const copyToClipboard = useCallback((text: string) => {
        navigator.clipboard.writeText(text);
    }, []);

    const currentPlan = subscriptionPlans.find((p) => p.id === selectedPlan);
    const getPrice = useCallback(
        (basePrice: number) => (billingCycle === "yearly" ? Math.round(basePrice * 12 * 0.8) : basePrice),
        [billingCycle]
    );
    const subtotal =
        (currentPlan ? getPrice(currentPlan.price) : 0) +
        (aiAddon ? (billingCycle === "yearly" ? Math.round(20 * 12 * 0.8) : 20) : 0) +
        (mt5Addon ? (billingCycle === "yearly" ? Math.round(30 * 12 * 0.8) : 30) : 0);
    const referralDiscountAmount = referralApplied ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
    const totalAmount = subtotal - referralDiscountAmount;

    const handleApplyReferral = useCallback(() => {
        setReferralError(false);
        const result = applyReferralCode(referralInput);
        if (result.valid) {
            setReferralApplied(true);
            setReferralError(false);
        } else {
            setReferralApplied(false);
            setReferralError(true);
        }
    }, [applyReferralCode, referralInput]);

    const handleRemoveReferral = useCallback(() => {
        setReferralApplied(false);
        setReferralInput("");
        setReferralError(false);
    }, []);

    const isActive = subscriptionStatus === "active";

    let daysRemaining = 0;
    let progressPercent = 0;
    let endDateFormatted = "";
    let billingLabel = "";
    if (isActive && subscriptionDetails) {
        const now = new Date();
        const end = new Date(subscriptionDetails.endDate);
        const start = new Date(subscriptionDetails.startDate);
        const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
        daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        progressPercent = Math.max(0, Math.min(100, ((totalDays - daysRemaining) / totalDays) * 100));
        endDateFormatted = end.toLocaleDateString(isRTL ? "ar-SA" : "en-US", { year: "numeric", month: "short", day: "numeric" });
        billingLabel = subscriptionDetails.billingCycle === "annual" ? (isRTL ? "سنوي" : "Annual") : isRTL ? "شهري" : "Monthly";
    }

    return {
        language,
        t,
        subscriptionPlan,
        subscriptionStatus,
        subscriptionDetails,
        isRTL,
        selectedPlan,
        setSelectedPlan,
        aiAddon,
        setAiAddon,
        mt5Addon,
        setMt5Addon,
        mt5TermsAccepted,
        setMt5TermsAccepted,
        step,
        setStep,
        billingCycle,
        setBillingCycle,
        referralInput,
        setReferralInput,
        referralApplied,
        referralError,
        setReferralError,
        changeLoading,
        changeError,
        setChangeError,
        changeSuccess,
        setChangeSuccess,
        subscriptionPlans,
        walletAddress: SUBSCRIPTION_WALLET_ADDRESS,
        isActive,
        daysRemaining,
        progressPercent,
        endDateFormatted,
        billingLabel,
        isUpgrade,
        isDowngrade,
        hasActiveSub,
        currentPlan,
        getPrice,
        totalAmount,
        referralDiscountAmount,
        handlePlanChange,
        handleFinish,
        copyToClipboard,
        handleApplyReferral,
        handleRemoveReferral,
        onClose,
    };
}

export type SubscriptionPanelViewModel = ReturnType<typeof useSubscriptionPanel>;
