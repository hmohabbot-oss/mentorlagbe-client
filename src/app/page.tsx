'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  CheckCircle2,
  Sparkles,
  UserPlus,
  BookOpenCheck,
  CreditCard,
  Award,
  Code2,
  Calculator,
  Atom,
  Languages,
  Star,
  ArrowRight,
} from 'lucide-react';
import { API_URL } from '@/lib/api';
import { Tuition } from '@/types';
import TuitionCard from '@/components/TuitionCard';

export default function HomePage() {
  const [featured, setFeatured] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch(`${API_URL}/api/tuitions/featured`);
        const json = await res.json();
        if (json?.success && Array.isArray(json.data)) {
          setFeatured(json.data);
        }
      } catch (err) {
        console.error('Failed to load featured tuitions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const topSubjects = [
    {
      name: 'Mathematics',
      desc: 'SSC, HSC, O/A Level & Admission Math',
      icon: Calculator,
      color: 'bg-blue-50 text-[#0077CC] dark:bg-blue-900/30 dark:text-sky-300',
    },
    {
      name: 'Physics',
      desc: 'Conceptual Mechanics, Optics & Numericals',
      icon: Atom,
      color: 'bg-orange-50 text-[#FF6B00] dark:bg-orange-900/30 dark:text-orange-300',
    },
    {
      name: 'Programming',
      desc: 'Next.js, Python, C & Competitive Coding',
      icon: Code2,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
    },
    {
      name: 'IELTS',
      desc: 'Band 7.5+ Speaking, Writing & Mock Tests',
      icon: Languages,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Create Your Account',
      desc: 'Register in seconds as a Student or a Verified Tutor with role-based access.',
      icon: UserPlus,
    },
    {
      step: '02',
      title: 'Browse or Post Batches',
      desc: 'Students search approved tuitions by subject & mode; Tutors publish curated batches.',
      icon: BookOpenCheck,
    },
    {
      step: '03',
      title: 'Apply & Connect',
      desc: 'Students submit preferred schedules and Tutors accept or manage applicants.',
      icon: CheckCircle2,
    },
    {
      step: '04',
      title: 'Unlock Pro Perks',
      desc: 'Upgrade with Stripe Checkout for unlimited tutor posts or priority student booking.',
      icon: CreditCard,
    },
  ];

  const testimonials = [
    {
      name: 'Ayman Karim',
      role: 'HSC Science Student',
      quote:
        'Found an amazing Higher Math mentor within two days. The online batch structure and weekly mock tests boosted my confidence.',
    },
    {
      name: 'Dr. Rafiqul Islam',
      role: 'Pro Physics Tutor',
      quote:
        'MentorLagbe Pro lets me manage all my batches and incoming student applications in one clean dashboard without any hassle.',
    },
    {
      name: 'Maliha Rahman',
      role: 'IELTS Candidate',
      quote:
        'Transparent monthly fees, verified tutors, and real-time application status tracking make this platform stand out.',
    },
  ];

  return (
    <div>
      {/* 1. Hero / Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#EAF3FF] via-white to-[#FFF2E6] py-16 lg:py-24 dark:from-[#041E42] dark:via-[#07152B] dark:to-[#0B2347]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FF6B00]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF6B00] dark:bg-[#FF6B00]/20">
              <Sparkles size={14} />
              Bangladesh&apos;s Smart Tuition Ecosystem
            </span>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#041E42] sm:text-5xl dark:text-white">
              Find Your Ideal Tutor or{' '}
              <span className="text-[#FF6B00]">Mentorship Batch</span> Today
            </h1>

            <ul className="space-y-2.5 text-base text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rotate-45 bg-[#FF6B00]" />
                <span>
                  <strong>Admin-verified</strong> Online &amp; Home tuition batches
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rotate-45 bg-[#0077CC]" />
                <span>
                  Filter by <strong>Subject, Class Level, Mode &amp; Budget</strong>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rotate-45 bg-[#FF6B00]" />
                <span>
                  Real-time application tracking &amp; <strong>Stripe Pro</strong> upgrades
                </span>
              </li>
            </ul>

            {/* Search & CTA */}
            <form
              action="/tuitions"
              method="GET"
              className="flex flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Math, Physics, IELTS, Next.js..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-10 text-sm text-slate-900 shadow-sm outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#e05e00]"
              >
                Browse Tuitions
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

          {/* Right Collage (Wyzant-inspired Color Accent Grid) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border-4 border-white shadow-md dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600"
                  alt="Students collaborating"
                  className="h-44 w-full object-cover"
                />
              </div>
              <div className="rounded-2xl bg-[#041E42] p-5 text-white shadow-md">
                <p className="text-3xl font-extrabold text-[#FF6B00]">1,200+</p>
                <p className="mt-1 text-sm text-slate-200">
                  Verified Subject Mentors Ready to Teach
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-[#FF6B00] p-5 text-white shadow-md">
                <p className="text-3xl font-extrabold">98%</p>
                <p className="mt-1 text-sm text-orange-50">
                  Student &amp; Parent Match Satisfaction
                </p>
              </div>
              <div className="overflow-hidden rounded-2xl border-4 border-white shadow-md dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600"
                  alt="Verified Tutor"
                  className="h-44 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Dynamic Featured Tuitions Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              Freshly Approved
            </p>
            <h2 className="mt-1 text-3xl font-extrabold text-[#041E42] dark:text-white">
              Featured Tuitions &amp; Batches
            </h2>
          </div>
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0077CC] hover:underline dark:text-sky-400"
          >
            View All Tuitions
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">
            No approved tuitions available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((tuition) => (
              <TuitionCard key={tuition._id} tuition={tuition} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Extra Section 1 — How MentorLagbe Works */}
      <section
        id="how-it-works"
        className="bg-[#EEF5FF] py-16 dark:bg-[#041E42]/60"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              Simple Workflow
            </p>
            <h2 className="mt-1 text-3xl font-extrabold text-[#041E42] dark:text-white">
              How MentorLagbe Works
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF6B00]/10 text-[#FF6B00]">
                      <Icon size={22} />
                    </div>
                    <span className="text-2xl font-extrabold text-slate-200 dark:text-slate-700">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#041E42] dark:text-white">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Pricing / Subscription Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
            Flexible Plans
          </p>
          <h2 className="mt-1 text-3xl font-extrabold text-[#041E42] dark:text-white">
            Upgrade to MentorLagbe Pro
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Start free or unlock unlimited tuition posts and priority booking with Stripe.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Free Tier */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]">
            <h3 className="text-lg font-bold text-[#041E42] dark:text-white">
              Free Starter
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              For new Students &amp; Tutors
            </p>
            <p className="my-5 text-4xl font-extrabold text-[#041E42] dark:text-white">
              $0
            </p>
            <ul className="mb-6 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#0077CC]" />
                Browse &amp; apply to approved tuitions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#0077CC]" />
                Post up to 2 tuition batches (Tutors)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#0077CC]" />
                Real-time application status
              </li>
            </ul>
            <Link
              href="/sign-up"
              className="mt-auto rounded-lg border border-slate-300 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Student */}
          <div className="flex flex-col rounded-2xl border-2 border-[#0077CC] bg-white p-7 shadow-md dark:bg-[#0B1D3A]">
            <h3 className="text-lg font-bold text-[#041E42] dark:text-white">
              Pro Student Plan
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Priority mentorship access
            </p>
            <p className="my-5 text-4xl font-extrabold text-[#0077CC] dark:text-sky-400">
              $10
            </p>
            <ul className="mb-6 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#0077CC]" />
                Priority application review by tutors
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#0077CC]" />
                Pro Student badge on applications
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#0077CC]" />
                One-time secure Stripe upgrade
              </li>
            </ul>
            <Link
              href="/pricing"
              className="mt-auto rounded-lg bg-[#0077CC] py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#0284c7]"
            >
              Subscribe with Stripe
            </Link>
          </div>

          {/* Pro Tutor */}
          <div className="flex flex-col rounded-2xl border-2 border-[#FF6B00] bg-[#041E42] p-7 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Pro Tutor Plan</h3>
              <span className="rounded-full bg-[#FF6B00] px-2.5 py-0.5 text-xs font-bold">
                Popular
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-300">
              Scale your teaching batches
            </p>
            <p className="my-5 text-4xl font-extrabold text-[#FF6B00]">$15</p>
            <ul className="mb-6 space-y-2.5 text-sm text-slate-200">
              <li className="flex items-center gap-2">
                <Award size={16} className="text-[#FF6B00]" />
                Unlimited tuition batch postings
              </li>
              <li className="flex items-center gap-2">
                <Award size={16} className="text-[#FF6B00]" />
                Verified Pro Tutor badge
              </li>
              <li className="flex items-center gap-2">
                <Award size={16} className="text-[#FF6B00]" />
                One-time secure Stripe upgrade
              </li>
            </ul>
            <Link
              href="/pricing"
              className="mt-auto rounded-lg bg-[#FF6B00] py-2.5 text-center text-sm font-bold text-white transition hover:bg-[#e05e00]"
            >
              Subscribe with Stripe
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Extra Section 2 — Top Subjects, Platform Stats & Testimonials */}
      <section className="bg-slate-100 py-16 dark:bg-[#041E42]/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              Explore By Category
            </p>
            <h2 className="mt-1 text-3xl font-extrabold text-[#041E42] dark:text-white">
              Popular Subjects &amp; Student Stories
            </h2>
          </div>

          <div className="mb-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {topSubjects.map((sub) => {
              const Icon = sub.icon;
              return (
                <Link
                  key={sub.name}
                  href={`/tuitions?subject=${encodeURIComponent(sub.name)}`}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-[#0B1D3A]"
                >
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${sub.color}`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-[#041E42] dark:text-white">
                    {sub.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {sub.desc}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]"
              >
                <div className="mb-3 flex gap-1 text-[#FF6B00]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <p className="text-sm font-bold text-[#041E42] dark:text-white">
                    {t.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}