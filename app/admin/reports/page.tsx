"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    FileText,
    Download,
    ArrowLeft,
    TrendingUp,
    DollarSign,
    Package,
    Users,
    Printer,
    Mail,
    FileSpreadsheet,
    ChevronRight,
    Clock,
    CheckCircle,
    Moon,
    Sun,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const reportTypes = [
    {
        id: "sales",
        title: "Sales Report",
        description: "Revenue, transactions, and sales trends",
        icon: TrendingUp,
        gradient: "from-emerald-500 to-teal-600",
        lastGenerated: "2 hours ago",
    },
    {
        id: "inventory",
        title: "Inventory Report",
        description: "Stock levels, movements, and valuations",
        icon: Package,
        gradient: "from-blue-500 to-cyan-600",
        lastGenerated: "1 day ago",
    },
    {
        id: "financial",
        title: "Financial Report",
        description: "P&L, expenses, and profit margins",
        icon: DollarSign,
        gradient: "from-violet-500 to-purple-600",
        lastGenerated: "3 days ago",
    },
    {
        id: "customer",
        title: "Customer Report",
        description: "Customer analytics and behavior",
        icon: Users,
        gradient: "from-amber-500 to-orange-600",
        lastGenerated: "1 week ago",
    },
];

const recentReports = [
    { name: "Monthly Sales Summary - January 2024", date: "Jan 31, 2024", type: "Sales", status: "completed" },
    { name: "Inventory Valuation Report", date: "Jan 28, 2024", type: "Inventory", status: "completed" },
    { name: "Q4 2023 Financial Overview", date: "Jan 15, 2024", type: "Financial", status: "completed" },
    { name: "Weekly Sales Report", date: "Jan 14, 2024", type: "Sales", status: "completed" },
];

export default function ReportsPage() {
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState({ from: "", to: "" });
    const [theme, setTheme] = useState<"dark" | "light">("dark");

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
        input: isDark
            ? "bg-white/5 border-white/10 text-white"
            : "bg-white border-slate-200 text-slate-900",
        buttonOutline: isDark
            ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900",
        iconContainer: isDark ? "bg-slate-800" : "bg-slate-100",
        rowHover: isDark ? "hover:bg-white/5" : "hover:bg-slate-50",
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${themeClasses.bg}`}>
            {/* Ambient effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? "bg-emerald-500/10" : "bg-emerald-500/5"}`} />
                <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? "bg-violet-500/10" : "bg-violet-500/5"}`} />
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
                                <h1 className={`text-lg font-bold ${themeClasses.text}`}>Generate Reports</h1>
                                <p className={`text-xs ${themeClasses.textMuted}`}>Create and download business reports</p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setTheme(isDark ? "light" : "dark")}
                            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${isDark ? "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"}`}
                        >
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </motion.button>
                    </div>
                </motion.header>

                <main className="p-6 max-w-7xl mx-auto">
                    {/* Report Type Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h2 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${themeClasses.textMuted}`}>Select Report Type</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {reportTypes.map((report, index) => {
                                const Icon = report.icon;
                                return (
                                    <motion.div
                                        key={report.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -4 }}
                                        onClick={() => setSelectedReport(report.id)}
                                    >
                                        <Card className={`cursor-pointer transition-all duration-300 ${selectedReport === report.id
                                            ? "border-emerald-500/50 bg-emerald-500/10 ring-1 ring-emerald-500/50"
                                            : `${themeClasses.card} ${themeClasses.cardHover}`
                                            }`}>
                                            <CardContent className="p-6">
                                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${report.gradient} mb-4`}>
                                                    <Icon className="h-6 w-6 text-white" />
                                                </div>
                                                <h3 className={`font-semibold mb-1 ${themeClasses.text}`}>{report.title}</h3>
                                                <p className={`text-sm mb-3 ${themeClasses.textMuted}`}>{report.description}</p>
                                                <div className="flex items-center text-xs text-slate-500">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    Last: {report.lastGenerated}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Report Configuration */}
                    {selectedReport && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <Card className={themeClasses.card}>
                                <CardHeader className={isDark ? "border-b border-white/10" : "border-b border-slate-200"}>
                                    <CardTitle className={themeClasses.text}>Configure Report</CardTitle>
                                    <CardDescription className={themeClasses.textMuted}>Set parameters for your report</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${themeClasses.textMuted}`}>From Date</label>
                                            <Input
                                                type="date"
                                                value={dateRange.from}
                                                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                                className={themeClasses.input}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${themeClasses.textMuted}`}>To Date</label>
                                            <Input
                                                type="date"
                                                value={dateRange.to}
                                                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                                className={themeClasses.input}
                                            />
                                        </div>
                                        <div className="flex items-end gap-3">
                                            <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
                                                <FileText className="mr-2 h-4 w-4" />
                                                Generate
                                            </Button>
                                        </div>
                                    </div>

                                    <div className={`mt-6 pt-6 border-t ${isDark ? "border-white/10" : "border-slate-200"}`}>
                                        <h4 className={`text-sm font-medium mb-4 ${themeClasses.textMuted}`}>Export Options</h4>
                                        <div className="flex gap-3">
                                            <Button variant="outline" className={themeClasses.buttonOutline}>
                                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                                Excel
                                            </Button>
                                            <Button variant="outline" className={themeClasses.buttonOutline}>
                                                <FileText className="mr-2 h-4 w-4" />
                                                PDF
                                            </Button>
                                            <Button variant="outline" className={themeClasses.buttonOutline}>
                                                <Printer className="mr-2 h-4 w-4" />
                                                Print
                                            </Button>
                                            <Button variant="outline" className={themeClasses.buttonOutline}>
                                                <Mail className="mr-2 h-4 w-4" />
                                                Email
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Recent Reports */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className={themeClasses.card}>
                            <CardHeader className={isDark ? "border-b border-white/10" : "border-b border-slate-200"}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className={themeClasses.text}>Recent Reports</CardTitle>
                                        <CardDescription className={themeClasses.textMuted}>Previously generated reports</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" className={`${themeClasses.textMuted} hover:${themeClasses.text}`}>
                                        View All
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className={`divide-y ${isDark ? "divide-white/5" : "divide-slate-200"}`}>
                                    {recentReports.map((report, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + index * 0.1 }}
                                            className={`flex items-center justify-between p-4 transition-colors cursor-pointer ${themeClasses.rowHover}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${themeClasses.iconContainer}`}>
                                                    <FileText className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className={`font-medium ${themeClasses.text}`}>{report.name}</p>
                                                    <p className="text-sm text-slate-500">{report.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge className={`border-0 ${isDark ? "bg-slate-500/20 text-slate-400" : "bg-slate-100 text-slate-600"}`}>{report.type}</Badge>
                                                <Badge className={`border-0 ${isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600"}`}>
                                                    <CheckCircle className="mr-1 h-3 w-3" />
                                                    {report.status}
                                                </Badge>
                                                <Button variant="ghost" size="icon" className={`${themeClasses.textMuted} hover:${themeClasses.text}`}>
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
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
