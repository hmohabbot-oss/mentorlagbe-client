'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  Clock,
  Crown,
  Bookmark,
  Search,
  ArrowRight,
  TrendingUp,
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
      <div className="flex justify-center py-16">
        <Loader2 size={32} className="animate-spin text-[#FF6B00]" />
      </div>
    );
  }

  const totalApplied = stats?.totalApplied ?? 0;
  const acceptedCount = stats?.acceptedCount ?? 0;
  const acceptanceRate =
    totalApplied > 0 ? Math.round((acceptedCount / totalApplied) * 100) : 0;

  const quickActions = [
    {
      title: 'My Applications',
      subtitle: 'Track and manage submissions',
      href: '/dashboard/student/my-applications',
      icon: FileText,
      iconBg: 'bg-sky-50 text-[#0077CC] dark:bg-sky-900/30 dark:text-sky-300',
    },
    {
      title: 'Saved Tuitions',
      subtitle: 'Your bookmarked subjects',
      href: '/dashboard/student/saved-tuitions',
      icon: Bookmark,
      iconBg:
        'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
    },
    {
      title: 'Explore Mentors',
      subtitle: 'Find experienced tutors',
      href: '/tuitions',
      icon: Search,
      iconBg:
        'bg-orange-50 text-[#FF6B00] dark:bg-orange-900/30 dark:text-orange-300',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#041E42] dark:text-white">
            Student Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track your applied tuitions, saved batches, and learning journey.
          </p>
        </div>
        <Link
          href="/tuitions"
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF6B00] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e05e00]"
        >
          <Search size={16} />
          Browse Tuitions
        </Link>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Total Applied
            </p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-[#0077CC] dark:bg-sky-900/30 dark:text-sky-300">
              <FileText size={20} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-[#041E42] dark:text-white">
            {totalApplied}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Total tuition posts applied for
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Accepted
            </p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <p className="text-3xl font-extrabold text-[#041E42] dark:text-white">
              {acceptedCount}
            </p>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              {acceptanceRate}% rate
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Approved applications by tutors
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Pending
            </p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300">
              <Clock size={20} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-[#041E42] dark:text-white">
            {stats?.pendingCount ?? 0}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Awaiting tutor review &amp; confirmation
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Current Plan
            </p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#FF6B00] dark:bg-orange-900/30 dark:text-orange-300">
              <Crown size={20} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-[#041E42] dark:text-white">
            {(stats?.plan || 'free').toUpperCase()}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {stats?.plan === 'pro'
              ? 'Priority Pro Student perks active'
              : 'Upgrade to Pro for priority perks'}
          </p>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]">
        <h3 className="mb-4 text-lg font-bold text-[#041E42] dark:text-white">
          Quick Actions
        </h3>
        <div className="space-y-3">
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-[#FF6B00]/50 hover:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg}`}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#041E42] dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-slate-400 transition group-hover:text-[#FF6B00]"
                />
              </Link>
            );
          })}
        </div>

        {/* Success Tip Banner */}
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#0077CC]/20 bg-sky-50/80 p-4 dark:border-sky-800 dark:bg-sky-900/20">
          <TrendingUp
            size={18}
            className="mt-0.5 shrink-0 text-[#0077CC] dark:text-sky-300"
          />
          <div>
            <p className="text-sm font-bold text-[#041E42] dark:text-white">
              Boost your success rate
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Keep your student profile and contact details up-to-date so
              mentors can contact you quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}