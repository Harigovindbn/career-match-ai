import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1]?.content || "";

    // Simulate intelligent AI career coaching response based on prompt keywords
    let responseText = `That's a great question regarding your career trajectory. Based on your profile and target roles, I recommend focusing on measurable impact (e.g., "Increased conversion rates by 24%") rather than just listing duties.`;

    const lower = latestMessage.toLowerCase();
    if (lower.includes("resume") || lower.includes("cv")) {
      responseText = "When updating your resume for ATS systems, make sure to mirror the exact keywords found in the job description. Avoid multi-column layouts or complex graphics that confuse parsers.";
    } else if (lower.includes("interview") || lower.includes("behavioral")) {
      responseText = "For behavioral interviews, always use the STAR method (Situation, Task, Action, Result). Quantify your results whenever possible to show clear business value.";
    } else if (lower.includes("salary") || lower.includes("negotiate")) {
      responseText = "When negotiating salary, always anchor to market research data rather than your current compensation. Wait for them to make the first offer if possible!";
    }

    // Simulate realistic streaming response chunk by chunk
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const words = responseText.split(" ");
        for (const word of words) {
          controller.enqueue(encoder.encode(word + " "));
          await new Promise((resolve) => setTimeout(resolve, 35)); // Typing speed simulation
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 });
  }
}