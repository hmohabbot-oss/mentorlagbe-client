'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  Home,
  BookOpen,
  Tag,
  HelpCircle,
  ChevronDown,
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ড্রপডাউনের বাইরে ক্লিক করলে বন্ধ হবে
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Browse Tuitions', href: '/tuitions', icon: BookOpen },
    { label: 'Pricing / Pro Plans', href: '/pricing', icon: Tag },
    { label: 'How It Works', href: '/#how-it-works', icon: HelpCircle },
  ];

  const handleSignOut = async () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    await signOut();
    toast.success('Signed out successfully');
    router.push('/');
  };

  const dashboardHref = user ? `/dashboard/${user.role}` : '/dashboard/student';

  return (
    <header className="sticky top-0 z-50 border-t-4 border-t-[#FF6B00] border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur dark:border-b-slate-800 dark:bg-[#041E42]/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Logo + Spacing */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src={
                theme === 'dark'
                  ? '/images/mentorlagbe-full-dark.png'
                  : '/images/mentorlagbe-full-light.png'
              }
              alt="MentorLagbe"
              width={165}
              height={42}
              className="h-9 w-auto object-contain sm:h-10"
              priority
            />
          </Link>

          <div className="hidden h-6 w-px bg-slate-200 lg:block dark:bg-slate-700" />

          {/* Desktop Navigation (Single-line with whitespace-nowrap) */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#FF6B00]/10 font-semibold text-[#FF6B00]'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-[#FF6B00] dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-[#FF6B00]'
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {loading ? (
            <div className="h-9 w-40 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 py-1 pr-3 pl-1.5 transition hover:border-[#0077CC]/40 hover:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-800"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0077CC] text-xs font-bold text-white">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}

                <span className="max-w-[130px] truncate text-sm font-semibold text-[#041E42] dark:text-white">
                  {user.name}
                </span>

                <span className="rounded-full bg-[#0077CC]/15 px-2.5 py-0.5 text-xs font-semibold capitalize text-[#0077CC] dark:bg-[#0077CC]/30 dark:text-sky-300">
                  {user.role}
                </span>

                <ChevronDown
                  size={15}
                  className={`text-slate-500 transition-transform dark:text-slate-300 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl dark:border-slate-700 dark:bg-[#0B1D3A]">
                  <div className="border-b border-slate-100 px-4 py-2.5 dark:border-slate-800">
                    <p className="truncate text-sm font-bold text-[#041E42] dark:text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href={dashboardHref}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[#0077CC] dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[#0077CC] dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <UserCog size={16} />
                      Update Profile
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/sign-in"
                className="whitespace-nowrap rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="whitespace-nowrap rounded-lg bg-[#FF6B00] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e05e00]"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
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
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden dark:border-slate-800 dark:bg-[#041E42]">
          <div className="flex flex-col gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-[#FF6B00] dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}

            <div className="my-2 border-t border-slate-200 dark:border-slate-700" />

            {user ? (
              <>
                <div className="flex items-center gap-2.5 px-3 py-1">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0077CC] text-xs font-bold text-white">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
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
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#041E42] px-3 py-2.5 text-sm font-medium text-white dark:bg-[#0077CC]"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200"
                >
                  <UserCog size={16} />
                  Update Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 rounded-lg bg-rose-500 px-3 py-2.5 text-sm font-medium text-white"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-center text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-lg bg-[#FF6B00] px-3 py-2.5 text-center text-sm font-semibold text-white"
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