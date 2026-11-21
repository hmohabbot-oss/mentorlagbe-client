'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Check, X, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Tuition } from '@/types';

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected';

export default function AdminTuitionsPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  useEffect(() => {
    async function loadTuitions() {
      try {
        const res = await apiFetch<{ success: boolean; data: Tuition[] }>(
          '/api/admin/tuitions'
        );
        setTuitions(res.data || []);
      } catch (err) {
        toast.error((err as Error).message || 'Failed to load tuitions');
      } finally {
        setLoading(false);
      }
    }
    loadTuitions();
  }, []);

  const handleApproval = async (
    id: string,
    approvalStatus: 'approved' | 'rejected'
  ) => {
    setUpdatingId(id);
    try {
      await apiFetch(`/api/admin/tuitions/${id}/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ approvalStatus }),
      });
      toast.success(`Tuition ${approvalStatus}`);
      setTuitions((prev) =>
        prev.map((t) => (t._id === id ? { ...t, approvalStatus } : t))
      );
    } catch (err) {
      toast.error((err as Error).message || 'Failed to update approval');
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingCount = tuitions.filter(
    (t) => t.approvalStatus === 'pending'
  ).length;
  const approvedCount = tuitions.filter(
    (t) => t.approvalStatus === 'approved'
  ).length;
  const rejectedCount = tuitions.filter(
    (t) => t.approvalStatus === 'rejected'
  ).length;

  const filteredTuitions =
    activeTab === 'all'
      ? tuitions
      : tuitions.filter((t) => t.approvalStatus === activeTab);

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'pending', label: 'Pending', count: pendingCount },
    { key: 'approved', label: 'Approved', count: approvedCount },
    { key: 'rejected', label: 'Rejected', count: rejectedCount },
    { key: 'all', label: 'All Tuitions', count: tuitions.length },
  ];

  const badgeStyle = (status: string) => {
    if (status === 'approved') {
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
    }
    if (status === 'rejected') {
      return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300';
    }
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={32} className="animate-spin text-[#FF6B00]" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]">
      <div className="mb-5">
        <h1 className="text-xl font-extrabold text-[#041E42] dark:text-white">
          Admin Tuition Approval Flow
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Approve or reject tutor listings before they appear on Browse Tuitions.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                isSelected
                  ? 'bg-[#FF6B00] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {filteredTuitions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No {activeTab === 'all' ? '' : activeTab} tuitions found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <th className="py-3 pr-4">Title</th>
                <th className="py-3 pr-4">Tutor</th>
                <th className="py-3 pr-4">Subject &amp; Fee</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTuitions.map((t) => (
                <tr key={t._id}>
                  <td className="py-3.5 pr-4 font-semibold text-[#041E42] dark:text-white">
                    {t.title}
                  </td>
                  <td className="py-3.5 pr-4">
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {t.tutorName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.tutorEmail}
                    </p>
                  </td>
                  <td className="py-3.5 pr-4">
                    <p className="text-slate-700 dark:text-slate-200">
                      {t.subject} ({t.mode})
                    </p>
                    <p className="text-xs font-bold text-[#FF6B00]">
                      ৳{t.monthlyFee.toLocaleString()}
                    </p>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${badgeStyle(
                        t.approvalStatus
                      )}`}
                    >
                      {t.approvalStatus}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => handleApproval(t._id, 'approved')}
                        disabled={
                          updatingId === t._id || t.approvalStatus === 'approved'
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 dark:bg-emerald-900/30 dark:text-emerald-300"
                      >
                        <Check size={13} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(t._id, 'rejected')}
                        disabled={
                          updatingId === t._id || t.approvalStatus === 'rejected'
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-40 dark:bg-rose-900/30 dark:text-rose-300"
                      >
                        <X size={13} />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}