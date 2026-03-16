
-- Add payment/discount columns to invoices
ALTER TABLE public.invoices 
  ADD COLUMN IF NOT EXISTS discount_percent numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_amount numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'efectivo',
  ADD COLUMN IF NOT EXISTS amount_paid numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS amount_pending numeric NOT NULL DEFAULT 0;

-- Add user_id to inventory for tracking who manages it
ALTER TABLE public.inventory 
  ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT NULL;
