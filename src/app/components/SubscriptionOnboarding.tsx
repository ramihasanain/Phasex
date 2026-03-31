import { SubscriptionOnboardingRoot } from "./SubscriptionOnboarding/SubscriptionOnboardingRoot";
import type { SubscriptionOnboardingProps } from "./SubscriptionOnboarding/types";

export type { SubscriptionOnboardingProps } from "./SubscriptionOnboarding/types";

export function SubscriptionOnboarding({ onComplete }: SubscriptionOnboardingProps) {
    return <SubscriptionOnboardingRoot onComplete={onComplete} />;
}
