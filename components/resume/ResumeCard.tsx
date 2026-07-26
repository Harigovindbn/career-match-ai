"use client";

import {
  CalendarDays,
  CheckCircle2,
  FileText,
  LoaderCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";

type ResumeStatus = "uploaded" | "analysing" | "analysed";

type ResumeCardProps = {
  fileName: string;
  fileSize?: string;
  uploadedAt?: string;
  status?: ResumeStatus;
  atsScore?: number | null;
  onReplace?: () => void;
  onDelete?: () => void;
  replacing?: boolean;
  deleting?: boolean;
};

const statusConfig: Record<
  ResumeStatus,
  {
    label: string;
    className: string;
    icon: "check" | "loader";
  }
> = {
  uploaded: {
    label: "Uploaded successfully",
    className:
      "border-sky-200/25 bg-sky-300/10 text-sky-50",
    icon: "check",
  },
  analysing: {
    label: "Analysis in progress",
    className:
      "border-amber-200/25 bg-amber-300/10 text-amber-50",
    icon: "loader",
  },
  analysed: {
    label: "Analysis completed",
    className:
      "border-emerald-200/25 bg-emerald-300/10 text-emerald-50",
    icon: "check",
  },
};

export default function ResumeCard({
  fileName,
  fileSize,
  uploadedAt,
  status = "uploaded",
  atsScore = null,
  onReplace,
  onDelete,
  replacing = false,
  deleting = false,
}: ResumeCardProps) {
  const currentStatus = statusConfig[status];
  const actionPending = replacing || deleting;

  return (
    <article className="glass liquid-hover overflow-hidden p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="glass-icon h-14 w-14 shrink-0">
          <FileText className="h-7 w-7 text-white" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              title={fileName}
              className="max-w-full truncate text-base font-semibold text-white"
            >
              {fileName}
            </h3>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${currentStatus.className}`}
            >
              {currentStatus.icon === "loader" ? (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}

              {currentStatus.label}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/55">
            {fileSize && (
              <span className="inline-flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                {fileSize}
              </span>
            )}

            {uploadedAt && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                Uploaded {uploadedAt}
              </span>
            )}
          </div>
        </div>

        <div className="glass-soft min-w-28 px-4 py-3 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/55">
            ATS score
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {atsScore !== null ? `${atsScore}%` : "—"}
          </p>

          <p className="mt-1 text-xs text-white/45">
            {atsScore !== null ? "Latest result" : "Not analysed"}
          </p>
        </div>
      </div>

      {(onReplace || onDelete) && (
        <div className="glass-divider mt-5 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:justify-end">
          {onReplace && (
            <button
              type="button"
              onClick={onReplace}
              disabled={actionPending}
              className="glass-button inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {replacing ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}

              {replacing ? "Replacing..." : "Replace resume"}
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={actionPending}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-red-200/25 bg-red-400/10 px-4 py-2 text-sm font-semibold text-red-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-red-200/40 hover:bg-red-400/20 hover:shadow-[0_12px_28px_rgba(80,10,20,0.24)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {deleting ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}

              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      )}
    </article>
  );
}