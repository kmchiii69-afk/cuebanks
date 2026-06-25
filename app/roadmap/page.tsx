"use client";

import Link from "next/link";
import { useState, useRef, useEffect, FormEvent } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Video = { id: string; label: string };
type PhaseItem = { label: string; note: string; tag?: string; videos?: Video[] };
type Phase = { num: string; title: string; duration: string; tagline: string; checkpoint: string; items: PhaseItem[] };

// ─── Data ─────────────────────────────────────────────────────────────────────
const CNC: Video[] = [
  { id: "1201290210", label: "6/14/26" }, { id: "1197879523", label: "5/31/26" },
  { id: "1193112745", label: "5/17/26" }, { id: "1182848562", label: "4/12/26" },
  { id: "1175798431", label: "3/1/26" },  { id: "1173868687", label: "3/15/26" },
  { id: "1155829854", label: "1/18/26" }, { id: "1151494574", label: "1/4/26" },
  { id: "1148543829", label: "12/21/25" },{ id: "1146446807", label: "12/14/25" },
  { id: "1135200815", label: "11/9/25" }, { id: "1133013682", label: "11/2/25" },
  { id: "1128727690", label: "10/19/25" },{ id: "1120700415", label: "9/21/25" },
  { id: "1116601308", label: "9/7/25" },  { id: "1114762699", label: "8/31/25" },
  { id: "1108943478", label: "8/10/25" }, { id: "1106944714", label: "8/3/25" },
  { id: "1101101876", label: "7/13/25" }, { id: "1099239519", label: "7/6/25" },
  { id: "1097412063", label: "6/29/25" }, { id: "1095497142", label: "6/22/25" },
  { id: "1088773116", label: "5/25/25" }, { id: "1085559828", label: "5/18/25" },
  { id: "1081375136", label: "5/5/25" },  { id: "1079236967", label: "4/27/25" },
  { id: "1077278344", label: "4/20/25" }, { id: "1075342024", label: "4/13/25" },
  { id: "1073067677", label: "4/6/25" },  { id: "1070911359", label: "3/30/25" },
  { id: "1062031860", label: "3/2/25" },  { id: "1057675113", label: "2/16/25" },
  { id: "1050770984", label: "1/26/25" }, { id: "1028430547", label: "11/10/24" },
  { id: "1026578614", label: "11/4/24" }, { id: "1024574724", label: "10/28/24" },
  { id: "1019458261", label: "10/13/24" },{ id: "1012499868", label: "9/15/24" },
  { id: "1000235936", label: "8/18/24" }, { id: "993518415",  label: "7/28/24" },
];

const CUECASTS: Video[] = [
  { id: "1203318818", label: "6/21/26" }, { id: "1195220470", label: "5/24/26" },
  { id: "1191014940", label: "5/10/26" }, { id: "1188924684", label: "5/3/26" },
  { id: "1184668500", label: "4/19/26" }, { id: "1177156977", label: "3/25/26" },
  { id: "1176203834", label: "3/23/26" }, { id: "1163147705", label: "2/9/26" },
  { id: "1158257286", label: "1/25/26" }, { id: "1153452357", label: "1/11/26" },
  { id: "1149962357", label: "12/28/25" },{ id: "1147535291", label: "12/17/25" },
  { id: "1144396697", label: "12/7/25" }, { id: "1137540915", label: "11/16/25" },
  { id: "1130752380", label: "10/26/25" },{ id: "1126709097", label: "10/12/25" },
  { id: "1124703573", label: "10/5/25" }, { id: "1122730757", label: "9/28/25" },
  { id: "1118629053", label: "9/14/25" }, { id: "1112787551", label: "8/24/25" },
  { id: "1110811593", label: "8/17/25" }, { id: "1097719191", label: "6/30/25" },
  { id: "1093588206", label: "6/15/25" }, { id: "1091708517", label: "6/9/25" },
  { id: "1089858154", label: "6/2/25" },  { id: "1089713979", label: "6/2/25 B" },
  { id: "1068805247", label: "3/24/25" },
];

