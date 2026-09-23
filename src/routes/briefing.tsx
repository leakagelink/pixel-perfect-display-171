import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { ArticleCard } from "@/components/app/ArticleCard";
import { SectionHeader } from "@/components/app/SectionHeader";
import { articles } from "@/lib/news-data";

export const Route = createFileRoute("/briefing")({
  head: () => ({
    meta: [
      { title: "Daily Briefing — 7AWAKE NEWS NETWORK DIGITAL" },
      {
        name: "description",
        content:
          "Your personalized morning and evening briefing: the top stories, markets, AI, and what you missed.",
      },
      { property: "og:title", content: "Daily Briefing — 7AWAKE NEWS NETWORK DIGITAL" },
      {
        property: "og:description",
        content: "Top stories, markets, AI and what you missed, in five minutes.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Briefing,
});

function Briefing() {
  return (
    <AppShell>
      <div className="flex items-center gap-3 px-5 pt-6">
        <Link
          to="/"
          className="btn-press grid size-9 place-items-center rounded-full bg-secondary ring-1 ring-border"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
          Tuesday · 6 min
        </p>
      </div>

       <div className="border-b border-border px-5 pt-5 pb-6">
         <p className="text-[10px] font-semibold uppercase text-primary">Your personal edition</p>
         <h1 className="mt-2 text-4xl leading-[0.95] text-balance">
           Good morning
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your daily briefing — five stories, one trend, nothing else.
        </p>
      </div>

      <SectionHeader title="Top stories" meta="5" />
       <div className="stagger-in px-5 pt-2">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>

      <SectionHeader title="Evening brief" meta="6:00 PM" />
       <div className="stagger-in divide-y divide-border px-5 pt-2">
        {[
          ["Today's biggest events", "Three stories reshaped the market open."],
          ["What you missed", "Two follow-ups on stories you read yesterday."],
          ["Tomorrow watchlist", "Earnings, a policy vote, and a launch."],
        ].map(([title, body]) => (
          <div
            key={title}
             className="border-l-2 border-primary py-4 pl-4"
          >
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
