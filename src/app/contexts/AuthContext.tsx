import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { APIUser } from '../api/authApi';
import { getMySubscription } from '../api/subscriptionsApi';

export type SubscriptionStatus = 'none' | 'pending' | 'active';
export type SubscriptionPlan = 'core' | 'trader' | 'professional' | 'institutional' | 'none';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  countryId?: number;
  emailVerified?: boolean;
  referralCodeFromApi?: string;
}

export interface ReferralEntry {
  name: string;
  email: string;
  plan: string;
  date: string;
  earned: number;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan: SubscriptionPlan;
  hasMT5Access: boolean;
  hasAIAccess: boolean;
  aiTokens: number;
  referralCode: string;
  referralBalance: number;
  referralHistory: ReferralEntry[];
}

interface AuthContextType extends AuthState {
  login: (email: string, name?: string) => void;
  loginWithApi: (apiUser: APIUser, access: string, refresh: string) => void;
  logout: () => void;
  submitReceipt: (plan: SubscriptionPlan, includeAI: boolean, includeMT5: boolean) => void;
  activateSubscription: (plan: SubscriptionPlan, includeAI: boolean, includeMT5: boolean) => void;
  activateMT5: () => void;
  consumeTokens: (amount: number) => boolean;
  addTokens: (amount: number) => void;
  applyReferralCode: (code: string) => { valid: boolean; discount: number };
  addReferralEarning: (entry: ReferralEntry) => void;
  setEmailVerified: () => void;
  syncSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function generateCode(name: string): string {
  const prefix = name.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase() || 'USER';
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `PX-${prefix}${suffix}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    // Load from local storage if available for persistence
    const saved = localStorage.getItem('phasex_auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          referralCode: parsed.referralCode || '',
          referralBalance: parsed.referralBalance || 0,
          referralHistory: parsed.referralHistory || [],
          accessToken: parsed.accessToken || null,
          refreshToken: parsed.refreshToken || null,
        };
      } catch (e) {
        console.error("Failed to parse auth state", e);
      }
    }
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      subscriptionStatus: 'none',
      subscriptionPlan: 'none',
      hasMT5Access: false,
      hasAIAccess: false,
      aiTokens: 0,
      referralCode: '',
      referralBalance: 0,
      referralHistory: [],
    };
  });

  useEffect(() => {
    localStorage.setItem('phasex_auth', JSON.stringify(state));
  }, [state]);

  // Sync subscription status from API when we have a token
  const syncSubscription = useCallback(async () => {
    const token = state.accessToken;
    if (!token) return;
    try {
      const data = await getMySubscription(token);
      console.log('[PhaseX] Subscription sync:', data);
      if (data.subscription && data.subscription.active_now) {
        const planName = (data.plan?.name || '').toLowerCase();
        let plan: SubscriptionPlan = 'none';
        if (planName.includes('core')) plan = 'core';
        else if (planName.includes('trader')) plan = 'trader';
        else if (planName.includes('professional')) plan = 'professional';
        else if (planName.includes('institutional')) plan = 'institutional';
        // Check if AI addon is in allowed indicators
        const indicators: string[] = data.allowed_indicators || [];
        // Check allowed addons from API (string array like ["ai_insight", "mt5_intgration"])
        const allowedAddons: string[] = data.allowed_addons || [];
        const hasMT5 = allowedAddons.includes('mt5_intgration');
        const hasAI = allowedAddons.includes('ai_insight') || indicators.length > 4;
        console.log('[PhaseX] Addon check:', { allowedAddons, hasMT5, hasAI });
        setState(prev => ({
          ...prev,
          subscriptionStatus: 'active' as SubscriptionStatus,
          subscriptionPlan: plan,
          hasAIAccess: prev.hasAIAccess || hasAI,
          hasMT5Access: prev.hasMT5Access || hasMT5,
        }));
      } else if (data.subscription && data.subscription.status === 'pending_payment') {
        setState(prev => ({ ...prev, subscriptionStatus: 'pending' as SubscriptionStatus }));
      }
    } catch (err) {
      console.log('[PhaseX] No active subscription or error:', err);
    }
  }, [state.accessToken]);

  // Auto-sync on mount/login when token is available
  useEffect(() => {
    if (state.accessToken && state.subscriptionStatus !== 'active') {
      syncSubscription();
    }
  }, [state.accessToken]);

  const login = (email: string, name: string = 'Trader') => {
    setState(prev => {
      const code = prev.referralCode || generateCode(name);
      return {
        ...prev,
        user: { id: Date.now().toString(), name, email },
        referralCode: code,
      };
    });
  };

  const loginWithApi = (apiUser: APIUser, access: string, refresh: string) => {
    setState(prev => {
      const name = `${apiUser.first_name} ${apiUser.last_name}`;
      const code = apiUser.referral_code || prev.referralCode || generateCode(name);
      return {
        ...prev,
        user: {
          id: String(apiUser.id),
          name,
          email: apiUser.email,
          firstName: apiUser.first_name,
          lastName: apiUser.last_name,
          countryId: apiUser.country_id,
          emailVerified: apiUser.email_verified,
          referralCodeFromApi: apiUser.referral_code,
        },
        accessToken: access,
        refreshToken: refresh,
        referralCode: code,
      };
    });
  };

  const setEmailVerified = () => {
    setState(prev => {
      if (!prev.user) return prev;
      return {
        ...prev,
        user: { ...prev.user, emailVerified: true },
      };
    });
  };

  const logout = () => {
    setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      subscriptionStatus: 'none',
      subscriptionPlan: 'none',
      hasMT5Access: false,
      hasAIAccess: false,
      aiTokens: 0,
      referralCode: '',
      referralBalance: 0,
      referralHistory: [],
    });
  };

  const submitReceipt = (plan: SubscriptionPlan, includeAI: boolean, includeMT5: boolean = false) => {
    setState(prev => ({
      ...prev,
      subscriptionStatus: 'pending',
      subscriptionPlan: plan,
      hasAIAccess: includeAI,
      hasMT5Access: includeMT5,
    }));
  };

  const activateSubscription = (plan: SubscriptionPlan, includeAI: boolean, includeMT5: boolean = false) => {
    setState(prev => ({
      ...prev,
      subscriptionStatus: 'active',
      subscriptionPlan: plan,
      hasAIAccess: includeAI,
      hasMT5Access: includeMT5,
      aiTokens: includeAI ? prev.aiTokens + 700 : prev.aiTokens,
    }));
  };

  const consumeTokens = (amount: number): boolean => {
    if (state.aiTokens >= amount) {
      setState(prev => ({
        ...prev,
        aiTokens: prev.aiTokens - amount
      }));
      return true;
    }
    return false;
  };

  const addTokens = (amount: number) => {
    setState(prev => ({
      ...prev,
      aiTokens: prev.aiTokens + amount,
      hasAIAccess: true
    }));
  };

  const activateMT5 = () => {
    setState(prev => ({
      ...prev,
      hasMT5Access: true
    }));
  };

  const applyReferralCode = (code: string): { valid: boolean; discount: number } => {
    // Validate: code must match PX-XXXX#### format and not be user's own code
    const trimmed = code.trim().toUpperCase();
    if (!trimmed || trimmed.length < 6) return { valid: false, discount: 0 };
    if (trimmed === state.referralCode) return { valid: false, discount: 0 };
    if (!trimmed.startsWith('PX-') && !trimmed.startsWith('PHASE-')) return { valid: false, discount: 0 };
    // Valid referral — 10% discount
    return { valid: true, discount: 0.1 };
  };

  const addReferralEarning = (entry: ReferralEntry) => {
    setState(prev => ({
      ...prev,
      referralBalance: prev.referralBalance + entry.earned,
      referralHistory: [entry, ...prev.referralHistory],
    }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, loginWithApi, logout, submitReceipt, activateSubscription, activateMT5, consumeTokens, addTokens, applyReferralCode, addReferralEarning, setEmailVerified, syncSubscription }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
