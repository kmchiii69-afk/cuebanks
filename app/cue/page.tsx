"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string };

const CHIPS = [
  { label: "What is the stack?",        icon: "⬡" },
  { label: "How do I draw a fib?",      icon: "⬡" },
  { label: "Walk me through H4 → M5",   icon: "⬡" },
  { label: "Why do I keep losing?",     icon: "⬡" },
  { label: "When do I actually enter?", icon: "⬡" },
  { label: "How do I manage a trade?",  icon: "⬡" },
];

export default function CuePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [streaming, setStreaming] = useState(false);
  const [focused, setFocused]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || streaming) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setStreaming(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages([...next, assistantMsg]);

    try {
      const res = await fetch("/api/cue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) {
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: "Something went wrong. Try again." };
          return copy;
        });
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
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
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: "Connection error. Check your network." };
        return copy;
      });
    }

    setStreaming(false);
    textareaRef.current?.focus();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const canSend = input.trim().length > 0 && !streaming;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--bone)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Glow backdrop ─────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse 900px 600px at 50% 42%, rgba(249,255,60,0.055) 0%, transparent 70%)",
          transition: "opacity 0.6s ease",
        }}
      />

      {/* Grid texture */}
      <div
        className="grid-bg"
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.45 }}
      />

      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid var(--line)",
          padding: hasMessages ? "14px 28px" : "14px 28px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: "rgba(0,0,0,0.88)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Link href="/roadmap" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "var(--acid)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 14, color: "var(--bg)" }}>C</span>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12, color: "var(--bone)", letterSpacing: "0.14em" }}>CUE AI</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--muted)", marginTop: 1 }}>Wall Street Academy</div>
          </div>
        </Link>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span
            className="pulse"
            style={{ width: 5, height: 5, background: "#22c55e", borderRadius: "50%", display: "inline-block" }}
          />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#22c55e", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>
            Online
          </span>
        </div>
      </header>

      {/* ── Main area ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
          overflowY: hasMessages ? "auto" : "hidden",
        }}
      >
        {/* ── EMPTY STATE ─────────────────────────────────────────────────────── */}
        {!hasMessages && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 20px 32px",
              gap: 0,
            }}
          >
            {/* Avatar + heading */}
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: "50%",
                  background: "rgba(249,255,60,0.08)",
                  border: "1px solid rgba(249,255,60,0.25)",
                  boxShadow: "0 0 48px rgba(249,255,60,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 28px",
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 26, color: "var(--acid)" }}>C</span>
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(36px, 6vw, 64px)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.0,
                  margin: "0 0 14px",
                  color: "var(--bone)",
                }}
              >
                Ask Cue{" "}
                <em style={{ color: "var(--acid)", fontStyle: "normal" }}>anything.</em>
              </h1>

            </div>

            {/* Input card */}
            <div
              style={{
                width: "100%",
                maxWidth: 760,
                background: "rgba(12,16,24,0.85)",
                border: `1px solid ${focused ? "rgba(249,255,60,0.35)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 16,
                boxShadow: focused
                  ? "0 0 0 1px rgba(249,255,60,0.12), 0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(249,255,60,0.06)"
                  : "0 24px 80px rgba(0,0,0,0.6)",
                overflow: "hidden",
                transition: "border-color 0.2s, box-shadow 0.2s",
                backdropFilter: "blur(20px)",
              }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Ask Cue about confluence, risk, entries, mindset..."
                disabled={streaming}
                rows={3}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  padding: "22px 24px 16px",
                  color: "var(--bone)",
                  fontFamily: "var(--font-body)",
                  fontSize: 16,
                  lineHeight: 1.6,
                  resize: "none",
                  display: "block",
                  boxSizing: "border-box",
                  maxHeight: 200,
                  overflow: "auto",
                }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 200) + "px";
                }}
              />

              {/* Bottom bar */}
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "var(--muted)",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      border: "1px solid var(--line)",
                      background: "var(--bg-2)",
                    }}
                  >
                    WSA · 200+ Q&As
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => send(input)}
                  disabled={!canSend}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "9px 20px",
                    background: canSend ? "var(--acid)" : "rgba(255,255,255,0.05)",
                    border: "none",
                    borderRadius: 8,
                    color: canSend ? "var(--bg)" : "var(--muted)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    cursor: canSend ? "pointer" : "not-allowed",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Send
                </button>
              </div>
            </div>

            {/* Quick chips */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                justifyContent: "center",
                maxWidth: 760,
                marginTop: 20,
              }}
            >
              {CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => send(chip.label)}
                  disabled={streaming}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "8px 16px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: 100,
                    color: "var(--ash)",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "background 0.15s, border-color 0.15s, color 0.15s",
                    backdropFilter: "blur(8px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(249,255,60,0.07)";
                    e.currentTarget.style.borderColor = "rgba(249,255,60,0.3)";
                    e.currentTarget.style.color = "var(--bone)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                    e.currentTarget.style.color = "var(--ash)";
                  }}
                >
                  <span style={{ color: "var(--acid)", fontSize: 10 }}>▸</span>
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── CHAT THREAD ─────────────────────────────────────────────────────── */}
        {hasMessages && (
          <div style={{ flex: 1, overflowY: "auto", padding: "40px 20px 160px" }}>
            <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 6 }}>
              {messages.map((msg, i) => {
                const isStreaming = streaming && i === messages.length - 1 && msg.role === "assistant";
                if (msg.role === "user") {
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: "flex-end", paddingTop: 18 }}>
                      <div style={{
                        maxWidth: "72%",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        borderRadius: "18px 18px 4px 18px",
                        padding: "12px 18px",
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "rgba(255,255,255,0.7)",
                        wordBreak: "break-word",
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingTop: 10 }}>
                    {/* Cue avatar */}
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: "var(--acid)", display: "flex", alignItems: "center", justifyContent: "center",
                      marginTop: 14, boxShadow: "0 0 20px rgba(249,255,60,0.18)",
                    }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 11, color: "var(--bg)" }}>C</span>
                    </div>
                    {/* Response card */}
                    <div style={{
                      flex: 1, minWidth: 0,
                      background: "rgba(249,255,60,0.025)",
                      borderLeft: "2px solid rgba(249,255,60,0.35)",
                      borderRadius: "0 12px 12px 0",
                      padding: "16px 22px",
                    }}>
                      <div style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 15,
                        lineHeight: 1.75,
                        color: "rgba(255,255,255,0.92)",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        letterSpacing: "0.01em",
                      }}>
                        {msg.content}
                        {isStreaming && msg.content === "" && (
                          <span style={{ display: "inline-flex", gap: 4, verticalAlign: "middle" }}>
                            {[0, 1, 2].map((d) => (
                              <span key={d} className="pulse" style={{ width: 4, height: 4, background: "var(--acid)", borderRadius: "50%", display: "inline-block", animationDelay: `${d * 0.18}s` }} />
                            ))}
                          </span>
                        )}
                        {isStreaming && msg.content.length > 0 && (
                          <span style={{ display: "inline-block", width: 2, height: "0.85em", background: "var(--acid)", marginLeft: 2, verticalAlign: "text-bottom", animation: "pulse 1s ease-in-out infinite" }} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          </div>
        )}
      </div>

      {/* ── Pinned input (chat mode only) ───────────────────────────────────── */}
      {hasMessages && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 40,
            padding: "16px 20px 24px",
            background: "linear-gradient(to top, rgba(0,0,0,0.98) 60%, transparent)",
          }}
        >
          <div
            style={{
              maxWidth: 760,
              margin: "0 auto",
              background: "rgba(12,16,24,0.9)",
              border: `1px solid ${focused ? "rgba(249,255,60,0.35)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 14,
              boxShadow: focused
                ? "0 0 0 1px rgba(249,255,60,0.1), 0 16px 60px rgba(0,0,0,0.7)"
                : "0 16px 60px rgba(0,0,0,0.7)",
              overflow: "hidden",
              backdropFilter: "blur(20px)",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Ask Cue..."
              disabled={streaming}
              rows={1}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                padding: "16px 20px 10px",
                color: "var(--bone)",
                fontFamily: "var(--font-body)",
                fontSize: 15,
                lineHeight: 1.55,
                resize: "none",
                display: "block",
                boxSizing: "border-box",
                maxHeight: 160,
                overflow: "auto",
              }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 160) + "px";
              }}
            />
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.05)",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                Enter to send · Shift+Enter for newline
              </span>
              <button
                type="button"
                onClick={() => send(input)}
                disabled={!canSend}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "7px 16px",
                  background: canSend ? "var(--acid)" : "rgba(255,255,255,0.05)",
                  border: "none",
                  borderRadius: 7,
                  color: canSend ? "var(--bg)" : "var(--muted)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  cursor: canSend ? "pointer" : "not-allowed",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
