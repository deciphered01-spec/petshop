"use client";

import { motion } from "framer-motion";
import { DollarSign, Package, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface InventoryStats {
    totalStockValue: number;
    totalMarketValue: number;
    profitPotential: number;
    lowStockItems: number;
}

export function InventoryValueSummary({ stats }: { stats: InventoryStats }) {
    const cards = [
        {
            title: "Stock Value",
            value: `₦${stats.totalStockValue.toLocaleString()}`,
            subtitle: "Cost Price",
            icon: Package,
            gradient: "from-blue-500 to-cyan-600",
            bgGradient: "from-blue-500/10 to-cyan-600/10",
        },
        {
            title: "Market Value",
            value: `₦${stats.totalMarketValue.toLocaleString()}`,
            subtitle: "Selling Price",
            icon: DollarSign,
            gradient: "from-emerald-500 to-teal-600",
            bgGradient: "from-emerald-500/10 to-teal-600/10",
        },
        {
            title: "Profit Potential",
            value: `₦${stats.profitPotential.toLocaleString()}`,
            subtitle: "Projected",
            icon: TrendingUp,
            gradient: "from-violet-500 to-purple-600",
            bgGradient: "from-violet-500/10 to-purple-600/10",
        },
        {
            title: "Low Stock Alerts",
            value: stats.lowStockItems.toString(),
            subtitle: "Items critical",
            icon: AlertTriangle,
            gradient: "from-amber-500 to-orange-600",
            bgGradient: "from-amber-500/10 to-orange-600/10",
            isAlert: stats.lowStockItems > 0,
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className={`relative overflow-hidden border-slate-200 dark:border-white/10 dark:bg-white/5 bg-white ${card.isAlert ? 'ring-1 ring-amber-500' : ''}`}>
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`} />
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className={`rounded-xl p-3 bg-gradient-to-br ${card.bgGradient}`}>
                                        <Icon className={`h-6 w-6 text-${card.gradient.split(' ')[1].replace('-500', '-600')}`} />
                                        {/* Note: In real app, might need simpler color logic or passing text color class */}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</p>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500">{card.subtitle}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}
