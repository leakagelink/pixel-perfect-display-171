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
import { getArticleBySlug } from "@/lib/content.functions";
import { localizeArticle, useLanguage } from "@/lib/language";

export const Route = createFileRoute("/article/$articleId")({
  loader: async ({ params }) => {
    const result = await getArticleBySlug({ data: { slug: params.articleId } });
    if (!result.article) throw notFound();
    return result;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.article?.bn?.headline ?? loaderData?.article?.headline ?? "খবর"} — 7AWAKE NEWS NETWORK DIGITAL` },
      {
        name: "description",
        content:
          loaderData?.article?.bn?.dek ?? loaderData?.article?.dek ??
          "এআই সারাংশ, সময়রেখা ও একাধিক সূত্রসহ পূর্ণ খবর পড়ুন।",
      },
      {
        property: "og:title",
        content: `${loaderData?.article?.bn?.headline ?? loaderData?.article?.headline ?? "খবর"} — 7AWAKE NEWS NETWORK DIGITAL`,
      },
      { property: "og:description", content: loaderData?.article?.bn?.dek ?? loaderData?.article?.dek ?? "" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  const data = Route.useLoaderData();
  const sourceArticle = data.article;
  const { language, t } = useLanguage();
  if (!sourceArticle) return null;
  const article = localizeArticle(sourceArticle, language);
  const related = data.related;
  const explainModes = [t("explainSimply"), t("explainChild"), t("detailedAnalysis")];
  const [summaryMode, setSummaryMode] = useState<"short" | "detailed">("short");
  const [explain, setExplain] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState("1x");

  const bullets =
    summaryMode === "short" ? article.bullets.slice(0, 2) : article.bullets;


  return (
    <AppShell>
      <div className="relative">
        <img
          src={article.image}
          alt={article.headline}
          width={1080}
          height={640}
          className="aspect-[16/10] w-full object-cover"
          decoding="async"
          fetchPriority="high"
        />
         <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        <Link
          to="/"
          className="btn-press absolute left-5 top-6 grid size-9 place-items-center rounded-full bg-background/70 ring-1 ring-border backdrop-blur"
        >
          <ArrowLeft className="size-4" />
        </Link>
      </div>

       <div className="relative -mt-7 bg-background px-5 pt-5">
         <p className="text-[11px] font-semibold uppercase text-primary">
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
           <span>{article.readingTime} {t("reading")}</span>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setSaved((v) => !v)}
            className={`btn-press flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium ring-1 ${
              saved
                 ? "bg-ink text-primary-foreground ring-ink"
                : "bg-secondary text-muted-foreground ring-border"
            }`}
          >
            <Bookmark className="size-3.5" /> {saved ? t("saved") : t("save")}
          </button>
          <button className="btn-press flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-medium text-muted-foreground ring-1 ring-border">
            <Share2 className="size-3.5" /> {t("share")}
          </button>
        </div>
      </div>

      {/* Audio */}
      <div className="mt-6 px-5">
         <div className="flex items-center gap-3 border-y border-border py-4">
          <button
            onClick={() => setPlaying((v) => !v)}
             className="btn-press grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
            aria-label={playing ? t("pause") : t("listen")}
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-xs font-medium">
               <Headphones className="size-3.5 text-primary" /> {t("listen")}
            </p>
            <div className="mt-2 h-1 rounded-full bg-secondary">
              <div
                className={`h-1 rounded-full bg-accent transition-all ${
                   playing ? "w-1/3 bg-primary" : "w-0 bg-primary"
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
         <div className="border-l-4 border-primary bg-primary/5 p-5">
          <div className="flex items-center justify-between">
             <p className="text-[11px] font-semibold uppercase text-primary">
               {t("thirtySeconds")}
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
                   {m === "short" ? t("short") : t("detailed")}
                </button>
              ))}
            </div>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-foreground/80">
            {bullets.map((b) => (
              <li key={b} className="flex gap-2">
                 <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Explain */}
      <div className="mt-4 px-5">
         <div className="border-y border-border py-5">
           <p className="text-sm font-semibold">{t("explain")}</p>
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
          {explain && (
            <p className="mt-3 rounded-2xl bg-secondary p-4 text-xs leading-relaxed text-muted-foreground">
              {language === "bn"
                ? `“${explain}” উত্তরটি এখনো লাইভ সংবাদসেবার সঙ্গে যুক্ত নয়। সংযোগ হলে সূত্রসহ ব্যাখ্যা এখানে দেখা যাবে।`
                : `“${explain}” needs the AI service switched on. Once connected, the sourced explanation will appear here.`}
            </p>
          )}
        </div>
      </div>

      <SectionHeader title={t("whyMatters")} />
      <div className="px-5 pt-4">
         <p className="border-l-2 border-primary py-2 pl-4 text-sm leading-relaxed text-muted-foreground">
          {article.whyItMatters}
        </p>
      </div>

      <SectionHeader title={t("timeline")} />
      <div className="px-5 pt-4">
        <ol className="space-y-4 border-l border-border pl-5">
          {article.timeline.map((t) => (
            <li key={t.time} className="relative">
               <span className="absolute -left-[26px] top-1.5 size-2 rounded-full bg-primary" />
               <p className="text-[11px] font-semibold uppercase text-primary">
                {t.time}
              </p>
              <p className="text-sm">{t.event}</p>
            </li>
          ))}
        </ol>
      </div>

      <SectionHeader title={t("coverage")} />
      <div className="space-y-2 px-5 pt-4">
        {article.coverage.map((c) => (
           <div key={c.source} className="border-b border-border py-4">
            <div className="flex items-center gap-2">
               <span className="grid size-7 place-items-center bg-primary/10 text-[11px] font-semibold text-primary">
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

      <SectionHeader title={t("related")} />
       <div className="stagger-in px-5 pt-2">
        {related.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </AppShell>
  );
}
