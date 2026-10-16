"use client";

import { useState } from "react";
import { Sparkles, LoaderCircle, Briefcase, FileText, AlignLeft } from "lucide-react";

type JobMatchFormProps = {
  onAnalyse: (input: {
    resumeText: string;
    jobDescription: string;
    jobTitle?: string;
  }) => void;
  isLoading?: boolean;
};

export default function JobMatchForm({
  onAnalyse,
  isLoading = false,
}: JobMatchFormProps) {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!resumeText.trim()) {
      setError("Please paste your resume text.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please paste the job description.");
      return;
    }

    setError("");

    onAnalyse({
      resumeText: resumeText.trim(),
      jobDescription: jobDescription.trim(),
      jobTitle: jobTitle.trim() || undefined,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white shadow-2xl sm:p-8"
    >
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#99f6e4]" />
          Job Match Checker
        </h2>

        <p className="mt-1 text-sm text-[#8e95a2]">
          Compare your resume with a job description and check your match score.
        </p>
      </div>

      {/* Job Title */}
      <div>
        <label
          htmlFor="jobTitle"
          className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#8e95a2]"
        >
          <Briefcase className="h-4 w-4 text-[#99f6e4]" />
          Job title
        </label>

        <input
          id="jobTitle"
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Example: Front-End Developer"
          className="w-full rounded-xl border border-[#21252d] bg-[#181b20] px-4 py-3 text-sm text-white placeholder-[#8e95a2]/50 outline-none transition focus:border-[#99f6e4] focus:ring-1 focus:ring-[#99f6e4]"
        />
      </div>

      {/* Resume Text */}
      <div>
        <label
          htmlFor="resumeText"
          className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#8e95a2]"
        >
          <FileText className="h-4 w-4 text-[#99f6e4]" />
          Resume text
        </label>

        <textarea
          id="resumeText"
          rows={10}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume..."
          className="w-full rounded-xl border border-[#21252d] bg-[#181b20] p-4 text-sm text-white placeholder-[#8e95a2]/50 outline-none transition focus:border-[#99f6e4] focus:ring-1 focus:ring-[#99f6e4] leading-relaxed resize-y"
        />
      </div>

      {/* Job Description */}
      <div>
        <label
          htmlFor="jobDescription"
          className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#8e95a2]"
        >
          <AlignLeft className="h-4 w-4 text-[#99f6e4]" />
          Job description
        </label>

        <textarea
          id="jobDescription"
          rows={10}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description..."
          className="w-full rounded-xl border border-[#21252d] bg-[#181b20] p-4 text-sm text-white placeholder-[#8e95a2]/50 outline-none transition focus:border-[#99f6e4] focus:ring-1 focus:ring-[#99f6e4] leading-relaxed resize-y"
        />
      </div>

      {error && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-medium text-rose-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#99f6e4] px-5 py-3.5 text-sm font-semibold text-[#042f2e] transition hover:bg-[#5eead4] shadow-lg shadow-[#99f6e4]/10 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Analysing...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Analyse Match
          </>
        )}
      </button>
    </form>
  );
}