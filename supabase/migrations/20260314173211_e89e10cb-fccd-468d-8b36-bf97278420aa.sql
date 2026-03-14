
-- 1. Add allowed_sections and allowed_pages to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS allowed_sections text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS allowed_pages text[] DEFAULT '{}';

-- 2. Create employees table for payroll
CREATE TABLE IF NOT EXISTS public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  dni text DEFAULT '',
  phone text DEFAULT '',
  address text DEFAULT '',
  bank_name text DEFAULT '',
  bank_account text DEFAULT '',
  section public.business_section NOT NULL,
  position text DEFAULT '',
  base_salary numeric NOT NULL DEFAULT 0,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view employees" ON public.employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert employees" ON public.employees FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update employees" ON public.employees FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete employees" ON public.employees FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 3. Create payroll table
CREATE TABLE IF NOT EXISTS public.payroll (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  section public.business_section NOT NULL,
  month integer NOT NULL,
  year integer NOT NULL,
  base_salary numeric NOT NULL DEFAULT 0,
  bonuses numeric NOT NULL DEFAULT 0,
  deductions numeric NOT NULL DEFAULT 0,
  net_salary numeric NOT NULL DEFAULT 0,
  notes text DEFAULT '',
  paid boolean NOT NULL DEFAULT false,
  paid_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(employee_id, month, year)
);

ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view payroll" ON public.payroll FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert payroll" ON public.payroll FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update payroll" ON public.payroll FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete payroll" ON public.payroll FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 4. Trigger to auto-assign viewer role on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();
