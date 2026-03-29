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
