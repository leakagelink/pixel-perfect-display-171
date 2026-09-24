import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { Home, Layers, Play, Search, User } from "lucide-react";
import { SplashScreen } from "@/components/app/SplashScreen";
import { useLanguage } from "@/lib/language";
import fallbackImage from "@/assets/news-datacenter.jpg";

const nav = [
  { to: "/", key: "home", icon: Home },
  { to: "/shorts", key: "shorts", icon: Layers },
  { to: "/video", key: "video", icon: Play },
  { to: "/search", key: "search", icon: Search },
  { to: "/profile", key: "profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useLanguage();

  // If any image fails to load (e.g. a non-public Google Drive link),
  // swap in a default news image instead of showing a broken tile.
  useEffect(() => {
    const handler = (e: Event) => {
      const img = e.target as HTMLImageElement;
      if (img.tagName === "IMG" && !img.dataset["fallbackApplied"]) {
        img.dataset["fallbackApplied"] = "1";
        img.src = fallbackImage;
      }
    };
    document.addEventListener("error", handler, true);
    // Catch images that already failed before hydration.
    const swapBroken = () => {
      document.querySelectorAll("img").forEach((img) => {
        if (img.complete && img.naturalWidth === 0 && !img.dataset["fallbackApplied"]) {
          img.dataset["fallbackApplied"] = "1";
          img.src = fallbackImage;
        }
      });
    };
    swapBroken();
    const timer = window.setTimeout(swapBroken, 1500);
    return () => {
      document.removeEventListener("error", handler, true);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] bg-background pb-24 text-foreground shadow-[0_0_50px_-28px_color-mix(in_oklab,var(--ink)_35%,transparent)]">
      <SplashScreen />
      <div className="relative overflow-hidden">
        <div key={pathname} className="page-enter relative">
          {children}
        </div>
      </div>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-[480px] items-center justify-around border-t border-border bg-background/95 px-3 pt-2 shadow-[0_-12px_30px_-24px_color-mix(in_oklab,var(--ink)_40%,transparent)] backdrop-blur-xl">
        {nav.map(({ to, key, icon: Icon }) => {
          const label = t(key);
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`btn-press relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 py-1.5 ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <span className="pointer-events-none absolute inset-x-4 bottom-0 h-0.5 bg-primary" />
              )}
              <Icon
                className={`size-[18px] transition-transform duration-200 ${
                  active ? "-translate-y-0.5 scale-110" : ""
                }`}
                strokeWidth={2.2}
              />
              <span className="text-[9px] font-semibold uppercase">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
