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
    Moon,
    Sun,
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
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const maxRevenue = Math.max(...analyticsData.weeklyData.map(d => d.revenue));

    const isDark = theme === "dark";

    const themeClasses = {
        bg: isDark
            ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
            : "bg-gradient-to-br from-slate-50 via-white to-slate-100",
        header: isDark
            ? "border-white/10 bg-slate-900/80"
            : "border-slate-200 bg-white/90",
        text: isDark ? "text-white" : "text-slate-900",
        textMuted: isDark ? "text-slate-400" : "text-slate-600",
        card: isDark
            ? "border-white/10 bg-white/5 backdrop-blur-sm"
            : "border-slate-200 bg-white shadow-sm",
        cardHover: isDark ? "hover:bg-white/10" : "hover:bg-slate-50",
        buttonOutline: isDark
            ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900",
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${themeClasses.bg}`}>
            {/* Ambient effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-0 left-1/3 w-96 h-96 rounded-full blur-3xl ${isDark ? "bg-blue-500/10" : "bg-blue-500/5"}`} />
                <div className={`absolute bottom-0 right-1/3 w-96 h-96 rounded-full blur-3xl ${isDark ? "bg-emerald-500/10" : "bg-emerald-500/5"}`} />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors ${themeClasses.header}`}
                >
                    <div className="flex h-16 items-center justify-between px-6">
                        <div className="flex items-center gap-4">
                            <Link href="/admin">
                                <Button variant="ghost" size="icon" className={themeClasses.buttonOutline}>
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className={`text-lg font-bold ${themeClasses.text}`}>Analytics</h1>
                                <p className={`text-xs ${themeClasses.textMuted}`}>Business performance insights</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setTheme(isDark ? "light" : "dark")}
                                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${isDark ? "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"}`}
                            >
                                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </motion.button>
                            <div className={`flex rounded-lg p-1 ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
                                {["24h", "7d", "30d", "90d"].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range)}
                                        className={`px-3 py-1 text-sm rounded-md transition-all ${timeRange === range
                                            ? (isDark ? "bg-white/10 text-white" : "bg-white text-slate-900 shadow-sm")
                                            : (isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900")
                                            }`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                            <Button variant="outline" className={themeClasses.buttonOutline}>
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
                                    <Card className={`${themeClasses.card} ${themeClasses.cardHover} transition-all`}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`p-3 rounded-xl ${stat.trend === "up"
                                                    ? (isDark ? "bg-emerald-500/20" : "bg-emerald-100")
                                                    : (isDark ? "bg-rose-500/20" : "bg-rose-100")
                                                    }`}>
                                                    <Icon className={`h-5 w-5 ${stat.trend === "up"
                                                        ? (isDark ? "text-emerald-400" : "text-emerald-600")
                                                        : (isDark ? "text-rose-400" : "text-rose-600")
                                                        }`} />
                                                </div>
                                                <Badge className={`border-0 ${stat.trend === "up"
                                                    ? (isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600")
                                                    : (isDark ? "bg-rose-500/20 text-rose-400" : "bg-rose-100 text-rose-600")
                                                    }`}>
                                                    {stat.trend === "up" ? (
                                                        <ArrowUpRight className="mr-1 h-3 w-3" />
                                                    ) : (
                                                        <ArrowDownRight className="mr-1 h-3 w-3" />
                                                    )}
                                                    {stat.change}
                                                </Badge>
                                            </div>
                                            <p className={`text-sm ${themeClasses.textMuted}`}>{stat.label}</p>
                                            <p className={`text-2xl font-bold mt-1 ${themeClasses.text}`}>{stat.value}</p>
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
                            <Card className={themeClasses.card}>
                                <CardHeader className={isDark ? "border-b border-white/10" : "border-b border-slate-200"}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className={`flex items-center gap-2 ${themeClasses.text}`}>
                                                <BarChart3 className="h-5 w-5 text-blue-400" />
                                                Weekly Performance
                                            </CardTitle>
                                            <CardDescription className={themeClasses.textMuted}>Sales and revenue by day</CardDescription>
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
                            <Card className={themeClasses.card}>
                                <CardHeader className={isDark ? "border-b border-white/10" : "border-b border-slate-200"}>
                                    <CardTitle className={`flex items-center gap-2 ${themeClasses.text}`}>
                                        <TrendingUp className="h-5 w-5 text-emerald-400" />
                                        Top Products
                                    </CardTitle>
                                    <CardDescription className={themeClasses.textMuted}>Best sellers this period</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        {analyticsData.topProducts.map((product, index) => (
                                            <motion.div
                                                key={product.name}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + index * 0.1 }}
                                                className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-slate-50 hover:bg-slate-100"}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-600"}`}>
                                                        {index + 1}
                                                    </span>
                                                    <div>
                                                        <p className={`text-sm font-medium truncate max-w-[150px] ${themeClasses.text}`}>{product.name}</p>
                                                        <p className="text-xs text-slate-500">{product.units} units</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-sm font-medium ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>{product.revenue}</p>
                                                    <Badge className={`border-0 text-xs ${isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600"}`}>
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
