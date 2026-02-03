/**
 * Baycarl Petshop - Application Types
 * Core interfaces and types used throughout the application
 */

import type {
    Profile,
    Product,
    Order,
    OrderItem,
    UserRole,
    OrderStatus,
    PaymentStatus
} from './database';

// Re-export database types
export type {
    Profile,
    Product,
    Order,
    OrderItem,
    UserRole,
    OrderStatus,
    PaymentStatus,
    Expense,
    RevenueLog,
    InventoryLog
} from './database';

// ============================================================================
// USER & AUTH TYPES
// ============================================================================

export interface User extends Profile {
    isAuthenticated: boolean;
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    full_name: string;
    phone?: string;
}

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export interface ProductWithStock extends Product {
    isLowStock: boolean;
}

export interface ProductFilters {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    isActive?: boolean;
}

export interface AddProductPayload {
    name: string;
    description?: string;
    category: string;
    sku?: string;
    price: number;
    cost_price: number;
    stock_quantity: number;
    low_stock_threshold?: number;
    image_url?: string;
    is_active?: boolean;
}

export interface UpdateProductPayload extends Partial<AddProductPayload> {
    id: string;
}

// ============================================================================
// ORDER TYPES
// ============================================================================

export interface OrderWithItems extends Order {
    items: OrderItem[];
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Cart {
    items: CartItem[];
    total: number;
}

export interface CheckoutPayload {
    customer_email: string;
    customer_name?: string;
    shipping_address?: ShippingAddress;
    items: {
        product_id: string;
        quantity: number;
    }[];
    payment_method?: string;
}

export interface ShippingAddress {
    street: string;
    city: string;
    state: string;
    postal_code?: string;
    country: string;
    phone?: string;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface AnalyticsData {
    revenue: RevenueStats;
    profit: ProfitStats;
    inventory: InventoryStats;
    orders: OrderStats;
}

export interface RevenueStats {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    growth: number; // percentage
}

export interface ProfitStats {
    total: number;
    thisMonth: number;
    margin: number; // percentage
}

export interface InventoryStats {
    totalProducts: number;
    totalStockValue: number;
    lowStockCount: number;
    outOfStockCount: number;
}

export interface OrderStats {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
}

// ============================================================================
// PAYSTACK TYPES
// ============================================================================

export interface PaystackWebhookPayload {
    event: string;
    data: PaystackTransactionData;
}

export interface PaystackTransactionData {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number; // in kobo (divide by 100 for naira)
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: PaystackMetadata;
    customer: PaystackCustomer;
    authorization: PaystackAuthorization;
}

export interface PaystackMetadata {
    order_id?: string;
    cart_items?: {
        product_id: string;
        quantity: number;
        price: number;
    }[];
    custom_fields?: Array<{
        display_name: string;
        variable_name: string;
        value: string;
    }>;
}

export interface PaystackCustomer {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string;
    customer_code: string;
    phone: string | null;
}

export interface PaystackAuthorization {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    channel: string;
    card_type: string;
    bank: string;
    country_code: string;
    brand: string;
    reusable: boolean;
    signature: string;
    account_name: string | null;
}

// ============================================================================
// AI TYPES
// ============================================================================

export interface GenerateDescriptionPayload {
    productName: string;
    category: string;
    imageUrl?: string;
    keywords?: string[];
}

export interface GeneratedDescription {
    description: string;
    seoTitle?: string;
    seoDescription?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ============================================================================
// RBAC TYPES
// ============================================================================

export type Permission =
    | 'view_products'
    | 'edit_products'
    | 'delete_products'
    | 'view_orders'
    | 'edit_orders'
    | 'view_customers'
    | 'view_expenses'
    | 'edit_expenses'
    | 'view_revenue'
    | 'view_analytics'
    | 'manage_users';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    customer: ['view_products'],
    manager: [
        'view_products',
        'edit_products',
        'view_orders',
        'edit_orders',
        'view_customers'
    ],
    director: [
        'view_products',
        'edit_products',
        'delete_products',
        'view_orders',
        'edit_orders',
        'view_customers',
        'view_expenses',
        'edit_expenses',
        'view_revenue',
        'view_analytics',
        'manage_users'
    ]
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canAccessRoute(role: UserRole, route: string): boolean {
    if (route.startsWith('/admin')) {
        return role === 'director';
    }
    if (route.startsWith('/dashboard')) {
        return role === 'director' || role === 'manager';
    }
    return true;
}
