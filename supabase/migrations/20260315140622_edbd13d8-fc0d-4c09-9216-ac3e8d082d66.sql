
-- Step 1: Add super_admin enum value and new columns
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dni text DEFAULT '';
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS email text DEFAULT '';
