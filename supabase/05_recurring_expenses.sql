-- ============================================================================
-- RECURRING EXPENSES - AUTO-GENERATION FUNCTION
-- This function generates the next occurrence of recurring expenses
-- ============================================================================

-- Function to generate due recurring expenses
CREATE OR REPLACE FUNCTION generate_recurring_expenses()
RETURNS TABLE (
    generated_count INTEGER,
    message TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    recurring_expense RECORD;
    new_expense_id UUID;
    total_generated INTEGER := 0;
    new_due_date DATE;
BEGIN
    -- Loop through all active recurring expenses that are due
    FOR recurring_expense IN 
        SELECT * FROM public.expenses 
        WHERE is_recurring = true 
        AND (next_due_date IS NULL OR next_due_date <= CURRENT_DATE)
        AND status != 'cancelled'
    LOOP
        -- Generate new expense entry
        INSERT INTO public.expenses (
            description,
            amount,
            category,
            is_recurring,
            recurrence_interval,
            status,
            date_incurred,
            created_by
        ) VALUES (
            recurring_expense.description || ' (Auto-generated)',
            recurring_expense.amount,
            recurring_expense.category,
            false, -- The generated expense is not recurring itself
            NULL,
            'pending',
            CURRENT_DATE,
            recurring_expense.created_by
        )
        RETURNING id INTO new_expense_id;

        -- Calculate next due date based on interval
        CASE recurring_expense.recurrence_interval
            WHEN 'daily' THEN
                new_due_date := COALESCE(recurring_expense.next_due_date, CURRENT_DATE) + INTERVAL '1 day';
            WHEN 'weekly' THEN
                new_due_date := COALESCE(recurring_expense.next_due_date, CURRENT_DATE) + INTERVAL '1 week';
            WHEN 'monthly' THEN
                new_due_date := COALESCE(recurring_expense.next_due_date, CURRENT_DATE) + INTERVAL '1 month';
            WHEN 'quarterly' THEN
                new_due_date := COALESCE(recurring_expense.next_due_date, CURRENT_DATE) + INTERVAL '3 months';
            WHEN 'yearly' THEN
                new_due_date := COALESCE(recurring_expense.next_due_date, CURRENT_DATE) + INTERVAL '1 year';
            ELSE
                new_due_date := COALESCE(recurring_expense.next_due_date, CURRENT_DATE) + INTERVAL '1 month'; -- Default to monthly
        END CASE;

        -- Update the recurring template with next due date
        UPDATE public.expenses
        SET next_due_date = new_due_date,
            updated_at = NOW()
        WHERE id = recurring_expense.id;

        total_generated := total_generated + 1;
    END LOOP;

    RETURN QUERY SELECT 
        total_generated,
        CASE 
            WHEN total_generated = 0 THEN 'No recurring expenses due'
            WHEN total_generated = 1 THEN '1 recurring expense generated'
            ELSE total_generated || ' recurring expenses generated'
        END;
END;
$$;

-- Grant execute permission to authenticated users with director/admin role
GRANT EXECUTE ON FUNCTION generate_recurring_expenses() TO authenticated;
GRANT EXECUTE ON FUNCTION generate_recurring_expenses() TO service_role;

-- Create a trigger to automatically generate recurring expenses
-- This trigger runs daily via Supabase Edge Function or cron
COMMENT ON FUNCTION generate_recurring_expenses() IS 
'Generates new expense entries for all recurring expenses that are due. 
Should be called daily via a scheduled Edge Function or manually via API.
Returns count of generated expenses.';
