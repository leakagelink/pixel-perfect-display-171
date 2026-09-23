import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { getNotificationsFeed } from "@/lib/content.functions";
import { useLanguage } from "@/lib/language";

const categories = [
  { emoji: "🔴", label: "Breaking news", bn: "জরুরি খবর" },
  { emoji: "🤖", label: "AI & Technology", bn: "এআই ও প্রযুক্তি" },
  { emoji: "₿", label: "Crypto", bn: "ক্রিপ্টো" },
  { emoji: "📈", label: "Markets", bn: "বাজার" },
  { emoji: "💼", label: "Business", bn: "ব্যবসা" },
  { emoji: "📍", label: "Local news", bn: "স্থানীয় খবর" },
];

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "বিজ্ঞপ্তি — 7AWAKE NEWS NETWORK DIGITAL" },
      {
        name: "description",
        content:
          "জরুরি খবর, বাজার, ক্রিপ্টো ও স্থানীয় আপডেটের বিজ্ঞপ্তি কেন্দ্র।",
      },
      { property: "og:title", content: "বিজ্ঞপ্তি — 7AWAKE NEWS NETWORK DIGITAL" },
      {
        property: "og:description",
        content: "কোন খবরের বিজ্ঞপ্তি পাবেন তা নিয়ন্ত্রণ করুন।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getNotificationsFeed(),
  component: Notifications,
});

function Notifications() {
  const { language, t } = useLanguage();
  const items = Route.useLoaderData();
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
        <h1 className="text-xl tracking-tight">{t("notifications")}</h1>
      </div>

      <div className="stagger-in divide-y divide-border px-5 pt-4">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("noNotifications")}</p>
        )}
        {items.map((n) => (
          <div
            key={n.id}
            className="relative py-5 pl-4 before:absolute before:left-0 before:top-6 before:size-2 before:rounded-full before:bg-primary"
          >
            <p className="text-[11px] uppercase tracking-[0.15em] text-accent">
               {language === "bn" ? n.kindBn : n.kind} · {language === "bn" ? n.createdAtBn : n.createdAt}
            </p>
            <p className="mt-1.5 text-sm font-medium">{language === "bn" ? n.titleBn : n.title}</p>
            {n.body && (
              <p className="mt-1 text-xs text-muted-foreground">{language === "bn" ? n.bodyBn : n.body}</p>
            )}
          </div>
        ))}
      </div>

      <p className="px-5 pt-8 text-sm font-semibold uppercase tracking-[0.12em] text-foreground/80">
         {t("preferences")}
      </p>
      <div className="divide-y divide-border px-5 pt-2">
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
              className="flex w-full items-center gap-3 py-4 text-left"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-secondary text-sm">
                {c.emoji}
              </span>
               <span className="text-sm font-medium">{language === "bn" ? c.bn : c.label}</span>
              <span
                className={`ml-auto h-6 w-11 rounded-full p-0.5 transition-colors ${
                  active ? "bg-primary" : "bg-secondary"
                }`}
              >
                <span
                  className={`block size-5 rounded-full bg-background shadow-sm transition-transform ${
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
