import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { getShortsFeed } from "@/lib/content.functions";

export const Route = createFileRoute("/shorts")({
  head: () => ({
    meta: [
      { title: "News Shorts — 7 Awake News" },
      {
        name: "description",
        content:
          "One story per screen: a 60-word AI summary, the source, and a link to the full report.",
      },
      { property: "og:title", content: "News Shorts — 7 Awake News" },
      {
        property: "og:description",
        content: "Swipe through the day's stories, 60 words at a time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getShortsFeed(),
  component: Shorts,
});

function Shorts() {
  const shorts = Route.useLoaderData();
  const [i, setI] = useState(0);
  const [saved, setSaved] = useState<string[]>([]);
  const s = shorts[i];
  const isSaved = s ? saved.includes(s.id) : false;

  if (!s) {
    return (
      <AppShell>
        <p className="px-5 pt-20 text-sm text-muted-foreground">
          No shorts published yet.
        </p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="relative h-[calc(100svh-6rem)] overflow-hidden">
        <img
          src={s.image}
          alt={s.headline}
          className="absolute inset-0 size-full object-cover"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />

        <div className="relative flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="bg-primary px-3 py-1 text-[10px] font-semibold uppercase text-primary-foreground">
              ⚡ Shorts · {i + 1}/{shorts.length}
            </span>
            <span className="text-[11px] text-primary-foreground/70">
              {s.publishedAt}
            </span>
          </div>

          <div className="rise-in">
            <p className="text-[11px] font-semibold uppercase text-primary">
              {s.category}
            </p>
            <h1 className="mt-2 text-3xl leading-[1.02] text-primary-foreground text-balance">
              {s.headline}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80 text-pretty">
              {s.summary}
            </p>
            <p className="mt-3 text-[11px] text-primary-foreground/55">{s.source}</p>

            <div className="mt-5 flex items-center gap-2">
              <button
                onClick={() => setI((v) => Math.max(0, v - 1))}
                className="btn-press grid size-11 place-items-center rounded-full bg-secondary ring-1 ring-border disabled:opacity-40"
                disabled={i === 0}
                aria-label="Previous short"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={() => setI((v) => Math.min(shorts.length - 1, v + 1))}
                className="btn-press grid size-11 place-items-center rounded-full bg-secondary ring-1 ring-border disabled:opacity-40"
                disabled={i === shorts.length - 1}
                aria-label="Next short"
              >
                <ChevronRight className="size-4" />
              </button>
              <button
                onClick={() =>
                  setSaved((v) =>
                    isSaved ? v.filter((x) => x !== s.id) : [...v, s.id],
                  )
                }
                className={`btn-press grid size-11 place-items-center rounded-full ring-1 ${
                  isSaved
                    ? "bg-primary text-primary-foreground ring-primary"
                    : "bg-background/15 text-primary-foreground ring-background/30 backdrop-blur"
                }`}
                aria-label="Save short"
              >
                <Bookmark className="size-4" />
              </button>
              <button
                 className="btn-press grid size-11 place-items-center rounded-full bg-background/15 text-primary-foreground ring-1 ring-background/30 backdrop-blur"
                aria-label="Share short"
              >
                <Share2 className="size-4" />
              </button>
              <Link
                to="/"
                 className="btn-press ml-auto rounded-full bg-primary px-4 py-3 text-xs font-semibold text-primary-foreground"
              >
                Full feed
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
