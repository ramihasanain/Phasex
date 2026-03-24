import { APIAddon, APIPlan, CheckoutPreviewPayload, CheckoutPreviewResponse, CheckoutSubmitPayload } from "./types";

const API_BASE = import.meta.env.API_URL;



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

/* ─── Get My Subscription ─── */
export async function getMySubscription(accessToken: string): Promise<any> {
  const res = await fetch(`${API_BASE}/me/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return handleResponse<any>(res);
}