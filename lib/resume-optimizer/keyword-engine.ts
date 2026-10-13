const STOP_WORDS = new Set([
  "a",
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "also",
  "am",
  "an",
  "and",
  "any",
  "are",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "by",
  "can",
  "could",
  "did",
  "do",
  "does",
  "doing",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "has",
  "have",
  "having",
  "he",
  "her",
  "here",
  "hers",
  "herself",
  "him",
  "himself",
  "his",
  "how",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "itself",
  "just",
  "me",
  "more",
  "most",
  "my",
  "myself",
  "no",
  "nor",
  "not",
  "now",
  "of",
  "off",
  "on",
  "once",
  "only",
  "or",
  "other",
  "our",
  "ours",
  "ourselves",
  "out",
  "over",
  "own",
  "same",
  "she",
  "should",
  "so",
  "some",
  "such",
  "than",
  "that",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "to",
  "too",
  "under",
  "until",
  "up",
  "very",
  "was",
  "we",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "who",
  "whom",
  "why",
  "will",
  "with",
  "would",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "ability",
  "applicant",
  "applicants",
  "candidate",
  "candidates",
  "company",
  "description",
  "excellent",
  "including",
  "job",
  "looking",
  "must",
  "preferred",
  "required",
  "requirements",
  "responsibilities",
  "responsible",
  "role",
  "strong",
  "team",
  "using",
  "work",
  "working",
  "year",
  "years",
]);

export const TECHNICAL_SKILLS = [
  "html",
  "css",
  "javascript",
  "typescript",
  "react",
  "react.js",
  "next.js",
  "nextjs",
  "vue",
  "angular",
  "tailwind",
  "tailwind css",
  "bootstrap",
  "node.js",
  "nodejs",
  "express",
  "python",
  "java",
  "c",
  "c++",
  "c#",
  ".net",
  "php",
  "laravel",
  "django",
  "flask",
  "fastapi",
  "spring boot",
  "sql",
  "mysql",
  "postgresql",
  "mongodb",
  "supabase",
  "firebase",
  "redis",
  "rest api",
  "restful api",
  "graphql",
  "git",
  "github",
  "gitlab",
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "google cloud",
  "gcp",
  "ci/cd",
  "jenkins",
  "github actions",
  "linux",
  "figma",
  "photoshop",
  "illustrator",
  "power bi",
  "tableau",
  "excel",
  "pandas",
  "numpy",
  "scikit-learn",
  "tensorflow",
  "pytorch",
  "machine learning",
  "deep learning",
  "artificial intelligence",
  "data analysis",
  "data science",
  "computer vision",
  "nlp",
  "natural language processing",
  "jest",
  "vitest",
  "cypress",
  "playwright",
  "unit testing",
  "integration testing",
  "responsive design",
  "ui design",
  "ux design",
  "agile",
  "scrum",
  "jira",
];

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}+#./-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKeyword(value: string): string {
  return normalizeText(value)
    .replace(/\bjs\b/g, "javascript")
    .replace(/\bts\b/g, "typescript")
    .replace(/\bnextjs\b/g, "next.js")
    .replace(/\bnodejs\b/g, "node.js")
    .replace(/\bpostgres\b/g, "postgresql")
    .trim();
}

export function getWordCount(text: string): number {
  const normalized = normalizeText(text);

  if (!normalized) {
    return 0;
  }

  return normalized.split(" ").filter(Boolean).length;
}

export function extractFrequentKeywords(
  text: string,
  limit = 35,
): string[] {
  const normalized = normalizeText(text);

  if (!normalized) {
    return [];
  }

  const words = normalized
    .split(" ")
    .map((word) => word.trim())
    .filter((word) => {
      return (
        word.length >= 3 &&
        !STOP_WORDS.has(word) &&
        !/^\d+$/.test(word)
      );
    });

  const frequency = new Map<string, number>();

  for (const word of words) {
    const keyword = normalizeKeyword(word);

    frequency.set(
      keyword,
      (frequency.get(keyword) ?? 0) + 1,
    );
  }

  return [...frequency.entries()]
    .sort((first, second) => {
      if (second[1] !== first[1]) {
        return second[1] - first[1];
      }

      return second[0].length - first[0].length;
    })
    .slice(0, limit)
    .map(([keyword]) => keyword);
}

