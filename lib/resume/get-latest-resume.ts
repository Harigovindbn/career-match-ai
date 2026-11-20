import { redirect } from "next/navigation";

import type { AtsResumeRecord } from "@/components/ats/AtsScoreWorkspace";
import { createClient } from "@/lib/supabase/server";

/** Loads the signed-in user's most recent resume (or redirects to login). */
export async function getLatestResume(): Promise<{
  resume: AtsResumeRecord | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn("Could not load latest resume:", error.message);
    return { resume: null, error: "Your saved resume could not be loaded." };
  }

  return { resume: (data as AtsResumeRecord | null) ?? null, error: null };
}
