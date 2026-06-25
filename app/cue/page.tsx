"use client";

import { useState, useRef, useEffect, FormEvent } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTED = [
  "What is confluence and how do I use it?",
  "How do you manage risk on a trade?",
  "How do I know if a trendline is valid?",
  "What timeframe should I spend the most time on?",
  "How long did it take you to become consistently profitable?",
];

export default function CuePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  async function send(text: string) {
    if (!text.trim() || streaming) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
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
    inputRef.current?.focus();
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

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--bone)", display: "flex", flexDirection: "column" }}>
      {/* HEADER */}
      <header style={{ borderBottom: "1px solid var(--line)", padding: "16px 24px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--acid)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14, color: "var(--bg)" }}>C</span>
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13, color: "var(--bone)", letterSpacing: "0.1em" }}>CUE AI</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", marginTop: 1 }}>Powered by Wall Street Academy training data</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span className="pulse" style={{ width: 6, height: 6, background: "var(--acid)", borderRadius: "50%", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--acid)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Live</span>
        </div>
      </header>

      {/* CHAT AREA */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 0 }}>
        <div style={{ maxWidth: 720, width: "100%", margin: "0 auto", flex: 1, display: "flex", flexDirection: "column" }}>
          {messages.length === 0 ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32, textAlign: "center", padding: "40px 0" }}>
              <div>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(249,255,60,0.1)", border: "1px solid rgba(249,255,60,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 24, color: "var(--acid)" }}>C</span>
                </div>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em", margin: "0 0 8px", color: "var(--bone)" }}>Ask Cue anything</h1>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--ash)", margin: 0, maxWidth: 440 }}>
                  Confluence, risk management, mindset, technical analysis — trained on real WSA content.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 480 }}>
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    disabled={streaming}
                    style={{
                      background: "var(--bg-1)",
                      border: "1px solid var(--line)",
                      borderRadius: 8,
                      padding: "10px 16px",
                      color: "var(--ash)",
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "border-color 0.15s, color 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(249,255,60,0.4)"; e.currentTarget.style.color = "var(--bone)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.color = "var(--ash)"; }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 8 }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  {/* Avatar */}
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 2,
                    background: msg.role === "assistant" ? "var(--acid)" : "var(--bg-2)",
                    border: msg.role === "user" ? "1px solid var(--line)" : "none",
                  }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 11, color: msg.role === "assistant" ? "var(--bg)" : "var(--ash)" }}>
                      {msg.role === "assistant" ? "C" : "Y"}
                    </span>
                  </div>
                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", marginBottom: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {msg.role === "assistant" ? "Cue" : "You"}
                    </div>
                    <div style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 15,
                      lineHeight: 1.65,
                      color: msg.role === "assistant" ? "var(--bone)" : "var(--ash)",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}>
                      {msg.content}
                      {msg.role === "assistant" && streaming && i === messages.length - 1 && msg.content === "" && (
                        <span style={{ display: "inline-flex", gap: 4, verticalAlign: "middle", marginLeft: 4 }}>
                          {[0, 1, 2].map((d) => (
                            <span key={d} className="pulse" style={{ width: 4, height: 4, background: "var(--acid)", borderRadius: "50%", display: "inline-block", animationDelay: `${d * 0.2}s` }} />
                          ))}
                        </span>
                      )}
                      {msg.role === "assistant" && streaming && i === messages.length - 1 && msg.content.length > 0 && (
                        <span style={{ display: "inline-block", width: 2, height: "1em", background: "var(--acid)", marginLeft: 2, verticalAlign: "text-bottom", animation: "pulse 1s ease-in-out infinite" }} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* INPUT */}
      <div style={{ borderTop: "1px solid var(--line)", padding: "16px", background: "var(--bg)", flexShrink: 0 }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: 720, margin: "0 auto", display: "flex", gap: 8, alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Cue about confluence, risk, mindset..."
            disabled={streaming}
            rows={1}
            style={{
              flex: 1,
              background: "var(--bg-1)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              padding: "10px 14px",
              color: "var(--bone)",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              resize: "none",
              outline: "none",
              lineHeight: 1.5,
              maxHeight: 160,
              overflow: "auto",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(249,255,60,0.4)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--line)"; }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 160) + "px";
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || streaming}
            style={{
              background: input.trim() && !streaming ? "var(--acid)" : "var(--bg-2)",
              border: "none",
              borderRadius: 8,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: input.trim() && !streaming ? "pointer" : "not-allowed",
              flexShrink: 0,
              transition: "background 0.15s",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h12M8 2l6 6-6 6" stroke={input.trim() && !streaming ? "var(--bg)" : "var(--muted)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
        <div style={{ maxWidth: 720, margin: "6px auto 0", fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", textAlign: "center" }}>
          Enter to send · Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
