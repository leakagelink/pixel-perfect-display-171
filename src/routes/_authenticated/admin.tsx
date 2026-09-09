import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Plus, Pencil, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — NewsAI" },
      {
        name: "description",
        content: "Manage NewsAI articles, shorts, videos, breaking news and users.",
      },
      { property: "og:title", content: "Admin — NewsAI" },
      {
        property: "og:description",
        content: "Manage NewsAI articles, shorts, videos, breaking news and users.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

type FieldType = "text" | "textarea" | "number" | "bool" | "list";
type Field = { name: string; label: string; type: FieldType; required?: boolean };
type Collection = {
  key: string;
  table: string;
  label: string;
  titleField: string;
  subField?: string;
  orderBy: { column: string; ascending: boolean };
  fields: Field[];
};

const collections: Collection[] = [
  {
    key: "articles",
    table: "articles",
    label: "Articles",
    titleField: "headline",
    subField: "category",
    orderBy: { column: "published_at", ascending: false },
    fields: [
      { name: "headline", label: "Headline", type: "text", required: true },
      { name: "slug", label: "Slug (URL id)", type: "text", required: true },
      { name: "category", label: "Category", type: "text" },
      { name: "dek", label: "Short intro", type: "textarea" },
      { name: "image_url", label: "Image URL", type: "text" },
      { name: "sources", label: "Sources (one per line)", type: "list" },
      { name: "bullets", label: "Key points (one per line)", type: "list" },
      { name: "why_it_matters", label: "Why it matters", type: "textarea" },
      { name: "reading_time", label: "Reading time", type: "text" },
      { name: "is_featured", label: "Featured", type: "bool" },
      { name: "is_published", label: "Published", type: "bool" },
    ],
  },
  {
    key: "shorts",
    table: "shorts",
    label: "Shorts",
    titleField: "headline",
    subField: "category",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "headline", label: "Headline", type: "text", required: true },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "category", label: "Category", type: "text" },
      { name: "source", label: "Source", type: "text" },
      { name: "image_url", label: "Image URL", type: "text" },
      { name: "sort_order", label: "Order", type: "number" },
      { name: "is_published", label: "Published", type: "bool" },
    ],
  },
  {
    key: "videos",
    table: "videos",
    label: "Videos",
    titleField: "title",
    subField: "category",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "category", label: "Category", type: "text" },
      { name: "duration", label: "Duration", type: "text" },
      { name: "source", label: "Source", type: "text" },
      { name: "views", label: "Views label", type: "text" },
      { name: "image_url", label: "Thumbnail URL", type: "text" },
      { name: "video_url", label: "Video URL", type: "text" },
      { name: "status", label: "Status", type: "text" },
      { name: "ai_brief", label: "AI brief", type: "bool" },
      { name: "sort_order", label: "Order", type: "number" },
      { name: "is_published", label: "Published", type: "bool" },
    ],
  },
  {
    key: "breaking",
    table: "breaking_news",
    label: "Breaking",
    titleField: "text",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "text", label: "Headline", type: "text", required: true },
      { name: "sort_order", label: "Order", type: "number" },
      { name: "is_active", label: "Active", type: "bool" },
    ],
  },
  {
    key: "trending",
    table: "trending_topics",
    label: "Trending",
    titleField: "tag",
    subField: "count_label",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "tag", label: "Tag", type: "text", required: true },
      { name: "count_label", label: "Count label", type: "text" },
      { name: "sort_order", label: "Order", type: "number" },
      { name: "is_active", label: "Active", type: "bool" },
    ],
  },
  {
    key: "notifications",
    table: "notifications",
    label: "Notifications",
    titleField: "title",
    subField: "kind",
    orderBy: { column: "created_at", ascending: false },
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "body", label: "Message", type: "textarea" },
      { name: "kind", label: "Type (Breaking, Markets…)", type: "text" },
    ],
  },
];

