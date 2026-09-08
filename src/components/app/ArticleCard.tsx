import { Link } from "@tanstack/react-router";
import type { Article } from "@/lib/news-data";

const chipStyles = [
  "bg-primary/20 ring-primary/40",
  "bg-accent/20 ring-accent/40",
  "bg-foreground/10 ring-border",
];

export function ArticleCard({
  article,
  withImage = false,
}: {
  article: Article;
  withImage?: boolean;
}) {
  return (
    <Link
      to="/article/$articleId"
      params={{ articleId: article.id }}
      className="btn-press block rounded-3xl bg-card p-5 ring-1 ring-border rise-in"
    >
      {withImage && (
        <img
          src={article.image}
          alt={article.headline}
          loading="lazy"
          className="aspect-[16/10] w-full rounded-xl object-cover"
        />
      )}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {article.sources.map((s, i) => (
          <span
            key={s}
            className={`rounded-full px-2.5 py-1 text-[10px] font-medium ring-1 ${
              chipStyles[i % chipStyles.length]
            }`}
          >
            {s}
          </span>
        ))}
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-balance">
        {article.headline}
      </h3>
      <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        {article.bullets.slice(0, 2).map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
        <span>{article.publishedAt}</span>
        <span>·</span>
        <span>{article.readingTime} read</span>
      </div>
    </Link>
  );
}
