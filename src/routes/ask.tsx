import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { suggestedQuestions } from "@/lib/news-data";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
      { title: "Ask NewsAI" },
      {
        name: "description",
        content:
          "Ask questions about today's news and get grounded answers from the stories in your feed.",
      },
      { property: "og:title", content: "Ask NewsAI" },
      {
        property: "og:description",
        content: "A news assistant that answers from today's reporting.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Ask,
});

function Ask() {
  const [asked, setAsked] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  return (
    <AppShell>
      <div className="flex items-center gap-3 px-5 pt-6">
        <Link
          to="/"
          className="btn-press grid size-9 place-items-center rounded-full bg-secondary ring-1 ring-border"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-xl tracking-tight">Ask NewsAI</h1>
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent">
            News assistant
          </p>
        </div>
      </div>

      <div className="min-h-[50svh] px-5 pt-6">
        {asked ? (
          <div className="space-y-3">
            <div className="ml-auto w-fit max-w-[85%] rounded-3xl rounded-br-lg bg-primary px-4 py-3 text-sm">
              {asked}
            </div>
            <div className="w-fit max-w-[90%] rounded-3xl rounded-bl-lg bg-card px-4 py-3 text-sm text-muted-foreground ring-1 ring-border">
              The assistant isn't connected to a live news source yet, so it
              can't answer this for real. Once the backend is switched on, this
              answer will be written from today's indexed reporting with the
              sources listed underneath.
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-card p-5 ring-1 ring-border">
            <p className="text-sm font-semibold">Ask about today's news</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Answers are drawn from the stories in your feed, with sources
              attached.
            </p>
          </div>
        )}

        {!asked && (
          <div className="mt-5 space-y-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => setAsked(q)}
                className="btn-press w-full rounded-2xl bg-secondary px-4 py-3 text-left text-sm ring-1 ring-border"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-20 z-10 mx-auto w-full max-w-[440px] px-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            setAsked(draft.trim());
            setDraft("");
          }}
          className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2.5 ring-1 ring-border backdrop-blur focus-within:ring-primary/60"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask anything about the news"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="btn-press grid size-9 shrink-0 place-items-center rounded-full gradient-brand"
            aria-label="Send question"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
