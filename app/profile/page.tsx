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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <ProfileHeader />

        {params.error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {params.error === "full-name-required"
              ? "Full name is required."
              : "Unable to update your profile. Please try again."}
          </div>
        )}

        <ProfileForm
          profile={profile}
          action={saveProfile}
          saved={saved}
        />
      </div>
    </main>
  );
}