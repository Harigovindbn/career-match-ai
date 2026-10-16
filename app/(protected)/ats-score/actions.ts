"use server";

export async function analyzeResumeAction(formData: FormData) {
  const jobTitle = formData.get("jobTitle") as string || "Software Engineer";
  const resumeText = formData.get("resumeText") as string || "";

  // Simulate parsing and scoring algorithm delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  if (!resumeText || resumeText.length < 50) {
    return { success: false, error: "Please provide a more detailed resume text for accurate analysis." };
  }

  // Simulated intelligent scoring based on keywords
  const keywords = ["react", "typescript", "next.js", "tailwind", "node", "git", "api", "sql", "aws", "docker"];
  const lowerResume = resumeText.toLowerCase();
  
  let matchedCount = 0;
  const missingKeywords: string[] = [];

  keywords.forEach((kw) => {
    if (lowerResume.includes(kw)) {
      matchedCount++;
    } else {
      missingKeywords.push(kw);
    }
  });

  const baseScore = Math.round((matchedCount / keywords.length) * 40) + 50;
  const finalScore = Math.min(baseScore, 98); // Cap at 98 for realism

  return {
    success: true,
    data: {
      atsScore: finalScore,
      targetRole: jobTitle,
      matchedKeywordsCount: matchedCount,
      missingKeywords: missingKeywords.slice(0, 4),
      suggestions: [
        "Include more quantifiable metrics (e.g., 'Improved performance by 30%').",
        "Ensure standard section headings like 'Experience' and 'Skills' are used.",
        missingKeywords.length > 0 
          ? `Add missing high-impact industry keywords such as: ${missingKeywords.slice(0, 3).join(", ")}.`
          : "Your keyword density is exceptional for this role.",
      ],
    },
  };
}