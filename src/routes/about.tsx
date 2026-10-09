import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { TopHeader } from "@/components/app/TopHeader";
import { SectionHeader } from "@/components/app/SectionHeader";
import { SITE } from "@/lib/site";
import { useLanguage } from "@/lib/language";
import { Globe, Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "আমাদের সম্পর্কে — 7AWAKE NEWS NETWORK DIGITAL" },
      {
        name: "description",
        content:
          "7AWAKE NEWS NETWORK DIGITAL — বাংলা সংবাদ অ্যাপ। যোগাযোগ: 7adigital.com, 7awakenewsnetworkdigital@gmail.com, +91 98883 85335।",
      },
      { property: "og:title", content: "আমাদের সম্পর্কে — 7AWAKE NEWS NETWORK DIGITAL" },
      {
        property: "og:description",
        content: "অ্যাপ সম্পর্কে জানুন এবং আমাদের সাথে যোগাযোগ করুন।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  const { language } = useLanguage();
  const bn = language === "bn";
  return (
    <AppShell>
      <TopHeader subtitle={bn ? "আমাদের সম্পর্কে" : "About"} />

      <div className="mt-6 px-5">
        <h1 className="font-display text-xl leading-tight">
          {SITE.name}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {bn
            ? "7AWAKE NEWS NETWORK DIGITAL একটি বাংলা-প্রথম সংবাদ অ্যাপ — জরুরি খবর, সংক্ষিপ্ত সারাংশ, শর্টস ও ভিডিও ব্রিফিং এক জায়গায়। আমাদের লক্ষ্য আপনার প্রয়োজনের খবর দ্রুত ও নির্ভুলভাবে পৌঁছে দেওয়া।"
            : "7AWAKE NEWS NETWORK DIGITAL is a Bengali-first news app — breaking news, short summaries, shorts and video briefings in one place. Our goal is to deliver the news that matters to you, fast and accurately."}
        </p>
      </div>

      <SectionHeader title={bn ? "যোগাযোগ" : "Contact"} />
      <div className="mt-3 space-y-3 px-5">
        <a
          href={SITE.website}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-press flex items-center gap-3 rounded-xl border border-border bg-card p-4"
        >
          <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
            <Globe className="size-4" />
          </span>
          <div>
            <p className="text-sm font-medium">{bn ? "ওয়েবসাইট" : "Website"}</p>
            <p className="text-xs text-muted-foreground">{SITE.websiteLabel}</p>
          </div>
        </a>
        <a
          href={`mailto:${SITE.email}`}
          className="btn-press flex items-center gap-3 rounded-xl border border-border bg-card p-4"
        >
          <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
            <Mail className="size-4" />
          </span>
          <div>
            <p className="text-sm font-medium">{bn ? "ইমেল" : "Email"}</p>
            <p className="text-xs text-muted-foreground">{SITE.email}</p>
          </div>
        </a>
        <a
          href={SITE.phoneHref}
          className="btn-press flex items-center gap-3 rounded-xl border border-border bg-card p-4"
        >
          <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
            <Phone className="size-4" />
          </span>
          <div>
            <p className="text-sm font-medium">{bn ? "মোবাইল" : "Mobile"}</p>
            <p className="text-xs text-muted-foreground">{SITE.phone}</p>
          </div>
        </a>
      </div>
    </AppShell>
  );
}
