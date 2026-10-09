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
    body: "অ্যাকাউন্ট তৈরি করলে আপনার ইমেল ঠিকানা, নাম (যদি দেন) ও এনক্রিপ্ট করা পাসওয়ার্ড সংরক্ষিত হয়। লগইনের সময় নিরাপত্তার জন্য আমাদের সার্ভার স্বয়ংক্রিয়ভাবে প্রযুক্তিগত তথ্য (যেমন IP ঠিকানা, ডিভাইস/ব্রাউজারের ধরন, সময়) লগ করতে পারে। ভাষা পছন্দ শুধু আপনার ডিভাইসে থাকে। অ্যাকাউন্ট ছাড়াও খবর পড়া যায়। আমরা অবস্থান, পরিচিতি, ছবি বা মাইক্রোফোন অ্যাক্সেস করি না এবং কোনো বিজ্ঞাপন বা অ্যানালিটিক্স SDK ব্যবহার করি না।",
  },
  {
    title: "২. তথ্যের ব্যবহার",
    body: "এই তথ্য শুধুমাত্র আপনার অ্যাকাউন্ট পরিচালনা, লগইন, নিরাপত্তা ও অপব্যবহার রোধে ব্যবহৃত হয়। আমরা আপনার তথ্য বিক্রি করি না এবং বিজ্ঞাপনের জন্য ভাগ করি না।",
  },
  {
    title: "৩. পরিষেবা প্রদানকারী",
    body: "অ্যাপ চালাতে আমরা কিছু পরিষেবা ব্যবহার করি যারা আমাদের হয়ে তথ্য প্রক্রিয়া করে: হোস্টিং, ডাটাবেস ও লগইন (Lovable Cloud), ফন্ট (Google Fonts)। আপনি কোনো ভিডিও চালালে YouTube বা Facebook তাদের নিজস্ব নীতি অনুযায়ী তথ্য সংগ্রহ করতে পারে।",
  },
  {
    title: "৪. তথ্য সংরক্ষণ ও নিরাপত্তা",
    body: "তথ্য এনক্রিপ্ট করা সংযোগ (HTTPS) দিয়ে পাঠানো হয় এবং প্রবেশাধিকার নিয়ন্ত্রিত সার্ভারে রাখা হয়। কোনো ব্যবস্থাই সম্পূর্ণ নিরাপদ নয়, তবে আমরা যুক্তিসঙ্গত সুরক্ষা ব্যবস্থা নিই। অ্যাকাউন্ট থাকা পর্যন্ত তথ্য রাখা হয়; অ্যাকাউন্ট মুছলে তা সরিয়ে ফেলা হয়।",
  },
  {
    title: "৫. অ্যাকাউন্ট ও তথ্য মুছে ফেলা",
    body: "প্রোফাইল পাতা থেকে \"অ্যাকাউন্ট মুছুন\" চাপলে আপনার অ্যাকাউন্ট ও সংশ্লিষ্ট তথ্য স্থায়ীভাবে মুছে যায়। অ্যাপ ছাড়াও নিচের ইমেলে অনুরোধ পাঠিয়ে মুছে ফেলতে পারেন। মুছে ফেলার পর তথ্য পুনরুদ্ধার সম্ভব নয়।",
  },
  {
    title: "৬. শিশুদের গোপনীয়তা",
    body: "এই অ্যাপ ১৩ বছরের কম বয়সী শিশুদের জন্য নয় এবং আমরা জেনেশুনে শিশুদের কোনো তথ্য সংগ্রহ করি না।",
  },
  {
    title: "৭. নীতি পরিবর্তন",
    body: "এই নীতি পরিবর্তিত হলে এই পাতায় হালনাগাদ করা হবে।",
  },
];

const sectionsEn: { title: string; body: string }[] = [
  {
    title: "1. Information we collect",
    body: "If you create an account, we store your email address, name (if provided) and an encrypted password. For security, our servers may automatically log technical data during sign-in (such as IP address, device/browser type and time). Your language choice stays on your device. You can read news without an account. We do not access your location, contacts, photos or microphone, and we use no advertising or analytics SDKs.",
  },
  {
    title: "2. How we use information",
    body: "This information is used only to run your account, sign you in, keep the service secure and prevent abuse. We do not sell your data or share it for advertising.",
  },
  {
    title: "3. Service providers",
    body: "We use providers that process data on our behalf to run the app: hosting, database and sign-in (Lovable Cloud) and fonts (Google Fonts). If you play a video, YouTube or Facebook may collect data under their own policies.",
  },
  {
    title: "4. Storage and security",
    body: "Data is sent over encrypted connections (HTTPS) and stored on access-controlled servers. No system is perfectly secure, but we apply reasonable safeguards. We keep your data while your account exists and remove it when you delete the account.",
  },
  {
    title: "5. Account and data deletion",
    body: "Tap \"Delete account\" on the Profile page to permanently delete your account and associated data. You can also request deletion by emailing us at the address below. Deletion cannot be undone.",
  },
  {
    title: "6. Children's privacy",
    body: "This app is not intended for children under 13, and we do not knowingly collect data from children.",
  },
  {
    title: "7. Changes to this policy",
    body: "If this policy changes, the update will be posted on this page.",
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
