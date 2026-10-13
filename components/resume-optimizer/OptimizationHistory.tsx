"use client";

import { useState, useTransition } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clipboard,
  FileText,
  Loader2,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";

import { deleteResumeOptimization } from "@/app/(protected)/resume-optimizer/history-actions";

export type OptimizationHistoryItem = {
  id: string;
  job_description: string;
  original_text: string;
  optimized_text: string;
  match_score: number | null;
  replacements_applied: number | null;

  matching_skills: string[] | null;
  missing_skills: string[] | null;

  matching_keywords: string[] | null;
  missing_keywords: string[] | null;

  created_at: string;
};

type OptimizationHistoryProps = {
  items: OptimizationHistoryItem[];
};

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function SmallBadge({
  children,
  type,
}: {
  children: React.ReactNode;
  type: "success" | "danger";
}) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
        type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {children}
    </span>
  );
}

export default function OptimizationHistory({
  items,
}: OptimizationHistoryProps) {
  const [expandedId, setExpandedId] =
    useState<string | null>(null);

  const [deletedIds, setDeletedIds] =
    useState<string[]>([]);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<"success" | "error">(
      "success",
    );

  const [copiedId, setCopiedId] =
    useState<string | null>(null);

  const [isPending, startTransition] =
    useTransition();

  const visibleItems = items.filter(
    (item) => !deletedIds.includes(item.id),
  );

  async function handleCopy(
    id: string,
    text: string,
  ) {
    try {
      await navigator.clipboard.writeText(
        text,
      );

      setCopiedId(id);

      window.setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch {
      setCopiedId(null);
    }
  }

  function handleDelete(id: string) {
    setMessage("");

    startTransition(async () => {
      const result =
        await deleteResumeOptimization(id);

      setMessage(result.message);

      setMessageType(
        result.success
          ? "success"
          : "error",
      );

      if (result.success) {
        setDeletedIds((current) => [
          ...current,
          id,
        ]);

        if (expandedId === id) {
          setExpandedId(null);
        }
      }
    });
  }

  if (visibleItems.length === 0) {
    return (
      <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <Sparkles className="h-5 w-5" />
        </div>

        <h2 className="mt-4 text-xl font-semibold text-slate-950">
          No saved optimizations yet
        </h2>

        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
          Optimize a resume and click Save to keep a copy here.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
          Saved versions
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
          Optimization History
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Reopen, review, copy, or delete previous optimized resumes.
        </p>
      </div>

      {message ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            messageType === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="space-y-4">
        {visibleItems.map((item) => {
          const isExpanded =
            expandedId === item.id;

          const matchingSkills =
            item.matching_skills ?? [];

          const missingSkills =
            item.missing_skills ?? [];

          const matchingKeywords =
            item.matching_keywords ?? [];

          const missingKeywords =
            item.missing_keywords ?? [];

          return (
            <article
              key={item.id}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
            >
              <div className="p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                        {item.match_score ?? 0}% Match
                      </span>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <CalendarDays className="h-4 w-4" />

                        {formatDate(
                          item.created_at,
                        )}
                      </div>
                    </div>

                    <p className="mt-4 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-600">
                      {item.job_description}
                    </p>

                    <p className="mt-3 text-xs font-medium text-slate-400">
                      {item.replacements_applied ?? 0} bullet improvements applied
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          item.id,
                          item.optimized_text,
                        )
                      }
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      {copiedId === item.id ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
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
                      onClick={() =>
                        setExpandedId(
                          isExpanded
                            ? null
                            : item.id,
                        )
                      }
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Close
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          View
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(item.id)
                      }
                      disabled={isPending}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}

                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {isExpanded ? (
                <div className="border-t border-slate-200 bg-slate-50/70 p-6">
                  <div className="grid gap-6 xl:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-500" />

                        <h3 className="font-semibold text-slate-950">
                          Original Resume
                        </h3>
                      </div>

                      <pre className="max-h-[500px] overflow-y-auto whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-700">
                        {item.original_text || "No original resume text recorded."}
                      </pre>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-600" />

                        <h3 className="font-semibold text-slate-950">
                          Optimized Resume
                        </h3>
                      </div>

                      <pre className="max-h-[500px] overflow-y-auto whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-700">
                        {item.optimized_text}
                      </pre>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <h3 className="font-semibold text-slate-950">
                        Target Job Description
                      </h3>

                      <p className="mt-4 max-h-[500px] overflow-y-auto whitespace-pre-wrap text-sm leading-7 text-slate-600">
                        {item.job_description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                        <h3 className="font-semibold text-slate-950">
                          Matching Skills
                        </h3>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {matchingSkills.length > 0 ? (
                          matchingSkills.map(
                            (skill) => (
                              <SmallBadge
                                key={skill}
                                type="success"
                              >
                                {skill}
                              </SmallBadge>
                            ),
                          )
                        ) : (
                          <p className="text-sm text-slate-500">
                            No matching skills saved.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-600" />

                        <h3 className="font-semibold text-slate-950">
                          Missing Skills
                        </h3>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {missingSkills.length > 0 ? (
                          missingSkills.map(
                            (skill) => (
                              <SmallBadge
                                key={skill}
                                type="danger"
                              >
                                {skill}
                              </SmallBadge>
                            ),
                          )
                        ) : (
                          <p className="text-sm text-slate-500">
                            No missing skills saved.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <h3 className="font-semibold text-slate-950">
                        Matching Keywords
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {matchingKeywords.length > 0 ? (
                          matchingKeywords.map(
                            (keyword) => (
                              <SmallBadge
                                key={keyword}
                                type="success"
                              >
                                {keyword}
                              </SmallBadge>
                            ),
                          )
                        ) : (
                          <p className="text-sm text-slate-500">
                            No matching keywords saved.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <h3 className="font-semibold text-slate-950">
                        Missing Keywords
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {missingKeywords.length > 0 ? (
                          missingKeywords.map(
                            (keyword) => (
                              <SmallBadge
                                key={keyword}
                                type="danger"
                              >
                                {keyword}
                              </SmallBadge>
                            ),
                          )
                        ) : (
                          <p className="text-sm text-slate-500">
                            No missing keywords saved.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}