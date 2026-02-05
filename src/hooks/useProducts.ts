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
        queryFn: async (): Promise<any[]> => {
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
            if (filters?.isActive !== undefined) {
                query = query.eq('is_active', filters.isActive);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Map Database (snake_case) to Frontend (camelCase)
            return (data || []).map((p: any) => ({
                id: p.id, // UUID string
                name: p.name,
                sku: p.sku || '',
                description: p.description || '',
                category: p.category,
                costPrice: p.cost_price,
                sellingPrice: p.price,
                stock: p.stock_quantity,
                threshold: p.low_stock_threshold,
                rating: 4.5, // Mock default
                reviews: 0, // Mock default
                images: p.image_url ? [p.image_url] : [],
                status: p.stock_quantity === 0 ? 'out-of-stock' : p.stock_quantity <= p.low_stock_threshold ? 'low-stock' : 'in-stock',
                featured: false, // Mock default

                // Enterprise fields
                isPack: p.is_pack || false,
                packSize: p.pack_size || 1,
                unitType: p.unit_type || 'pcs'
            }));
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
    const supabase = createClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (product: AddProductPayload): Promise<any> => {
            const dbProduct = {
                name: product.name,
                description: product.description,
                category: product.category,
                sku: product.sku,
                price: product.price,
                cost_price: product.cost_price,
                stock_quantity: product.stock_quantity,
                low_stock_threshold: product.low_stock_threshold || 10,
                image_url: product.image_url,
                is_active: product.is_active ?? true,
                // created_by should be handled by default or handled here if needed
            };

            const { data, error } = await supabase
                .from('products')
                .insert(dbProduct)
                .select()
                .single();

            if (error) throw error;
            return data;
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
        mutationFn: async (params: { id: string; updates: Partial<any> }): Promise<any> => {
            const { id, updates } = params;

            // Map frontend updates to DB columns if necessary
            const dbUpdates: any = { ...updates };
            if (updates.stock !== undefined) dbUpdates.stock_quantity = updates.stock;
            if (updates.sellingPrice !== undefined) dbUpdates.price = updates.sellingPrice;
            if (updates.costPrice !== undefined) dbUpdates.cost_price = updates.costPrice;
            if (updates.threshold !== undefined) dbUpdates.low_stock_threshold = updates.threshold;
            if (updates.images && updates.images.length > 0) dbUpdates.image_url = updates.images[0];

            // Remove frontend specific keys that don't match DB
            delete dbUpdates.stock;
            delete dbUpdates.sellingPrice;
            delete dbUpdates.costPrice;
            delete dbUpdates.threshold;
            delete dbUpdates.images;
            delete dbUpdates.rating;
            delete dbUpdates.reviews;
            delete dbUpdates.status;
            delete dbUpdates.featured;

            const { data, error } = await supabase
                .from('products')
                .update(dbUpdates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
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
