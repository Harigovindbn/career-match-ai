import Link from "next/link";
import { FileText, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";

import OptimizerWorkspace from "@/components/resume-optimizer/OptimizerWorkspace";
import OptimizationHistory, {
  type OptimizationHistoryItem,
} from "@/components/resume-optimizer/OptimizationHistory";
import { createClient } from "@/lib/supabase/server";

type ResumeRecord = {
  id: string;
  file_name: string;
  ats_score: number | null;
  extracted_text: string | null;
  skills: unknown;
  created_at: string;
};

function parseSkills(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .filter(
        (item): item is string =>
          typeof item === "string",
      )
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed: unknown =
        JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed
          .filter(
            (item): item is string =>
              typeof item === "string",
          )
          .map((item) => item.trim())
          .filter(Boolean);
      }
    } catch {
      return value
        .replace(/^\{|\}$/g, "")
        .split(/,|\n|;/)
        .map((item) =>
          item
            .replace(/^"|"$/g, "")
            .trim(),
        )
        .filter(Boolean);
    }
  }

  return [];
}

export default async function ResumeOptimizerPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const {
    data: resumeRows,
    error: resumeError,
  } = await supabase
    .from("resumes")
    .select(
      "id, file_name, ats_score, extracted_text, skills, created_at",
    )
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    })
    .limit(1);

  const latestResume =
    !resumeError &&
    resumeRows &&
    resumeRows.length > 0
      ? (resumeRows[0] as ResumeRecord)
      : null;

  if (resumeError) {
    console.warn(
      "Could not load resume for optimizer:",
      resumeError.message ||
        "Unknown Supabase query error",
    );
  }

  const resumeText =
    latestResume?.extracted_text?.trim() ?? "";

  const storedSkills = parseSkills(
    latestResume?.skills,
  );

  const atsScore =
    latestResume?.ats_score ?? null;

  const { data: historyRows, error: historyError } =
    await supabase
      .from("resume_optimizations")
      .select(
        `id, job_description, original_text, optimized_text, match_score, replacements_applied, matching_skills, missing_skills, matching_keywords, missing_keywords, created_at`,
      )
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(30);

  if (historyError) {
    console.warn(
      "Could not load optimization history:",
      historyError.message,
    );
  }

  const optimizationHistory: OptimizationHistoryItem[] =
    (historyRows ?? []).map((row) => ({
      id: row.id,
      job_description: row.job_description ?? "",
      original_text: row.original_text ?? "",
      optimized_text: row.optimized_text ?? "",
      match_score:
        typeof row.match_score === "number"
          ? row.match_score
          : null,
      replacements_applied:
        typeof row.replacements_applied === "number"
          ? row.replacements_applied
          : null,
      matching_skills: Array.isArray(row.matching_skills)
        ? row.matching_skills
        : [],
      missing_skills: Array.isArray(row.missing_skills)
        ? row.missing_skills
        : [],
      matching_keywords: Array.isArray(
        row.matching_keywords,
      )
        ? row.matching_keywords
        : [],
      missing_keywords: Array.isArray(
        row.missing_keywords,
      )
        ? row.missing_keywords
        : [],
      created_at: row.created_at ?? "",
    }));

  return (
    <div className="space-y-8">
      {resumeError ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          We could not load your saved resume. You can
          still paste your resume manually into the
          optimizer.
        </div>
      ) : null}

      {!resumeError &&
      latestResume &&
      !resumeText ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

            <div>
              <p className="font-semibold text-amber-900">
                Resume text is not available yet
              </p>

              <p className="mt-1 text-sm leading-6 text-amber-800">
                Your resume exists, but no extracted text
                was found. You can paste your resume
                manually below or analyse it from the
                Resume page first.
              </p>

              <Link
                href="/resume"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-amber-900 underline underline-offset-4"
              >
                <FileText className="h-4 w-4" />
                Open Resume
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {!resumeError && !latestResume ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" />

            <div>
              <p className="font-semibold text-slate-950">
                No saved resume found
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                You can paste your resume manually into
                the optimizer or upload one to your
                account first.
              </p>

              <Link
                href="/resume"
                className="mt-3 inline-flex text-sm font-semibold text-slate-900 underline underline-offset-4"
              >
                Upload Resume
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <OptimizerWorkspace
        resumeId={latestResume?.id ?? null}
        initialResumeText={resumeText}
        storedSkills={storedSkills}
        atsScore={atsScore}
      />

      <section className="space-y-4 pt-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Optimization History
          </h2>
          <p className="mt-1 text-sm text-muted">
            Review past optimizations, compare match scores, and access improved resumes.
          </p>
        </div>

        <OptimizationHistory items={optimizationHistory} />
      </section>
    </div>
  );
}