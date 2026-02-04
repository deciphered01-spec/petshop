"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Package,
    Users,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Mock data generator based on month
function getMonthData(monthIndex: number) {
    const baseRevenue = 2000000 + (monthIndex * 100000) + Math.random() * 500000;
    const baseOrders = 800 + (monthIndex * 30) + Math.floor(Math.random() * 200);

    return {
        revenue: Math.floor(baseRevenue),
        orders: baseOrders,
        customers: Math.floor(baseOrders * 0.7),
        avgOrder: Math.floor(baseRevenue / baseOrders),
        revenueChange: (Math.random() * 20 - 5).toFixed(1),
        ordersChange: (Math.random() * 15 - 3).toFixed(1),
        dailyData: Array.from({ length: 30 }, (_, i) => ({
            day: i + 1,
            revenue: Math.floor((baseRevenue / 30) * (0.5 + Math.random())),
            orders: Math.floor((baseOrders / 30) * (0.5 + Math.random())),
        })),
        topProducts: [
            { name: "Royal Canin Medium Adult", revenue: Math.floor(baseRevenue * 0.15), units: Math.floor(baseOrders * 0.2) },
            { name: "Pedigree Puppy Food 3kg", revenue: Math.floor(baseRevenue * 0.12), units: Math.floor(baseOrders * 0.15) },
            { name: "Pet Multivitamin Supplement", revenue: Math.floor(baseRevenue * 0.1), units: Math.floor(baseOrders * 0.12) },
            { name: "Dog Collar - Premium", revenue: Math.floor(baseRevenue * 0.08), units: Math.floor(baseOrders * 0.1) },
            { name: "Cat Litter Premium 10kg", revenue: Math.floor(baseRevenue * 0.07), units: Math.floor(baseOrders * 0.08) },
        ],
        weeklyBreakdown: [
            { week: "Week 1", revenue: Math.floor(baseRevenue * 0.22), orders: Math.floor(baseOrders * 0.22) },
            { week: "Week 2", revenue: Math.floor(baseRevenue * 0.25), orders: Math.floor(baseOrders * 0.25) },
            { week: "Week 3", revenue: Math.floor(baseRevenue * 0.28), orders: Math.floor(baseOrders * 0.28) },
            { week: "Week 4", revenue: Math.floor(baseRevenue * 0.25), orders: Math.floor(baseOrders * 0.25) },
        ],
    };
}

