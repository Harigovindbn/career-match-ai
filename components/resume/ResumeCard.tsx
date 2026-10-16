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
      "border-[#99f6e4]/30 bg-[#99f6e4]/10 text-[#99f6e4]",
    icon: "check",
  },
  analysing: {
    label: "Analysis in progress",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-400",
    icon: "loader",
  },
  analysed: {
    label: "Analysis completed",
    className:
      "border-[#99f6e4]/30 bg-[#99f6e4]/10 text-[#99f6e4]",
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
    <article className="overflow-hidden rounded-3xl border border-[#21252d] bg-[#121417] p-5 text-white shadow-2xl transition hover:border-[#99f6e4]/40 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#99f6e4]/20 bg-[#99f6e4]/10 text-[#99f6e4]">
          <FileText className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              title={fileName}
              className="max-w-full truncate text-base font-bold text-white"
            >
              {fileName}
            </h3>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${currentStatus.className}`}
            >
              {currentStatus.icon === "loader" ? (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}

              {currentStatus.label}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#8e95a2]">
            {fileSize && (
              <span className="inline-flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#99f6e4]" />
                {fileSize}
              </span>
            )}

            {uploadedAt && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-[#99f6e4]" />
                Uploaded {uploadedAt}
              </span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[#21252d] bg-[#181b20] min-w-28 px-4 py-3 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#99f6e4]">
            ATS score
          </p>

          <p className="mt-1 text-2xl font-bold text-white">
            {atsScore !== null ? `${atsScore}%` : "—"}
          </p>

          <p className="mt-1 text-[11px] text-[#8e95a2]">
            {atsScore !== null ? "Latest result" : "Not analysed"}
          </p>
        </div>
      </div>

      {(onReplace || onDelete) && (
        <div className="mt-5 flex flex-col gap-3 border-t border-[#21252d] pt-5 sm:flex-row sm:justify-end">
          {onReplace && (
            <button
              type="button"
              onClick={onReplace}
              disabled={actionPending}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#21252d] bg-[#181b20] px-4 py-2 text-xs font-semibold text-[#8e95a2] transition hover:bg-[#21252d] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {replacing ? (
                <LoaderCircle className="h-4 w-4 animate-spin text-[#99f6e4]" />
              ) : (
                <RefreshCw className="h-4 w-4 text-[#99f6e4]" />
              )}

              {replacing ? "Replacing..." : "Replace resume"}
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={actionPending}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
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