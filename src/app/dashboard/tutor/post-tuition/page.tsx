'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { UploadCloud, Loader2, Send, Plus, X } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { uploadToImgBB } from '@/lib/imgbb';
import { useAuth } from '@/context/AuthContext';

const PRESET_SLOTS = [
  'Morning (9:00 AM - 12:00 PM)',
  'Afternoon (3:00 PM - 5:00 PM)',
  'Evening (6:00 PM - 8:00 PM)',
  'Night (8:00 PM - 10:00 PM)',
  'Weekend Batch',
  'Flexible / Discuss with Tutor',
];

export default function PostTuitionPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [classLevel, setClassLevel] = useState('HSC / Class 11-12');
  const [mode, setMode] = useState<'Online' | 'Offline'>('Online');
  const [location, setLocation] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState('3');
  const [scheduleSlots, setScheduleSlots] = useState<string[]>([
    'Evening (6:00 PM - 8:00 PM)',
    'Flexible / Discuss with Tutor',
  ]);
  const [customSlot, setCustomSlot] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [description, setDescription] = useState('');

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleSlot = (slot: string) => {
    setScheduleSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const addCustomSlot = () => {
    const trimmed = customSlot.trim();
    if (!trimmed) return;
    if (scheduleSlots.includes(trimmed)) {
      toast.info('This slot is already added');
      return;
    }
    setScheduleSlots((prev) => [...prev, trimmed]);
    setCustomSlot('');
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToImgBB(file);
      setBannerImage(url);
      toast.success('Banner image uploaded to ImgBB!');
    } catch (err) {
      toast.error((err as Error).message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerImage) {
      toast.error('Please upload a banner image via ImgBB first');
      return;
    }
    if (Number(monthlyFee) <= 0 || Number(daysPerWeek) <= 0) {
      toast.error('Monthly fee and days/week must be positive numbers');
      return;
    }
    if (scheduleSlots.length === 0) {
      toast.error('Please select or add at least one schedule slot');
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch('/api/tuitions', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          subject,
          classLevel,
          mode,
          location: location.trim(),
          monthlyFee: Number(monthlyFee),
          daysPerWeek: Number(daysPerWeek),
          scheduleSlots,
          bannerImage,
          description: description.trim(),
        }),
      });
      toast.success('Tuition posted! Waiting for Admin approval.');
      router.push('/dashboard/tutor/my-tuitions');
    } catch (err) {
      toast.error((err as Error).message || 'Failed to post tuition');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-[#0B1D3A]">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#041E42] dark:text-white">
          Post a New Tuition Batch
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {user?.plan === 'free'
            ? 'Free Plan Tutors can post up to 2 tuitions. Upgrade to Pro for unlimited posts.'
            : 'Pro Plan active — post unlimited tuition batches.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Tuition Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. HSC Higher Math Mastery Batch"
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Programming">Programming</option>
              <option value="IELTS">IELTS</option>
              <option value="English">English</option>
              <option value="Biology">Biology</option>
              <option value="Accounting">Accounting</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Class Level
            </label>
            <select
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="Class 6-8">Class 6-8</option>
              <option value="SSC / Class 9-10">SSC / Class 9-10</option>
              <option value="HSC / Class 11-12">HSC / Class 11-12</option>
              <option value="O-Level / Class 9-10">O-Level / Class 9-10</option>
              <option value="A-Level">A-Level</option>
              <option value="Admission / HSC">Admission / HSC</option>
              <option value="University / Job Seeker">
                University / Job Seeker
              </option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as 'Online' | 'Offline')}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Location / Platform
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Zoom / Dhanmondi"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Monthly Fee (BDT ৳)
            </label>
            <input
              type="number"
              min={1}
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(e.target.value)}
              placeholder="e.g. 3000"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Days / Week
            </label>
            <input
              type="number"
              min={1}
              max={7}
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              required
            />
          </div>
        </div>

        {/* Available Schedule Slots (Preset + Custom) */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <label className="mb-2 block text-sm font-semibold text-[#041E42] dark:text-white">
            Available Schedule Slots (Students will choose from these)
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_SLOTS.map((slot) => {
              const selected = scheduleSlots.includes(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => toggleSlot(slot)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    selected
                      ? 'bg-[#0077CC] text-white'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>

          {/* Custom Slot Input */}
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={customSlot}
              onChange={(e) => setCustomSlot(e.target.value)}
              placeholder="Add custom slot (e.g. Sun-Tue 7:30 PM)"
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            <button
              type="button"
              onClick={addCustomSlot}
              className="inline-flex items-center gap-1 rounded-lg bg-[#041E42] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#0a2d5e] dark:bg-[#0077CC]"
            >
              <Plus size={14} />
              Add Slot
            </button>
          </div>

          {/* Selected Slots Preview */}
          {scheduleSlots.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {scheduleSlots.map((slot) => (
                <span
                  key={slot}
                  className="inline-flex items-center gap-1 rounded-full bg-[#FF6B00]/15 px-2.5 py-1 text-xs font-semibold text-[#FF6B00]"
                >
                  {slot}
                  <button
                    type="button"
                    onClick={() => toggleSlot(slot)}
                    className="hover:text-rose-600"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Direct Banner Upload via ImgBB */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Banner Image (ImgBB Direct Upload)
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#041E42] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a2d5e] dark:bg-[#0077CC]">
              {uploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <UploadCloud size={16} />
              )}
              {uploading ? 'Uploading Banner...' : 'Upload Banner Image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            {bannerImage && (
              <img
                src={bannerImage}
                alt="Banner preview"
                className="h-16 w-28 rounded-lg border border-slate-200 object-cover dark:border-slate-700"
              />
            )}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe syllabus, batch size, mock tests, and teaching approach..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting || uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF6B00] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#e05e00] disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          {submitting ? 'Submitting...' : 'Publish Tuition'}
        </button>
      </form>
    </div>
  );
}