const PHASES: Phase[] = [
  {
    num: "01", title: "Foundation & Mindset", duration: "Week 1 – 2",
    tagline: "Your strategy isn't gonna be the basis of your trading success. Risk management will be. Before you touch a chart, you need to understand that.",
    checkpoint: "You know the rules that keep your account alive. You understand why there is not one single successful trader who uses improper risk management. You're not starting phase two without this locked in.",
    items: [
      { label: "Introduction to Forex", note: "What the market actually is, how it moves, and what it isn't. The foundation is support and resistance — everything else is built on top of that." },
      { label: "Platform Setup — MT4 + TradingView", note: "Cue's exact indicators, moving averages, and chart templates before anything else. If the setup is wrong, the analysis is wrong from the start." },
      { label: "Risk Management 101", note: "1% to 5% risk per trade — conservative to the absolute most you should go. Cue blew four $1,000 accounts before he understood this. You don't have to.",
        videos: [{ id: "160573172", label: "Risk Management 101" }] },
      { label: "Mental Health — The Trader's Environment", note: "Once you get greedy, that's what kills your success. This module covers the mindset before the market exposes every weak point in your psychology.",
        videos: [{ id: "200293134", label: "Psychology" }] },
      { label: "The Four Fears + Greed, Revenge, FOMO", note: "You are the problem at times. Not the broker. The market. You. Know your patterns before they cost you.",
        videos: [
          { id: "226589336", label: "The Four Fears" },
          { id: "1090926102", label: "Fear of Market 2.0" },
          { id: "150539053", label: "Fear of Market 1.0" },
          { id: "1090913021", label: "Greed 2.0" },
          { id: "148024071", label: "The Greed Effect" },
          { id: "492840038", label: "Fear & Greed" },
        ] },
      { label: "Demo vs Live — Understanding the Difference", note: "Demo doesn't replicate the emotional weight of real money. This module bridges that gap so your first live account doesn't become a tuition payment.",
        videos: [
          { id: "1090929269", label: "Demo vs Live 2.0" },
          { id: "150556196", label: "Demo vs Live 1.0" },
        ] },
    ],
  },
  {
    num: "02", title: "Reading Price", duration: "Week 2 – 3",
    tagline: "If the market is above the MAs, focus on buys. If it's under the MAs, focus on sells. Learn to see what the market is actually showing you — and flow with it.",
    checkpoint: "You can look at any chart and tell the trend, mark your S&R levels, and identify supply and demand zones. You know what's noise and what's a real move. Charts don't lie to you anymore.",
    items: [
      { label: "Identifying The Trend (1.0 + 2.0)", note: "Higher high points, higher low points — that's a bullish market. Lower highs, lower lows — that's bearish. Structure is always first.",
        videos: [
          { id: "208979674", label: "Market Structure 2.0" },
          { id: "153506121", label: "50 & 200 EMA" },
        ] },
      { label: "Support & Resistance (1.0 + 2.0)", note: "The base of every style of trading. Daily levels on the line chart, H4 on the line chart, H1 on candles — that's how Cue marks his S&R from the top down.",
        videos: [
          { id: "208544828", label: "S&R 2.0" },
          { id: "163877268", label: "S&R 1.0" },
          { id: "156109526", label: "S&R HD" },
        ] },
      { label: "Supply & Demand", note: "The institutional orders behind every real move. Not retail psychology — the actual zones where price is going to react, repeatedly.",
        videos: [
          { id: "148405472", label: "Drawing Supply & Demand" },
          { id: "163878343", label: "S&D with Structure" },
        ] },
      { label: "Drawing Trendlines (1.0 + 2.0)", note: "If you can't walk in it, it's invalid. Most traders draw them wrong. Learn where to anchor, when they break, and exactly what that means for the next move.",
        videos: [
          { id: "1162341882", label: "Trendlines 2.0" },
          { id: "161399675", label: "Drawing Trendlines Correctly" },
        ] },
      { label: "Chart Practice: 10 Drawn Charts", tag: "DRILL", note: "Draw 10 charts with trend direction, S&R, and supply/demand marked. This is how you build the eye. You can't skip the reps — submit before moving to Phase 3." },
    ],
  },
  {
    num: "03", title: "Structure + Levels", duration: "Week 3 – 4",
    tagline: "Regardless of what the MAs are doing, always ask yourself — what is structure doing? This phase is where you learn to read the blueprint of every move before it happens.",
    checkpoint: "You can map market structure clean on any pair. You can draw a fib from point A to point B and identify where price is most likely to react — 38.2%, 23.6%, the green zone. Entries stop being guesses.",
    items: [
      { label: "Drawing Market Structure (1.0 + 2.0)", note: "Break of structure. Change of character. Continuation versus reversal. You need to know what the market is doing before you can know where it's going.",
        videos: [
          { id: "208979674", label: "Market Structure 2.0" },
          { id: "153504825", label: "Structure, Pushes & Daily Cycle" },
        ] },
      { label: "Using Fibonacci (1.0 + 2.0)", note: "Point A to point B — 38.2% is your first higher-low opportunity, 23.6% is where it gets sloppy. Know which levels to trust and which ones to wait through.",
        videos: [
          { id: "214333836", label: "Fibonacci 2.0" },
          { id: "148814763", label: "Fibonacci 1.0" },
        ] },
      { label: "Fibonacci Drill: 20 Historical Moves", tag: "DRILL", note: "Pull 20 historical moves and map the fib on each one. Find where price reacted. This repetition is what builds the eye — you cannot shortcut this." },
      { label: "Top Down Analysis — Cue's Exact Flow", note: "H4 for 30% of your time, M5 for 60%, H1 or M30 for the last 10%. Top down every single session before you touch a lower timeframe entry." },
      { label: "Chart Pattern Anatomy", note: "The patterns that repeat across every market. Double tops only work in a downtrend. Double bottoms confirm an uptrend. Know the shape before the market confirms it." },
    ],
  },
  {
    num: "04", title: "The Confluence System", duration: "Week 4 – 7",
    tagline: "When it shows up that smooth — structure clean, MAs below the market, 38.2% respected, everything aligned — you have to take advantage of it. This is the system.",
    checkpoint: "You can identify a full confluence setup: structure first, MAs confirm direction, fib level respected, candle close confirms the entry. You stop entering on feeling. You enter on evidence.",
    items: [
      { label: "Confluence Trading 1.0 → 2.0 → 2.5", note: "Watch in order. Don't skip. Each version builds on the last — this is Cue's full journey developing the system from its foundation. The stack starts here.",
        videos: [
          { id: "148803452", label: "Confluence 1.0" },
          { id: "169326892", label: "Confluence 2.0" },
          { id: "187488265", label: "Confluence 2.5" },
        ] },
      { label: "Confluence Trading 2.9 → 3.0", note: "Advanced application. Cue thinking out loud on live charts — what he filters, what disqualifies a setup, how the whole system runs when it's second nature.",
        videos: [
          { id: "248648721", label: "Confluence 2.9" },
          { id: "308011962", label: "Confluence 3.0" },
        ] },
      { label: "Confluence XXX + Confluence 30.0", note: "The deep end. Live charts, real setups, the full system in motion. High MAs smooth below, 38.2% respected, price acting like butter.",
        videos: [
          { id: "351940671", label: "Confluence XXX" },
          { id: "680498239", label: "Confluence 30.0" },
        ] },
      { label: "The Process — Maintaining a Live Trade", note: "Never have urgency for the market to go in your favor — that's how you close prematurely. This is entry to exit: how Cue manages a trade in real time, tick by tick.",
        videos: [{ id: "218319570", label: "The Process" }] },
      { label: "Confluence Tick By Tick + Confluence RAW", note: "Unfiltered real-time execution. Tick by tick — that means every candle, every close, every moment the market makes a new move. This is how the professional thinks.",
        videos: [
          { id: "1042367807", label: "Tick by Tick" },
          { id: "1149579397", label: "Confluence RAW" },
        ] },
      { label: "50 Setup Drill", tag: "DRILL", note: "Mark confluence zones on 50 historical setups — entry, stop, target. Then ask yourself: was structure first? Did the MAs confirm? Was the candle close there? That's the checklist." },
    ],
  },
  {
    num: "05", title: "Advanced Execution", duration: "Week 7 – 10",
    tagline: "Stop being afraid to up your lot size when the risk is tight and the setup is clean. This phase layers in the tools that sharpen your entries and filter the trash.",
    checkpoint: "You have additional confirmation tools in your stack. You can identify trend strength before entering, catch breakouts early, and recognize the technical mistakes that kill accounts before you make them.",
    items: [
      { label: "Ichimoku Kinko Hyo", note: "If it says strong buy, try not to sell. This tool shows trend, momentum, and support in one read — an additional filter that confirms what your structure is already telling you.",
        videos: [{ id: "148838797", label: "Ichimoku" }] },
      { label: "Pivot Points", note: "Institutional levels that recalculate daily. High-confluence zones that print consistently — where banks are watching and price responds.",
        videos: [{ id: "152105266", label: "Pivot Points" }] },
      { label: "Using Channels to Catch Breakouts", note: "How to position before the move, not after. Float the trend — don't try to catch five-pip micro moves inside a channel. Wait for the real break.",
        videos: [{ id: "160432593", label: "Channels & Breakouts" }] },
      { label: "Average Directional Index (ADX)", note: "Your trend strength filter. Don't try to trade a ranging, choppy market — that's where most accounts bleed out. ADX tells you when the trend is real.",
        videos: [{ id: "153460551", label: "ADX" }] },
      { label: "Common Technical F**k Ups", note: "Treat the charts like a piece of art. Precision, precision, precision. This is Cue's breakdown of the exact mistakes he sees most — the ones that are easily fixed once you see them.",
        videos: [{ id: "1135918376", label: "Common Technical Mistakes" }] },
      { label: "Major Market Patterns — All 13", note: "Head & shoulders, double tops/bottoms, wedges, pennants, triangles, rectangles — all of them. Know the shape before the market prints the confirmation candle." },
    ],
  },
  {
    num: "06", title: "Live & Consistent", duration: "Week 10 – 16",
    tagline: "All I need is 20 or 30 pips a day. The real money is here. This phase is where you stop watching and start compounding.",
    checkpoint: "You're posting setups, getting reviewed, journaling every trade. After every loss you're writing down what you did wrong and what you could do better. The majority wins is all that matters — and you're building toward that.",
    items: [
      { label: "Monthly Group Q&A with Cue", note: "Bring your charts. Bring your questions. Four live calls across four months — real feedback on real setups, not a lecture. Show up prepared or show up ready to learn from someone who is." },
      { label: `Chart N Chill — ${CNC.length} Sessions`, note: "Every Chart N Chill session on demand. When you have a question, the answer is probably already recorded here. Most recent first.", videos: CNC },
      { label: `CueCAST — ${CUECASTS.length} Sessions`, note: "Cue's live market analysis sessions. Real time, real charts, real decisions — this is how the professional thinks through a session.", videos: CUECASTS },
      { label: "NY + London Session Focus", note: "NY and London are where the volume is, where the setups form, where the money moves. Build your schedule around these sessions and stop forcing trades in dead markets." },
      { label: "Post Course Mindset", note: "Patience is the biggest thing. It's a transfer of money from the impatient to the patient. This module covers growing a small account, when to scale lot size, when to withdraw — and when not to." },
      { label: "30-Day Live Trading Journal", tag: "DRILL", note: "Track every trade: entry, stop, target, outcome, and notes. Review it weekly. This data is what makes you better — not more videos. The journal is the system." },
    ],
  },
];

