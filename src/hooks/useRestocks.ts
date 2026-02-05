'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export interface RestockBatch {
    id: string;
    product_id: string;
    quantity: number;
    cost_price: number;
    batch_number: string;
    created_at: string;
    product: {
        name: string;
        price: number;
    };
}

export function useRestocks() {
    const supabase = createClient();

    return useQuery({
        queryKey: ['restocks'],
        queryFn: async ({ signal }) => {
            const { data, error } = await supabase
                .from('restock_batches')
                .select(`
                    id,
                    product_id,
                    quantity,
                    cost_price,
                    batch_number,
                    created_at,
                    products (
                        name,
                        price
                    )
                `)
                .order('created_at', { ascending: false })
                .abortSignal(signal);

            if (error) throw error;

            // Transform for UI
            return (data || []).map((item: any) => ({
                id: item.id,
                batchNumber: item.batch_number || 'BATCH-Unknown',
                productName: item.products?.name || 'Unknown Product',
                quantityReceived: item.quantity,
                remainingQuantity: item.quantity, // Ideally we track remaining, for now assuming full or need to track sales decrement
                costPricePerUnit: item.cost_price,
                sellingPriceAtStocking: item.products?.price || 0,
                receivedDate: new Date(item.created_at).toLocaleDateString(),
                status: 'Active'
            }));
        }
    });
}
