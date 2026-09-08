export function SectionHeader({
  title,
  meta,
}: {
  title: string;
  meta?: string;
}) {
  return (
    <div className="flex items-center justify-between px-5 pt-8">
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-foreground/80">
        {title}
      </h2>
      {meta && <span className="text-[11px] text-muted-foreground">{meta}</span>}
    </div>
  );
}
