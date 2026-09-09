import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — NewsAI" },
      {
        name: "description",
        content: "Sign in to NewsAI to manage content and your personalized feed.",
      },
      { property: "og:title", content: "Sign in — NewsAI" },
      {
        property: "og:description",
        content: "Sign in to NewsAI to manage content and your personalized feed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
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
    <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col justify-center px-6">
      <div className="pointer-events-none absolute -left-16 -top-24 size-72 rounded-full bg-primary/40 blur-3xl floaty" />
      <div className="relative card-surface rounded-3xl p-6 ring-1 ring-border">
        <div className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl gradient-brand text-[13px] font-bold">
            N
          </div>
          <p className="font-display text-lg tracking-tight">
            News<span className="text-accent">AI</span>
          </p>
        </div>
        <h1 className="mt-5 text-2xl tracking-tight">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Admin access to manage the app.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm ring-1 ring-border outline-none"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm ring-1 ring-border outline-none"
          />
          {msg && <p className="text-xs text-destructive">{msg}</p>}
          <button
            type="submit"
            disabled={busy}
            className="btn-press w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
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
            ? "First time? Create the account"
            : "Already have an account? Sign in"}
        </button>

        <Link
          to="/"
          className="mt-6 block text-center text-xs text-muted-foreground hover:text-foreground"
        >
          ← Back to app
        </Link>
      </div>
    </div>
  );
}
