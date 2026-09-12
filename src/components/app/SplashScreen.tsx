import { useEffect, useState } from "react";
import logoAsset from "@/assets/7-awake-news-logo.png.asset.json";

const SESSION_KEY = "7awake:splash-shown";
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
      <div className="relative flex flex-col items-center px-8 text-center">
        <div className="relative grid size-24 place-items-center">
          <span className="splash-ring absolute inset-0 rounded-[28px] border border-primary/40" />
          <span className="splash-ring absolute inset-2 rounded-[24px] border border-primary/25 [animation-delay:0.35s]" />
          <img
            src={logoAsset.url}
            alt=""
            width={80}
            height={80}
            className="splash-mark size-20 object-contain drop-shadow-[0_10px_30px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]"
          />
        </div>

        <h1 className="splash-title mt-7 font-display text-3xl tracking-tight">7 Awake News</h1>
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
