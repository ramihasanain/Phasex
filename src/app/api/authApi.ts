import { APICountry, APIError, APIUser, AuthResponse, RegisterPayload } from "./types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";
/* ─── Helper ─── */
async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    const err = data as APIError;
    throw new Error(err.message || err.error || `API error: ${res.status}`);
  }
  return data as T;
}

/* ─── Register ─── */
export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthResponse>(res);
}



/* ─── Resend Verification ─── */
export async function resendVerification(email: string): Promise<any> {
  const res = await fetch(`${API_BASE}/resend-verification/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse<any>(res);
}

/* ─── Login ─── */
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(res);
}

/* ─── Get Me (check if email verified) ─── */
export async function getMe(accessToken: string): Promise<APIUser> {
  const res = await fetch(`${API_BASE}/me/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return handleResponse<APIUser>(res);
}

/* ─── Get Countries ─── */
export async function getCountries(): Promise<APICountry[]> {
  const res = await fetch(`${API_BASE}/countries/`);
  const data = await res.json();
  if (!res.ok) throw new Error((data as any).detail || `API error: ${res.status}`);
  return (data as any).countries || data;
}

/* ─── Password Reset Request ─── */
export async function requestPasswordReset(email: string): Promise<any> {
  const res = await fetch(`${API_BASE}/password-reset/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse<any>(res);
}

/* ─── Password Reset Confirm ─── */
export async function confirmPasswordReset(uid: string, token: string, new_password: string): Promise<any> {
  const res = await fetch(`${API_BASE}/password-reset/confirm/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, token, new_password }),
  });
  return handleResponse<any>(res);
}
