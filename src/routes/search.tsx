import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { TopHeader } from "@/components/app/TopHeader";
import { SectionHeader } from "@/components/app/SectionHeader";
import { ArticleCard } from "@/components/app/ArticleCard";
import { articles, followables, trendingSearches } from "@/lib/news-data";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — 7 Awake News" },
      {
        name: "description",
        content:
          "Search articles, topics, companies, people and locations, and follow what you care about.",
      },
      { property: "og:title", content: "Search — 7 Awake News" },
      {
        property: "og:description",
        content: "Find stories and follow topics, companies, people and places.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const [following, setFollowing] = useState<string[]>(["Bitcoin"]);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const t = q.toLowerCase();
    return articles.filter(
      (a) =>
        a.headline.toLowerCase().includes(t) ||
        a.category.toLowerCase().includes(t) ||
        a.dek.toLowerCase().includes(t),
    );
  }, [q]);

  return (
    <AppShell>
      <TopHeader subtitle="Search" />

      <div className="px-5 pt-5">
        <div className="flex items-center gap-3 border-b-2 border-foreground bg-secondary/60 px-4 py-3 focus-within:border-primary">
          <SearchIcon className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Articles, topics, companies, people"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {q.trim() ? (
        <>
          <SectionHeader title="Results" meta={`${results.length}`} />
          <div className="stagger-in px-5 pt-2">
            {results.length ? (
              results.map((a) => <ArticleCard key={a.id} article={a} />)
            ) : (
              <p className="border-y border-border py-6 text-sm text-muted-foreground">
                Nothing matched "{q}" in today's stories.
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <SectionHeader title="Trending searches" />
          <div className="mt-3 flex flex-wrap gap-2 px-5">
            {trendingSearches.map((t) => (
              <button
                key={t}
                onClick={() => setQ(t)}
                className="btn-press rounded-full bg-secondary px-3.5 py-1.5 text-xs text-muted-foreground ring-1 ring-border"
              >
                {t}
              </button>
            ))}
          </div>

          <SectionHeader title="Follow" meta="topics · people · places" />
          <div className="divide-y divide-border px-5 pt-2">
            {followables.map((f) => {
              const on = following.includes(f.name);
              return (
                <div
                  key={f.name}
                  className="flex items-center gap-3 py-4"
                >
                  <span className="grid size-9 place-items-center rounded-xl bg-secondary text-sm">
                    {f.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{f.name}</p>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {f.kind}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setFollowing((v) =>
                        on ? v.filter((x) => x !== f.name) : [...v, f.name],
                      )
                    }
                    className={`btn-press ml-auto shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 ${
                      on
                        ? "bg-ink text-primary-foreground ring-ink"
                        : "bg-primary text-primary-foreground ring-primary/50"
                    }`}
                  >
                    {on ? "✓ Following" : "+ Follow"}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </AppShell>
  );
}
