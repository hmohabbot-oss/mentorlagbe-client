'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { UploadCloud, Loader2, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { uploadToImgBB } from '@/lib/imgbb';

export default function UpdateProfilePage() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setBio(user.bio || '');
      setImage(user.image || '');
    }
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToImgBB(file);
      setImage(url);
      toast.success('Profile picture uploaded to ImgBB!');
    } catch (err) {
      toast.error((err as Error).message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setSaving(true);
    try {
      await apiFetch('/api/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          bio: bio.trim(),
          image: image.trim(),
        }),
      });
      await refreshUser();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error((err as Error).message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-[#0B1D3A]">
      <h1 className="text-2xl font-extrabold text-[#041E42] dark:text-white">
        Update Profile
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Manage your personal information and upload a profile photo via ImgBB.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-20 w-20 rounded-full border-2 border-[#FF6B00] object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0077CC] text-2xl font-bold text-white">
              {name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}

          <div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#041E42] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0a2d5e] dark:bg-[#0077CC]">
              {uploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <UploadCloud size={16} />
              )}
              {uploading ? 'Uploading...' : 'Upload Photo (ImgBB)'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              PNG, JPG, or WEBP directly uploaded via ImgBB API.
            </p>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Phone Number
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+8801700000000"
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Bio / Teaching or Learning Focus
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell students or tutors about your background..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={saving || uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF6B00] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#e05e00] disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}