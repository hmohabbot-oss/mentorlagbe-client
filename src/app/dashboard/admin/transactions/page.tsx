'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { PaymentRecord } from '@/types';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await apiFetch<{
          success: boolean;
          data: PaymentRecord[];
        }>('/api/admin/transactions');
        setTransactions(res.data || []);
      } catch (err) {
        toast.error((err as Error).message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

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
          Stripe Subscription Transactions
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          All verified Pro Plan payments recorded via Stripe Checkout &amp;
          Webhooks.
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No Stripe transactions recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <th className="py-3 pr-4">User</th>
                <th className="py-3 pr-4">Role</th>
                <th className="py-3 pr-4">Plan Name</th>
                <th className="py-3 pr-4">Amount</th>
                <th className="py-3 pr-4">Transaction ID</th>
                <th className="py-3 text-right">Payment Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  <td className="py-3.5 pr-4">
                    <p className="font-semibold text-[#041E42] dark:text-white">
                      {tx.userName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {tx.userEmail}
                    </p>
                  </td>
                  <td className="py-3.5 pr-4 capitalize font-medium text-[#0077CC] dark:text-sky-300">
                    {tx.userRole}
                  </td>
                  <td className="py-3.5 pr-4 font-medium text-slate-800 dark:text-slate-200">
                    {tx.planName}
                  </td>
                  <td className="py-3.5 pr-4 font-bold text-emerald-600 dark:text-emerald-400">
                    ${tx.amount} {tx.currency}
                  </td>
                  <td className="py-3.5 pr-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                    {tx.transactionId}
                  </td>
                  <td className="py-3.5 text-right text-slate-600 dark:text-slate-300">
                    {new Date(tx.paidAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}