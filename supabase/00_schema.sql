-- ============================================================================
-- BAYCARL PETSHOP - DATABASE SCHEMA
-- Supabase PostgreSQL Setup Script
-- ============================================================================

-- ============================================================================
-- 1. CUSTOM TYPES / ENUMS
-- ============================================================================

-- Helper block to create types safely
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('director', 'manager', 'customer');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'completed', 'cancelled', 'refunded');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE public.payment_status AS ENUM ('pending', 'successful', 'failed');
    END IF;
END$$;

-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    role public.user_role NOT NULL DEFAULT 'customer',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products table (Inventory)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    sku TEXT UNIQUE,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    cost_price DECIMAL(10, 2) NOT NULL CHECK (cost_price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INTEGER NOT NULL DEFAULT 10,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.profiles(id),
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    status public.order_status NOT NULL DEFAULT 'pending',
    payment_status public.payment_status NOT NULL DEFAULT 'pending',
    payment_reference TEXT,
    paystack_reference TEXT,
    shipping_address JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order Items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expenses table (Director access only)
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    category TEXT NOT NULL,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    receipt_url TEXT,
    recorded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Revenue Logs table (Director access only)
CREATE TABLE IF NOT EXISTS public.revenue_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id),
    amount DECIMAL(10, 2) NOT NULL,
    cost_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    profit DECIMAL(10, 2) GENERATED ALWAYS AS (amount - cost_amount) STORED,
    payment_method TEXT,
    payment_reference TEXT,
    notes TEXT,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inventory Action Logs (for audit trail)
CREATE TABLE IF NOT EXISTS public.inventory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id),
    action TEXT NOT NULL, -- 'add', 'update', 'delete', 'stock_adjustment'
    previous_values JSONB,
    new_values JSONB,
    performed_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. INDEXES (Performance Optimization)
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON public.expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_revenue_logs_logged_at ON public.revenue_logs(logged_at);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_product_id ON public.inventory_logs(product_id);

-- ============================================================================
-- 4. FUNCTIONS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create a profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'customer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                       LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS public.user_role AS $$
DECLARE
    user_role public.user_role;
BEGIN
    SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
    RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is director
