// Server-side only: reads GEMINI_API_KEY. Client components may import types only.
import {
  GoogleGenerativeAI,
  type Content,
  type GenerativeModel,
} from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Models are tried in order. "-latest" aliases are used so the app keeps
 * working when Google retires a specific model version (gemini-1.5-flash and
 * gemini-2.5-flash have both been retired). GEMINI_MODEL can override.
 */
const MODEL_CHAIN = Array.from(
  new Set(
    [
      process.env.GEMINI_MODEL,
      "gemini-flash-latest",
      "gemini-flash-lite-latest",
    ].filter((m): m is string => Boolean(m && m.trim())),
  ),
);

export function isGeminiConfigured(): boolean {
  return genAI !== null;
}

function getModel(name: string, systemInstruction?: string): GenerativeModel {
  if (!genAI) {
    throw new Error("Gemini API key is not configured.");
  }
  return genAI.getGenerativeModel({
    model: name,
    ...(systemInstruction ? { systemInstruction } : {}),
  });
}

function isRetryable(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /\b(404|429|500|503)\b|not found|overloaded|unavailable|high demand/i.test(
    message,
  );
}

/** Runs fn against each model in the chain until one succeeds. */
async function withModelFallback<T>(
  fn: (model: GenerativeModel) => Promise<T>,
  systemInstruction?: string,
): Promise<T> {
  let lastError: unknown;
  for (const name of MODEL_CHAIN) {
    try {
      return await fn(getModel(name, systemInstruction));
    } catch (error) {
      lastError = error;
      if (!isRetryable(error)) break;
      console.warn(`Gemini model ${name} failed, trying next:`, error);
    }
  }
  throw lastError;
}

export interface AIBulletImprovement {
  original: string;
  improved: string;
  explanation: string;
}

function parseJsonArray(text: string): unknown {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  return JSON.parse(start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned);
}

export async function generateAIBulletImprovements(
  bulletPoints: string[],
  jobDescription: string,
): Promise<{ success: boolean; data?: AIBulletImprovement[]; error?: string }> {
  if (!genAI) {
    return {
      success: false,
      error: "Gemini API key is not configured.",
    };
  }

  if (!bulletPoints || bulletPoints.length === 0) {
    return { success: false, error: "No bullet points provided for AI improvement." };
  }

  const prompt = `You are an expert ATS resume writer and career coach.
Improve the following resume bullet points to better match this job description.
Do not invent numbers, metrics, employers or technologies that are not implied by the original bullet; where a metric would help, use a placeholder like "[X%]" for the candidate to fill in.

JOB DESCRIPTION:
${jobDescription.slice(0, 3000)}

RESUME BULLET POINTS TO IMPROVE:
${bulletPoints.map((bp, i) => `${i + 1}. ${bp}`).join("\n")}

Respond ONLY with a JSON array (no markdown) in this exact format:
[
  {
    "original": "exact original text",
    "improved": "action-oriented, targeted improved bullet",
    "explanation": "brief reason for change based on ATS/job alignment"
  }
]`;

  try {
    const text = await withModelFallback(async (model) => {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      });
      return result.response.text();
    });

    const parsed = parseJsonArray(text);
    if (!Array.isArray(parsed)) {
      throw new Error("Gemini returned an unexpected format.");
    }

    const improvements: AIBulletImprovement[] = parsed
      .filter(
        (item): item is Record<string, unknown> =>
          typeof item === "object" && item !== null,
      )
      .map((item, index) => ({
        original: String(item.original ?? bulletPoints[index] ?? ""),
        improved: String(item.improved ?? ""),
        explanation: String(item.explanation ?? ""),
      }))
      .filter((item) => item.improved.trim().length > 0);

    return { success: true, data: improvements };
  } catch (error) {
    console.error("Gemini AI Bullet Improvement Error:", error);
    return {
      success: false,
      error: "The AI service is temporarily unavailable.",
    };
  }
}

export type ChatTurn = { role: "user" | "assistant"; content: string };

const CAREER_COACH_PROMPT = `You are CareerMatch AI, a friendly, expert career coach.
You help with resumes, ATS optimisation, cover letters, interview preparation (STAR method),
salary negotiation, job search strategy and career changes.
Give practical, specific, concise advice. Use short paragraphs or bullet lists.
If a question is unrelated to careers or professional development, briefly steer back to career topics.`;

/** Streams a career-coach reply as plain-text chunks. */
export async function streamCareerCoachReply(
  history: ChatTurn[],
  userName?: string,
): Promise<AsyncIterable<string>> {
  const system = userName
    ? `${CAREER_COACH_PROMPT}\nThe user's name is ${userName}.`
    : CAREER_COACH_PROMPT;

  // Gemini requires history to start with a user turn.
  const firstUser = history.findIndex((m) => m.role === "user");
  const trimmed = firstUser >= 0 ? history.slice(firstUser) : [];
  const contents: Content[] = trimmed.slice(-20).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content.slice(0, 8000) }],
  }));

  const result = await withModelFallback(
    (model) => model.generateContentStream({ contents }),
    system,
  );

  return (async function* () {
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  })();
}