// ─── Video Modal ───────────────────────────────────────────────────────────────
type ModalVideo = { id: string; label: string };

function VideoModal({ video, onClose }: { video: ModalVideo; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 1020, background: "var(--bg-1)", border: "1px solid var(--line)", borderTop: "2px solid var(--acid)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid var(--line)" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.16em", textTransform: "uppercase" }}>{video.label}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", lineHeight: 1, fontSize: 20, padding: "0 4px" }}>✕</button>
        </div>
        <div style={{ position: "relative", paddingTop: "56.25%" }}>
          <iframe
            src={`https://player.vimeo.com/video/${video.id}?autoplay=1&color=f9ff3c&title=0&byline=0&portrait=0`}
            allow="autoplay; fullscreen; picture-in-picture" allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Cue AI Chat Widget ────────────────────────────────────────────────────────
type ChatMessage = { role: "user" | "assistant"; content: string };

function CueChat() {
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
      const res = await fetch("/api/cue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) throw new Error("fetch failed");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value, { stream: true });
        setMessages(prev => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + chunk };
          return copy;
        });
      }
    } catch {
      setMessages(prev => { const c = [...prev]; c[c.length - 1] = { role: "assistant", content: "Something went wrong." }; return c; });
    }
    setStreaming(false);
    inputRef.current?.focus();
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div style={{ position: "fixed", bottom: 88, right: 24, width: 360, height: 520, background: "var(--bg-1)", border: "1px solid var(--line)", borderTop: "2px solid var(--acid)", zIndex: 999, display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,0.8)" }}>
          {/* Header */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--acid)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12, color: "var(--bg)" }}>C</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "var(--bone)", letterSpacing: "0.1em" }}>CUE AI</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--muted)", marginTop: 1 }}>Ask anything about the system</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 0 }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
            {messages.length === 0 ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ash)", lineHeight: 1.6, margin: 0, textAlign: "center" }}>
                  Trained on 200+ Q&As from WSA content. Ask Cue anything about confluence, risk, mindset, or the system.
                </p>
                {["What is the stack?", "How do I manage risk?", "How do I draw a fib correctly?"].map(q => (
                  <button key={q} onClick={() => send(q)} style={{ background: "var(--bg-2)", border: "1px solid var(--line)", padding: "8px 12px", color: "var(--ash)", fontFamily: "var(--font-body)", fontSize: 12, textAlign: "left", cursor: "pointer", lineHeight: 1.4 }}>
                    {q}
                  </button>
                ))}
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 1, background: m.role === "assistant" ? "var(--acid)" : "var(--bg-2)", border: m.role === "user" ? "1px solid var(--line)" : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: m.role === "assistant" ? "var(--bg)" : "var(--muted)" }}>{m.role === "assistant" ? "C" : "Y"}</span>
                  </div>
                  <div style={{ flex: 1, fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.6, color: m.role === "assistant" ? "var(--bone)" : "var(--ash)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {m.content}
                    {m.role === "assistant" && streaming && i === messages.length - 1 && m.content.length > 0 && (
                      <span style={{ display: "inline-block", width: 2, height: "0.9em", background: "var(--acid)", marginLeft: 2, verticalAlign: "text-bottom", animation: "pulse 1s ease-in-out infinite" }} />
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: "1px solid var(--line)", padding: "10px 12px", flexShrink: 0 }}>
            <form onSubmit={(e: FormEvent) => { e.preventDefault(); send(input); }} style={{ display: "flex", gap: 8 }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={streaming}
                placeholder="Ask Cue..."
                style={{ flex: 1, background: "var(--bg-2)", border: "1px solid var(--line)", padding: "8px 12px", color: "var(--bone)", fontFamily: "var(--font-body)", fontSize: 13, outline: "none" }}
                onFocus={e => { e.currentTarget.style.borderColor = "rgba(249,255,60,0.4)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "var(--line)"; }}
              />
              <button type="submit" disabled={!input.trim() || streaming} style={{ background: input.trim() && !streaming ? "var(--acid)" : "var(--bg-2)", border: "none", width: 36, height: 36, cursor: input.trim() && !streaming ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M7 1l6 6-6 6" stroke={input.trim() && !streaming ? "var(--bg)" : "var(--muted)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ position: "fixed", bottom: 24, right: 24, width: 56, height: 56, borderRadius: "50%", background: open ? "var(--bg-2)" : "var(--acid)", border: open ? "1px solid var(--line)" : "none", cursor: "pointer", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: open ? "none" : "0 0 0 1px var(--acid), 0 8px 32px rgba(249,255,60,0.35)", transition: "background 0.2s" }}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 2L16 16M16 2L2 16" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 18, color: "var(--bg)", letterSpacing: "-0.02em" }}>C</span>
        )}
      </button>
    </>
  );
}

// ─── Play button ───────────────────────────────────────────────────────────────
function PlayBtn({ video, onPlay }: { video: Video; onPlay: (v: Video) => void }) {
  return (
    <button
      onClick={() => onPlay(video)}
      style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px 3px 7px", background: "rgba(249,255,60,0.07)", border: "1px solid rgba(249,255,60,0.2)", color: "var(--acid)", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.12s, border-color 0.12s", whiteSpace: "nowrap" }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(249,255,60,0.15)"; e.currentTarget.style.borderColor = "rgba(249,255,60,0.5)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(249,255,60,0.07)"; e.currentTarget.style.borderColor = "rgba(249,255,60,0.2)"; }}
    >
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 1L7 4L1.5 7V1Z" fill="currentColor"/></svg>
      {video.label}
    </button>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function RoadmapPage() {
  const [activeVideo, setActiveVideo] = useState<ModalVideo | null>(null);
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);

  const totalVideos = PHASES.reduce((acc, p) => acc + p.items.reduce((a, i) => a + (i.videos?.length ?? 0), 0), 0);

  function jumpTo(i: number) {
    phaseRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="grid-bg" style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--bone)" }}>
      {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
      <CueChat />

      {/* HEADER */}
      <header style={{ borderBottom: "1px solid var(--line)", padding: "20px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <Link href="/ig" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/wsa/home/1.png" alt="Wall Street Academy" style={{ height: 44, width: 44, borderRadius: "50%", objectFit: "cover" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "var(--bone)", letterSpacing: "0.18em", textTransform: "uppercase" }}>Wall Street Academy</span>
        </Link>
        {/* Phase jump nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {PHASES.map((p, i) => (
            <button key={i} onClick={() => jumpTo(i)} style={{ background: "none", border: "1px solid var(--line)", color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", padding: "4px 8px", cursor: "pointer", transition: "color 0.15s, border-color 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--acid)"; e.currentTarget.style.borderColor = "rgba(249,255,60,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--line)"; }}>
              {p.num}
            </button>
          ))}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
          · Inner Circle · Roadmap ·
        </div>
      </header>

      {/* HERO */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "72px 48px 8px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(900px 480px at 50% 0%, rgba(249,255,60,0.09), transparent 60%)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, background: "rgba(249,255,60,0.06)", border: "1px solid rgba(249,255,60,0.2)", padding: "6px 16px" }}>
            <span className="pulse" style={{ width: 5, height: 5, background: "var(--acid)", borderRadius: "50%", display: "inline-block" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.22em", textTransform: "uppercase" }}>Inner Circle Member Access</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(44px, 7vw, 80px)", lineHeight: 0.95, letterSpacing: "-0.045em", color: "var(--bone)", margin: "0 0 20px" }}>
            The Inner Circle<br />
            <em style={{ color: "var(--acid)", fontStyle: "normal" }}>Roadmap.</em>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 18, lineHeight: 1.6, color: "var(--ash)", margin: "0 auto 28px", maxWidth: 540 }}>
            Every module. Every drill. Every live session. In the exact order that builds a profitable trader — not just someone who watched videos.
          </p>
          {/* Stats row */}
          <div style={{ display: "inline-flex", gap: 0, border: "1px solid var(--line)", overflow: "hidden", marginBottom: 64 }}>
            {[
              { n: "6", label: "Phases" },
              { n: "16", label: "Weeks" },
              { n: String(totalVideos) + "+", label: "Videos" },
              { n: `${CNC.length + CUECASTS.length}`, label: "Live Sessions" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "14px 24px", borderRight: i < 3 ? "1px solid var(--line)" : "none", textAlign: "center", background: "var(--bg-1)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", color: "var(--acid)", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHASES */}
      <section style={{ maxWidth: 920, margin: "0 auto", padding: "0 48px 100px" }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 28, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, var(--acid) 0%, rgba(249,255,60,0.06) 100%)", pointerEvents: "none" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {PHASES.map((phase, i) => {
              const videoCount = phase.items.reduce((a, item) => a + (item.videos?.length ?? 0), 0);
              return (
                <div key={i} ref={el => { phaseRefs.current[i] = el; }} style={{ display: "flex", gap: 32, position: "relative", scrollMarginTop: 80 }}>
                  {/* Dot */}
                  <div style={{ flexShrink: 0, width: 56, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 32, position: "relative", zIndex: 1 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--bg)", border: "2px solid var(--acid)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 24px rgba(249,255,60,0.2)" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.04em" }}>{phase.num}</span>
                    </div>
                  </div>

                  {/* Card */}
                  <div style={{ flex: 1, background: "var(--bg-1)", border: "1px solid var(--line)", borderTop: "1px solid rgba(249,255,60,0.22)", overflow: "hidden" }}>
                    {/* Card header */}
                    <div style={{ padding: "26px 32px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.22em", textTransform: "uppercase", background: "var(--bg-2)", border: "1px solid var(--line)", padding: "4px 10px" }}>{phase.duration}</div>
                        {videoCount > 0 && (
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.18em", textTransform: "uppercase", background: "rgba(249,255,60,0.07)", border: "1px solid rgba(249,255,60,0.2)", padding: "4px 10px" }}>
                            ▶ {videoCount} videos
                          </div>
                        )}
                      </div>
                      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(22px, 3vw, 28px)", letterSpacing: "-0.025em", color: "var(--bone)", margin: "0 0 10px" }}>{phase.title}</h2>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.65, color: "var(--ash)", margin: 0, maxWidth: 620 }}>{phase.tagline}</p>
                    </div>

                    {/* Items */}
                    <div style={{ borderTop: "1px solid var(--line)", padding: "0 32px" }}>
                      {phase.items.map((item, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "15px 0", borderBottom: j < phase.items.length - 1 ? "1px solid var(--line)" : "none" }}>
                          <div style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", border: "1px solid var(--line-2)", background: "var(--bg-2)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "var(--muted)" }}>{j + 1}</span>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                              <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--bone)", letterSpacing: "-0.01em" }}>{item.label}</span>
                              {item.tag && (
                                <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "var(--bg)", background: "var(--acid)", padding: "2px 6px" }}>{item.tag}</span>
                              )}
                            </div>
                            <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, lineHeight: 1.55, color: "var(--ash)", marginBottom: item.videos?.length ? 10 : 0 }}>{item.note}</div>
                            {item.videos && item.videos.length > 0 && (
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                {item.videos.map(v => <PlayBtn key={v.id} video={v} onPlay={setActiveVideo} />)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Checkpoint */}
                    <div style={{ borderTop: "1px solid var(--line)", background: "rgba(249,255,60,0.035)", padding: "14px 32px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.18em", textTransform: "uppercase", flexShrink: 0, paddingTop: 1, whiteSpace: "nowrap" }}>· After ·</div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, lineHeight: 1.55, color: "var(--acid)", opacity: 0.8 }}>{phase.checkpoint}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INCLUDED */}
      <section style={{ maxWidth: 920, margin: "0 auto", padding: "0 48px 80px" }}>
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 48 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.22em", textTransform: "uppercase", textAlign: "center", marginBottom: 28 }}>· What's included ·</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {[
              { label: `${totalVideos}+ Videos`, desc: "Every module, webinar, and live session — all on demand." },
              { label: `${CNC.length} Chart N Chill Sessions`, desc: "Every Chart N Chill on record. The answer is probably already in here." },
              { label: `${CUECASTS.length} CueCAST Sessions`, desc: "Cue's live market analysis sessions — real time, real charts." },
              { label: "Monthly Group Q&A", desc: "4 live calls with Cue across the 4 months. Bring your charts." },
              { label: "Structured Drills", desc: "Practice between phases is required. This is a training program, not a library." },
              { label: "Cue AI — On Demand", desc: "Ask Cue anything, anytime. Trained on WSA content, answers in his voice." },
            ].map((s, i) => (
              <div key={i} style={{ background: "var(--bg-1)", border: "1px solid var(--line)", padding: "18px 20px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--bone)", marginBottom: 5, letterSpacing: "-0.01em" }}>{s.label}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, lineHeight: 1.5, color: "var(--ash)" }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "0 48px 120px", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 20 }}>· 6 phases · 16 weeks · $15,000 ·</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", letterSpacing: "-0.04em", color: "var(--bone)", margin: "0 0 16px", lineHeight: 1.0 }}>
          Apply and see if you&rsquo;re<br /><em style={{ color: "var(--acid)", fontStyle: "normal" }}>the right fit.</em>
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.55, color: "var(--ash)", margin: "0 auto 36px", maxWidth: 440 }}>
          The roadmap is built. The system is proven. The only question is whether you&rsquo;re ready to follow it.
        </p>
        <Link href="/ig/apply" style={{ display: "inline-block", padding: "20px 52px", background: "var(--acid)", color: "var(--bg)", fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", boxShadow: "0 0 0 1px var(--acid), 0 0 64px rgba(249,255,60,0.3)" }}>
          Apply for the Inner Circle →
        </Link>
        <p style={{ marginTop: 16, fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.18em", textTransform: "uppercase" }}>· Takes 2 minutes · Spots are limited ·</p>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--line)", padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
        <span>© 2026 · iknkfx inc · All Rights Reserved</span>
        <span>· Not financial advice · Trading involves real risk of loss ·</span>
      </footer>
    </div>
  );
}