CREATE OR REPLACE FUNCTION public.is_director(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT role = 'director' FROM public.profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is manager or director
CREATE OR REPLACE FUNCTION public.is_staff(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT role IN ('director', 'manager') FROM public.profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 5. TRIGGERS
-- ============================================================================

-- Updated at triggers
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_profiles_updated_at') THEN
        CREATE TRIGGER set_profiles_updated_at
            BEFORE UPDATE ON public.profiles
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_products_updated_at') THEN
        CREATE TRIGGER set_products_updated_at
            BEFORE UPDATE ON public.products
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_orders_updated_at') THEN
        CREATE TRIGGER set_orders_updated_at
            BEFORE UPDATE ON public.orders
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_expenses_updated_at') THEN
        CREATE TRIGGER set_expenses_updated_at
            BEFORE UPDATE ON public.expenses
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_order_number') THEN
        CREATE TRIGGER set_order_number
            BEFORE INSERT ON public.orders
            FOR EACH ROW
            WHEN (NEW.order_number IS NULL)
            EXECUTE FUNCTION public.generate_order_number();
    END IF;
END$$;

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;

-- Note: Policies cannot be easily wrapped in IF NOT EXISTS, 
-- but attempting to create a duplicate policy throws an error in Postgres.
-- To make this fully idempotent, we would drop policies before creating them
-- or use complex DO blocks. For cleanliness, we will omit the DO blocks for policies
-- here, assuming this is a BASE schema. If conflicts arise, DROP POLICIES first.

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Directors can view all profiles" ON public.profiles;
CREATE POLICY "Directors can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_director(auth.uid()));

DROP POLICY IF EXISTS "Managers can view profiles" ON public.profiles;
CREATE POLICY "Managers can view profiles"
    ON public.profiles FOR SELECT
    USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Directors can update profiles" ON public.profiles;
CREATE POLICY "Directors can update profiles"
    ON public.profiles FOR UPDATE
    USING (public.is_director(auth.uid()));

-- ============================================================================
-- PRODUCTS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products"
    ON public.products FOR SELECT
    USING (is_active = true);

DROP POLICY IF EXISTS "Staff can view all products" ON public.products;
CREATE POLICY "Staff can view all products"
    ON public.products FOR SELECT
    USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Staff can insert products" ON public.products;
CREATE POLICY "Staff can insert products"
    ON public.products FOR INSERT
    WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Staff can update products" ON public.products;
CREATE POLICY "Staff can update products"
    ON public.products FOR UPDATE
    USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Directors can delete products" ON public.products;
CREATE POLICY "Directors can delete products"
    ON public.products FOR DELETE
    USING (public.is_director(auth.uid()));

-- ============================================================================
-- ORDERS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Customers can view own orders" ON public.orders;
CREATE POLICY "Customers can view own orders"
    ON public.orders FOR SELECT
    USING (customer_id = auth.uid());

DROP POLICY IF EXISTS "Staff can view all orders" ON public.orders;
CREATE POLICY "Staff can view all orders"
    ON public.orders FOR SELECT
    USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders"
    ON public.orders FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can update orders" ON public.orders;
CREATE POLICY "Staff can update orders"
    ON public.orders FOR UPDATE
    USING (public.is_staff(auth.uid()));

-- ============================================================================
-- ORDER ITEMS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Customers can view own order items" ON public.order_items;
CREATE POLICY "Customers can view own order items"
    ON public.order_items FOR SELECT
    USING (
        order_id IN (SELECT id FROM public.orders WHERE customer_id = auth.uid())
    );

DROP POLICY IF EXISTS "Staff can view all order items" ON public.order_items;
CREATE POLICY "Staff can view all order items"
    ON public.order_items FOR SELECT
    USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
CREATE POLICY "Anyone can create order items"
    ON public.order_items FOR INSERT
    WITH CHECK (true);

-- ============================================================================
-- EXPENSES POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Directors can view expenses" ON public.expenses;
CREATE POLICY "Directors can view expenses"
    ON public.expenses FOR SELECT
    USING (public.is_director(auth.uid()));

DROP POLICY IF EXISTS "Directors can insert expenses" ON public.expenses;
CREATE POLICY "Directors can insert expenses"
    ON public.expenses FOR INSERT
    WITH CHECK (public.is_director(auth.uid()));

DROP POLICY IF EXISTS "Directors can update expenses" ON public.expenses;
CREATE POLICY "Directors can update expenses"
    ON public.expenses FOR UPDATE
    USING (public.is_director(auth.uid()));

DROP POLICY IF EXISTS "Directors can delete expenses" ON public.expenses;
CREATE POLICY "Directors can delete expenses"
    ON public.expenses FOR DELETE
    USING (public.is_director(auth.uid()));

-- ============================================================================
-- REVENUE LOGS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Directors can view revenue logs" ON public.revenue_logs;
CREATE POLICY "Directors can view revenue logs"
    ON public.revenue_logs FOR SELECT
    USING (public.is_director(auth.uid()));

DROP POLICY IF EXISTS "System can insert revenue logs" ON public.revenue_logs;
CREATE POLICY "System can insert revenue logs"
    ON public.revenue_logs FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Directors can update revenue logs" ON public.revenue_logs;
CREATE POLICY "Directors can update revenue logs"
    ON public.revenue_logs FOR UPDATE
    USING (public.is_director(auth.uid()));

-- ============================================================================
-- INVENTORY LOGS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Staff can view inventory logs" ON public.inventory_logs;
CREATE POLICY "Staff can view inventory logs"
    ON public.inventory_logs FOR SELECT
    USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Staff can insert inventory logs" ON public.inventory_logs;
CREATE POLICY "Staff can insert inventory logs"
    ON public.inventory_logs FOR INSERT
    WITH CHECK (public.is_staff(auth.uid()));

-- ============================================================================
-- 7. GRANTS (Service Role Permissions)
-- ============================================================================

GRANT ALL ON public.products TO service_role;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.order_items TO service_role;
GRANT ALL ON public.revenue_logs TO service_role;
GRANT ALL ON public.inventory_logs TO service_role;
