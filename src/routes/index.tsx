import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { TopHeader } from "@/components/app/TopHeader";
import { BreakingTicker } from "@/components/app/BreakingTicker";
import { ArticleCard } from "@/components/app/ArticleCard";
import { SectionHeader } from "@/components/app/SectionHeader";
import { articles, categories, trending } from "@/lib/news-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NewsAI — News that matters to you" },
      {
        name: "description",
        content:
          "A personalized AI news feed: breaking headlines, 30-second summaries, multi-source coverage, shorts, and video briefings.",
      },
      { property: "og:title", content: "NewsAI — News that matters to you" },
      {
        property: "og:description",
        content:
          "Personalized feed, AI summaries, multi-source story clusters, shorts and video news.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [active, setActive] = useState("For You");

  return (
    <AppShell>
      <TopHeader />
      <BreakingTicker />

      <div className="sticky top-[60px] z-10 glass-bar stagger-in flex gap-2 overflow-x-auto px-5 py-3 no-scrollbar">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            aria-pressed={active === c}
            className={`btn-press shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium ring-1 ${
              active === c
                ? "bg-primary text-primary-foreground ring-primary/50 shadow-[0_6px_18px_-8px_var(--primary)]"
                : "bg-secondary text-muted-foreground ring-border hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>


      <div className="stagger-in px-5 pt-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-accent">
          Good morning, Theo
        </p>
        <h1 className="mt-1 max-w-[24ch] text-4xl leading-[0.95] tracking-tight text-balance">
          Your 7:42 briefing
        </h1>
        <p className="mt-2 max-w-[32ch] text-sm leading-relaxed text-muted-foreground text-pretty">
          Sourced from 214 outlets and distilled into 5 minutes of signal.
        </p>
      </div>

      <div className="fade-up relative mt-5 px-5">
        <div className="relative rounded-[28px] gradient-briefing p-6 ring-1 ring-border">
          <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-accent/40 blur-2xl" />
          <div className="relative flex items-center justify-between">
            <span className="chip-shine rounded-full bg-foreground/15 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] ring-1 ring-border">
              Daily Briefing
            </span>
            <span className="text-[11px] text-foreground/70">Tue · 6 min</span>
          </div>
          <div className="relative mt-4">
            <p className="text-[11px] uppercase tracking-[0.15em] text-accent">
              Top story
            </p>
            <h2 className="mt-1 text-2xl leading-tight text-balance">
              The compute land-grab
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70 text-pretty">
              Three hyperscalers are racing past 100 GW of AI capacity this year
              — and the grid can't keep up.
            </p>
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-background/25 px-4 py-3 ring-1 ring-border">
              <div className="font-display text-3xl leading-none text-accent">
                +7.2%
              </div>
              <p className="text-[10px] uppercase tracking-wide text-foreground/65">
                cluster demand
                <br />
                week over week
              </p>
            </div>
          </div>

          <Link
            to="/briefing"
            className="btn-press relative mt-5 block w-full overflow-hidden rounded-full bg-foreground py-3 text-center text-sm font-semibold text-background"
          >
            <span className="chip-shine absolute inset-0" />
            <span className="relative">Open briefing</span>
          </Link>
        </div>
      </div>

      <SectionHeader title="Recommended for you" meta="24 new" />
      <div className="space-y-4 px-5 pt-4">
        <ArticleCard article={articles[0]!} withImage />
        {articles.slice(1, 3).map((a, i) => (
          <ArticleCard key={a.id} article={a} index={i + 1} />
        ))}
      </div>


      <SectionHeader title="Trending" meta="live" />
      <div className="stagger-in mt-3 flex gap-3 overflow-x-auto px-5 pb-1 no-scrollbar">
        {trending.map((t, i) => (
          <Link
            key={t.tag}
            to="/search"
            className={`btn-press shrink-0 rounded-2xl px-4 py-3 ring-1 ${
              i === 1
                ? "bg-primary/25 ring-primary/30"
                : "bg-secondary ring-border"
            }`}
          >
            <p className="text-[11px] uppercase tracking-wide text-foreground/70">
              {t.tag}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{t.count}</p>
          </Link>
        ))}
      </div>

      <SectionHeader title="Ask NewsAI" />
      <div className="px-5 pt-3">
        <Link
          to="/ask"
          className="card-surface hover-lift group flex items-center justify-between rounded-3xl p-5 ring-1 ring-border"
        >
          <div>
            <p className="text-sm font-semibold">Ask about today's news</p>
            <p className="mt-1 text-xs text-muted-foreground">
              "Why is the grid under strain?"
            </p>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-full gradient-brand text-sm transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>


      <SectionHeader title="Latest" />
      <div className="space-y-4 px-5 pt-4">
        {articles.slice(3).map((a, i) => (
          <ArticleCard key={a.id} article={a} withImage index={i} />
        ))}
      </div>

    </AppShell>
  );
}
