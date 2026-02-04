"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  FileText,
  Download,
  LayoutDashboard,
  Settings,
  Users,
  Package,
  BarChart3,
  Bell,
  Search,
  ChevronRight,
  Activity,
  Zap,
  Shield,
  Clock,
  Eye,
  Moon,
  Sun,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NotificationBell } from "./NotificationsCenter";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const statsData = [
  {
    title: "Total Revenue",
    value: "₦2,845,000",
    change: "+12.5%",
    trend: "up",
    period: "vs last month",
    icon: DollarSign,
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-500/10 to-teal-600/10",
  },
  {
    title: "Net Profit",
    value: "₦892,400",
    change: "+8.2%",
    trend: "up",
    period: "vs last month",
    icon: TrendingUp,
    gradient: "from-blue-500 to-cyan-600",
    bgGradient: "from-blue-500/10 to-cyan-600/10",
  },
  {
    title: "Critical Expenses",
    value: "₦456,800",
    change: "+23.1%",
    trend: "up",
    period: "vs last month",
    icon: AlertTriangle,
    gradient: "from-rose-500 to-pink-600",
    bgGradient: "from-rose-500/10 to-pink-600/10",
  },
  {
    title: "Inventory Value",
    value: "₦1,234,500",
    change: "-2.3%",
    trend: "down",
    period: "vs last month",
    icon: Package,
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-500/10 to-purple-600/10",
  },
];

const plData = [
  {
    date: "2024-01-15",
    description: "Royal Canin Bulk Order",
    category: "Inventory Purchase",
    aiTag: "Recurring",
    amount: -125000,
    status: "Completed",
  },
  {
    date: "2024-01-14",
    description: "Weekend Sales Revenue",
    category: "Sales",
    aiTag: "Peak Period",
    amount: 245000,
    status: "Verified",
  },
  {
    date: "2024-01-13",
    description: "Utility Bill - January",
    category: "Operating Expense",
    aiTag: "Fixed",
    amount: -45000,
    status: "Completed",
  },
  {
    date: "2024-01-12",
    description: "Pet Accessories Sale",
    category: "Sales",
    aiTag: "Normal",
    amount: 78500,
    status: "Verified",
  },
  {
    date: "2024-01-11",
    description: "Staff Salary - Week 2",
    category: "Payroll",
    aiTag: "Fixed",
    amount: -180000,
    status: "Completed",
  },
  {
    date: "2024-01-10",
    description: "Cash Withdrawal - Unverified",
    category: "Unknown",
    aiTag: "Anomaly",
    amount: -35000,
    status: "Flagged",
  },
];

const anomalies = [
  {
    type: "Mismatched Receipt",
    description: "Receipt #4521 shows ₦45,000 but POS records ₦42,500",
    severity: "high",
    date: "Jan 10, 2024",
  },
  {
    type: "Unusual Withdrawal",
    description: "Cash withdrawal of ₦35,000 without documented purpose",
    severity: "medium",
    date: "Jan 10, 2024",
  },
  {
    type: "Stock Discrepancy",
    description: "5 units of Royal Canin missing from inventory count",
    severity: "high",
    date: "Jan 8, 2024",
  },
];

const quickActions = [
  { icon: FileText, label: "Generate Report", color: "emerald", href: "/admin/reports" },
  { icon: Users, label: "Manage Staff", color: "blue", href: "/admin/staff" },
  { icon: BarChart3, label: "View Analytics", color: "violet", href: "/admin/analytics" },
  { icon: Settings, label: "Settings", color: "slate", href: "/admin/settings" },
];

const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

