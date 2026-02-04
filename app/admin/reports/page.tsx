"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    FileText,
    Download,
    Calendar,
    ArrowLeft,
    Filter,
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Ambient effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
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
                                <h1 className="text-lg font-bold text-white">Generate Reports</h1>
                                <p className="text-xs text-slate-400">Create and download business reports</p>
                            </div>
                        </div>
                    </div>
                </motion.header>

                <main className="p-6 max-w-7xl mx-auto">
                    {/* Report Type Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Select Report Type</h2>
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
                                                : "border-white/10 bg-white/5 hover:bg-white/10"
                                            }`}>
                                            <CardContent className="p-6">
                                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${report.gradient} mb-4`}>
                                                    <Icon className="h-6 w-6 text-white" />
                                                </div>
                                                <h3 className="font-semibold text-white mb-1">{report.title}</h3>
                                                <p className="text-sm text-slate-400 mb-3">{report.description}</p>
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
                            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                                <CardHeader className="border-b border-white/10">
                                    <CardTitle className="text-white">Configure Report</CardTitle>
                                    <CardDescription className="text-slate-400">Set parameters for your report</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">From Date</label>
                                            <Input
                                                type="date"
                                                value={dateRange.from}
                                                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                                className="bg-white/5 border-white/10 text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">To Date</label>
                                            <Input
                                                type="date"
                                                value={dateRange.to}
                                                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                                className="bg-white/5 border-white/10 text-white"
                                            />
                                        </div>
                                        <div className="flex items-end gap-3">
                                            <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
                                                <FileText className="mr-2 h-4 w-4" />
                                                Generate
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-white/10">
                                        <h4 className="text-sm font-medium text-slate-400 mb-4">Export Options</h4>
                                        <div className="flex gap-3">
                                            <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                                Excel
                                            </Button>
                                            <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                                                <FileText className="mr-2 h-4 w-4" />
                                                PDF
                                            </Button>
                                            <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                                                <Printer className="mr-2 h-4 w-4" />
                                                Print
                                            </Button>
                                            <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
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
                        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                            <CardHeader className="border-b border-white/10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-white">Recent Reports</CardTitle>
                                        <CardDescription className="text-slate-400">Previously generated reports</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                        View All
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-white/5">
                                    {recentReports.map((report, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + index * 0.1 }}
                                            className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
                                                    <FileText className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{report.name}</p>
                                                    <p className="text-sm text-slate-500">{report.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge className="bg-slate-500/20 text-slate-400 border-0">{report.type}</Badge>
                                                <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
                                                    <CheckCircle className="mr-1 h-3 w-3" />
                                                    {report.status}
                                                </Badge>
                                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
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
