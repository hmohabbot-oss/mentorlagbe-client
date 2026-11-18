'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-extrabold text-rose-500">
        Something Went Wrong
      </h1>
      <p className="mt-3 max-w-md text-sm text-slate-600 dark:text-slate-300">
        {error.message || 'An unexpected error occurred while loading this page.'}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg bg-[#FF6B00] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e05e00]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}