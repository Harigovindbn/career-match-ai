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

export function cleanToken(text: string): string {
  return text
    .toLowerCase()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    // Strip trailing/leading punctuation except internal dots/special characters in tech names
    .replace(/(?<!\w)\.|\.(?!\w)|[^\w+#./-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getWordCount(text: string): number {
  const cleaned = cleanToken(text);
  if (!cleaned) return 0;
  return cleaned.split(" ").filter(Boolean).length;
}

export function extractFrequentKeywords(
  text: string,
  limit = 35,
): string[] {
  const normalized = text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[\n\r\t,./:;()"-]/g, " ")
    .toLowerCase();

  const rawWords = normalized.split(/\s+/).filter(Boolean);

  const frequency = new Map<string, number>();

  for (const word of rawWords) {
    const trimmed = word.trim();
    if (
      trimmed.length >= 3 &&
      !STOP_WORDS.has(trimmed) &&
      !/^\d+$/.test(trimmed)
    ) {
      frequency.set(trimmed, (frequency.get(trimmed) ?? 0) + 1);
    }
  }

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

export function extractSkills(text: string): string[] {
  const normalizedText = ` ${cleanToken(text)} `;

  const foundSkills = TECHNICAL_SKILLS.filter((skill) => {
    const cleanSkill = cleanToken(skill);
    return normalizedText.includes(` ${cleanSkill} `);
  });

  return uniqueStrings(foundSkills.map((s) => formatKeyword(s)));
}

export function compareKeywords(
  resumeText: string,
  jobDescription: string,
): {
  matchingKeywords: string[];
  missingKeywords: string[];
} {
  const resumeNormalized = ` ${cleanToken(resumeText)} `;
  const jobKeywords = extractFrequentKeywords(jobDescription);

  const matchingKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const keyword of jobKeywords) {
    const cleanKw = cleanToken(keyword);
    if (!cleanKw) continue;

    if (resumeNormalized.includes(` ${cleanKw} `)) {
      matchingKeywords.push(formatKeyword(cleanKw));
    } else {
      missingKeywords.push(formatKeyword(cleanKw));
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
    resumeSkills.map((s) => cleanToken(s)),
  );

  const matchingSkills = requiredSkills.filter((skill) =>
    normalizedResumeSkills.has(cleanToken(skill)),
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !normalizedResumeSkills.has(cleanToken(skill)),
  );

  return {
    resumeSkills,
    requiredSkills,
    matchingSkills,
    missingSkills,
  };
}

export function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const val of values) {
    const trimmed = val.trim();
    if (!trimmed) continue;

    const lower = trimmed.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      result.push(trimmed);
    }
  }

  return result;
}

export function formatKeyword(value: string): string {
  if (!value) return "";

  const clean = cleanToken(value);

  const specialFormats: Record<string, string> = {
    aws: "AWS",
    azure: "Azure",
    css: "CSS",
    "c#": "C#",
    "c++": "C++",
    "ci/cd": "CI/CD",
    docker: "Docker",
    gcp: "GCP",
    git: "Git",
    github: "GitHub",
    html: "HTML",
    javascript: "JavaScript",
    jest: "Jest",
    mongodb: "MongoDB",
    mysql: "MySQL",
    "next.js": "Next.js",
    nextjs: "Next.js",
    "node.js": "Node.js",
    nodejs: "Node.js",
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

  if (specialFormats[clean]) {
    return specialFormats[clean];
  }

  return clean
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}