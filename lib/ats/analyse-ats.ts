import {
  ACTION_VERBS,
  COMMON_SKILLS,
  OPTIONAL_RESUME_SECTIONS,
  REQUIRED_RESUME_SECTIONS,
  SECTION_ALIASES,
  WEAK_PHRASES,
} from "./constants";

import type {
  AtsAnalysis,
  AtsAnalysisInput,
  AtsCategory,
  AtsCategoryScore,
  AtsCheck,
} from "./types";

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function calculateWordCount(text: string): number {
  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return words.length;
}

function containsEmail(text: string): boolean {
  return /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text);
}

function containsPhoneNumber(text: string): boolean {
  return /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}/.test(
    text,
  );
}

function containsLinkedIn(text: string): boolean {
  return (
    text.includes("linkedin.com") ||
    text.includes("linkedin")
  );
}

function detectSections(text: string): string[] {
  const detectedSections: string[] = [];

  for (const [section, aliases] of Object.entries(
    SECTION_ALIASES,
  )) {
    const found = aliases.some((alias) => {
      const headingPattern = new RegExp(
        `(^|\\n)\\s*${escapeRegExp(alias)}\\s*(:|\\n|$)`,
        "i",
      );

      return headingPattern.test(text);
    });

    if (found) {
      detectedSections.push(section);
    }
  }

  return detectedSections;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function detectSkills(text: string): string[] {
  return COMMON_SKILLS.filter((skill) => {
    const pattern = new RegExp(
      `(^|[^a-z0-9+#.])${escapeRegExp(skill)}([^a-z0-9+#.]|$)`,
      "i",
    );

    return pattern.test(text);
  });
}

function detectActionVerbs(text: string): string[] {
  return ACTION_VERBS.filter((verb) => {
    const pattern = new RegExp(`\\b${escapeRegExp(verb)}\\b`, "i");

    return pattern.test(text);
  });
}

function detectWeakPhrases(text: string): string[] {
  return WEAK_PHRASES.filter((phrase) =>
    text.includes(phrase),
  );
}

function detectMeasurableAchievements(text: string): string[] {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.filter((line) => {
    const hasNumber =
      /\b\d+(?:\.\d+)?%?\b/.test(line) ||
      /\b(?:rm|\$|₹|€|£)\s?\d+/i.test(line);

    const hasAchievementLanguage =
      /\b(increased|improved|reduced|saved|achieved|generated|grew|optimized|delivered|completed|managed|supported|developed)\b/i.test(
        line,
      );

    return hasNumber && hasAchievementLanguage;
  });
}

function calculateCheckStatus(
  score: number,
  maximumScore: number,
): AtsCheck["status"] {
  const percentage =
    maximumScore === 0 ? 0 : (score / maximumScore) * 100;

  if (percentage >= 80) {
    return "passed";
  }

  if (percentage >= 45) {
    return "warning";
  }

  return "failed";
}

function createCheck(input: {
  id: string;
  title: string;
  description: string;
  score: number;
  maximumScore: number;
  category: AtsCategory;
  recommendation?: string;
}): AtsCheck {
  return {
    ...input,
    status: calculateCheckStatus(
      input.score,
      input.maximumScore,
    ),
  };
}

function getRating(
  score: number,
): AtsAnalysis["rating"] {
  if (score >= 85) {
    return "Excellent";
  }

  if (score >= 70) {
    return "Good";
  }

  if (score >= 50) {
    return "Needs Improvement";
  }

  return "Poor";
}

function createCategoryScores(
  checks: AtsCheck[],
): AtsCategoryScore[] {
  const labels: Record<AtsCategory, string> = {
    contact: "Contact Information",
    sections: "Resume Sections",
    skills: "Skills",
    experience: "Experience",
    achievements: "Achievements",
    readability: "Readability",
    formatting: "ATS Formatting",
  };

  const categories = Object.keys(
    labels,
  ) as AtsCategory[];

  return categories.map((category) => {
    const categoryChecks = checks.filter(
      (check) => check.category === category,
    );

    const score = categoryChecks.reduce(
      (total, check) => total + check.score,
      0,
    );

    const maximumScore = categoryChecks.reduce(
      (total, check) => total + check.maximumScore,
      0,
    );

    const percentage =
      maximumScore === 0
        ? 0
        : Math.round((score / maximumScore) * 100);

    return {
      category,
      label: labels[category],
      score,
      maximumScore,
      percentage,
    };
  });
}

function createSummary(
  score: number,
  passedChecks: number,
  totalChecks: number,
): string {
  if (score >= 85) {
    return `Your resume is highly ATS-friendly with a score of ${score}%. It passed ${passedChecks} of ${totalChecks} important checks. Review the remaining recommendations before applying.`;
  }

  if (score >= 70) {
    return `Your resume has a good ATS score of ${score}%. It passed ${passedChecks} of ${totalChecks} checks, but several targeted improvements could make it stronger.`;
  }

  if (score >= 50) {
    return `Your resume scored ${score}% and needs improvement. Strengthen its sections, keywords, achievements, and formatting before submitting it.`;
  }

  return `Your resume scored ${score}% and may struggle with applicant tracking systems. Use the recommendations below to improve its structure and content.`;
}

export function analyseAtsResume(
  input: AtsAnalysisInput,
): AtsAnalysis {
  const originalText = input.resumeText.trim();
  const normalizedText = normalizeText(originalText);

  if (!normalizedText) {
    throw new Error("Resume text is required.");
  }

  const wordCount = calculateWordCount(originalText);
  const detectedSections = detectSections(originalText);

  const missingRequiredSections =
    REQUIRED_RESUME_SECTIONS.filter(
      (section) => !detectedSections.includes(section),
    );

  const detectedOptionalSections =
    OPTIONAL_RESUME_SECTIONS.filter((section) =>
      detectedSections.includes(section),
    );

  const detectedSkills = detectSkills(normalizedText);
  const detectedActionVerbs =
    detectActionVerbs(normalizedText);

  const weakPhrases = detectWeakPhrases(normalizedText);

  const measurableAchievements =
    detectMeasurableAchievements(originalText);

  const emailFound = containsEmail(originalText);
  const phoneFound = containsPhoneNumber(originalText);
  const linkedInFound = containsLinkedIn(normalizedText);

  const bulletLines = originalText
    .split("\n")
    .filter((line) =>
      /^\s*(?:[-•*]|[0-9]+[.)])\s+/.test(line),
    ).length;

  const longLines = originalText
    .split("\n")
    .filter((line) => line.trim().length > 180).length;

  const unusualSymbols =
    originalText.match(/[★◆■►✓✔➤]/g)?.length ?? 0;

  const checks: AtsCheck[] = [];

  const contactScore =
    (emailFound ? 4 : 0) +
    (phoneFound ? 4 : 0) +
    (linkedInFound ? 2 : 0);

  checks.push(
    createCheck({
      id: "contact-information",
      title: "Contact information",
      description:
        "Checks for an email address, phone number, and LinkedIn profile.",
      score: contactScore,
      maximumScore: 10,
      category: "contact",
      recommendation:
        contactScore < 8
          ? "Add a professional email address, phone number, and LinkedIn profile near the top of your resume."
          : undefined,
    }),
  );

  const requiredSectionScore =
    REQUIRED_RESUME_SECTIONS.length -
    missingRequiredSections.length;

  checks.push(
    createCheck({
      id: "required-sections",
      title: "Essential resume sections",
      description:
        "Checks for summary, skills, experience, and education sections.",
      score: requiredSectionScore * 4,
      maximumScore: 16,
      category: "sections",
      recommendation:
        missingRequiredSections.length > 0
          ? `Add these missing sections: ${missingRequiredSections.join(", ")}.`
          : undefined,
    }),
  );

  checks.push(
    createCheck({
      id: "optional-sections",
      title: "Supporting sections",
      description:
        "Checks for projects, certifications, achievements, languages, or internships.",
      score: Math.min(
        detectedOptionalSections.length,
        2,
      ) * 2,
      maximumScore: 4,
      category: "sections",
      recommendation:
        detectedOptionalSections.length === 0
          ? "Consider adding relevant projects, certifications, achievements, or internships."
          : undefined,
    }),
  );

  const skillsScore = Math.min(
    detectedSkills.length,
    10,
  );

  checks.push(
    createCheck({
      id: "skills-detected",
      title: "Relevant skills",
      description:
        "Checks whether your resume contains searchable technical and professional skills.",
      score: skillsScore * 2,
      maximumScore: 20,
      category: "skills",
      recommendation:
        detectedSkills.length < 5
          ? "Add a clear skills section containing relevant technical tools, technologies, and professional skills."
          : undefined,
    }),
  );

  const actionVerbScore = Math.min(
    detectedActionVerbs.length,
    5,
  );

  checks.push(
    createCheck({
      id: "action-verbs",
      title: "Strong action verbs",
      description:
        "Checks whether experience and project statements begin with clear action-oriented language.",
      score: actionVerbScore * 2,
      maximumScore: 10,
      category: "experience",
      recommendation:
        detectedActionVerbs.length < 4
          ? "Use action verbs such as developed, designed, implemented, improved, managed, and delivered."
          : undefined,
    }),
  );

  const weakPhraseScore =
    weakPhrases.length === 0
      ? 5
      : Math.max(0, 5 - weakPhrases.length);

  checks.push(
    createCheck({
      id: "weak-phrases",
      title: "Weak experience language",
      description:
        "Checks for vague phrases such as “worked on” and “responsible for.”",
      score: weakPhraseScore,
      maximumScore: 5,
      category: "experience",
      recommendation:
        weakPhrases.length > 0
          ? `Replace vague phrases such as: ${weakPhrases.join(", ")}.`
          : undefined,
    }),
  );

  const achievementScore = Math.min(
    measurableAchievements.length,
    3,
  );

  checks.push(
    createCheck({
      id: "measurable-achievements",
      title: "Measurable achievements",
      description:
        "Checks for quantified results using numbers, percentages, or measurable outcomes.",
      score: achievementScore * 5,
      maximumScore: 15,
      category: "achievements",
      recommendation:
        measurableAchievements.length < 2
          ? "Add measurable results, such as percentages, project counts, users supported, time saved, or performance improvements."
          : undefined,
    }),
  );

  let wordCountScore = 0;

  if (wordCount >= 350 && wordCount <= 900) {
    wordCountScore = 6;
  } else if (
    (wordCount >= 250 && wordCount < 350) ||
    (wordCount > 900 && wordCount <= 1100)
  ) {
    wordCountScore = 4;
  } else if (wordCount >= 150) {
    wordCountScore = 2;
  }

  checks.push(
    createCheck({
      id: "resume-length",
      title: "Resume length",
      description:
        "Checks whether the resume contains enough information without being excessively long.",
      score: wordCountScore,
      maximumScore: 6,
      category: "readability",
      recommendation:
        wordCount < 350
          ? "Add more detail about your projects, experience, achievements, and technical skills."
          : wordCount > 900
            ? "Remove repeated or less relevant content to make your resume more focused."
            : undefined,
    }),
  );

  const readabilityScore = longLines === 0 ? 4 : 2;

  checks.push(
    createCheck({
      id: "readability",
      title: "Readable statements",
      description:
        "Checks for overly long statements that may be difficult to scan.",
      score: readabilityScore,
      maximumScore: 4,
      category: "readability",
      recommendation:
        longLines > 0
          ? "Break long paragraphs into shorter achievement-focused bullet points."
          : undefined,
    }),
  );

  const bulletScore =
    bulletLines >= 4
      ? 5
      : bulletLines >= 2
        ? 3
        : 1;

  checks.push(
    createCheck({
      id: "bullet-points",
      title: "Bullet-point usage",
      description:
        "Checks whether achievements and responsibilities are presented using scannable bullet points.",
      score: bulletScore,
      maximumScore: 5,
      category: "formatting",
      recommendation:
        bulletLines < 4
          ? "Use simple bullet points for experience, projects, responsibilities, and achievements."
          : undefined,
    }),
  );

  const symbolScore =
    unusualSymbols <= 2
      ? 5
      : unusualSymbols <= 6
        ? 3
        : 1;

  checks.push(
    createCheck({
      id: "ats-safe-formatting",
      title: "ATS-safe formatting",
      description:
        "Checks for excessive decorative symbols that may not be parsed correctly.",
      score: symbolScore,
      maximumScore: 5,
      category: "formatting",
      recommendation:
        unusualSymbols > 2
          ? "Reduce decorative symbols and use standard headings and simple bullet points."
          : undefined,
    }),
  );

  const earnedScore = checks.reduce(
    (total, check) => total + check.score,
    0,
  );

  const maximumScore = checks.reduce(
    (total, check) => total + check.maximumScore,
    0,
  );

  const overallScore = Math.max(
    0,
    Math.min(
      100,
      Math.round((earnedScore / maximumScore) * 100),
    ),
  );

  const strengths = checks
    .filter((check) => check.status === "passed")
    .map((check) => `${check.title}: ${check.description}`);

  const recommendations = checks
    .filter(
      (check) =>
        check.status !== "passed" &&
        Boolean(check.recommendation),
    )
    .map((check) => check.recommendation as string);

  const passedChecks = checks.filter(
    (check) => check.status === "passed",
  ).length;

  return {
    overallScore,
    rating: getRating(overallScore),

    checks,
    categoryScores: createCategoryScores(checks),

    strengths,
    recommendations,

    detectedSections,
    missingSections: missingRequiredSections,

    detectedSkills,
    detectedActionVerbs,
    measurableAchievements,

    wordCount,

    summary: createSummary(
      overallScore,
      passedChecks,
      checks.length,
    ),
  };
}