import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import datacenter from "@/assets/news-datacenter.jpg";
import chips from "@/assets/news-chips.jpg";
import markets from "@/assets/news-markets.jpg";
import grid from "@/assets/news-grid.jpg";

const fallbacks = [datacenter, grid, chips, markets];

export function pickImage(url: string | null | undefined, index = 0): string {
  if (url && url.trim().length > 0) return url;
  return fallbacks[index % fallbacks.length]!;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export type FeedArticle = {
  id: string;
  category: string;
  headline: string;
  dek: string;
  image: string;
  sources: string[];
  publishedAt: string;
  readingTime: string;
  bullets: string[];
  whyItMatters: string;
  timeline: { time: string; event: string }[];
  coverage: { source: string; label: string; angle: string }[];
};

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];

function mapArticle(row: ArticleRow, i: number): FeedArticle {
  return {
    id: row.slug,
    category: row.category,
    headline: row.headline,
    dek: row.dek,
    image: pickImage(row.image_url, i),
    sources: row.sources?.length ? row.sources : ["NewsAI"],
    publishedAt: timeAgo(row.published_at),
    readingTime: row.reading_time,
    bullets: row.bullets ?? [],
    whyItMatters: row.why_it_matters,
    timeline: (row.timeline as FeedArticle["timeline"]) ?? [],
    coverage: (row.coverage as FeedArticle["coverage"]) ?? [],
  };
}

export const getHomeFeed = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const [articlesRes, breakingRes, trendingRes] = await Promise.all([
    sb
      .from("articles")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(30),
    sb
      .from("breaking_news")
      .select("text")
      .eq("is_active", true)
      .order("sort_order"),
    sb
      .from("trending_topics")
      .select("tag,count_label")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  return {
    articles: (articlesRes.data ?? []).map(mapArticle),
    breaking: (breakingRes.data ?? []).map((b) => b.text),
    trending: (trendingRes.data ?? []).map((t) => ({
      tag: t.tag,
      count: t.count_label,
    })),
  };
});

export const getArticleBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: row } = await sb
      .from("articles")
      .select("*")
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (!row) return { article: null, related: [] as FeedArticle[] };

    const { data: rest } = await sb
      .from("articles")
      .select("*")
      .eq("is_published", true)
      .neq("slug", data.slug)
      .order("published_at", { ascending: false })
      .limit(2);

    return {
      article: mapArticle(row, 0),
      related: (rest ?? []).map(mapArticle),
    };
  });

export const getShortsFeed = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data } = await sb
    .from("shorts")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  return (data ?? []).map((s, i) => ({
    id: s.id,
    headline: s.headline,
    summary: s.summary,
    category: s.category,
    source: s.source ?? "NewsAI",
    image: pickImage(s.image_url, i + 1),
    publishedAt: timeAgo(s.published_at),
  }));
});

export const getVideosFeed = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data } = await sb
    .from("videos")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  return (data ?? []).map((v, i) => ({
    id: v.id,
    title: v.title,
    category: v.category,
    duration: v.duration,
    source: v.source ?? "NewsAI",
    views: v.views,
    image: pickImage(v.image_url, i),
    aiBrief: v.ai_brief,
    status: v.status,
  }));
});

export const getNotificationsFeed = createServerFn({ method: "GET" }).handler(
  async () => {
    const sb = publicClient();
    const { data } = await sb
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);
    return (data ?? []).map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      kind: n.kind,
      createdAt: timeAgo(n.created_at),
    }));
  },
);
