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
        <div key={pathname} className="page-enter relative">
          {children}
        </div>
      </div>

      <nav className="safe-bottom fixed inset-x-4 bottom-3 z-30 mx-auto flex w-[calc(100%-2rem)] max-w-[408px] items-center justify-around rounded-[28px] border border-foreground/10 bg-ink/95 px-2 pt-2 shadow-2xl backdrop-blur-xl">
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
                  ? "text-accent"
                  : "text-background/55 hover:text-background"
              }`}
            >
              {active && (
                <span className="pointer-events-none absolute inset-x-3 inset-y-0 -z-10 rounded-2xl bg-primary/20 ring-1 ring-primary/35" />
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
