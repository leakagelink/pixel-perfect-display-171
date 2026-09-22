import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { suggestedQuestions } from "@/lib/news-data";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
       { title: "Ask 7 Awake News — AI Assistant" },
      {
        name: "description",
        content:
          "Ask questions about today's news and get grounded answers from the stories in your feed.",
      },
      { property: "og:title", content: "Ask 7 Awake News" },
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
          <h1 className="text-xl tracking-tight">Ask 7 Awake News</h1>
        <p className="text-[11px] font-semibold uppercase text-primary">
            News assistant
          </p>
        </div>
      </div>

      <div className="min-h-[50svh] px-5 pt-6">
        {asked ? (
          <div className="space-y-3">
            <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm text-primary-foreground">
              {asked}
            </div>
            <div className="w-fit max-w-[90%] border-l-2 border-primary bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
              The assistant isn't connected to a live news source yet, so it
              can't answer this for real. Once the backend is switched on, this
              answer will be written from today's indexed reporting with the
              sources listed underneath.
            </div>
          </div>
        ) : (
           <div className="border-y border-border py-5">
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
                 className="btn-press w-full border-b border-border bg-secondary/60 px-4 py-3 text-left text-sm"
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
          className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 shadow-lg focus-within:border-primary"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask anything about the news"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="btn-press grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
            aria-label="Send question"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
