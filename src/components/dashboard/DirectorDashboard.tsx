"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  LayoutDashboard,
  Settings,
  Users,
  BarChart3,
  Search,
  ChevronRight,
  Activity,
  Zap,
  Shield,
  Clock,
  Eye,
  Moon,
  Sun,
  AlertTriangle,
  Sparkles,
  Package,
  TrendingUp,
  ArrowDown,
  ChevronDown,
  Warehouse,
  DollarSign,
  ShoppingCart,
  Repeat,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
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
import { Analytics } from "./Analytics";
import { InventoryValueSummary } from "./InventoryValueSummary";
import { RestockAnalytics } from "./RestockAnalytics";
import { AddRestockBatch } from "./AddRestockBatch";
import { ExpensesWidget } from "./ExpensesWidget";
import { SalesRepView } from "./SalesRepView";
import { RoleManager } from "./RoleManager";
import { RevenueMetrics } from "./RevenueMetrics";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { useFinance } from "@/hooks/useFinance";
import { useNotifications } from "@/hooks/useNotifications";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/components/auth/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
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

const quickActions = [
  { icon: FileText, label: "Generate Report", color: "emerald", href: "/admin/reports" },
  { icon: Users, label: "Manage Staff", color: "blue", href: "/admin/staff" },
  { icon: Repeat, label: "Recurring Expenses", color: "violet", href: "/admin/recurring-expenses" },
  { icon: Settings, label: "Settings", color: "slate", href: "/admin/settings" },
];

interface DirectorDashboardProps {
  viewAsRole?: string; // Role to view as (for admin impersonation)
}

