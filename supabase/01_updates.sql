-- Add new columns for UI requirements
-- Safe idempotent updates

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images TEXT[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS rating DECIMAL(3, 2) DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS reviews INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
