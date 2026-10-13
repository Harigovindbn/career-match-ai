"use client";

import { useState } from "react";
import {
  FileSearch,
  LoaderCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";

type AtsFormProps = {
  onAnalyse: (resumeText: string) => void;
  isAnalysing?: boolean;
  initialText?: string;
};

export default function AtsForm({
  onAnalyse,
  isAnalysing = false,
  initialText = "",
}: AtsFormProps) {
  const [resumeText, setResumeText] = useState(initialText);
  const [error, setError] = useState("");

  const wordCount = resumeText
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedText = resumeText.trim();

    if (!cleanedText) {
      setError("Please paste your resume text before analysing.");
      return;
    }

    if (wordCount < 50) {
      setError(
        "Your resume text is too short. Please paste at least 50 words.",
      );
      return;
    }

    setError("");
    onAnalyse(cleanedText);
  }

  function handleReset() {
    setResumeText("");
    setError("");
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <FileSearch className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Analyse your resume
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Paste your resume text to calculate its ATS compatibility
                score.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600">
          {wordCount.toLocaleString()} words
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-7">
        <label
          htmlFor="resume-text"
          className="text-sm font-semibold text-slate-800"
        >
          Resume text
        </label>

        <textarea
          id="resume-text"
          value={resumeText}
          onChange={(event) => {
            setResumeText(event.target.value);

            if (error) {
              setError("");
            }
          }}
          placeholder={`Paste your complete resume here...

Example:

HARI GOVIND
Email: example@email.com
Phone: +91 9876543210

PROFESSIONAL SUMMARY
Motivated frontend developer...

SKILLS
HTML, CSS, JavaScript, React, Next.js...

EXPERIENCE
Developed responsive web applications...`}
          className="mt-3 min-h-[420px] w-full resize-y rounded-3xl border border-slate-200 bg-slate-50 px-5 py-5 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
          disabled={isAnalysing}
        />

        {error ? (
          <p className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">
            Your resume is analysed locally using rule-based TypeScript logic.
            No paid AI API is required.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleReset}
              disabled={isAnalysing || !resumeText}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </button>

            <button
              type="submit"
              disabled={isAnalysing}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAnalysing ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Analysing
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Calculate ATS Score
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}