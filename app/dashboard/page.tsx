import Link from "next/link";
import { redirect } from "next/navigation";

import ProfileCompletion from "@/components/dashboard/ProfileCompletion";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import StatCard from "@/components/dashboard/StatCard";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import { createClient } from "@/lib/supabase/server";

import { logout } from "./actions";

type Profile = {
  full_name: string | null;
  phone: string | null;
  location: string | null;
  professional_title: string | null;
  bio: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
};

function calculateProfileCompletion(profile: Profile | null) {
  if (!profile) {
    return 0;
  }

  const fields = [
    profile.full_name,
    profile.phone,
    profile.location,
    profile.professional_title,
    profile.bio,
    profile.linkedin_url,
    profile.github_url,
    profile.portfolio_url,
  ];

  const completedFields = fields.filter((field) => {
    return typeof field === "string" && field.trim().length > 0;
  }).length;

  return Math.round((completedFields / fields.length) * 100);
}

export default async function DashboardPage() {
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

  if (profileError) {
    console.error("Unable to load dashboard profile:", profileError);
  }

  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null;

  const fullName = profile?.full_name || metadataName || "User";
  const email = user.email ?? "No email available";
  const profileCompletion = calculateProfileCompletion(profile);

  const completedProfileFields = Math.round(
    (profileCompletion / 100) * 8,
  );

  const activities = [
    {
      title: "Profile accessed",
      description:
        "Your CareerMatchAI profile and dashboard are ready to use.",
      time: "Recently",
    },
    {
      title: "Account active",
      description:
        "Your account is authenticated and protected by Supabase.",
      time: "Today",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold">
            CareerMatch<span className="text-blue-500">AI</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white sm:inline-flex"
            >
              My Profile
            </Link>

            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-400"
              >
                Log out
              </button>
            </form>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <WelcomeCard fullName={fullName} email={email} />

          <ProfileCompletion percentage={profileCompletion} />
        </div>

        <section className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Profile Fields"
            value={`${completedProfileFields}/8`}
            description="Professional profile fields completed."
          />

          <StatCard
            title="Resume"
            value="0"
            description="No resume has been uploaded yet."
          />

          <StatCard
            title="ATS Score"
            value="—"
            description="Upload a resume to generate your ATS score."
          />

          <StatCard
            title="Job Matches"
            value="0"
            description="Matched opportunities will appear here."
          />
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <RecentActivity activities={activities} />

          <QuickActions />
        </div>
      </div>
    </main>
  );
}