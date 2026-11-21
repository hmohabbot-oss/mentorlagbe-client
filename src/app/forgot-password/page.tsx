'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { Loader2, MailCheck, ArrowLeft } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useTheme } from '@/context/ThemeContext';

export default function ForgotPasswordPage() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await authClient.requestPasswordReset({
        email: email.trim(),
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message || 'Failed to send reset link');
        setSubmitting(false);
        return;
      }

      setSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (err) {
      toast.error((err as Error).message || 'Something went wrong');
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
            Forgot Password?
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Enter your registered email and we&apos;ll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="space-y-4 rounded-xl bg-emerald-50 p-5 text-center dark:bg-emerald-900/20">
            <MailCheck size={40} className="mx-auto text-emerald-600" />
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
              If an account exists for <strong>{email}</strong>, a password
              reset email has been sent. Please check your inbox (and spam
              folder).
            </p>
            <Link
              href="/sign-in"
              className="inline-block rounded-lg bg-[#FF6B00] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e05e00]"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e05e00] disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? 'Sending Link...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0077CC] hover:underline dark:text-sky-400"
          >
            <ArrowLeft size={15} />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}