import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { TopHeader } from "@/components/app/TopHeader";
import { SectionHeader } from "@/components/app/SectionHeader";
import { articles, followables } from "@/lib/news-data";

const interests = [
  "AI",
  "Technology",
  "Business",
  "Crypto",
  "Stock Market",
  "Science",
];

const settings = [
  ["Saved news", "3 folders · 12 stories"],
  ["Reading history", "48 stories this week"],
  ["Notification preferences", "Breaking, Markets"],
  ["Language", "English"],
  ["Location", "United States · San Francisco"],
  ["Privacy", "Personalization on"],
  ["Account settings", "theo@newsai.app"],
];

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — NewsAI" },
      {
        name: "description",
        content:
          "Your interests, follows, saved stories, reading history and app preferences.",
      },
      { property: "og:title", content: "Profile — NewsAI" },
      {
        property: "og:description",
        content: "Tune your interests, follows and reading preferences.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Profile,
});

function Profile() {
  return (
    <AppShell>
      <TopHeader subtitle="Profile" />

      <div className="mt-6 px-5">
        <div className="flex items-center gap-4 card-surface hover-lift rounded-3xl p-5 ring-1 ring-border">
          <div className="grid size-14 shrink-0 place-items-center rounded-2xl gradient-brand font-display text-lg">
            T
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">Theo Marchand</p>
            <p className="text-xs text-muted-foreground">
              Member since 2025 · 214 sources
            </p>
          </div>
        </div>
      </div>

      <SectionHeader title="My interests" />
      <div className="mt-3 flex flex-wrap gap-2 px-5">
        {interests.map((i) => (
          <span
            key={i}
            className="rounded-full bg-primary/20 px-3.5 py-1.5 text-xs font-medium ring-1 ring-primary/40"
          >
            {i}
          </span>
        ))}
      </div>

      <SectionHeader title="Following" meta={`${followables.length}`} />
      <div className="mt-3 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar">
        {followables.map((f) => (
          <div
            key={f.name}
            className="shrink-0 rounded-2xl bg-secondary px-4 py-3 ring-1 ring-border"
          >
            <p className="text-xs font-medium">
              {f.emoji} {f.name}
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
              {f.kind}
            </p>
          </div>
        ))}
      </div>

      <SectionHeader title="Saved news" meta="🔖" />
      <div className="space-y-2 px-5 pt-4">
        {articles.slice(0, 2).map((a) => (
          <Link
            key={a.id}
            to="/article/$articleId"
            params={{ articleId: a.id }}
            className="btn-press flex items-center gap-3 card-surface hover-lift rounded-2xl p-4 ring-1 ring-border"
          >
            <img
              src={a.image}
              alt={a.headline}
              loading="lazy"
              className="size-12 shrink-0 rounded-xl object-cover"
            />
            <p className="text-sm font-medium leading-snug">{a.headline}</p>
          </Link>
        ))}
      </div>

      <SectionHeader title="Settings" />
      <div className="space-y-2 px-5 pt-4">
        {settings.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between card-surface hover-lift rounded-2xl p-4 ring-1 ring-border"
          >
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-[11px] text-muted-foreground">{value}</p>
            </div>
            <span className="text-muted-foreground">›</span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
