'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Trash2, Loader2, ExternalLink } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Application } from '@/types';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadApplications = async () => {
    try {
      const res = await apiFetch<{ success: boolean; data: Application[] }>(
        '/api/applications/my-applications'
      );
      setApplications(res.data || []);
    } catch (err) {
      toast.error((err as Error).message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleCancel = async (id: string) => {
    setDeletingId(id);
    try {
      await apiFetch(`/api/applications/${id}`, { method: 'DELETE' });
      toast.success('Pending application cancelled');
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      toast.error((err as Error).message || 'Failed to cancel application');
    } finally {
      setDeletingId(null);
    }
  };

  const badgeStyle = (status: string) => {
    if (status === 'accepted') {
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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#041E42] dark:text-white">
            My Tuition Applications
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            You can cancel any application while its status is still pending.
          </p>
        </div>
        <Link
          href="/tuitions"
          className="rounded-lg bg-[#FF6B00] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e05e00]"
        >
          Find More Tuitions
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          You have not applied to any tuitions yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <th className="py-3 pr-4">Tuition Title</th>
                <th className="py-3 pr-4">Tutor</th>
                <th className="py-3 pr-4">Monthly Fee</th>
                <th className="py-3 pr-4">Applied Date</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {applications.map((app) => (
                <tr key={app._id}>
                  <td className="py-3.5 pr-4 font-semibold text-[#041E42] dark:text-white">
                    <Link
                      href={`/tuitions/${app.tuitionId}`}
                      className="inline-flex items-center gap-1 hover:text-[#FF6B00]"
                    >
                      {app.tuitionTitle}
                      <ExternalLink size={13} />
                    </Link>
                  </td>
                  <td className="py-3.5 pr-4">
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {app.tutorName || 'Tutor'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {app.tutorEmail}
                    </p>
                  </td>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700 dark:text-slate-200">
                    ৳{app.monthlyFee.toLocaleString()}
                  </td>
                  <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${badgeStyle(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    {app.status === 'pending' ? (
                      <button
                        onClick={() => handleCancel(app._id)}
                        disabled={deletingId === app._id}
                        className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50 dark:bg-rose-900/30 dark:text-rose-300"
                      >
                        {deletingId === app._id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Trash2 size={13} />
                        )}
                        Cancel
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
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