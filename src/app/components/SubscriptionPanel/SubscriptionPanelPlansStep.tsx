import { SubscriptionPanelAddonsAndTotal } from "./SubscriptionPanelAddonsAndTotal";
import { SubscriptionPanelPlanGrid } from "./SubscriptionPanelPlanGrid";
import { SubscriptionPanelPlansHeader } from "./SubscriptionPanelPlansHeader";
import type { SubscriptionPanelViewModel } from "./useSubscriptionPanel";

export function SubscriptionPanelPlansStep({ p }: { p: SubscriptionPanelViewModel }) {
    return (
        <div className="p-10 relative">
            <SubscriptionPanelPlansHeader p={p} />
            <SubscriptionPanelPlanGrid p={p} />
            {p.selectedPlan ? <SubscriptionPanelAddonsAndTotal p={p} /> : null}
        </div>
    );
}
