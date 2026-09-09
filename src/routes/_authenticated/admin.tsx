import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Newspaper,
  Layers,
  Play,
  Radio,
  TrendingUp,
  Bell,
  Users,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
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
type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  wide?: boolean;
};
type Collection = {
  key: string;
  table: string;
  label: string;
  icon: LucideIcon;
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
    icon: Newspaper,
    titleField: "headline",
    subField: "category",
    orderBy: { column: "published_at", ascending: false },
    fields: [
      { name: "headline", label: "Headline", type: "text", required: true, wide: true },
      { name: "slug", label: "Slug (URL id)", type: "text", required: true },
      { name: "category", label: "Category", type: "text" },
      { name: "dek", label: "Short intro", type: "textarea", wide: true },
      { name: "image_url", label: "Image URL", type: "text", wide: true },
      { name: "sources", label: "Sources (one per line)", type: "list" },
      { name: "bullets", label: "Key points (one per line)", type: "list" },
      { name: "why_it_matters", label: "Why it matters", type: "textarea", wide: true },
      { name: "reading_time", label: "Reading time", type: "text" },
      { name: "is_featured", label: "Featured", type: "bool" },
      { name: "is_published", label: "Published", type: "bool" },
    ],
  },
  {
    key: "shorts",
    table: "shorts",
    label: "Shorts",
    icon: Layers,
    titleField: "headline",
    subField: "category",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "headline", label: "Headline", type: "text", required: true, wide: true },
      { name: "summary", label: "Summary", type: "textarea", wide: true },
      { name: "category", label: "Category", type: "text" },
      { name: "source", label: "Source", type: "text" },
      { name: "image_url", label: "Image URL", type: "text", wide: true },
      { name: "sort_order", label: "Order", type: "number" },
      { name: "is_published", label: "Published", type: "bool" },
    ],
  },
  {
    key: "videos",
    table: "videos",
    label: "Videos",
    icon: Play,
    titleField: "title",
    subField: "category",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "title", label: "Title", type: "text", required: true, wide: true },
      { name: "category", label: "Category", type: "text" },
      { name: "duration", label: "Duration", type: "text" },
      { name: "source", label: "Source", type: "text" },
      { name: "views", label: "Views label", type: "text" },
      { name: "image_url", label: "Thumbnail URL", type: "text", wide: true },
      { name: "video_url", label: "Video URL", type: "text", wide: true },
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
    icon: Radio,
    titleField: "text",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "text", label: "Headline", type: "text", required: true, wide: true },
      { name: "sort_order", label: "Order", type: "number" },
      { name: "is_active", label: "Active", type: "bool" },
    ],
  },
  {
    key: "trending",
    table: "trending_topics",
    label: "Trending",
    icon: TrendingUp,
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
    icon: Bell,
    titleField: "title",
    subField: "kind",
    orderBy: { column: "created_at", ascending: false },
    fields: [
      { name: "title", label: "Title", type: "text", required: true, wide: true },
      { name: "body", label: "Message", type: "textarea", wide: true },
      { name: "kind", label: "Type (Breaking, Markets…)", type: "text" },
    ],
  },
];

const tabs = [
  ...collections.map((c) => ({ key: c.key, label: c.label, icon: c.icon })),
  { key: "users", label: "Users", icon: Users },
];

