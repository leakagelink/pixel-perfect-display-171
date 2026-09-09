DROP POLICY IF EXISTS "articles public read" ON public.articles;
CREATE POLICY "articles anon read" ON public.articles FOR SELECT TO anon USING (is_published);
CREATE POLICY "articles auth read" ON public.articles FOR SELECT TO authenticated USING (is_published OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "shorts public read" ON public.shorts;
CREATE POLICY "shorts anon read" ON public.shorts FOR SELECT TO anon USING (is_published);
CREATE POLICY "shorts auth read" ON public.shorts FOR SELECT TO authenticated USING (is_published OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "videos public read" ON public.videos;
CREATE POLICY "videos anon read" ON public.videos FOR SELECT TO anon USING (is_published);
CREATE POLICY "videos auth read" ON public.videos FOR SELECT TO authenticated USING (is_published OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "breaking public read" ON public.breaking_news;
CREATE POLICY "breaking anon read" ON public.breaking_news FOR SELECT TO anon USING (is_active);
CREATE POLICY "breaking auth read" ON public.breaking_news FOR SELECT TO authenticated USING (is_active OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "trending public read" ON public.trending_topics;
CREATE POLICY "trending anon read" ON public.trending_topics FOR SELECT TO anon USING (is_active);
CREATE POLICY "trending auth read" ON public.trending_topics FOR SELECT TO authenticated USING (is_active OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "notifications public read" ON public.notifications;
CREATE POLICY "notifications anon read" ON public.notifications FOR SELECT TO anon USING (true);
CREATE POLICY "notifications auth read" ON public.notifications FOR SELECT TO authenticated USING (true);

GRANT SELECT ON public.articles, public.shorts, public.videos, public.breaking_news, public.trending_topics, public.notifications TO anon;