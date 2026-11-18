'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { fetchAndStoreJwt } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function SignInPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const { theme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || 'Invalid email or password');
        setSubmitting(false);
        return;
      }

      await fetchAndStoreJwt();
      await refreshUser();
      toast.success('Signed in successfully!');
      router.push('/');
    } catch (err) {
      toast.error((err as Error).message || 'Sign in failed');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="flex min-h-[82vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src={
              theme === 'dark'
                ? '/images/mentorlagbe-icon-dark.png'
                : '/images/mentorlagbe-icon-light.png'
            }
            alt="MentorLagbe Icon"
            width={64}
            height={64}
            className="mb-3 h-16 w-16 object-contain"
          />
          <h1 className="text-2xl font-bold text-[#041E42] dark:text-white">
            Welcome Back
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Sign in to access your MentorLagbe dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e05e00] disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Credentials for Examiners */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-900/60">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Quick Demo Credentials
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fillDemo('student@mentorlagbe.com')}
              className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => fillDemo('tutor@mentorlagbe.com')}
              className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"
            >
              Tutor
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@mentorlagbe.com')}
              className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"
            >
              Admin
            </button>
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
          Don&apos;t have an account?{' '}
          <Link
            href="/sign-up"
            className="font-semibold text-[#0077CC] hover:underline dark:text-sky-400"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}