"use client";

import { useState, useTransition } from "react";
import {
  Check,
  Clipboard,
  Download,
  FileText,
  Loader2,
  RefreshCcw,
  Save,
  Sparkles,
} from "lucide-react";

import { saveResumeOptimization } from "@/app/(protected)/resume-optimizer/actions";

type OptimizedResumePreviewProps = {
  resumeId?: string | null;

  jobDescription: string;

  originalText: string;
  optimizedText: string;

  matchScore: number;
  replacementsApplied: number;

  matchingSkills: string[];
  missingSkills: string[];

  matchingKeywords: string[];
  missingKeywords: string[];
};

export default function OptimizedResumePreview({
  resumeId = null,
  jobDescription,
  originalText,
  optimizedText,
  matchScore,
  replacementsApplied,
  matchingSkills,
  missingSkills,
  matchingKeywords,
  missingKeywords,
}: OptimizedResumePreviewProps) {
  const [showOriginal, setShowOriginal] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [saveMessage, setSaveMessage] =
    useState("");

  const [saveStatus, setSaveStatus] =
    useState<
      "idle" | "success" | "error"
    >("idle");

  const [isPending, startTransition] =
    useTransition();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        optimizedText,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  function handleSave() {
    setSaveMessage("");
    setSaveStatus("idle");

    startTransition(async () => {
      const result =
        await saveResumeOptimization({
          resumeId,

          jobDescription,

          originalText,
          optimizedText,

          matchScore,
          replacementsApplied,

          matchingSkills,
          missingSkills,

          matchingKeywords,
          missingKeywords,
        });

      setSaveMessage(result.message);

      setSaveStatus(
        result.success
          ? "success"
          : "error",
      );
    });
  }

  function handleDownload() {
    const blob = new Blob(
      [optimizedText],
      {
        type: "text/plain;charset=utf-8",
      },
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "optimized-resume.txt";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  const displayedText = showOriginal
    ? originalText
    : optimizedText;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Optimized draft
            </p>

            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              Resume Preview
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {replacementsApplied > 0
                ? `${replacementsApplied} bullet ${
                    replacementsApplied === 1
                      ? "point was"
                      : "points were"
                  } improved in this draft.`
                : "No automatic bullet replacements were applied."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              setShowOriginal(
                (current) =>
                  !current,
              )
            }
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCcw className="h-4 w-4" />

            {showOriginal
              ? "Show Optimized"
              : "Show Original"}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!optimizedText}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Clipboard className="h-4 w-4" />
                Copy
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!optimizedText}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Download
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              isPending ||
              !optimizedText ||
              !jobDescription.trim()
            }
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </button>
        </div>
      </div>

      {saveMessage ? (
        <div
          className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
            saveStatus === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {saveMessage}
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-500" />

            <p className="text-sm font-semibold text-slate-800">
              {showOriginal
                ? "Original Resume"
                : "Optimized Resume"}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              showOriginal
                ? "bg-slate-100 text-slate-600"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {showOriginal
              ? "Original"
              : "Optimized"}
          </span>
        </div>

        <div className="max-h-[700px] overflow-y-auto p-5 sm:p-6">
          {displayedText ? (
            <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-700">
              {displayedText}
            </pre>
          ) : (
            <p className="text-sm text-slate-500">
              No resume content is available.
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
        <p className="text-sm leading-6 text-blue-800">
          Review every suggested change before
          using this resume. Only keep statements
          that accurately represent your real
          experience, skills, and achievements.
        </p>
      </div>
    </section>
  );
}