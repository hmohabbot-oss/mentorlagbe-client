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
      const sessionRes = await authClient.getSession();
      if (!sessionRes?.data?.user) {
        clearStoredToken();
        setUser(null);
        return;
      }

      // সেশন থাকলে JWT টোকেন নিশ্চিত করে ডেটাবেস থেকে সর্বশেষ প্রোফাইল (role, plan) আনা হচ্ছে
      let token = getStoredToken();
      if (!token) {
        token = await fetchAndStoreJwt();
      }

      if (token) {
        const profileRes = await apiFetch<{ success: boolean; data: UserProfile }>(
          '/api/users/me'
        );
        if (profileRes?.data) {
          setUser(profileRes.data);
          return;
        }
      }

      // ফলব্যাক: যদি কোনো কারণে /api/users/me না পাওয়া যায়
      const sessionUser = sessionRes.data.user as unknown as UserProfile;
      setUser(sessionUser);
    } catch (error) {
      console.error('Auth hydration error:', error);
      // টোকেন এক্সপায়ার্ড বা ইনভ্যালিড হলে নতুন করে JWT নেওয়ার চেষ্টা
      const newToken = await fetchAndStoreJwt();
      if (newToken) {
        try {
          const retryRes = await apiFetch<{ success: boolean; data: UserProfile }>(
            '/api/users/me'
          );
          setUser(retryRes.data);
          return;
        } catch {
          clearStoredToken();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const signOut = async () => {
    await authClient.signOut();
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