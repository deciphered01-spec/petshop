-- ============================================================================
-- BAYCARL ENTERPRISE FEATURES - SCHEMA EXTENSION
-- Phase 1: Roles, Batches, Notifications, and Rules
-- ============================================================================

-- 1. UPDATE USER ROLES
-- Moved to enterprise_roles.sql to avoid Transaction Error 55P04
-- Please run enterprise_roles.sql BEFORE this file.

-- 2. PRODUCTS UPDATE (PACKS vs SINGLES)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_pack BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pack_size INTEGER DEFAULT 1, -- items per pack
ADD COLUMN IF NOT EXISTS unit_type TEXT DEFAULT 'pcs'; -- e.g., 'carton', 'bottle'

-- 3. RESTOCK BATCHES (For Per-Restock Analytics)
-- Linked to products, tracks the cost/value of specific incoming stock
CREATE TABLE IF NOT EXISTS public.restock_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_number TEXT UNIQUE, -- e.g., BATCH-20241001-001
    product_id UUID NOT NULL REFERENCES public.products(id),
    supplier TEXT,
    quantity_received INTEGER NOT NULL CHECK (quantity_received > 0),
    remaining_quantity INTEGER NOT NULL CHECK (remaining_quantity >= 0),
    cost_price_per_unit DECIMAL(10, 2) NOT NULL,
    selling_price_at_stocking DECIMAL(10, 2) NOT NULL,
    
    -- Analytics Helpers (Computed or Stored)
    total_cost DECIMAL(10, 2) GENERATED ALWAYS AS (quantity_received * cost_price_per_unit) STORED,
    potential_revenue DECIMAL(10, 2) GENERATED ALWAYS AS (quantity_received * selling_price_at_stocking) STORED,
    potential_profit DECIMAL(10, 2) GENERATED ALWAYS AS ((quantity_received * selling_price_at_stocking) - (quantity_received * cost_price_per_unit)) STORED,
    
    received_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE,
    
    status TEXT DEFAULT 'active', -- active, depleted, expired
    
    added_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ADMIN NOTIFICATIONS
-- For alerting Admin when Ops Manager makes edits
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_role public.user_role NOT NULL DEFAULT 'director', -- usually director/admin
    message TEXT NOT NULL,
    related_entity_type TEXT, -- 'product', 'inventory', 'order'
    related_entity_id UUID,
    triggered_by UUID REFERENCES public.profiles(id),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. FUNCTION & TRIGGER: NOTIFY ADMIN ON OPS MANAGER EDIT
CREATE OR REPLACE FUNCTION public.notify_admin_on_ops_edit()
RETURNS TRIGGER AS $$
DECLARE
    editor_role public.user_role;
    product_name TEXT;
BEGIN
    -- Get the role of the user performing the update
    SELECT role INTO editor_role FROM public.profiles WHERE id = auth.uid();
    
    -- Only trigger if it's an Operations Manager
    IF editor_role = 'ops_manager' THEN
        
        -- Fetch product name for clearer message
        SELECT name INTO product_name FROM public.products WHERE id = NEW.id;

        -- Check what changed
        IF OLD.stock_quantity <> NEW.stock_quantity THEN
            INSERT INTO public.admin_notifications (recipient_role, message, related_entity_type, related_entity_id, triggered_by)
            VALUES (
                'director',
                'Operations Manager modified stock for ' || product_name || '. From: ' || OLD.stock_quantity || ' To: ' || NEW.stock_quantity,
                'product',
                NEW.id,
                auth.uid()
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Limit trigger creation to avoid duplicates
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'notify_admin_on_stock_change') THEN
        CREATE TRIGGER notify_admin_on_stock_change
            AFTER UPDATE ON public.products
            FOR EACH ROW
            EXECUTE FUNCTION public.notify_admin_on_ops_edit();
    END IF;
END$$;


