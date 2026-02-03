import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { AddProductPayload, ApiResponse } from '@/types';
import type { Product } from '@/types/database';

/**
 * POST /api/inventory/add
 * Add a new product to inventory (Manager + Director only)
 * 
 * Request body: AddProductPayload
 * Response: ApiResponse<Product>
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Product>>> {
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

        // Check user role (must be staff - manager or director)
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

        if (profile.role !== 'manager' && profile.role !== 'director') {
            return NextResponse.json(
                { success: false, error: 'Forbidden: Insufficient permissions' },
                { status: 403 }
            );
        }

        // Parse request body
        const body: AddProductPayload = await request.json();

        // Validate required fields
        if (!body.name || !body.category || body.price === undefined || body.cost_price === undefined) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: name, category, price, cost_price' },
                { status: 400 }
            );
        }

        // Validate price values
        if (body.price < 0 || body.cost_price < 0) {
            return NextResponse.json(
                { success: false, error: 'Price values cannot be negative' },
                { status: 400 }
            );
        }

        // Insert the product
        const { data: product, error: insertError } = await supabase
            .from('products')
            .insert({
                name: body.name,
                description: body.description || null,
                category: body.category,
                sku: body.sku || null,
                price: body.price,
                cost_price: body.cost_price,
                stock_quantity: body.stock_quantity || 0,
                low_stock_threshold: body.low_stock_threshold || 10,
                image_url: body.image_url || null,
                is_active: body.is_active ?? true,
                created_by: user.id,
            })
            .select()
            .single();

        if (insertError) {
            console.error('Product insert error:', insertError);

            // Handle unique constraint violation (SKU)
            if (insertError.code === '23505') {
                return NextResponse.json(
                    { success: false, error: 'A product with this SKU already exists' },
                    { status: 409 }
                );
            }

            return NextResponse.json(
                { success: false, error: 'Failed to add product' },
                { status: 500 }
            );
        }

        // Log the inventory action for audit trail
        await supabase.from('inventory_logs').insert({
            product_id: product.id,
            action: 'add',
            previous_values: null,
            new_values: product,
            performed_by: user.id,
        });

        return NextResponse.json(
            {
                success: true,
                data: product,
                message: 'Product added successfully',
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Inventory add error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
