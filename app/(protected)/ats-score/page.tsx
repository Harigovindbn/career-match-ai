import { redirect } from "next/navigation";

import AtsScoreWorkspace, {
  type AtsResumeRecord,
} from "@/components/ats/AtsScoreWorkspace";

import { createClient } from "@/lib/supabase/server";

export default async function AtsScorePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const { data: resumeRows, error: resumeError } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    })
    .limit(1);

  const latestResume =
    !resumeError && resumeRows && resumeRows.length > 0
      ? (resumeRows[0] as AtsResumeRecord)
      : null;

  return (
    <AtsScoreWorkspace
      resume={latestResume}
      resumeError={
        resumeError
          ? "We could not load your latest resume from Supabase. Please refresh the page."
          : null
      }
    />
  );
}