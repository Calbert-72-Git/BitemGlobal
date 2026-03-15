import { supabase } from "@/integrations/supabase/client";

export const logAction = async (
  action: string,
  module: string,
  recordId?: string,
  details?: Record<string, any>
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    const roleStr = roles?.map((r: any) => r.role).join(", ") || "sin rol";

    await supabase.from("audit_log" as any).insert({
      user_id: user.id,
      user_name: (profile as any)?.full_name || user.email || "",
      user_role: roleStr,
      action,
      module,
      record_id: recordId || null,
      details: details || {},
    } as any);
  } catch (e) {
    console.error("Audit log error:", e);
  }
};

export const logLogin = async () => logAction("Inicio de sesión", "auth");