-- 6. INDEXES
CREATE INDEX IF NOT EXISTS idx_restock_product_id ON public.restock_batches(product_id);
CREATE INDEX IF NOT EXISTS idx_restock_batch_number ON public.restock_batches(batch_number);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.admin_notifications(recipient_role, is_read);


-- 7. SECURITY & PERMISSIONS (RLS)
ALTER TABLE public.restock_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- ======== RESTOCK BATCHES POLICIES ========

-- Inventory Manager: INSERT ONLY (Cannot Update/Delete)
CREATE POLICY "Inventory Manager can add batches"
    ON public.restock_batches FOR INSERT
    WITH CHECK (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'inventory_manager' OR
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('director', 'ops_manager', 'admin')
    );

-- Ops Manager & Admin: FULL ACCESS
CREATE POLICY "Ops & Admin full access batches"
    ON public.restock_batches FOR ALL
    USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('director', 'ops_manager', 'admin')
    );

-- Auditor: VIEW ONLY
CREATE POLICY "Auditor view batches"
    ON public.restock_batches FOR SELECT
    USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'auditor'
    );

-- ======== NOTIFICATIONS POLICIES ========

-- Admins/Directors can view their notifications
CREATE POLICY "Admin view notifications"
    ON public.admin_notifications FOR SELECT
    USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('director', 'admin')
    );

-- System/Triggers insert notifications (covered by service role usually, but enabling authenticated insert for custom logic)
CREATE POLICY "Authenticated users can insert notifications"
    ON public.admin_notifications FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);


-- ======== GRANT PERMISSIONS ========
GRANT ALL ON public.restock_batches TO service_role;
GRANT ALL ON public.admin_notifications TO service_role;

-- ============================================================================
-- PHASE 3: EXPENSE MANAGEMENT & AI SCANS
-- ============================================================================

-- 8. EXPENSES TABLE
-- Tracks all business expenses including recurring salaries
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category TEXT NOT NULL, -- 'payroll', 'utility', 'inventory', 'other'
    
    -- Recurring Logic
    is_recurring BOOLEAN DEFAULT false,
    recurrence_interval TEXT, -- 'weekly', 'monthly', 'yearly'
    next_due_date DATE,
    
    status TEXT DEFAULT 'pending', -- 'paid', 'pending', 'overdue'
    date_incurred DATE NOT NULL DEFAULT CURRENT_DATE,
    
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. RECEIPT SCANS (AI INTEGRATION)
-- Stores metadata from AI-processed receipts
CREATE TABLE IF NOT EXISTS public.receipt_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_url TEXT NOT NULL,
    file_type TEXT, -- 'image/jpeg', 'application/pdf', 'text/plain', etc.
    
    -- AI Extraction Results
    extracted_data JSONB, -- Stores { amount, date, vendor, items: [] }
    confidence_score DECIMAL(3, 2),
    
    status TEXT DEFAULT 'processing', -- 'processing', 'completed', 'failed', 'needs_review'
    
    -- Link to actual expense record if approved
    expense_id UUID REFERENCES public.expenses(id),
    
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. INDEXES FOR EXPENSES
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(date_incurred);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON public.expenses(status);

-- 11. SECURITY & PERMISSIONS (RLS) FOR EXPENSES
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipt_scans ENABLE ROW LEVEL SECURITY;

-- Director/Admin: FULL ACCESS
CREATE POLICY "Director full access expenses"
    ON public.expenses FOR ALL
    USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('director', 'admin')
    );

CREATE POLICY "Director full access receipts"
    ON public.receipt_scans FOR ALL
    USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('director', 'admin')
    );

-- Auditor: VIEW ONLY
CREATE POLICY "Auditor view expenses"
    ON public.expenses FOR SELECT
    USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'auditor'
    );

-- Grant Service Role
GRANT ALL ON public.expenses TO service_role;
GRANT ALL ON public.receipt_scans TO service_role;
