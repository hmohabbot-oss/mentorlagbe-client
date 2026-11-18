'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { PaymentRecord } from '@/types';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [verifying, setVerifying] = useState(true);
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function verifyPayment() {
      if (authLoading) return;
      if (!sessionId) {
        setErrorMsg('No Stripe session ID found in the URL.');
        setVerifying(false);
        return;
      }
      if (!user) {
        setErrorMsg('Please sign in to verify your payment.');
        setVerifying(false);
        return;
      }

      try {
        const res = await apiFetch<{ success: boolean; data: PaymentRecord }>(
          '/api/payments/verify-session',
          {
            method: 'POST',
            body: JSON.stringify({ sessionId }),
          }
        );
        if (res?.data) {
          setPayment(res.data);
          await refreshUser();
          toast.success('Pro Plan activated successfully!');
        }
      } catch (err) {
        setErrorMsg((err as Error).message || 'Payment verification failed.');
      } finally {
        setVerifying(false);
      }
    }

    verifyPayment();
  }, [authLoading, sessionId, user, refreshUser]);

  if (verifying || authLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <Loader2 size={44} className="animate-spin text-[#FF6B00]" />
        <h1 className="mt-4 text-xl font-bold text-[#041E42] dark:text-white">
          Verifying Your Stripe Payment...
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Please wait a moment while we activate your Pro Plan.
        </p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <AlertTriangle size={48} className="text-amber-500" />
        <h1 className="mt-4 text-2xl font-bold text-[#041E42] dark:text-white">
          Verification Notice
        </h1>
        <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
          {errorMsg}
        </p>
        <Link
          href="/pricing"
          className="mt-6 rounded-lg bg-[#FF6B00] px-6 py-2.5 text-sm font-semibold text-white"
        >
          Back to Pricing
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]">
        <CheckCircle2 size={54} className="mx-auto text-emerald-500" />
        <h1 className="mt-4 text-2xl font-extrabold text-[#041E42] dark:text-white">
          Payment Successful!
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Welcome to <strong>{payment?.planName || 'MentorLagbe Pro'}</strong>.
          Your account has been upgraded.
        </p>

        {payment && (
          <div className="mt-6 space-y-2 rounded-xl bg-slate-50 p-4 text-left text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            <p>
              <strong>Amount Paid:</strong> ${payment.amount} {payment.currency}
            </p>
            <p className="truncate">
              <strong>Transaction ID:</strong> {payment.transactionId}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Link
            href={user ? `/dashboard/${user.role}` : '/'}
            className="flex-1 rounded-lg bg-[#FF6B00] py-2.5 text-sm font-semibold text-white hover:bg-[#e05e00]"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/tuitions"
            className="flex-1 rounded-lg border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200"
          >
            Browse Tuitions
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-slate-500">
          Loading payment confirmation...
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}