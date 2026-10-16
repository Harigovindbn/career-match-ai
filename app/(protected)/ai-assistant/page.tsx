"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, User, Loader2, RefreshCw } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello Alex! I'm your AI Career Coach. How can I help you optimize your resume, prepare for interviews, or navigate job matches today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessageContent = input.trim();
    setInput("");

    const newMessages: Message[] = [
      ...messages,
      { id: Date.now().toString(), role: "user", content: userMessageContent },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("Failed to fetch response");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = "";

      const assistantMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: "assistant", content: "" },
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          assistantResponse += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: assistantResponse }
                : msg
            )
          );
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, I encountered an error connecting to the AI service. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 bg-[var(--background)] text-[var(--foreground)] min-h-[calc(100vh-5rem)] flex flex-col justify-between pb-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
            <Sparkles className="h-4 w-4" />
            AI Career Coaching
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
            <Bot className="w-6 h-6 text-[var(--primary)]" />
            AI Assistant
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[var(--muted)]">
            Ask real-time questions regarding interview prep, salary negotiation, and resume refinement.
          </p>
        </div>
      </section>

      {/* Chat Box Container */}
      <div className="flex-1 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 shadow-2xl flex flex-col justify-between h-[65vh]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                  m.role === "user"
                    ? "border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-[var(--primary)]"
                    : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--foreground)]"
                }`}
              >
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-[var(--primary)] text-[var(--primary-text)] font-medium rounded-tr-none"
                    : "border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--foreground)] rounded-tl-none"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--foreground)]">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-xs text-[var(--muted)]">
                <Loader2 className="h-4 w-4 animate-spin text-[var(--primary)]" />
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-[var(--border)] flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your career, interview, or resume..."
            className="flex-1 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-xs sm:text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none transition"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="inline-flex items-center justify-center rounded-2xl bg-[var(--primary)] px-5 py-3 text-xs font-semibold text-[var(--primary-text)] transition hover:bg-[var(--primary-hover)] shadow-lg disabled:opacity-50 shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}