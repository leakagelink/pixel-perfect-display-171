import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock } from "lucide-react";
import type { Article } from "@/lib/news-data";

const chipStyles = [
  "bg-primary/20 ring-primary/40",
  "bg-accent/20 ring-accent/40",
  "bg-foreground/10 ring-border",
];

export function ArticleCard({
  article,
  withImage = false,
  index = 0,
}: {
  article: Article;
  withImage?: boolean;
  index?: number;
}) {
  return (
    <Link
      to="/article/$articleId"
      params={{ articleId: article.id }}
      style={{ animationDelay: `${Math.min(index, 6) * 70}ms` }}
      className="card-surface group block rounded-3xl p-5 ring-1 ring-border rise-in"
    >
      {withImage && (
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={article.image}
            alt={article.headline}
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
          <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-background/70 px-2.5 py-1 text-[10px] text-foreground/80 backdrop-blur-sm">
            <Clock className="size-3 text-accent" />
            {article.readingTime}
          </span>
        </div>
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
      <h3 className="mt-3 flex items-start gap-2 text-lg font-semibold leading-snug tracking-tight text-balance">
        <span>{article.headline}</span>
        <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:-translate-y-0.5 group-hover:text-accent" />
      </h3>
      <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        {article.bullets.slice(0, 2).map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
        <span>{article.publishedAt}</span>
        <span className="size-1 rounded-full bg-muted-foreground/50" />
        <span>{article.readingTime} read</span>
        <span className="ml-auto text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Read
        </span>
      </div>
    </Link>
  );
}
