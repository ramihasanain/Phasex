import { useState, useEffect, useMemo, useCallback, type ReactNode } from "react";
import { Zap, Star, Trophy, Crown } from "lucide-react";
import { useAuth, type SubscriptionPlan } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { getAddons, getPlans, checkoutSubmit } from "../../api/subscriptionsApi";
import type { APIAddon, APIPlan } from "../../api/subscriptionsApi";

export interface PlanCardModel {
    id: SubscriptionPlan;
    title: string;
    price: number;
    iconColor: string;
    icon: ReactNode;
    badge: { text: string; color: string } | null;
    charts: string[];
    features: string[];
    limitations: string[] | null;
    description: string;
}

export function useSubscriptionOnboarding(onComplete: () => void) {
    const { t, language } = useLanguage();
    const { submitReceipt, applyReferralCode, accessToken } = useAuth();

    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>("trader");
    const [aiAddon, setAiAddon] = useState(false);
    const [mt5Addon, setMt5Addon] = useState(false);
    const [mt5TermsAccepted, setMt5TermsAccepted] = useState(false);
    const [step, setStep] = useState<"plans" | "payment" | "pending">("plans");
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [referralInput, setReferralInput] = useState("");
    const [referralApplied, setReferralApplied] = useState(false);
    const [referralError, setReferralError] = useState(false);
    const [apiAddons, setApiAddons] = useState<APIAddon[]>([]);
    const [apiPlans, setApiPlans] = useState<APIPlan[]>([]);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    const isRTL = language === "ar";
    const walletAddress = "TQwFCKK5JjZACHdE888zG5iUx8wQ2RtnAV";

    useEffect(() => {
        getAddons(accessToken || undefined)
            .then((addons) => {
                console.log("[PhaseX] Loaded addons:", addons);
                setApiAddons(addons);
            })
            .catch((err) => console.error("[PhaseX] Failed to load addons:", err));
        getPlans(accessToken || undefined)
            .then((plans) => {
                console.log("[PhaseX] Loaded plans:", plans);
                setApiPlans(plans);
            })
            .catch((err) => console.error("[PhaseX] Failed to load plans:", err));
    }, [accessToken]);

    const mt5ApiAddon = apiAddons.find((a) => a.code === "mt5_intgration");
    const aiApiAddon = apiAddons.find((a) => a.code === "ai_insight" || a.code === "ai_addon");

    const copyToClipboard = useCallback((text: string) => {
        navigator.clipboard.writeText(text);
    }, []);

    const handleFinish = useCallback(async () => {
        const addonIds: number[] = [];
        if (mt5Addon && mt5ApiAddon) addonIds.push(mt5ApiAddon.id);
        if (aiAddon && aiApiAddon) addonIds.push(aiApiAddon.id);

        const matchedPlan = apiPlans.find((p) => p.name.toLowerCase().includes(selectedPlan));
        const planId = matchedPlan?.id;

        if (accessToken && planId) {
            setCheckoutLoading(true);
            try {
                const result = await checkoutSubmit(accessToken, {
                    plan_id: planId,
                    billing_cycle: billingCycle === "yearly" ? "annual" : "monthly",
                    addon_ids: addonIds.length > 0 ? addonIds : undefined,
                });
                console.log("[PhaseX] Checkout submitted:", result);
            } catch (err: unknown) {
                console.error("[PhaseX] Checkout error:", err);
            } finally {
                setCheckoutLoading(false);
            }
        }

        submitReceipt(selectedPlan, aiAddon, mt5Addon);
        setStep("pending");
        setTimeout(() => {
            onComplete();
        }, 3000);
    }, [
        accessToken,
        aiAddon,
        aiApiAddon,
        apiPlans,
        billingCycle,
        mt5Addon,
        mt5ApiAddon,
        onComplete,
        selectedPlan,
        submitReceipt,
    ]);

    const plans = useMemo<PlanCardModel[]>(
        () => [
            {
                id: "core",
                title: t("planCoreName"),
                price: 29,
                iconColor: "#3b82f6",
                icon: <Zap size={24} className="text-[#3b82f6]" />,
                badge: null,
                charts: ["Phase State", "Direction State"],
                features: [t("planCoreF1"), t("planCoreF2"), t("planCoreF3"), t("planCoreF4")],
                limitations: [t("planCoreL1"), t("planCoreL2")],
                description: t("planCoreDesc"),
            },
            {
                id: "trader",
                title: t("planTraderName"),
                price: 49,
                iconColor: "#00e5a0",
                icon: <Star size={24} className="text-[#00e5a0]" />,
                badge: { text: t("planTraderBadge"), color: "#00e5a0" },
                charts: ["Phase State", "Direction State", "Oscillation State"],
                features: [t("planTraderF1"), t("planTraderF2"), t("planTraderF3"), t("planTraderF4")],
                limitations: null,
                description: t("planTraderDesc"),
            },
            {
                id: "professional",
                title: t("planProName"),
                price: 89,
                iconColor: "#a855f7",
                icon: <Trophy size={24} className="text-[#a855f7]" />,
                badge: { text: t("planProBadge"), color: "#a855f7" },
                charts: ["Phase State", "Direction State", "Oscillation State", "Reference State", "Displacement State"],
                features: [t("planProF1"), t("planProF2"), t("planProF3"), t("planProF4")],
                limitations: null,
                description: t("planProDesc"),
            },
            {
                id: "institutional",
                title: t("planInstName"),
                price: 149,
                iconColor: "#facc15",
                icon: <Crown size={24} className="text-[#facc15]" />,
                badge: { text: t("planInstBadge"), color: "#facc15" },
                charts: [
                    "Phase State",
                    "Direction State",
                    "Oscillation State",
                    "Reference State",
                    "Displacement State",
                    "Envelope State",
                ],
                features: [t("planInstF1"), t("planInstF2"), t("planInstF3"), t("planInstF4"), t("planInstF5")],
                limitations: null,
                description: t("planInstDesc"),
            },
        ],
        [t]
    );

    const currentPlan = plans.find((p) => p.id === selectedPlan)!;
    const getPrice = (basePrice: number) => (billingCycle === "yearly" ? Math.round(basePrice * 12 * 0.8) : basePrice);
    const mt5MonthlyPrice = mt5ApiAddon ? parseFloat(mt5ApiAddon.base_price_monthly) : 30;
    const mt5AnnualPrice = mt5ApiAddon ? parseFloat(mt5ApiAddon.base_price_annual_monthly) : Math.round(30 * 12 * 0.8);
    const aiMonthlyPrice = aiApiAddon ? parseFloat(aiApiAddon.base_price_monthly) : 20;
    const aiAnnualPrice = aiApiAddon ? parseFloat(aiApiAddon.base_price_annual_monthly) : Math.round(20 * 12 * 0.8);
    const subtotal =
        (currentPlan ? getPrice(currentPlan.price) : 0) +
        (aiAddon ? (billingCycle === "yearly" ? aiAnnualPrice : aiMonthlyPrice) : 0) +
        (mt5Addon ? (billingCycle === "yearly" ? mt5AnnualPrice : mt5MonthlyPrice) : 0);
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

    const goToPayment = useCallback(() => {
        if (mt5Addon && !mt5TermsAccepted) {
            alert(
                language === "ar"
                    ? "يرجى الموافقة على الشروط والأحكام الخاصة بـ MT5 قبل المتابعة."
                    : "Please agree to the MT5 Terms & Conditions before proceeding."
            );
            return;
        }
        setStep("payment");
    }, [language, mt5Addon, mt5TermsAccepted]);

    return {
        language,
        isRTL,
        step,
        setStep,
        billingCycle,
        setBillingCycle,
        selectedPlan,
        setSelectedPlan,
        aiAddon,
        setAiAddon,
        mt5Addon,
        setMt5Addon,
        mt5TermsAccepted,
        setMt5TermsAccepted,
        referralInput,
        setReferralInput,
        referralApplied,
        referralError,
        setReferralError,
        checkoutLoading,
        walletAddress,
        plans,
        currentPlan,
        getPrice,
        mt5MonthlyPrice,
        copyToClipboard,
        handleFinish,
        handleApplyReferral,
        handleRemoveReferral,
        goToPayment,
        totalAmount,
        referralDiscountAmount,
        t,
    };
}
