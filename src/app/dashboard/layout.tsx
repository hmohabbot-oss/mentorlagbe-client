'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  BookOpen,
  Users,
  CheckSquare,
  Receipt,
  UserCog,
  PanelLeftClose,
  PanelLeftOpen,
  Crown,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  // Reload-Safe Private Route Guard
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/sign-in');
      return;
    }

    if (
      pathname.startsWith('/dashboard/student') &&
      user.role !== 'student'
    ) {
      router.replace(`/dashboard/${user.role}`);
    } else if (
      pathname.startsWith('/dashboard/tutor') &&
      user.role !== 'tutor'
    ) {
      router.replace(`/dashboard/${user.role}`);
    } else if (
      pathname.startsWith('/dashboard/admin') &&
      user.role !== 'admin'
    ) {
      router.replace(`/dashboard/${user.role}`);
    }
  }, [user, loading, pathname, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="animate-spin text-[#FF6B00]" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  const studentLinks = [
    { label: 'Overview', href: '/dashboard/student', icon: LayoutDashboard },
    {
      label: 'My Applications',
      href: '/dashboard/student/my-applications',
      icon: FileText,
    },
    { label: 'Update Profile', href: '/dashboard/profile', icon: UserCog },
  ];

  const tutorLinks = [
    { label: 'Overview', href: '/dashboard/tutor', icon: LayoutDashboard },
    {
      label: 'Post a Tuition',
      href: '/dashboard/tutor/post-tuition',
      icon: PlusCircle,
    },
    {
      label: 'My Tuitions',
      href: '/dashboard/tutor/my-tuitions',
      icon: BookOpen,
    },
    {
      label: 'Manage Applicants',
      href: '/dashboard/tutor/applicants',
      icon: Users,
    },
    { label: 'Update Profile', href: '/dashboard/profile', icon: UserCog },
  ];

  const adminLinks = [
    { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'User Management', href: '/dashboard/admin/users', icon: Users },
    {
      label: 'Tuition Approvals',
      href: '/dashboard/admin/tuitions',
      icon: CheckSquare,
    },
    {
      label: 'Transactions',
      href: '/dashboard/admin/transactions',
      icon: Receipt,
    },
    { label: 'Update Profile', href: '/dashboard/profile', icon: UserCog },
  ];

  const navItems =
    user.role === 'admin'
      ? adminLinks
      : user.role === 'tutor'
      ? tutorLinks
      : studentLinks;

  return (
    <div className="flex min-h-[85vh] w-full flex-col md:flex-row">
      {/* Sidebar */}
      <aside
        className={`border-b border-slate-200 bg-white transition-all duration-200 md:border-r md:border-b-0 dark:border-slate-800 dark:bg-[#041E42] ${
          collapsed ? 'md:w-20' : 'md:w-64'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          {!collapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0077CC] text-sm font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#041E42] dark:text-white">
                  {user.name}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold capitalize text-[#0077CC] dark:text-sky-300">
                    {user.role}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                      user.plan === 'pro'
                        ? 'bg-[#FF6B00] text-white'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {user.plan === 'pro' && <Crown size={10} />}
                    {user.plan}
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle Sidebar"
            className="hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 md:inline-flex dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
        </div>

        <nav className="flex gap-2 overflow-x-auto p-3 md:flex-col">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                  active
                    ? 'bg-[#FF6B00] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-slate-50 p-4 sm:p-6 lg:p-8 dark:bg-[#07152B]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {user.role} Workspace
            </p>
            <h2 className="text-lg font-bold text-[#041E42] dark:text-white">
              Welcome, {user.name}
            </h2>
          </div>

          {user.plan === 'free' && user.role !== 'admin' && (
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF6B00] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#e05e00]"
            >
              <Crown size={14} />
              Upgrade to Pro
            </Link>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}