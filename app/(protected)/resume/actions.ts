"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { analyseResume } from "@/lib/resume/analyse-resume";
import { extractResumeText } from "@/lib/resume/extract-text";
import { createClient } from "@/lib/supabase/server";

export type ResumeActionState = {
  success: boolean;
  message: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_EXTENSIONS = ["pdf", "docx"] as const;

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function validateResumeFile(
  file: File,
): ResumeActionState | null {
  if (file.size === 0) {
    return {
      success: false,
      message: "The selected file is empty.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      message: "The resume must be smaller than 5 MB.",
    };
  }

  const extension = file.name
    .split(".")
    .pop()
    ?.toLowerCase();

  if (
    !extension ||
    !ALLOWED_EXTENSIONS.includes(
      extension as "pdf" | "docx",
    )
  ) {
    return {
      success: false,
      message: "Only PDF and DOCX files are allowed.",
    };
  }

  if (
    file.type &&
    !ALLOWED_MIME_TYPES.includes(file.type)
  ) {
    return {
      success: false,
      message: "The selected file type is not supported.",
    };
  }

  return null;
}

function createStoredFileName(
  fileName: string,
  extension: string,
): string {
  const baseFileName = fileName
    .replace(/\.[^/.]+$/, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${baseFileName || "resume"}-${Date.now()}.${extension}`;
}

function getContentType(
  extension: string,
  fileType: string,
): string {
  if (fileType) {
    return fileType;
  }

  if (extension === "pdf") {
    return "application/pdf";
  }

  return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
}

async function processResumeAnalysis(
  resumeId: string,
  userId: string,
  resumeFile: File,
): Promise<ResumeActionState> {
  const supabase = await createClient();

  const { error: analysingStatusError } =
    await supabase
      .from("resumes")
      .update({
        status: "analysing",
      })
      .eq("id", resumeId)
      .eq("user_id", userId);

  if (analysingStatusError) {
    console.error(
      "Could not update analysis status:",
      analysingStatusError,
    );
  }

  try {
    const extractedText =
      await extractResumeText(resumeFile);

    const analysis = await analyseResume(extractedText);

    const { error: analysisUpdateError } =
      await supabase
        .from("resumes")
        .update({
          extracted_text: extractedText,
          ats_score: analysis.atsScore,
          skills: analysis.skills,
          strengths: analysis.strengths,
          improvements: analysis.improvements,
          missing_keywords: analysis.missingKeywords,
          education: analysis.education,
          experience: analysis.experience,
          projects: analysis.projects,
          certifications: analysis.certifications,
          contact: analysis.contact,
          summary: analysis.summary,
          status: "analysed",
          analysis_completed_at:
            new Date().toISOString(),
        })
        .eq("id", resumeId)
        .eq("user_id", userId);

    if (analysisUpdateError) {
      throw new Error(
        `Could not save the resume analysis: ${analysisUpdateError.message}`,
      );
    }

    return {
      success: true,
      message:
        "Resume uploaded and analysed successfully.",
    };
  } catch (error) {
    console.error("Resume analysis failed:", error);

    const failureMessage =
      error instanceof Error
        ? error.message
        : "An unknown analysis error occurred.";

    const { error: resetStatusError } =
      await supabase
        .from("resumes")
        .update({
          status: "uploaded",
          analysis_completed_at: null,
        })
        .eq("id", resumeId)
        .eq("user_id", userId);

    if (resetStatusError) {
      console.error(
        "Could not reset resume status:",
        resetStatusError,
      );
    }

    return {
      success: true,
      message: `Resume uploaded, but automatic analysis could not be completed: ${failureMessage}`,
    };
  }
}

export async function uploadResume(
  previousState: ResumeActionState,
  formData: FormData,
): Promise<ResumeActionState> {
  void previousState;

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const resumeFile = formData.get("resume");

  if (!(resumeFile instanceof File)) {
    return {
      success: false,
      message: "Please select a resume file.",
    };
  }

  const validationError =
    validateResumeFile(resumeFile);

  if (validationError) {
    return validationError;
  }

  const extension = resumeFile.name
    .split(".")
    .pop()!
    .toLowerCase();

  const contentType = getContentType(
    extension,
    resumeFile.type,
  );

  const storedFileName = createStoredFileName(
    resumeFile.name,
    extension,
  );

  const filePath = `${user.id}/${storedFileName}`;

  const { error: uploadError } =
    await supabase.storage
      .from("resumes")
      .upload(filePath, resumeFile, {
        contentType,
        cacheControl: "3600",
        upsert: false,
      });

  if (uploadError) {
    console.error(
      "Resume upload failed:",
      uploadError,
    );

    return {
      success: false,
      message: `Resume upload failed: ${uploadError.message}`,
    };
  }

  const {
    data: createdResume,
    error: databaseError,
  } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      file_name: resumeFile.name,
      file_path: filePath,
      file_size: resumeFile.size,
      mime_type: contentType,
      ats_score: null,
      status: "uploaded",
    })
    .select("id")
    .single();

  if (databaseError || !createdResume) {
    console.error(
      "Resume database insert failed:",
      databaseError,
    );

    await supabase.storage
      .from("resumes")
      .remove([filePath]);

    return {
      success: false,
      message: `Could not save resume details: ${
        databaseError?.message ||
        "The resume record was not created."
      }`,
    };
  }

  const result = await processResumeAnalysis(
    createdResume.id,
    user.id,
    resumeFile,
  );

  revalidatePath("/resume");
  revalidatePath("/dashboard");

  return result;
}

export async function deleteResume(
  resumeId: string,
  filePath: string,
): Promise<ResumeActionState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const { data: resume, error: resumeError } =
    await supabase
      .from("resumes")
      .select("id, user_id, file_path")
      .eq("id", resumeId)
      .eq("user_id", user.id)
      .maybeSingle();

  if (resumeError) {
    console.error(
      "Resume lookup failed:",
      resumeError,
    );

    return {
      success: false,
      message: `Could not find the resume: ${resumeError.message}`,
    };
  }

  if (!resume) {
    return {
      success: false,
      message: "Resume not found.",
    };
  }

  const storedFilePath =
    resume.file_path || filePath;

  if (!storedFilePath) {
    return {
      success: false,
      message:
        "The stored resume file path is missing.",
    };
  }

  const { error: storageError } =
    await supabase.storage
      .from("resumes")
      .remove([storedFilePath]);

  if (storageError) {
    console.error(
      "Resume storage deletion failed:",
      storageError,
    );

    return {
      success: false,
      message: `Could not delete the resume file: ${storageError.message}`,
    };
  }

  const { error: databaseError } =
    await supabase
      .from("resumes")
      .delete()
      .eq("id", resumeId)
      .eq("user_id", user.id);

  if (databaseError) {
    console.error(
      "Resume database deletion failed:",
      databaseError,
    );

    return {
      success: false,
      message: `The file was removed, but the resume record could not be deleted: ${databaseError.message}`,
    };
  }

  revalidatePath("/resume");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Resume deleted successfully.",
  };
}

export async function replaceResume(
  previousResumeId: string,
  previousFilePath: string,
  formData: FormData,
): Promise<ResumeActionState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const resumeFile = formData.get("resume");

  if (!(resumeFile instanceof File)) {
    return {
      success: false,
      message:
        "Please select a replacement resume.",
    };
  }

  const validationError =
    validateResumeFile(resumeFile);

  if (validationError) {
    return validationError;
  }

  const {
    data: oldResume,
    error: oldResumeError,
  } = await supabase
    .from("resumes")
    .select("id, user_id, file_path")
    .eq("id", previousResumeId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (oldResumeError) {
    console.error(
      "Current resume lookup failed:",
      oldResumeError,
    );

    return {
      success: false,
      message: `Could not find the current resume: ${oldResumeError.message}`,
    };
  }

  if (!oldResume) {
    return {
      success: false,
      message:
        "The current resume could not be found.",
    };
  }

  const extension = resumeFile.name
    .split(".")
    .pop()!
    .toLowerCase();

  const contentType = getContentType(
    extension,
    resumeFile.type,
  );

  const storedFileName = createStoredFileName(
    resumeFile.name,
    extension,
  );

  const newFilePath =
    `${user.id}/${storedFileName}`;

  const { error: uploadError } =
    await supabase.storage
      .from("resumes")
      .upload(newFilePath, resumeFile, {
        contentType,
        cacheControl: "3600",
        upsert: false,
      });

  if (uploadError) {
    console.error(
      "Replacement resume upload failed:",
      uploadError,
    );

    return {
      success: false,
      message: `Replacement upload failed: ${uploadError.message}`,
    };
  }

  const { error: updateError } =
    await supabase
      .from("resumes")
      .update({
        file_name: resumeFile.name,
        file_path: newFilePath,
        file_size: resumeFile.size,
        mime_type: contentType,
        extracted_text: null,
        ats_score: null,
        skills: null,
        strengths: null,
        improvements: null,
        missing_keywords: null,
        education: null,
        experience: null,
        projects: null,
        certifications: null,
        contact: null,
        summary: null,
        analysis_completed_at: null,
        status: "uploaded",
        created_at: new Date().toISOString(),
      })
      .eq("id", previousResumeId)
      .eq("user_id", user.id);

  if (updateError) {
    console.error(
      "Resume database update failed:",
      updateError,
    );

    await supabase.storage
      .from("resumes")
      .remove([newFilePath]);

    return {
      success: false,
      message: `Could not update resume details: ${updateError.message}`,
    };
  }

  const oldFilePath =
    oldResume.file_path || previousFilePath;

  if (
    oldFilePath &&
    oldFilePath !== newFilePath
  ) {
    const { error: removeOldFileError } =
      await supabase.storage
        .from("resumes")
        .remove([oldFilePath]);

    if (removeOldFileError) {
      console.error(
        "Old resume cleanup failed:",
        removeOldFileError,
      );
    }
  }

  const result = await processResumeAnalysis(
    previousResumeId,
    user.id,
    resumeFile,
  );

  revalidatePath("/resume");
  revalidatePath("/dashboard");

  return result.success
    ? {
        success: true,
        message: result.message.replace(
          "uploaded",
          "replaced",
        ),
      }
    : result;
}