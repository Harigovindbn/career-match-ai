import type { BulletAnalysis } from "./bullet-analyser";

export type OptimizedResumeBuildResult = {
  originalText: string;
  optimizedText: string;
  replacementsApplied: number;
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeLine(value: string): string {
  return value
    .replace(/^[\s•●▪◦*-]+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function preserveBulletPrefix(
  originalLine: string,
  improvedText: string,
): string {
  const bulletMatch = originalLine.match(
    /^(\s*(?:[•●▪◦*-]|\d+[.)])\s+)/,
  );

  if (!bulletMatch) {
    return improvedText;
  }

  return `${bulletMatch[1]}${improvedText}`;
}

function replaceBullet(
  resumeText: string,
  analysis: BulletAnalysis,
): {
  text: string;
  replaced: boolean;
} {
  const original = analysis.original.trim();
  const improved = analysis.improved.trim();

  if (!original || !improved) {
    return {
      text: resumeText,
      replaced: false,
    };
  }

  const lines = resumeText.split(/\r?\n/);

  let replaced = false;

  const updatedLines = lines.map((line) => {
    if (replaced) {
      return line;
    }

    const normalizedLine = normalizeLine(line);

    if (normalizedLine === original) {
      replaced = true;

      return preserveBulletPrefix(
        line,
        improved,
      );
    }

    return line;
  });

  if (replaced) {
    return {
      text: updatedLines.join("\n"),
      replaced: true,
    };
  }

  const escapedOriginal = escapeRegExp(original);

  const fallbackPattern = new RegExp(
    escapedOriginal,
    "i",
  );

  if (fallbackPattern.test(resumeText)) {
    return {
      text: resumeText.replace(
        fallbackPattern,
        improved,
      ),
      replaced: true,
    };
  }

  return {
    text: resumeText,
    replaced: false,
  };
}

export function buildOptimizedResume(
  resumeText: string,
  bulletAnalyses: BulletAnalysis[],
): OptimizedResumeBuildResult {
  let optimizedText = resumeText.trim();
  let replacementsApplied = 0;

  const eligibleBullets = bulletAnalyses.filter(
    (bullet) =>
      bullet.strength !== "strong" &&
      bullet.improved.trim() &&
      bullet.improved.trim() !==
        bullet.original.trim(),
  );

  for (const bullet of eligibleBullets) {
    const result = replaceBullet(
      optimizedText,
      bullet,
    );

    optimizedText = result.text;

    if (result.replaced) {
      replacementsApplied += 1;
    }
  }

  return {
    originalText: resumeText.trim(),
    optimizedText,
    replacementsApplied,
  };
}