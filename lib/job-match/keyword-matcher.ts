import { extractFrequentKeywords, uniqueStrings } from "./utils";

export type KeywordMatchResult = {
  resumeKeywords: string[];
  jobKeywords: string[];
  matchingKeywords: string[];
  missingKeywords: string[];
  coverage: number;
};

export function matchKeywords(input: {
  resumeText: string;
  jobDescription: string;
}): KeywordMatchResult {
  const resumeKeywords = uniqueStrings(
    extractFrequentKeywords(input.resumeText),
  );

  const jobKeywords = uniqueStrings(
    extractFrequentKeywords(input.jobDescription),
  );

  const matchingKeywords = jobKeywords.filter((keyword) =>
    resumeKeywords.includes(keyword),
  );

  const missingKeywords = jobKeywords.filter(
    (keyword) => !matchingKeywords.includes(keyword),
  );

  const coverage =
    jobKeywords.length === 0
      ? 100
      : Math.round((matchingKeywords.length / jobKeywords.length) * 100);

  return {
    resumeKeywords,
    jobKeywords,
    matchingKeywords,
    missingKeywords,
    coverage,
  };
}