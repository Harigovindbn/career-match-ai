export type BulletStrength =
  | "strong"
  | "moderate"
  | "weak";

export type BulletAnalysis = {
  original: string;
  improved: string;
  strength: BulletStrength;
  score: number;
  issues: string[];
};

const STRONG_ACTION_VERBS = [
  "achieved",
  "automated",
  "built",
  "created",
  "delivered",
  "designed",
  "developed",
  "engineered",
  "enhanced",
  "implemented",
  "improved",
  "increased",
  "integrated",
  "launched",
  "led",
  "managed",
  "optimized",
  "reduced",
  "resolved",
  "streamlined",
];

const WEAK_PHRASES: {
  phrase: RegExp;
  replacement: string;
  message: string;
}[] = [
  {
    phrase: /^responsible for\s+/i,
    replacement: "",
    message:
      'Avoid "Responsible for". Start directly with a strong action verb.',
  },
  {
    phrase: /^worked on\s+/i,
    replacement: "Developed ",
    message:
      'Replace "Worked on" with a specific action such as Developed, Built, or Implemented.',
  },
  {
    phrase: /^helped\s+(?:to\s+)?/i,
    replacement: "Contributed to ",
    message:
      'Replace "Helped" with a more specific contribution.',
  },
  {
    phrase: /^assisted\s+(?:with|in)\s+/i,
    replacement: "Supported ",
    message:
      'Replace "Assisted" with a clearer description of your contribution.',
  },
  {
    phrase: /^involved in\s+/i,
    replacement: "Contributed to ",
    message:
      'Avoid "Involved in". Describe what you actually contributed.',
  },
  {
    phrase: /^participated in\s+/i,
    replacement: "Contributed to ",
    message:
      'Replace "Participated in" with a stronger action.',
  },
  {
    phrase: /^tasked with\s+/i,
    replacement: "",
    message:
      'Avoid "Tasked with". Start with the action you performed.',
  },
];

