import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { TopHeader } from "@/components/app/TopHeader";
import { SectionHeader } from "@/components/app/SectionHeader";
import { followables } from "@/lib/news-data";
import { useLanguage } from "@/lib/language";
import { getHomeFeed } from "@/lib/content.functions";
import { deleteMyAccount } from "@/lib/account.functions";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

const interests = [
  "AI",
  "Technology",
  "Business",
  "Crypto",
  "Stock Market",
  "Science",
];

const settings = [
  { label: "About us", value: "7adigital.com", to: "/about" },
  { label: "Contact", value: "7awakenewsnetworkdigital@gmail.com", to: "/about" },
  { label: "Privacy Policy", value: "How we handle your data", to: "/privacy" },
  { label: "Terms of Use", value: "Rules for using the app", to: "/terms" },
];

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "প্রোফাইল — 7AWAKE NEWS NETWORK DIGITAL" },
      {
        name: "description",
        content:
          "আপনার আগ্রহ, অনুসরণ, সংরক্ষিত খবর, পড়ার ইতিহাস এবং অ্যাপের পছন্দ।",
      },
      { property: "og:title", content: "প্রোফাইল — 7AWAKE NEWS NETWORK DIGITAL" },
      {
        property: "og:description",
        content: "আগ্রহ, অনুসরণ এবং পড়ার পছন্দ ঠিক করুন।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getHomeFeed(),
  component: Profile,
});

function Profile() {
  const { language, t } = useLanguage();
  const { articles } = Route.useLoaderData();
  const shownSettings = language === "bn" ? [
    ["সংরক্ষিত খবর", "৩টি ফোল্ডার · ১২টি খবর"], ["পড়ার ইতিহাস", "এই সপ্তাহে ৪৮টি খবর"],
    ["বিজ্ঞপ্তির পছন্দ", "জরুরি খবর, বাজার"], ["ভাষা", "বাংলা"], ["অবস্থান", "ভারত · পশ্চিমবঙ্গ"],
    ["গোপনীয়তা", "ব্যক্তিগতকরণ চালু"], ["অ্যাকাউন্ট সেটিংস", "theo@newsai.app"],
  ] : settings;
  return (
    <AppShell>
      <TopHeader subtitle={t("profile")} />

      <div className="mt-6 px-5">
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <div className="grid size-16 shrink-0 place-items-center rounded-full bg-ink font-display text-lg text-primary-foreground ring-4 ring-primary/10">
            T
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">Theo Marchand</p>
            <p className="text-xs text-muted-foreground">
               {language === "bn" ? "২০২৫ থেকে সদস্য · ২১৪টি সূত্র" : "Member since 2025 · 214 sources"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 px-5">
        <Link
          to="/admin"
          className="btn-press flex items-center justify-between border-l-2 border-primary bg-secondary/60 p-4"
        >
          <div>
             <p className="text-sm font-medium">{language === "bn" ? "অ্যাডমিন প্যানেল" : "Admin panel"}</p>
            <p className="text-[11px] text-muted-foreground">
               {language === "bn" ? "খবর, শর্টস, ভিডিও ও ব্যবহারকারী পরিচালনা করুন" : "Manage news, shorts, video and users"}
            </p>
          </div>
          <span className="text-muted-foreground">›</span>
        </Link>
      </div>

      <SectionHeader title={language === "bn" ? "আমার আগ্রহ" : "My interests"} />
      <div className="mt-3 flex flex-wrap gap-2 px-5">
        {interests.map((i) => (
          <span
            key={i}
             className="rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary ring-1 ring-primary/20"
          >
            {i}
          </span>
        ))}
      </div>

      <SectionHeader title={t("following")} meta={`${followables.length}`} />
      <div className="mt-3 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar">
        {followables.map((f) => (
          <div
            key={f.name}
             className="shrink-0 border-b-2 border-primary bg-secondary px-4 py-3"
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

      <SectionHeader title={language === "bn" ? "সংরক্ষিত খবর" : "Saved news"} meta="🔖" />
      <div className="divide-y divide-border px-5 pt-2">
        {articles.slice(0, 2).map((a) => (
          <Link
            key={a.id}
            to="/article/$articleId"
            params={{ articleId: a.id }}
            className="btn-press flex items-center gap-3 py-4"
          >
            <img
              src={a.image}
              alt={a.headline}
              loading="lazy"
            decoding="async"
              className="size-12 shrink-0 rounded-xl object-cover"
            />
            <p className="text-sm font-medium leading-snug">{a.headline}</p>
          </Link>
        ))}
      </div>

      <SectionHeader title={language === "bn" ? "সেটিংস" : "Settings"} />
      <div className="divide-y divide-border px-5 pt-2">
        {shownSettings.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between py-4"
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
