'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2, Award, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (targetRole: 'student' | 'tutor') => {
    if (!user) {
      toast.info('Please sign in first to upgrade your plan');
      router.push('/sign-in');
      return;
    }

    if (user.role === 'admin') {
      toast.info('Admin accounts already have full platform privileges');
      return;
    }

    if (user.role !== targetRole) {
      toast.error(
        `Your account role is "${user.role}". Please select the ${user.role === 'tutor' ? 'Pro Tutor' : 'Pro Student'} plan.`
      );
      return;
    }

    if (user.plan === 'pro') {
      toast.success('You are already on the Pro Plan!');
      return;
    }

    setLoadingPlan(targetRole);
    try {
      const res = await apiFetch<{ success: boolean; url: string }>(
        '/api/payments/create-checkout-session',
        { method: 'POST' }
      );
      if (res?.url) {
        window.location.href = res.url;
      } else {
        toast.error('Could not initialize Stripe checkout');
      }
    } catch (err) {
      toast.error((err as Error).message || 'Payment initialization failed');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6B00]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
          <Sparkles size={14} />
          Transparent Pricing
        </span>
        <h1 className="mt-3 text-3xl font-extrabold text-[#041E42] sm:text-4xl dark:text-white">
          Choose the Right Plan for Your Journey
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          One-time upgrade powered by Stripe Checkout. No hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Free Plan */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]">
          <h2 className="text-xl font-bold text-[#041E42] dark:text-white">
            Free Plan
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Essential features to get started
          </p>
          <p className="my-6 text-4xl font-extrabold text-[#041E42] dark:text-white">
            $0
          </p>
          <ul className="mb-8 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#0077CC]" />
              Browse &amp; search all approved tuitions
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#0077CC]" />
              Students: Apply to tuitions &amp; track status
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#0077CC]" />
              Tutors: Post up to 2 tuition batches
            </li>
          </ul>
          <button
            disabled
            className="mt-auto rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400"
          >
            {user?.plan === 'free' ? 'Your Current Plan' : 'Default Free Tier'}
          </button>
        </div>

        {/* Pro Student Plan ($10) */}
        <div className="flex flex-col rounded-2xl border-2 border-[#0077CC] bg-white p-8 shadow-md dark:bg-[#0B1D3A]">
          <h2 className="text-xl font-bold text-[#041E42] dark:text-white">
            Pro Student Plan
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Priority booking for dedicated learners
          </p>
          <p className="my-6 text-4xl font-extrabold text-[#0077CC] dark:text-sky-400">
            $10
          </p>
          <ul className="mb-8 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#0077CC]" />
              Priority application placement
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#0077CC]" />
              Verified Pro Student badge
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#0077CC]" />
              Instant Stripe activation
            </li>
          </ul>
          <button
            onClick={() => handleSubscribe('student')}
            disabled={
              loadingPlan === 'student' ||
              (user?.role === 'student' && user?.plan === 'pro')
            }
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#0077CC] py-3 text-sm font-bold text-white transition hover:bg-[#0284c7] disabled:opacity-60"
          >
            {loadingPlan === 'student' && (
              <Loader2 size={16} className="animate-spin" />
            )}
            {user?.role === 'student' && user?.plan === 'pro'
              ? 'Pro Plan Active'
              : 'Subscribe with Stripe ($10)'}
          </button>
        </div>

        {/* Pro Tutor Plan ($15) */}
        <div className="flex flex-col rounded-2xl border-2 border-[#FF6B00] bg-[#041E42] p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Pro Tutor Plan</h2>
            <span className="rounded-full bg-[#FF6B00] px-2.5 py-0.5 text-xs font-bold">
              Best Value
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-300">
            Unlimited reach for professional mentors
          </p>
          <p className="my-6 text-4xl font-extrabold text-[#FF6B00]">$15</p>
          <ul className="mb-8 space-y-3 text-sm text-slate-200">
            <li className="flex items-center gap-2">
              <Award size={16} className="text-[#FF6B00]" />
              Post unlimited tuition batches
            </li>
            <li className="flex items-center gap-2">
              <Award size={16} className="text-[#FF6B00]" />
              Verified Pro Tutor badge on details page
            </li>
            <li className="flex items-center gap-2">
              <Award size={16} className="text-[#FF6B00]" />
              Instant Stripe activation
            </li>
          </ul>
          <button
            onClick={() => handleSubscribe('tutor')}
            disabled={
              loadingPlan === 'tutor' ||
              (user?.role === 'tutor' && user?.plan === 'pro')
            }
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF6B00] py-3 text-sm font-bold text-white transition hover:bg-[#e05e00] disabled:opacity-60"
          >
            {loadingPlan === 'tutor' && (
              <Loader2 size={16} className="animate-spin" />
            )}
            {user?.role === 'tutor' && user?.plan === 'pro'
              ? 'Pro Plan Active'
              : 'Subscribe with Stripe ($15)'}
          </button>
        </div>
      </div>
    </div>
  );
}