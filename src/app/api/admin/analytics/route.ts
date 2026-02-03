import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { AnalyticsData, ApiResponse } from '@/types';

/**
 * GET /api/admin/analytics
 * Get comprehensive analytics data (Director only)
 * 
 * Response: ApiResponse<AnalyticsData>
 */
export async function GET(): Promise<NextResponse<ApiResponse<AnalyticsData>>> {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized: Please log in' },
                { status: 401 }
            );
        }

        // CRITICAL: Director-only access check
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

        // Strict RBAC: Only directors can view analytics (includes profit data)
        if (profile.role !== 'director') {
            return NextResponse.json(
                { success: false, error: 'Forbidden: Director access required' },
                { status: 403 }
            );
        }

        // Calculate date ranges
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

        // Fetch revenue data (Director-only table)
        const { data: allRevenue } = await supabase
            .from('revenue_logs')
            .select('amount, cost_amount, profit, logged_at');

        const { data: todayRevenue } = await supabase
            .from('revenue_logs')
            .select('amount')
            .gte('logged_at', startOfDay);

        const { data: weekRevenue } = await supabase
            .from('revenue_logs')
            .select('amount')
            .gte('logged_at', startOfWeek);

        const { data: monthRevenue } = await supabase
            .from('revenue_logs')
            .select('amount, profit')
            .gte('logged_at', startOfMonth);

        const { data: lastMonthRevenue } = await supabase
            .from('revenue_logs')
            .select('amount')
            .gte('logged_at', startOfLastMonth)
            .lt('logged_at', startOfMonth);

        // Calculate revenue totals
        const totalRevenue = allRevenue?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;
        const todayTotal = todayRevenue?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;
        const weekTotal = weekRevenue?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;
        const monthTotal = monthRevenue?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;
        const lastMonthTotal = lastMonthRevenue?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;

        // Calculate growth percentage (month over month)
        const growth = lastMonthTotal > 0
            ? ((monthTotal - lastMonthTotal) / lastMonthTotal) * 100
            : 0;

        // Calculate profit totals
        const totalProfit = allRevenue?.reduce((sum, r) => sum + Number(r.profit || 0), 0) || 0;
        const monthProfit = monthRevenue?.reduce((sum, r) => sum + Number(r.profit || 0), 0) || 0;
        const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

        // Fetch inventory data
        const { data: products } = await supabase
            .from('products')
            .select('price, cost_price, stock_quantity, low_stock_threshold, is_active');

        const activeProducts = products?.filter(p => p.is_active) || [];
        const totalProducts = activeProducts.length;
        const totalStockValue = activeProducts.reduce(
            (sum, p) => sum + (Number(p.cost_price) * p.stock_quantity),
            0
        );
        const lowStockCount = activeProducts.filter(
            p => p.stock_quantity <= p.low_stock_threshold && p.stock_quantity > 0
        ).length;
        const outOfStockCount = activeProducts.filter(p => p.stock_quantity === 0).length;

        // Fetch order statistics
        const { data: orders } = await supabase
            .from('orders')
            .select('status');

        const totalOrders = orders?.length || 0;
        const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
        const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
        const cancelledOrders = orders?.filter(o => o.status === 'cancelled').length || 0;

        // Compile analytics data
        const analyticsData: AnalyticsData = {
            revenue: {
                total: totalRevenue,
                today: todayTotal,
                thisWeek: weekTotal,
                thisMonth: monthTotal,
                growth: Math.round(growth * 100) / 100,
            },
            profit: {
                total: totalProfit,
                thisMonth: monthProfit,
                margin: Math.round(profitMargin * 100) / 100,
            },
            inventory: {
                totalProducts,
                totalStockValue,
                lowStockCount,
                outOfStockCount,
            },
            orders: {
                total: totalOrders,
                pending: pendingOrders,
                completed: completedOrders,
                cancelled: cancelledOrders,
            },
        };

        return NextResponse.json({
            success: true,
            data: analyticsData,
        });

    } catch (error) {
        console.error('Analytics fetch error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
