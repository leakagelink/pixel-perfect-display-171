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

export const breaking = [
  "Valerion hits $142 in late-session rally",
  "Mira OS ships 3.1 to all devices",
  "Helios datacenter cut to 41 GWh",
  "Northwind merger clears regulatory review",
];

export const trending = [
  { tag: "AI Agents", count: "8.4k" },
  { tag: "Chips", count: "6.1k" },
  { tag: "Energy", count: "4.9k" },
  { tag: "Regulation", count: "3.2k" },
  { tag: "Bitcoin", count: "2.8k" },
];

export const trendingSearches = [
  "Bitcoin",
  "OpenAI",
  "India",
  "Tesla",
  "Stock Market",
  "Nvidia",
];

export const followables = [
  { emoji: "🤖", name: "Artificial Intelligence", kind: "Topic" },
  { emoji: "₿", name: "Bitcoin", kind: "Topic" },
  { emoji: "🏢", name: "Valerion", kind: "Company" },
  { emoji: "🏢", name: "Helios Grid", kind: "Company" },
  { emoji: "👤", name: "Ada Moreau", kind: "Person" },
  { emoji: "📍", name: "San Francisco", kind: "Location" },
];

export const articles: Article[] = [
  {
    id: "valerion-margin",
    category: "Markets",
    headline: "Valerion posts record margin as inference costs fall",
    dek: "The chipmaker's cheapest quarter of compute yet turned into its most profitable one.",
    image: datacenter,
    sources: ["Valerion Wire", "Signal Desk", "TechWire"],
    publishedAt: "42m ago",
    readingTime: "4 min",
    bullets: [
      "AI inference unit cost down 38% quarter-over-quarter",
      "Guidance raised after enterprise adoption beat by 12%",
      "Operating margin reached an all-time high of 41%",
      "Management flagged supply strain into next quarter",
    ],
    whyItMatters:
      "Cheaper inference resets the economics of every product built on large models — pricing pressure now moves down the stack to apps and tooling.",
    timeline: [
      { time: "10:00", event: "Earnings released ahead of the bell" },
      { time: "11:30", event: "Management raises full-year guidance" },
      { time: "13:00", event: "Shares climb 7% in heavy volume" },
      { time: "16:00", event: "Analysts revise targets upward" },
    ],
    coverage: [
      { source: "Valerion Wire", label: "Official Source", angle: "Company statement on record quarter" },
      { source: "Signal Desk", label: "Analysis", angle: "What falling inference cost means for rivals" },
      { source: "TechWire", label: "Multiple Sources Reporting", angle: "Supply constraints could cap upside" },
    ],
  },
  {
    id: "helios-cooling",
    category: "Energy",
    headline: "Helios cuts datacenter draw to 41 GWh with liquid cooling",
    dek: "A new closed-loop system claims the largest efficiency jump the operator has shipped.",
    image: grid,
    sources: ["Helios Grid", "Northwind Post"],
    publishedAt: "1h ago",
    readingTime: "5 min",
    bullets: [
      "New loop claims 61% lower PUE at scale",
      "Rollout begins across three West Coast sites by Q3",
      "Water usage falls by an estimated 30%",
    ],
    whyItMatters:
      "Grid operators have warned about AI load growth for two years. Efficiency at this scale buys regulators time before new generation comes online.",
    timeline: [
      { time: "08:15", event: "Helios publishes efficiency report" },
      { time: "12:40", event: "Regulators confirm pilot approval" },
      { time: "15:20", event: "Rollout schedule made public" },
    ],
    coverage: [
      { source: "Helios Grid", label: "Official Source", angle: "Technical report on the cooling loop" },
      { source: "Northwind Post", label: "Developing Story", angle: "Local water authority still reviewing" },
    ],
  },
  {
    id: "compute-land-grab",
    category: "AI",
    headline: "The compute land-grab: three hyperscalers pass 100 GW",
    dek: "Capacity plans now outpace what regional grids expect to deliver this decade.",
    image: chips,
    sources: ["Signal Desk", "Meridian Wire"],
    publishedAt: "2h ago",
    readingTime: "6 min",
    bullets: [
      "Combined 2026 capacity plans exceed 100 GW",
      "Cluster demand up 7.2% month-over-month",
      "Two regional grids have paused new interconnect requests",
    ],
    whyItMatters:
      "Where compute gets built decides which regions capture the jobs, the tax base, and the power price increases that come with them.",
    timeline: [
      { time: "07:00", event: "Capacity filings surface" },
      { time: "09:45", event: "Grid operator pauses interconnects" },
      { time: "14:10", event: "Industry group responds" },
    ],
    coverage: [
      { source: "Signal Desk", label: "Analysis", angle: "Reading the capacity filings" },
      { source: "Meridian Wire", label: "Opinion", angle: "The case against subsidised power deals" },
    ],
  },
  {
    id: "markets-open",
    category: "Business",
    headline: "Northwind merger clears review, reshaping regional logistics",
    dek: "Conditions attached to the deal require divestment of two freight hubs.",
    image: markets,
    sources: ["Meridian Wire", "The Ledger"],
    publishedAt: "3h ago",
    readingTime: "3 min",
    bullets: [
      "Approval carries two mandatory hub divestments",
      "Combined network covers 41 metro areas",
      "Closing expected before the end of the quarter",
    ],
    whyItMatters:
      "Consolidation in regional freight tends to show up in shipping rates within two quarters, especially for smaller shippers.",
    timeline: [
      { time: "09:00", event: "Decision published" },
      { time: "10:30", event: "Companies confirm divestments" },
      { time: "13:15", event: "Competitors respond" },
    ],
    coverage: [
      { source: "Meridian Wire", label: "Official Source", angle: "Full text of the decision" },
      { source: "The Ledger", label: "Fact Check Available", angle: "Checking the jobs claim" },
    ],
  },
];

export const shorts = articles.map((a, i) => ({
  id: a.id,
  category: a.category,
  headline: a.headline,
  summary: a.bullets.slice(0, 2).join(". ") + ".",
  image: [grid, chips, datacenter, markets][i % 4],
  source: a.sources[0],
  publishedAt: a.publishedAt,
}));

export const videos = [
  {
    id: "v-compute",
    title: "Inside the compute land-grab",
    category: "AI",
    duration: "3:12",
    source: "Signal Desk",
    views: "128k",
    image: datacenter,
    aiBrief: false,
  },
  {
    id: "v-cooling",
    title: "How liquid cooling changed the numbers",
    category: "Energy",
    duration: "2:04",
    source: "Helios Grid",
    views: "64k",
    image: grid,
    aiBrief: true,
    status: "Ready",
  },
  {
    id: "v-markets",
    title: "Markets in 90 seconds",
    category: "Markets",
    duration: "1:30",
    source: "The Ledger",
    views: "212k",
    image: markets,
    aiBrief: true,
    status: "Processing",
  },
  {
    id: "v-chips",
    title: "The chip cycle, explained",
    category: "Technology",
    duration: "4:48",
    source: "TechWire",
    views: "89k",
    image: chips,
    aiBrief: false,
  },
];

export const suggestedQuestions = [
  "What happened in markets today?",
  "Why are inference costs falling?",
  "Summarize today's AI updates",
  "What should I watch tomorrow?",
];
