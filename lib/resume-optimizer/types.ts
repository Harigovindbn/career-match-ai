import type { BulletAnalysis } from "./bullet-analyser";

export type ResumeOptimizerInput = {
  resumeText: string;
  jobDescription: string;
  storedSkills?: string[];
  atsScore?: number | null;
};

export type ResumeOptimizerScoreBreakdown = {
  keywordMatch: number;
  skillMatch: number;
  experienceMatch: number;
  resumeQuality: number;
  bulletQuality: number;
};

export type ResumeOptimizerResult = {
  overallScore: number;
  scoreLabel: string;

  matchingKeywords: string[];
  missingKeywords: string[];

  resumeSkills: string[];
  requiredSkills: string[];
  matchingSkills: string[];
  missingSkills: string[];

  suggestions: string[];

  bulletAnalyses: BulletAnalysis[];
  weakBullets: BulletAnalysis[];

  scoreBreakdown: ResumeOptimizerScoreBreakdown;

  resumeWordCount: number;
  jobDescriptionWordCount: number;
};