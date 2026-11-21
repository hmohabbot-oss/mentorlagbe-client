'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { Tuition } from '@/types';
import TuitionCard from '@/components/TuitionCard';

export default function SavedTuitionsPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSaved() {
      try {
        const res = await apiFetch<{ success: boolean; data: Tuition[] }>(
          '/api/users/saved-tuitions'
        );
        setTuitions(res.data || []);
      } catch (err) {
        toast.error((err as Error).message || 'Failed to load saved tuitions');
      } finally {
        setLoading(false);
      }
    }
    loadSaved();
  }, []);

  const handleToggleSave = (tuitionId: string, saved: boolean) => {
    if (!saved) {
      setTuitions((prev) => prev.filter((t) => t._id !== tuitionId));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={32} className="animate-spin text-[#FF6B00]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]">
        <div>
          <h1 className="text-xl font-extrabold text-[#041E42] dark:text-white">
            Saved Tuitions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your bookmarked tuition batches for quick access.
          </p>
        </div>
        <Link
          href="/tuitions"
          className="rounded-lg bg-[#FF6B00] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e05e00]"
        >
          Explore Mentors
        </Link>
      </div>

      {tuitions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-[#0B1D3A]">
          <Bookmark size={36} className="mx-auto mb-3 text-slate-400" />
          <p className="text-base font-semibold text-[#041E42] dark:text-white">
            No saved tuitions yet
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Click the bookmark icon on any tuition card to save it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tuitions.map((t) => (
            <TuitionCard
              key={t._id}
              tuition={t}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}