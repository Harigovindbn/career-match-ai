import { matchKeywords } from "./keyword-matcher";
import { generateRecommendations } from "./recommendations";
import {
  calculateJobMatchScore,
  getMatchLevel,
} from "./score-calculator";
import { matchSkills } from "./skill-matcher";

import {
  extractEducationRequirement,
  extractExperienceRequirement,
  extractJobTitle,
  normalizeText,
} from "./utils";

import type {
  JobMatchAnalysis,
  JobMatchInput,
  KeywordMatch,
  MatchLevel,
} from "./types";

function checkRequirementMatch(
  resumeText: string,
  requirement: string | null,
): boolean | null {
  if (!requirement) {
    return null;
  }

  return resumeText.includes(requirement.toLowerCase());
}

function createKeywordDetails(
  jobKeywords: string[],
  matchingKeywords: string[],
): KeywordMatch[] {
  return jobKeywords.map((keyword, index) => {
    let importance: KeywordMatch["importance"] = "low";

    if (index < 5) {
      importance = "high";
    } else if (index < 10) {
      importance = "medium";
    }

    return {
      keyword,
      found: matchingKeywords.includes(keyword),
      importance,
    };
  });
}

function generateStrengths(input: {
  matchingSkills: string[];
  matchingKeywords: string[];
  skillCoverage: number;
  keywordCoverage: number;
  experienceMatched: boolean | null;
  educationMatched: boolean | null;
}): string[] {
  const strengths: string[] = [];

  if (input.matchingSkills.length > 0) {
    strengths.push(
      `Your resume contains ${input.matchingSkills.length} relevant job skills.`,
    );
  }

  if (input.skillCoverage >= 70) {
    strengths.push(
      "Your technical skill coverage is strong for this position.",
    );
  }

  if (input.keywordCoverage >= 70) {
    strengths.push(
      "Your resume uses many important keywords from the job description.",
    );
  }

  if (input.experienceMatched === true) {
    strengths.push(
      "Your resume appears to match the job's experience requirement.",
    );
  }

  if (input.educationMatched === true) {
    strengths.push(
      "Your education appears to match the job requirement.",
    );
  }

  if (strengths.length === 0) {
    strengths.push(
      "Your resume provides a starting point that can be tailored for this role.",
    );
  }

  return strengths;
}

function createSummary(
  score: number,
  matchLevel: MatchLevel,
  matchingSkillsCount: number,
  missingSkillsCount: number,
): string {
  if (score >= 80) {
    return `Your resume has an ${matchLevel.toLowerCase()} with a score of ${score}%. It includes ${matchingSkillsCount} matching skills. Review the remaining ${missingSkillsCount} missing skills before applying.`;
  }

  if (score >= 65) {
    return `Your resume has a ${matchLevel.toLowerCase()} with a score of ${score}%. It contains ${matchingSkillsCount} matching skills, but some targeted improvements could strengthen your application.`;
  }

  if (score >= 45) {
    return `Your resume has a ${matchLevel.toLowerCase()} with a score of ${score}%. Add relevant skills and job-description keywords before applying.`;
  }

  return `Your resume has a ${matchLevel.toLowerCase()} with a score of ${score}%. Tailor your skills, projects, experience, and keywords more closely to this job.`;
}

export function analyseJobMatch(
  input: JobMatchInput,
): JobMatchAnalysis {
  const resumeText = normalizeText(input.resumeText);
  const jobDescription = normalizeText(input.jobDescription);

  const skillResult = matchSkills({
    resumeText,
    jobDescription,
    suppliedResumeSkills: input.resumeSkills,
  });

  const keywordResult = matchKeywords({
    resumeText,
    jobDescription,
  });

  const extractedExperience =
    extractExperienceRequirement(jobDescription);

  const extractedEducation =
    extractEducationRequirement(jobDescription);

  const experienceMatched = checkRequirementMatch(
    resumeText,
    extractedExperience,
  );

  const educationMatched = checkRequirementMatch(
    resumeText,
    extractedEducation,
  );

  const scores = calculateJobMatchScore({
    matchingSkills: skillResult.matchingSkills,
    requiredSkills: skillResult.jobSkills,
    keywordCoverage: keywordResult.coverage,
    experienceMatched,
    educationMatched,
  });

  const matchLevel = getMatchLevel(scores.overallScore);

  const recommendations = generateRecommendations({
    overallScore: scores.overallScore,
    missingSkills: skillResult.missingSkills,
    missingKeywords: keywordResult.missingKeywords,
    experienceMatched,
    educationMatched,
  });

  const strengths = generateStrengths({
    matchingSkills: skillResult.matchingSkills,
    matchingKeywords: keywordResult.matchingKeywords,
    skillCoverage: scores.skillScore,
    keywordCoverage: scores.keywordScore,
    experienceMatched,
    educationMatched,
  });

  const detectedJobTitle =
    input.jobTitle?.trim() ||
    extractJobTitle(jobDescription) ||
    "Job Position";

  const keywordDetails = createKeywordDetails(
    keywordResult.jobKeywords,
    keywordResult.matchingKeywords,
  );

  const summary = createSummary(
    scores.overallScore,
    matchLevel,
    skillResult.matchingSkills.length,
    skillResult.missingSkills.length,
  );

  return {
    matchScore: scores.overallScore,
    matchLevel,

    matchingSkills: skillResult.matchingSkills,
    missingSkills: skillResult.missingSkills,
    additionalSkills: skillResult.additionalSkills,

    matchingKeywords: keywordResult.matchingKeywords,
    missingKeywords: keywordResult.missingKeywords,

    keywordCoverage: scores.keywordScore,
    skillCoverage: scores.skillScore,
    experienceCoverage: scores.experienceScore,
    educationCoverage: scores.educationScore,

    strengths,
    recommendations,

    detectedJobTitle,
    detectedExperienceRequirement:
      extractedExperience || "Not specified",
    detectedEducationRequirement:
      extractedEducation || "Not specified",

    keywordDetails,

    summary,
  };
}