import { Link } from "@tanstack/react-router";
import { Bell, MapPin, Search } from "lucide-react";

export function TopHeader({ subtitle = "Briefing" }: { subtitle?: string }) {
  return (
    <div className="relative flex items-center justify-between px-5 pt-6">
      <Link to="/" className="flex items-center gap-2">
        <div className="grid size-9 place-items-center rounded-xl gradient-brand text-[13px] font-bold">
          N
        </div>
        <div className="leading-none">
          <p className="font-display text-lg tracking-tight">
            News<span className="text-accent">AI</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <button className="btn-press flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs text-muted-foreground ring-1 ring-border">
          <MapPin className="size-3 text-accent" /> SF
        </button>
        <Link
          to="/search"
          className="btn-press grid size-9 place-items-center rounded-full bg-secondary text-muted-foreground ring-1 ring-border"
        >
          <Search className="size-4" />
        </Link>
        <Link
          to="/notifications"
          className="btn-press relative grid size-9 place-items-center rounded-full bg-secondary text-muted-foreground ring-1 ring-border"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive ring-2 ring-background" />
        </Link>
      </div>
    </div>
  );
}
