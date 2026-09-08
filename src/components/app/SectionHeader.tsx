export function SectionHeader({
  title,
  meta,
}: {
  title: string;
  meta?: string;
}) {
  return (
    <div className="flex items-end justify-between px-5 pt-9">
      <h2 className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-foreground/85">
        <span className="h-4 w-1 rounded-full gradient-brand" />
        {title}
      </h2>
      {meta && (
        <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] uppercase tracking-wide text-muted-foreground ring-1 ring-border">
          {meta}
        </span>
      )}
    </div>
  );
}
