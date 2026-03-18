const API_BASE = "https://phase-x-qc8dy.ondigitalocean.app/api/v1/subscriptions";

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
  period: 30 | 360;
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
  period: 30 | 360;
  addon_ids?: number[];
}

/* ─── Helper ─── */
async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error((data as any).detail || (data as any).message || (data as any).error || `API error: ${res.status}`);
  }
  return data as T;
}

/* ─── Get Plans (public) ─── */
export async function getPlans(): Promise<APIPlan[]> {
  const res = await fetch(`${API_BASE}/plans/`);
  return handleResponse<APIPlan[]>(res);
}

/* ─── Get Addons (public) ─── */
export async function getAddons(): Promise<APIAddon[]> {
  const res = await fetch(`${API_BASE}/addons/`);
  return handleResponse<APIAddon[]>(res);
}

/* ─── Checkout Preview ─── */
export async function checkoutPreview(accessToken: string, payload: CheckoutPreviewPayload): Promise<CheckoutPreviewResponse> {
  const res = await fetch(`${API_BASE}/checkout/preview/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<CheckoutPreviewResponse>(res);
}

/* ─── Checkout Submit ─── */
export async function checkoutSubmit(accessToken: string, payload: CheckoutSubmitPayload): Promise<any> {
  const res = await fetch(`${API_BASE}/checkout/submit/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<any>(res);
}

/* ─── Get My Subscription ─── */
export async function getMySubscription(accessToken: string): Promise<any> {
  const res = await fetch(`${API_BASE}/me/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return handleResponse<any>(res);
}
