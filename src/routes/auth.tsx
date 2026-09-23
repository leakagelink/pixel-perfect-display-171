import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/7-awake-news-logo.png.asset.json";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — 7AWAKE NEWS NETWORK DIGITAL" },
      {
        name: "description",
        content: "Sign in to 7AWAKE NEWS NETWORK DIGITAL to manage content and your personalized feed.",
      },
      { property: "og:title", content: "Sign in — 7AWAKE NEWS NETWORK DIGITAL" },
      {
        property: "og:description",
        content: "Sign in to 7AWAKE NEWS NETWORK DIGITAL to manage content and your personalized feed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/admin" });
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col justify-center bg-background px-6">
      <div className="relative border-t-4 border-primary bg-card p-6 shadow-[0_20px_55px_-35px_color-mix(in_oklab,var(--ink)_60%,transparent)] ring-1 ring-border">
        <div className="flex items-center gap-2">
          <img
            src={logoAsset.url}
            alt="7AWAKE NEWS NETWORK DIGITAL logo"
            width={48}
            height={48}
            className="size-12 object-contain"
          />
          <p className="font-display text-sm leading-tight">
            7AWAKE <span className="text-primary">NEWS</span><br />NETWORK DIGITAL
          </p>
        </div>
        <h1 className="mt-5 text-2xl tracking-tight">
           {mode === "signin" ? (language === "bn" ? "সাইন ইন" : "Sign in") : (language === "bn" ? "অ্যাকাউন্ট তৈরি করুন" : "Create account")}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
           {language === "bn" ? "অ্যাপ পরিচালনার জন্য অ্যাডমিন প্রবেশাধিকার।" : "Admin access to manage the app."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
             placeholder={language === "bn" ? "ইমেইল" : "Email"}
            autoComplete="email"
            className="w-full border-b-2 border-border bg-secondary/60 px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
             placeholder={language === "bn" ? "পাসওয়ার্ড" : "Password"}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className="w-full border-b-2 border-border bg-secondary/60 px-4 py-3 text-sm outline-none focus:border-primary"
          />
          {msg && <p className="text-xs text-destructive">{msg}</p>}
          <button
            type="submit"
            disabled={busy}
            className="btn-press w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
             {busy ? (language === "bn" ? "অপেক্ষা করুন…" : "Please wait…") : mode === "signin" ? (language === "bn" ? "সাইন ইন" : "Sign in") : (language === "bn" ? "সাইন আপ" : "Sign up")}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setMsg(null);
          }}
          className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "signin"
             ? (language === "bn" ? "প্রথমবার? অ্যাকাউন্ট তৈরি করুন" : "First time? Create the account")
             : (language === "bn" ? "আগেই অ্যাকাউন্ট আছে? সাইন ইন করুন" : "Already have an account? Sign in")}
        </button>

        <Link
          to="/"
          className="mt-6 block text-center text-xs text-muted-foreground hover:text-foreground"
        >
           ← {language === "bn" ? "অ্যাপে ফিরুন" : "Back to app"}
        </Link>
      </div>
    </div>
  );
}