type Row = Record<string, unknown>;

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<string>("articles");
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

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
        role: (roles ?? []).find((r) => r.user_id === p.id)?.role ?? "user",
      }));
    },
  });

  const rows = useMemo(() => {
    const all = listQuery.data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((r) =>
      [collection.titleField, collection.subField]
        .filter(Boolean)
        .some((f) => String(r[f as string] ?? "").toLowerCase().includes(q)),
    );
  }, [listQuery.data, query, collection]);

  const users = useMemo(() => {
    const all = usersQuery.data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((u) =>
      `${u.full_name ?? ""} ${u.email ?? ""}`.toLowerCase().includes(q),
    );
  }, [usersQuery.data, query]);

  const liveCount = useMemo(
    () =>
      (listQuery.data ?? []).filter(
        (r) =>
          ("is_published" in r ? Boolean(r["is_published"]) : true) &&
          ("is_active" in r ? Boolean(r["is_active"]) : true),
      ).length,
    [listQuery.data],
  );

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
    setPendingDelete(null);
    if (err) {
      setError(err.message);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["admin", collection.table] });
  }

  function selectTab(key: string) {
    setTab(key);
    setEditing(null);
    setCreating(false);
    setQuery("");
    setPendingDelete(null);
  }

  if (roleQuery.isLoading) return <Centered>Checking access…</Centered>;

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

  const isUsers = tab === "users";
  const total = isUsers ? usersQuery.data?.length ?? 0 : listQuery.data?.length ?? 0;

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-border bg-card/40 px-4 py-5 lg:flex">
        <Brand />
        <nav className="mt-7 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => selectTab(key)}
              className={`btn-press flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                tab === key
                  ? "bg-primary/15 font-semibold text-primary ring-1 ring-primary/30"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-4 space-y-1 border-t border-border pt-4">
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <ExternalLink className="size-4" /> View app
          </Link>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        {/* Mobile header */}
        <header className="glass-bar sticky top-0 z-20 border-b border-border lg:hidden">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
            <Brand />
            <div className="flex shrink-0 items-center gap-2">
              <Link
                to="/"
                className="btn-press rounded-full bg-secondary px-3 py-1.5 text-xs ring-1 ring-border"
              >
                App
              </Link>
              <button
                onClick={signOut}
                aria-label="Sign out"
                className="btn-press grid size-9 shrink-0 place-items-center rounded-full bg-secondary ring-1 ring-border"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => selectTab(key)}
                className={`btn-press flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium ring-1 ${
                  tab === key
                    ? "bg-primary text-primary-foreground ring-primary/50"
                    : "bg-secondary text-muted-foreground ring-border"
                }`}
              >
                <Icon className="size-3.5" />
                {label}
              </button>
            ))}
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 sm:px-6 sm:pb-10 sm:pt-6 lg:py-8">
          {/* Page head */}
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <div className="min-w-0">
              <h1 className="truncate font-display text-xl tracking-tight sm:text-2xl">
                {isUsers ? "Users" : collection.label}
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                {isUsers
                  ? "Registered accounts and their access level"
                  : `Create, edit and publish ${collection.label.toLowerCase()}`}
              </p>
            </div>
            {!isUsers && (
              <button
                onClick={() => {
                  setCreating(true);
                  setEditing(null);
                }}
                className="btn-press hidden shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20 sm:flex"
              >
                <Plus className="size-4" /> New
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:grid-cols-3 sm:gap-3">
            <Stat label="Total" value={total} />
            {!isUsers && <Stat label="Live" value={liveCount} />}
            {!isUsers && <Stat label="Drafts" value={Math.max(total - liveCount, 0)} />}
            {isUsers && (
              <Stat
                label="Admins"
                value={(usersQuery.data ?? []).filter((u) => u.role === "admin").length}
              />
            )}
          </div>

          {/* Search */}
          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isUsers ? "Search users…" : `Search ${collection.label.toLowerCase()}…`}
              className="w-full rounded-2xl bg-secondary py-3 pl-11 pr-4 text-base ring-1 ring-border outline-none focus:ring-primary/50 sm:text-sm"
            />
          </div>

          {error && (
            <p className="mt-4 rounded-2xl bg-destructive/15 px-4 py-3 text-xs text-destructive ring-1 ring-destructive/30">
              {error}
            </p>
          )}

          {/* Content */}
          <div className="mt-5 space-y-2.5">
            {isUsers ? (
              <>
                {usersQuery.isLoading && <SkeletonRows />}
                {!usersQuery.isLoading && users.length === 0 && (
                  <EmptyState label="No users found" />
                )}
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="card-surface grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl p-4 ring-1 ring-border"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-xs font-semibold uppercase ring-1 ring-border">
                        {String(u.full_name ?? u.email ?? "?").slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{u.full_name ?? "—"}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ring-1 ${
                        u.role === "admin"
                          ? "bg-primary/15 text-primary ring-primary/30"
                          : "bg-secondary text-muted-foreground ring-border"
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <>
                {listQuery.isLoading && <SkeletonRows />}
                {!listQuery.isLoading && rows.length === 0 && (
                  <EmptyState
                    label={
                      query
                        ? "Nothing matches your search"
                        : `No ${collection.label.toLowerCase()} yet — tap New to add one`
                    }
                  />
                )}
                {rows.map((row) => {
                  const live =
                    ("is_published" in row ? Boolean(row["is_published"]) : true) &&
                    ("is_active" in row ? Boolean(row["is_active"]) : true);
                  const hasState = "is_published" in row || "is_active" in row;
                  const id = String(row["id"]);
                  return (
                    <div
                      key={id}
                      className="card-surface hover-lift grid grid-cols-1 gap-3 rounded-2xl p-4 ring-1 ring-border transition-shadow xs:grid-cols-[minmax(0,1fr)_auto] xs:items-center"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {String(row[collection.titleField] ?? "")}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          {collection.subField && row[collection.subField] ? (
                            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground ring-1 ring-border">
                              {String(row[collection.subField])}
                            </span>
                          ) : null}
                          {hasState && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${
                                live
                                  ? "bg-accent/15 text-accent ring-accent/30"
                                  : "bg-secondary text-muted-foreground ring-border"
                              }`}
                            >
                              {live ? "Live" : "Draft"}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {pendingDelete === id ? (
                          <>
                            <button
                              onClick={() => remove(id)}
                              className="btn-press flex-1 rounded-full bg-destructive px-3 py-2.5 text-[11px] font-semibold text-destructive-foreground xs:flex-none"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setPendingDelete(null)}
                              className="btn-press flex-1 rounded-full bg-secondary px-3 py-2.5 text-[11px] ring-1 ring-border xs:flex-none"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              aria-label="Edit"
                              onClick={() => {
                                setEditing(row);
                                setCreating(false);
                              }}
                              className="btn-press flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-secondary text-xs ring-1 ring-border hover:text-primary xs:size-10 xs:flex-none"
                            >
                              <Pencil className="size-4" />
                              <span className="xs:hidden">Edit</span>
                            </button>
                            <button
                              aria-label="Delete"
                              onClick={() => setPendingDelete(id)}
                              className="btn-press flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-destructive/15 text-xs text-destructive ring-1 ring-destructive/30 xs:size-10 xs:flex-none"
                            >
                              <Trash2 className="size-4" />
                              <span className="xs:hidden">Delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </main>

        {!isUsers && !creating && !editing && (
          <button
            onClick={() => {
              setCreating(true);
              setEditing(null);
            }}
            aria-label={`Add ${collection.label.toLowerCase()}`}
            className="btn-press safe-bottom fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/30 sm:hidden"
          >
            <Plus className="size-5" /> New
          </button>
        )}
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
          onSave={(values) => save(values, editing ? String(editing["id"]) : undefined)}
        />
      )}
    </div>
  );
}

