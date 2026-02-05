"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  DollarSign,
  Plus,
  Repeat,
  Trash2,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface RecurringExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  is_recurring: boolean;
  recurrence_interval: string;
  next_due_date: string;
  status: string;
  created_at: string;
}

const categories = [
  "Payroll",
  "Rent",
  "Utilities",
  "Insurance",
  "Software",
  "Maintenance",
  "Other"
];

const intervals = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" }
];

export function RecurringExpensesManager() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const queryClient = useQueryClient();
  const supabase = createClient();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: 0,
    category: "Payroll",
    recurrence_interval: "monthly",
    next_due_date: new Date().toISOString().split('T')[0],
  });

  // Fetch recurring expenses
  const { data: expenses, isLoading } = useQuery({
    queryKey: ["recurring-expenses"],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("is_recurring", true)
        .order("next_due_date", { ascending: true })
        .abortSignal(signal);

      if (error) throw error;
      return data as RecurringExpense[];
    },
    staleTime: 30000,
  });

  // Add recurring expense
  const addExpense = useMutation({
    mutationFn: async (expense: typeof formData) => {
      const { data, error } = await supabase
        .from("expenses")
        .insert({
          description: expense.description,
          amount: expense.amount,
          category: expense.category,
          is_recurring: true,
          recurrence_interval: expense.recurrence_interval,
          next_due_date: expense.next_due_date,
          status: "active",
          date_incurred: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      toast.success("Recurring expense added successfully");
      setFormData({
        description: "",
        amount: 0,
        category: "Payroll",
        recurrence_interval: "monthly",
        next_due_date: new Date().toISOString().split('T')[0],
      });
      setIsAddingNew(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add recurring expense");
    },
  });

  // Delete recurring expense
  const deleteExpense = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("expenses")
        .update({ status: "cancelled" })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      toast.success("Recurring expense cancelled");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to cancel recurring expense");
    },
  });

  // Generate recurring expenses
  const generateExpenses = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/recurring-expenses/generate", {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate expenses");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["finance-data"] });
      toast.success(data.message || `${data.count} expenses generated`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to generate expenses");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || formData.amount <= 0) {
      toast.error("Please fill all required fields");
      return;
    }
    addExpense.mutate(formData);
  };

  const themeClasses = {
    card: isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white",
    input: isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-200",
    text: isDark ? "text-white" : "text-slate-900",
    textMuted: isDark ? "text-slate-400" : "text-slate-600",
  };

  return (
    <div className="space-y-6">
      {/* Header with Generate Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Recurring Expenses</h2>
          <p className={themeClasses.textMuted}>
            Manage auto-generated monthly expenses like salaries and rent
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => generateExpenses.mutate()}
            disabled={generateExpenses.isPending}
            className="bg-gradient-to-r from-blue-500 to-cyan-600"
          >
            {generateExpenses.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Generate Due Expenses
          </Button>
          <Button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Recurring Expense
          </Button>
        </div>
      </div>

      {/* Add New Form */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className={themeClasses.card}>
              <CardHeader>
                <CardTitle className={themeClasses.text}>New Recurring Expense</CardTitle>
                <CardDescription className={themeClasses.textMuted}>
                  This expense will be auto-generated based on the recurrence interval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={`mb-2 block text-sm font-medium ${themeClasses.text}`}>
                        Description *
                      </label>
                      <Input
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="e.g., Monthly Staff Salaries"
                        className={themeClasses.input}
                        required
                      />
                    </div>
                    <div>
                      <label className={`mb-2 block text-sm font-medium ${themeClasses.text}`}>
                        Amount (₦) *
                      </label>
                      <Input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                        placeholder="0.00"
                        className={themeClasses.input}
                        min={0}
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className={`mb-2 block text-sm font-medium ${themeClasses.text}`}>
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className={`w-full rounded-lg border px-3 py-2 ${themeClasses.input}`}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={`mb-2 block text-sm font-medium ${themeClasses.text}`}>
                        Recurrence
                      </label>
                      <select
                        value={formData.recurrence_interval}
                        onChange={(e) => setFormData({ ...formData, recurrence_interval: e.target.value })}
                        className={`w-full rounded-lg border px-3 py-2 ${themeClasses.input}`}
                      >
                        {intervals.map((interval) => (
                          <option key={interval.value} value={interval.value}>
                            {interval.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={`mb-2 block text-sm font-medium ${themeClasses.text}`}>
                        Next Due Date
                      </label>
                      <Input
                        type="date"
                        value={formData.next_due_date}
                        onChange={(e) => setFormData({ ...formData, next_due_date: e.target.value })}
                        className={themeClasses.input}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddingNew(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={addExpense.isPending}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600"
                    >
                      {addExpense.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save Recurring Expense
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expenses List */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card className={themeClasses.card}>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </CardContent>
          </Card>
        ) : expenses && expenses.length > 0 ? (
          expenses.map((expense, index) => {
            const isOverdue = new Date(expense.next_due_date) < new Date();
            const daysUntilDue = Math.ceil(
              (new Date(expense.next_due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={themeClasses.card}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        isOverdue
                          ? "bg-rose-500/20"
                          : "bg-emerald-500/20"
                      }`}>
                        <Repeat className={`h-6 w-6 ${
                          isOverdue ? "text-rose-500" : "text-emerald-500"
                        }`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${themeClasses.text}`}>
                          {expense.description}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {expense.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {expense.recurrence_interval}
                          </Badge>
                          <span className={`text-xs ${themeClasses.textMuted}`}>
                            Next due: {new Date(expense.next_due_date).toLocaleDateString()}
                            {isOverdue && " (Overdue)"}
                            {!isOverdue && daysUntilDue <= 7 && ` (${daysUntilDue} days)`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${themeClasses.text}`}>
                          ₦{expense.amount.toLocaleString()}
                        </div>
                        {isOverdue ? (
                          <Badge className="bg-rose-500/20 text-rose-600 border-0">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Due
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-500/20 text-emerald-600 border-0">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Active
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteExpense.mutate(expense.id)}
                        className="text-rose-500 hover:bg-rose-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <Card className={themeClasses.card}>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-slate-400 mb-4" />
              <p className={themeClasses.textMuted}>No recurring expenses set up yet</p>
              <Button
                onClick={() => setIsAddingNew(true)}
                variant="outline"
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Recurring Expense
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
