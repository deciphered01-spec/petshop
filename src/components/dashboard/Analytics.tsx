"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BarChart3,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data generator for different time ranges
const generateData = (range: "weekly" | "monthly" | "yearly") => {
    if (range === "weekly") {
        return {
            revenue: "₦845,000",
            change: "+5.2%",
            trend: "up",
            chart: [12, 45, 32, 60, 75, 50, 85].map(v => Math.round(v * 1000)), // Daily
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        };
    } else if (range === "monthly") {
        return {
            revenue: "₦2,845,000",
            change: "+12.5%",
            trend: "up",
            chart: [65, 45, 78, 52, 90, 68, 85, 72, 95, 80, 88, 92].map(v => Math.round(v * 3200)), // Days/Weeks
            labels: ["W1", "W2", "W3", "W4"] // Simplified
        };
    } else {
        return {
            revenue: "₦34,150,000",
            change: "+24.8%",
            trend: "up",
            chart: [2.1, 2.4, 2.2, 2.8, 2.6, 2.9, 3.1, 3.4, 3.2, 3.8, 4.1, 4.5].map(v => v * 1000000),
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        };
    }
};

export function Analytics() {
    const [timeRange, setTimeRange] = useState<"weekly" | "monthly" | "yearly">("monthly");
    const data = useMemo(() => generateData(timeRange), [timeRange]);

    const themeClasses = {
        card: "border-white/10 bg-white/5 backdrop-blur-sm",
        text: "text-white",
        textMuted: "text-slate-400"
    };

    return (
        <div className="space-y-6">
            {/* Time Range Filter */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Performance Analytics</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Revenue and profit metrics</p>
                </div>
                <Tabs defaultValue="monthly" onValueChange={(v) => setTimeRange(v as any)} className="w-[300px]">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800">
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        <TabsTrigger value="yearly">Yearly</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Revenue", value: data.revenue, icon: DollarSign, color: "emerald", change: data.change },
                    { title: "Net Profit", value: "₦892,400", icon: TrendingUp, color: "blue", change: "+8.2%" }, // Mock for now
                    { title: "Avg. Order Value", value: "₦18,500", icon: BarChart3, color: "violet", change: "+2.4%" },
                    { title: "Growth Rate", value: data.change, icon: ArrowUpRight, color: "amber", change: "YoY" },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="dark:border-white/10 dark:bg-white/5 border-slate-200 bg-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className={`p-2 rounded-lg bg-${stat.color}-500/10`}>
                                        <stat.icon className={`h-5 w-5 text-${stat.color}-500`} />
                                    </div>
                                    <Badge variant="outline" className={`bg-${stat.color}-500/10 text-${stat.color}-600 border-0`}>
                                        {stat.change}
                                    </Badge>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Dynamic Chart */}
            <Card className="dark:border-white/10 dark:bg-white/5 border-slate-200 bg-white">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Revenue Overview</CardTitle>
                    <CardDescription>
                        {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} performance trend
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full flex items-end justify-between gap-2 px-2">
                        {data.chart.map((value, i) => {
                            const max = Math.max(...data.chart);
                            const height = (value / max) * 100;
                            return (
                                <div key={i} className="flex flex-col items-center flex-1 gap-2 group">
                                    <div className="w-full relative h-full flex items-end">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ duration: 0.5, delay: i * 0.05 }}
                                            className="w-full bg-emerald-500/80 rounded-t-sm group-hover:bg-emerald-400 transition-colors"
                                        >
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded pointer-events-none">
                                                ₦{value.toLocaleString()}
                                            </div>
                                        </motion.div>
                                    </div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[40px]">
                                        {data.labels[i % data.labels.length]}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
