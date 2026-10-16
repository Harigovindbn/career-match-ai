"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Lightbulb,
  Loader2,
  Sparkles,
  Target,
  XCircle,
  Bot,
} from "lucide-react";

import BulletImprovementCard from "@/components/resume-optimizer/BulletImprovementCard";
import OptimizedResumePreview from "@/components/resume-optimizer/OptimizedResumePreview";
import { analyseResumeAgainstJob } from "@/lib/resume-optimizer/analyse-job";
import { buildOptimizedResume } from "@/lib/resume-optimizer/build-optimized-resume";
import type { ResumeOptimizerResult } from "@/lib/resume-optimizer/types";
import { getAIBulletSuggestions } from "@/app/(protected)/resume-optimizer/actions";
import type { AIBulletImprovement } from "@/lib/ai/gemini";

type OptimizerWorkspaceProps = {
  resumeId?: string | null;
  initialResumeText?: string;
  storedSkills?: string[];
  atsScore?: number | null;
};

function ScoreBar({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  const safeScore = Math.max(
    0,
    Math.min(100, Math.round(score)),
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-slate-700">
          {label}
        </span>

        <span className="text-sm font-semibold text-slate-900">
          {safeScore}%
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-900 transition-all duration-500"
          style={{
            width: `${safeScore}%`,
          }}
        />
      </div>
    </div>
  );
}

function Badge({
  children,
  type,
}: {
  children: React.ReactNode;
  type: "success" | "danger" | "neutral";
}) {
  const styles = {
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    danger:
      "border-red-200 bg-red-50 text-red-700",
    neutral:
      "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-medium ${styles[type]}`}
    >
      {children}
    </span>
  );
}

export default function OptimizerWorkspace({
  resumeId = null,
  initialResumeText = "",
  storedSkills = [],
  atsScore = null,
}: OptimizerWorkspaceProps) {
  const [resumeText, setResumeText] =
    useState(initialResumeText);

  const [jobDescription, setJobDescription] =
    useState("");

  const [result, setResult] =
    useState<ResumeOptimizerResult | null>(null);

  const [error, setError] = useState("");

  const [isAnalysing, setIsAnalysing] =
    useState(false);

  const [aiSuggestions, setAiSuggestions] = useState<AIBulletImprovement[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const hasStoredResume = useMemo(
    () => initialResumeText.trim().length > 0,
    [initialResumeText],
  );

  const hasLinkedResume = Boolean(resumeId);

  const optimizedResume = useMemo(() => {
    if (!result) {
      return null;
    }

    return buildOptimizedResume(
      resumeText,
      result.bulletAnalyses,
    );
  }, [result, resumeText]);

  function handleAnalyse() {
    setError("");
    setResult(null);
    setAiSuggestions([]);
    setAiError("");

    if (!resumeText.trim()) {
      setError(
        "Please add your resume text before running the optimizer.",
      );

      return;
    }

    if (!jobDescription.trim()) {
      setError(
        "Please paste the job description you want to target.",
      );

      return;
    }

    setIsAnalysing(true);

    try {
      const analysis = analyseResumeAgainstJob({
        resumeText,
        jobDescription,
        storedSkills,
        atsScore,
      });

      setResult(analysis);

      window.setTimeout(() => {
        document
          .getElementById("optimizer-results")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    } catch (analysisError) {
      setError(
        analysisError instanceof Error
          ? analysisError.message
          : "Unable to analyse the resume.",
      );
    } finally {
      setIsAnalysing(false);
    }
  }

  async function handleFetchAiSuggestions() {
    if (!result || result.weakBullets.length === 0) return;

    setIsAiLoading(true);
    setAiError("");

    const bulletList = result.weakBullets.map((b) => b.original);
    const aiRes = await getAIBulletSuggestions(bulletList, jobDescription);

    if (aiRes.success && aiRes.data) {
      setAiSuggestions(aiRes.data);
    } else {
      setAiError(aiRes.message || "Failed to generate AI suggestions.");
    }

    setIsAiLoading(false);
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Sparkles className="h-6 w-6" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Resume Optimizer
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Compare your resume against a specific job
              description and discover the skills,
              keywords, bullet-point weaknesses, and
              improvements that can strengthen your
              application.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Resume source
            </p>

            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
              {hasStoredResume ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Saved resume loaded
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Paste resume manually
                </>
              )}
            </div>

            {hasLinkedResume ? (
              <p className="mt-2 text-xs text-emerald-700">
                Connected to your saved resume
              </p>
            ) : (
              <p className="mt-2 text-xs text-slate-500">
                Manual resume mode
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Inputs */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Resume */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <FileSearch className="h-5 w-5 text-slate-700" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-950">
                Your Resume
              </h2>

              <p className="text-sm text-slate-500">
                Review or paste your resume text.
              </p>
            </div>
          </div>

          <textarea
            id="resumeText"
            name="resumeText"
            aria-label="Your Resume"
            value={resumeText}
            onChange={(event) =>
              setResumeText(event.target.value)
            }
            rows={18}
            placeholder="Paste your resume text here..."
            className="w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm leading-6 text-slate-900 caret-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-100"
            style={{ color: "#0f172a", backgroundColor: "#ffffff" }}
          />
        </div>

        {/* Job Description */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <Target className="h-5 w-5 text-slate-700" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-950">
                Target Job
              </h2>

              <p className="text-sm text-slate-500">
                Paste the complete job description.
              </p>
            </div>
          </div>

          <textarea
            id="jobDescription"
            name="jobDescription"
            aria-label="Target Job"
            value={jobDescription}
            onChange={(event) =>
              setJobDescription(event.target.value)
            }
            rows={18}
            placeholder="Paste the job description here..."
            className="w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm leading-6 text-slate-900 caret-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-100"
            style={{ color: "#0f172a", backgroundColor: "#ffffff" }}
          />
        </div>
      </section>

      {/* Error */}
      {error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <p>{error}</p>
        </div>
      ) : null}

      {/* Analyse */}
      <button
        type="button"
        onClick={handleAnalyse}
        disabled={isAnalysing}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isAnalysing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Analysing Resume...
          </>
        ) : (
          <>
            Optimize Resume
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>

      {/* Results */}
      {result ? (
        <div
          id="optimizer-results"
          className="scroll-mt-8 space-y-6"
        >
          {/* Score */}
          <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-7 text-white shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                Optimization Score
              </p>

              <div className="mt-5 flex items-end gap-2">
                <span className="text-6xl font-bold tracking-tight">
                  {result.overallScore}
                </span>

                <span className="pb-2 text-xl text-white/60">
                  /100
                </span>
              </div>

              <p className="mt-4 text-lg font-semibold">
                {result.scoreLabel}
              </p>

              <p className="mt-3 text-sm leading-6 text-white/65">
                Your score is calculated from keyword
                alignment, skills, experience signals,
                resume quality, and bullet-point quality.
              </p>
            </div>

            <div className="space-y-5 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">
                Score Breakdown
              </h2>

              <ScoreBar
                label="Keyword Match"
                score={
                  result.scoreBreakdown.keywordMatch
                }
              />

              <ScoreBar
                label="Skill Match"
                score={
                  result.scoreBreakdown.skillMatch
                }
              />

              <ScoreBar
                label="Experience Match"
                score={
                  result.scoreBreakdown.experienceMatch
                }
              />

              <ScoreBar
                label="Resume Quality"
                score={
                  result.scoreBreakdown.resumeQuality
                }
              />

              <ScoreBar
                label="Bullet Quality"
                score={
                  result.scoreBreakdown.bulletQuality
                }
              />
            </div>
          </section>

          {/* Skills */}
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                <h2 className="text-lg font-semibold text-slate-950">
                  Matching Skills
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {result.matchingSkills.length > 0 ? (
                  result.matchingSkills.map((skill) => (
                    <Badge
                      key={skill}
                      type="success"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No matching skills detected.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />

                <h2 className="text-lg font-semibold text-slate-950">
                  Missing Skills
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {result.missingSkills.length > 0 ? (
                  result.missingSkills.map((skill) => (
                    <Badge
                      key={skill}
                      type="danger"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No major missing skills detected.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Keywords */}
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-slate-950">
                Matching Keywords
              </h2>

              <div className="flex flex-wrap gap-2">
                {result.matchingKeywords.length > 0 ? (
                  result.matchingKeywords.map(
                    (keyword) => (
                      <Badge
                        key={keyword}
                        type="success"
                      >
                        {keyword}
                      </Badge>
                    ),
                  )
                ) : (
                  <p className="text-sm text-slate-500">
                    No matching keywords detected.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-slate-950">
                Missing Keywords
              </h2>

              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.length > 0 ? (
                  result.missingKeywords.map(
                    (keyword) => (
                      <Badge
                        key={keyword}
                        type="danger"
                      >
                        {keyword}
                      </Badge>
                    ),
                  )
                ) : (
                  <p className="text-sm text-slate-500">
                    Great — no major missing keywords
                    detected.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Suggestions */}
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <Lightbulb className="h-5 w-5 text-amber-600" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Recommended Improvements
                </h2>

                <p className="text-sm text-slate-500">
                  Prioritized changes for this job.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {result.suggestions.length > 0 ? (
                result.suggestions.map(
                  (suggestion, index) => (
                    <div
                      key={`${suggestion}-${index}`}
                      className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                        {index + 1}
                      </div>

                      <p className="text-sm leading-6 text-slate-700">
                        {suggestion}
                      </p>
                    </div>
                  ),
                )
              ) : (
                <p className="text-sm text-slate-500">
                  No major improvements were generated.
                </p>
              )}
            </div>
          </section>

          {/* Bullet analysis */}
          <div className="space-y-4">
            <BulletImprovementCard
              bullets={result.weakBullets}
            />

            {/* AI Enhancement Trigger */}
            {result.weakBullets.length > 0 && (
              <div className="rounded-[2rem] border border-blue-100 bg-blue-50/50 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Gemini AI Bullet Re-writer</h3>
                      <p className="text-xs text-slate-500">Generate tailored, action-oriented bullet replacements using Gemini AI.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleFetchAiSuggestions}
                    disabled={isAiLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating AI Improvements...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate AI Suggestions
                      </>
                    )}
                  </button>
                </div>

                {aiError && (
                  <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 mt-2">{aiError}</p>
                )}

                {aiSuggestions.length > 0 && (
                  <div className="space-y-3 mt-4 border-t border-blue-100 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">AI Suggested Improvements:</h4>
                    {aiSuggestions.map((item, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-blue-200 space-y-2 text-xs">
                        <p className="text-slate-500 line-through">Original: {item.original}</p>
                        <p className="font-semibold text-emerald-700">AI Improved: {item.improved}</p>
                        <p className="text-slate-600 italic">Reason: {item.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Optimized resume */}
          {optimizedResume ? (
            <OptimizedResumePreview
              resumeId={resumeId}
              jobDescription={jobDescription}
              originalText={
                optimizedResume.originalText
              }
              optimizedText={
                optimizedResume.optimizedText
              }
              matchScore={
                result.overallScore
              }
              replacementsApplied={
                optimizedResume.replacementsApplied
              }
              matchingSkills={
                result.matchingSkills
              }
              missingSkills={
                result.missingSkills
              }
              matchingKeywords={
                result.matchingKeywords
              }
              missingKeywords={
                result.missingKeywords
              }
            />
          ) : null}

          {/* Counts */}
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">
                Resume word count
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-950">
                {result.resumeWordCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">
                Job description word count
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-950">
                {result.jobDescriptionWordCount}
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}