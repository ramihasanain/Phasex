export interface UserProfileProps {
    onClose: () => void;
    onTopUp: () => void;
}

export type ProfileView = "dashboard" | "topup" | "pending" | "referral";

export type TokenPackageSize = 250 | 700 | 2000;

export interface PlanTheme {
    color: string;
    gradient: string;
    glow: string;
    icon: string;
    bg: string;
}
