"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Award,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  FileCheck2,
  FileText,
  GraduationCap,
  Info,
  Lightbulb,
  Mail,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";

import AtsCategoryCard from "@/components/ats/AtsCategoryCard";
import AtsChecksList from "@/components/ats/AtsChecksList";
import AtsForm from "@/components/ats/AtsForm";
import AtsRecommendations from "@/components/ats/AtsRecommendations";
import AtsScoreCard from "@/components/ats/AtsScoreCard";

import { analyseAtsResume } from "@/lib/ats/analyse-ats";
import type { AtsAnalysis } from "@/lib/ats/types";

export type AtsResumeRecord = {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
  updated_at: string | null;
  ats_score: number | null;
  status: string | null;
  extracted_text: string | null;

  skills: unknown;
  strengths: unknown;
  improvemnets: unknown;
  improvements?: unknown;
  missing_keywords: unknown;

  education: unknown;
  experience: unknown;
  projects: unknown;
  certifications: unknown;
  contact: unknown;
  summary: unknown;

  analysis_completed_at: string | null;
};

type AtsScoreWorkspaceProps = {
  resume: AtsResumeRecord | null;
  resumeError?: string | null;
};

function normaliseStringList(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item.trim();
        }

        if (
          typeof item === "object" &&
          item !== null &&
          "name" in item &&
          typeof item.name === "string"
        ) {
          return item.name.trim();
        }

        if (
          typeof item === "object" &&
          item !== null &&
          "title" in item &&
          typeof item.title === "string"
        ) {
          return item.title.trim();
        }

        return JSON.stringify(item);
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    const cleanedValue = value.trim();

    if (!cleanedValue) {
      return [];
    }

    try {
      const parsedValue: unknown = JSON.parse(cleanedValue);

      if (parsedValue !== cleanedValue) {
        return normaliseStringList(parsedValue);
      }
    } catch {
      // The value is normal text rather than JSON.
    }

    return cleanedValue
      .split(/\n|,|;/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, item]) => {
        if (typeof item === "string") {
          return `${key}: ${item}`;
        }

        return `${key}: ${JSON.stringify(item)}`;
      })
      .filter(Boolean);
  }

  return [String(value)];
}

function normaliseText(value: unknown): string {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        return JSON.stringify(item, null, 2);
      })
      .join("\n");
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, item]) => {
        if (typeof item === "string") {
          return `${key}: ${item}`;
        }

        return `${key}: ${JSON.stringify(item, null, 2)}`;
      })
      .join("\n");
  }

  return String(value);
}

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function StoredListCard({
  title,
  label,
  items,
  icon: Icon,
  emptyMessage,
}: {
  title: string;
  label: string;
  items: string[];
  icon: typeof Sparkles;
  emptyMessage: string;
}) {
  return (
    <article className="rounded-[2rem] border border-[#21252d] bg-[#121417] p-6 text-white shadow-2xl">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#99f6e4]/20 bg-[#99f6e4]/10 text-[#99f6e4]">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#99f6e4]">
            {label}
          </p>

          <h3 className="mt-1 text-lg font-semibold text-white">
            {title}
          </h3>
        </div>
      </div>

      <div className="mt-5">
        {items.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="rounded-full border border-[#21252d] bg-[#181b20] px-3.5 py-1.5 text-xs font-medium text-white"
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-[#8e95a2]">
            {emptyMessage}
          </p>
        )}
      </div>
    </article>
  );
}

function StoredTextCard({
  title,
  label,
  value,
  icon: Icon,
  emptyMessage,
}: {
  title: string;
  label: string;
  value: string;
  icon: typeof FileText;
  emptyMessage: string;
}) {
  return (
    <article className="rounded-[2rem] border border-[#21252d] bg-[#121417] p-6 text-white shadow-2xl">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#99f6e4]/20 bg-[#99f6e4]/10 text-[#99f6e4]">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#99f6e4]">
            {label}
          </p>

          <h3 className="mt-1 text-lg font-semibold text-white">
            {title}
          </h3>
        </div>
      </div>

      <div className="mt-5">
        {value ? (
          <p className="whitespace-pre-wrap text-sm leading-7 text-[#8e95a2]">
            {value}
          </p>
        ) : (
          <p className="text-sm leading-6 text-[#8e95a2]">
            {emptyMessage}
          </p>
        )}
      </div>
    </article>
  );
}

