import datacenter from "@/assets/news-datacenter.jpg";
import chips from "@/assets/news-chips.jpg";
import markets from "@/assets/news-markets.jpg";
import grid from "@/assets/news-grid.jpg";

export const images = { datacenter, chips, markets, grid };

export type Article = {
  id: string;
  category: string;
  headline: string;
  dek: string;
  image: string;
  sources: string[];
  publishedAt: string;
  readingTime: string;
  bullets: string[];
  whyItMatters: string;
  timeline: { time: string; event: string }[];
  coverage: { source: string; label: string; angle: string }[];
};

export const categories = [
  "For You",
  "Latest",
  "India",
  "World",
  "Business",
  "Markets",
  "Technology",
  "AI",
  "Crypto",
  "Sports",
  "Entertainment",
  "Health",
  "Science",
];

export const categoriesBn: Record<string, string> = {
  "For You": "আপনার জন্য", Latest: "সর্বশেষ", India: "ভারত", World: "বিশ্ব", Business: "ব্যবসা",
  Markets: "বাজার", Technology: "প্রযুক্তি", AI: "এআই", Crypto: "ক্রিপ্টো", Sports: "খেলা",
  Entertainment: "বিনোদন", Health: "স্বাস্থ্য", Science: "বিজ্ঞান",
};

export const trendingSearches = [
  "Bitcoin",
  "OpenAI",
  "India",
  "Tesla",
  "Stock Market",
  "Nvidia",
];

export const followables = [
  { emoji: "🇮🇳", name: "India", kind: "Topic" },
  { emoji: "🌍", name: "World", kind: "Topic" },
  { emoji: "🏛️", name: "Politics", kind: "Topic" },
  { emoji: "⚽", name: "Sports", kind: "Topic" },
  { emoji: "🎬", name: "Entertainment", kind: "Topic" },
  { emoji: "💼", name: "Business", kind: "Topic" },
];

export const suggestedQuestions = [
  "What happened in West Bengal today?",
  "What are the top headlines today?",
  "Summarize today's AI updates",
  "What should I watch tomorrow?",
];

export const suggestedQuestionsBn = [
  "আজ পশ্চিমবঙ্গে কী ঘটেছে?",
  "আজকের প্রধান শিরোনাম কী?",
  "আজকের এআই খবর সংক্ষেপে বলুন",
  "আগামীকাল কোন বিষয়ে নজর রাখব?",
];
