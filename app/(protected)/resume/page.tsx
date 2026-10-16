import {
  BrainCircuit,
  BriefcaseBusiness,
  FileCheck2,
  FileText,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { redirect } from "next/navigation";

import ResumeManager from "@/components/resume/ResumeManager";
import ResumeUploadForm from "@/components/resume/ResumeUploadForm";
import { createClient } from "@/lib/supabase/server";

type ResumeStatus = "uploaded" | "analysing" | "analysed";

type ResumeRecord = {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
  ats_score: number | null;
  status: ResumeStatus | null;
};

function formatFileSize(bytes: number | null): string | undefined {
  if (!bytes || bytes <= 0) {
    return undefined;
  }

  const units = ["Bytes", "KB", "MB", "GB"];

  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  return `${(bytes / 1024 ** unitIndex).toFixed(1)} ${units[unitIndex]}`;
}

function formatUploadDate(date: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function getStatusLabel(status: ResumeStatus | null): string {
  if (status === "analysing") {
    return "Analysing";
  }

  if (status === "analysed") {
    return "Analysed";
  }

  return "Uploaded";
}

export default async function ResumePage() {
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
    .select(
      "id, file_name, file_path, file_size, mime_type, created_at, ats_score, status",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const latestResume =
    !resumeError && resumeRows && resumeRows.length > 0
      ? (resumeRows[0] as ResumeRecord)
      : null;

  if (resumeError) {
    console.warn(
      "Could not load resume:",
      resumeError.message || "Unknown Supabase query error",
    );
  }

  const statusLabel = getStatusLabel(
    latestResume?.status ?? null,
  );

  const atsScore = latestResume?.ats_score ?? null;

  return (
    <div className="space-y-8 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      {/* Page introduction */}
      <section>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
              <Sparkles className="h-4 w-4" />
              Resume workspace
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Manage your resume
            </h1>

            <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-[var(--muted)]">
              Upload and manage your professional resume for ATS analysis,
              skill extraction, and personalised job matching.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
              Current focus
            </p>

            <p className="mt-1 text-xs font-semibold text-[var(--foreground)]">
              {latestResume
                ? "Improve your resume performance"
                : "Upload your professional resume"}
            </p>
          </div>
        </div>
      </section>

      {/* Resume hero */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <article className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 text-[var(--foreground)] shadow-2xl sm:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[color-mix(in_srgb,var(--primary)_5%,transparent)]" />

          <div className="absolute -bottom-24 right-20 h-52 w-52 rounded-full bg-[color-mix(in_srgb,var(--primary)_5%,transparent)]" />

          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)]">
              <FileText className="h-5 w-5" />
            </div>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Career Match AI
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Your professional resume
            </h2>

            <p className="mt-5 max-w-2xl text-xs sm:text-sm leading-relaxed text-[var(--muted)]">
              Keep your latest resume connected to your account so Career
              Match AI can evaluate its ATS compatibility and use your
              professional information for future career recommendations.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-xs font-medium text-[var(--foreground)]/80">
                <FileCheck2 className="h-4 w-4 text-[var(--primary)]" />
                PDF and DOCX
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-xs font-medium text-[var(--foreground)]/80">
                <ShieldCheck className="h-4 w-4 text-[var(--primary)]" />
                Private storage
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-xs font-medium text-[var(--foreground)]/80">
                <BrainCircuit className="h-4 w-4 text-[var(--primary)]" />
                ATS analysis
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 text-[var(--foreground)] shadow-2xl sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Resume status
                </p>

                <p className="mt-2 text-4xl font-bold tracking-tight text-[var(--foreground)]">
                  {latestResume ? statusLabel : "Waiting"}
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-xs font-semibold text-[var(--primary)]">
                <UploadCloud className="h-4 w-4" />
                {latestResume ? "Available" : "Not uploaded"}
              </div>
            </div>

            <div className="mt-8 h-2.5 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface-soft)]">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-all duration-500 shadow-sm"
                style={{
                  width: latestResume ? "100%" : "0%",
                }}
              />
            </div>

            <p className="mt-6 text-xs leading-relaxed text-[var(--muted)]">
              {latestResume
                ? `Your latest resume was uploaded on ${formatUploadDate(
                    latestResume.created_at,
                  )}.`
                : "Upload a resume to begin your professional document analysis."}
            </p>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[var(--foreground)]">
            <FileText className="h-4 w-4 text-[var(--primary)]" />
            {latestResume ? "Resume ready" : "Resume required"}
          </div>
        </article>
      </section>

      {resumeError && (
        <div
          role="alert"
          className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-medium text-rose-400"
        >
          We could not load your resume information. Please refresh the page.
        </div>
      )}

      {!resumeError && (
        <>
          {/* Resume overview */}
          <section>
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
                Resume overview
              </p>

              <h2 className="mt-2 text-xl font-bold tracking-tight text-[var(--foreground)]">
                Your resume at a glance
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <article className="group rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--foreground)] transition duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--primary)_40%,transparent)] hover:bg-[var(--surface-soft)] hover:shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)]">
                    <FileText className="h-6 w-6" />
                  </div>

                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                    Resume
                  </span>
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                  Current document
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)]">
                  {latestResume ? "1" : "0"}
                </p>

                <p
                  title={latestResume?.file_name}
                  className="mt-4 truncate text-xs leading-relaxed text-[var(--muted)]"
                >
                  {latestResume?.file_name ??
                    "No resume has been uploaded yet."}
                </p>
              </article>

              <article className="group rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--foreground)] transition duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--primary)_40%,transparent)] hover:bg-[var(--surface-soft)] hover:shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)]">
                    <UploadCloud className="h-6 w-6" />
                  </div>

                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                    Status
                  </span>
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                  Upload status
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)]">
                  {latestResume ? statusLabel : "Waiting"}
                </p>

                <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
                  {latestResume
                    ? `Uploaded ${formatUploadDate(
                        latestResume.created_at,
                      )}`
                    : "Upload your first professional resume."}
                </p>
              </article>

              <article className="group rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--foreground)] transition duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--primary)_40%,transparent)] hover:bg-[var(--surface-soft)] hover:shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)]">
                    <FileCheck2 className="h-6 w-6" />
                  </div>

                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                    ATS
                  </span>
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                  ATS score
                </p>

                <p className="mt-3 text-4xl font-bold tracking-tight text-[var(--foreground)]">
                  {atsScore ?? "—"}

                  {atsScore !== null && (
                    <span className="ml-1 text-sm text-[var(--muted)]">
                      /100
                    </span>
                  )}
                </p>

                <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
                  {atsScore === null
                    ? "Upload and analyse your resume to generate a score."
                    : "Your latest resume analysis score."}
                </p>
              </article>

              <article className="group rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--foreground)] transition duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--primary)_40%,transparent)] hover:bg-[var(--surface-soft)] hover:shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)]">
                    <BriefcaseBusiness className="h-6 w-6" />
                  </div>

                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                    Matches
                  </span>
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                  Job matches
                </p>

                <p className="mt-3 text-4xl font-bold tracking-tight text-[var(--foreground)]">
                  0
                </p>

                <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
                  Matched career opportunities will appear here.
                </p>
              </article>
            </div>
          </section>

          {/* Current resume or upload */}
          <section>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
                  {latestResume
                    ? "Current document"
                    : "Resume upload"}
                </p>

                <h2 className="mt-2 text-xl font-bold tracking-tight text-[var(--foreground)]">
                  {latestResume
                    ? "Manage your latest resume"
                    : "Add your professional resume"}
                </h2>
              </div>

              {latestResume && (
                <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs font-semibold text-[var(--primary)] shadow-xl">
                  <UploadCloud className="h-4 w-4" />
                  One resume uploaded
                </div>
              )}
            </div>

            {latestResume ? (
              <ResumeManager
                resumeId={latestResume.id}
                fileName={latestResume.file_name}
                filePath={latestResume.file_path}
                fileSize={formatFileSize(
                  latestResume.file_size,
                )}
                uploadedAt={formatUploadDate(
                  latestResume.created_at,
                )}
                status={latestResume.status ?? "uploaded"}
                atsScore={latestResume.ats_score}
              />
            ) : (
              <ResumeUploadForm />
            )}
          </section>

          {/* Upcoming tools */}
          <section className="grid gap-6 xl:grid-cols-2">
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--foreground)] shadow-2xl sm:p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                  AI analysis
                </p>

                <h3 className="mt-2 text-xl font-bold tracking-tight text-[var(--foreground)]">
                  Resume insights
                </h3>

                <p className="mt-2 text-xs text-[var(--muted)]">
                  Review upcoming AI-powered resume improvements.
                </p>
              </div>

              <div className="mt-7 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)]">
                    <BrainCircuit className="h-5 w-5" />
                  </div>

                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)]">
                    Soon
                  </span>
                </div>

                <p className="mt-4 text-sm font-bold text-[var(--foreground)]">
                  AI resume analysis
                </p>

                <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                  ATS scoring, extracted skills, missing keywords, strengths,
                  and improvement suggestions will appear here.
                </p>
              </div>
            </article>

            <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--foreground)] shadow-2xl sm:p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                  Job matching
                </p>

                <h3 className="mt-2 text-xl font-bold tracking-tight text-[var(--foreground)]">
                  Recommended opportunities
                </h3>

                <p className="mt-2 text-xs text-[var(--muted)]">
                  Discover future opportunities based on your resume.
                </p>
              </div>

              <div className="mt-7 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)]">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </div>

                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)]">
                    Soon
                  </span>
                </div>

                <p className="mt-4 text-sm font-bold text-[var(--foreground)]">
                  Personalised job matches
                </p>

                <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                  Job recommendations based on your extracted skills,
                  experience, and ATS compatibility will appear here.
                </p>
              </div>
            </article>
          </section>
        </>
      )}
    </div>
  );
}