export function DirectorDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const router = useRouter();

  const isDark = theme === "dark";

  // Theme-aware classes
  const themeClasses = {
    bg: isDark
      ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
      : "bg-gradient-to-br from-slate-50 via-white to-slate-100",
    header: isDark
      ? "border-white/10 bg-slate-900/80"
      : "border-slate-200 bg-white/90 shadow-sm",
    headerTitle: isDark ? "text-white" : "text-slate-900",
    headerSubtitle: isDark ? "text-slate-400" : "text-slate-600",
    card: isDark
      ? "border-white/10 bg-white/5 backdrop-blur-sm"
      : "border-slate-200 bg-white shadow-sm",
    cardHover: isDark ? "hover:bg-white/10" : "hover:bg-slate-50",
    cardHeader: isDark
      ? "border-b border-white/10 bg-white/5"
      : "border-b border-slate-100 bg-slate-50/50",
    text: isDark ? "text-white" : "text-slate-900",
    textMuted: isDark ? "text-slate-400" : "text-slate-600",
    textSubtle: isDark ? "text-slate-500" : "text-slate-500",
    tableRow: isDark
      ? "border-white/5 hover:bg-white/5"
      : "border-slate-100 hover:bg-slate-50",
    tableHead: isDark ? "text-slate-400" : "text-slate-600",
    input: isDark
      ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500"
      : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400",
    button: isDark
      ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    quickAction: isDark
      ? "border-white/10 bg-white/5 hover:bg-white/10"
      : "border-slate-200 bg-white hover:bg-slate-50 shadow-sm",
    quickActionIcon: isDark
      ? "from-slate-700 to-slate-800"
      : "from-slate-100 to-slate-200",
    quickActionText: isDark ? "text-slate-300" : "text-slate-700",
    footerStat: isDark
      ? "border-white/10 bg-white/5"
      : "border-slate-200 bg-white shadow-sm",
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses.bg}`}>
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? "bg-emerald-500/10" : "bg-emerald-500/5"}`} />
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? "bg-blue-500/10" : "bg-blue-500/5"}`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl ${isDark ? "bg-violet-500/5" : "bg-violet-500/3"}`} />
      </div>

      <div className="relative z-10">
        {/* Top Navigation Bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${themeClasses.header}`}
        >
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className={`text-lg font-bold ${themeClasses.headerTitle}`}>Admin Dashboard</h1>
                  <p className={`text-xs ${themeClasses.headerSubtitle}`}>Baycarl Petshop</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${isDark ? "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"}`}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.button>

              {/* Search */}
              <div className="relative hidden md:block">
                <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${themeClasses.textMuted}`} />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-64 h-9 pl-9 rounded-lg ${themeClasses.input}`}
                />
              </div>

              {/* Go to Operations */}
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className={themeClasses.button}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Operations
                </Button>
              </Link>

              <NotificationBell />

              {/* User Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white">
                AD
              </div>
            </div>
          </div>
        </motion.header>

        <main className="p-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Financial Overview</h2>
                <p className={themeClasses.textMuted}>Business intelligence and analytics</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className={themeClasses.button}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 border-0">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  variants={fadeInUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Card className={`relative overflow-hidden ${themeClasses.card} ${themeClasses.cardHover} transition-all duration-300 group`}>
                    {/* Gradient accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`} />

                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className={`rounded-xl p-3 bg-gradient-to-br ${stat.bgGradient}`}>
                          <Icon className={`h-5 w-5 ${isDark ? "text-white" : "text-slate-700"}`} />
                        </div>
                        <Badge
                          className={`border-0 ${stat.trend === "up"
                            ? "bg-emerald-500/20 text-emerald-600"
                            : "bg-rose-500/20 text-rose-600"
                            }`}
                        >
                          {stat.trend === "up" ? (
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="mr-1 h-3 w-3" />
                          )}
                          {stat.change}
                        </Badge>
                      </div>
                      <div className="mt-4">
                        <p className={`text-sm font-medium ${themeClasses.textMuted}`}>{stat.title}</p>
                        <p className={`mt-1 text-2xl font-bold ${themeClasses.text}`}>{stat.value}</p>
                        <p className={`mt-1 text-xs ${themeClasses.textSubtle}`}>{stat.period}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${themeClasses.textMuted}`}>Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={action.label} href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 p-4 rounded-xl transition-all group cursor-pointer ${themeClasses.quickAction}`}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${themeClasses.quickActionIcon} group-hover:from-emerald-500 group-hover:to-teal-600 transition-all`}>
                        <Icon className={`h-5 w-5 ${themeClasses.quickActionText} group-hover:text-white`} />
                      </div>
                      <span className={`text-sm font-medium ${themeClasses.quickActionText} group-hover:text-emerald-600`}>{action.label}</span>
                      <ChevronRight className={`ml-auto h-4 w-4 ${themeClasses.textSubtle} group-hover:text-emerald-500`} />
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* P&L Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card className={`${themeClasses.card} overflow-hidden`}>
                <CardHeader className={themeClasses.cardHeader}>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className={`text-lg flex items-center gap-2 ${themeClasses.text}`}>
                        <Activity className="h-5 w-5 text-emerald-500" />
                        Profit & Loss Statement
                      </CardTitle>
                      <CardDescription className={themeClasses.textMuted}>
                        Transaction history with AI categorization
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className={`${themeClasses.textMuted} hover:${themeClasses.text}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className={themeClasses.tableRow}>
                        <TableHead className={`font-semibold ${themeClasses.tableHead}`}>Date</TableHead>
                        <TableHead className={`font-semibold ${themeClasses.tableHead}`}>Description</TableHead>
                        <TableHead className={`font-semibold ${themeClasses.tableHead}`}>AI Tag</TableHead>
                        <TableHead className={`font-semibold text-right ${themeClasses.tableHead}`}>Amount</TableHead>
                        <TableHead className={`font-semibold ${themeClasses.tableHead}`}>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plData.map((row, index) => (
                        <TableRow
                          key={index}
                          className={`${themeClasses.tableRow} ${row.status === "Flagged" ? (isDark ? "bg-rose-500/10" : "bg-rose-50") : ""}`}
                        >
                          <TableCell className={themeClasses.textMuted}>{row.date}</TableCell>
                          <TableCell className={`font-medium ${themeClasses.text}`}>{row.description}</TableCell>
                          <TableCell>
                            <Badge
                              className={`border-0 ${row.aiTag === "Anomaly"
                                ? "bg-rose-500/20 text-rose-600"
                                : row.aiTag === "Peak Period"
                                  ? "bg-blue-500/20 text-blue-600"
                                  : isDark ? "bg-slate-500/20 text-slate-400" : "bg-slate-100 text-slate-600"
                                }`}
                            >
                              <Sparkles className="mr-1 h-3 w-3" />
                              {row.aiTag}
                            </Badge>
                          </TableCell>
                          <TableCell
                            className={`text-right font-semibold ${row.amount >= 0 ? "text-emerald-600" : "text-rose-600"
                              }`}
                          >
                            {row.amount >= 0 ? "+" : ""}₦{Math.abs(row.amount).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`border-0 ${row.status === "Flagged"
                                ? "bg-rose-500/20 text-rose-600"
                                : row.status === "Verified"
                                  ? "bg-emerald-500/20 text-emerald-600"
                                  : isDark ? "bg-slate-500/20 text-slate-400" : "bg-slate-100 text-slate-600"
                                }`}
                            >
                              {row.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Insights Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className={`overflow-hidden ${isDark ? "border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-pink-600/10" : "border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50"}`}>
                <CardHeader className={isDark ? "border-b border-rose-500/20" : "border-b border-rose-100"}>
                  <div className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isDark ? "bg-rose-500/20" : "bg-rose-100"}`}>
                      <AlertTriangle className="h-4 w-4 text-rose-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-rose-600">Financial Anomalies</CardTitle>
                      <CardDescription className={isDark ? "text-rose-300/60" : "text-rose-500/70"}>
                        AI-detected issues
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {anomalies.map((anomaly, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className={`rounded-xl border p-4 ${anomaly.severity === "high"
                          ? isDark ? "border-rose-500/30 bg-rose-500/10" : "border-rose-200 bg-rose-50"
                          : isDark ? "border-amber-500/30 bg-amber-500/10" : "border-amber-200 bg-amber-50"
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <span
                            className={`text-sm font-semibold ${anomaly.severity === "high" ? "text-rose-600" : "text-amber-600"
                              }`}
                          >
                            {anomaly.type}
                          </span>
                          <Badge
                            className={`border-0 ${anomaly.severity === "high"
                              ? "bg-rose-500 text-white"
                              : "bg-amber-500 text-white"
                              }`}
                          >
                            {anomaly.severity}
                          </Badge>
                        </div>
                        <p className={`mt-2 text-sm ${themeClasses.textMuted}`}>{anomaly.description}</p>
                        <p className={`mt-2 text-xs flex items-center gap-1 ${themeClasses.textSubtle}`}>
                          <Clock className="h-3 w-3" />
                          {anomaly.date}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className={`mt-4 w-full ${isDark ? "border-rose-500/30 text-rose-400 hover:bg-rose-500/10" : "border-rose-200 text-rose-600 hover:bg-rose-50"} bg-transparent`}
                  >
                    View All Alerts
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <Card className={`${themeClasses.card} overflow-hidden`}>
              <CardHeader className={themeClasses.cardHeader}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className={`text-lg flex items-center gap-2 ${themeClasses.text}`}>
                      <BarChart3 className="h-5 w-5 text-emerald-500" />
                      Revenue Trend
                    </CardTitle>
                    <CardDescription className={themeClasses.textMuted}>
                      Monthly revenue performance
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-500/20 text-emerald-600 border-0">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      +18.5% YoY
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex h-64 items-end justify-between gap-2">
                  {[65, 45, 78, 52, 90, 68, 85, 72, 95, 80, 88, 92].map((height, i) => (
                    <motion.div
                      key={i}
                      className="flex flex-1 flex-col items-center gap-2"
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      transition={{ delay: 0.7 + i * 0.05, duration: 0.5 }}
                    >
                      <motion.div
                        onClick={() => router.push(`/admin/revenue/${monthNames[i]}`)}
                        className="w-full rounded-t-md bg-gradient-to-t from-emerald-600 to-teal-400 transition-all hover:from-emerald-500 hover:to-teal-300 cursor-pointer relative group"
                        style={{ height: `${height}%` }}
                        whileHover={{ scale: 1.05 }}
                        title={`Click for ${monthNames[i].charAt(0).toUpperCase() + monthNames[i].slice(1)} details`}
                      >
                        <div className={`absolute -top-10 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 ${isDark ? "bg-slate-800 text-white" : "bg-slate-900 text-white"}`}>
                          ₦{(height * 32000).toLocaleString()}
                          <br />
                          <span className="text-slate-400">Click for details</span>
                        </div>
                      </motion.div>
                      <span className={`text-xs ${themeClasses.textSubtle}`}>
                        {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: "Active Users", value: "24", icon: Users, color: "emerald" },
              { label: "Orders Today", value: "156", icon: Package, color: "blue" },
              { label: "Pending Reviews", value: "8", icon: Shield, color: "amber" },
              { label: "System Health", value: "99.9%", icon: Activity, color: "violet" },
            ].map((item, index) => {
              const Icon = item.icon;
              const colorClasses: Record<string, string> = {
                emerald: isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600",
                blue: isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600",
                amber: isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-600",
                violet: isDark ? "bg-violet-500/20 text-violet-400" : "bg-violet-100 text-violet-600",
              };
              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 p-4 rounded-xl ${themeClasses.footerStat}`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClasses[item.color]?.split(" ")[0]}`}>
                    <Icon className={`h-5 w-5 ${colorClasses[item.color]?.split(" ")[1]}`} />
                  </div>
                  <div>
                    <p className={`text-xs ${themeClasses.textMuted}`}>{item.label}</p>
                    <p className={`text-lg font-bold ${themeClasses.text}`}>{item.value}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