export function DirectorDashboard({ viewAsRole }: DirectorDashboardProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const isDark = theme === "dark";

  // Live Data Hooks
  const { user, role: actualRole, loading: authLoading } = useAuth();
  const { data: financeData } = useFinance();
  const { data: notifications } = useNotifications();
  const { data: products } = useProducts();

  // Use viewAsRole if provided (admin impersonation), otherwise use actual role
  const role = viewAsRole || actualRole;
  const isActuallyAdmin = actualRole === 'admin' || actualRole === 'director';



  // Role-Based Access Control logic
  // If loading, show skeleton
  if (authLoading) return <DashboardSkeleton />;

  // Define access permissions based on the viewing role (not actual role)
  const isAdmin = role === 'admin' || role === 'director';
  const isManager = role === 'manager' || role === 'ops_manager';
  const isAuditor = role === 'auditor';
  const isSalesRep = role === 'sales_rep';
  const isInventoryManager = role === 'inventory_manager';

  // Use live data or fallbacks for loading states
  const displayPL = financeData || [];
  const displayNotifications = notifications || [];

  // Calculate Stats
  const totalRevenue = displayPL.reduce((acc, item) => item.type === 'revenue' ? acc + item.amount : acc, 0);
  const totalExpenses = displayPL.reduce((acc, item) => item.type === 'expense' ? acc + Math.abs(item.amount) : acc, 0);
  const netProfit = totalRevenue - totalExpenses;

  // Derive Inventory Stats (Stock Value hidden from Ops Manager)
  // Note: For packs, stock = number of packs, price = price per pack
  // For singles, stock = number of units, price = price per unit
  // So calculations are: value = price × stock (works for both)
  const inventoryStats = {
    totalStockValue: (isAdmin || isInventoryManager) ? (products || []).reduce((acc: number, p: any) => acc + (p.costPrice * p.stock), 0) : 0,
    totalMarketValue: (products || []).reduce((acc: number, p: any) => acc + (p.sellingPrice * p.stock), 0),
    profitPotential: (products || []).reduce((acc: number, p: any) => acc + ((p.sellingPrice - p.costPrice) * p.stock), 0),
    totalProducts: (products || []).length,
    lowStockItems: (products || []).filter((p: any) => p.status === "low-stock").length
  };

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
      </div>

      <div className="relative z-10">
        {/* Top Navigation Bar */}
        {/* Top Navigation Bar - Redesigned for Luxury/Modern Feel */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`sticky top-0 z-50 border-b transition-all duration-300 ${isDark
            ? "border-emerald-900/40 bg-[#0a2e1a]/80 backdrop-blur-xl"
            : "border-emerald-100 bg-white/80 backdrop-blur-xl shadow-sm"
            }`}
        >
          <div className="flex h-20 items-center justify-between px-6">
            <div className="flex items-center gap-6">
              {/* Brand Logo Area */}
              <div className="flex items-center gap-4">
                <Image src="/favicon.svg" alt="Baycarl" width={40} height={40} className="h-10 w-10" />
                <div>
                  <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-cyan-400">
                    Baycarl
                  </h1>
                  <p className="text-xs font-medium uppercase tracking-widest text-emerald-600/60 dark:text-emerald-400/60">
                    Enterprise
                  </p>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className={`h-8 w-px hidden md:block ${isDark ? 'bg-emerald-900/40' : 'bg-slate-200'}`} />

              {/* Dashboard Title with Role Badge */}
              <div className="hidden md:flex items-center gap-3">
                <h2 className={`text-sm font-semibold ${isDark ? 'text-emerald-100' : 'text-slate-700'}`}>Director Dashboard</h2>
                <Badge className={`text-xs font-medium uppercase tracking-wide ${
                  isAdmin 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' 
                    : isManager
                    ? 'bg-blue-600/90 text-white'
                    : isAuditor
                    ? 'bg-violet-600/90 text-white'
                    : isSalesRep
                    ? 'bg-amber-600/90 text-white'
                    : isInventoryManager
                    ? 'bg-indigo-600/90 text-white'
                    : 'bg-slate-600/90 text-white'
                }`}>
                  {role === 'director' ? 'Admin' : role === 'ops_manager' ? 'Ops Manager' : role?.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Theme Toggle - Styled */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${isDark ? "bg-[#143d28]/50 hover:bg-[#1b4d30]/60 text-yellow-400" : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.button>

              {/* Search - Glassmorphism */}
              <div className="relative hidden md:block group">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <Input
                  placeholder="Global search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-72 h-10 pl-10 rounded-full transition-all duration-300 ${isDark
                    ? "bg-[#143d28]/50 border-emerald-900/40 text-emerald-50 placeholder:text-emerald-400/40 focus:bg-[#1b4d30]/60 focus:border-emerald-500/50"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                    }`}
                />
              </div>

              {/* Dashboard Switcher - Admin Only (show on all dashboards when admin is logged in) */}
              {isActuallyAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`rounded-full transition-all ${isDark ? 'text-emerald-200 hover:bg-[#143d28]/50 hover:text-white' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'}`}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboards
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className={`w-64 ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
                    <DropdownMenuLabel className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>Switch Dashboard View</DropdownMenuLabel>
                    <DropdownMenuSeparator className={isDark ? 'bg-white/10' : 'bg-slate-200'} />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center cursor-pointer">
                        <BarChart3 className="mr-2 h-4 w-4 text-violet-500" />
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Director Dashboard</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Full admin access</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/operations" className="flex items-center cursor-pointer">
                        <Warehouse className="mr-2 h-4 w-4 text-blue-500" />
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Operations Manager</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">View as ops manager</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/inventory" className="flex items-center cursor-pointer">
                        <Package className="mr-2 h-4 w-4 text-indigo-500" />
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Inventory Manager</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">View as inventory mgr</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/sales" className="flex items-center cursor-pointer">
                        <DollarSign className="mr-2 h-4 w-4 text-amber-500" />
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Sales Rep</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">View as sales rep</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auditor" className="flex items-center cursor-pointer">
                        <Shield className="mr-2 h-4 w-4 text-rose-500" />
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Auditor</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">View as auditor</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className={isDark ? 'bg-white/10' : 'bg-slate-200'} />
                    <DropdownMenuItem asChild>
                      <Link href="/" className="flex items-center cursor-pointer">
                        <ShoppingCart className="mr-2 h-4 w-4 text-emerald-500" />
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Customer Storefront</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Public shop view</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <NotificationBell />

              {/* User Profile - Premium Look */}
              <div className={`flex items-center gap-3 pl-4 border-l cursor-pointer group ${isDark ? 'border-emerald-900/40' : 'border-slate-200'}`}>
                <div className="text-right hidden lg:block">
                  <p className={`text-sm font-bold group-hover:text-emerald-500 transition-colors ${isDark ? 'text-emerald-50' : 'text-slate-700'}`}>
                    {user?.user_metadata?.full_name || "User"}
                  </p>
                  <p className={`text-xs font-mono uppercase ${isDark ? 'text-emerald-300/60' : 'text-slate-500'}`}>
                    {role?.replace('_', ' ') || "Loading..."}
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition duration-300 blur-sm" />
                  <div className={`relative h-10 w-10 rounded-full flex items-center justify-center ring-2 ${isDark ? 'bg-gradient-to-br from-emerald-900 to-emerald-950 ring-emerald-900' : 'bg-gradient-to-br from-slate-100 to-slate-200 ring-white'}`}>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      {role ? role.substring(0, 2) : "US"}
                    </span>
                  </div>
                </div>
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
                <Button variant="outline" className={themeClasses.button}>
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

          {/* Sales Rep View */}
          {(isSalesRep) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <SalesRepView />
            </motion.div>
          )}

          {/* NEW: Revenue Metrics with Time-Range Filters - Admin/Manager Only */}
          {(isAdmin || isManager) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-8"
            >
              <RevenueMetrics />
            </motion.div>
          )}

          {/* NEW: Analytics Component - Admin only gets Yearly, Manager/IM get Weekly/Monthly only */}
          {(isAdmin || isManager) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Analytics restrictYearly={!isAdmin} />
            </motion.div>
          )}

          {/* NEW: Inventory Value Mirror - Admin/Inventory Manager Only (Ops Manager CANNOT see) */}
          {(isAdmin || isInventoryManager) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mb-8"
            >
              <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>Inventory Value Summary</h3>
              <InventoryValueSummary stats={inventoryStats} hideStockValue={!isAdmin && !isInventoryManager} />
            </motion.div>
          )}


          {/* NEW: Restock Analytics - Inventory/Admin Only */}
          {(isAdmin || isInventoryManager || isManager) && (
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.28 }}
                className="lg:col-span-2"
              >
                <RestockAnalytics />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <AddRestockBatch />
              </motion.div>
            </div>
          )}

          {/* NEW: Role Manager - Admin Only */}
          {(isAdmin) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className="mb-8"
            >
              <RoleManager />
            </motion.div>
          )}

          {/* NEW: Expenses Widget - Admin/Director Only */}
          {(isAdmin) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34 }}
              className="mb-8"
            >
              <ExpensesWidget />
            </motion.div>
          )}

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
                      {displayPL.map((row, index) => (
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
                                  : isDark ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-100 text-slate-600"
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
                                  : isDark ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-100 text-slate-600"
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
                    {displayNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className={`rounded-xl border p-4 ${notification.severity === "high"
                          ? isDark ? "border-rose-500/30 bg-rose-500/10" : "border-rose-200 bg-rose-50"
                          : isDark ? "border-amber-500/30 bg-amber-500/10" : "border-amber-200 bg-amber-50"
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <span
                            className={`text-sm font-semibold ${notification.severity === "high" ? "text-rose-600" : "text-amber-600"
                              }`}
                          >
                            {notification.related_entity_type.replace(/_/g, " ").toUpperCase() || "ALERT"}
                          </span>
                          <Badge
                            className={`border-0 ${notification.severity === "high"
                              ? "bg-rose-500 text-white"
                              : "bg-amber-500 text-white"
                              }`}
                          >
                            {notification.severity}
                          </Badge>
                        </div>
                        <p className={`mt-2 text-sm ${themeClasses.textMuted}`}>{notification.message}</p>
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

          {/* Footer Stats - Admin Only */}
          {isAdmin && (
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
          )}
        </main>
      </div>
    </div>
  );
}
