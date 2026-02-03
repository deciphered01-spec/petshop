/**
 * Baycarl Petshop - Application Constants
 */

// App metadata
export const APP_NAME = 'Baycarl Petshop';
export const APP_DESCRIPTION = 'Your trusted pet shop for all your pet needs';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Product categories
export const PRODUCT_CATEGORIES = [
    'Dog Food',
    'Cat Food',
    'Bird Food',
    'Fish Food',
    'Dog Accessories',
    'Cat Accessories',
    'Bird Accessories',
    'Fish Accessories',
    'Pet Health',
    'Pet Grooming',
    'Pet Toys',
    'Pet Bedding',
    'Aquarium Supplies',
    'Other',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

// Expense categories
export const EXPENSE_CATEGORIES = [
    'Inventory Purchase',
    'Utilities',
    'Rent',
    'Salaries',
    'Marketing',
    'Maintenance',
    'Transportation',
    'Office Supplies',
    'Taxes',
    'Other',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

// Order status labels and colors
export const ORDER_STATUS_CONFIG = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
} as const;

// Payment status labels and colors
export const PAYMENT_STATUS_CONFIG = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    successful: { label: 'Paid', color: 'bg-green-100 text-green-800' },
    failed: { label: 'Failed', color: 'bg-red-100 text-red-800' },
} as const;

// Role labels
export const ROLE_LABELS = {
    director: 'Director',
    manager: 'Manager',
    customer: 'Customer',
} as const;

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

// Stock threshold for low stock alerts
export const DEFAULT_LOW_STOCK_THRESHOLD = 10;

// API Routes
export const API_ROUTES = {
    INVENTORY_ADD: '/api/inventory/add',
    ADMIN_ANALYTICS: '/api/admin/analytics',
    PAYSTACK_WEBHOOK: '/api/webhooks/paystack',
    AI_GENERATE_DESCRIPTION: '/api/ai/generate-description',
} as const;

// Navigation items
export const NAV_ITEMS = {
    public: [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
    ],
    dashboard: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Inventory', href: '/dashboard/inventory' },
        { label: 'Orders', href: '/dashboard/orders' },
    ],
    admin: [
        { label: 'Admin', href: '/admin' },
        { label: 'Analytics', href: '/admin/analytics' },
        { label: 'Expenses', href: '/admin/expenses' },
        { label: 'Users', href: '/admin/users' },
    ],
} as const;
