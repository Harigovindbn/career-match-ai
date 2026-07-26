export type MatchLevel =
  | "Excellent Match"
  | "Good Match"
  | "Moderate Match"
  | "Low Match";

export type KeywordMatch = {
  keyword: string;
  found: boolean;
  importance: "high" | "medium" | "low";
};

export type JobMatchInput = {
  resumeText: string;
  jobDescription: string;
  resumeSkills?: string[];
  jobTitle?: string;
};

export type JobMatchAnalysis = {
  matchScore: number;
  matchLevel: MatchLevel;

  matchingSkills: string[];
  missingSkills: string[];
  additionalSkills: string[];

  matchingKeywords: string[];
  missingKeywords: string[];

  keywordCoverage: number;
  skillCoverage: number;
  experienceCoverage: number;
  educationCoverage: number;

  strengths: string[];
  recommendations: string[];

  detectedJobTitle: string;
  detectedExperienceRequirement: string;
  detectedEducationRequirement: string;

  keywordDetails: KeywordMatch[];

  summary: string;
};