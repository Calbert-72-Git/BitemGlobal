
-- Step 2: Functions, tables, and policy updates

-- Helper function for admin checks (admin OR super_admin)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'super_admin')
  )
$$;

-- Create audit_log table
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  user_name text NOT NULL DEFAULT '',
  user_role text NOT NULL DEFAULT '',
  action text NOT NULL,
  module text NOT NULL,
  record_id text,
  details jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view audit" ON public.audit_log FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Auth insert audit" ON public.audit_log FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL,
  section public.business_section NOT NULL,
  client_name text DEFAULT '',
  client_phone text DEFAULT '',
  client_address text DEFAULT '',
  items jsonb NOT NULL DEFAULT '[]',
  subtotal numeric NOT NULL DEFAULT 0,
  tax_rate numeric NOT NULL DEFAULT 0,
  tax_amount numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  notes text DEFAULT '',
  created_by uuid,
  created_by_name text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View invoices" ON public.invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert invoices" ON public.invoices FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()) OR has_role(auth.uid(), 'worker'));
CREATE POLICY "Delete invoices" ON public.invoices FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Update RLS policies to include super_admin via is_admin()
DROP POLICY IF EXISTS "Admins can delete sales" ON public.sales;
CREATE POLICY "Admins can delete sales" ON public.sales FOR DELETE TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins can update sales" ON public.sales;
CREATE POLICY "Admins can update sales" ON public.sales FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete purchases" ON public.purchases;
CREATE POLICY "Admins can delete purchases" ON public.purchases FOR DELETE TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins can update purchases" ON public.purchases;
CREATE POLICY "Admins can update purchases" ON public.purchases FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete income" ON public.income;
CREATE POLICY "Admins can delete income" ON public.income FOR DELETE TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins can update income" ON public.income;
CREATE POLICY "Admins can update income" ON public.income FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete expenses" ON public.expenses;
CREATE POLICY "Admins can delete expenses" ON public.expenses FOR DELETE TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins can update expenses" ON public.expenses;
CREATE POLICY "Admins can update expenses" ON public.expenses FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete inventory" ON public.inventory;
CREATE POLICY "Admins can delete inventory" ON public.inventory FOR DELETE TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins can update inventory" ON public.inventory;
CREATE POLICY "Admins can update inventory" ON public.inventory FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins and workers can insert inventory" ON public.inventory;
CREATE POLICY "Admins and workers can insert inventory" ON public.inventory FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()) OR has_role(auth.uid(), 'worker'));

DROP POLICY IF EXISTS "Admins can delete entries" ON public.accounting_entries;
CREATE POLICY "Admins can delete entries" ON public.accounting_entries FOR DELETE TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins can update entries" ON public.accounting_entries;
CREATE POLICY "Admins can update entries" ON public.accounting_entries FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins can insert entries" ON public.accounting_entries;
CREATE POLICY "Admins can insert entries" ON public.accounting_entries FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()) OR has_role(auth.uid(), 'worker'));

DROP POLICY IF EXISTS "Admins can delete employees" ON public.employees;
CREATE POLICY "Admins can delete employees" ON public.employees FOR DELETE TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins can update employees" ON public.employees;
CREATE POLICY "Admins can update employees" ON public.employees FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins can insert employees" ON public.employees;
CREATE POLICY "Admins can insert employees" ON public.employees FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete payroll" ON public.payroll;
CREATE POLICY "Admins can delete payroll" ON public.payroll FOR DELETE TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins can update payroll" ON public.payroll;
CREATE POLICY "Admins can update payroll" ON public.payroll FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins can insert payroll" ON public.payroll;
CREATE POLICY "Admins can insert payroll" ON public.payroll FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;
CREATE POLICY "Admins can manage profiles" ON public.profiles FOR ALL TO authenticated USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (is_admin(auth.uid()));
