'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Pencil, Trash2, Power, Loader2, PlusCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Tuition } from '@/types';

export default function MyTuitionsPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Tuition | null>(null);
  const [saving, setSaving] = useState(false);

  const loadTuitions = async () => {
    try {
      const res = await apiFetch<{ success: boolean; data: Tuition[] }>(
        '/api/tuitions/tutor/my-tuitions'
      );
      setTuitions(res.data || []);
    } catch (err) {
      toast.error((err as Error).message || 'Failed to load your tuitions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTuitions();
  }, []);

  const handleToggleStatus = async (id: string) => {
    setTogglingId(id);
    try {
      const res = await apiFetch<{
        success: boolean;
        message: string;
        isActive: boolean;
      }>(`/api/tuitions/${id}/toggle-status`, { method: 'PATCH' });
      toast.success(res.message);
      setTuitions((prev) =>
        prev.map((t) => (t._id === id ? { ...t, isActive: res.isActive } : t))
      );
    } catch (err) {
      toast.error((err as Error).message || 'Failed to toggle status');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/api/tuitions/${id}`, { method: 'DELETE' });
      toast.success('Tuition deleted');
      setTuitions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      toast.error((err as Error).message || 'Failed to delete tuition');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    setSaving(true);
    try {
      await apiFetch(`/api/tuitions/${editing._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: editing.title,
          monthlyFee: Number(editing.monthlyFee),
          daysPerWeek: Number(editing.daysPerWeek),
          location: editing.location,
          description: editing.description,
        }),
      });
      toast.success('Tuition updated successfully');
      setTuitions((prev) =>
        prev.map((t) => (t._id === editing._id ? editing : t))
      );
      setEditing(null);
    } catch (err) {
      toast.error((err as Error).message || 'Failed to update tuition');
    } finally {
      setSaving(false);
    }
  };

  const approvalBadge = (status: string) => {
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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#041E42] dark:text-white">
            My Created Tuitions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Edit details, toggle active/closed status, or remove listings.
          </p>
        </div>
        <Link
          href="/dashboard/tutor/post-tuition"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF6B00] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e05e00]"
        >
          <PlusCircle size={15} />
          New Tuition
        </Link>
      </div>

      {tuitions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          You have not posted any tuitions yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <th className="py-3 pr-4">Title</th>
                <th className="py-3 pr-4">Subject &amp; Fee</th>
                <th className="py-3 pr-4">Admin Approval</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tuitions.map((t) => (
                <tr key={t._id}>
                  <td className="py-3.5 pr-4 font-semibold text-[#041E42] dark:text-white">
                    {t.title}
                  </td>
                  <td className="py-3.5 pr-4">
                    <p className="text-slate-700 dark:text-slate-200">
                      {t.subject} ({t.mode})
                    </p>
                    <p className="text-xs font-bold text-[#FF6B00]">
                      ৳{t.monthlyFee.toLocaleString()}/mo
                    </p>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${approvalBadge(
                        t.approvalStatus
                      )}`}
                    >
                      {t.approvalStatus}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        t.isActive
                          ? 'bg-sky-100 text-[#0077CC] dark:bg-sky-900/40 dark:text-sky-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {t.isActive ? 'Active' : 'Closed'}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing(t)}
                        title="Edit"
                        className="rounded-lg bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(t._id)}
                        disabled={togglingId === t._id}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                          t.isActive
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300'
                        }`}
                      >
                        {togglingId === t._id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Power size={13} />
                        )}
                        {t.isActive ? 'Close' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(t._id)}
                        title="Delete"
                        className="rounded-lg bg-rose-50 p-2 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-[#0B1D3A]">
            <h2 className="text-lg font-bold text-[#041E42] dark:text-white">
              Edit Tuition
            </h2>
            <form onSubmit={handleUpdate} className="mt-4 space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Title
                </label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Monthly Fee
                  </label>
                  <input
                    type="number"
                    value={editing.monthlyFee}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        monthlyFee: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Days/Week
                  </label>
                  <input
                    type="number"
                    value={editing.daysPerWeek}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        daysPerWeek: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Location
                </label>
                <input
                  type="text"
                  value={editing.location}
                  onChange={(e) =>
                    setEditing({ ...editing, location: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#FF6B00] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e05e00]"
                >
                  {saving ? 'Saving...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}