export default function MonthRevenuePage({ params }: { params: Promise<{ month: string }> }) {
    const resolvedParams = use(params);
    const monthParam = resolvedParams.month.toLowerCase();
    const monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthParam);
    const monthName = monthIndex !== -1 ? monthNames[monthIndex] : "Unknown";
    const year = 2024;

    const data = getMonthData(monthIndex !== -1 ? monthIndex : 0);
    const maxDailyRevenue = Math.max(...data.dailyData.map(d => d.revenue));

    const prevMonth = monthIndex > 0 ? monthNames[monthIndex - 1].toLowerCase() : null;
    const nextMonth = monthIndex < 11 ? monthNames[monthIndex + 1].toLowerCase() : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Ambient effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl"
                >
                    <div className="flex h-16 items-center justify-between px-6">
                        <div className="flex items-center gap-4">
                            <Link href="/admin">
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <div className="flex items-center gap-3">
                                {prevMonth && (
                                    <Link href={`/admin/revenue/${prevMonth}`}>
                                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
                                            <ChevronLeft className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                )}
                                <div>
                                    <h1 className="text-lg font-bold text-white">{monthName} {year}</h1>
                                    <p className="text-xs text-slate-400">Monthly Revenue Details</p>
                                </div>
                                {nextMonth && (
                                    <Link href={`/admin/revenue/${nextMonth}`}>
                                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
                                            <ChevronRight className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                        <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                            <Download className="mr-2 h-4 w-4" />
                            Export Report
                        </Button>
                    </div>
                </motion.header>

                <main className="p-6 max-w-7xl mx-auto">
                    {/* Stats Overview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                    >
                        {[
                            { label: "Total Revenue", value: `₦${data.revenue.toLocaleString()}`, change: `${data.revenueChange}%`, trend: Number(data.revenueChange) > 0 ? "up" : "down", icon: DollarSign, gradient: "from-emerald-500 to-teal-600" },
                            { label: "Total Orders", value: data.orders.toString(), change: `${data.ordersChange}%`, trend: Number(data.ordersChange) > 0 ? "up" : "down", icon: ShoppingCart, gradient: "from-blue-500 to-cyan-600" },
                            { label: "Customers", value: data.customers.toString(), change: "+12%", trend: "up", icon: Users, gradient: "from-violet-500 to-purple-600" },
                            { label: "Avg Order Value", value: `₦${data.avgOrder.toLocaleString()}`, change: "+5%", trend: "up", icon: Package, gradient: "from-amber-500 to-orange-600" },
                        ].map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -4 }}
                                >
                                    <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                                                    <Icon className="h-5 w-5 text-white" />
                                                </div>
                                                <Badge className={`border-0 ${stat.trend === "up"
                                                        ? "bg-emerald-500/20 text-emerald-400"
                                                        : "bg-rose-500/20 text-rose-400"
                                                    }`}>
                                                    {stat.trend === "up" ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                                                    {stat.change}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-400">{stat.label}</p>
                                            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Daily Revenue Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-2"
                        >
                            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                                <CardHeader className="border-b border-white/10">
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-emerald-400" />
                                        Daily Revenue - {monthName}
                                    </CardTitle>
                                    <CardDescription className="text-slate-400">Revenue breakdown by day</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="flex items-end gap-1 h-64 overflow-x-auto pb-2">
                                        {data.dailyData.map((day, index) => (
                                            <motion.div
                                                key={day.day}
                                                className="flex flex-col items-center gap-1 min-w-[24px]"
                                                initial={{ height: 0 }}
                                                animate={{ height: "100%" }}
                                                transition={{ delay: 0.4 + index * 0.02 }}
                                            >
                                                <div className="flex-1 w-full flex flex-col justify-end">
                                                    <motion.div
                                                        className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t cursor-pointer hover:from-emerald-500 hover:to-teal-300 transition-all relative group"
                                                        style={{ height: `${(day.revenue / maxDailyRevenue) * 100}%`, minHeight: "4px" }}
                                                        whileHover={{ scale: 1.1 }}
                                                    >
                                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                            ₦{day.revenue.toLocaleString()}
                                                            <br />
                                                            {day.orders} orders
                                                        </div>
                                                    </motion.div>
                                                </div>
                                                <span className="text-[10px] text-slate-500">{day.day}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Weekly Breakdown */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                                <CardHeader className="border-b border-white/10">
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-blue-400" />
                                        Weekly Breakdown
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        {data.weeklyBreakdown.map((week, index) => (
                                            <motion.div
                                                key={week.week}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + index * 0.1 }}
                                                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-white font-medium">{week.week}</span>
                                                    <span className="text-emerald-400 font-semibold">₦{week.revenue.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-slate-400">
                                                    <span>{week.orders} orders</span>
                                                    <span>Avg: ₦{Math.floor(week.revenue / week.orders).toLocaleString()}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Top Products */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6"
                    >
                        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                            <CardHeader className="border-b border-white/10">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Package className="h-5 w-5 text-amber-400" />
                                    Top Products This Month
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                                    {data.topProducts.map((product, index) => (
                                        <motion.div
                                            key={product.name}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.7 + index * 0.1 }}
                                            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-center"
                                        >
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 mx-auto mb-3 text-white font-bold">
                                                #{index + 1}
                                            </div>
                                            <p className="text-sm font-medium text-white truncate">{product.name}</p>
                                            <p className="text-lg font-bold text-emerald-400 mt-1">₦{product.revenue.toLocaleString()}</p>
                                            <p className="text-xs text-slate-500">{product.units} units sold</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
