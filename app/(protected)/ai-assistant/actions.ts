"use server";

export type AssistantMessageInput = {
  role: "user" | "model";
  content: string;
};

export async function sendAssistantMessage(
  history: AssistantMessageInput[],
  newMessage: string
): Promise<{ success: boolean; data?: string; error?: string }> {
  // Simulate a brief network delay (1 second)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const lowerMsg = newMessage.toLowerCase();

  let response = "That's a great question regarding your career! To optimize for ATS, make sure to include relevant keywords from the job description and keep your formatting clean.";

  if (lowerMsg.includes("resume") || lowerMsg.includes("bullet")) {
    response = "For your resume bullet points, always start with strong action verbs and include metrics (e.g., 'Increased efficiency by 25%'). Would you like me to rewrite a specific bullet point for you?";
  } else if (lowerMsg.includes("interview") || lowerMsg.includes("prep")) {
    response = "When prepping for interviews, use the STAR method (Situation, Task, Action, Result) to structure your behavioral answers clearly and concisely.";
  } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
    response = "Hello! I am your Career Match AI Assistant. How can I help you advance your career today?";
  }

  return {
    success: true,
    data: response,
  };
}