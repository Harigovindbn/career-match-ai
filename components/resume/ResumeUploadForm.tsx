"use client";

import {
  CheckCircle2,
  FileText,
  LoaderCircle,
  UploadCloud,
  X,
} from "lucide-react";
import {
  type ChangeEvent,
  type DragEvent,
  useActionState,
  useRef,
  useState,
} from "react";

import {
  uploadResume,
  type ResumeActionState,
} from "@/app/(protected)/resume/actions";

const initialState: ResumeActionState = {
  success: false,
  message: "",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_EXTENSIONS = ["pdf", "docx"];

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function formatFileSize(bytes: number): string {
  if (bytes <= 0) {
    return "0 Bytes";
  }

  const units = ["Bytes", "KB", "MB", "GB"];

  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  return `${(bytes / 1024 ** unitIndex).toFixed(1)} ${
    units[unitIndex]
  }`;
}

export default function ResumeUploadForm() {
  const [state, formAction, pending] = useActionState(
    uploadResume,
    initialState,
  );

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [clientError, setClientError] = useState("");
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function resetFileSelection(): void {
    setSelectedFile(null);
    setClientError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function validateFile(file: File): string {
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

    if (
      file.type &&
      !ALLOWED_MIME_TYPES.includes(file.type)
    ) {
      return "The selected document type is not supported.";
    }

    if (file.size === 0) {
      return "The selected file is empty.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "Your resume must be smaller than 5 MB.";
    }

    return "";
  }

  function setInputFile(file: File): void {
    if (!fileInputRef.current) {
      return;
    }

    const dataTransfer = new DataTransfer();

    dataTransfer.items.add(file);

    fileInputRef.current.files =
      dataTransfer.files;
  }

  function chooseFile(file: File): void {
    const validationError = validateFile(file);

    if (validationError) {
      resetFileSelection();
      setClientError(validationError);
      return;
    }

    setInputFile(file);
    setSelectedFile(file);
    setClientError("");
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const file = event.target.files?.[0];

    if (file) {
      chooseFile(file);
    }
  }

  function handleDragOver(
    event: DragEvent<HTMLDivElement>,
  ): void {
    event.preventDefault();
    event.stopPropagation();

    setDragging(true);
  }

  function handleDragLeave(
    event: DragEvent<HTMLDivElement>,
  ): void {
    event.preventDefault();
    event.stopPropagation();

    setDragging(false);
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>,
  ): void {
    event.preventDefault();
    event.stopPropagation();

    setDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      chooseFile(file);
    }
  }

  function removeSelectedFile(): void {
    resetFileSelection();
  }

  async function handleFormAction(
    formData: FormData,
  ): Promise<void> {
    await formAction(formData);

    resetFileSelection();
  }

  return (
    <form action={handleFormAction} className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-card-dark text-white">
        <div className="border-b border-white/10 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            Resume management
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Upload your resume
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
            Upload your latest resume so Career Match AI can
            analyse your experience, skills, and job
            suitability.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`rounded-3xl border-2 border-dashed p-8 text-center transition sm:p-12 ${
              dragging
                ? "border-white/50 bg-white/15"
                : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
            }`}
          >
            <input
              ref={fileInputRef}
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              disabled={pending}
              className="sr-only"
            />

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10">
              <UploadCloud className="h-8 w-8 text-white" />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              Drag and drop your resume here
            </h3>

            <p className="mt-2 text-sm text-white/55">
              Or select a document from your computer
            </p>

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={pending}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-dark transition hover:-translate-y-0.5 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Browse files
            </button>

            <p className="mt-5 text-xs text-white/40">
              PDF or DOCX only · Maximum file size 5 MB
            </p>
          </div>

          {selectedFile && (
            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 sm:flex-row sm:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <FileText className="h-6 w-6 text-white" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {selectedFile.name}
                </p>

                <p className="mt-1 text-xs text-white/50">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>

              <button
                type="button"
                onClick={removeSelectedFile}
                disabled={pending}
                aria-label="Remove selected file"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/65 transition hover:bg-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {(clientError ||
            (!state.success && state.message)) && (
            <div
              role="alert"
              className="mt-6 rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-100"
            >
              {clientError || state.message}
            </div>
          )}

          {state.success && state.message && (
            <div
              role="status"
              className="mt-6 flex items-center gap-3 rounded-2xl border border-green-300/20 bg-green-500/10 px-4 py-3 text-sm text-green-100"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0" />

              {state.message}
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="font-semibold text-foreground">
            Ready to upload your resume?
          </p>

          <p className="mt-1 text-sm text-muted">
            Make sure you selected your most recent
            professional resume.
          </p>
        </div>

        <button
          type="submit"
          disabled={
            !selectedFile ||
            pending ||
            Boolean(clientError)
          }
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand-dark px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {pending ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Uploading and analysing...
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4" />
              Upload resume
            </>
          )}
        </button>
      </section>
    </form>
  );
}