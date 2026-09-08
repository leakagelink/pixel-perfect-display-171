import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Bookmark, Share2, Play } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { TopHeader } from "@/components/app/TopHeader";
import { SectionHeader } from "@/components/app/SectionHeader";
import { videos } from "@/lib/news-data";

export const Route = createFileRoute("/video")({
  head: () => ({
    meta: [
      { title: "Video News — NewsAI" },
      {
        name: "description",
        content:
          "Featured, trending and vertical video news briefings with clear source attribution.",
      },
      { property: "og:title", content: "Video News — NewsAI" },
      {
        property: "og:description",
        content: "Watch the day's stories as short video briefings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VideoPage,
});

function VideoPage() {
  const [mode, setMode] = useState<"feed" | "vertical">("feed");
  const featured = videos[0]!;

  return (
    <AppShell>
      <TopHeader subtitle="Video" />

      <div className="mt-5 flex gap-2 px-5">
        {(["feed", "vertical"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`btn-press rounded-full px-4 py-1.5 text-xs font-medium ring-1 ${
              mode === m
                ? "bg-primary text-primary-foreground ring-primary/50"
                : "bg-secondary text-muted-foreground ring-border"
            }`}
          >
            {m === "feed" ? "Video feed" : "Vertical"}
          </button>
        ))}
      </div>

      {mode === "feed" ? (
        <>
          <div className="px-5 pt-5">
            <div className="overflow-hidden rounded-3xl bg-card ring-1 ring-border">
              <div className="relative">
                <img
                  src={featured.image}
                  alt={featured.title}
                  loading="lazy"
                  className="aspect-video w-full object-cover"
                />
                <span className="absolute bottom-3 right-3 rounded-full bg-background/80 px-2 py-1 text-[10px]">
                  {featured.duration}
                </span>
                <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em]">
                  Featured
                </span>
              </div>
              <div className="p-5">
                <p className="text-[11px] uppercase tracking-[0.15em] text-accent">
                  {featured.category}
                </p>
                <h1 className="mt-1 text-xl leading-snug tracking-tight text-balance">
                  {featured.title}
                </h1>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {featured.source} · {featured.views} views
                </p>
              </div>
            </div>
          </div>

          <SectionHeader title="Latest video" meta={`${videos.length - 1}`} />
          <div className="grid grid-cols-2 gap-3 px-5 pt-4">
            {videos.slice(1).map((v) => (
              <div
                key={v.id}
                className="btn-press overflow-hidden rounded-2xl bg-card ring-1 ring-border"
              >
                <div className="relative">
                  <img
                    src={v.image}
                    alt={v.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 rounded-full bg-background/80 px-1.5 py-0.5 text-[9px]">
                    {v.duration}
                  </span>
                </div>
                <div className="p-3">
                  {v.aiBrief && (
                    <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-accent ring-1 ring-accent/40">
                      🤖 AI Brief · {v.status}
                    </span>
                  )}
                  <p className="mt-1.5 text-xs font-medium leading-snug">
                    {v.title}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {v.source} · {v.views}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-5 h-[calc(100svh-11rem)] snap-y snap-mandatory overflow-y-auto no-scrollbar">
          {videos.map((v) => (
            <div
              key={v.id}
              className="relative h-[calc(100svh-11rem)] snap-start overflow-hidden"
            >
              <img
                src={v.image}
                alt={v.title}
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="relative flex h-full items-end justify-between gap-4 p-5">
                <div>
                  <span className="grid size-12 place-items-center rounded-full bg-foreground/15 ring-1 ring-border backdrop-blur">
                    <Play className="size-5" />
                  </span>
                  <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-accent">
                    {v.category}
                  </p>
                  <h2 className="mt-1 text-2xl leading-tight tracking-tight text-balance">
                    {v.title}
                  </h2>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {v.source} · {v.duration}
                  </p>
                  <div className="mt-3 h-1 w-full rounded-full bg-foreground/15">
                    <div className="h-1 w-1/3 rounded-full bg-accent" />
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-3">
                  {[Heart, Bookmark, Share2].map((Icon, idx) => (
                    <button
                      key={idx}
                      className="btn-press grid size-11 place-items-center rounded-full bg-secondary/80 ring-1 ring-border"
                    >
                      <Icon className="size-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
