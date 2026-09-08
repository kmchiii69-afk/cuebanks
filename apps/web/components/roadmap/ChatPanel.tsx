"use client";

import { useEffect, useRef, useState } from "react";
import { useCueChatRequest } from "@/lib/useCueChatRequest";

// Cue AI chat — streams MiniMax via Convex `/cue` (or same-origin proxy).
type ChatMessage = { role: "user" | "assistant"; content: string };

export default function ChatPanel() {
  const requestCue = useCueChatRequest();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, streaming]);

  async function send(text: string) {
    if (!text.trim() || streaming) return;
    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setStreaming(true);
    const assistantMsg: ChatMessage = { role: "assistant", content: "" };
    setMessages([...next, assistantMsg]);

    try {
      const res = await requestCue(next);
      if (!res.ok || !res.body) throw new Error("fetch failed");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: copy[copy.length - 1].content + chunk,
          };
          return copy;
        });
      }
    } catch {
      setMessages((prev) => {
        const c = [...prev];
        c[c.length - 1] = { role: "assistant", content: "Something went wrong." };
        return c;
      });
    }
    setStreaming(false);
    inputRef.current?.focus();
  }

  return (
    <>
      {open ? (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
            width: 380,
            height: 540,
            background: "var(--bg-1)",
            border: "1px solid var(--line)",
            borderTop: "2px solid var(--acid)",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--acid)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                Cue AI
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  marginTop: 2,
                }}
              >
                On-demand answers from Cue&apos;s full curriculum
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
                padding: "0 4px",
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  margin: "auto",
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  textAlign: "center",
                  maxWidth: 280,
                }}
              >
                Ask anything — setup quality, fib placement, when to enter, how to manage a trade.
                Cue&apos;s answer is in here.
              </div>
            ) : null}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: m.role === "user" ? "rgba(37,99,235,0.12)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${m.role === "user" ? "rgba(37,99,235,0.25)" : "rgba(255,255,255,0.07)"}`,
                  fontFamily: "var(--font-body)",
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  color: m.role === "user" ? "#fff" : "rgba(255,255,255,0.78)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {m.content || (m.role === "assistant" && streaming ? "..." : "")}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            style={{
              padding: "10px 12px",
              borderTop: "1px solid var(--line)",
              display: "flex",
              gap: 6,
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Cue..."
              autoFocus
              disabled={streaming}
              style={{
                flex: 1,
                background: "var(--bg-2)",
                border: "1px solid var(--line)",
                borderRadius: 6,
                padding: "10px 12px",
                color: "var(--bone)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              style={{
                background: "rgba(37,99,235,0.15)",
                border: "1px solid rgba(37,99,235,0.4)",
                borderRadius: 6,
                padding: "0 14px",
                color: "var(--acid)",
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: streaming || !input.trim() ? "not-allowed" : "pointer",
                opacity: streaming || !input.trim() ? 0.5 : 1,
              }}
            >
              Send
            </button>
          </form>
        </div>
      ) : null}

      {/* Floating button — bottom right */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 999,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--acid)",
          color: "#000",
          border: "none",
          fontSize: 24,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(37,99,235,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Open Cue AI"
      >
        C
      </button>
    </>
  );
}
