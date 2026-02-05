-- Trigger to notify Admin when Operations Manager edits inventory
-- Client Requirement: Admin must receive notification showing "moved from X to Y"

CREATE OR REPLACE FUNCTION notify_admin_on_inventory_edit()
RETURNS TRIGGER AS $$
DECLARE
    editor_role TEXT;
    editor_email TEXT;
    old_stock INTEGER;
    new_stock INTEGER;
    old_price DECIMAL;
    new_price DECIMAL;
    change_message TEXT;
BEGIN
    -- Get the role of the user making the change
    SELECT role, email INTO editor_role, editor_email
    FROM public.profiles
    WHERE id = auth.uid();

    -- Only trigger if Operations Manager made the edit
    IF editor_role = 'ops_manager' OR editor_role = 'manager' THEN
        -- Build detailed change message
        change_message := 'Operations Manager (' || editor_email || ') edited product: ' || NEW.name;

        -- Track stock changes
        IF OLD.stock != NEW.stock THEN
            change_message := change_message || ' | Stock changed from ' || OLD.stock || ' to ' || NEW.stock;
        END IF;

        -- Track selling price changes
        IF OLD.selling_price != NEW.selling_price THEN
            change_message := change_message || ' | Selling Price changed from ₦' || OLD.selling_price || ' to ₦' || NEW.selling_price;
        END IF;

        -- Track cost price changes
        IF OLD.cost_price != NEW.cost_price THEN
            change_message := change_message || ' | Cost Price changed from ₦' || OLD.cost_price || ' to ₦' || NEW.cost_price;
        END IF;

        -- Track status changes
        IF OLD.status != NEW.status THEN
            change_message := change_message || ' | Status changed from ' || OLD.status || ' to ' || NEW.status;
        END IF;

        -- Insert notification for Admin/Director
        INSERT INTO public.admin_notifications (
            recipient_role,
            message,
            related_entity_type,
            related_entity_id,
            triggered_by,
            metadata
        ) VALUES (
            'admin',
            change_message,
            'product',
            NEW.id,
            auth.uid(),
            jsonb_build_object(
                'product_id', NEW.id,
                'product_name', NEW.name,
                'editor_role', editor_role,
                'editor_email', editor_email,
                'changes', jsonb_build_object(
                    'stock', jsonb_build_object('old', OLD.stock, 'new', NEW.stock),
                    'selling_price', jsonb_build_object('old', OLD.selling_price, 'new', NEW.selling_price),
                    'cost_price', jsonb_build_object('old', OLD.cost_price, 'new', NEW.cost_price),
                    'status', jsonb_build_object('old', OLD.status, 'new', NEW.status)
                )
            )
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to products table
DROP TRIGGER IF EXISTS inventory_edit_notification_trigger ON public.products;
CREATE TRIGGER inventory_edit_notification_trigger
    AFTER UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION notify_admin_on_inventory_edit();

-- Also track order completions by Ops Manager
CREATE OR REPLACE FUNCTION notify_admin_on_order_edit()
RETURNS TRIGGER AS $$
DECLARE
    editor_role TEXT;
    editor_email TEXT;
    change_message TEXT;
BEGIN
    -- Get the role of the user making the change
    SELECT role, email INTO editor_role, editor_email
    FROM public.profiles
    WHERE id = auth.uid();

    -- Only trigger if Operations Manager changed order status
    IF (editor_role = 'ops_manager' OR editor_role = 'manager') AND OLD.status != NEW.status THEN
        change_message := 'Operations Manager (' || editor_email || ') changed Order #' || NEW.id || ' status from ' || OLD.status || ' to ' || NEW.status;

        INSERT INTO public.admin_notifications (
            recipient_role,
            message,
            related_entity_type,
            related_entity_id,
            triggered_by,
            metadata
        ) VALUES (
            'admin',
            change_message,
            'order',
            NEW.id,
            auth.uid(),
            jsonb_build_object(
                'order_id', NEW.id,
                'editor_role', editor_role,
                'editor_email', editor_email,
                'old_status', OLD.status,
                'new_status', NEW.status
            )
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to orders table
DROP TRIGGER IF EXISTS order_edit_notification_trigger ON public.orders;
CREATE TRIGGER order_edit_notification_trigger
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION notify_admin_on_order_edit();
