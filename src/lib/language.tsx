import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { FeedArticle } from "@/lib/content.functions";

export type Language = "bn" | "en";

const STORAGE_KEY = "7awake:language";

const copy = {
  bn: {
    briefing: "ব্রিফিং", home: "হোম", shorts: "শর্টস", video: "ভিডিও", search: "খুঁজুন", profile: "প্রোফাইল",
    breaking: "জরুরি খবর", featured: "নির্বাচিত", viewAll: "সব দেখুন", latestStories: "সর্বশেষ খবর",
    trendingNow: "এখন আলোচিত", live: "লাইভ", read: "পড়ুন", reading: "পড়া", noStories: "এই বিভাগে এখনো কোনো খবর নেই।",
    dailyBriefing: "দৈনিক ব্রিফিং · ৬ মিনিট", essentialStories: "প্রয়োজনীয় খবর, সংক্ষেপে",
    askNews: "আজকের খবর সম্পর্কে জিজ্ঞাসা করুন", askExample: "বিদ্যুৎ গ্রিড কেন চাপে আছে?",
    notifications: "বিজ্ঞপ্তি", results: "ফলাফল", trendingSearches: "জনপ্রিয় অনুসন্ধান", follow: "অনুসরণ করুন",
    following: "অনুসরণ করছেন", followAction: "অনুসরণ", noShorts: "এখনো কোনো শর্টস প্রকাশিত হয়নি।",
    fullFeed: "সব খবর", previous: "আগের শর্ট", next: "পরের শর্ট", save: "সংরক্ষণ", saved: "সংরক্ষিত", share: "শেয়ার",
    noVideos: "এখনো কোনো ভিডিও প্রকাশিত হয়নি।", videoFeed: "ভিডিও ফিড", vertical: "ভার্টিক্যাল", featuredLabel: "নির্বাচিত",
    latestVideo: "সর্বশেষ ভিডিও", views: "দর্শন", aiBrief: "এআই ব্রিফ", listen: "খবরটি শুনুন", pause: "অডিও থামান",
    thirtySeconds: "⚡ ৩০ সেকেন্ডে পড়ুন", short: "সংক্ষিপ্ত", detailed: "বিস্তারিত", explain: "🧠 খবরটি বুঝিয়ে বলুন",
    explainSimply: "সহজভাবে", explainChild: "১০ বছরের শিশুর মতো", detailedAnalysis: "বিস্তারিত বিশ্লেষণ",
    whyMatters: "কেন গুরুত্বপূর্ণ", timeline: "📅 ঘটনার সময়রেখা", coverage: "📰 একাধিক সূত্রের প্রতিবেদন", related: "সম্পর্কিত খবর",
    preferences: "পছন্দসমূহ", noNotifications: "এখনো কোনো বিজ্ঞপ্তি নেই।", back: "ফিরে যান",
  },
  en: {
    briefing: "Briefing", home: "Home", shorts: "Shorts", video: "Video", search: "Search", profile: "Profile",
    breaking: "Breaking", featured: "Featured", viewAll: "View all", latestStories: "Latest stories",
    trendingNow: "Trending now", live: "Live", read: "Read", reading: "read", noStories: "No stories in this category yet.",
    dailyBriefing: "Daily briefing · 6 min", essentialStories: "The essential stories, distilled",
    askNews: "Ask about today's news", askExample: "Why is the grid under strain?",
    notifications: "Notifications", results: "Results", trendingSearches: "Trending searches", follow: "Follow",
    following: "Following", followAction: "Follow", noShorts: "No shorts published yet.",
    fullFeed: "Full feed", previous: "Previous short", next: "Next short", save: "Save", saved: "Saved", share: "Share",
    noVideos: "No videos published yet.", videoFeed: "Video feed", vertical: "Vertical", featuredLabel: "Featured",
    latestVideo: "Latest video", views: "views", aiBrief: "AI Brief", listen: "Listen to article", pause: "Pause article audio",
    thirtySeconds: "⚡ Read in 30 seconds", short: "Short", detailed: "Detailed", explain: "🧠 Explain this news",
    explainSimply: "Explain simply", explainChild: "Explain like I'm 10", detailedAnalysis: "Detailed analysis",
    whyMatters: "Why this matters", timeline: "📅 Story timeline", coverage: "📰 Coverage from multiple sources", related: "Related stories",
    preferences: "Preferences", noNotifications: "No notifications yet.", back: "Back",
  },
} as const;

type CopyKey = keyof typeof copy.bn;
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: (key: CopyKey) => string };
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("bn");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en") setLanguageState("en");
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "bn" ? "bn" : "en";
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage: (next) => {
      setLanguageState(next);
      window.localStorage.setItem(STORAGE_KEY, next);
    },
    t: (key) => copy[language][key],
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("LanguageProvider is missing");
  return value;
}

export function localizeArticle(article: FeedArticle, language: Language): FeedArticle {
  if (language === "en") return article;
  return {
    ...article,
    category: article.bn?.category || article.category,
    headline: article.bn?.headline || article.headline,
    dek: article.bn?.dek || article.dek,
    bullets: article.bn?.bullets?.length ? article.bn.bullets : article.bullets,
    whyItMatters: article.bn?.whyItMatters || article.whyItMatters,
    timeline: article.bn?.timeline?.length ? article.bn.timeline : article.timeline,
    coverage: article.bn?.coverage?.length ? article.bn.coverage : article.coverage,
    publishedAt: article.publishedAtBn || article.publishedAt,
    readingTime: article.readingTime.replace("min", "মিনিট"),
  };
}