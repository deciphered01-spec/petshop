'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Profile, UserRole } from '@/types/database';

interface AuthState {
    user: SupabaseUser | null;
    profile: Profile | null;
    isLoading: boolean;
    error: string | null;
}

interface UseAuthReturn extends AuthState {
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signUp: (email: string, password: string, metadata?: { full_name?: string }) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    isDirector: boolean;
    isManager: boolean;
    isStaff: boolean;
    role: UserRole | null;
}

/**
 * Custom hook for authentication state and actions
 */
export function useAuth(): UseAuthReturn {
    const [state, setState] = useState<AuthState>({
        user: null,
        profile: null,
        isLoading: true,
        error: null,
    });

    const supabase = createClient();

    // Fetch user profile
    const fetchProfile = useCallback(async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
    }, [supabase]);

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    const profile = await fetchProfile(session.user.id);
                    setState({
                        user: session.user,
                        profile,
                        isLoading: false,
                        error: null,
                    });
                } else {
                    setState({
                        user: null,
                        profile: null,
                        isLoading: false,
                        error: null,
                    });
                }
            } catch (error) {
                setState({
                    user: null,
                    profile: null,
                    isLoading: false,
                    error: 'Failed to initialize auth',
                });
            }
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    const profile = await fetchProfile(session.user.id);
                    setState({
                        user: session.user,
                        profile,
                        isLoading: false,
                        error: null,
                    });
                } else if (event === 'SIGNED_OUT') {
                    setState({
                        user: null,
                        profile: null,
                        isLoading: false,
                        error: null,
                    });
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [supabase, fetchProfile]);

    // Sign in with email/password
    const signIn = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) return { error: error.message };
            return { error: null };
        } catch {
            return { error: 'An unexpected error occurred' };
        }
    };

    // Sign up with email/password
    const signUp = async (
        email: string,
        password: string,
        metadata?: { full_name?: string }
    ) => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: metadata,
                },
            });

            if (error) return { error: error.message };
            return { error: null };
        } catch {
            return { error: 'An unexpected error occurred' };
        }
    };

    // Sign out
    const signOut = async () => {
        await supabase.auth.signOut();
    };

    // Role checks
    const role = state.profile?.role ?? null;
    const isDirector = role === 'director';
    const isManager = role === 'manager';
    const isStaff = isDirector || isManager;

    return {
        ...state,
        signIn,
        signUp,
        signOut,
        isDirector,
        isManager,
        isStaff,
        role,
    };
}
