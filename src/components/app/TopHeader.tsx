import { Link } from "@tanstack/react-router";
import { Bell, Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";
import logoAsset from "@/assets/7-awake-news-logo.png.asset.json";

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
      className={`sticky top-0 z-20 grid grid-cols-[40px_1fr_88px] items-center px-5 transition-all duration-300 ${
        stuck
          ? "glass-bar border-b border-border py-3"
          : "border-b border-transparent pt-6 pb-3"
      }`}
    >
      <span className="grid size-10 place-items-center text-foreground" aria-hidden="true">
        <Menu className="size-5" />
      </span>
      <Link to="/" className="flex items-center justify-center gap-2">
        <img
          src={logoAsset.url}
          alt="7AWAKE NEWS NETWORK DIGITAL logo"
          width={38}
          height={38}
          className="size-9 object-contain"
        />
        <div className="leading-none">
          <p className="whitespace-nowrap font-display text-[10px] uppercase text-ink">
            7AWAKE <span className="text-primary">NEWS</span> NETWORK DIGITAL
          </p>
          <p className="text-center text-[8px] font-semibold uppercase text-primary">
            {subtitle}
          </p>
        </div>
      </Link>
      <div className="flex items-center justify-end gap-2">
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
