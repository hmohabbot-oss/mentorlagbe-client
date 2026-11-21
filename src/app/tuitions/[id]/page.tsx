'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  BookOpen,
  GraduationCap,
  MapPin,
  Monitor,
  Calendar,
  ArrowLeft,
  BadgeCheck,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';
import { API_URL, apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Tuition } from '@/types';

const DEFAULT_FALLBACK_SLOTS = [
  'Morning (9:00 AM - 12:00 PM)',
  'Afternoon (3:00 PM - 5:00 PM)',
  'Evening (6:00 PM - 8:00 PM)',
  'Night (8:00 PM - 10:00 PM)',
  'Flexible / Discuss with Tutor',
];

export default function TuitionDetailsPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();

  const [tuition, setTuition] = useState<Tuition | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [studentPhone, setStudentPhone] = useState('');
  const [preferredSchedule, setPreferredSchedule] = useState('');
  const [studentNote, setStudentNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadDetails() {
      try {
        const res = await fetch(`${API_URL}/api/tuitions/${params.id}`);
        const json = await res.json();
        if (json?.success && json.data) {
          setTuition(json.data);
          const slots =
            json.data.scheduleSlots && json.data.scheduleSlots.length > 0
              ? json.data.scheduleSlots
              : DEFAULT_FALLBACK_SLOTS;
          setPreferredSchedule(slots[0]);
        }
      } catch (err) {
        console.error('Failed to fetch tuition details:', err);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) loadDetails();
  }, [params.id]);

  const availableSlots =
    tuition?.scheduleSlots && tuition.scheduleSlots.length > 0
      ? tuition.scheduleSlots
      : DEFAULT_FALLBACK_SLOTS;

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentPhone.trim() || !preferredSchedule.trim()) {
      toast.error('Phone number and preferred schedule are required');
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch('/api/applications', {
        method: 'POST',
        body: JSON.stringify({
          tuitionId: tuition?._id,
          studentPhone: studentPhone.trim(),
          preferredSchedule: preferredSchedule.trim(),
          studentNote: studentNote.trim(),
        }),
      });
      toast.success('Application submitted successfully!');
      setShowModal(false);
      setStudentPhone('');
      setStudentNote('');
    } catch (err) {
      toast.error((err as Error).message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="h-96 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (!tuition) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-[#041E42] dark:text-white">
          Tuition Not Found
        </h1>
        <Link
          href="/tuitions"
          className="mt-4 inline-block rounded-lg bg-[#FF6B00] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to Browse Tuitions
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/tuitions"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0077CC] hover:underline dark:text-sky-400"
      >
        <ArrowLeft size={16} />
        Back to Browse Tuitions
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]">
            <img
              src={tuition.bannerImage}
              alt={tuition.title}
              className="h-72 w-full object-cover"
            />
            <div className="p-6 sm:p-8">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-3 py-1 text-xs font-semibold text-[#0077CC] dark:bg-sky-900/40 dark:text-sky-300">
                  <BookOpen size={13} />
                  {tuition.subject}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-3 py-1 text-xs font-semibold text-[#FF6B00] dark:bg-orange-900/30 dark:text-orange-300">
                  <GraduationCap size={13} />
                  {tuition.classLevel}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {tuition.mode === 'Online' ? (
                    <Monitor size={13} />
                  ) : (
                    <MapPin size={13} />
                  )}
                  {tuition.mode}
                </span>
              </div>

              <h1 className="text-2xl font-extrabold text-[#041E42] sm:text-3xl dark:text-white">
                {tuition.title}
              </h1>

              <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3 dark:bg-slate-900/70">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Monthly Fee
                  </p>
                  <p className="text-lg font-extrabold text-[#FF6B00]">
                    ৳{tuition.monthlyFee.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Schedule
                  </p>
                  <p className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800 dark:text-white">
                    <Calendar size={14} className="text-[#0077CC]" />
                    {tuition.daysPerWeek} Days / Week
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Location / Platform
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    {tuition.location}
                  </p>
                </div>
              </div>

              {tuition.scheduleSlots && tuition.scheduleSlots.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Available Time Slots
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tuition.scheduleSlots.map((slot) => (
                      <span
                        key={slot}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h2 className="text-lg font-bold text-[#041E42] dark:text-white">
                  Course &amp; Mentorship Description
                </h2>
                <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">
                  {tuition.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Tutor Summary & Role-Restricted Apply */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tutor Profile
            </h2>
            <div className="flex items-center gap-3">
              {tuition.tutorProfile?.image ? (
                <img
                  src={tuition.tutorProfile.image}
                  alt={tuition.tutorName}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0077CC] text-lg font-bold text-white">
                  {tuition.tutorName.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-[#041E42] dark:text-white">
                    {tuition.tutorName}
                  </h3>
                  {tuition.tutorProfile?.plan === 'pro' && (
                    <BadgeCheck
                      size={16}
                      className="text-[#0077CC]"
                      aria-label="Verified Pro Tutor"
                    />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {tuition.tutorEmail}
                </p>
              </div>
            </div>

            {tuition.tutorProfile?.bio && (
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {tuition.tutorProfile.bio}
              </p>
            )}

            <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
              {!user ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sign in with a Student account to apply for this tuition.
                  </p>
                  <Link
                    href="/sign-in"
                    className="block w-full rounded-lg bg-[#FF6B00] py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#e05e00]"
                  >
                    Sign In to Apply
                  </Link>
                </div>
              ) : user.role === 'student' ? (
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full rounded-lg bg-[#FF6B00] py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#e05e00]"
                >
                  Apply Now
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>
                      Only Students can apply for tuitions. You are signed in as{' '}
                      <strong className="capitalize">{user.role}</strong>.
                    </span>
                  </div>
                  <button
                    disabled
                    className="w-full cursor-not-allowed rounded-lg bg-slate-200 py-2.5 text-sm font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-500"
                  >
                    Apply Now (Students Only)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal (Capture 24 Style + Schedule Slot Dropdown) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-[#0B1D3A]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#041E42] dark:text-white">
                  Apply for Tuition
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Send your application details directly to {tuition.tutorName}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleApply} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Tuition
                </label>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {tuition.title} ({tuition.subject} — {tuition.classLevel})
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Contact Phone Number *
                </label>
                <input
                  type="text"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="e.g. +8801812345678"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Preferred Schedule *
                </label>
                <select
                  value={preferredSchedule}
                  onChange={(e) => setPreferredSchedule(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                >
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Notes for the Mentor (Optional)
                </label>
                <textarea
                  rows={3}
                  value={studentNote}
                  onChange={(e) => setStudentNote(e.target.value)}
                  placeholder="Share your goals or specific topics you want help with..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#FF6B00] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e05e00] disabled:opacity-60"
                >
                  {submitting && <Loader2 size={15} className="animate-spin" />}
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}