'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { authClient } from '@/lib/auth-client';
import {
  apiFetch,
  clearStoredToken,
  fetchAndStoreJwt,
  getStoredToken,
} from '@/lib/api';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    try {
      // ১. প্রথমেই স্টোর করা JWT টোকেন দিয়ে প্রোফাইল যাচাই (কুকির ওপর নির্ভর না করে)
      const existingToken = getStoredToken();
      if (existingToken) {
        try {
          const profileRes = await apiFetch<{
            success: boolean;
            data: UserProfile;
          }>('/api/users/me');
          if (profileRes?.data) {
            setUser(profileRes.data);
            return;
          }
        } catch {
          clearStoredToken();
        }
      }

      // ২. JWT না থাকলে বা এক্সপায়ার্ড হলে BetterAuth সেশন থেকে নতুন JWT নেওয়া
      const sessionRes = await authClient.getSession();
      if (!sessionRes?.data?.user) {
        clearStoredToken();
        setUser(null);
        return;
      }

      const newToken = await fetchAndStoreJwt();
      if (newToken) {
        const profileRes = await apiFetch<{
          success: boolean;
          data: UserProfile;
        }>('/api/users/me');
        if (profileRes?.data) {
          setUser(profileRes.data);
          return;
        }
      }

      const sessionUser = sessionRes.data.user as unknown as UserProfile;
      setUser(sessionUser);
    } catch (error) {
      console.error('Auth hydration error:', error);
      clearStoredToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const signOut = async () => {
    try {
      await authClient.signOut();
    } catch {
      // Ignore network errors on sign out
    }
    clearStoredToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}