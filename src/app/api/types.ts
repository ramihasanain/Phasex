/* ─── Country Type ─── */
export interface APICountry {
    id: number;
    name_en: string;
    name_ar: string;
}

/* ─── Types ─── */
export interface RegisterPayload {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    country_id: number;
}

export interface APIUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    country_id: number;
    email_verified: boolean;
    email_verified_at: string | null;
    referral_code: string;
}

export interface AuthResponse {
    user: APIUser;
    refresh: string;
    access: string;
}

export interface APIError {
    error: string;
    message: string;
}
/* ─── Types ─── */
export interface PlanIndicator {
    id: number;
    code: string;
    name: string;
}

export interface APIPlan {
    id: number;
    name: string;
    description: string;
    price_monthly: string;
    price_annual_monthly: string;
    price_annual_total: string;
    save_amount: string;
    save_amount_total: string;
    save_percentage: string;
    is_popular: boolean;
    features: string[];
    limitations: string[];
    indicators: PlanIndicator[];
}

export interface APIAddon {
    id: number;
    code: string;
    name: string;
    description: string;
    base_price_monthly: string;
    base_price_annual_monthly: string;
    is_active: boolean;
}

export interface CheckoutPreviewPayload {
    plan_id: number;
    billing_cycle: "monthly" | "annual";
    addon_ids?: number[];
}

export interface CheckoutPreviewResponse {
    plan_name: string;
    period: number;
    plan_price: string;
    addons_price: string;
    total: string;
    [key: string]: any;
}

export interface CheckoutSubmitPayload {
    plan_id: number;
    billing_cycle: "monthly" | "annual";
    addon_ids?: number[];
}