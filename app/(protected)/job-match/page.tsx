"use client";

import { useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";

import JobMatchForm from "@/components/job-match/JobMatchForm";
import KeywordCard from "@/components/job-match/KeywordCard";
import MatchScoreCard from "@/components/job-match/MatchScoreCard";
import SkillsCard from "@/components/job-match/SkillsCard";
import { analyseJobMatch } from "@/lib/job-match/analyse-job-match";
import type {
  JobMatchAnalysis,
  JobMatchInput,
} from "@/lib/job-match/types";

export default function JobMatchPage() {
  const [analysis, setAnalysis] =
    useState<JobMatchAnalysis | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  function handleAnalyse(input: JobMatchInput) {
    setIsLoading(true);
    setAnalysisError("");

    try {
      const result = analyseJobMatch(input);
      setAnalysis(result);

      window.setTimeout(() => {
        document
          .getElementById("job-match-results")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    } catch (error) {
      console.error("Job match analysis failed:", error);

      setAnalysis(null);
      setAnalysisError(
        "We could not analyse this job match. Please check the resume and job description and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleClearResults() {
    setAnalysis(null);
    setAnalysisError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="space-y-8 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      {/* Page heading */}
      <section>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
              <Sparkles className="h-4 w-4" />
              Career Match AI
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Job Match Analysis
            </h1>

            <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-[var(--muted)]">
              Compare your resume with a job description to discover
              matching skills, missing keywords, strengths, and areas
              to improve.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs font-semibold text-[var(--primary)] shadow-xl">
            <BriefcaseBusiness className="h-4 w-4" />
            Free local analysis
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 text-[var(--foreground)] shadow-2xl sm:p-8">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[color-mix(in_srgb,var(--primary)_5%,transparent)]" />
        <div className="absolute -bottom-24 right-20 h-52 w-52 rounded-full bg-[color-mix(in_srgb,var(--primary)_5%,transparent)]" />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)] lg:items-center">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)]">
              <Target className="h-6 w-6" />
            </div>

            <h2 className="mt-6 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Check how well your resume matches a job
            </h2>

            <p className="mt-4 max-w-2xl text-xs sm:text-sm leading-relaxed text-[var(--muted)]">
              Paste your resume and the complete job description.
              Career Match AI will analyse relevant skills, keywords,
              experience requirements, education requirements, and
              overall compatibility.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--primary)]" />

              <span className="text-xs font-medium text-[var(--foreground)]/80">
                No paid AI API required
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--primary)]" />

              <span className="text-xs font-medium text-[var(--foreground)]/80">
                Instant skill comparison
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--primary)]" />

              <span className="text-xs font-medium text-[var(--foreground)]/80">
                Personalised recommendations
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Input form */}
      <section>
        <JobMatchForm
          onAnalyse={handleAnalyse}
          isLoading={isLoading}
        />

        {analysisError ? (
          <div
            role="alert"
            className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-medium text-rose-400"
          >
            {analysisError}
          </div>
        ) : null}
      </section>

      {/* Empty state */}
      {!analysis ? (
        <section className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center sm:p-12 shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)]">
            <BriefcaseBusiness className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[var(--foreground)]">
            Your job-match results will appear here
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-[var(--muted)]">
            Enter your resume text and a complete job description,
            then select Analyse Match.
          </p>
        </section>
      ) : null}

      {/* Analysis results */}
      {analysis ? (
        <section
          id="job-match-results"
          className="scroll-mt-24 space-y-6"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
                Analysis complete
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)]">
                {analysis.detectedJobTitle}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleClearResults}
              className="w-fit rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-xs font-semibold text-[var(--muted)] transition hover:border-[color-mix(in_srgb,var(--primary)_40%,transparent)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] shadow-xl"
            >
              Clear results
            </button>
          </div>

          <MatchScoreCard
            score={analysis.matchScore}
            matchLevel={analysis.matchLevel}
            summary={analysis.summary}
          />

          {/* Coverage scores */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <CoverageCard
              label="Skill coverage"
              score={analysis.skillCoverage}
            />

            <CoverageCard
              label="Keyword coverage"
              score={analysis.keywordCoverage}
            />

            <CoverageCard
              label="Experience coverage"
              score={analysis.experienceCoverage}
            />

            <CoverageCard
              label="Education coverage"
              score={analysis.educationCoverage}
            />
          </div>

          {/* Detected requirements */}
          <section className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)]">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Detected experience requirement
                  </p>

                  <p className="mt-1 text-xs font-bold text-[var(--foreground)]">
                    {analysis.detectedExperienceRequirement}
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)]">
                  <GraduationCap className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Detected education requirement
                  </p>

                  <p className="mt-1 text-xs font-bold text-[var(--foreground)]">
                    {analysis.detectedEducationRequirement}
                  </p>
                </div>
              </div>
            </article>
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <SkillsCard
              matchingSkills={analysis.matchingSkills}
              missingSkills={analysis.missingSkills}
              additionalSkills={analysis.additionalSkills}
            />

            <KeywordCard
              keywordCoverage={analysis.keywordCoverage}
              matchingKeywords={analysis.matchingKeywords}
              missingKeywords={analysis.missingKeywords}
              keywordDetails={analysis.keywordDetails}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <ListCard
              title="Your strengths"
              description="Positive areas detected in your resume."
              items={analysis.strengths}
              emptyMessage="No specific strengths were detected."
              variant="strength"
            />

            <ListCard
              title="Recommendations"
              description="Actions that may improve your job-match score."
              items={analysis.recommendations}
              emptyMessage="No additional recommendations are available."
              variant="recommendation"
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}

type CoverageCardProps = {
  label: string;
  score: number;
};

function CoverageCard({
  label,
  score,
}: CoverageCardProps) {
  const safeScore = Math.max(
    0,
    Math.min(100, Math.round(score)),
  );

  return (
    <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          {label}
        </p>

        <span className="text-xl font-bold text-[var(--foreground)]">
          {safeScore}%
        </span>
      </div>

      <div className="mt-4 h-2.5 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface-soft)]">
        <div
          className="h-full rounded-full bg-[var(--primary)] transition-all duration-500 shadow-sm"
          style={{ width: `${safeScore}%` }}
        />
      </div>
    </article>
  );
}

type ListCardProps = {
  title: string;
  description: string;
  items: string[];
  emptyMessage: string;
  variant: "strength" | "recommendation";
};

function ListCard({
  title,
  description,
  items,
  emptyMessage,
  variant,
}: ListCardProps) {
  const iconStyles =
    variant === "strength"
      ? "border-[color-mix(in_srgb,var(--primary)_20%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)]"
      : "border-amber-500/20 bg-amber-500/10 text-amber-400";

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${iconStyles}`}
        >
          {variant === "strength" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <Lightbulb className="h-5 w-5" />
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold text-[var(--foreground)]">
            {title}
          </h2>

          <p className="mt-1 text-xs text-[var(--muted)]">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--primary)]">
                {index + 1}
              </span>

              <p className="text-xs leading-relaxed text-[var(--muted)]">
                {item}
              </p>
            </div>
          ))
        ) : (
          <p className="text-xs text-[var(--muted)]">
            {emptyMessage}
          </p>
        )}
      </div>
    </section>
  );
}