
-- Fix INSERT policies to not use WITH CHECK (true)
DROP POLICY "Authenticated users can insert sales" ON public.sales;
CREATE POLICY "Authenticated users can insert sales" ON public.sales FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY "Authenticated users can insert purchases" ON public.purchases;
CREATE POLICY "Authenticated users can insert purchases" ON public.purchases FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY "Authenticated users can insert income" ON public.income;
CREATE POLICY "Authenticated users can insert income" ON public.income FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY "Authenticated users can insert expenses" ON public.expenses;
CREATE POLICY "Authenticated users can insert expenses" ON public.expenses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY "Authenticated users can insert inventory" ON public.inventory;
CREATE POLICY "Admins and workers can insert inventory" ON public.inventory FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'worker'));

DROP POLICY "Authenticated users can insert entries" ON public.accounting_entries;
CREATE POLICY "Admins can insert entries" ON public.accounting_entries FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'worker'));
