"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/hooks/useFinance";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

type TimeRange = "week" | "month" | "year";

export function RevenueMetrics() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const supabase = createClient();

  // Fetch all revenue and expenses for calculations
  const { data: revenueData } = useQuery({
    queryKey: ["revenue-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("revenue_logs")
        .select("*")
        .order("logged_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const { data: expenseData } = useQuery({
    queryKey: ["expenses-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("expense_date", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Calculate metrics based on time range
  const metrics = useMemo(() => {
    if (!revenueData || !expenseData) {
      return {
        revenue: 0,
        expenses: 0,
        profit: 0,
        revenueGrowth: 0,
        profitGrowth: 0,
        transactionCount: 0,
      };
    }

    const now = new Date();
    let startDate = new Date();
    let previousStartDate = new Date();

    // Calculate date ranges
    if (timeRange === "week") {
      startDate = new Date(now.setDate(now.getDate() - 7));
      previousStartDate = new Date(now.setDate(now.getDate() - 14));
    } else if (timeRange === "month") {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      previousStartDate = new Date(now.setMonth(now.getMonth() - 2));
    } else {
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      previousStartDate = new Date(now.setFullYear(now.getFullYear() - 2));
    }

    // Filter current period
    const currentRevenue = revenueData.filter(
      (r) => new Date(r.logged_at) >= startDate
    );
    const currentExpenses = expenseData.filter(
      (e) => new Date(e.expense_date) >= startDate
    );

    // Filter previous period
    const previousRevenue = revenueData.filter(
      (r) =>
        new Date(r.logged_at) >= previousStartDate &&
        new Date(r.logged_at) < startDate
    );
    const previousExpenses = expenseData.filter(
      (e) =>
        new Date(e.expense_date) >= previousStartDate &&
        new Date(e.expense_date) < startDate
    );

    // Calculate totals
    const revenue = currentRevenue.reduce((acc, r) => acc + r.amount, 0);
    const expenses = currentExpenses.reduce((acc, e) => acc + e.amount, 0);
    const profit = revenue - expenses;

    const prevRevenue = previousRevenue.reduce((acc, r) => acc + r.amount, 0);
    const prevExpenses = previousExpenses.reduce((acc, e) => acc + e.amount, 0);
    const prevProfit = prevRevenue - prevExpenses;

    // Calculate growth rates
    const revenueGrowth =
      prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0;
    const profitGrowth =
      prevProfit > 0 ? ((profit - prevProfit) / Math.abs(prevProfit)) * 100 : 0;

    return {
      revenue,
      expenses,
      profit,
      revenueGrowth,
      profitGrowth,
      transactionCount: currentRevenue.length,
    };
  }, [revenueData, expenseData, timeRange]);

  const timeRangeButtons: { value: TimeRange; label: string }[] = [
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Financial Summary
        </h3>
        <div className="flex gap-2">
          {timeRangeButtons.map((btn) => (
            <Button
              key={btn.value}
              size="sm"
              variant={timeRange === btn.value ? "default" : "outline"}
              onClick={() => setTimeRange(btn.value)}
              className={
                timeRange === btn.value
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0"
                  : "border-slate-200 dark:border-white/10"
              }
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Total Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Total Revenue
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                      ₦{metrics.revenue.toLocaleString()}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {metrics.revenueGrowth >= 0 ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 hover:bg-emerald-500/20">
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                        +{metrics.revenueGrowth.toFixed(1)}%
                      </Badge>
                    ) : (
                      <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-0 hover:bg-rose-500/20">
                        <ArrowDownRight className="mr-1 h-3 w-3" />
                        {metrics.revenueGrowth.toFixed(1)}%
                      </Badge>
                    )}
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      vs previous period
                    </span>
                  </div>
                </div>
                <div className="rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-950 p-3">
                  <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Expenses Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Total Expenses
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                      ₦{metrics.expenses.toLocaleString()}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-0">
                      <Activity className="mr-1 h-3 w-3" />
                      {metrics.transactionCount} transactions
                    </Badge>
                  </div>
                </div>
                <div className="rounded-full bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900 dark:to-rose-950 p-3">
                  <TrendingDown className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Net Profit Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-slate-200 dark:border-white/10 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-2xl" />
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    Net Profit
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-emerald-900 dark:text-emerald-300">
                      ₦{metrics.profit.toLocaleString()}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {metrics.profitGrowth >= 0 ? (
                      <Badge className="bg-emerald-600 text-white border-0 hover:bg-emerald-700">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        +{metrics.profitGrowth.toFixed(1)}%
                      </Badge>
                    ) : (
                      <Badge className="bg-rose-600 text-white border-0 hover:bg-rose-700">
                        <TrendingDown className="mr-1 h-3 w-3" />
                        {metrics.profitGrowth.toFixed(1)}%
                      </Badge>
                    )}
                    <span className="text-xs text-emerald-700 dark:text-emerald-400">
                      margin growth
                    </span>
                  </div>
                </div>
                <div className="rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 p-3 shadow-lg shadow-emerald-500/25">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
