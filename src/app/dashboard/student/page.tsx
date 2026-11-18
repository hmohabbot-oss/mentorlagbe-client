'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  Clock,
  Crown,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface StudentStats {
  plan: 'free' | 'pro';
  totalApplied: number;
  acceptedCount: number;
  pendingCount: number;
}

export default function StudentOverviewPage() {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await apiFetch<{ success: boolean; data: StudentStats }>(
          '/api/users/dashboard-stats'
        );
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load student stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex py-16 justify-center">
        <Loader2 size={32} className="animate-spin text-[#FF6B00]" />
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Applied Tuitions',
      value: stats?.totalApplied ?? 0,
      icon: FileText,
      color: 'bg-sky-50 text-[#0077CC] dark:bg-sky-900/30 dark:text-sky-300',
    },
    {
      label: 'Accepted Applications',
      value: stats?.acceptedCount ?? 0,
      icon: CheckCircle2,
      color:
        'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
    },
    {
      label: 'Pending Applications',
      value: stats?.pendingCount ?? 0,
      icon: Clock,
      color:
        'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
    },
    {
      label: 'Current Plan',
      value: (stats?.plan || 'free').toUpperCase(),
      icon: Crown,
      color:
        'bg-orange-50 text-[#FF6B00] dark:bg-orange-900/30 dark:text-orange-300',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {card.label}
                </p>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}
                >
                  <Icon size={20} />
                </div>
              </div>
              <p className="mt-3 text-3xl font-extrabold text-[#041E42] dark:text-white">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]">
        <div>
          <h3 className="text-lg font-bold text-[#041E42] dark:text-white">
            Manage Your Tuition Applications
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Track tutor responses in real time or explore more approved batches.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/student/my-applications"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#041E42] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0a2d5e] dark:bg-[#0077CC]"
          >
            My Applications
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF6B00] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#e05e00]"
          >
            Browse Tuitions
          </Link>
        </div>
      </div>
    </div>
  );
}