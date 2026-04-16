"use client";

import { useState } from "react";
import { Bot, MessageCircle, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickReplies = [
  {
    question: "How should I organize my notes?",
    answer:
      "Group notes by Personal, Work, Travel, and Private. Keep titles short and use tags for faster scanning during the pitch.",
  },
  {
    question: "How should I set reminder priority?",
    answer:
      "Use Critical for urgent deadlines, High for important time-sensitive tasks, Medium for standard follow-ups, and Low for optional reminders.",
  },
  {
    question: "What should I show in the demo?",
    answer:
      "Open the dashboard, add a note, add a reminder, unlock the vault with the demo PIN, create a vault item, then switch between pages to show live persistence.",
  },
  {
    question: "How do I explain Vaulty?",
    answer:
      "Say Vaulty combines private information management, reminders, notes, document references, and credential access into one premium workspace.",
  },
];

export function AiHelper() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: "assistant" | "user"; text: string }[]
  >([
    {
      role: "assistant",
      text: "Hi, I’m Vaulty AI Helper. I can help you organize entries, and suggest how to optimize each section.",
    },
  ]);

  const ask = (question: string, answer: string) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", text: question },
      { role: "assistant", text: answer },
    ]);
  };

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[image:var(--gradient-main)] text-white shadow-[0_20px_50px_rgba(91,108,255,0.35)] transition hover:scale-[1.04] md:bottom-6"
        aria-label="Open Vaulty AI Helper"
      >
        {open ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </button>

      {open ? (
        <div className="fixed bottom-40 right-4 z-50 w-[calc(100%-32px)] max-w-md rounded-[28px] border border-[color:var(--line)] bg-[color:var(--panel)] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.2)] backdrop-blur-2xl md:bottom-24">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[image:var(--gradient-main)] text-white">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-[color:var(--text)]">Vaulty AI Helper</h3>
              <p className="text-xs text-[color:var(--text-muted)]">
                Support assistant
              </p>
            </div>
          </div>

          <div className="max-h-[320px] space-y-3 overflow-auto pr-1">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`rounded-2xl px-4 py-3 text-sm ${
                  message.role === "assistant"
                    ? "bg-[color:var(--panel-strong)] text-[color:var(--text)]"
                    : "ml-8 bg-[image:var(--gradient-cool)] text-white"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-2">
            {quickReplies.map((item) => (
              <Button
                key={item.question}
                variant="secondary"
                className="justify-start gap-2 text-left"
                onClick={() => ask(item.question, item.answer)}
              >
                <Sparkles className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.question}</span>
              </Button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}