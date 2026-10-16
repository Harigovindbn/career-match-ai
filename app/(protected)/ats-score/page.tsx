"use client";

import { useState } from "react";
import { ScanSearch, Sparkles, Upload, CheckCircle2, AlertTriangle, Loader2, FileText, ArrowRight } from "lucide-react";
import { analyzeResumeAction } from "./actions";

export default function ATSScorePage() {
  const [jobTitle, setJobTitle] = useState("Senior Full Stack Engineer");
  const [resumeText, setResumeText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("jobTitle", jobTitle);
    formData.append("resumeText", resumeText);

    const res = await analyzeResumeAction(formData);
    setIsLoading(false);

    if (res.success) {
      setAnalysisResult(res.data);
    } else {
      setErrorMsg(res.error || "Analysis failed.");
    }
  }

  return (
    <div className="space-y-6 bg-[var(--background)] text-[var(--foreground)] min-h-[calc(100vh-5rem)] flex flex-col justify-between pb-12">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
            <Sparkles className="h-4 w-4" />
            ATS Optimization Engine
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
            <ScanSearch className="w-6 h-6 text-[var(--primary)]" />
            ATS Score Checker
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[var(--muted)]">
            Analyze your resume against automated applicant tracking systems to maximize interview callbacks.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
        
        {/* Input Form Column */}
        <div className="lg:col-span-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleAnalyze} className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                <FileText className="h-5 w-5 text-[var(--primary)]" /> Target & Resume Content
              </h2>
              <p className="text-xs text-[var(--muted)] mt-1">
                Paste your resume text and target role title below for instant parsing.
              </p>
            </div>

            {errorMsg && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                Target Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-xs sm:text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                Paste Resume Text
              </label>
              <textarea
                rows={7}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your professional summary, work experience, and tech stack here..."
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-xs sm:text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !resumeText.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-6 py-3 text-xs font-semibold text-[var(--primary-text)] transition hover:bg-[var(--primary-hover)] shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Scanning Resume...
                </>
              ) : (
                <>
                  Run ATS Analysis <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-2xl flex flex-col justify-between min-h-[420px]">
          {analysisResult ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[var(--muted)]">Compatibility Score</span>
                  <h3 className="text-2xl font-black text-[var(--foreground)] mt-1">{analysisResult.targetRole}</h3>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--primary)]/30 bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-xl font-bold text-[var(--primary)]">
                  {analysisResult.atsScore}%
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Key Findings & Recommendations</h4>
                {analysisResult.suggestions.map((suggestion: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-[var(--primary)] shrink-0 mt-0.5" />
                    <span className="text-[var(--foreground)] leading-relaxed">{suggestion}</span>
                  </div>
                ))}
              </div>

              {analysisResult.missingKeywords.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">Missing High-Impact Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.missingKeywords.map((kw: string, i: number) => (
                      <span key={i} className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-medium text-red-400 uppercase">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center py-12 space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--muted)]">
                <ScanSearch className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">No Analysis Generated Yet</h3>
              <p className="text-xs text-[var(--muted)] max-w-sm">
                Paste your resume text and click "Run ATS Analysis" to evaluate keyword compatibility and get actionable optimization suggestions.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}