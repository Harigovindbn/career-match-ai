import { redirect } from "next/navigation";

import SettingsClient from "@/components/settings/SettingsClient";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const metadata = user.user_metadata ?? {};
  const fullName =
    profile?.full_name?.trim() ||
    (typeof metadata.full_name === "string" ? metadata.full_name.trim() : "");

  return (
    <SettingsClient
      initialName={fullName}
      initialEmail={user.email ?? ""}
      initialEmailNotifications={metadata.email_notifications !== false}
    />
  );
}
