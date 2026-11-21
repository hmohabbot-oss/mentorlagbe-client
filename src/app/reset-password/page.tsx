'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, KeyRound } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useTheme } from '@/context/ThemeContext';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { theme } = useTheme();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword,
        token,
      });

      if (error) {
        toast.error(error.message || 'Failed to reset password');
        setSubmitting(false);
        return;
      }

      toast.success('Password reset successfully! Please sign in.');
      router.push('/sign-in');
    } catch (err) {
      toast.error((err as Error).message || 'Password reset failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src={
              theme === 'dark'
                ? '/images/mentorlagbe-icon-dark.png'
                : '/images/mentorlagbe-icon-light.png'
            }
            alt="MentorLagbe Icon"
            width={60}
            height={60}
            className="mb-3 h-14 w-14 object-contain"
          />
          <h1 className="text-2xl font-bold text-[#041E42] dark:text-white">
            Set New Password
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Create a strong new password for your account
          </p>
        </div>

        {!token ? (
          <div className="space-y-4 rounded-xl bg-rose-50 p-5 text-center dark:bg-rose-900/20">
            <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
              Invalid or expired password reset link. Please request a new one.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block rounded-lg bg-[#FF6B00] px-5 py-2 text-sm font-semibold text-white"
            >
              Request New Link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e05e00] disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <KeyRound size={16} />
              )}
              {submitting ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-slate-500">
          Loading...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}