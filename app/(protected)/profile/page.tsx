import { AlertCircle, CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";

import ProfileForm from "@/components/profile/ProfileForm";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { createClient } from "@/lib/supabase/server";

import { saveProfile } from "./actions";

type ProfilePageProps = {
  searchParams: Promise<{
    saved?: string;
    error?: string;
  }>;
};

export default async function ProfilePage({
  searchParams,
}: ProfilePageProps) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      `
        full_name,
        phone,
        location,
        professional_title,
        bio,
        linkedin_url,
        github_url,
        portfolio_url
      `,
    )
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    throw new Error("Unable to load profile.");
  }

  const params = await searchParams;
  const saved = params.saved === "true";

  const errorMessage =
    params.error === "full-name-required"
      ? "Full name is required."
      : params.error
        ? "Unable to update your profile. Please try again."
        : null;

  return (
    <div className="space-y-6">
      <ProfileHeader />

      {saved && (
        <div className="flex items-start gap-3 rounded-2xl border border-success/25 bg-success/10 px-4 py-4 text-sm text-foreground">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />

          <div>
            <p className="font-semibold">Profile updated</p>

            <p className="mt-1 text-muted">
              Your professional information was saved successfully.
            </p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-danger/25 bg-danger/10 px-4 py-4 text-sm text-foreground">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />

          <div>
            <p className="font-semibold">Unable to save profile</p>

            <p className="mt-1 text-muted">{errorMessage}</p>
          </div>
        </div>
      )}

      <ProfileForm
        profile={profile}
        action={saveProfile}
        saved={saved}
      />
    </div>
  );
}