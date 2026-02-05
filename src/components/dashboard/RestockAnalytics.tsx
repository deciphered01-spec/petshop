"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Package,
    TrendingUp,
    TrendingDown,
    Calendar,
    Search,
    ArrowUpRight,
    Filter,
    MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { useRestocks } from "@/hooks/useRestocks";

export function RestockAnalytics() {
    const [searchTerm, setSearchTerm] = useState("");
    const { data: batches } = useRestocks();

    const filteredBatches = (batches || []).filter(batch =>
        batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card className="dark:border-white/10 dark:bg-white/5 border-slate-200 bg-white overflow-hidden">
            <CardHeader className="dark:border-b dark:border-white/10 border-b border-slate-100">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <CardTitle className="text-lg font-bold dark:text-white text-slate-900 flex items-center gap-2">
                            <Package className="h-5 w-5 text-blue-500" />
                            Restock Batch Performance
                        </CardTitle>
                        <CardDescription className="dark:text-slate-400 text-slate-500">
                            Profitability analysis per inventory batch
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder="Search batches..."
                                className="pl-9 w-[200px] h-9 dark:bg-white/5 dark:border-white/10 bg-slate-50 border-slate-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="sm" className="dark:border-white/10 dark:text-slate-300">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="dark:bg-slate-900/50 bg-slate-50/80">
                            <TableRow className="dark:border-white/5 border-slate-100">
                                <TableHead className="font-semibold dark:text-slate-400">Batch Info</TableHead>
                                <TableHead className="font-semibold dark:text-slate-400 text-right">Qty</TableHead>
                                <TableHead className="font-semibold dark:text-slate-400 text-right">Cost/Unit</TableHead>
                                <TableHead className="font-semibold dark:text-slate-400 text-right">Potential Profit</TableHead>
                                <TableHead className="font-semibold dark:text-slate-400 text-right">ROI</TableHead>
                                <TableHead className="font-semibold dark:text-slate-400 text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBatches.map((batch) => {
                                const totalCost = batch.quantityReceived * batch.costPricePerUnit;
                                const potentialRevenue = batch.quantityReceived * batch.sellingPriceAtStocking;
                                const potentialProfit = potentialRevenue - totalCost;
                                const roi = totalCost > 0 ? ((potentialProfit / totalCost) * 100).toFixed(1) : "0.0";

                                return (
                                    <TableRow key={batch.id} className="dark:border-white/5 border-slate-100 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium dark:text-white text-slate-900">{batch.productName}</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-[10px] h-5 px-1.5 dark:border-white/10 dark:text-slate-400 text-slate-500 font-mono">
                                                        {batch.batchNumber}
                                                    </Badge>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" /> {batch.receivedDate}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-medium dark:text-white">{batch.remainingQuantity} / {batch.quantityReceived}</span>
                                                <div className="w-16 h-1 mt-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${(batch.remainingQuantity / batch.quantityReceived) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-sm dark:text-slate-300">
                                            ₦{batch.costPricePerUnit.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                    ₦{potentialProfit.toLocaleString()}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    Rev: ₦{potentialRevenue.toLocaleString()}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-0">
                                                <TrendingUp className="mr-1 h-3 w-3" />
                                                {roi}%
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={
                                                batch.status === 'Active' ? 'default' :
                                                    batch.status === 'Low Stock' ? 'secondary' : 'outline'
                                            } className={
                                                batch.status === 'Active' ? 'bg-emerald-500 hover:bg-emerald-600' :
                                                    batch.status === 'Low Stock' ? 'bg-amber-500 hover:bg-amber-600 text-white' :
                                                        'text-slate-500 border-slate-200 dark:border-slate-700'
                                            }>
                                                {batch.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
