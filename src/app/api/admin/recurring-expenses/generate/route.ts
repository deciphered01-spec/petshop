import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/admin/recurring-expenses/generate
 * Manually trigger generation of due recurring expenses
 * Auth: Admin/Director only
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Verify authentication and authorization
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check user role
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return NextResponse.json(
                { success: false, error: 'Profile not found' },
                { status: 404 }
            );
        }

        if (!['admin', 'director'].includes(profile.role)) {
            return NextResponse.json(
                { success: false, error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        // Call the database function to generate recurring expenses
        const { data, error } = await supabase.rpc('generate_recurring_expenses');

        if (error) {
            console.error('Failed to generate recurring expenses:', error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        const result = data?.[0] || { generated_count: 0, message: 'No expenses generated' };

        return NextResponse.json({
            success: true,
            count: result.generated_count,
            message: result.message,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in recurring expense generation:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Internal server error' 
            },
            { status: 500 }
        );
    }
}
