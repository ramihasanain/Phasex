import { useEffect } from "react";
import { SubscriptionPanelConfirmChangeStep } from "./SubscriptionPanel/SubscriptionPanelConfirmChangeStep";
import { SubscriptionPanelPaymentStep } from "./SubscriptionPanel/SubscriptionPanelPaymentStep";
import { SubscriptionPanelPendingStep } from "./SubscriptionPanel/SubscriptionPanelPendingStep";
import { SubscriptionPanelPlansStep } from "./SubscriptionPanel/SubscriptionPanelPlansStep";
import { SubscriptionPanelShell } from "./SubscriptionPanel/SubscriptionPanelShell";
import type { SubscriptionPanelProps } from "./SubscriptionPanel/types";
import { useSubscriptionPanel } from "./SubscriptionPanel/useSubscriptionPanel";

export type { SubscriptionPanelProps } from "./SubscriptionPanel/types";

export function SubscriptionPanel(props: SubscriptionPanelProps) {
    const p = useSubscriptionPanel(props);

    useEffect(() => {
        if (!props.isOpen) return;
        const prevHtml = document.documentElement.style.overflow;
        const prevBody = document.body.style.overflow;
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        return () => {
            document.documentElement.style.overflow = prevHtml;
            document.body.style.overflow = prevBody;
        };
    }, [props.isOpen]);

    if (!props.isOpen) return null;

    return (
        <SubscriptionPanelShell isRTL={p.isRTL} onClose={p.onClose}>
            {p.step === "plans" ? <SubscriptionPanelPlansStep p={p} /> : null}
            {p.step === "payment" ? <SubscriptionPanelPaymentStep p={p} /> : null}
            {p.step === "confirm-change" ? <SubscriptionPanelConfirmChangeStep p={p} /> : null}
            {p.step === "pending" ? <SubscriptionPanelPendingStep p={p} /> : null}
        </SubscriptionPanelShell>
    );
}
