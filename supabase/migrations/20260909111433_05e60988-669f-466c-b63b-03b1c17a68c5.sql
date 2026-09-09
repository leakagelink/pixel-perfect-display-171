CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "roles read own or admin" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;

  IF lower(NEW.email) = 'hello@socilet.in' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'Latest',
  headline text NOT NULL,
  dek text NOT NULL DEFAULT '',
  image_url text,
  sources text[] NOT NULL DEFAULT '{}',
  reading_time text NOT NULL DEFAULT '3 min',
  bullets text[] NOT NULL DEFAULT '{}',
  why_it_matters text NOT NULL DEFAULT '',
  timeline jsonb NOT NULL DEFAULT '[]'::jsonb,
  coverage jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_published boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "articles public read" ON public.articles FOR SELECT USING (is_published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "articles admin write" ON public.articles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER articles_touch BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.shorts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  headline text NOT NULL,
  summary text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Latest',
  image_url text,
  source text,
  is_published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.shorts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shorts TO authenticated;
GRANT ALL ON public.shorts TO service_role;
ALTER TABLE public.shorts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shorts public read" ON public.shorts FOR SELECT USING (is_published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "shorts admin write" ON public.shorts FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER shorts_touch BEFORE UPDATE ON public.shorts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Latest',
  duration text NOT NULL DEFAULT '0:00',
  source text,
  views text NOT NULL DEFAULT '0',
  image_url text,
  video_url text,
  ai_brief boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'Ready',
  is_published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.videos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.videos TO authenticated;
GRANT ALL ON public.videos TO service_role;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "videos public read" ON public.videos FOR SELECT USING (is_published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "videos admin write" ON public.videos FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER videos_touch BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.breaking_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.breaking_news TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.breaking_news TO authenticated;
GRANT ALL ON public.breaking_news TO service_role;
ALTER TABLE public.breaking_news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "breaking public read" ON public.breaking_news FOR SELECT USING (is_active OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "breaking admin write" ON public.breaking_news FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.trending_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text NOT NULL,
  count_label text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.trending_topics TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trending_topics TO authenticated;
GRANT ALL ON public.trending_topics TO service_role;
ALTER TABLE public.trending_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "trending public read" ON public.trending_topics FOR SELECT USING (is_active OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "trending admin write" ON public.trending_topics FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  kind text NOT NULL DEFAULT 'Update',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notifications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications public read" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "notifications admin write" ON public.notifications FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.articles (slug, category, headline, dek, sources, reading_time, bullets, why_it_matters, timeline, coverage, is_featured) VALUES
('valerion-margin','Markets','Valerion posts record margin as inference costs fall','The chipmaker''s cheapest quarter of compute yet turned into its most profitable one.',ARRAY['Valerion Wire','Signal Desk','TechWire'],'4 min',ARRAY['AI inference unit cost down 38% quarter-over-quarter','Guidance raised after enterprise adoption beat by 12%','Operating margin reached an all-time high of 41%','Management flagged supply strain into next quarter'],'Cheaper inference resets the economics of every product built on large models.','[{"time":"10:00","event":"Earnings released ahead of the bell"},{"time":"11:30","event":"Management raises full-year guidance"},{"time":"13:00","event":"Shares climb 7% in heavy volume"}]','[{"source":"Valerion Wire","label":"Official Source","angle":"Company statement on record quarter"},{"source":"Signal Desk","label":"Analysis","angle":"What falling inference cost means for rivals"}]',true),
('helios-cooling','Energy','Helios cuts datacenter draw to 41 GWh with liquid cooling','A new closed-loop system claims the largest efficiency jump the operator has shipped.',ARRAY['Helios Grid','Northwind Post'],'5 min',ARRAY['New loop claims 61% lower PUE at scale','Rollout begins across three West Coast sites by Q3','Water usage falls by an estimated 30%'],'Efficiency at this scale buys regulators time before new generation comes online.','[{"time":"08:15","event":"Helios publishes efficiency report"},{"time":"12:40","event":"Regulators confirm pilot approval"}]','[{"source":"Helios Grid","label":"Official Source","angle":"Technical report on the cooling loop"}]',false),
('compute-land-grab','AI','The compute land-grab: three hyperscalers pass 100 GW','Capacity plans now outpace what regional grids expect to deliver this decade.',ARRAY['Signal Desk','Meridian Wire'],'6 min',ARRAY['Combined 2026 capacity plans exceed 100 GW','Cluster demand up 7.2% month-over-month','Two regional grids have paused new interconnect requests'],'Where compute gets built decides which regions capture the jobs and the tax base.','[{"time":"07:00","event":"Capacity filings surface"},{"time":"09:45","event":"Grid operator pauses interconnects"}]','[{"source":"Signal Desk","label":"Analysis","angle":"Reading the capacity filings"}]',false),
('markets-open','Business','Northwind merger clears review, reshaping regional logistics','Conditions attached to the deal require divestment of two freight hubs.',ARRAY['Meridian Wire','The Ledger'],'3 min',ARRAY['Approval carries two mandatory hub divestments','Combined network covers 41 metro areas','Closing expected before the end of the quarter'],'Consolidation in regional freight tends to show up in shipping rates within two quarters.','[{"time":"09:00","event":"Decision published"},{"time":"10:30","event":"Companies confirm divestments"}]','[{"source":"Meridian Wire","label":"Official Source","angle":"Full text of the decision"}]',false);

INSERT INTO public.shorts (headline, summary, category, source, sort_order) VALUES
('Valerion posts record margin as inference costs fall','AI inference unit cost down 38% quarter-over-quarter. Guidance raised after enterprise adoption beat by 12%.','Markets','Valerion Wire',1),
('Helios cuts datacenter draw to 41 GWh','New loop claims 61% lower PUE at scale. Rollout begins across three West Coast sites by Q3.','Energy','Helios Grid',2),
('The compute land-grab: three hyperscalers pass 100 GW','Combined 2026 capacity plans exceed 100 GW. Cluster demand up 7.2% month-over-month.','AI','Signal Desk',3),
('Northwind merger clears regulatory review','Approval carries two mandatory hub divestments. Combined network covers 41 metro areas.','Business','Meridian Wire',4);

INSERT INTO public.videos (title, category, duration, source, views, ai_brief, status, sort_order) VALUES
('Inside the compute land-grab','AI','3:12','Signal Desk','128k',false,'Ready',1),
('How liquid cooling changed the numbers','Energy','2:04','Helios Grid','64k',true,'Ready',2),
('Markets in 90 seconds','Markets','1:30','The Ledger','212k',true,'Processing',3),
('The chip cycle, explained','Technology','4:48','TechWire','89k',false,'Ready',4);

INSERT INTO public.breaking_news (text, sort_order) VALUES
('Valerion hits $142 in late-session rally',1),
('Mira OS ships 3.1 to all devices',2),
('Helios datacenter cut to 41 GWh',3),
('Northwind merger clears regulatory review',4);

INSERT INTO public.trending_topics (tag, count_label, sort_order) VALUES
('AI Agents','8.4k',1),('Chips','6.1k',2),('Energy','4.9k',3),('Regulation','3.2k',4),('Bitcoin','2.8k',5);

INSERT INTO public.notifications (title, body, kind) VALUES
('Markets update','Valerion climbs 7% after record margin report.','Markets'),
('Breaking','Northwind merger clears regulatory review.','Breaking');