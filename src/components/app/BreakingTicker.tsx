import { useLanguage } from "@/lib/language";

export function BreakingTicker({ headlines }: { headlines?: string[] }) {
  const { t } = useLanguage();
  const base = headlines ?? [];
  if (base.length === 0) return null;
  const items = [...base, ...base];
  return (
    <div className="ticker-mask overflow-hidden border-y border-primary/15 bg-primary/[0.045]">
      <div className="ticker-track flex w-max items-center gap-8 py-2 pr-8 text-[10px] font-semibold uppercase">
        <span className="flex items-center gap-2 text-primary">
          <span className="size-1.5 animate-pulse rounded-full bg-destructive" />
          {t("breaking")}
        </span>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="text-foreground/70">{item}</span>
            <span className="text-primary">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
