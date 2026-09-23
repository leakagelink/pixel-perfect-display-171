ALTER TABLE public.articles
  ADD COLUMN headline_bn text,
  ADD COLUMN dek_bn text,
  ADD COLUMN category_bn text,
  ADD COLUMN bullets_bn text[],
  ADD COLUMN why_it_matters_bn text,
  ADD COLUMN timeline_bn jsonb,
  ADD COLUMN coverage_bn jsonb;

ALTER TABLE public.shorts
  ADD COLUMN headline_bn text,
  ADD COLUMN summary_bn text,
  ADD COLUMN category_bn text;

ALTER TABLE public.videos
  ADD COLUMN title_bn text,
  ADD COLUMN category_bn text,
  ADD COLUMN status_bn text;

ALTER TABLE public.breaking_news
  ADD COLUMN text_bn text;

ALTER TABLE public.trending_topics
  ADD COLUMN tag_bn text;

ALTER TABLE public.notifications
  ADD COLUMN title_bn text,
  ADD COLUMN body_bn text,
  ADD COLUMN kind_bn text;