export default function AtsScoreWorkspace({
  resume,
  resumeError,
}: AtsScoreWorkspaceProps) {
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null);

  const [isAnalysing, setIsAnalysing] = useState(false);
  const [pageError, setPageError] = useState("");

  const extractedText = resume?.extracted_text?.trim() ?? "";

  const storedSkills = normaliseStringList(resume?.skills);
  const storedStrengths = normaliseStringList(resume?.strengths);

  const storedImprovements = normaliseStringList(
    resume?.improvemnets ?? resume?.improvements,
  );

  const storedMissingKeywords = normaliseStringList(
    resume?.missing_keywords,
  );

  const storedSummary = normaliseText(resume?.summary);
  const storedEducation = normaliseText(resume?.education);
  const storedExperience = normaliseText(resume?.experience);
  const storedProjects = normaliseText(resume?.projects);
  const storedCertifications = normaliseText(
    resume?.certifications,
  );
  const storedContact = normaliseText(resume?.contact);

  function handleAnalyse(resumeText: string) {
    setIsAnalysing(true);
    setPageError("");

    try {
      const result = analyseAtsResume({
        resumeText,
      });

      setAnalysis(result);

      window.setTimeout(() => {
        document
          .getElementById("ats-results")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    } catch (error) {
      setAnalysis(null);

      setPageError(
        error instanceof Error
          ? error.message
          : "Unable to analyse the resume.",
      );
    } finally {
      setIsAnalysing(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#090a0f] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-[#21252d] bg-[#121417] p-7 text-white shadow-2xl sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#21252d] bg-[#181b20] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#99f6e4]">
                <ShieldCheck className="h-4 w-4" />
                Connected ATS checker
              </div>

              <h1 className="mt-6 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Analyse your uploaded resume automatically
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8e95a2] sm:text-base">
                Your latest resume is loaded from Supabase. Review the
                extracted content and calculate its ATS compatibility
                score without uploading or copying it again.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-3xl border border-[#21252d] bg-[#181b20] p-5">
                <ScanSearch className="h-5 w-5 text-[#99f6e4]" />

                <p className="mt-6 text-2xl font-bold text-white">
                  {resume?.ats_score ?? "—"}
                </p>

                <p className="mt-1 text-xs uppercase tracking-[0.1em] text-[#8e95a2]">
                  Saved score
                </p>
              </div>

              <div className="rounded-3xl border border-[#21252d] bg-[#181b20] p-5">
                <FileCheck2 className="h-5 w-5 text-[#99f6e4]" />

                <p className="mt-6 text-2xl font-bold text-white">
                  {resume ? "Ready" : "Missing"}
                </p>

                <p className="mt-1 text-xs uppercase tracking-[0.1em] text-[#8e95a2]">
                  Resume status
                </p>
              </div>
            </div>
          </div>
        </section>

        {resumeError ? (
          <section
            role="alert"
            className="flex gap-3 rounded-3xl border border-rose-500/30 bg-rose-500/10 px-5 py-4"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />

            <p className="text-sm leading-6 text-rose-300">
              {resumeError}
            </p>
          </section>
        ) : null}

        {!resume ? (
          <section className="rounded-[2rem] border border-dashed border-[#21252d] bg-[#121417] p-8 text-center shadow-2xl sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#99f6e4] text-[#042f2e]">
              <UploadCloud className="h-6 w-6 stroke-[2.2]" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-white">
              Upload a resume first
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#8e95a2]">
              No resume was found for your account. Upload your PDF or
              DOCX resume before using the automatic ATS checker.
            </p>

            <Link
              href="/resume"
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#99f6e4] px-6 text-sm font-semibold text-[#042f2e] transition hover:bg-[#5eead4] shadow-lg shadow-[#99f6e4]/10"
            >
              <UploadCloud className="h-4 w-4" />
              Upload Resume
            </Link>
          </section>
        ) : (
          <>
            <section className="rounded-[2rem] border border-[#21252d] bg-[#121417] p-6 text-white shadow-2xl sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#99f6e4] text-[#042f2e]">
                    <FileText className="h-6 w-6 stroke-[2.2]" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#99f6e4]">
                      Latest uploaded resume
                    </p>

                    <h2 className="mt-1 break-all text-xl font-bold text-white">
                      {resume.file_name}
                    </h2>

                    <p className="mt-2 text-sm text-[#8e95a2]">
                      Uploaded {formatDate(resume.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#99f6e4]/30 bg-[#99f6e4]/10 px-3 py-1.5 text-xs font-semibold text-[#99f6e4]">
                    Resume connected
                  </span>

                  {resume.analysis_completed_at ? (
                    <span className="rounded-full border border-[#21252d] bg-[#181b20] px-3 py-1.5 text-xs font-semibold text-[#8e95a2]">
                      Analysed {formatDate(resume.analysis_completed_at)}
                    </span>
                  ) : null}
                </div>
              </div>

              {!extractedText ? (
                <div className="mt-6 flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

                  <div>
                    <p className="text-sm font-semibold text-amber-300">
                      Extracted resume text is unavailable
                    </p>

                    <p className="mt-1 text-sm leading-6 text-amber-400/90">
                      The file exists, but the extracted_text column is
                      empty. You can paste the resume text manually below.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex gap-3 rounded-2xl border border-[#99f6e4]/30 bg-[#99f6e4]/10 px-5 py-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#99f6e4]" />

                  <div>
                    <p className="text-sm font-semibold text-[#99f6e4]">
                      Resume text loaded successfully
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#8e95a2]">
                      The ATS checker has automatically loaded your
                      extracted resume text from Supabase.
                    </p>
                  </div>
                </div>
              )}
            </section>

            <AtsForm
              key={resume.id}
              onAnalyse={handleAnalyse}
              isAnalysing={isAnalysing}
              initialText={extractedText}
            />

            {pageError ? (
              <section className="rounded-3xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-300">
                {pageError}
              </section>
            ) : null}

            {analysis ? (
              <div
                id="ats-results"
                className="scroll-mt-8 space-y-8"
              >
                <AtsScoreCard analysis={analysis} />

                <section>
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#99f6e4]">
                      Score breakdown
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-white">
                      ATS categories
                    </h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {analysis.categoryScores.map(
                      (categoryScore) => (
                        <AtsCategoryCard
                          key={categoryScore.category}
                          categoryScore={categoryScore}
                        />
                      ),
                    )}
                  </div>
                </section>

                <AtsRecommendations analysis={analysis} />

                <AtsChecksList checks={analysis.checks} />

                <section className="grid gap-6 lg:grid-cols-3">
                  <StoredListCard
                    label="Resume structure"
                    title="Detected sections"
                    icon={FileCheck2}
                    items={analysis.detectedSections}
                    emptyMessage="No standard resume sections were detected."
                  />

                  <StoredListCard
                    label="Searchable content"
                    title="Detected skills"
                    icon={BriefcaseBusiness}
                    items={analysis.detectedSkills}
                    emptyMessage="No recognised skills were detected."
                  />

                  <StoredListCard
                    label="Experience language"
                    title="Action verbs"
                    icon={Award}
                    items={analysis.detectedActionVerbs}
                    emptyMessage="No strong action verbs were detected."
                  />
                </section>
              </div>
            ) : null}

            <section className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#99f6e4]">
                  Saved Supabase analysis
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white">
                  Stored resume insights
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#8e95a2]">
                  These details were loaded from your latest resume
                  record.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <StoredListCard
                  label="Technical profile"
                  title="Skills"
                  icon={BriefcaseBusiness}
                  items={storedSkills}
                  emptyMessage="No stored skills are available."
                />

                <StoredListCard
                  label="Positive findings"
                  title="Strengths"
                  icon={Sparkles}
                  items={storedStrengths}
                  emptyMessage="No stored strengths are available."
                />

                <StoredListCard
                  label="Improvement plan"
                  title="Improvements"
                  icon={Lightbulb}
                  items={storedImprovements}
                  emptyMessage="No stored improvements are available."
                />

                <StoredListCard
                  label="Keyword analysis"
                  title="Missing keywords"
                  icon={ScanSearch}
                  items={storedMissingKeywords}
                  emptyMessage="No missing keywords are currently stored."
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <StoredTextCard
                  label="Professional introduction"
                  title="Summary"
                  icon={FileText}
                  value={storedSummary}
                  emptyMessage="No professional summary is stored."
                />

                <StoredTextCard
                  label="Personal details"
                  title="Contact information"
                  icon={Mail}
                  value={storedContact}
                  emptyMessage="No contact details are stored."
                />

                <StoredTextCard
                  label="Academic background"
                  title="Education"
                  icon={GraduationCap}
                  value={storedEducation}
                  emptyMessage="No education information is stored."
                />

                <StoredTextCard
                  label="Professional background"
                  title="Experience"
                  icon={BriefcaseBusiness}
                  value={storedExperience}
                  emptyMessage="No experience information is stored."
                />

                <StoredTextCard
                  label="Portfolio"
                  title="Projects"
                  icon={BookOpen}
                  value={storedProjects}
                  emptyMessage="No project information is stored."
                />

                <StoredTextCard
                  label="Qualifications"
                  title="Certifications"
                  icon={Award}
                  value={storedCertifications}
                  emptyMessage="No certification information is stored."
                />
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}