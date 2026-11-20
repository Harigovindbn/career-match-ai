import { NextResponse } from "next/server";

import {
  isGeminiConfigured,
  streamCareerCoachReply,
  type ChatTurn,
} from "@/lib/ai/gemini";
import { createClient } from "@/lib/supabase/server";

function parseMessages(value: unknown): ChatTurn[] | null {
  if (!Array.isArray(value)) return null;

  const turns: ChatTurn[] = [];
  for (const item of value) {
    if (typeof item !== "object" || item === null) continue;
    const { role, content } = item as Record<string, unknown>;
    if ((role === "user" || role === "assistant") && typeof content === "string" && content.trim()) {
      turns.push({ role, content });
    }
  }
  return turns;
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in to use the assistant." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = parseMessages((body as { messages?: unknown })?.messages);
  if (!messages || messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "A user message is required." }, { status: 400 });
  }

  if (!isGeminiConfigured()) {
    return NextResponse.json(
      { error: "The AI assistant is not configured. Add GEMINI_API_KEY to .env.local." },
      { status: 503 },
    );
  }

  const metadataName =
    typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : "";

  let chunks: AsyncIterable<string>;
  try {
    chunks = await streamCareerCoachReply(messages, metadataName || undefined);
  } catch (error) {
    console.error("AI assistant error:", error);
    return NextResponse.json(
      { error: "The AI service is busy right now. Please try again in a moment." },
      { status: 503 },
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const text of chunks) {
          controller.enqueue(encoder.encode(text));
        }
      } catch (error) {
        console.error("AI assistant stream error:", error);
        controller.enqueue(encoder.encode("\n\n[The response was interrupted. Please try again.]"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
