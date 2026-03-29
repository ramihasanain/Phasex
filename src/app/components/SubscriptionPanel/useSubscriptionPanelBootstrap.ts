import { useEffect } from "react";
import { getAddons, getPlans, type APIAddon, type APIPlan } from "../../api/subscriptionsApi";
import type { SubscriptionPanelStep } from "./types";

export function useSubscriptionPanelBootstrap(
    isOpen: boolean,
    accessToken: string | null | undefined,
    syncSubscription: () => Promise<void>,
    setApiPlans: (v: APIPlan[]) => void,
    setApiAddons: (v: APIAddon[]) => void,
    setStep: (s: SubscriptionPanelStep) => void,
    setChangeSuccess: (v: boolean) => void,
    setChangeError: (v: string | null) => void
) {
    useEffect(() => {
        if (isOpen && accessToken) {
            syncSubscription();
            getPlans(accessToken).then((plans) => setApiPlans(plans)).catch(() => {});
            getAddons(accessToken).then((addons) => setApiAddons(addons)).catch(() => {});
        }
        if (isOpen) {
            setStep("plans");
            setChangeSuccess(false);
            setChangeError(null);
        }
    }, [isOpen]);
}
