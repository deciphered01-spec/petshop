-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert the Baycarl admin user
-- Email: admin@baycarl.com
-- Password: Admin20.26
-- Role: admin

DO $$
BEGIN
    -- Check if user already exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@baycarl.com') THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'admin@baycarl.com',
            crypt('Admin20.26', gen_salt('bf')),
            NOW(),
            NULL,
            NULL,
            '{"provider":"email","providers":["email"]}',
            '{"role":"admin","full_name":"Baycarl Admin"}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        );
        RAISE NOTICE 'Admin user created successfully';
    ELSE
        RAISE NOTICE 'Admin user already exists';
    END IF;
END $$;

-- Verify the user was created
SELECT 
    id, 
    email, 
    raw_user_meta_data->>'role' as role,
    raw_user_meta_data->>'full_name' as full_name,
    created_at
FROM auth.users 
WHERE email = 'admin@baycarl.com';
