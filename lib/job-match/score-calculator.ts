import type { MatchLevel } from "./types";

export type ScoreBreakdown = {
  skillScore: number;
  keywordScore: number;
  experienceScore: number;
  educationScore: number;
  overallScore: number;
};

type ScoreInput = {
  matchingSkills: string[];
  requiredSkills: string[];
  keywordCoverage: number;
  experienceMatched: boolean | null;
  educationMatched: boolean | null;
};

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateCoverage(
  matchedItems: string[],
  requiredItems: string[],
): number {
  if (requiredItems.length === 0) {
    return 100;
  }

  return clampScore(
    (matchedItems.length / requiredItems.length) * 100,
  );
}

function calculateRequirementScore(
  matched: boolean | null,
): number {
  if (matched === null) {
    return 100;
  }

  return matched ? 100 : 0;
}

export function calculateJobMatchScore(
  input: ScoreInput,
): ScoreBreakdown {
  const skillScore = calculateCoverage(
    input.matchingSkills,
    input.requiredSkills,
  );

  const keywordScore = clampScore(
    input.keywordCoverage,
  );

  const experienceScore = calculateRequirementScore(
    input.experienceMatched,
  );

  const educationScore = calculateRequirementScore(
    input.educationMatched,
  );

  const overallScore = clampScore(
    skillScore * 0.45 +
      keywordScore * 0.3 +
      experienceScore * 0.15 +
      educationScore * 0.1,
  );

  return {
    skillScore,
    keywordScore,
    experienceScore,
    educationScore,
    overallScore,
  };
}

export function getMatchLevel(
  overallScore: number,
): MatchLevel {
  if (overallScore >= 80) {
    return "Excellent Match";
  }

  if (overallScore >= 65) {
    return "Good Match";
  }

  if (overallScore >= 45) {
    return "Moderate Match";
  }

  return "Low Match";
}