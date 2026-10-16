import {
  BriefcaseBusiness,
  FileCheck2,
  FileText,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import { redirect } from "next/navigation";

import ProfileCompletion from "@/components/dashboard/ProfileCompletion";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import StatCard from "@/components/dashboard/StatCard";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import { createClient } from "@/lib/supabase/server";

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

function calculateProfileCompletion(profile: Profile | null): number {
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

  const { data: profileData, error: profileError } = await supabase
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
    .maybeSingle();

  const profile = profileData as Profile | null;

  if (profileError) {
    console.warn("Unable to load dashboard profile:", {
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

  const email = user.email ?? "No email available";

  const profileCompletion = calculateProfileCompletion(profile);

  const completedProfileFields = Math.round(
    (profileCompletion / 100) * 8,
  );

  const activities = [
    {
      title: "Profile accessed",
      description:
        "Your Career Match AI profile and dashboard are ready to use.",
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
    <div className="space-y-8 bg-[#090a0f] text-white min-h-screen">
      {/* Career overview */}
      <section>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#99f6e4]">
              <Sparkles className="h-4 w-4" />
              Career overview
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your career workspace
            </h2>

            <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#8e95a2]">
              Track your progress, strengthen your profile, and prepare your
              resume for better career opportunities.
            </p>
          </div>

          <div className="rounded-2xl border border-[#21252d] bg-[#121417] px-4 py-3 shadow-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#99f6e4]">
              Current focus
            </p>

            <p className="mt-1 text-xs font-semibold text-white">
              Complete your professional profile
            </p>
          </div>
        </div>
      </section>

      {/* Welcome and profile completion */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <WelcomeCard
          fullName={fullName}
          email={email}
        />

        <ProfileCompletion percentage={profileCompletion} />
      </section>

      {/* Career readiness */}
      <section>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#99f6e4]">
            Career readiness
          </p>

          <h3 className="mt-2 text-xl font-bold tracking-tight text-white">
            Your progress at a glance
          </h3>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Profile Fields"
            value={`${completedProfileFields}/8`}
            description="Professional profile fields completed."
            icon={UserRoundCheck}
          />

          <StatCard
            title="Resume"
            value="0"
            description="No resume has been uploaded yet."
            icon={FileText}
          />

          <StatCard
            title="ATS Score"
            value="—"
            description="Upload a resume to generate your ATS score."
            icon={FileCheck2}
          />

          <StatCard
            title="Job Matches"
            value="0"
            description="Matched opportunities will appear here."
            icon={BriefcaseBusiness}
          />
        </div>
      </section>

      {/* Activity and actions */}
      <section className="grid gap-6 xl:grid-cols-2">
        <RecentActivity activities={activities} />

        <QuickActions />
      </section>
    </div>
  );
}