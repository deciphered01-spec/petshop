import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import crypto from 'crypto';
import type { PaystackWebhookPayload, ApiResponse } from '@/types';

/**
 * POST /api/webhooks/paystack
 * Handle Paystack payment webhooks
 * 
 * This endpoint processes successful payments:
 * 1. Verifies the webhook signature
 * 2. Creates/updates the order
 * 3. Decrements product stock
 * 4. Logs revenue
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<null>>> {
    try {
        // Get the raw body for signature verification
        const rawBody = await request.text();

        // Verify Paystack webhook signature
        const signature = request.headers.get('x-paystack-signature');

        if (!signature) {
            console.error('Missing Paystack signature');
            return NextResponse.json(
                { success: false, error: 'Missing signature' },
                { status: 400 }
            );
        }

        const secret = process.env.PAYSTACK_SECRET_KEY!;
        const hash = crypto
            .createHmac('sha512', secret)
            .update(rawBody)
            .digest('hex');

        if (hash !== signature) {
            console.error('Invalid Paystack signature');
            return NextResponse.json(
                { success: false, error: 'Invalid signature' },
                { status: 400 }
            );
        }

        // Parse the webhook payload
        const payload: PaystackWebhookPayload = JSON.parse(rawBody);

        // Only process successful charges
        if (payload.event !== 'charge.success') {
            return NextResponse.json({ success: true, message: 'Event ignored' });
        }

        const { data } = payload;

        // Use admin client to bypass RLS for system operations
        const supabase = createAdminClient();

        // Check if this transaction has already been processed (idempotency)
        const { data: existingOrder } = await supabase
            .from('orders')
            .select('id')
            .eq('paystack_reference', data.reference)
            .single();

        if (existingOrder) {
            console.log(`Order already processed for reference: ${data.reference}`);
            return NextResponse.json({ success: true, message: 'Already processed' });
        }

        // Get cart items from metadata
        const cartItems = data.metadata?.cart_items || [];

        if (cartItems.length === 0) {
            console.error('No cart items in metadata');
            return NextResponse.json(
                { success: false, error: 'No cart items found' },
                { status: 400 }
            );
        }

        // Calculate total amount (Paystack sends amount in kobo)
        const totalAmount = data.amount / 100;

        // Create the order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                customer_email: data.customer.email,
                customer_name: `${data.customer.first_name || ''} ${data.customer.last_name || ''}`.trim() || null,
                total_amount: totalAmount,
                status: 'processing',
                payment_status: 'successful',
                payment_reference: data.reference,
                paystack_reference: data.reference,
            })
            .select()
            .single();

        if (orderError || !order) {
            console.error('Failed to create order:', orderError);
            return NextResponse.json(
                { success: false, error: 'Failed to create order' },
                { status: 500 }
            );
        }

        // Process each cart item
        let totalCost = 0;

        for (const item of cartItems) {
            // Get current product data
            const { data: product, error: productError } = await supabase
                .from('products')
                .select('id, name, price, cost_price, stock_quantity, is_pack, pack_size')
                .eq('id', item.product_id)
                .single();

            if (productError || !product) {
                console.error(`Product not found: ${item.product_id}`);
                continue;
            }

            // Calculate actual units sold (for packs vs singles)
            const actualUnitsSold = product.is_pack 
                ? item.quantity * (product.pack_size || 1)  // quantity of packs × units per pack
                : item.quantity;  // regular single units

            // Create order item
            const { error: itemError } = await supabase
                .from('order_items')
                .insert({
                    order_id: order.id,
                    product_id: product.id,
                    product_name: product.name,
                    quantity: item.quantity,  // Number of packs or singles purchased
                    unit_price: product.price,  // Price per pack or single
                    total_price: product.price * item.quantity,
                });

            if (itemError) {
                console.error('Failed to create order item:', itemError);
            }

            // Decrement stock (stock is stored as packs if is_pack=true, singles if false)
            const newStock = Math.max(0, product.stock_quantity - item.quantity);
            const { error: stockError } = await supabase
                .from('products')
                .update({ stock_quantity: newStock })
                .eq('id', product.id);

            if (stockError) {
                console.error('Failed to update stock:', stockError);
            }

            // Log inventory change
            await supabase.from('inventory_logs').insert({
                product_id: product.id,
                action: 'stock_adjustment',
                previous_values: { stock_quantity: product.stock_quantity },
                new_values: { stock_quantity: newStock },
                performed_by: null, // System action
            });

            // Accumulate cost for profit calculation
            // For packs: cost_price is per pack, so cost = cost_price × quantity
            // For singles: cost_price is per unit, so cost = cost_price × quantity
            totalCost += product.cost_price * item.quantity;
        }

        // Log revenue (Director-only visible data)
        const { error: revenueError } = await supabase
            .from('revenue_logs')
            .insert({
                order_id: order.id,
                amount: totalAmount,
                cost_amount: totalCost,
                payment_method: data.channel,
                payment_reference: data.reference,
                notes: `Paystack payment - ${data.gateway_response}`,
            });

        if (revenueError) {
            console.error('Failed to log revenue:', revenueError);
        }

        // Update order status to completed
        await supabase
            .from('orders')
            .update({ status: 'completed' })
            .eq('id', order.id);

        console.log(`Successfully processed order: ${order.order_number}`);

        return NextResponse.json({
            success: true,
            message: 'Payment processed successfully',
        });

    } catch (error) {
        console.error('Paystack webhook error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
