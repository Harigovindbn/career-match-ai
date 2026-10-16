import {
  analyseResumeBullets,
  calculateBulletScore,
  getWeakBullets,
} from "@/lib/resume-optimizer/bullet-analyser";

import {
  compareKeywords,
  compareSkills,
  getWordCount,
} from "@/lib/resume-optimizer/keyword-engine";

import type {
  ResumeOptimizerInput,
  ResumeOptimizerResult,
} from "@/lib/resume-optimizer/types";

/**
  Separates squished CamelCase strings (e.g. "ServiceManagement" -> "Service Management")
  and normalizes keyword arrays so they display cleanly in badges and preview lists.
 */
function cleanKeywordList(keywords: string[]): string[] {
  if (!Array.isArray(keywords)) return [];

  const cleanedSet = new Set<string>();

  for (const item of keywords) {
    if (!item) continue;

    // Split CamelCase words jammed together without spaces
    const separated = item.replace(/([a-z])([A-Z])/g, "$1 $2");

    // Replace multiple spaces or non-standard spaces with a single space
    const normalized = separated.replace(/\s+/g, " ").trim();

    if (normalized.length > 1) {
      cleanedSet.add(normalized);
    }
  }

  return Array.from(cleanedSet);
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function calculatePercentage(
  matched: number,
  total: number,
  fallback = 0,
): number {
  if (total <= 0) {
    return fallback;
  }

  return clampScore((matched / total) * 100);
}

function getScoreLabel(score: number): string {
  if (score >= 85) {
    return "Excellent match";
  }

  if (score >= 70) {
    return "Strong match";
  }

  if (score >= 55) {
    return "Moderate match";
  }

  if (score >= 40) {
    return "Low match";
  }

  return "Needs significant improvement";
}

function calculateExperienceMatch(
  resumeText: string,
  jobDescription: string,
): number {
  const resume = resumeText.toLowerCase();
  const job = jobDescription.toLowerCase();

  const experienceIndicators = [
    "experience",
    "internship",
    "developed",
    "designed",
    "implemented",
    "managed",
    "created",
    "built",
    "improved",
    "project",
    "projects",
    "worked",
    "responsible",
    "achievement",
    "achievements",
  ];

  const requiredIndicators = experienceIndicators.filter(
    (indicator) => job.includes(indicator),
  );

  if (requiredIndicators.length === 0) {
    return 70;
  }

  const matchedIndicators = requiredIndicators.filter(
    (indicator) => resume.includes(indicator),
  );

  return calculatePercentage(
    matchedIndicators.length,
    requiredIndicators.length,
    60,
  );
}

function calculateResumeQuality(
  resumeText: string,
  atsScore?: number | null,
): number {
  if (
    typeof atsScore === "number" &&
    Number.isFinite(atsScore)
  ) {
    return clampScore(atsScore);
  }

  const text = resumeText.toLowerCase();

  let score = 25;

  const sections = [
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
  ];

  const detectedSections = sections.filter((section) =>
    text.includes(section),
  );

  score += detectedSections.length * 8;

  if (/\d+%/.test(resumeText)) {
    score += 8;
  }

  if (
    /\b(developed|designed|implemented|managed|created|improved|delivered|built|led|optimized)\b/i.test(
      resumeText,
    )
  ) {
    score += 10;
  }

  if (getWordCount(resumeText) >= 250) {
    score += 8;
  }

  return clampScore(score);
}

function createSuggestions({
  overallScore,
  missingKeywords,
  missingSkills,
  matchingSkills,
  resumeText,
  jobDescription,
  weakBulletCount,
}: {
  overallScore: number;
  missingKeywords: string[];
  missingSkills: string[];
  matchingSkills: string[];
  resumeText: string;
  jobDescription: string;
  weakBulletCount: number;
}): string[] {
  const suggestions: string[] = [];

  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();

  if (missingSkills.length > 0) {
    suggestions.push(
      `Add relevant evidence for these required skills where truthful: ${missingSkills
        .slice(0, 6)
        .join(", ")}.`,
    );
  }

  if (missingKeywords.length > 0) {
    suggestions.push(
      `Include important job-description keywords naturally, such as ${missingKeywords
        .slice(0, 6)
        .join(", ")}.`,
    );
  }

  if (
    !/\d+%|\d+\+|\$\d+|\d+\s*(users|clients|projects|hours|days)/i.test(
      resumeText,
    )
  ) {
    suggestions.push(
      "Add measurable achievements using percentages, numbers, time saved, users served, or projects completed.",
    );
  }

  if (
    !/\b(developed|designed|implemented|managed|created|improved|delivered|built|led|optimized)\b/i.test(
      resumeText,
    )
  ) {
    suggestions.push(
      "Start experience and project bullet points with strong action verbs such as Developed, Designed, Implemented, Improved, or Led.",
    );
  }

  if (weakBulletCount > 0) {
    suggestions.push(
      `Improve ${weakBulletCount} weak or moderate resume bullet${
        weakBulletCount === 1 ? "" : "s"
      } by using stronger action verbs, clearer impact, and measurable outcomes.`,
    );
  }

  if (
    jobLower.includes("experience") &&
    !resumeLower.includes("experience")
  ) {
    suggestions.push(
      "Add a clearly labelled Experience section so recruiters and ATS systems can locate your professional background.",
    );
  }

  if (
    jobLower.includes("project") &&
    !resumeLower.includes("project")
  ) {
    suggestions.push(
      "Include a Projects section showing practical work related to the target position.",
    );
  }

  if (
    jobLower.includes("certification") &&
    !resumeLower.includes("certification")
  ) {
    suggestions.push(
      "Add relevant certifications or completed professional training mentioned in the job description.",
    );
  }

  if (matchingSkills.length === 0) {
    suggestions.push(
      "The resume currently shows limited direct skill overlap with this job. Consider targeting a more relevant role or strengthening genuine related experience.",
    );
  }

  if (overallScore < 55) {
    suggestions.push(
      "Rewrite your professional summary to mention the target role, your strongest relevant skills, and the value you can provide.",
    );
  }

  if (overallScore >= 80) {
    suggestions.push(
      "Your resume is already strongly aligned. Focus on refining achievements and keeping the wording concise rather than adding excessive keywords.",
    );
  }

  return suggestions.slice(0, 8);
}

export function analyseResumeAgainstJob(
  input: ResumeOptimizerInput,
): ResumeOptimizerResult {
  const resumeText = input.resumeText.trim();
  const jobDescription = input.jobDescription.trim();

  if (resumeText.length < 50) {
    throw new Error(
      "The resume text is too short to analyse.",
    );
  }

  if (jobDescription.length < 80) {
    throw new Error(
      "Please paste a more complete job description.",
    );
  }

  const keywordComparison = compareKeywords(
    resumeText,
    jobDescription,
  );

  const skillComparison = compareSkills(
    resumeText,
    jobDescription,
    input.storedSkills ?? [],
  );

  // Clean and separate any squished CamelCase keywords
  const cleanMatchingKeywords = cleanKeywordList(
    keywordComparison.matchingKeywords,
  );
  const cleanMissingKeywords = cleanKeywordList(
    keywordComparison.missingKeywords,
  );

  const keywordMatch = calculatePercentage(
    cleanMatchingKeywords.length,
    cleanMatchingKeywords.length + cleanMissingKeywords.length,
  );

  const cleanMatchingSkills = cleanKeywordList(
    skillComparison.matchingSkills,
  );
  const cleanMissingSkills = cleanKeywordList(
    skillComparison.missingSkills,
  );

  const skillMatch = calculatePercentage(
    cleanMatchingSkills.length,
    skillComparison.requiredSkills.length,
    keywordMatch,
  );

  const experienceMatch = calculateExperienceMatch(
    resumeText,
    jobDescription,
  );

  const resumeQuality = calculateResumeQuality(
    resumeText,
    input.atsScore,
  );

  const bulletAnalyses =
    analyseResumeBullets(resumeText);

  const weakBullets =
    getWeakBullets(resumeText);

  const bulletQuality =
    bulletAnalyses.length > 0
      ? calculateBulletScore(bulletAnalyses)
      : 60;

  const overallScore = clampScore(
    keywordMatch * 0.35 +
      skillMatch * 0.25 +
      experienceMatch * 0.15 +
      resumeQuality * 0.15 +
      bulletQuality * 0.1,
  );

  const suggestions = createSuggestions({
    overallScore,
    missingKeywords: cleanMissingKeywords,
    missingSkills: cleanMissingSkills,
    matchingSkills: cleanMatchingSkills,
    resumeText,
    jobDescription,
    weakBulletCount: weakBullets.length,
  });

  return {
    overallScore,
    scoreLabel: getScoreLabel(overallScore),

    matchingKeywords: cleanMatchingKeywords,
    missingKeywords: cleanMissingKeywords,

    resumeSkills: skillComparison.resumeSkills,
    requiredSkills: skillComparison.requiredSkills,

    matchingSkills: cleanMatchingSkills,
    missingSkills: cleanMissingSkills,

    suggestions,

    bulletAnalyses,
    weakBullets,

    scoreBreakdown: {
      keywordMatch,
      skillMatch,
      experienceMatch,
      resumeQuality,
      bulletQuality,
    },

    resumeWordCount: getWordCount(resumeText),
    jobDescriptionWordCount: getWordCount(jobDescription),
  };
}