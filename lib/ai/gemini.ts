import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface AIBulletImprovement {
  original: string;
  improved: string;
  explanation: string;
}

export async function generateAIBulletImprovements(
  bulletPoints: string[],
  jobDescription: string
): Promise<{ success: boolean; data?: AIBulletImprovement[]; error?: string }> {
  if (!genAI) {
    return {
      success: false,
      error: "Gemini API key is not configured. Falling back to rule-based engine.",
    };
  }

  if (!bulletPoints || bulletPoints.length === 0) {
    return { success: false, error: "No bullet points provided for AI improvement." };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert ATS resume writer and career coach.
Improve the following resume bullet points to better match this job description:

JOB DESCRIPTION:
${jobDescription.slice(0, 1500)}

RESUME BULLET POINTS TO IMPROVE:
${bulletPoints.map((bp, i) => `${i + 1}.${bp}`).join("\n")}

Respond STRICTLY with valid JSON in the following format without any markdown code block formatting:
[
  {
    "original": "exact original text",
    "improved": "action-oriented, quantified, targeted improved bullet",
    "explanation": "brief reason for change based on ATS/job alignment"
  }
]`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim().replace(/^```json\s*/, "").replace(/\s*```$/, "");

    const improvements: AIBulletImprovement[] = JSON.parse(responseText);

    return {
      success: true,
      data: improvements,
    };
  } catch (error) {
    console.error("Gemini AI Bullet Improvement Error:", error);
    return {
      success: false,
      error: "AI service error. Falling back to deterministic analysis.",
    };
  }
}