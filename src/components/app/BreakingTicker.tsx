import { breaking as fallbackBreaking } from "@/lib/news-data";

export function BreakingTicker({ headlines }: { headlines?: string[] }) {
  const base = headlines && headlines.length > 0 ? headlines : fallbackBreaking;
  const items = [...base, ...base];
  return (
    <div className="ticker-mask mt-5 overflow-hidden border-y border-border bg-secondary/60">
      <div className="ticker-track flex w-max items-center gap-8 py-2 pr-8 text-[11px] uppercase tracking-[0.15em]">
        <span className="flex items-center gap-2 text-destructive">
          <span className="size-1.5 animate-pulse rounded-full bg-destructive" />
          Breaking
        </span>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="text-foreground/70">{item}</span>
            <span className="text-accent">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
