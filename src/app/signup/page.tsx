"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowLeft, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (error) {
                setError(error.message);
                return;
            }

            // In a real app, you might check for session/user confirmation
            router.push("/dashboard");
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) setError(error.message);
        } catch (err) {
            setError("An unexpected error occurred with Google signup");
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Decorative */}
            <div className="hidden lg:block relative bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-900/40 mix-blend-overlay" />
                <div className="absolute inset-0 bg-[url('/products/rabbit-pellets.jpg')] bg-cover bg-center opacity-30" />
                <div className="relative h-full flex flex-col justify-between p-12 text-white">
                    <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Store
                    </Link>
                    <div>
                        <h1 className="text-4xl font-bold mb-4">Join PetShop</h1>
                        <p className="text-lg text-slate-300 max-w-md">
                            Create an account to track orders, save your favorite products, and get exclusive offers.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                            <CardDescription>
                                Enter your details to get started
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <Button
                                variant="outline"
                                onClick={handleGoogleSignup}
                                className="w-full py-6 flex items-center justify-center gap-2 text-slate-700 dark:text-slate-200"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Sign up with Google
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white dark:bg-slate-950 px-2 text-muted-foreground">
                                        Or continue with email
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={handleSignup} className="grid gap-4">
                                <div className="grid gap-2">
                                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            className="pl-9"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            className="pl-9"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            className="pl-9"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                        {error}
                                    </div>
                                )}

                                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : "Create Account"}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter>
                            <div className="text-center text-sm w-full text-slate-600 dark:text-slate-400">
                                Already have an account?{" "}
                                <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                                    Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
