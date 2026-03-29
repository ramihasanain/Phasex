import type { ReactNode } from "react";

export interface SubscriptionPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export type SubscriptionPlanRow = {
    id: string;
    name: string;
    price: number;
    iconColor: string;
    icon: ReactNode;
    badge: null | { text: string; color: string };
    charts: string[];
    features: string[];
    limitations: string[] | null;
    description: string;
    suitableFor: string;
};

export type SubscriptionPanelStep = "plans" | "payment" | "pending" | "confirm-change";
