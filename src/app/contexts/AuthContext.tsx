import React, { createContext, useContext, useState, useEffect } from 'react';

export type SubscriptionStatus = 'none' | 'pending' | 'active';
export type SubscriptionPlan = 'core' | 'trader' | 'professional' | 'institutional' | 'none';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan: SubscriptionPlan;
  hasAIAccess: boolean;
  aiTokens: number;
  referralCode: string;
  referralBalance: number;
  referralHistory: ReferralEntry[];
}

interface AuthContextType extends AuthState {
  login: (email: string, name?: string) => void;
  logout: () => void;
  submitReceipt: (plan: SubscriptionPlan, includeAI: boolean) => void;
  activateSubscription: (plan: SubscriptionPlan, includeAI: boolean) => void;
  consumeTokens: (amount: number) => boolean;
  addTokens: (amount: number) => void;
  applyReferralCode: (code: string) => { valid: boolean; discount: number };
  addReferralEarning: (entry: ReferralEntry) => void;
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
        };
      } catch (e) {
        console.error("Failed to parse auth state", e);
      }
    }
    return {
      user: null,
      subscriptionStatus: 'none',
      subscriptionPlan: 'none',
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

  const logout = () => {
    setState({
      user: null,
      subscriptionStatus: 'none',
      subscriptionPlan: 'none',
      hasAIAccess: false,
      aiTokens: 0,
      referralCode: '',
      referralBalance: 0,
      referralHistory: [],
    });
  };

  const submitReceipt = (plan: SubscriptionPlan, includeAI: boolean) => {
    setState(prev => ({
      ...prev,
      subscriptionStatus: 'pending',
      subscriptionPlan: plan,
      hasAIAccess: includeAI,
    }));
  };

  const activateSubscription = (plan: SubscriptionPlan, includeAI: boolean) => {
    setState(prev => ({
      ...prev,
      subscriptionStatus: 'active',
      subscriptionPlan: plan,
      hasAIAccess: includeAI,
      aiTokens: includeAI ? prev.aiTokens + 3000 : prev.aiTokens,
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

  const applyReferralCode = (code: string): { valid: boolean; discount: number } => {
    // Validate: code must match PX-XXXX#### format and not be user's own code
    const trimmed = code.trim().toUpperCase();
    if (!trimmed || trimmed.length < 6) return { valid: false, discount: 0 };
    if (trimmed === state.referralCode) return { valid: false, discount: 0 };
    if (!trimmed.startsWith('PX-')) return { valid: false, discount: 0 };
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
    <AuthContext.Provider value={{ ...state, login, logout, submitReceipt, activateSubscription, consumeTokens, addTokens, applyReferralCode, addReferralEarning }}>
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
