'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  BookOpenCheck,
  Clock,
  DollarSign,
  Loader2,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface AdminStats {
  totalUsers: number;
  totalTutors: number;
  pendingTuitions: number;
  approvedTuitions: number;
  totalRevenue: number;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await apiFetch<{ success: boolean; data: AdminStats }>(
          '/api/users/dashboard-stats'
        );
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
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

  const cards = [
    {
      label: 'Total Registered Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: 'bg-sky-50 text-[#0077CC] dark:bg-sky-900/30 dark:text-sky-300',
    },
    {
      label: 'Total Tutors',
      value: stats?.totalTutors ?? 0,
      icon: BookOpenCheck,
      color:
        'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
    },
    {
      label: 'Pending / Approved Tuitions',
      value: `${stats?.pendingTuitions ?? 0} / ${stats?.approvedTuitions ?? 0}`,
      icon: Clock,
      color:
        'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
    },
    {
      label: 'Total Stripe Revenue',
      value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
      color:
        'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
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
            Platform Moderation Center
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Approve pending tutor listings, manage user roles, and inspect
            Stripe subscription payments.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/admin/tuitions"
            className="rounded-lg bg-[#FF6B00] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#e05e00]"
          >
            Review Tuitions
          </Link>
          <Link
            href="/dashboard/admin/users"
            className="rounded-lg bg-[#041E42] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0a2d5e] dark:bg-[#0077CC]"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}