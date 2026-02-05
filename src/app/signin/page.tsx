"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            router.push("/admin"); // Redirect to admin dashboard on success
            router.refresh();
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || "Failed to login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-950">
            {/* Left: Branding & Visuals */}
            <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-slate-900 border-r border-white/10">
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/20 backdrop-blur-sm">
                            <Zap className="h-6 w-6 text-emerald-400" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">Baycarl Enterprise</span>
                    </div>
                </div>

                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                            Manage your Petshop empire with precision.
                        </h1>
                        <p className="text-slate-400 text-lg max-w-md">
                            Advanced inventory tracking, financial analytics, and comprehensive role-based access control.
                        </p>
                    </motion.div>
                </div>

                <div className="relative z-10 text-sm text-slate-500">
                    © 2024 Baycarl Petshop. Internal System.
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-600 rounded-lg">
                                <Zap className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">Baycarl</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Sign in to your dashboard to continue.
                        </p>
                    </div>

                    <Card className="border-slate-200 dark:border-white/10 shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                        <CardContent className="pt-6">
                            <form onSubmit={handleLogin} className="space-y-6">
                                {error && (
                                    <Alert variant="destructive" className="bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-900/50">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="admin@baycarl.com"
                                            className="pl-10"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <a href="#" className="text-xs font-medium text-emerald-600 hover:text-emerald-500">
                                            Forgot password?
                                        </a>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            className="pl-10"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        "Sign In"
                                    )}
                                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <p className="text-center text-xs text-slate-500">
                        Restricted Access. Unauthorized attempts are logged.
                    </p>
                </div>
            </div>
        </div>
    );
}
