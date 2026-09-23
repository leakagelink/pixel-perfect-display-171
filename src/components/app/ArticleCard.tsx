import { Link } from "@tanstack/react-router";
import { Bookmark, Clock } from "lucide-react";
import type { FeedArticle as Article } from "@/lib/content.functions";
import { localizeArticle, useLanguage } from "@/lib/language";

const chipStyles = [
  "bg-primary/10 text-primary ring-primary/25",
  "bg-accent/20 text-accent-foreground ring-accent/35",
  "bg-secondary text-muted-foreground ring-border",
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
  const { language, t } = useLanguage();
  const shown = localizeArticle(article, language);
  return (
    <Link
      to="/article/$articleId"
      params={{ articleId: article.id }}
      style={{ animationDelay: `${Math.min(index, 6) * 70}ms` }}
      className={`group block rise-in ${withImage ? "overflow-hidden rounded-2xl bg-card shadow-[0_14px_34px_-24px_color-mix(in_oklab,var(--ink)_50%,transparent)] ring-1 ring-border" : "border-b border-border py-4"}`}
    >
      {withImage && (
        <div className="relative overflow-hidden">
          <img
            src={article.image}
            alt={shown.headline}
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-background/70 px-2.5 py-1 text-[10px] text-foreground/80 backdrop-blur-sm">
            <Clock className="size-3 text-primary" />
            {shown.readingTime}
          </span>
        </div>
      )}
      <div className={`${withImage ? "px-4 pt-4" : ""} flex flex-wrap gap-1.5`}>
        {shown.sources.map((s, i) => (
          <span
            key={s}
            className={`px-0 py-0 text-[10px] font-semibold uppercase ${
              chipStyles[i % chipStyles.length]
            }`}
          >
            {s}
          </span>
        ))}
      </div>
      <h3 className={`${withImage ? "px-4" : ""} mt-2 flex items-start gap-2 text-base font-bold leading-snug text-balance`}>
        <span>{shown.headline}</span>
        <Bookmark className="mt-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </h3>
      <ul className={`${withImage ? "px-4" : ""} mt-2 space-y-1 text-sm text-muted-foreground`}>
        {shown.bullets.slice(0, 2).map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
            {b}
          </li>
        ))}
      </ul>
      <div className={`${withImage ? "mx-4 mb-4" : ""} mt-3 flex items-center gap-3 border-t border-border pt-3 text-[10px] text-muted-foreground`}>
        <span>{shown.publishedAt}</span>
        <span className="size-1 rounded-full bg-muted-foreground/50" />
        <span>{shown.readingTime} {t("reading")}</span>
        <span className="ml-auto text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {t("read")}
        </span>
      </div>
    </Link>
  );
}
