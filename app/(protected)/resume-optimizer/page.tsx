import ResumeOptimizerClient from "@/components/resume-optimizer/ResumeOptimizerClient";
import { getLatestResume } from "@/lib/resume/get-latest-resume";

function toStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) =>
      typeof item === "string"
        ? item
        : typeof item === "object" && item !== null && "name" in item
          ? String((item as { name: unknown }).name)
          : "",
    )
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function ResumeOptimizerPage() {
  const { resume } = await getLatestResume();

  return (
    <ResumeOptimizerClient
      resumeId={resume?.id ?? null}
      initialResumeText={resume?.extracted_text?.trim() ?? ""}
      storedSkills={toStringList(resume?.skills)}
      atsScore={resume?.ats_score ?? null}
    />
  );
}
