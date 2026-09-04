-- Add image_url column to categories table if not exists
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
