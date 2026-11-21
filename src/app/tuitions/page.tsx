'use client';

import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { Tuition } from '@/types';
import TuitionCard from '@/components/TuitionCard';

function BrowseTuitionsContent() {
  const searchParams = useSearchParams();

  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [subject, setSubject] = useState(searchParams.get('subject') || 'all');
  const [classLevel, setClassLevel] = useState('all');
  const [mode, setMode] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchTuitions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (subject !== 'all') params.set('subject', subject);
      if (classLevel !== 'all') params.set('classLevel', classLevel);
      if (mode !== 'all') params.set('mode', mode);
      params.set('page', String(page));
      params.set('limit', '6');

      const res = await fetch(`${API_URL}/api/tuitions?${params.toString()}`);
      const json = await res.json();

      if (json?.success) {
        setTuitions(json.data || []);
        setTotalPages(json.pagination?.totalPages || 1);
        setTotal(json.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error loading tuitions:', error);
    } finally {
      setLoading(false);
    }
  }, [search, subject, classLevel, mode, page]);

  useEffect(() => {
    fetchTuitions();
  }, [fetchTuitions]);

  const handleReset = () => {
    setSearch('');
    setSubject('all');
    setClassLevel('all');
    setMode('all');
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Centered Marketplace Header (Capture 26 Style) */}
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <span className="inline-block rounded-full bg-[#0077CC]/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#0077CC] dark:bg-sky-900/40 dark:text-sky-300">
          Tuition Marketplace
        </span>
        <h1 className="mt-3 text-3xl font-extrabold text-[#041E42] sm:text-4xl dark:text-white">
          Browse All Tuitions
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Explore vetted tuition posts and mentorship batches. Filter by
          academic subject, class level, and online or offline delivery.
        </p>
      </div>

      {/* Two-Row Search & Filter Card */}
      <div className="mb-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search tuitions by title, subject, or tutor..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
          <button
            type="button"
            onClick={() => fetchTuitions()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e05e00]"
          >
            <Search size={16} />
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="all">All Subjects</option>
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
            <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Class Level
            </label>
            <select
              value={classLevel}
              onChange={(e) => {
                setClassLevel(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="all">All Levels</option>
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
            <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Mode
            </label>
            <select
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="all">All Modes</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RotateCcw size={15} />
              Reset
            </button>
          </div>
        </div>
      </div>

      <p className="mb-5 text-sm font-medium text-slate-600 dark:text-slate-300">
        Showing <strong>{tuitions.length}</strong> of <strong>{total}</strong>{' '}
        tuitions
      </p>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>
      ) : tuitions.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-[#0B1D3A]">
          <p className="text-lg font-semibold text-[#041E42] dark:text-white">
            No tuitions match your filters
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try clearing or adjusting your search keywords.
          </p>
          <button
            onClick={handleReset}
            className="mt-4 rounded-lg bg-[#FF6B00] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e05e00]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tuitions.map((t) => (
            <TuitionCard key={t._id} tuition={t} />
          ))}
        </div>
      )}

      {/* Server-Side Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
                page === num
                  ? 'bg-[#FF6B00] text-white'
                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function BrowseTuitionsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12 text-center text-sm text-slate-500">
          Loading tuitions...
        </div>
      }
    >
      <BrowseTuitionsContent />
    </Suspense>
  );
}