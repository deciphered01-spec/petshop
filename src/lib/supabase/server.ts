import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client for server-side usage (Server Components, Route Handlers).
 * This client handles cookie management for authentication.
 * 
 * Note: For full type safety, run `npx supabase gen types typescript` 
 * after setting up your Supabase project to generate proper database types.
 */
export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing user sessions.
                    }
                },
            },
        }
    );
}

/**
 * Creates a Supabase admin client with service role for elevated operations.
 * IMPORTANT: Only use this for server-side operations that require bypassing RLS.
 */
export function createAdminClient() {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                getAll() {
                    return [];
                },
                setAll() { },
            },
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}
