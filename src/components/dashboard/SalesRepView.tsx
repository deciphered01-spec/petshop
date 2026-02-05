"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, ShoppingCart, Package, User, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function SalesRepView() {
    const [activeTab, setActiveTab] = useState<"new-order" | "history">("new-order");

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sales Terminal</h2>
                    <p className="text-slate-500 dark:text-slate-400">Process new orders and track sales</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={activeTab === "new-order" ? "default" : "outline"}
                        onClick={() => setActiveTab("new-order")}
                        className={activeTab === "new-order" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Order
                    </Button>
                    <Button
                        variant={activeTab === "history" ? "default" : "outline"}
                        onClick={() => setActiveTab("history")}
                        className={activeTab === "history" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    >
                        <Clock className="mr-2 h-4 w-4" />
                        History
                    </Button>
                </div>
            </div>

            {activeTab === "new-order" ? (
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Product Selection */}
                    <Card className="lg:col-span-2 border-slate-200 dark:border-white/10 dark:bg-white/5">
                        <CardHeader>
                            <CardTitle>Select Products</CardTitle>
                            <CardDescription>Search and add items to the cart</CardDescription>
                            <div className="relative mt-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search by name or SKU..." className="pl-9" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12 text-slate-500">
                                <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>Search for a product to begin</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cart / Checkout */}
                    <Card className="border-slate-200 dark:border-white/10 dark:bg-white/5 h-fit">
                        <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-emerald-600" />
                                Current Order
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="text-center py-8 text-slate-400 text-sm italic">
                                    Cart is empty
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Subtotal</span>
                                        <span>₦0.00</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg text-slate-900 dark:text-white pt-2">
                                        <span>Total</span>
                                        <span>₦0.00</span>
                                    </div>
                                </div>

                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled>
                                    Process Payment
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Card className="border-slate-200 dark:border-white/10 dark:bg-white/5">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-mono">ORD-001</TableCell>
                                    <TableCell>Walk-in Customer</TableCell>
                                    <TableCell>₦12,500</TableCell>
                                    <TableCell><Badge className="bg-emerald-500">Completed</Badge></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
