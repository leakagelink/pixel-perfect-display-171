import { Link } from "@tanstack/react-router";
import { Bell, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";

export function TopHeader({ subtitle = "Briefing" }: { subtitle?: string }) {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-20 flex items-center justify-between px-5 transition-all duration-300 ${
        stuck
          ? "glass-bar border-b border-border py-3"
          : "border-b border-transparent pt-6 pb-3"
      }`}
    >
      <Link to="/" className="flex items-center gap-2">
        <div className="shimmer-sweep grid size-9 place-items-center rounded-xl gradient-brand text-[13px] font-bold">
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
        <button className="btn-press flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs text-muted-foreground ring-1 ring-border hover:text-foreground">
          <MapPin className="size-3 text-accent" /> SF
        </button>
        <Link
          to="/search"
          aria-label="Search"
          className="btn-press grid size-9 place-items-center rounded-full bg-secondary text-muted-foreground ring-1 ring-border hover:text-foreground"
        >
          <Search className="size-4" />
        </Link>
        <Link
          to="/notifications"
          aria-label="Notifications"
          className="btn-press relative grid size-9 place-items-center rounded-full bg-secondary text-muted-foreground ring-1 ring-border hover:text-foreground"
        >
          <Bell className="size-4" />
          <span className="pulse-ring absolute right-2 top-2 size-2 rounded-full bg-destructive ring-2 ring-background" />
        </Link>
      </div>
    </header>
  );
}
