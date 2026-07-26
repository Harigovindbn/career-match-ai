import { redirect } from "next/navigation";

import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { createClient } from "@/lib/supabase/server";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.warn("Unable to load layout profile:", {
      message: profileError.message,
      code: profileError.code,
      details: profileError.details,
      hint: profileError.hint,
    });
  }

  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.trim()
      : "";

  const fullName =
    profile?.full_name?.trim() ||
    metadataName ||
    "User";

  const email = user.email ?? "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1920px] items-start gap-5 px-5">
        <AppSidebar />

        <div className="min-w-0 flex-1 pb-10">
          <AppHeader
            fullName={fullName}
            email={email}
          />

          <main className="mx-auto w-full max-w-[1600px] px-1 py-8 sm:px-3 lg:px-5">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}