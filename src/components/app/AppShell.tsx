import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Home, Layers, Play, Search, User } from "lucide-react";

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
    <div className="mx-auto min-h-screen w-full max-w-[440px] bg-background pb-24 text-foreground">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-16 -top-24 size-72 rounded-full bg-primary/40 blur-3xl floaty" />
        <div className="pointer-events-none absolute -right-20 top-40 size-72 rounded-full bg-accent/25 blur-3xl floaty" />
        <div className="relative">{children}</div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-[440px] items-center justify-around border-t border-border bg-background/85 px-2 py-3 backdrop-blur-md">
        {nav.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`btn-press flex flex-col items-center gap-1 ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-4" strokeWidth={2.2} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
