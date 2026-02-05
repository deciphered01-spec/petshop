'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { RevenueLog, Expense } from '@/types/database';

export function useFinance() {
    const supabase = createClient();

    return useQuery({
        queryKey: ['finance-pl'],
        queryFn: async ({ signal }) => {
            // Fetch Revenue
            const { data: revenueData, error: revenueError } = await supabase
                .from('revenue_logs')
                .select('*')
                .order('logged_at', { ascending: false })
                .limit(20)
                .abortSignal(signal);

            if (revenueError) throw revenueError;

            // Fetch Expenses
            const { data: expenseData, error: expenseError } = await supabase
                .from('expenses')
                .select('*')
                .order('expense_date', { ascending: false })
                .limit(20)
                .abortSignal(signal);

            if (expenseError) throw expenseError;

            // Normalize and Merge
            const revenueItems = (revenueData || []).map((r: RevenueLog) => ({
                id: r.id,
                date: new Date(r.logged_at).toISOString().split('T')[0],
                description: r.notes || `Order Repayment #${r.payment_reference || 'N/A'}`,
                category: 'Sales',
                aiTag: r.profit > 100000 ? 'High Margin' : 'Normal',
                amount: r.amount,
                status: 'Verified',
                type: 'revenue'
            }));

            const expenseItems = (expenseData || []).map((e: Expense) => ({
                id: e.id,
                date: e.expense_date,
                description: e.title,
                category: e.category,
                aiTag: 'Fixed', // Placeholder for AI logic
                amount: -Math.abs(e.amount), // Ensure negative
                status: 'Completed',
                type: 'expense'
            }));

            // Combine and Sort by Date Descending
            const allItems = [...revenueItems, ...expenseItems].sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            return allItems;
        },
        staleTime: 30000,
    });
}
