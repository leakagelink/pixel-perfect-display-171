import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { TopHeader } from "@/components/app/TopHeader";
import { SITE } from "@/lib/site";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "ব্যবহারের শর্তাবলী — 7AWAKE NEWS NETWORK DIGITAL" },
      {
        name: "description",
        content:
          "7AWAKE NEWS NETWORK DIGITAL অ্যাপ ব্যবহারের শর্তাবলী — কনটেন্টের ব্যবহার, অ্যাকাউন্ট ও দায়বদ্ধতা।",
      },
      { property: "og:title", content: "ব্যবহারের শর্তাবলী — 7AWAKE NEWS NETWORK DIGITAL" },
      {
        property: "og:description",
        content: "অ্যাপ ব্যবহারের শর্তাবলী পড়ুন।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Terms,
});

const sectionsBn: { title: string; body: string }[] = [
  {
    title: "১. শর্তাবলী গ্রহণ",
    body: "7AWAKE NEWS NETWORK DIGITAL অ্যাপ ব্যবহার করে আপনি এই শর্তাবলী মেনে চলতে সম্মত হচ্ছেন। আপনি যদি সম্মত না হন, অনুগ্রহ করে অ্যাপটি ব্যবহার করবেন না।",
  },
  {
    title: "২. কনটেন্ট",
    body: "অ্যাপের সব খবর, লেখা, ছবি ও ভিডিও শুধুমাত্র ব্যক্তিগত, অবাণিজ্যিক ব্যবহারের জন্য। অনুমতি ছাড়া কোনো কনটেন্ট পুনঃপ্রকাশ, বিক্রি বা বাণিজ্যিকভাবে ব্যবহার করা যাবে না।",
  },
  {
    title: "৩. অ্যাকাউন্ট",
    body: "আপনার অ্যাকাউন্টের লগইন তথ্যের নিরাপত্তা আপনার দায়িত্ব। আপনি যেকোনো সময় প্রোফাইল পাতা থেকে আপনার অ্যাকাউন্ট মুছে ফেলতে পারেন।",
  },
  {
    title: "৪. গ্রহণযোগ্য ব্যবহার",
    body: "অ্যাপটি কোনো বেআইনি, ক্ষতিকর বা অন্যদের অধিকার লঙ্ঘনকারী কাজে ব্যবহার করা যাবে না। নিয়ম ভঙ্গ করলে অ্যাকাউন্ট বন্ধ করা হতে পারে।",
  },
  {
    title: "৫. দায়বদ্ধতার সীমা",
    body: "আমরা সঠিক ও হালনাগাদ খবর দেওয়ার চেষ্টা করি, তবে কনটেন্টের সম্পূর্ণ নির্ভুলতার নিশ্চয়তা দিই না। অ্যাপ ব্যবহার থেকে উদ্ভূত কোনো ক্ষতির জন্য আমরা দায়ী নই।",
  },
  {
    title: "৬. শর্তাবলী পরিবর্তন",
    body: "এই শর্তাবলী যেকোনো সময় পরিবর্তন হতে পারে এবং হালনাগাদ এই পাতায় প্রকাশিত হবে।",
  },
];

const sectionsEn: { title: string; body: string }[] = [
  {
    title: "1. Acceptance of terms",
    body: "By using the 7AWAKE NEWS NETWORK DIGITAL app you agree to these terms. If you do not agree, please do not use the app.",
  },
  {
    title: "2. Content",
    body: "All news, articles, images and videos in the app are for personal, non-commercial use only. No content may be republished, sold, or used commercially without permission.",
  },
  {
    title: "3. Account",
    body: "You are responsible for keeping your login credentials secure. You may delete your account at any time from the Profile page.",
  },
  {
    title: "4. Acceptable use",
    body: "The app must not be used for any unlawful, harmful, or rights-infringing activity. Accounts may be suspended for violations.",
  },
  {
    title: "5. Limitation of liability",
    body: "We strive to provide accurate and up-to-date news but do not guarantee complete accuracy. We are not liable for any damages arising from use of the app.",
  },
  {
    title: "6. Changes to terms",
    body: "These terms may change at any time and updates will be published on this page.",
  },
];

function Terms() {
  const { language } = useLanguage();
  const bn = language === "bn";
  const sections = bn ? sectionsBn : sectionsEn;
  return (
    <AppShell>
      <TopHeader subtitle={bn ? "শর্তাবলী" : "Terms of Use"} />
      <div className="mt-6 px-5">
        <h1 className="font-display text-xl leading-tight">
          {bn ? "ব্যবহারের শর্তাবলী" : "Terms of Use"}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {bn ? "সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬" : "Last updated: October 2026"}
        </p>
        <div className="mt-5 space-y-5">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-sm font-semibold">{s.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
          <div>
            <h2 className="text-sm font-semibold">{bn ? "যোগাযোগ" : "Contact"}</h2>
            <p className="mt-1.5 text-sm">
              <a href={`mailto:${SITE.email}`} className="font-medium text-primary">
                {SITE.email}
              </a>
              <br />
              <a href={SITE.phoneHref} className="font-medium text-primary">
                {SITE.phone}
              </a>
              <br />
              <a href={SITE.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary">
                {SITE.websiteLabel}
              </a>
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
