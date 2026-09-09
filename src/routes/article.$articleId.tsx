import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Headphones,
  Pause,
  Play,
  Share2,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { ArticleCard } from "@/components/app/ArticleCard";
import { SectionHeader } from "@/components/app/SectionHeader";
import { articles } from "@/lib/news-data";

export const Route = createFileRoute("/article/$articleId")({
  loader: ({ params }) => {
    const article = articles.find((a) => a.id === params.articleId);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.headline ?? "Story"} — NewsAI` },
      {
        name: "description",
        content:
          loaderData?.dek ??
          "Read the full story with an AI summary, timeline and multi-source coverage.",
      },
      {
        property: "og:title",
        content: `${loaderData?.headline ?? "Story"} — NewsAI`,
      },
      { property: "og:description", content: loaderData?.dek ?? "" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArticlePage,
});

const explainModes = [
  "Explain simply",
  "Explain like I'm 10",
  "Detailed analysis",
];
const languages = ["English", "Hindi", "Hinglish"];

function ArticlePage() {
  const article = Route.useLoaderData();
  const [summaryMode, setSummaryMode] = useState<"short" | "detailed">("short");
  const [explain, setExplain] = useState<string | null>(null);
  const [language, setLanguage] = useState("English");
  const [saved, setSaved] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState("1x");

  const bullets =
    summaryMode === "short" ? article.bullets.slice(0, 2) : article.bullets;
  const related = articles.filter((a) => a.id !== article.id).slice(0, 2);

  return (
    <AppShell>
      <div className="relative">
        <img
          src={article.image}
          alt={article.headline}
          width={1080}
          height={640}
          className="aspect-[16/10] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <Link
          to="/"
          className="btn-press absolute left-5 top-6 grid size-9 place-items-center rounded-full bg-background/70 ring-1 ring-border backdrop-blur"
        >
          <ArrowLeft className="size-4" />
        </Link>
      </div>

      <div className="-mt-8 px-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-accent">
          {article.category}
        </p>
        <h1 className="mt-2 text-3xl leading-[1.03] tracking-tight text-balance">
          {article.headline}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
          {article.dek}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span>{article.sources[0]}</span>
          <span>·</span>
          <span>{article.publishedAt}</span>
          <span>·</span>
          <span>{article.readingTime} read</span>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setSaved((v) => !v)}
            className={`btn-press flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium ring-1 ${
              saved
                ? "bg-accent/20 text-accent ring-accent/40"
                : "bg-secondary text-muted-foreground ring-border"
            }`}
          >
            <Bookmark className="size-3.5" /> {saved ? "Saved" : "Save"}
          </button>
          <button className="btn-press flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-medium text-muted-foreground ring-1 ring-border">
            <Share2 className="size-3.5" /> Share
          </button>
        </div>
      </div>

      {/* Audio */}
      <div className="mt-6 px-5">
        <div className="flex items-center gap-3 card-surface hover-lift rounded-3xl p-4 ring-1 ring-border">
          <button
            onClick={() => setPlaying((v) => !v)}
            className="btn-press grid size-11 shrink-0 place-items-center rounded-full gradient-brand"
            aria-label={playing ? "Pause article audio" : "Listen to article"}
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-xs font-medium">
              <Headphones className="size-3.5 text-accent" /> Listen to article
            </p>
            <div className="mt-2 h-1 rounded-full bg-secondary">
              <div
                className={`h-1 rounded-full bg-accent transition-all ${
                  playing ? "w-1/3" : "w-0"
                }`}
              />
            </div>
          </div>
          <div className="flex shrink-0 gap-1">
            {["1x", "1.5x", "2x"].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`rounded-full px-2 py-1 text-[10px] ring-1 ${
                  speed === s
                    ? "bg-primary ring-primary/50"
                    : "bg-secondary text-muted-foreground ring-border"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI summary */}
      <div className="mt-4 px-5">
        <div className="rounded-3xl gradient-briefing p-5 ring-1 ring-border">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.15em] text-accent">
              ⚡ Read in 30 seconds
            </p>
            <div className="flex gap-1">
              {(["short", "detailed"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setSummaryMode(m)}
                  className={`rounded-full px-2.5 py-1 text-[10px] capitalize ring-1 ${
                    summaryMode === m
                      ? "bg-foreground/20 ring-border"
                      : "bg-transparent text-foreground/60 ring-border"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-foreground/80">
            {bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Explain */}
      <div className="mt-4 px-5">
        <div className="card-surface hover-lift rounded-3xl p-5 ring-1 ring-border">
          <p className="text-sm font-semibold">🧠 Explain this news</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {explainModes.map((m) => (
              <button
                key={m}
                onClick={() => setExplain(m)}
                className={`btn-press rounded-full px-3 py-1.5 text-xs ring-1 ${
                  explain === m
                    ? "bg-primary ring-primary/50"
                    : "bg-secondary text-muted-foreground ring-border"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`rounded-full px-3 py-1 text-[11px] ring-1 ${
                  language === l
                    ? "bg-accent/20 text-accent ring-accent/40"
                    : "bg-secondary text-muted-foreground ring-border"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          {explain && (
            <p className="mt-3 rounded-2xl bg-secondary p-4 text-xs leading-relaxed text-muted-foreground">
              "{explain}" in {language} needs the AI service switched on. Once
              it's connected, the explanation appears here with the sources it
              was built from.
            </p>
          )}
        </div>
      </div>

      <SectionHeader title="Why this matters" />
      <div className="px-5 pt-4">
        <p className="card-surface hover-lift rounded-3xl p-5 text-sm leading-relaxed text-muted-foreground ring-1 ring-border">
          {article.whyItMatters}
        </p>
      </div>

      <SectionHeader title="📅 Story timeline" />
      <div className="px-5 pt-4">
        <ol className="space-y-4 border-l border-border pl-5">
          {article.timeline.map((t) => (
            <li key={t.time} className="relative">
              <span className="absolute -left-[26px] top-1.5 size-2 rounded-full bg-accent" />
              <p className="text-[11px] uppercase tracking-wide text-accent">
                {t.time}
              </p>
              <p className="text-sm">{t.event}</p>
            </li>
          ))}
        </ol>
      </div>

      <SectionHeader title="📰 Coverage from multiple sources" />
      <div className="space-y-2 px-5 pt-4">
        {article.coverage.map((c) => (
          <div key={c.source} className="card-surface hover-lift rounded-2xl p-4 ring-1 ring-border">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-secondary text-[11px] font-semibold text-accent">
                {c.source[0]}
              </span>
              <p className="text-sm font-medium">{c.source}</p>
              <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground ring-1 ring-border">
                {c.label}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{c.angle}</p>
          </div>
        ))}
      </div>

      <SectionHeader title="Related stories" />
      <div className="stagger-in space-y-4 px-5 pt-4">
        {related.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </AppShell>
  );
}
