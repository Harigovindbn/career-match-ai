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
        <span className="text-xs font-medium text-[#8e95a2]">
          {label}
        </span>

        <span className="text-xs font-bold text-white">
          {safeScore}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#181b20] border border-[#21252d]">
        <div
          className="h-full rounded-full bg-[#99f6e4] transition-all duration-500 shadow-sm"
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
      "border-[#99f6e4]/30 bg-[#99f6e4]/10 text-[#99f6e4]",
    danger:
      "border-rose-500/30 bg-rose-500/10 text-rose-400",
    neutral:
      "border-[#21252d] bg-[#181b20] text-[#8e95a2]",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${styles[type]}`}
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
      <section className="overflow-hidden rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white shadow-2xl sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#99f6e4] text-[#042f2e]">
              <Sparkles className="h-6 w-6 stroke-[2.2]" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Resume Optimizer
            </h1>

            <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#8e95a2]">
              Compare your resume against a specific job
              description and discover the skills,
              keywords, bullet-point weaknesses, and
              improvements that can strengthen your
              application.
            </p>
          </div>

          <div className="rounded-2xl border border-[#21252d] bg-[#181b20] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#99f6e4]">
              Resume source
            </p>

            <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-white">
              {hasStoredResume ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-[#99f6e4]" />
                  Saved resume loaded
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  Paste resume manually
                </>
              )}
            </div>

            {hasLinkedResume ? (
              <p className="mt-2 text-[11px] text-[#99f6e4]">
                Connected to your saved resume
              </p>
            ) : (
              <p className="mt-2 text-[11px] text-[#8e95a2]">
                Manual resume mode
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Inputs */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Resume */}
        <div className="rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white shadow-2xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#21252d] bg-[#181b20] text-[#99f6e4]">
              <FileSearch className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-white">
                Your Resume
              </h2>

              <p className="text-xs text-[#8e95a2]">
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
            className="w-full resize-y rounded-2xl border border-[#21252d] bg-[#181b20] p-4 text-xs leading-relaxed text-white outline-none transition placeholder:text-[#8e95a2]/50 focus:border-[#99f6e4] focus:ring-1 focus:ring-[#99f6e4]"
          />
        </div>

        {/* Job Description */}
        <div className="rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white shadow-2xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#21252d] bg-[#181b20] text-[#99f6e4]">
              <Target className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-white">
                Target Job
              </h2>

              <p className="text-xs text-[#8e95a2]">
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
            className="w-full resize-y rounded-2xl border border-[#21252d] bg-[#181b20] p-4 text-xs leading-relaxed text-white outline-none transition placeholder:text-[#8e95a2]/50 focus:border-[#99f6e4] focus:ring-1 focus:ring-[#99f6e4]"
          />
        </div>
      </section>

      {/* Error */}
      {error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-medium text-rose-400"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      {/* Analyse */}
      <button
        type="button"
        onClick={handleAnalyse}
        disabled={isAnalysing}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#99f6e4] px-6 py-4 text-sm font-semibold text-[#042f2e] shadow-lg shadow-[#99f6e4]/10 transition hover:bg-[#5eead4] disabled:cursor-not-allowed disabled:opacity-60"
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
            <div className="rounded-3xl border border-[#21252d] bg-[#121417] p-7 text-white shadow-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#99f6e4]">
                Optimization Score
              </p>

              <div className="mt-5 flex items-end gap-2">
                <span className="text-6xl font-bold tracking-tight text-white">
                  {result.overallScore}
                </span>

                <span className="pb-2 text-xl text-[#8e95a2]">
                  /100
                </span>
              </div>

              <p className="mt-4 text-lg font-bold text-white">
                {result.scoreLabel}
              </p>

              <p className="mt-3 text-xs leading-relaxed text-[#8e95a2]">
                Your score is calculated from keyword
                alignment, skills, experience signals,
                resume quality, and bullet-point quality.
              </p>
            </div>

            <div className="space-y-5 rounded-3xl border border-[#21252d] bg-[#121417] p-7 text-white shadow-2xl">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Score Breakdown
              </h2>

              <ScoreBar
                label="Keyword Match"
                score={result.scoreBreakdown.keywordMatch}
              />

              <ScoreBar
                label="Skill Match"
                score={result.scoreBreakdown.skillMatch}
              />

              <ScoreBar
                label="Experience Match"
                score={result.scoreBreakdown.experienceMatch}
              />

              <ScoreBar
                label="Resume Quality"
                score={result.scoreBreakdown.resumeQuality}
              />

              <ScoreBar
                label="Bullet Quality"
                score={result.scoreBreakdown.bulletQuality}
              />
            </div>
          </section>

          {/* Skills */}
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white shadow-2xl">
              <div className="mb-5 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#99f6e4]" />

                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Matching Skills
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {result.matchingSkills.length > 0 ? (
                  result.matchingSkills.map((skill) => (
                    <Badge key={skill} type="success">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-xs text-[#8e95a2]">
                    No matching skills detected.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white shadow-2xl">
              <div className="mb-5 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-rose-400" />

                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Missing Skills
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {result.missingSkills.length > 0 ? (
                  result.missingSkills.map((skill) => (
                    <Badge key={skill} type="danger">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-xs text-[#8e95a2]">
                    No major missing skills detected.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Keywords */}
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white shadow-2xl">
              <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
                Matching Keywords
              </h2>

              <div className="flex flex-wrap gap-2">
                {result.matchingKeywords.length > 0 ? (
                  result.matchingKeywords.map((keyword) => (
                    <Badge key={keyword} type="success">
                      {keyword}
                    </Badge>
                  ))
                ) : (
                  <p className="text-xs text-[#8e95a2]">
                    No matching keywords detected.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white shadow-2xl">
              <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
                Missing Keywords
              </h2>

              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.length > 0 ? (
                  result.missingKeywords.map((keyword) => (
                    <Badge key={keyword} type="danger">
                      {keyword}
                    </Badge>
                  ))
                ) : (
                  <p className="text-xs text-[#8e95a2]">
                    Great — no major missing keywords detected.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Suggestions */}
          <section className="rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white shadow-2xl sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                <Lightbulb className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Recommended Improvements
                </h2>

                <p className="text-xs text-[#8e95a2]">
                  Prioritized changes for this job.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {result.suggestions.length > 0 ? (
                result.suggestions.map((suggestion, index) => (
                  <div
                    key={`${suggestion}-${index}`}
                    className="flex gap-4 rounded-2xl border border-[#21252d] bg-[#181b20] p-4"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#99f6e4] text-xs font-bold text-[#042f2e]">
                      {index + 1}
                    </div>

                    <p className="text-xs leading-relaxed text-[#8e95a2]">
                      {suggestion}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#8e95a2]">
                  No major improvements were generated.
                </p>
              )}
            </div>
          </section>

          {/* Bullet analysis */}
          <div className="space-y-4">
            <BulletImprovementCard bullets={result.weakBullets} />

            {/* AI Enhancement Trigger */}
            {result.weakBullets.length > 0 && (
              <div className="rounded-3xl border border-[#99f6e4]/20 bg-[#121417] p-6 text-white shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#99f6e4] text-[#042f2e]">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Gemini AI Bullet Re-writer</h3>
                      <p className="text-xs text-[#8e95a2]">Generate tailored, action-oriented bullet replacements using Gemini AI.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleFetchAiSuggestions}
                    disabled={isAiLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#99f6e4] px-4 py-2.5 text-xs font-semibold text-[#042f2e] shadow-lg shadow-[#99f6e4]/10 transition hover:bg-[#5eead4] disabled:opacity-50"
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
                  <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl mt-2">{aiError}</p>
                )}

                {aiSuggestions.length > 0 && (
                  <div className="space-y-3 mt-4 border-t border-[#21252d] pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#99f6e4]">AI Suggested Improvements:</h4>
                    {aiSuggestions.map((item, idx) => (
                      <div key={idx} className="bg-[#181b20] border border-[#21252d] p-4 rounded-2xl space-y-2 text-xs">
                        <p className="text-[#8e95a2] line-through">Original: {item.original}</p>
                        <p className="font-semibold text-[#99f6e4]">AI Improved: {item.improved}</p>
                        <p className="text-[#8e95a2] italic">Reason: {item.explanation}</p>
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
              originalText={optimizedResume.originalText}
              optimizedText={optimizedResume.optimizedText}
              matchScore={result.overallScore}
              replacementsApplied={optimizedResume.replacementsApplied}
              matchingSkills={result.matchingSkills}
              missingSkills={result.missingSkills}
              matchingKeywords={result.matchingKeywords}
              missingKeywords={result.missingKeywords}
            />
          ) : null}

          {/* Counts */}
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-[#21252d] bg-[#121417] p-5 text-white shadow-2xl">
              <p className="text-xs text-[#8e95a2]">
                Resume word count
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {result.resumeWordCount}
              </p>
            </div>

            <div className="rounded-3xl border border-[#21252d] bg-[#121417] p-5 text-white shadow-2xl">
              <p className="text-xs text-[#8e95a2]">
                Job description word count
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {result.jobDescriptionWordCount}
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}