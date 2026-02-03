'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/types/database';
import type { ProductFilters, AddProductPayload, ApiResponse } from '@/types';

const PRODUCTS_KEY = 'products';

/**
 * Fetch all products with optional filters
 */
export function useProducts(filters?: ProductFilters) {
    const supabase = createClient();

    return useQuery({
        queryKey: [PRODUCTS_KEY, filters],
        queryFn: async (): Promise<Product[]> => {
            let query = supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            // Apply filters
            if (filters?.category) {
                query = query.eq('category', filters.category);
            }
            if (filters?.search) {
                query = query.ilike('name', `%${filters.search}%`);
            }
            if (filters?.minPrice !== undefined) {
                query = query.gte('price', filters.minPrice);
            }
            if (filters?.maxPrice !== undefined) {
                query = query.lte('price', filters.maxPrice);
            }
            if (filters?.inStock) {
                query = query.gt('stock_quantity', 0);
            }
            if (filters?.isActive !== undefined) {
                query = query.eq('is_active', filters.isActive);
            }

            const { data, error } = await query;

            if (error) throw error;
            return (data as Product[]) || [];
        },
    });
}

/**
 * Fetch a single product by ID
 */
export function useProduct(productId: string | null) {
    const supabase = createClient();

    return useQuery({
        queryKey: [PRODUCTS_KEY, productId],
        queryFn: async (): Promise<Product | null> => {
            if (!productId) return null;

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single();

            if (error) throw error;
            return data as Product;
        },
        enabled: !!productId,
    });
}

/**
 * Add a new product (via API route for proper RBAC)
 */
export function useAddProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (product: AddProductPayload): Promise<Product> => {
            const response = await fetch('/api/inventory/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product),
            });

            const result: ApiResponse<Product> = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.error || 'Failed to add product');
            }

            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
        },
    });
}

/**
 * Update an existing product
 */
export function useUpdateProduct() {
    const supabase = createClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: { id: string; updates: Partial<Omit<Product, 'id' | 'created_at'>> }): Promise<Product> => {
            const { id, updates } = params;
            const { data, error } = await supabase
                .from('products')
                .update(updates as Record<string, unknown>)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data as Product;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
            queryClient.setQueryData([PRODUCTS_KEY, data.id], data);
        },
    });
}

/**
 * Delete a product (soft delete by setting is_active to false)
 */
export function useDeleteProduct() {
    const supabase = createClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: string): Promise<void> => {
            const { error } = await supabase
                .from('products')
                .update({ is_active: false } as Record<string, unknown>)
                .eq('id', productId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
        },
    });
}

/**
 * Get low stock products
 */
export function useLowStockProducts() {
    const supabase = createClient();

    return useQuery({
        queryKey: [PRODUCTS_KEY, 'low-stock'],
        queryFn: async (): Promise<Product[]> => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('is_active', true)
                .lte('stock_quantity', 10)
                .order('stock_quantity', { ascending: true });

            if (error) throw error;
            return (data as Product[]) || [];
        },
    });
}
