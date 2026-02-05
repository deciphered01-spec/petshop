"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Shield, AlertCircle, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";

const ROLES = [
    { value: 'admin', label: 'Admin', color: 'bg-emerald-600' },
    { value: 'director', label: 'Director', color: 'bg-emerald-600' },
    { value: 'manager', label: 'Manager', color: 'bg-blue-600' },
    { value: 'ops_manager', label: 'Operations Manager', color: 'bg-blue-600' },
    { value: 'auditor', label: 'Auditor', color: 'bg-violet-600' },
    { value: 'sales_rep', label: 'Sales Representative', color: 'bg-amber-600' },
    { value: 'inventory_manager', label: 'Inventory Manager', color: 'bg-indigo-600' },
];

interface User {
    id: string;
    email: string;
    role: string;
    full_name?: string;
}

export function RoleManager() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const supabase = createClient();

    // Load users
    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, email, role, full_name')
                .order('email');

            if (error) throw error;
            setUsers(data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    // Update user role
    const updateUserRole = async (userId: string, newRole: string) => {
        setError(null);
        setSuccess(null);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            setSuccess(`Role updated successfully`);
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to update role');
        }
    };

    // Load users on mount
    useState(() => {
        loadUsers();
    });

    const getRoleBadgeColor = (role: string) => {
        return ROLES.find(r => r.value === role)?.color || 'bg-slate-600';
    };

    return (
        <Card className="dark:border-white/10 dark:bg-white/5 border-slate-200 bg-white">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold dark:text-white text-slate-900 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-emerald-500" />
                            User Role Management
                        </CardTitle>
                        <CardDescription className="dark:text-slate-400 text-slate-500">
                            Change user roles and permissions (Admin Only)
                        </CardDescription>
                    </div>
                    <Button onClick={loadUsers} disabled={loading} size="sm" variant="outline">
                        <Users className="mr-2 h-4 w-4" />
                        {loading ? 'Loading...' : 'Refresh'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="mb-4 border-emerald-500/50 bg-emerald-50 dark:bg-emerald-500/10">
                        <Check className="h-4 w-4 text-emerald-600" />
                        <AlertDescription className="text-emerald-700 dark:text-emerald-400">{success}</AlertDescription>
                    </Alert>
                )}

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="dark:bg-slate-900/50 bg-slate-50">
                            <TableRow className="dark:border-white/5 border-slate-100">
                                <TableHead className="font-semibold dark:text-slate-400">User</TableHead>
                                <TableHead className="font-semibold dark:text-slate-400">Email</TableHead>
                                <TableHead className="font-semibold dark:text-slate-400">Current Role</TableHead>
                                <TableHead className="font-semibold dark:text-slate-400 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} className="dark:border-white/5 border-slate-100">
                                    <TableCell className="font-medium dark:text-white text-slate-900">
                                        {user.full_name || 'N/A'}
                                    </TableCell>
                                    <TableCell className="dark:text-slate-300 text-slate-600">
                                        {user.email}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${getRoleBadgeColor(user.role)} text-white text-xs`}>
                                            {ROLES.find(r => r.value === user.role)?.label || user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Select
                                            value={user.role}
                                            onValueChange={(newRole) => updateUserRole(user.id, newRole)}
                                        >
                                            <SelectTrigger className="w-[200px] ml-auto dark:bg-white/5 dark:border-white/10">
                                                <SelectValue placeholder="Change role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ROLES.map((role) => (
                                                    <SelectItem key={role.value} value={role.value}>
                                                        <span className="flex items-center gap-2">
                                                            <span className={`h-2 w-2 rounded-full ${role.color}`} />
                                                            {role.label}
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {users.length === 0 && !loading && (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        No users found. Click refresh to load users.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
