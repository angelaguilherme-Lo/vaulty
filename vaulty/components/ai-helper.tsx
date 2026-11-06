"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickReplies = [
  {
    question: "How should I organize my notes?",
    answer:
      "Group notes by Personal, Work, Travel, and Private. Keep titles short and use tags for faster scanning.",
  },
  {
    question: "How should I set reminder priority?",
    answer:
      "Use Critical for urgent deadlines, High for important time-sensitive tasks, Medium for standard follow-ups, and Low for optional reminders.",
  },
  {
    question: "How do backups work?",
    answer:
      "Open Settings and export an encrypted backup with a separate passphrase. Save it outside this device. Vaulty cannot recover a forgotten backup passphrase.",
  },
  {
    question: "How do I explain Vaulty?",
    answer:
      "Say Vaulty combines private information management, reminders, notes, document references, and credential access into one premium workspace.",
  },
];

export function AiHelper() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const buttons = () => Array.from(panel?.querySelectorAll<HTMLButtonElement>("button") || []);
    buttons()[0]?.focus();
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); return; }
      if (event.key !== "Tab") return;
      const items = buttons();
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1)?.focus(); }
      else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0]?.focus(); }
    };
    document.addEventListener("keydown", keyDown);
    return () => { document.removeEventListener("keydown", keyDown); previous?.focus(); };
  }, [open]);
  const [messages, setMessages] = useState<
    { role: "assistant" | "user"; text: string }[]
  >([
    {
      role: "assistant",
      text: "Hi, I’m Vaulty Guide. I can help you organize entries, and suggest how to optimize each section.",
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
        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] text-[color:var(--text)]"
        aria-label="Open Vaulty Guide" aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </button>

      {open ? createPortal(
        <div className="guide-overlay" onClick={() => setOpen(false)}>
        <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="vaulty-guide-title" className="guide-panel rounded-[28px] border border-[color:var(--line)] bg-[color:var(--bg)] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.2)]" onClick={event => event.stopPropagation()}>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[image:var(--gradient-main)] text-white">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 id="vaulty-guide-title" className="font-semibold text-[color:var(--text)]">Vaulty Guide</h3>
              <p className="text-xs text-[color:var(--text-muted)]">
                Offline tips · no messages leave your device
              </p>
            </div>
          </div>

          <Button variant="ghost" onClick={() => setOpen(false)} aria-label="Close guide" className="mb-4 w-full gap-2"><X className="h-4 w-4" />Close guide</Button>
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
        </div></div>, document.body
      ) : null}
    </>
  );
}