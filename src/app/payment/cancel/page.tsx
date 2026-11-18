import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <XCircle size={54} className="text-rose-500" />
      <h1 className="mt-4 text-2xl font-extrabold text-[#041E42] dark:text-white">
        Payment Cancelled
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
        Your Stripe checkout was cancelled and no charges were made. You can
        upgrade anytime from the Pricing page.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/pricing"
          className="rounded-lg bg-[#FF6B00] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e05e00]"
        >
          Back to Pricing
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}