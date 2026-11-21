'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Check, X, Loader2, Mail, Phone, Clock } from 'lucide-react';
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

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

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
          Manage Applicants
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Review student applications submitted to your courses and approve or
          decline students.
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
                <th className="py-3 pr-4">Contact Info</th>
                <th className="py-3 pr-4">Tuition Course</th>
                <th className="py-3 pr-4">Schedule &amp; Note</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {applicants.map((app) => (
                <tr key={app._id}>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0077CC] text-xs font-bold text-white">
                        {getInitials(app.studentName)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#041E42] dark:text-white">
                          {app.studentName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Applied{' '}
                          {new Date(app.appliedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 pr-4">
                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      <p className="flex items-center gap-1.5">
                        <Mail size={13} className="text-[#0077CC]" />
                        {app.studentEmail}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone size={13} className="text-[#FF6B00]" />
                        {app.studentPhone}
                      </p>
                    </div>
                  </td>

                  <td className="py-4 pr-4">
                    <p className="font-semibold text-[#041E42] dark:text-white">
                      {app.tuitionTitle}
                    </p>
                    <p className="text-xs font-medium text-[#0077CC] dark:text-sky-300">
                      {app.subject}
                    </p>
                  </td>

                  <td className="py-4 pr-4">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                      <Clock size={13} className="shrink-0 text-slate-400" />
                      {app.preferredSchedule}
                    </p>
                    {app.studentNote && (
                      <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-slate-400">
                        {app.studentNote}
                      </p>
                    )}
                  </td>

                  <td className="py-4 pr-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${badgeStyle(
                        app.status
                      )}`}
                    >
                      • {app.status}
                    </span>
                  </td>

                  <td className="py-4 text-right">
                    {app.status === 'pending' ? (
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handleStatus(app._id, 'accepted')}
                          disabled={updatingId === app._id}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40"
                        >
                          <Check size={13} />
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatus(app._id, 'rejected')}
                          disabled={updatingId === app._id}
                          className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-40"
                        >
                          <X size={13} />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs italic text-slate-400">
                        Responded
                      </span>
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