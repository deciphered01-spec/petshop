"use client";

import { useState } from "react";
import {
    DollarSign,
    CreditCard,
    Calendar,
    Plus,
    MoreHorizontal,
    TrendingDown,
    Receipt,
    CheckCircle2,
    Clock,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { useFinance } from "@/hooks/useFinance";

export function ExpensesWidget() {

    const [filter, setFilter] = useState("all");
    const { data: financeItems } = useFinance();

    // Filter only expenses and map to widget format
    const expenses = (financeItems || [])
        .filter(item => item.type === 'expense')
        .map(item => ({
            id: item.id,
            description: item.description,
            amount: Math.abs(item.amount),
            category: item.category,
            status: item.status.toLowerCase(),
            date: item.date,
            // These would ideally come from DB columns for 'recurrence'
            isRecurring: item.category === 'Payroll' || item.category === 'Rent' || false,
            recurrenceInterval: 'Monthly', // Placeholder logic
            nextDueDate: '2024-03-01'      // Placeholder logic
        }));

    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const recurringTotal = expenses.filter(i => i.isRecurring).reduce((sum, item) => sum + item.amount, 0);

    return (
        <Card className="dark:border-white/10 dark:bg-white/5 border-slate-200 bg-white overflow-hidden">
            <CardHeader className="dark:border-b dark:border-white/10 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold dark:text-white text-slate-900 flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-rose-500" />
                            Expense Management
                        </CardTitle>
                        <CardDescription className="dark:text-slate-400 text-slate-500">
                            Track recurring salaries and operational costs
                        </CardDescription>
                    </div>
                    <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white border-0">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Expense
                    </Button>
                </div>

                {/* Expense Stats */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Total Monthly Expenses</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                            ₦{totalExpenses.toLocaleString()}
                        </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Recurring (Projected)</p>
                        <p className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center">
                            ₦{recurringTotal.toLocaleString()}
                            <span className="text-xs font-normal text-slate-400 ml-2">/ month</span>
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <Table>
                    <TableHeader className="dark:bg-slate-900/50 bg-slate-50/80">
                        <TableRow className="dark:border-white/5 border-slate-100">
                            <TableHead className="font-semibold dark:text-slate-400">Description</TableHead>
                            <TableHead className="font-semibold dark:text-slate-400">Category</TableHead>
                            <TableHead className="font-semibold dark:text-slate-400 text-right">Amount</TableHead>
                            <TableHead className="font-semibold dark:text-slate-400">Status</TableHead>
                            <TableHead className="font-semibold dark:text-slate-400 text-right">Next Due</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.map((expense) => (
                            <TableRow key={expense.id} className="dark:border-white/5 border-slate-100 hover:bg-slate-50 dark:hover:bg-white/5">
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium dark:text-white text-slate-900">{expense.description}</span>
                                        {expense.isRecurring && (
                                            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                <Clock className="h-3 w-3" /> Recurring: {expense.recurrenceInterval}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="dark:border-white/10 dark:text-slate-400 text-slate-600">
                                        {expense.category}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right font-medium dark:text-slate-200">
                                    ₦{expense.amount.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={`border-0 ${expense.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                            expense.status === 'pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                                'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                            }`}
                                    >
                                        {expense.status === 'paid' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                                        {expense.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                                        {expense.status === 'overdue' && <AlertCircle className="mr-1 h-3 w-3" />}
                                        {expense.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right text-xs dark:text-slate-400 text-slate-500 font-mono">
                                    {expense.nextDueDate}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* AI Scan Teaser */}
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/10 dark:to-violet-900/10 border-t dark:border-white/5 border-indigo-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-white/10 rounded-lg shadow-sm">
                            <Receipt className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">AI Receipt Scanner</p>
                            <p className="text-xs text-indigo-600 dark:text-indigo-300">
                                Supports PDF, DOCX, TXT, & Images. <span className="font-semibold text-rose-500">No code files.</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/30 dark:text-indigo-300 dark:hover:bg-indigo-500/10">
                            Upload Files
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
