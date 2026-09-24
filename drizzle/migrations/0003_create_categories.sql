CREATE TABLE public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  name_bn text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories admin write" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "categories anon read" ON public.categories FOR SELECT TO anon USING (is_active);
CREATE POLICY "categories auth read" ON public.categories FOR SELECT TO authenticated USING (is_active OR public.has_role(auth.uid(), 'admin'));