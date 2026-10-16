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
    <section className="rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white shadow-2xl sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#99f6e4]/20 bg-[#99f6e4]/10 text-[#99f6e4]">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#99f6e4]">
              Optimized draft
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              Resume Preview
            </h2>

            <p className="mt-2 text-xs leading-6 text-[#8e95a2]">
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
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#21252d] bg-[#181b20] px-4 text-xs font-semibold text-[#8e95a2] transition hover:bg-[#21252d] hover:text-white"
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
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#21252d] bg-[#181b20] px-4 text-xs font-semibold text-[#8e95a2] transition hover:bg-[#21252d] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-[#99f6e4]" />
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
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#21252d] bg-[#181b20] px-4 text-xs font-semibold text-[#8e95a2] transition hover:bg-[#21252d] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#99f6e4] px-4 text-xs font-semibold text-[#042f2e] transition hover:bg-[#5eead4] shadow-lg shadow-[#99f6e4]/10 disabled:cursor-not-allowed disabled:opacity-50"
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
          className={`mt-5 rounded-2xl border px-4 py-3 text-xs font-medium ${
            saveStatus === "success"
              ? "border-[#99f6e4]/30 bg-[#99f6e4]/10 text-[#99f6e4]"
              : "border-rose-500/30 bg-rose-500/10 text-rose-400"
          }`}
        >
          {saveMessage}
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-3xl border border-[#21252d] bg-[#181b20]">
        <div className="flex items-center justify-between border-b border-[#21252d] bg-[#121417] px-5 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#8e95a2]" />

            <p className="text-xs font-semibold uppercase tracking-wider text-white">
              {showOriginal
                ? "Original Resume"
                : "Optimized Resume"}
            </p>
          </div>

          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
              showOriginal
                ? "border-[#21252d] bg-[#181b20] text-[#8e95a2]"
                : "border-[#99f6e4]/30 bg-[#99f6e4]/10 text-[#99f6e4]"
            }`}
          >
            {showOriginal
              ? "Original"
              : "Optimized"}
          </span>
        </div>

        <div className="max-h-[700px] overflow-y-auto p-5 sm:p-6">
          {displayedText ? (
            <pre className="whitespace-pre-wrap break-words font-sans text-xs leading-relaxed text-[#8e95a2]">
              {displayedText}
            </pre>
          ) : (
            <p className="text-xs text-[#8e95a2]">
              No resume content is available.
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#99f6e4]/20 bg-[#99f6e4]/5 px-4 py-3">
        <p className="text-xs leading-relaxed text-[#99f6e4]">
          Review every suggested change before
          using this resume. Only keep statements
          that accurately represent your real
          experience, skills, and achievements.
        </p>
      </div>
    </section>
  );
}