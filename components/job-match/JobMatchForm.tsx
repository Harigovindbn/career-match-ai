"use client";

import { useState } from "react";

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
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Job Match Checker
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Compare your resume with a job description and check your match
          score.
        </p>
      </div>

      <div>
        <label
          htmlFor="jobTitle"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Job title
        </label>

        <input
          id="jobTitle"
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Example: Front-End Developer"
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>

      <div>
        <label
          htmlFor="resumeText"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Resume text
        </label>

        <textarea
          id="resumeText"
          rows={12}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>

      <div>
        <label
          htmlFor="jobDescription"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Job description
        </label>

        <textarea
          id="jobDescription"
          rows={12}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white"
      >
        {isLoading ? "Analysing..." : "Analyse Match"}
      </button>
    </form>
  );
}