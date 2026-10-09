import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Permanently delete the signed-in user's account (Google Play account-deletion policy).
 * Removes the user's profile and role rows, then the sign-in account itself.
 */
export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const roles = await supabaseAdmin.from("user_roles").delete().eq("user_id", userId);
    if (roles.error) {
      console.error("[deleteMyAccount] roles", roles.error);
      throw new Error("Could not delete account. Please try again or contact us.");
    }
    const profile = await supabaseAdmin.from("profiles").delete().eq("id", userId);
    if (profile.error) {
      console.error("[deleteMyAccount] profile", profile.error);
      throw new Error("Could not delete account. Please try again or contact us.");
    }
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      console.error("[deleteMyAccount] auth", error);
      throw new Error("Could not delete account. Please try again or contact us.");
    }
    return { ok: true };
  });