export function extractSkills(text: string): string[] {
  const normalizedText = ` ${normalizeText(text)} `;

  const foundSkills = TECHNICAL_SKILLS.filter((skill) => {
    const normalizedSkill = normalizeKeyword(skill);

    return normalizedText.includes(` ${normalizedSkill} `);
  });

  return uniqueStrings(
    foundSkills.map((skill) => formatKeyword(skill)),
  );
}

export function compareKeywords(
  resumeText: string,
  jobDescription: string,
): {
  matchingKeywords: string[];
  missingKeywords: string[];
} {
  const resumeNormalized = ` ${normalizeText(resumeText)} `;
  const jobKeywords = extractFrequentKeywords(jobDescription);

  const matchingKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const keyword of jobKeywords) {
    const normalizedKeyword = normalizeKeyword(keyword);

    if (
      resumeNormalized.includes(` ${normalizedKeyword} `) ||
      resumeNormalized.includes(normalizedKeyword)
    ) {
      matchingKeywords.push(formatKeyword(keyword));
    } else {
      missingKeywords.push(formatKeyword(keyword));
    }
  }

  return {
    matchingKeywords: uniqueStrings(matchingKeywords),
    missingKeywords: uniqueStrings(missingKeywords),
  };
}

export function compareSkills(
  resumeText: string,
  jobDescription: string,
  storedSkills: string[] = [],
): {
  resumeSkills: string[];
  requiredSkills: string[];
  matchingSkills: string[];
  missingSkills: string[];
} {
  const extractedResumeSkills = extractSkills(resumeText);

  const resumeSkills = uniqueStrings([
    ...storedSkills.map(formatKeyword),
    ...extractedResumeSkills,
  ]);

  const requiredSkills = extractSkills(jobDescription);

  const normalizedResumeSkills = new Set(
    resumeSkills.map(normalizeKeyword),
  );

  const matchingSkills = requiredSkills.filter((skill) =>
    normalizedResumeSkills.has(normalizeKeyword(skill)),
  );

  const missingSkills = requiredSkills.filter(
    (skill) =>
      !normalizedResumeSkills.has(normalizeKeyword(skill)),
  );

  return {
    resumeSkills,
    requiredSkills,
    matchingSkills,
    missingSkills,
  };
}

export function uniqueStrings(values: string[]): string[] {
  const valuesMap = new Map<string, string>();

  for (const value of values) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      continue;
    }

    const normalizedValue = normalizeKeyword(trimmedValue);

    if (!valuesMap.has(normalizedValue)) {
      valuesMap.set(normalizedValue, trimmedValue);
    }
  }

  return [...valuesMap.values()];
}

export function formatKeyword(value: string): string {
  const normalized = normalizeKeyword(value);

  const specialFormats: Record<string, string> = {
    aws: "AWS",
    azure: "Azure",
    css: "CSS",
    "c#": "C#",
    "c++": "C++",
    "ci/cd": "CI/CD",
    gcp: "GCP",
    git: "Git",
    github: "GitHub",
    html: "HTML",
    javascript: "JavaScript",
    jest: "Jest",
    mongodb: "MongoDB",
    mysql: "MySQL",
    "next.js": "Next.js",
    "node.js": "Node.js",
    nlp: "NLP",
    php: "PHP",
    postgresql: "PostgreSQL",
    python: "Python",
    react: "React",
    "react.js": "React.js",
    redis: "Redis",
    sql: "SQL",
    supabase: "Supabase",
    tailwind: "Tailwind",
    "tailwind css": "Tailwind CSS",
    typescript: "TypeScript",
    vue: "Vue",
  };

  if (specialFormats[normalized]) {
    return specialFormats[normalized];
  }

  return normalized
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}