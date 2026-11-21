'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  GraduationCap,
  Monitor,
  MapPin,
  User,
  Bookmark,
} from 'lucide-react';
import { toast } from 'sonner';
import { Tuition } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

export default function TuitionCard({
  tuition,
  onToggleSave,
}: {
  tuition: Tuition;
  onToggleSave?: (tuitionId: string, saved: boolean) => void;
}) {
  const { user, refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);

  const isSaved = Boolean(user?.savedTuitions?.includes(tuition._id));

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info('Please sign in as a Student to save tuitions');
      return;
    }

    setSaving(true);
    try {
      const res = await apiFetch<{
        success: boolean;
        saved: boolean;
        message: string;
      }>(`/api/users/saved-tuitions/${tuition._id}`, { method: 'POST' });
      toast.success(res.message);
      await refreshUser();
      if (onToggleSave) {
        onToggleSave(tuition._id, res.saved);
      }
    } catch (err) {
      toast.error((err as Error).message || 'Failed to update bookmark');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-[#0B1D3A]">
      {/* Uniform Banner Image */}
      <div className="relative h-48 w-full shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={tuition.bannerImage}
          alt={tuition.title}
          className="h-full w-full object-cover"
        />

        {/* Mode Badge */}
        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
            tuition.mode === 'Online'
              ? 'bg-[#0077CC] text-white'
              : 'bg-[#FF6B00] text-white'
          }`}
        >
          {tuition.mode === 'Online' ? (
            <Monitor size={12} />
          ) : (
            <MapPin size={12} />
          )}
          {tuition.mode}
        </span>

        {/* Bookmark Button */}
        <button
          type="button"
          onClick={handleBookmark}
          disabled={saving}
          title={isSaved ? 'Remove Bookmark' : 'Save Tuition'}
          className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition ${
            isSaved
              ? 'bg-[#FF6B00] text-white'
              : 'bg-white/90 text-slate-700 hover:bg-white dark:bg-slate-900/90 dark:text-slate-200'
          }`}
        >
          <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2.5 py-1 text-xs font-semibold text-[#0077CC] dark:bg-sky-900/40 dark:text-sky-300">
            <BookOpen size={12} />
            {tuition.subject}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2.5 py-1 text-xs font-semibold text-[#FF6B00] dark:bg-orange-900/30 dark:text-orange-300">
            <GraduationCap size={12} />
            {tuition.classLevel}
          </span>
        </div>

        <h3 className="line-clamp-2 text-lg font-bold text-[#041E42] dark:text-white">
          {tuition.title}
        </h3>

        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <User size={15} className="shrink-0 text-[#0077CC]" />
          <span className="truncate font-medium">{tuition.tutorName}</span>
        </div>

        {/* Footer of Card */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monthly Fee
            </p>
            <p className="text-lg font-extrabold text-[#041E42] dark:text-white">
              ৳{tuition.monthlyFee.toLocaleString()}
            </p>
          </div>

          <Link
            href={`/tuitions/${tuition._id}`}
            className="rounded-lg bg-[#FF6B00] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e05e00]"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}