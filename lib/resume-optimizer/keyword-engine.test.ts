import { describe, expect, it } from "vitest";
import {
  extractFrequentKeywords,
  formatKeyword,
  compareKeywords,
  compareSkills,
} from "./keyword-engine";

describe("Keyword Engine Tokenization & Formatting", () => {
  it("should cleanly separate camelCase and formatted words", () => {
    expect(formatKeyword("javascript")).toBe("JavaScript");
    expect(formatKeyword("react")).toBe("React");
    expect(formatKeyword("next.js")).toBe("Next.js");
  });

  it("should extract individual keywords without collapsing text", () => {
    const sampleText =
      "Front-of-house Manager with experience in guest satisfaction and POS systems.";
    const keywords = extractFrequentKeywords(sampleText, 10);

    expect(keywords).toContain("front");
    expect(keywords).toContain("manager");
    expect(keywords).toContain("guest");
  });

  it("should accurately identify matching and missing keywords", () => {
    const resumeText =
      "Experienced Software Engineer skilled in React, TypeScript, and Node.js.";
    const jobDescription =
      "Looking for a Software Engineer proficient in React, Python, and AWS.";

    const result = compareKeywords(resumeText, jobDescription);

    expect(result.matchingKeywords).toContain("React");
    expect(result.missingKeywords).toContain("Python");
    expect(result.missingKeywords).toContain("AWS");
  });

  it("should match technical skills cleanly", () => {
    const resumeText =
      "Built web apps with Next.js, Tailwind CSS, and Supabase.";
    const jobDescription = "Required skills: Next.js, Tailwind CSS, Docker.";

    const result = compareSkills(resumeText, jobDescription);

    expect(result.matchingSkills).toContain("Next.js");
    expect(result.matchingSkills).toContain("Tailwind CSS");
    expect(result.missingSkills).toContain("Docker");
  });
});