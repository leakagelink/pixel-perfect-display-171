import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { TopHeader } from "@/components/app/TopHeader";
import { SITE } from "@/lib/site";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "গোপনীয়তা নীতি — 7AWAKE NEWS NETWORK DIGITAL" },
      {
        name: "description",
        content:
          "7AWAKE NEWS NETWORK DIGITAL অ্যাপের গোপনীয়তা নীতি — আমরা কী তথ্য সংগ্রহ করি, কীভাবে ব্যবহার করি এবং আপনার অধিকার।",
      },
      { property: "og:title", content: "গোপনীয়তা নীতি — 7AWAKE NEWS NETWORK DIGITAL" },
      {
        property: "og:description",
        content: "আমরা কী তথ্য সংগ্রহ করি এবং কীভাবে ব্যবহার করি তা জানুন।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Privacy,
});

const sectionsBn: { title: string; body: string }[] = [
  {
    title: "১. আমরা কী তথ্য সংগ্রহ করি",
    body: "অ্যাকাউন্ট তৈরি করলে আপনার ইমেল ঠিকানা ও নাম সংগ্রহ করা হয়। এছাড়া অ্যাপের ভাষা পছন্দ ও পড়ার পছন্দ আপনার ডিভাইসে সংরক্ষিত থাকে। আমরা আপনার অবস্থান, পরিচিতি তালিকা বা অন্য কোনো ব্যক্তিগত তথ্য সংগ্রহ করি না।",
  },
  {
    title: "২. তথ্যের ব্যবহার",
    body: "সংগৃহীত তথ্য শুধুমাত্র আপনার অ্যাকাউন্ট পরিচালনা, লগইন এবং অ্যাপের অভিজ্ঞতা উন্নত করতে ব্যবহৃত হয়। আমরা আপনার তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা ভাগ করি না।",
  },
  {
    title: "৩. তথ্য সংরক্ষণ ও নিরাপত্তা",
    body: "আপনার তথ্য সুরক্ষিত সার্ভারে সংরক্ষিত থাকে এবং শিল্প-মান এনক্রিপশন ব্যবহার করা হয়। অননুমোদিত প্রবেশ রোধে আমরা প্রযোজ্য নিরাপত্তা ব্যবস্থা নিয়ে থাকি।",
  },
  {
    title: "৪. আপনার অধিকার",
    body: "আপনি যেকোনো সময় অ্যাপের প্রোফাইল পাতা থেকে আপনার অ্যাকাউন্ট ও সংশ্লিষ্ট সব তথ্য স্থায়ীভাবে মুছে ফেলতে পারেন। মুছে ফেলার পর তথ্য পুনরুদ্ধার সম্ভব নয়।",
  },
  {
    title: "৫. শিশুদের গোপনীয়তা",
    body: "এই অ্যাপ ১৩ বছরের কম বয়সী শিশুদের জন্য নয় এবং আমরা জানেন শিশুদের কোনো তথ্য সংগ্রহ করি না।",
  },
  {
    title: "৬. নীতি পরিবর্তন",
    body: "এই নীতি পরিবর্তিত হলে এই পাতায় হালনাগাদ করা হবে। গুরুত্বপূর্ণ পরিবর্তনের ক্ষেত্রে অ্যাপের মাধ্যমে জানিয়ে দেওয়া হবে।",
  },
];

const sectionsEn: { title: string; body: string }[] = [
  {
    title: "1. Information we collect",
    body: "When you create an account we collect your email address and name. Your language and reading preferences are stored on your device. We do not collect your location, contacts, or any other personal data.",
  },
  {
    title: "2. How we use information",
    body: "Collected information is used only to manage your account, sign you in, and improve the app experience. We never sell or share your data with third parties.",
  },
  {
    title: "3. Storage and security",
    body: "Your data is stored on secure servers with industry-standard encryption. We apply appropriate safeguards to prevent unauthorized access.",
  },
  {
    title: "4. Your rights",
    body: "You can permanently delete your account and all associated data at any time from the Profile page in the app. Deletion is irreversible.",
  },
  {
    title: "5. Children's privacy",
    body: "This app is not intended for children under 13, and we do not knowingly collect data from children.",
  },
  {
    title: "6. Changes to this policy",
    body: "If this policy changes, the update will be posted on this page. Significant changes will be announced in the app.",
  },
];

function Privacy() {
  const { language } = useLanguage();
  const bn = language === "bn";
  const sections = bn ? sectionsBn : sectionsEn;
  return (
    <AppShell>
      <TopHeader subtitle={bn ? "গোপনীয়তা নীতি" : "Privacy Policy"} />
      <div className="mt-6 px-5">
        <h1 className="font-display text-xl leading-tight">
          {bn ? "গোপনীয়তা নীতি" : "Privacy Policy"}
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
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {bn
                ? "গোপনীয়তা সংক্রান্ত যেকোনো প্রশ্নের জন্য যোগাযোগ করুন:"
                : "For any privacy-related questions, contact us:"}
            </p>
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
