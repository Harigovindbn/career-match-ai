import {
  EDUCATION_PATTERNS,
  EXPERIENCE_PATTERNS,
  JOB_SKILLS,
  STOP_WORDS,
} from "./constants";

export function normalizeText(text: string): string {
  return text
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function normalizeForComparison(text: string): string {
  return normalizeText(text)
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();

  return values.filter((value: string) => {
    const cleaned = value.trim();
    const key = cleaned.toLowerCase();

    if (!cleaned || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function escapeRegularExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function containsKeyword(
  text: string,
  keyword: string,
): boolean {
  const normalizedText = normalizeForComparison(text);
  const normalizedKeyword = normalizeForComparison(keyword);

  const escapedKeyword =
    escapeRegularExpression(normalizedKeyword);

  const pattern = new RegExp(
    `(^|[^a-z0-9])${escapedKeyword}([^a-z0-9]|$)`,
    "i",
  );

  return pattern.test(normalizedText);
}

export function extractSkills(text: string): string[] {
  return uniqueStrings(
    JOB_SKILLS.filter((skill: string) =>
      containsKeyword(text, skill),
    ),
  );
}

export function extractFrequentKeywords(
  text: string,
  limit = 25,
): string[] {
  const words = normalizeForComparison(text)
    .split(/\s+/)
    .map((word: string) => word.trim())
    .filter(
      (word: string) =>
        word.length >= 4 &&
        !STOP_WORDS.has(word) &&
        !/^\d+$/.test(word),
    );

  const counts = new Map<string, number>();

  for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort(
      (
        first: [string, number],
        second: [string, number],
      ) => {
        if (second[1] !== first[1]) {
          return second[1] - first[1];
        }

        return first[0].localeCompare(second[0]);
      },
    )
    .slice(0, limit)
    .map(([word]: [string, number]) => word);
}

export function extractJobTitle(
  jobDescription: string,
  suppliedJobTitle?: string,
): string {
  if (suppliedJobTitle?.trim()) {
    return suppliedJobTitle.trim();
  }

  const lines = normalizeText(jobDescription)
    .split("\n")
    .map((line: string) => line.trim())
    .filter(Boolean)
    .slice(0, 8);

  const labelledTitle = lines.find((line: string) =>
    /^(job title|position|role)\s*:/i.test(line),
  );

  if (labelledTitle) {
    return labelledTitle
      .replace(
        /^(job title|position|role)\s*:\s*/i,
        "",
      )
      .trim();
  }

  const possibleTitle = lines.find(
    (line: string) =>
      line.length <= 80 &&
      /\b(developer|engineer|designer|analyst|tester|manager|consultant|specialist|intern|administrator|executive)\b/i.test(
        line,
      ),
  );

  return possibleTitle ?? "Selected Job";
}

export function extractExperienceRequirement(
  jobDescription: string,
): string {
  for (const pattern of EXPERIENCE_PATTERNS) {
    const match = jobDescription.match(pattern);

    if (match) {
      if (match[2]) {
        return `${match[1]}-${match[2]} years`;
      }

      return `${match[1]}+ years`;
    }
  }

  if (
    /\b(fresher|fresh graduate|entry level|no experience required)\b/i.test(
      jobDescription,
    )
  ) {
    return "Entry level";
  }

  return "Not clearly specified";
}

export function extractEducationRequirement(
  jobDescription: string,
): string {
  const matchedRequirements = EDUCATION_PATTERNS.filter(
    (pattern: RegExp) => pattern.test(jobDescription),
  ).map((pattern: RegExp) => {
    const source = pattern.source;

    if (source.includes("bachelor")) {
      return "Bachelor's degree";
    }

    if (source.includes("master")) {
      return "Master's degree";
    }

    if (source.includes("b\\.?\\s*tech")) {
      return "B.Tech";
    }

    if (source.includes("m\\.?\\s*tech")) {
      return "M.Tech";
    }

    if (source.includes("bca")) {
      return "BCA";
    }

    if (source.includes("mca")) {
      return "MCA";
    }

    if (source.includes("bsc")) {
      return "BSc";
    }

    if (source.includes("msc")) {
      return "MSc";
    }

    if (source.includes("diploma")) {
      return "Diploma";
    }

    if (source.includes("computer science")) {
      return "Computer Science";
    }

    if (source.includes("information technology")) {
      return "Information Technology";
    }

    if (source.includes("engineering")) {
      return "Engineering";
    }

    return "Degree";
  });

  const uniqueRequirements =
    uniqueStrings(matchedRequirements);

  return uniqueRequirements.length > 0
    ? uniqueRequirements.join(", ")
    : "Not clearly specified";
}

export function calculatePercentage(
  matched: number,
  total: number,
): number {
  if (total <= 0) {
    return 100;
  }

  return Math.min(
    100,
    Math.max(0, Math.round((matched / total) * 100)),
  );
}