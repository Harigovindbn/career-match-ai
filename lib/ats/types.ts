export type AtsCheckStatus = "passed" | "warning" | "failed";

export type AtsCategory =
  | "contact"
  | "sections"
  | "skills"
  | "experience"
  | "achievements"
  | "readability"
  | "formatting";

export type AtsCheck = {
  id: string;
  title: string;
  description: string;
  status: AtsCheckStatus;
  score: number;
  maximumScore: number;
  category: AtsCategory;
  recommendation?: string;
};

export type AtsCategoryScore = {
  category: AtsCategory;
  label: string;
  score: number;
  maximumScore: number;
  percentage: number;
};

export type AtsAnalysisInput = {
  resumeText: string;
};

export type AtsAnalysis = {
  overallScore: number;
  rating:
    | "Excellent"
    | "Good"
    | "Needs Improvement"
    | "Poor";

  checks: AtsCheck[];
  categoryScores: AtsCategoryScore[];

  strengths: string[];
  recommendations: string[];

  detectedSections: string[];
  missingSections: string[];

  detectedSkills: string[];
  detectedActionVerbs: string[];
  measurableAchievements: string[];

  wordCount: number;
  summary: string;
};