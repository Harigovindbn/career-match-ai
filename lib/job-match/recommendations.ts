type RecommendationInput = {
  overallScore: number;
  missingSkills: string[];
  missingKeywords: string[];
  experienceMatched: boolean | null;
  educationMatched: boolean | null;
};

export function generateRecommendations(
  input: RecommendationInput,
): string[] {
  const recommendations: string[] = [];

  if (input.missingSkills.length > 0) {
    const skills = input.missingSkills.slice(0, 5).join(", ");

    recommendations.push(
      `Add or strengthen these relevant skills in your resume: ${skills}.`,
    );
  }

  if (input.missingKeywords.length > 0) {
    const keywords = input.missingKeywords.slice(0, 5).join(", ");

    recommendations.push(
      `Include important job-description keywords where they accurately match your experience: ${keywords}.`,
    );
  }

  if (input.experienceMatched === false) {
    recommendations.push(
      "Highlight internships, academic projects, freelance work, and relevant practical experience.",
    );
  }

  if (input.educationMatched === false) {
    recommendations.push(
      "Clearly mention your degree, specialization, certifications, and relevant coursework.",
    );
  }

  if (input.overallScore < 45) {
    recommendations.push(
      "Your resume currently has a low match. Tailor the summary, skills, and project sections for this job.",
    );
  } else if (input.overallScore < 65) {
    recommendations.push(
      "Your resume has a fair match. Improve the missing skills and keywords before applying.",
    );
  } else if (input.overallScore < 80) {
    recommendations.push(
      "Your resume has a good match. Make small improvements to strengthen your application.",
    );
  } else {
    recommendations.push(
      "Your resume has a strong match. Review formatting and accuracy before submitting.",
    );
  }

  return recommendations;
}