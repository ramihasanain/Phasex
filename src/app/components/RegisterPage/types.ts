import type { LucideIcon } from "lucide-react";

export interface RegisterPageProps {
  onRegister: () => void;
  onBackToLogin: () => void;
}

export interface RegisterSubscriptionPlanRow {
  id: string;
  apiId: number;
  name: string;
  priceMonthly: number;
  priceAnnualMonthly: number;
  priceAnnualTotal: number;
  savePercentage: number;
  color: string;
  icon: LucideIcon;
  popular: boolean;
  charts: string[];
  features: string[];
  limitations: string[];
  description: string;
}
