'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { UserProfile, UserRole } from '@/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await apiFetch<{ success: boolean; data: UserProfile[] }>(
          '/api/admin/users'
        );
        setUsers(res.data || []);
      } catch (err) {
        toast.error((err as Error).message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleRoleChange = async (id: string, role: UserRole) => {
    setUpdatingId(id);
    try {
      await apiFetch(`/api/admin/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      });
      toast.success(`User role updated to ${role}`);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
    } catch (err) {
      toast.error((err as Error).message || 'Failed to update role');
    } finally {
      setUpdatingId(null);
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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0B1D3A]">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-[#041E42] dark:text-white">
          User Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          View all registered accounts and assign roles.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <th className="py-3 pr-4">Name</th>
              <th className="py-3 pr-4">Email</th>
              <th className="py-3 pr-4">Plan</th>
              <th className="py-3 pr-4">Current Role</th>
              <th className="py-3 text-right">Change Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="py-3.5 pr-4 font-semibold text-[#041E42] dark:text-white">
                  {u.name}
                </td>
                <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">
                  {u.email}
                </td>
                <td className="py-3.5 pr-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                      u.plan === 'pro'
                        ? 'bg-[#FF6B00] text-white'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {u.plan}
                  </span>
                </td>
                <td className="py-3.5 pr-4 capitalize font-medium text-[#0077CC] dark:text-sky-300">
                  {u.role}
                </td>
                <td className="py-3.5 text-right">
                  <select
                    value={u.role}
                    disabled={updatingId === u._id}
                    onChange={(e) =>
                      handleRoleChange(u._id, e.target.value as UserRole)
                    }
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#0077CC] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    <option value="student">Student</option>
                    <option value="tutor">Tutor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}