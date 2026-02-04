"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    BarChart3,
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    ShoppingCart,
    Package,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const analyticsData = {
    overview: [
        { label: "Total Revenue", value: "₦2,845,000", change: "+12.5%", trend: "up", icon: DollarSign },
        { label: "Total Orders", value: "1,234", change: "+8.3%", trend: "up", icon: ShoppingCart },
        { label: "Total Customers", value: "856", change: "+15.2%", trend: "up", icon: Users },
        { label: "Avg Order Value", value: "₦23,052", change: "-2.1%", trend: "down", icon: Package },
    ],
    topProducts: [
        { name: "Royal Canin Medium Adult", units: 245, revenue: "₦612,500", growth: "+18%" },
        { name: "Pedigree Puppy Food 3kg", units: 189, revenue: "₦378,000", growth: "+12%" },
        { name: "Pet Multivitamin Supplement", units: 156, revenue: "₦234,000", growth: "+25%" },
        { name: "Dog Collar - Premium", units: 134, revenue: "₦201,000", growth: "+8%" },
        { name: "Cat Litter Premium 10kg", units: 98, revenue: "₦196,000", growth: "+5%" },
    ],
    weeklyData: [
        { day: "Mon", sales: 42, revenue: 85000 },
        { day: "Tue", sales: 38, revenue: 72000 },
        { day: "Wed", sales: 55, revenue: 98000 },
        { day: "Thu", sales: 48, revenue: 89000 },
        { day: "Fri", sales: 67, revenue: 125000 },
        { day: "Sat", sales: 89, revenue: 178000 },
        { day: "Sun", sales: 34, revenue: 65000 },
    ],
};

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState("7d");
    const maxRevenue = Math.max(...analyticsData.weeklyData.map(d => d.revenue));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Ambient effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
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
                            <div>
                                <h1 className="text-lg font-bold text-white">Analytics</h1>
                                <p className="text-xs text-slate-400">Business performance insights</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex bg-white/5 rounded-lg p-1">
                                {["24h", "7d", "30d", "90d"].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range)}
                                        className={`px-3 py-1 text-sm rounded-md transition-all ${timeRange === range
                                                ? "bg-white/10 text-white"
                                                : "text-slate-400 hover:text-white"
                                            }`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                            <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </div>
                </motion.header>

                <main className="p-6 max-w-7xl mx-auto">
                    {/* Overview Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                    >
                        {analyticsData.overview.map((stat, index) => {
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
                                                <div className={`p-3 rounded-xl ${stat.trend === "up" ? "bg-emerald-500/20" : "bg-rose-500/20"
                                                    }`}>
                                                    <Icon className={`h-5 w-5 ${stat.trend === "up" ? "text-emerald-400" : "text-rose-400"
                                                        }`} />
                                                </div>
                                                <Badge className={`border-0 ${stat.trend === "up"
                                                        ? "bg-emerald-500/20 text-emerald-400"
                                                        : "bg-rose-500/20 text-rose-400"
                                                    }`}>
                                                    {stat.trend === "up" ? (
                                                        <ArrowUpRight className="mr-1 h-3 w-3" />
                                                    ) : (
                                                        <ArrowDownRight className="mr-1 h-3 w-3" />
                                                    )}
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
                        {/* Weekly Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-2"
                        >
                            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                                <CardHeader className="border-b border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-white flex items-center gap-2">
                                                <BarChart3 className="h-5 w-5 text-blue-400" />
                                                Weekly Performance
                                            </CardTitle>
                                            <CardDescription className="text-slate-400">Sales and revenue by day</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="flex items-end justify-between gap-4 h-64">
                                        {analyticsData.weeklyData.map((day, index) => (
                                            <motion.div
                                                key={day.day}
                                                className="flex-1 flex flex-col items-center gap-2"
                                                initial={{ height: 0 }}
                                                animate={{ height: "100%" }}
                                                transition={{ delay: 0.4 + index * 0.05 }}
                                            >
                                                <div className="w-full flex-1 flex flex-col justify-end">
                                                    <motion.div
                                                        className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md cursor-pointer hover:from-blue-500 hover:to-cyan-300 transition-all relative group"
                                                        style={{ height: `${(day.revenue / maxRevenue) * 100}%` }}
                                                        whileHover={{ scale: 1.05 }}
                                                    >
                                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                            ₦{day.revenue.toLocaleString()}
                                                        </div>
                                                    </motion.div>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs text-slate-500">{day.day}</p>
                                                    <p className="text-xs text-slate-400">{day.sales}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Top Products */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                                <CardHeader className="border-b border-white/10">
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-emerald-400" />
                                        Top Products
                                    </CardTitle>
                                    <CardDescription className="text-slate-400">Best sellers this period</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        {analyticsData.topProducts.map((product, index) => (
                                            <motion.div
                                                key={product.name}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + index * 0.1 }}
                                                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold text-slate-400">
                                                        {index + 1}
                                                    </span>
                                                    <div>
                                                        <p className="text-sm font-medium text-white truncate max-w-[150px]">{product.name}</p>
                                                        <p className="text-xs text-slate-500">{product.units} units</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-emerald-400">{product.revenue}</p>
                                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                                                        {product.growth}
                                                    </Badge>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
}
