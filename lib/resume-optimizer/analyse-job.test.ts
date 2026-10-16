import { describe, expect, it } from "vitest";
import { analyseResumeAgainstJob } from "./analyse-job";

describe("Resume Analysis & ATS Scoring Engine", () => {
  const sampleResume = `
    First Name Last Name
    Boston, MA | email@example.com | 617-555-1234
    
    Summary
    Detail-oriented Software Engineer with experience in React, Next.js, and TypeScript.
    
    Experience
    Full Stack Developer | Tech Corp | 2021 - Present
    • Developed and deployed 5 responsive web applications using React, Next.js, and Supabase, improving page load speed by 35%.
    • Managed database schemas and PostgreSQL queries, reducing database latency by 20%.
    • Led a cross-functional team of 4 developers to implement REST APIs and automated CI/CD pipelines.
    
    Education
    Bachelor of Science in Computer Science | Boston University
    
    Skills
    React, Next.js, TypeScript, Node.js, PostgreSQL, Tailwind CSS, Git
  `;

  const sampleJob = `
    Job Title: Senior Frontend Engineer
    Company: Acme Tech
    
    Job Overview
    Acme Tech is looking for a Senior Frontend Engineer proficient in React, Next.js, TypeScript, and Tailwind CSS.
    
    Key Responsibilities
    • Build and maintain scalable user interfaces using React and Next.js.
    • Collaborate with design and backend teams to deliver high-performance web applications.
    • Optimize web app performance and write unit tests.
    
    Requirements & Qualifications
    • 3+ years of experience with modern frontend frameworks (React, Next.js).
    • Strong communication skills and experience with PostgreSQL or Node.js.
  `;

  it("should calculate valid match scores for well-aligned inputs", () => {
    const result = analyseResumeAgainstJob({
      resumeText: sampleResume,
      jobDescription: sampleJob,
    });

    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(typeof result.scoreLabel).toBe("string");
    expect(result.scoreBreakdown.skillMatch).toBeGreaterThanOrEqual(50);
    expect(result.scoreBreakdown.experienceMatch).toBeGreaterThanOrEqual(50);
    expect(result.matchingKeywords.length).toBeGreaterThan(0);
  });

  it("should throw a clear error when resume text is too short", () => {
    expect(() =>
      analyseResumeAgainstJob({
        resumeText: "Too short resume",
        jobDescription: sampleJob,
      }),
    ).toThrow("The resume text is too short to analyse.");
  });

  it("should throw a clear error when job description is too short", () => {
    expect(() =>
      analyseResumeAgainstJob({
        resumeText: sampleResume,
        jobDescription: "Short job description",
      }),
    ).toThrow("Please paste a more complete job description.");
  });

  it("should accurately populate word counts and score breakdown structure", () => {
    const result = analyseResumeAgainstJob({
      resumeText: sampleResume,
      jobDescription: sampleJob,
    });

    expect(result.resumeWordCount).toBeGreaterThan(50);
    expect(result.jobDescriptionWordCount).toBeGreaterThan(30);
    expect(result.scoreBreakdown).toHaveProperty("keywordMatch");
    expect(result.scoreBreakdown).toHaveProperty("skillMatch");
    expect(result.scoreBreakdown).toHaveProperty("experienceMatch");
    expect(result.scoreBreakdown).toHaveProperty("resumeQuality");
    expect(result.scoreBreakdown).toHaveProperty("bulletQuality");
  });
});