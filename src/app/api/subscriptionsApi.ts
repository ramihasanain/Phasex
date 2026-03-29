import { APIAddon, APIPlan, CheckoutPreviewPayload, CheckoutPreviewResponse, CheckoutSubmitPayload } from "./types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";



/* ─── Helper ─── */
async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error((data as any).detail || (data as any).message || (data as any).error || `API error: ${res.status}`);
  }
  return data as T;
}

/* ─── Get Plans ─── */
export async function getPlans(accessToken?: string): Promise<APIPlan[]> {
  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  const res = await fetch(`${API_BASE}/plans/`, { headers });
  return handleResponse<APIPlan[]>(res);
}

/* ─── Get Addons ─── */
export async function getAddons(accessToken?: string): Promise<APIAddon[]> {
  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  const res = await fetch(`${API_BASE}/addons/`, { headers });
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

/* ─── Upgrade Subscription ─── */
export interface UpgradePayload {
  plan_id: number;
  addon_ids?: number[];
  addons_mode?: "add" | "set";
}

export async function upgradeSubscription(accessToken: string, payload: UpgradePayload): Promise<any> {
  const res = await fetch(`${API_BASE}/upgrade/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<any>(res);
}

/* ─── Downgrade Request ─── */
export interface DowngradePayload {
  plan_id: number;
  addon_ids?: number[];
  addons_mode?: "add" | "remove";
}

export async function downgradeRequest(accessToken: string, payload: DowngradePayload): Promise<any> {
  const res = await fetch(`${API_BASE}/downgrade-request/`, {
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
export interface SubscriptionMeResponse {
  subscription: {
    id: number;
    status: string;
    billing_cycle: string;
    start_date: string;
    end_date: string;
    active_now: boolean;
  } | null;
  plan: {
    id: number;
    name: string;
    description?: string;
    price_monthly?: string;
    price_annual_monthly?: string;
  } | null;
  allowed_indicators?: string[];
  allowed_addons?: string[];
  active_addons?: { id: number; code: string; name: string }[];
}

export async function getMySubscription(accessToken: string): Promise<SubscriptionMeResponse> {
  const res = await fetch(`${API_BASE}/me/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return handleResponse<SubscriptionMeResponse>(res);
}