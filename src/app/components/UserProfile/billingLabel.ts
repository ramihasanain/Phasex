export function billingCycleLabel(
    subscriptionPlan: string,
    subscriptionDetails: { endDate: string } | null | undefined
): string {
    if (subscriptionPlan === "none") return "No active plan.";
    if (!subscriptionDetails) return "Loading...";
    const ms = new Date(subscriptionDetails.endDate).getTime() - Date.now();
    const days = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
    return `${days} days remaining`;
}
