export function SectionHeader({
  title,
  meta,
}: {
  title: string;
  meta?: string;
}) {
  return (
    <div className="flex items-end justify-between px-5 pt-8">
      <h2 className="flex items-center gap-2.5 font-display text-lg text-foreground">
        <span className="h-5 w-1 bg-primary" />
        {title}
      </h2>
      {meta && (
        <span className="text-[10px] font-semibold uppercase text-primary">
          {meta}
        </span>
      )}
    </div>
  );
}
