import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";

const categories = [
  { emoji: "🔴", label: "Breaking news" },
  { emoji: "🤖", label: "AI & Technology" },
  { emoji: "₿", label: "Crypto" },
  { emoji: "📈", label: "Markets" },
  { emoji: "💼", label: "Business" },
  { emoji: "📍", label: "Local news" },
];

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — NewsAI" },
      {
        name: "description",
        content:
          "Your alert centre: breaking news, markets, crypto and local updates with per-topic controls.",
      },
      { property: "og:title", content: "Notifications — NewsAI" },
      {
        property: "og:description",
        content: "Manage which stories are allowed to interrupt you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Notifications,
});

function Notifications() {
  const [on, setOn] = useState<string[]>(["Breaking news", "Markets"]);

  return (
    <AppShell>
      <div className="flex items-center gap-3 px-5 pt-6">
        <Link
          to="/"
          className="btn-press grid size-9 place-items-center rounded-full bg-secondary ring-1 ring-border"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-xl tracking-tight">Notifications</h1>
      </div>

      <div className="space-y-3 px-5 pt-6">
        <div className="card-surface hover-lift rounded-3xl p-5 ring-1 ring-border">
          <p className="text-[11px] uppercase tracking-[0.15em] text-destructive">
            Breaking · 12m ago
          </p>
          <p className="mt-1.5 text-sm font-medium">
            Northwind merger clears regulatory review
          </p>
        </div>
        <div className="card-surface hover-lift rounded-3xl p-5 ring-1 ring-border">
          <p className="text-[11px] uppercase tracking-[0.15em] text-accent">
            Markets · 1h ago
          </p>
          <p className="mt-1.5 text-sm font-medium">
            Valerion closes up 7% on record margin
          </p>
        </div>
      </div>

      <p className="px-5 pt-8 text-sm font-semibold uppercase tracking-[0.12em] text-foreground/80">
        Preferences
      </p>
      <div className="space-y-2 px-5 pt-4">
        {categories.map((c) => {
          const active = on.includes(c.label);
          return (
            <button
              key={c.label}
              onClick={() =>
                setOn((v) =>
                  active ? v.filter((x) => x !== c.label) : [...v, c.label],
                )
              }
              className="flex w-full items-center gap-3 card-surface hover-lift rounded-2xl p-4 ring-1 ring-border"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-secondary text-sm">
                {c.emoji}
              </span>
              <span className="text-sm font-medium">{c.label}</span>
              <span
                className={`ml-auto h-6 w-11 rounded-full p-0.5 transition-colors ${
                  active ? "bg-primary" : "bg-secondary"
                }`}
              >
                <span
                  className={`block size-5 rounded-full bg-foreground transition-transform ${
                    active ? "translate-x-5" : ""
                  }`}
                />
              </span>
            </button>
          );
        })}
      </div>
    </AppShell>
  );
}
