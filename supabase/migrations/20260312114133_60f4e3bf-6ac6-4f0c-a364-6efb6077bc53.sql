
-- Enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'worker', 'viewer');

-- Enum for business sections
CREATE TYPE public.business_section AS ENUM ('gimnasia', 'clinica', 'peluqueria');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  section business_section,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sales table
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  section business_section NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 1,
  client_name TEXT DEFAULT '',
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Purchases table
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  section business_section NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 1,
  supplier TEXT DEFAULT '',
  purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Income table
CREATE TABLE public.income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  section business_section NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  source TEXT DEFAULT '',
  income_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.income ENABLE ROW LEVEL SECURITY;

-- Expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  section business_section NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  category TEXT DEFAULT '',
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Inventory table
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section business_section NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  quantity INTEGER NOT NULL DEFAULT 0,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Accounting entries (libro diario)
CREATE TABLE public.accounting_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  section business_section NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  account_name TEXT NOT NULL,
  description TEXT DEFAULT '',
  debit NUMERIC(12,2) NOT NULL DEFAULT 0,
  credit NUMERIC(12,2) NOT NULL DEFAULT 0,
  reference TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.accounting_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: users see own, admins see all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Admins can manage profiles" ON public.profiles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- User roles: only admins
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Sales: authenticated users can CRUD, admins see all
CREATE POLICY "Authenticated users can view sales" ON public.sales FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert sales" ON public.sales FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update sales" ON public.sales FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());
CREATE POLICY "Admins can delete sales" ON public.sales FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Purchases
CREATE POLICY "Authenticated users can view purchases" ON public.purchases FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert purchases" ON public.purchases FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update purchases" ON public.purchases FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());
CREATE POLICY "Admins can delete purchases" ON public.purchases FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Income
CREATE POLICY "Authenticated users can view income" ON public.income FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert income" ON public.income FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update income" ON public.income FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());
CREATE POLICY "Admins can delete income" ON public.income FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Expenses
CREATE POLICY "Authenticated users can view expenses" ON public.expenses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert expenses" ON public.expenses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update expenses" ON public.expenses FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());
CREATE POLICY "Admins can delete expenses" ON public.expenses FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Inventory
CREATE POLICY "Authenticated users can view inventory" ON public.inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert inventory" ON public.inventory FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update inventory" ON public.inventory FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete inventory" ON public.inventory FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Accounting entries
CREATE POLICY "Authenticated users can view entries" ON public.accounting_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert entries" ON public.accounting_entries FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update entries" ON public.accounting_entries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete entries" ON public.accounting_entries FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
