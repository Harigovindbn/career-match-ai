import { extractSkills, uniqueStrings } from "./utils";

export type SkillMatchResult = {
  resumeSkills: string[];
  jobSkills: string[];
  matchingSkills: string[];
  missingSkills: string[];
  additionalSkills: string[];
};

function normalizeSkill(skill: string): string {
  return skill.trim().toLowerCase();
}

function skillsAreEqual(
  firstSkill: string,
  secondSkill: string,
): boolean {
  return normalizeSkill(firstSkill) === normalizeSkill(secondSkill);
}

export function matchSkills(input: {
  resumeText: string;
  jobDescription: string;
  suppliedResumeSkills?: string[];
}): SkillMatchResult {
  const resumeSkills = uniqueStrings([
    ...(input.suppliedResumeSkills ?? []),
    ...extractSkills(input.resumeText),
  ]);

  const jobSkills = extractSkills(input.jobDescription);

  const matchingSkills = jobSkills.filter((jobSkill: string) =>
    resumeSkills.some((resumeSkill: string) =>
      skillsAreEqual(jobSkill, resumeSkill),
    ),
  );

  const missingSkills = jobSkills.filter(
    (jobSkill: string) =>
      !matchingSkills.some((matchingSkill: string) =>
        skillsAreEqual(jobSkill, matchingSkill),
      ),
  );

  const additionalSkills = resumeSkills.filter(
    (resumeSkill: string) =>
      !jobSkills.some((jobSkill: string) =>
        skillsAreEqual(resumeSkill, jobSkill),
      ),
  );

  return {
    resumeSkills,
    jobSkills,
    matchingSkills,
    missingSkills,
    additionalSkills,
  };
}