"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Settings,
    ArrowLeft,
    User,
    Bell,
    Shield,
    CreditCard,
    Store,
    Moon,
    Sun,
    Globe,
    Mail,
    Smartphone,
    Save,
    Eye,
    EyeOff,
    ChevronRight,
    Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const settingsSections = [
    {
        id: "profile",
        title: "Profile Settings",
        description: "Manage your account information",
        icon: User,
        gradient: "from-violet-500 to-purple-600",
    },
    {
        id: "notifications",
        title: "Notifications",
        description: "Configure alert preferences",
        icon: Bell,
        gradient: "from-blue-500 to-cyan-600",
    },
    {
        id: "security",
        title: "Security",
        description: "Password and authentication",
        icon: Shield,
        gradient: "from-emerald-500 to-teal-600",
    },
    {
        id: "billing",
        title: "Billing",
        description: "Payment methods and invoices",
        icon: CreditCard,
        gradient: "from-amber-500 to-orange-600",
    },
    {
        id: "store",
        title: "Store Settings",
        description: "Business configuration",
        icon: Store,
        gradient: "from-rose-500 to-pink-600",
    },
];

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState("profile");
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
        lowStock: true,
        orders: true,
        reports: false,
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Ambient effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
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
                                <h1 className="text-lg font-bold text-white">Settings</h1>
                                <p className="text-xs text-slate-400">System configuration and preferences</p>
                            </div>
                        </div>
                        <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </div>
                </motion.header>

                <main className="p-6 max-w-7xl mx-auto">
                    <div className="grid gap-6 lg:grid-cols-4">
                        {/* Settings Navigation */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1"
                        >
                            <Card className="border-white/10 bg-white/5 backdrop-blur-sm sticky top-24">
                                <CardContent className="p-4">
                                    <nav className="space-y-1">
                                        {settingsSections.map((section, index) => {
                                            const Icon = section.icon;
                                            return (
                                                <motion.button
                                                    key={section.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    onClick={() => setActiveSection(section.id)}
                                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeSection === section.id
                                                            ? "bg-white/10 text-white"
                                                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                                                        }`}
                                                >
                                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${section.gradient}`}>
                                                        <Icon className="h-4 w-4 text-white" />
                                                    </div>
                                                    <div className="text-left flex-1">
                                                        <p className="text-sm font-medium">{section.title}</p>
                                                    </div>
                                                    <ChevronRight className={`h-4 w-4 transition-transform ${activeSection === section.id ? "rotate-90" : ""
                                                        }`} />
                                                </motion.button>
                                            );
                                        })}
                                    </nav>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Settings Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-3 space-y-6"
                        >
                            {/* Appearance */}
                            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                                <CardHeader className="border-b border-white/10">
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Moon className="h-5 w-5 text-violet-400" />
                                        Appearance
                                    </CardTitle>
                                    <CardDescription className="text-slate-400">Customize the look and feel</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-medium">Theme</p>
                                            <p className="text-sm text-slate-400">Select your preferred color scheme</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setTheme("light")}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${theme === "light"
                                                        ? "bg-white text-slate-900"
                                                        : "bg-white/5 text-slate-400 hover:bg-white/10"
                                                    }`}
                                            >
                                                <Sun className="h-4 w-4" />
                                                Light
                                                {theme === "light" && <Check className="h-4 w-4" />}
                                            </button>
                                            <button
                                                onClick={() => setTheme("dark")}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${theme === "dark"
                                                        ? "bg-slate-700 text-white"
                                                        : "bg-white/5 text-slate-400 hover:bg-white/10"
                                                    }`}
                                            >
                                                <Moon className="h-4 w-4" />
                                                Dark
                                                {theme === "dark" && <Check className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Notifications */}
                            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                                <CardHeader className="border-b border-white/10">
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Bell className="h-5 w-5 text-blue-400" />
                                        Notification Preferences
                                    </CardTitle>
                                    <CardDescription className="text-slate-400">Choose how you want to be notified</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    {[
                                        { key: "email", label: "Email Notifications", description: "Receive updates via email", icon: Mail },
                                        { key: "push", label: "Push Notifications", description: "Browser push alerts", icon: Bell },
                                        { key: "sms", label: "SMS Notifications", description: "Text message alerts", icon: Smartphone },
                                    ].map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-slate-800">
                                                        <Icon className="h-4 w-4 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{item.label}</p>
                                                        <p className="text-sm text-slate-500">{item.description}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                                                    className={`relative w-12 h-6 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications]
                                                            ? "bg-emerald-500"
                                                            : "bg-slate-700"
                                                        }`}
                                                >
                                                    <motion.div
                                                        className="absolute top-1 w-4 h-4 bg-white rounded-full"
                                                        animate={{
                                                            left: notifications[item.key as keyof typeof notifications] ? "calc(100% - 20px)" : "4px"
                                                        }}
                                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                    />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </CardContent>
                            </Card>

                            {/* Store Info */}
                            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                                <CardHeader className="border-b border-white/10">
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Store className="h-5 w-5 text-amber-400" />
                                        Store Information
                                    </CardTitle>
                                    <CardDescription className="text-slate-400">Business details</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Store Name</label>
                                            <Input
                                                defaultValue="Baycarl Petshop"
                                                className="bg-white/5 border-white/10 text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Contact Email</label>
                                            <Input
                                                defaultValue="contact@baycarl.com"
                                                className="bg-white/5 border-white/10 text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
                                            <Input
                                                defaultValue="+234 812 345 6789"
                                                className="bg-white/5 border-white/10 text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Currency</label>
                                            <Input
                                                defaultValue="NGN (₦)"
                                                className="bg-white/5 border-white/10 text-white"
                                                disabled
                                            />
                                        </div>
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
