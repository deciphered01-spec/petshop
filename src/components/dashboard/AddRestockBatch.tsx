"use client";

import { useState } from "react";
import { Plus, Package, Calendar, DollarSign, Truck, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function AddRestockBatch() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form State
    const [batchNo, setBatchNo] = useState(`BATCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`);
    const [productName, setProductName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [cost, setCost] = useState("");
    const [supplier, setSupplier] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call for now (since we might need to hook up real product search first)
        // In real implemenation, we'd lookup product ID from name search
        await new Promise(resolve => setTimeout(resolve, 1500));

        setLoading(false);
        setSuccess(true);

        // Reset after success
        setTimeout(() => {
            setSuccess(false);
            setBatchNo(`BATCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`);
            setProductName("");
            setQuantity("");
            setCost("");
        }, 2000);
    };

    return (
        <Card className="dark:border-white/10 dark:bg-white/5 border-slate-200 bg-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white text-slate-900">
                    <Package className="h-5 w-5 text-emerald-500" />
                    Receive New Stock
                </CardTitle>
                <CardDescription>
                    Register incoming inventory batches
                </CardDescription>
            </CardHeader>
            <CardContent>
                {success ? (
                    <div className="flex flex-col items-center justify-center py-8 text-emerald-500 animate-in fade-in zoom-in">
                        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                            <Plus className="h-6 w-6 text-emerald-600" />
                        </div>
                        <p className="font-semibold text-lg">Batch Added Successfully!</p>
                        <p className="text-sm text-slate-500">Inventory updated.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Batch Number</Label>
                                <div className="relative">
                                    <Package className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        value={batchNo}
                                        onChange={(e) => setBatchNo(e.target.value)}
                                        className="pl-9 font-mono text-xs"
                                        placeholder="BATCH-..."
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Received Date</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input type="date" className="pl-9" defaultValue={new Date().toISOString().split('T')[0]} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Product Name / SKU</Label>
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    placeholder="Search product..."
                                    className="pl-9"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Quantity</Label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Cost Per Unit (₦)</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        className="pl-9"
                                        value={cost}
                                        onChange={(e) => setCost(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Supplier (Optional)</Label>
                            <div className="relative">
                                <Truck className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Supplier Name"
                                    className="pl-9"
                                    value={supplier}
                                    onChange={(e) => setSupplier(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            {loading ? "Registering..." : "Register Stock"}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}

// Helper icon since Search is not imported but used
function SearchIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}
