'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Order, OrderItem } from '@/types/database';
import type { OrderWithItems } from '@/types';

const ORDERS_KEY = 'orders';

interface OrderFilters {
    status?: string;
    customerId?: string;
    startDate?: string;
    endDate?: string;
}

/**
 * Fetch all orders with optional filters
 */
export function useOrders(filters?: OrderFilters) {
    const supabase = createClient();

    return useQuery({
        queryKey: [ORDERS_KEY, filters],
        queryFn: async (): Promise<Order[]> => {
            let query = supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (filters?.status) {
                query = query.eq('status', filters.status);
            }
            if (filters?.customerId) {
                query = query.eq('customer_id', filters.customerId);
            }
            if (filters?.startDate) {
                query = query.gte('created_at', filters.startDate);
            }
            if (filters?.endDate) {
                query = query.lte('created_at', filters.endDate);
            }

            const { data, error } = await query;

            if (error) throw error;
            return (data as Order[]) || [];
        },
    });
}

/**
 * Fetch a single order with its items
 */
export function useOrder(orderId: string | null) {
    const supabase = createClient();

    return useQuery({
        queryKey: [ORDERS_KEY, orderId],
        queryFn: async (): Promise<OrderWithItems | null> => {
            if (!orderId) return null;

            // Fetch order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (orderError) throw orderError;
            if (!order) return null;

            // Fetch order items
            const { data: items, error: itemsError } = await supabase
                .from('order_items')
                .select('*')
                .eq('order_id', orderId);

            if (itemsError) throw itemsError;

            const orderData = order as Order;
            const itemsData = (items as OrderItem[]) || [];

            return {
                ...orderData,
                items: itemsData,
            };
        },
        enabled: !!orderId,
    });
}

/**
 * Fetch orders for the current user (customer view)
 */
export function useMyOrders() {
    const supabase = createClient();

    return useQuery({
        queryKey: [ORDERS_KEY, 'my-orders'],
        queryFn: async (): Promise<Order[]> => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return [];

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('customer_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return (data as Order[]) || [];
        },
    });
}

/**
 * Get recent orders (for dashboard)
 */
export function useRecentOrders(limit: number = 10) {
    const supabase = createClient();

    return useQuery({
        queryKey: [ORDERS_KEY, 'recent', limit],
        queryFn: async ({ signal }): Promise<Order[]> => {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50)
                .abortSignal(signal);

            if (error) throw error;
            return (data as Order[]) || [];
        },
    });
}

interface OrderStats {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
    totalRevenue: number;
}

/**
 * Get order statistics
 */
export function useOrderStats() {
    const supabase = createClient();

    return useQuery({
        queryKey: [ORDERS_KEY, 'stats'],
        queryFn: async (): Promise<OrderStats> => {
            const { data, error } = await supabase
                .from('orders')
                .select('status, total_amount');

            if (error) throw error;

            const ordersData = (data as Array<{ status: string; total_amount: number }>) || [];

            const stats: OrderStats = {
                total: ordersData.length,
                pending: ordersData.filter(o => o.status === 'pending').length,
                processing: ordersData.filter(o => o.status === 'processing').length,
                completed: ordersData.filter(o => o.status === 'completed').length,
                cancelled: ordersData.filter(o => o.status === 'cancelled').length,
                totalRevenue: ordersData.reduce((sum, o) => sum + Number(o.total_amount), 0),
            };

            return stats;
        },
    });
}
