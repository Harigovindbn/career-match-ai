"use client";

import {
  type ChangeEvent,
  useRef,
  useState,
  useTransition,
} from "react";

import {
  CalendarDays,
  CheckCircle2,
  FileText,
  Gauge,
  HardDrive,
  LoaderCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";

import {
  deleteResume,
  replaceResume,
} from "@/app/(protected)/resume/actions";

type ResumeManagerProps = {
  resumeId: string;
  fileName: string;
  filePath: string;
  fileSize?: string;
  uploadedAt?: string;
  status?: "uploaded" | "analysing" | "analysed";
  atsScore?: number | null;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_EXTENSIONS = ["pdf", "docx"];

function getStatusLabel(
  status: ResumeManagerProps["status"],
): string {
  if (status === "analysing") {
    return "Analysing";
  }

  if (status === "analysed") {
    return "Analysed";
  }

  return "Uploaded";
}

export default function ResumeManager({
  resumeId,
  fileName,
  filePath,
  fileSize,
  uploadedAt,
  status = "uploaded",
  atsScore = null,
}: ResumeManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [replacing, startReplaceTransition] =
    useTransition();

  const [deleting, startDeleteTransition] =
    useTransition();

  const statusLabel = getStatusLabel(status);

  const isBusy = replacing || deleting;

  function handleReplaceClick(): void {
    setMessage("");
    setError("");
    fileInputRef.current?.click();
  }

  function validateReplacementFile(file: File): string {
    const extension = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (
      !extension ||
      !ALLOWED_EXTENSIONS.includes(extension)
    ) {
      return "Only PDF and DOCX files are supported.";
    }

    if (file.size === 0) {
      return "The selected file is empty.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "Your resume must be smaller than 5 MB.";
    }

    return "";
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError =
      validateReplacementFile(file);

    if (validationError) {
      setMessage("");
      setError(validationError);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    const formData = new FormData();

    formData.append("resume", file);

    setMessage("");
    setError("");

    startReplaceTransition(async () => {
      try {
        const result = await replaceResume(
          resumeId,
          filePath,
          formData,
        );

        if (result.success) {
          setMessage(result.message);
        } else {
          setError(result.message);
        }
      } catch (replaceError) {
        console.error(
          "Resume replacement failed:",
          replaceError,
        );

        setError(
          "An unexpected error occurred while replacing the resume.",
        );
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    });
  }

  function handleDelete(): void {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?",
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    startDeleteTransition(async () => {
      try {
        const result = await deleteResume(
          resumeId,
          filePath,
        );

        if (result.success) {
          setMessage(result.message);
        } else {
          setError(result.message);
        }
      } catch (deleteError) {
        console.error(
          "Resume deletion failed:",
          deleteError,
        );

        setError(
          "An unexpected error occurred while deleting the resume.",
        );
      }
    });
  }

  return (
    <div className="space-y-5">
      <input
        ref={fileInputRef}
        name="replacementResume"
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        disabled={isBusy}
        className="sr-only"
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Resume card */}
        <article className="group flex min-h-[280px] flex-col rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white transition duration-300 hover:-translate-y-1 hover:border-[#99f6e4]/40 hover:bg-[#181b20] hover:shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#99f6e4]/20 bg-[#99f6e4]/10 text-[#99f6e4]">
              <FileText className="h-6 w-6" />
            </div>

            <span className="rounded-full border border-[#21252d] bg-[#181b20] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#99f6e4]">
              Resume
            </span>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#99f6e4]">
              Current document
            </p>

            <h3
              title={fileName}
              className="mt-3 line-clamp-2 break-words text-xl font-bold leading-7 text-white"
            >
              {fileName}
            </h3>

            <div className="mt-4 flex items-center gap-2 text-xs text-[#8e95a2]">
              <HardDrive className="h-4 w-4 shrink-0 text-[#99f6e4]" />

              <span>
                {fileSize || "File size unavailable"}
              </span>
            </div>
          </div>

          <p className="mt-auto pt-6 text-xs leading-6 text-[#8e95a2]">
            Your latest professional resume stored in your account.
          </p>
        </article>

        {/* Status card */}
        <article className="group flex min-h-[280px] flex-col rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white transition duration-300 hover:-translate-y-1 hover:border-[#99f6e4]/40 hover:bg-[#181b20] hover:shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#99f6e4]/20 bg-[#99f6e4]/10 text-[#99f6e4]">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <span className="rounded-full border border-[#21252d] bg-[#181b20] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#99f6e4]">
              Status
            </span>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#99f6e4]">
              Upload status
            </p>

            <p className="mt-3 text-3xl font-bold tracking-tight text-white">
              {statusLabel}
            </p>

            <div className="mt-4 flex items-start gap-2 text-xs leading-6 text-[#8e95a2]">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#99f6e4]" />

              <span>
                {uploadedAt
                  ? `Uploaded ${uploadedAt}`
                  : "Upload date unavailable"}
              </span>
            </div>
          </div>

          <p className="mt-auto pt-6 text-xs leading-6 text-[#8e95a2]">
            Your resume is available for Career Match AI tools.
          </p>
        </article>

        {/* ATS card */}
        <article className="group flex min-h-[280px] flex-col rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white transition duration-300 hover:-translate-y-1 hover:border-[#99f6e4]/40 hover:bg-[#181b20] hover:shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#99f6e4]/20 bg-[#99f6e4]/10 text-[#99f6e4]">
              <Gauge className="h-6 w-6" />
            </div>

            <span className="rounded-full border border-[#21252d] bg-[#181b20] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#99f6e4]">
              ATS
            </span>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#99f6e4]">
              ATS score
            </p>

            <div className="mt-3 flex items-end gap-2">
              <p className="text-4xl font-bold tracking-tight text-white">
                {atsScore ?? "—"}
              </p>

              {atsScore !== null && (
                <span className="pb-1 text-sm text-[#8e95a2]">
                  /100
                </span>
              )}
            </div>

            <p className="mt-4 text-xs leading-6 text-[#8e95a2]">
              {atsScore === null
                ? "Your resume has not been analysed yet."
                : "Your latest resume analysis score."}
            </p>
          </div>

          <p className="mt-auto pt-6 text-xs leading-6 text-[#8e95a2]">
            ATS analysis details will be displayed after processing.
          </p>
        </article>

        {/* Actions card */}
        <article className="group flex min-h-[280px] flex-col rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white transition duration-300 hover:-translate-y-1 hover:border-[#99f6e4]/40 hover:bg-[#181b20] hover:shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#99f6e4]/20 bg-[#99f6e4]/10 text-[#99f6e4]">
              <RefreshCw className="h-6 w-6" />
            </div>

            <span className="rounded-full border border-[#21252d] bg-[#181b20] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#99f6e4]">
              Actions
            </span>
          </div>

          <div className="mt-6 flex flex-1 flex-col">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#99f6e4]">
              Manage resume
            </p>

            <p className="mt-3 text-xs leading-6 text-[#8e95a2]">
              Replace your current document or remove it from your account.
            </p>

            <div className="mt-auto grid gap-3 pt-6">
              <button
                type="button"
                onClick={handleReplaceClick}
                disabled={isBusy}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#99f6e4] px-4 py-2.5 text-xs font-semibold text-[#042f2e] transition hover:bg-[#5eead4] shadow-lg shadow-[#99f6e4]/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {replacing ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}

                {replacing
                  ? "Replacing..."
                  : "Replace resume"}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isBusy}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}

                {deleting
                  ? "Deleting..."
                  : "Delete resume"}
              </button>
            </div>
          </div>
        </article>
      </div>

      {message && (
        <div
          role="status"
          className="rounded-2xl border border-[#99f6e4]/30 bg-[#99f6e4]/10 px-4 py-3 text-xs font-medium text-[#99f6e4]"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />

            <span>{message}</span>
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-medium text-rose-400"
        >
          {error}
        </div>
      )}
    </div>
  );
}