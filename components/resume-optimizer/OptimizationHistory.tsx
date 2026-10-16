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
          ? "border-[#99f6e4]/30 bg-[#99f6e4]/10 text-[#99f6e4]"
          : "border-rose-500/30 bg-rose-500/10 text-rose-400"
      }`}
    >
      {children}
    </span>
  );
}

export default function OptimizationHistory({
  items,
}: OptimizationHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const visibleItems = items.filter(
    (item) => !deletedIds.includes(item.id),
  );

  async function handleCopy(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
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
      const result = await deleteResumeOptimization(id);

      setMessage(result.message);
      setMessageType(result.success ? "success" : "error");

      if (result.success) {
        setDeletedIds((current) => [...current, id]);

        if (expandedId === id) {
          setExpandedId(null);
        }
      }
    });
  }

  if (visibleItems.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-[#21252d] bg-[#121417] p-8 text-center text-white shadow-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#99f6e4]/10 text-[#99f6e4] border border-[#99f6e4]/20">
          <Sparkles className="h-5 w-5" />
        </div>

        <h2 className="mt-4 text-xl font-bold text-white">
          No saved optimizations yet
        </h2>

        <p className="mx-auto mt-2 max-w-lg text-xs leading-6 text-[#8e95a2]">
          Optimize a resume and click Save to keep a copy here.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#99f6e4]">
          Saved versions
        </p>

        <h2 className="mt-2 text-2xl font-bold text-white">
          Optimization History
        </h2>

        <p className="mt-2 text-xs leading-6 text-[#8e95a2]">
          Reopen, review, copy, or delete previous optimized resumes.
        </p>
      </div>

      {message ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-xs font-medium ${
            messageType === "success"
              ? "border-[#99f6e4]/30 bg-[#99f6e4]/10 text-[#99f6e4]"
              : "border-rose-500/30 bg-rose-500/10 text-rose-400"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="space-y-4">
        {visibleItems.map((item) => {
          const isExpanded = expandedId === item.id;
          const matchingSkills = item.matching_skills ?? [];
          const missingSkills = item.missing_skills ?? [];
          const matchingKeywords = item.matching_keywords ?? [];
          const missingKeywords = item.missing_keywords ?? [];

          return (
            <article
              key={item.id}
              className="overflow-hidden rounded-3xl border border-[#21252d] bg-[#121417] text-white shadow-2xl"
            >
              <div className="p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-[#99f6e4] px-3 py-1 text-xs font-bold text-[#042f2e] shadow-sm shadow-[#99f6e4]/10">
                        {item.match_score ?? 0}% Match
                      </span>

                      <div className="flex items-center gap-2 text-xs text-[#8e95a2]">
                        <CalendarDays className="h-4 w-4 text-[#99f6e4]" />
                        {formatDate(item.created_at)}
                      </div>
                    </div>

                    <p className="mt-4 line-clamp-2 max-w-3xl text-xs leading-relaxed text-[#8e95a2]">
                      {item.job_description}
                    </p>

                    <p className="mt-3 text-[11px] font-medium text-white/60">
                      {item.replacements_applied ?? 0} bullet improvements applied
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.optimized_text)}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#21252d] bg-[#181b20] px-4 text-xs font-semibold text-[#8e95a2] transition hover:bg-[#21252d] hover:text-white"
                    >
                      {copiedId === item.id ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-[#99f6e4]" />
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
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#21252d] bg-[#181b20] px-4 text-xs font-semibold text-[#8e95a2] transition hover:bg-[#21252d] hover:text-white"
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
                      onClick={() => handleDelete(item.id)}
                      disabled={isPending}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
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
                <div className="border-t border-[#21252d] bg-[#181b20]/50 p-6 space-y-6">
                  <div className="grid gap-6 xl:grid-cols-3">
                    {/* Original Resume */}
                    <div className="rounded-2xl border border-[#21252d] bg-[#181b20] p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#8e95a2]" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                          Original Resume
                        </h3>
                      </div>

                      <pre className="max-h-[500px] overflow-y-auto whitespace-pre-wrap break-words font-sans text-xs leading-relaxed text-[#8e95a2]">
                        {item.original_text || "No original resume text recorded."}
                      </pre>
                    </div>

                    {/* Optimized Resume */}
                    <div className="rounded-2xl border border-[#21252d] bg-[#181b20] p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#99f6e4]" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                          Optimized Resume
                        </h3>
                      </div>

                      <pre className="max-h-[500px] overflow-y-auto whitespace-pre-wrap break-words font-sans text-xs leading-relaxed text-white">
                        {item.optimized_text}
                      </pre>
                    </div>

                    {/* Job Description */}
                    <div className="rounded-2xl border border-[#21252d] bg-[#181b20] p-5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                        Target Job Description
                      </h3>

                      <p className="mt-4 max-h-[500px] overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-[#8e95a2]">
                        {item.job_description}
                      </p>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-[#21252d] bg-[#181b20] p-5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#99f6e4]" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                          Matching Skills
                        </h3>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {matchingSkills.length > 0 ? (
                          matchingSkills.map((skill) => (
                            <SmallBadge key={skill} type="success">
                              {skill}
                            </SmallBadge>
                          ))
                        ) : (
                          <p className="text-xs text-[#8e95a2]">
                            No matching skills saved.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#21252d] bg-[#181b20] p-5">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-rose-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                          Missing Skills
                        </h3>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {missingSkills.length > 0 ? (
                          missingSkills.map((skill) => (
                            <SmallBadge key={skill} type="danger">
                              {skill}
                            </SmallBadge>
                          ))
                        ) : (
                          <p className="text-xs text-[#8e95a2]">
                            No missing skills saved.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Keywords Grid */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-[#21252d] bg-[#181b20] p-5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                        Matching Keywords
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {matchingKeywords.length > 0 ? (
                          matchingKeywords.map((keyword) => (
                            <SmallBadge key={keyword} type="success">
                              {keyword}
                            </SmallBadge>
                          ))
                        ) : (
                          <p className="text-xs text-[#8e95a2]">
                            No matching keywords saved.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#21252d] bg-[#181b20] p-5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                        Missing Keywords
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {missingKeywords.length > 0 ? (
                          missingKeywords.map((keyword) => (
                            <SmallBadge key={keyword} type="danger">
                              {keyword}
                            </SmallBadge>
                          ))
                        ) : (
                          <p className="text-xs text-[#8e95a2]">
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