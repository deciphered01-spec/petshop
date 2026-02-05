-- ============================================================================
-- BAYCARL ENTERPRISE FEATURES - PHASE 1 START
-- Step 1: Update User Roles Enum
-- ============================================================================

-- Postgres requires Enum updates to be committed before being used in the same transaction.
-- Run this script FIRST.

ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'sales_rep';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'inventory_manager';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'ops_manager';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'auditor';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'admin'; 
