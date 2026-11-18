'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Sun,
  Moon,
  LayoutDashboard,
  UserCog,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
<header className="sticky top-0 z-50 border-t-4 border-t-[#FF6B00] border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur dark:border-b-slate-800 dark:bg-[#041E42]/95"></header>
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Browse Tuitions', href: '/tuitions' },
    { label: 'Pricing / Pro Plans', href: '/pricing' },
    { label: 'How It Works', href: '/#how-it-works' },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    setMobileOpen(false);
    router.push('/');
  };

  const dashboardHref = user ? `/dashboard/${user.role}` : '/dashboard/student';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-[#041E42]/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src={
              theme === 'dark'
                ? '/images/mentorlagbe-full-dark.png'
                : '/images/mentorlagbe-full-light.png'
            }
            alt="MentorLagbe"
            width={170}
            height={44}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[#FF6B00]'
                    : 'text-slate-700 hover:text-[#FF6B00] dark:text-slate-200 dark:hover:text-[#FF6B00]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {loading ? (
            <div className="h-9 w-36 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 dark:border-slate-700 dark:bg-slate-800/70">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0077CC] text-xs font-bold text-white">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <span className="max-w-[110px] truncate text-sm font-semibold text-slate-800 dark:text-white">
                  {user.name}
                </span>
                <span className="rounded-full bg-[#0077CC]/15 px-2 py-0.5 text-xs font-semibold capitalize text-[#0077CC] dark:bg-[#0077CC]/30 dark:text-sky-300">
                  {user.role}
                </span>
              </div>

              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#041E42] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#0a2d5e] dark:bg-[#0077CC] dark:hover:bg-[#0284c7]"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>

              <Link
                href="/dashboard/profile"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <UserCog size={15} />
                Update Profile
              </Link>

              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/sign-in"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-[#FF6B00] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e05e00]"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-lg border border-slate-200 p-2 text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
            className="rounded-lg p-2 text-slate-700 dark:text-slate-200"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden dark:border-slate-800 dark:bg-[#041E42]">
          <div className="flex flex-col gap-3">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-slate-700 hover:text-[#FF6B00] dark:text-slate-200"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800 dark:text-white">
                    {user.name}
                  </span>
                  <span className="rounded-full bg-[#0077CC]/15 px-2 py-0.5 text-xs font-semibold capitalize text-[#0077CC] dark:text-sky-300">
                    {user.role}
                  </span>
                </div>
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-[#041E42] px-3 py-2 text-center text-sm font-medium text-white dark:bg-[#0077CC]"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200"
                >
                  Update Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-medium text-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-lg bg-[#FF6B00] px-3 py-2 text-center text-sm font-semibold text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}