function cleanBullet(value: string): string {
  return value
    .replace(/^[\s•●▪◦*-]+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function capitalizeFirst(value: string): string {
  if (!value) {
    return value;
  }

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

function containsMetric(value: string): boolean {
  return (
    /\d+%/.test(value) ||
    /\b\d+\+?\s*(users|clients|customers|projects|tasks|hours|days|weeks|months|records|requests|pages|features|reports|applications|models)\b/i.test(
      value,
    ) ||
    /\b(increased|decreased|reduced|improved|saved|grew)\s+.*\d+/i.test(
      value,
    )
  );
}

function startsWithStrongVerb(
  value: string,
): boolean {
  const firstWord =
    value
      .trim()
      .split(/\s+/)[0]
      ?.toLowerCase()
      .replace(/[^\w-]/g, "") ?? "";

  return STRONG_ACTION_VERBS.includes(firstWord);
}

function detectWeakPhrase(
  value: string,
): (typeof WEAK_PHRASES)[number] | null {
  for (const weakPhrase of WEAK_PHRASES) {
    if (weakPhrase.phrase.test(value)) {
      return weakPhrase;
    }
  }

  return null;
}

function createImprovedBullet(
  bullet: string,
): string {
  let improved = bullet;

  const weakPhrase = detectWeakPhrase(improved);

  if (weakPhrase) {
    improved = improved.replace(
      weakPhrase.phrase,
      weakPhrase.replacement,
    );
  }

  improved = capitalizeFirst(improved.trim());

  if (!startsWithStrongVerb(improved)) {
    const lower = improved.toLowerCase();

    if (
      lower.includes("website") ||
      lower.includes("application") ||
      lower.includes("app") ||
      lower.includes("system") ||
      lower.includes("software")
    ) {
      improved = `Developed ${improved.charAt(0).toLowerCase()}${improved.slice(
        1,
      )}`;
    } else if (
      lower.includes("design") ||
      lower.includes("interface") ||
      lower.includes("figma") ||
      lower.includes("ui")
    ) {
      improved = `Designed ${improved.charAt(0).toLowerCase()}${improved.slice(
        1,
      )}`;
    } else if (
      lower.includes("analysis") ||
      lower.includes("data") ||
      lower.includes("report")
    ) {
      improved = `Analyzed ${improved.charAt(0).toLowerCase()}${improved.slice(
        1,
      )}`;
    }
  }

  if (
    !containsMetric(improved) &&
    improved.length > 25
  ) {
    improved = improved.replace(/[.!]+$/, "");

    improved +=
      " — add a measurable result or impact if available.";
  }

  return improved;
}

function analyseSingleBullet(
  value: string,
): BulletAnalysis {
  const bullet = cleanBullet(value);
  const issues: string[] = [];

  let score = 100;

  const weakPhrase = detectWeakPhrase(bullet);

  if (weakPhrase) {
    issues.push(weakPhrase.message);
    score -= 25;
  }

  if (!startsWithStrongVerb(bullet)) {
    issues.push(
      "Start the bullet with a strong action verb.",
    );

    score -= 20;
  }

  if (!containsMetric(bullet)) {
    issues.push(
      "Add a measurable result or impact where possible.",
    );

    score -= 15;
  }

  if (bullet.length < 25) {
    issues.push(
      "The bullet is too short to clearly explain your contribution.",
    );

    score -= 15;
  }

  if (bullet.length > 220) {
    issues.push(
      "The bullet is too long. Keep it concise and focused on one achievement.",
    );

    score -= 10;
  }

  if (
    /\b(i|me|my|we|our)\b/i.test(bullet)
  ) {
    issues.push(
      "Avoid personal pronouns in resume bullet points.",
    );

    score -= 10;
  }

  score = Math.max(0, Math.min(100, score));

  let strength: BulletStrength = "weak";

  if (score >= 80) {
    strength = "strong";
  } else if (score >= 60) {
    strength = "moderate";
  }

  return {
    original: bullet,
    improved: createImprovedBullet(bullet),
    strength,
    score,
    issues,
  };
}

function looksLikeBullet(line: string): boolean {
  const trimmed = line.trim();

  if (!trimmed) {
    return false;
  }

  if (/^[•●▪◦*-]\s+/.test(trimmed)) {
    return true;
  }

  if (/^\d+[.)]\s+/.test(trimmed)) {
    return true;
  }

  return false;
}

export function extractResumeBullets(
  resumeText: string,
): string[] {
  const lines = resumeText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const explicitBullets = lines
    .filter(looksLikeBullet)
    .map(cleanBullet)
    .filter((bullet) => bullet.length >= 10);

  if (explicitBullets.length > 0) {
    return explicitBullets;
  }

  return lines
    .filter((line) => {
      const wordCount = line.split(/\s+/).length;

      return (
        wordCount >= 5 &&
        wordCount <= 45 &&
        /^(developed|designed|created|built|implemented|managed|worked|responsible|helped|assisted|participated|involved|optimized|improved|analyzed|analysed|led|supported)\b/i.test(
          line,
        )
      );
    })
    .map(cleanBullet);
}

export function analyseResumeBullets(
  resumeText: string,
): BulletAnalysis[] {
  const bullets =
    extractResumeBullets(resumeText);

  return bullets
    .map(analyseSingleBullet)
    .sort((a, b) => a.score - b.score);
}

export function getWeakBullets(
  resumeText: string,
): BulletAnalysis[] {
  return analyseResumeBullets(resumeText).filter(
    (bullet) => bullet.strength !== "strong",
  );
}

export function calculateBulletScore(
  analyses: BulletAnalysis[],
): number {
  if (analyses.length === 0) {
    return 0;
  }

  const total = analyses.reduce(
    (sum, bullet) => sum + bullet.score,
    0,
  );

  return Math.round(total / analyses.length);
}