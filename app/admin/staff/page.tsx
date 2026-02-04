"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Users,
    ArrowLeft,
    Plus,
    Search,
    Mail,
    Phone,
    Shield,
    Edit,
    Trash2,
    MoreVertical,
    CheckCircle,
    XCircle,
    Clock,
    UserPlus,
    Filter,
    Moon,
    Sun,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const staffMembers = [
    {
        id: 1,
        name: "Adebayo Johnson",
        email: "adebayo@baycarl.com",
        phone: "+234 812 345 6789",
        role: "manager",
        status: "active",
        joinDate: "Jan 15, 2023",
        avatar: "AJ",
    },
    {
        id: 2,
        name: "Chioma Okafor",
        email: "chioma@baycarl.com",
        phone: "+234 803 456 7890",
        role: "cashier",
        status: "active",
        joinDate: "Mar 22, 2023",
        avatar: "CO",
    },
    {
        id: 3,
        name: "Emmanuel Nwachukwu",
        email: "emmanuel@baycarl.com",
        phone: "+234 705 567 8901",
        role: "inventory",
        status: "active",
        joinDate: "Jun 10, 2023",
        avatar: "EN",
    },
    {
        id: 4,
        name: "Folake Adeleke",
        email: "folake@baycarl.com",
        phone: "+234 816 678 9012",
        role: "cashier",
        status: "inactive",
        joinDate: "Sep 5, 2023",
        avatar: "FA",
    },
];

const roleColors: Record<string, { bg: string; text: string }> = {
    manager: { bg: "bg-violet-500/20", text: "text-violet-400" },
    cashier: { bg: "bg-blue-500/20", text: "text-blue-400" },
    inventory: { bg: "bg-amber-500/20", text: "text-amber-400" },
    director: { bg: "bg-emerald-500/20", text: "text-emerald-400" },
};

export default function StaffPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
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
            ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400",
        buttonOutline: isDark
            ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900",
        iconContainer: isDark ? "bg-slate-800" : "bg-slate-100",
    };

    const filteredStaff = staffMembers.filter((staff) => {
        const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = !selectedRole || staff.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className={`min-h-screen transition-colors duration-300 ${themeClasses.bg}`}>
            {/* Ambient effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? "bg-violet-500/10" : "bg-violet-500/5"}`} />
                <div className={`absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? "bg-blue-500/10" : "bg-blue-500/5"}`} />
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
                                <h1 className={`text-lg font-bold ${themeClasses.text}`}>Manage Staff</h1>
                                <p className={`text-xs ${themeClasses.textMuted}`}>Team members and access control</p>
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
                            <Button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Staff
                            </Button>
                        </div>
                    </div>
                </motion.header>

                <main className="p-6 max-w-7xl mx-auto">
                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                    >
                        {[
                            { label: "Total Staff", value: "4", icon: Users, gradient: "from-violet-500 to-purple-600" },
                            { label: "Active", value: "3", icon: CheckCircle, gradient: "from-emerald-500 to-teal-600" },
                            { label: "Inactive", value: "1", icon: XCircle, gradient: "from-rose-500 to-pink-600" },
                            { label: "Pending", value: "0", icon: Clock, gradient: "from-amber-500 to-orange-600" },
                        ].map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className={themeClasses.card}>
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                                                <Icon className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className={`text-sm ${themeClasses.textMuted}`}>{stat.label}</p>
                                                <p className={`text-2xl font-bold ${themeClasses.text}`}>{stat.value}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Search and Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 mb-6"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Search staff..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`pl-9 ${themeClasses.input}`}
                            />
                        </div>
                        <div className="flex gap-2">
                            {["all", "manager", "cashier", "inventory"].map((role) => (
                                <Button
                                    key={role}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedRole(role === "all" ? null : role)}
                                    className={`capitalize ${(role === "all" && !selectedRole) || selectedRole === role
                                        ? (isDark ? "bg-white/10 text-white border-white/20" : "bg-slate-200 text-slate-900 border-slate-300")
                                        : (isDark ? "bg-transparent text-slate-400 border-white/10 hover:bg-white/5" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50")
                                        }`}
                                >
                                    {role}
                                </Button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Staff Grid */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {filteredStaff.map((staff, index) => (
                            <motion.div
                                key={staff.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                whileHover={{ y: -4 }}
                            >
                                <Card className={`${themeClasses.card} ${themeClasses.cardHover} transition-all`}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold">
                                                    {staff.avatar}
                                                </div>
                                                <div>
                                                    <h3 className={`font-semibold ${themeClasses.text}`}>{staff.name}</h3>
                                                    <Badge className={`${roleColors[staff.role].bg} ${roleColors[staff.role].text} border-0 capitalize text-xs`}>
                                                        {staff.role}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className={themeClasses.textMuted + " hover:" + themeClasses.text}>
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className={`flex items-center gap-2 text-sm ${themeClasses.textMuted}`}>
                                                <Mail className="h-4 w-4" />
                                                {staff.email}
                                            </div>
                                            <div className={`flex items-center gap-2 text-sm ${themeClasses.textMuted}`}>
                                                <Phone className="h-4 w-4" />
                                                {staff.phone}
                                            </div>
                                        </div>

                                        <div className={`flex items-center justify-between pt-4 border-t ${isDark ? "border-white/10" : "border-slate-200"}`}>
                                            <div className="flex items-center gap-2">
                                                <Badge className={`border-0 ${staff.status === "active"
                                                    ? (isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600")
                                                    : (isDark ? "bg-rose-500/20 text-rose-400" : "bg-rose-100 text-rose-600")
                                                    }`}>
                                                    {staff.status === "active" ? (
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                    ) : (
                                                        <XCircle className="mr-1 h-3 w-3" />
                                                    )}
                                                    {staff.status}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className={`h-8 w-8 ${themeClasses.textMuted} hover:${themeClasses.text}`}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className={`h-8 w-8 ${themeClasses.textMuted} hover:text-rose-400`}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