function Brand() {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="grid size-8 shrink-0 place-items-center rounded-lg gradient-brand text-[12px] font-bold">
        N
      </div>
      <div className="min-w-0 leading-none">
        <p className="truncate font-display text-base tracking-tight">Admin</p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          NewsAI control
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card-surface rounded-2xl px-4 py-3 ring-1 ring-border">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl tracking-tight">{value}</p>
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-2.5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-[70px] animate-pulse rounded-2xl bg-secondary/60" />
      ))}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-xs text-muted-foreground">
      {label}
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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

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
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <button
        aria-label="Close"
        onClick={onCancel}
        className="absolute inset-0 -z-10 cursor-default"
      />
      <form
        onSubmit={submit}
        className="card-surface pop-in flex max-h-[92vh] w-full max-w-2xl flex-col rounded-t-3xl ring-1 ring-border sm:rounded-3xl"
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-4">
          <p className="truncate text-sm font-semibold">
            {initial ? "Edit" : "New"} {collection.label.replace(/s$/, "")}
          </p>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="btn-press grid size-8 shrink-0 place-items-center rounded-full bg-secondary ring-1 ring-border"
          >
            <X className="size-3.5" />
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto px-5 py-5 sm:grid-cols-2">
          {collection.fields.map((f) => (
            <label
              key={f.name}
              className={`block ${f.wide || f.type === "list" ? "sm:col-span-2" : ""}`}
            >
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {f.label}
              </span>
              {f.type === "bool" ? (
                <button
                  type="button"
                  aria-pressed={Boolean(values[f.name])}
                  onClick={() => setValues((v) => ({ ...v, [f.name]: !v[f.name] }))}
                  className={`mt-2 block h-6 w-11 rounded-full p-0.5 transition-colors ${
                    values[f.name] ? "bg-primary" : "bg-secondary ring-1 ring-border"
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
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  className="mt-1 w-full rounded-2xl bg-secondary px-4 py-3 text-sm ring-1 ring-border outline-none focus:ring-primary/50"
                />
              ) : (
                <input
                  type={f.type === "number" ? "number" : "text"}
                  required={f.required}
                  value={String(values[f.name] ?? "")}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  className="mt-1 w-full rounded-2xl bg-secondary px-4 py-3 text-sm ring-1 ring-border outline-none focus:ring-primary/50"
                />
              )}
            </label>
          ))}
        </div>

        <div className="safe-bottom flex gap-2 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-press flex-1 rounded-2xl bg-secondary px-4 py-3 text-sm ring-1 ring-border sm:flex-none sm:px-6"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-press flex-1 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
