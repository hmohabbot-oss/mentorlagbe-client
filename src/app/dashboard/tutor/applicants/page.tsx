'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Check, X, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Application } from '@/types';

export default function ManageApplicantsPage() {
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadApplicants() {
      try {
        const res = await apiFetch<{ success: boolean; data: Application[] }>(
          '/api/applications/tutor/applicants'
        );
        setApplicants(res.data || []);
      } catch (err) {
        toast.error((err as Error).message || 'Failed to load applicants');
      } finally {
        setLoading(false);
      }
    }
    loadApplicants();
  }, []);

  const handleStatus = async (id: string, status: 'accepted' | 'rejected') => {
    setUpdatingId(id);
    try {
      await apiFetch(`/api/applications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      toast.success(`Application ${status}`);
      setApplicants((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch (err) {
      toast.error((err as Error).message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
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
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-[#041E42] dark:text-white">
          Manage Student Applicants
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Review student schedules and accept or reject enrollment requests.
        </p>
      </div>

      {applicants.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No students have applied to your tuitions yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <th className="py-3 pr-4">Student</th>
                <th className="py-3 pr-4">Tuition Title</th>
                <th className="py-3 pr-4">Schedule &amp; Note</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 text-right">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {applicants.map((app) => (
                <tr key={app._id}>
                  <td className="py-3.5 pr-4">
                    <p className="font-semibold text-[#041E42] dark:text-white">
                      {app.studentName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {app.studentEmail}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {app.studentPhone}
                    </p>
                  </td>
                  <td className="py-3.5 pr-4 font-medium text-slate-700 dark:text-slate-200">
                    {app.tuitionTitle}
                  </td>
                  <td className="py-3.5 pr-4">
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {app.preferredSchedule}
                    </p>
                    {app.studentNote && (
                      <p className="mt-0.5 max-w-xs text-xs text-slate-500 dark:text-slate-400">
                        {app.studentNote}
                      </p>
                    )}
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
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => handleStatus(app._id, 'accepted')}
                        disabled={
                          updatingId === app._id || app.status === 'accepted'
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 dark:bg-emerald-900/30 dark:text-emerald-300"
                      >
                        <Check size={13} />
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatus(app._id, 'rejected')}
                        disabled={
                          updatingId === app._id || app.status === 'rejected'
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