type Row = Record<string, unknown>;

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<string>("articles");
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleQuery = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return false;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "admin")
        .maybeSingle();
      return Boolean(data);
    },
  });

  const collection = useMemo(
    () => collections.find((c) => c.key === tab) ?? collections[0]!,
    [tab],
  );

  const listQuery = useQuery({
    queryKey: ["admin", collection.table],
    enabled: tab !== "users" && roleQuery.data === true,
    queryFn: async () => {
      const { data, error: err } = await supabase
        .from(collection.table as "articles")
        .select("*")
        .order(collection.orderBy.column as "created_at", {
          ascending: collection.orderBy.ascending,
        });
      if (err) throw err;
      return (data ?? []) as unknown as Row[];
    },
  });

  const usersQuery = useQuery({
    queryKey: ["admin", "users"],
    enabled: tab === "users" && roleQuery.data === true,
    queryFn: async () => {
      const [{ data: profiles }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      return (profiles ?? []).map((p) => ({
        ...p,
        role:
          (roles ?? []).find((r) => r.user_id === p.id)?.role ?? "user",
      }));
    },
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function save(values: Row, id?: string) {
    setError(null);
    const table = collection.table as "articles";
    const res = id
      ? await supabase.from(table).update(values as never).eq("id", id)
      : await supabase.from(table).insert(values as never);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    setEditing(null);
    setCreating(false);
    queryClient.invalidateQueries({ queryKey: ["admin", collection.table] });
  }

  async function remove(id: string) {
    setError(null);
    const { error: err } = await supabase
      .from(collection.table as "articles")
      .delete()
      .eq("id", id);
    if (err) {
      setError(err.message);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["admin", collection.table] });
  }

  if (roleQuery.isLoading) {
    return <Centered>Checking access…</Centered>;
  }

  if (roleQuery.data !== true) {
    return (
      <Centered>
        <p className="text-sm">This account does not have admin access.</p>
        <button
          onClick={signOut}
          className="btn-press mt-4 rounded-2xl bg-secondary px-4 py-2 text-xs ring-1 ring-border"
        >
          Sign out
        </button>
      </Centered>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="glass-bar sticky top-0 z-20 flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg gradient-brand text-[12px] font-bold">
            N
          </div>
          <div className="leading-none">
            <p className="font-display text-base tracking-tight">Admin</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              NewsAI control
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="btn-press rounded-full bg-secondary px-3 py-1.5 text-xs ring-1 ring-border"
          >
            View app
          </Link>
          <button
            onClick={signOut}
            aria-label="Sign out"
            className="btn-press grid size-9 place-items-center rounded-full bg-secondary ring-1 ring-border"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto border-b border-border px-5 py-3 no-scrollbar">
        {[...collections.map((c) => ({ key: c.key, label: c.label })), { key: "users", label: "Users" }].map(
          (t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setEditing(null);
                setCreating(false);
              }}
              className={`btn-press shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium ring-1 ${
                tab === t.key
                  ? "bg-primary text-primary-foreground ring-primary/50"
                  : "bg-secondary text-muted-foreground ring-border"
              }`}
            >
              {t.label}
            </button>
          ),
        )}
      </div>

      <main className="mx-auto w-full max-w-3xl px-5 py-6">
        {error && (
          <p className="mb-4 rounded-2xl bg-destructive/15 px-4 py-3 text-xs text-destructive ring-1 ring-destructive/30">
            {error}
          </p>
        )}

        {tab === "users" ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              {usersQuery.data?.length ?? 0} registered users
            </p>
            {(usersQuery.data ?? []).map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between card-surface rounded-2xl p-4 ring-1 ring-border"
              >
                <div>
                  <p className="text-sm font-medium">{u.full_name ?? "—"}</p>
                  <p className="text-[11px] text-muted-foreground">{u.email}</p>
                </div>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] uppercase tracking-wide ring-1 ring-border">
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {listQuery.data?.length ?? 0} {collection.label.toLowerCase()}
              </p>
              <button
                onClick={() => {
                  setCreating(true);
                  setEditing(null);
                }}
                className="btn-press flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                <Plus className="size-3.5" /> New
              </button>
            </div>

            {(creating || editing) && (
              <RecordForm
                key={editing ? String(editing["id"]) : "new"}
                collection={collection}
                initial={editing}
                onCancel={() => {
                  setCreating(false);
                  setEditing(null);
                }}
                onSave={(values) =>
                  save(values, editing ? String(editing["id"]) : undefined)
                }
              />
            )}

            <div className="mt-4 space-y-2">
              {listQuery.isLoading && (
                <p className="text-xs text-muted-foreground">Loading…</p>
              )}
              {(listQuery.data ?? []).map((row) => (
                <div
                  key={String(row["id"])}
                  className="flex items-start justify-between gap-3 card-surface rounded-2xl p-4 ring-1 ring-border"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {String(row[collection.titleField] ?? "")}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {collection.subField
                        ? String(row[collection.subField] ?? "")
                        : ""}
                      {"is_published" in row &&
                        ` · ${row["is_published"] ? "Published" : "Draft"}`}
                      {"is_active" in row &&
                        ` · ${row["is_active"] ? "Active" : "Hidden"}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      aria-label="Edit"
                      onClick={() => {
                        setEditing(row);
                        setCreating(false);
                      }}
                      className="btn-press grid size-9 place-items-center rounded-full bg-secondary ring-1 ring-border"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      aria-label="Delete"
                      onClick={() => remove(String(row["id"]))}
                      className="btn-press grid size-9 place-items-center rounded-full bg-destructive/15 text-destructive ring-1 ring-destructive/30"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-6 text-center text-foreground">
      <div>{children}</div>
    </div>
  );
}

function RecordForm({
  collection,
  initial,
  onSave,
  onCancel,
}: {
  collection: Collection;
  initial: Row | null;
  onSave: (values: Row) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<Record<string, string | boolean>>({});

  useEffect(() => {
    const next: Record<string, string | boolean> = {};
    for (const f of collection.fields) {
      const raw = initial?.[f.name];
      if (f.type === "bool") next[f.name] = Boolean(raw ?? true);
      else if (f.type === "list")
        next[f.name] = Array.isArray(raw) ? (raw as string[]).join("\n") : "";
      else next[f.name] = raw === null || raw === undefined ? "" : String(raw);
    }
    setValues(next);
  }, [collection, initial]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload: Row = {};
    for (const f of collection.fields) {
      const v = values[f.name];
      if (f.type === "bool") payload[f.name] = Boolean(v);
      else if (f.type === "number") payload[f.name] = Number(v || 0);
      else if (f.type === "list")
        payload[f.name] = String(v || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      else payload[f.name] = String(v ?? "");
    }
    onSave(payload);
  }

  return (
    <form
      onSubmit={submit}
      className="card-surface rounded-3xl p-5 ring-1 ring-border"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">
          {initial ? "Edit" : "New"} {collection.label.replace(/s$/, "")}
        </p>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="btn-press grid size-8 place-items-center rounded-full bg-secondary ring-1 ring-border"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {collection.fields.map((f) => (
          <label key={f.name} className="block">
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {f.label}
            </span>
            {f.type === "bool" ? (
              <button
                type="button"
                onClick={() =>
                  setValues((v) => ({ ...v, [f.name]: !v[f.name] }))
                }
                className={`mt-1 block h-6 w-11 rounded-full p-0.5 transition-colors ${
                  values[f.name] ? "bg-primary" : "bg-secondary"
                }`}
              >
                <span
                  className={`block size-5 rounded-full bg-foreground transition-transform ${
                    values[f.name] ? "translate-x-5" : ""
                  }`}
                />
              </button>
            ) : f.type === "textarea" || f.type === "list" ? (
              <textarea
                rows={f.type === "list" ? 4 : 3}
                value={String(values[f.name] ?? "")}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [f.name]: e.target.value }))
                }
                className="mt-1 w-full rounded-2xl bg-secondary px-4 py-3 text-sm ring-1 ring-border outline-none"
              />
            ) : (
              <input
                type={f.type === "number" ? "number" : "text"}
                required={f.required}
                value={String(values[f.name] ?? "")}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [f.name]: e.target.value }))
                }
                className="mt-1 w-full rounded-2xl bg-secondary px-4 py-3 text-sm ring-1 ring-border outline-none"
              />
            )}
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="btn-press mt-5 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
      >
        Save
      </button>
    </form>
  );
}
