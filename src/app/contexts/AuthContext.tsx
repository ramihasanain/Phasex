import React, { createContext, useContext, useState, useEffect } from 'react';

export type SubscriptionStatus = 'none' | 'pending' | 'active';
export type SubscriptionPlan = 'monthly' | 'quarterly' | 'semi-annual' | 'annual' | 'none';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan: SubscriptionPlan;
  hasAIAccess: boolean;
  aiTokens: number;
}

interface AuthContextType extends AuthState {
  login: (email: string, name?: string) => void;
  logout: () => void;
  submitReceipt: (plan: SubscriptionPlan, includeAI: boolean) => void;
  activateSubscription: (plan: SubscriptionPlan, includeAI: boolean) => void;
  consumeTokens: (amount: number) => boolean;
  addTokens: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    // Load from local storage if available for persistence
    const saved = localStorage.getItem('phasex_auth');
    if (saved) {
      try {
        return JSON.parse(saved);
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
    };
  });

  useEffect(() => {
    localStorage.setItem('phasex_auth', JSON.stringify(state));
  }, [state]);

  const login = (email: string, name: string = 'Trader') => {
    setState(prev => ({
      ...prev,
      user: { id: Date.now().toString(), name, email }
    }));
  };

  const logout = () => {
    setState({
      user: null,
      subscriptionStatus: 'none',
      subscriptionPlan: 'none',
      hasAIAccess: false,
      aiTokens: 0,
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

  return (
    <AuthContext.Provider value={{ ...state, login, logout, submitReceipt, activateSubscription, consumeTokens, addTokens }}>
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
