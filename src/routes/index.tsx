import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, Clock, Play } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { TopHeader } from "@/components/app/TopHeader";
import { BreakingTicker } from "@/components/app/BreakingTicker";
import { ArticleCard } from "@/components/app/ArticleCard";
import { SectionHeader } from "@/components/app/SectionHeader";
import { categories } from "@/lib/news-data";
import { getHomeFeed } from "@/lib/content.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "7 Awake News — News that matters to you" },
      {
        name: "description",
        content:
          "A personalized AI news feed: breaking headlines, 30-second summaries, multi-source coverage, shorts, and video briefings.",
      },
      { property: "og:title", content: "7 Awake News — News that matters to you" },
      {
        property: "og:description",
        content:
          "Personalized feed, AI summaries, multi-source story clusters, shorts and video news.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getHomeFeed(),
  component: Index,
});

function Index() {
  const { articles: allArticles, breaking, trending } = Route.useLoaderData();
  const [active, setActive] = useState("For You");
  const articles =
    active === "For You" || active === "Latest"
      ? allArticles
      : allArticles.filter(
          (a) => a.category.toLowerCase() === active.toLowerCase(),
        );


  return (
    <AppShell>
      <TopHeader />
      <div className="sticky top-[60px] z-10 glass-bar stagger-in flex gap-2 overflow-x-auto border-b border-border px-5 py-3 no-scrollbar">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            aria-pressed={active === c}
            className={`btn-press shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold ring-1 ${
              active === c
                ? "bg-primary text-primary-foreground ring-primary"
                : "bg-secondary text-muted-foreground ring-border hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <BreakingTicker headlines={breaking} />

      {articles[0] && (
        <Link
          to="/article/$articleId"
          params={{ articleId: articles[0].id }}
          className="group fade-up relative mx-5 mt-5 block aspect-[16/10] overflow-hidden rounded-2xl bg-ink shadow-[0_18px_45px_-24px_color-mix(in_oklab,var(--ink)_70%,transparent)]"
        >
          <img
            src={articles[0].image}
            alt={articles[0].headline}
            fetchPriority="high"
            decoding="async"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 bg-primary px-2.5 py-1 text-[9px] font-bold uppercase text-primary-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-primary-foreground" /> Live update
          </span>
          <span className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-background/20 text-primary-foreground backdrop-blur-md ring-1 ring-background/40">
            <Play className="size-4 fill-current" />
          </span>
          <div className="absolute inset-x-4 bottom-4">
            <p className="text-[10px] font-semibold uppercase text-primary-foreground/70">{articles[0].category}</p>
            <h1 className="mt-1 text-xl leading-tight text-primary-foreground text-balance">{articles[0].headline}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-[10px] text-primary-foreground/65">
              <Clock className="size-3" /> {articles[0].publishedAt} · {articles[0].readingTime} read
            </p>
          </div>
        </Link>
      )}

      <div className="mt-5 flex items-center gap-1.5 px-5" aria-hidden="true">
        <span className="h-1 w-6 rounded-full bg-primary" />
        <span className="size-1 rounded-full bg-border" />
        <span className="size-1 rounded-full bg-border" />
      </div>

      <SectionHeader title="Featured" meta="View all" />
      <div className="stagger-in mt-4 flex gap-3 overflow-x-auto px-5 pb-2 no-scrollbar">
        {articles.slice(1, 4).map((article) => (
          <Link key={article.id} to="/article/$articleId" params={{ articleId: article.id }} className="group w-40 shrink-0">
            <img src={article.image} alt={article.headline} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
            <p className="mt-2 text-[9px] font-semibold uppercase text-primary">{article.category}</p>
            <h2 className="mt-1 line-clamp-2 text-sm font-bold leading-snug">{article.headline}</h2>
          </Link>
        ))}
      </div>

      <div className="mt-6 border-y border-border bg-secondary/50 px-5 py-4">
        <Link to="/briefing" className="btn-press flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase text-primary">Daily briefing · 6 min</p>
            <h2 className="mt-0.5 text-base">The essential stories, distilled</h2>
          </div>
          <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">→</span>
        </Link>
      </div>

      <SectionHeader title="Latest stories" meta={`${articles.length}`} />
      <div className="stagger-in px-5 pt-1">
        {articles.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No stories in this category yet.
          </p>
        )}
        {articles.slice(4).map((a, i) => (
          <ArticleCard key={a.id} article={a} index={i} />
        ))}
      </div>


      <SectionHeader title="Trending now" meta="Live" />
      <div className="stagger-in mt-3 flex gap-3 overflow-x-auto px-5 pb-1 no-scrollbar">
        {trending.map((t, i) => (
          <Link
            key={t.tag}
            to="/search"
            className={`btn-press shrink-0 border-l-2 px-4 py-2.5 ${
              i === 1
                ? "border-primary bg-primary/5"
                : "border-border bg-secondary/60"
            }`}
          >
            <p className="text-[11px] uppercase tracking-wide text-foreground/70">
              {t.tag}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{t.count}</p>
          </Link>
        ))}
      </div>

      <SectionHeader title="Ask 7 Awake" />
      <div className="px-5 pt-3">
        <Link
          to="/ask"
          className="group flex items-center justify-between border-y border-border py-5"
        >
          <div>
            <p className="text-sm font-semibold">Ask about today's news</p>
            <p className="mt-1 text-xs text-muted-foreground">
              "Why is the grid under strain?"
            </p>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-sm text-primary-foreground transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </AppShell>
  );
}
