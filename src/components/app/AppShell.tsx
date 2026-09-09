import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Home, Layers, Play, Search, User } from "lucide-react";
import { SplashScreen } from "@/components/app/SplashScreen";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/shorts", label: "Shorts", icon: Layers },
  { to: "/video", label: "Video", icon: Play },
  { to: "/search", label: "Search", icon: Search },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="mx-auto min-h-screen w-full max-w-[440px] bg-background pb-28 text-foreground">
      <SplashScreen />
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-16 -top-24 size-72 rounded-full bg-primary/40 blur-3xl floaty glow-pulse" />
        <div className="pointer-events-none absolute -right-20 top-40 size-72 rounded-full bg-accent/25 blur-3xl floaty glow-pulse" />
        <div key={pathname} className="page-enter relative">
          {children}
        </div>
      </div>

      <nav className="safe-bottom glass-bar fixed inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-[440px] items-center justify-around border-t border-border px-2 pt-2">
        {nav.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`btn-press relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <span className="pointer-events-none absolute inset-x-3 inset-y-0 -z-10 rounded-2xl bg-primary/12 ring-1 ring-primary/25" />
              )}
              <Icon
                className={`size-[18px] transition-transform duration-200 ${
                  active ? "-translate-y-0.5 scale-110" : ""
                }`}
                strokeWidth={2.2}
              />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
