import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  head: () => ({
    meta: [
      { title: "Secure workspace — 7AWAKE NEWS NETWORK DIGITAL" },
      { name: "description", content: "Secure 7AWAKE NEWS NETWORK DIGITAL management workspace." },
      { property: "og:title", content: "Secure workspace — 7AWAKE NEWS NETWORK DIGITAL" },
      { property: "og:description", content: "Secure 7AWAKE NEWS NETWORK DIGITAL management workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "ok">("checking");

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data, error }) => {
      if (!active) return;
      if (error || !data.user) {
        navigate({ to: "/auth", replace: true });
        return;
      }
      setStatus("ok");
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return <Outlet />;
}
