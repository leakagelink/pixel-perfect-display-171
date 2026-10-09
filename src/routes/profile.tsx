import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { TopHeader } from "@/components/app/TopHeader";
import { SectionHeader } from "@/components/app/SectionHeader";
import { useLanguage } from "@/lib/language";
import { deleteMyAccount } from "@/lib/account.functions";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

const settings = [
  { label: "About us", value: "7adigital.com", to: "/about" },
  { label: "Contact", value: "7awakenewsnetworkdigital@gmail.com", to: "/about" },
  { label: "Privacy Policy", value: "How we handle your data", to: "/privacy" },
  { label: "Terms of Use", value: "Rules for using the app", to: "/terms" },
];

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "প্রোফাইল — 7AWAKE NEWS NETWORK DIGITAL" },
      {
        name: "description",
        content:
          "আপনার আগ্রহ, অনুসরণ, সংরক্ষিত খবর, পড়ার ইতিহাস এবং অ্যাপের পছন্দ।",
      },
      { property: "og:title", content: "প্রোফাইল — 7AWAKE NEWS NETWORK DIGITAL" },
      {
        property: "og:description",
        content: "আগ্রহ, অনুসরণ এবং পড়ার পছন্দ ঠিক করুন।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { language, t } = useLanguage();
  const [user, setUser] = useState<{ email: string; name: string; isAdmin: boolean } | null>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;
      if (!u) return;
      const [{ data: prof }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", u.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", u.id),
      ]);
      if (!alive) return;
      setUser({
        email: u.email ?? "",
        name: prof?.full_name ?? "",
        isAdmin: (roles ?? []).some((r) => r.role === "admin"),
      });
    })();
    return () => { alive = false; };
  }, []);
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const shownSettings = language === "bn" ? [
    { label: "আমাদের সম্পর্কে", value: "7adigital.com", to: "/about" },
    { label: "যোগাযোগ", value: "7awakenewsnetworkdigital@gmail.com", to: "/about" },
    { label: "গোপনীয়তা নীতি", value: "আপনার তথ্য কীভাবে ব্যবহৃত হয়", to: "/privacy" },
    { label: "ব্যবহারের শর্তাবলী", value: "অ্যাপ ব্যবহারের নিয়ম", to: "/terms" },
  ] : settings;

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      language === "bn"
        ? "আপনি কি নিশ্চিত? আপনার অ্যাকাউন্ট ও সব তথ্য স্থায়ীভাবে মুছে যাবে।"
        : "Are you sure? Your account and all data will be permanently deleted.",
    );
    if (!confirmed) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteMyAccount();
      await supabase.auth.signOut();
      navigate({ to: "/auth" });
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Delete failed");
      setDeleting(false);
    }
  };
  return (
    <AppShell>
      <TopHeader subtitle={t("profile")} />

      <div className="mt-6 px-5">
        {user ? (
          <div className="flex items-center gap-4 border-b border-border pb-6">
            <div className="grid size-16 shrink-0 place-items-center rounded-full bg-ink font-display text-lg text-primary-foreground ring-4 ring-primary/10">
              {(user.name || user.email || "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold tracking-tight">{user.name || user.email}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="border-b border-border pb-6">
            <p className="text-sm text-muted-foreground">
              {language === "bn" ? "খবর পড়তে অ্যাকাউন্ট লাগে না।" : "You don't need an account to read news."}
            </p>
            <Link to="/auth" className="btn-press mt-3 inline-block rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
              {language === "bn" ? "লগইন / সাইন আপ" : "Sign in / Sign up"}
            </Link>
          </div>
        )}
      </div>

      {user?.isAdmin && (
      <div className="mt-3 px-5">
        <Link
          to="/admin"
          className="btn-press flex items-center justify-between border-l-2 border-primary bg-secondary/60 p-4"
        >
          <div>
             <p className="text-sm font-medium">{language === "bn" ? "অ্যাডমিন প্যানেল" : "Admin panel"}</p>
            <p className="text-[11px] text-muted-foreground">
               {language === "bn" ? "খবর, শর্টস, ভিডিও ও ব্যবহারকারী পরিচালনা করুন" : "Manage news, shorts, video and users"}
            </p>
          </div>
          <span className="text-muted-foreground">›</span>
        </Link>
      </div>
      )}

      <SectionHeader title={language === "bn" ? "সেটিংস" : "Settings"} />
      <div className="divide-y divide-border px-5 pt-2">
        {shownSettings.map(({ label, value, to }) => (
          <Link
            key={label}
            to={to}
            className="btn-press flex items-center justify-between py-4"
          >
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-[11px] text-muted-foreground">{value}</p>
            </div>
            <span className="text-muted-foreground">›</span>
          </Link>
        ))}
      </div>

      {user && (
      <div className="mt-6 px-5">
        <button
          type="button"
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="btn-press w-full rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3.5 text-sm font-semibold text-destructive disabled:opacity-60"
        >
          {deleting
            ? language === "bn" ? "মুছে ফেলা হচ্ছে…" : "Deleting…"
            : language === "bn" ? "অ্যাকাউন্ট মুছে ফেলুন" : "Delete account"}
        </button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          {language === "bn"
            ? "আপনার অ্যাকাউন্ট ও সব তথ্য স্থায়ীভাবে মুছে যাবে।"
            : "Your account and all data will be permanently deleted."}
        </p>
        {deleteError && (
          <p className="mt-2 text-center text-xs text-destructive">{deleteError}</p>
        )}
      </div>
      )}

      <p className="mt-8 px-5 text-center text-[11px] text-muted-foreground">
        {SITE.name} · {SITE.websiteLabel}
      </p>
    </AppShell>
  );
}
