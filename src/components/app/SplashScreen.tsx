import { useEffect, useState } from "react";
import logoMark from "@/assets/newsai-logo.png";

const SESSION_KEY = "newsai:splash-shown";
const HOLD_MS = 1100;
const FADE_MS = 520;

export function SplashScreen() {
  // Rendered on the server too, so it covers the first paint instead of
  // flashing in after hydration.
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let shown = false;
    try {
      shown = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      shown = false;
    }
    if (shown) {
      setVisible(false);
      return;
    }

    document.body.style.overflow = "hidden";

    const t1 = window.setTimeout(() => setLeaving(true), HOLD_MS);
    const t2 = window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
    }, HOLD_MS + FADE_MS);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-background ${
        leaving ? "splash-out" : ""
      }`}
    >
      <div className="pointer-events-none absolute -left-24 -top-28 size-80 rounded-full bg-primary/40 blur-3xl glow-pulse" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-80 rounded-full bg-accent/30 blur-3xl glow-pulse" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-56 -translate-y-1/2 bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-primary)_22%,transparent),transparent)] blur-2xl" />

      <div className="relative flex flex-col items-center px-8 text-center">
        <div className="relative grid size-24 place-items-center">
          <span className="splash-ring absolute inset-0 rounded-[28px] border border-primary/40" />
          <span className="splash-ring absolute inset-2 rounded-[24px] border border-accent/40 [animation-delay:0.35s]" />
          <img
            src={logoMark}
            alt=""
            width={64}
            height={64}
            className="splash-mark size-16 drop-shadow-[0_10px_30px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]"
          />
        </div>

        <h1 className="splash-title mt-7 font-display text-3xl tracking-tight">NewsAI</h1>
        <p className="splash-tagline mt-2 text-sm text-muted-foreground">
          News that matters to you.
        </p>

        <div className="splash-tagline mt-8 h-1 w-40 overflow-hidden rounded-full bg-secondary">
          <span className="splash-bar block h-full w-1/3 rounded-full gradient-brand" />
        </div>
      </div>
    </div>
  );
}
