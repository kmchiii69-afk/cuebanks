"use client";

import Link from "next/link";
import { useState, useRef, useEffect, FormEvent } from "react";
import Globe from "@/components/ui/globe";

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

  const canSend = input.trim().length > 0 && !streaming;

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: 92, right: 24, width: 370, height: 530, zIndex: 999,
          display: "flex", flexDirection: "column",
          background: "rgba(10,14,22,0.92)", backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          boxShadow: "0 0 0 1px rgba(249,255,60,0.08), 0 32px 100px rgba(0,0,0,0.85)",
          overflow: "hidden",
        }}>
          {/* Acid top rule */}
          <div style={{ height: 2, background: "linear-gradient(90deg, var(--acid) 0%, rgba(249,255,60,0.3) 100%)", flexShrink: 0 }} />

          {/* Header */}
          <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--acid)", boxShadow: "0 0 16px rgba(249,255,60,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 13, color: "var(--bg)" }}>C</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "var(--bone)", letterSpacing: "0.14em" }}>CUE AI</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <span className="pulse" style={{ width: 4, height: 4, background: "#22c55e", borderRadius: "50%", display: "inline-block" }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "#22c55e" }}>Online · 200+ Q&As</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 2px", transition: "color 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--bone)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 18 }}>
            {messages.length === 0 ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ash)", lineHeight: 1.65, margin: "0 0 6px", textAlign: "center" }}>
                  Ask Cue anything — confluence, risk, entries, mindset. Trained on every WSA session.
                </p>
                {["What is the stack?", "How do I draw a fib?", "Walk me through H4 → M5"].map(q => (
                  <button key={q} onClick={() => send(q)}
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 100, padding: "8px 14px", color: "var(--ash)", fontFamily: "var(--font-body)", fontSize: 12, textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 7, transition: "background 0.15s, border-color 0.15s, color 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(249,255,60,0.07)"; e.currentTarget.style.borderColor = "rgba(249,255,60,0.3)"; e.currentTarget.style.color = "var(--bone)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "var(--ash)"; }}>
                    <span style={{ color: "var(--acid)", fontSize: 9 }}>▸</span>{q}
                  </button>
                ))}
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 1, background: m.role === "assistant" ? "var(--acid)" : "rgba(255,255,255,0.06)", border: m.role === "user" ? "1px solid rgba(255,255,255,0.1)" : "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: m.role === "assistant" ? "0 0 10px rgba(249,255,60,0.2)" : "none" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 800, color: m.role === "assistant" ? "var(--bg)" : "var(--muted)" }}>{m.role === "assistant" ? "C" : "Y"}</span>
                  </div>
                  <div style={{ flex: 1, fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.65, color: m.role === "assistant" ? "var(--bone)" : "var(--ash)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {m.content}
                    {m.role === "assistant" && streaming && i === messages.length - 1 && m.content === "" && (
                      <span style={{ display: "inline-flex", gap: 3, verticalAlign: "middle", marginLeft: 2 }}>
                        {[0, 1, 2].map(d => <span key={d} className="pulse" style={{ width: 4, height: 4, background: "var(--acid)", borderRadius: "50%", display: "inline-block", animationDelay: `${d * 0.18}s` }} />)}
                      </span>
                    )}
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
          <div style={{ padding: "10px 14px 14px", flexShrink: 0 }}>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, overflow: "hidden" }}>
              <form onSubmit={(e: FormEvent) => { e.preventDefault(); send(input); }} style={{ display: "flex", alignItems: "center" }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={streaming}
                  placeholder="Ask Cue..."
                  style={{ flex: 1, background: "transparent", border: "none", padding: "11px 14px", color: "var(--bone)", fontFamily: "var(--font-body)", fontSize: 13, outline: "none" }}
                />
                <button type="submit" disabled={!canSend}
                  style={{ margin: "6px 8px 6px 0", background: canSend ? "var(--acid)" : "rgba(255,255,255,0.05)", border: "none", borderRadius: 8, width: 34, height: 34, cursor: canSend ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" }}>
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M7 1l6 6-6 6" stroke={canSend ? "var(--bg)" : "var(--muted)"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toggle FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: 24, right: 24, width: 56, height: 56, borderRadius: "50%",
          background: open ? "rgba(255,255,255,0.06)" : "var(--acid)",
          border: open ? "1px solid rgba(255,255,255,0.12)" : "none",
          cursor: "pointer", zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: open ? "none" : "0 0 0 1px var(--acid), 0 8px 32px rgba(249,255,60,0.4)",
          transition: "background 0.2s, box-shadow 0.2s",
        }}
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
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

// ─── Module Item ──────────────────────────────────────────────────────────────
function ModuleItem({ item, index, isLast, onPlay }: { item: PhaseItem; index: number; isLast: boolean; onPlay: (v: Video) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "flex-start", gap: 20,
        padding: "26px 0",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.06)",
        transition: "background 0.15s",
        borderRadius: 6,
        marginLeft: -12, marginRight: -12, paddingLeft: 12, paddingRight: 12,
        background: hovered ? "rgba(255,255,255,0.025)" : "transparent",
        cursor: "default",
      }}
    >
      <div style={{
        flexShrink: 0, width: 30, height: 30, borderRadius: "50%",
        border: hovered ? "1px solid rgba(249,255,60,0.35)" : "1px solid rgba(255,255,255,0.1)",
        background: hovered ? "rgba(249,255,60,0.06)" : "rgba(255,255,255,0.03)",
        display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2,
        transition: "border-color 0.15s, background 0.15s",
      }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: hovered ? "rgba(249,255,60,0.7)" : "rgba(255,255,255,0.3)" }}>{index + 1}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17, color: hovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.9)", letterSpacing: "-0.02em", transition: "color 0.15s" }}>{item.label}</span>
          {item.tag && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "var(--bg)", background: "var(--acid)", padding: "3px 8px", borderRadius: 3 }}>{item.tag}</span>
          )}
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.5)", marginBottom: item.videos?.length ? 14 : 0 }}>{item.note}</div>
        {item.videos && item.videos.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {item.videos.map(v => <PlayBtn key={v.id} video={v} onPlay={onPlay} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// Globe position per section (hero + 6 phases)
const GLOBE_POS = [
  { left: 78, top: 30, scale: 2.8, opacity: 0.32 }, // hero
  { left: 88, top: 52, scale: 2.0, opacity: 0.28 }, // phase 01
  { left: 16, top: 50, scale: 2.2, opacity: 0.26 }, // phase 02
  { left: 76, top: 22, scale: 1.8, opacity: 0.25 }, // phase 03
  { left: 72, top: 44, scale: 2.6, opacity: 0.30 }, // phase 04
  { left: 15, top: 42, scale: 2.0, opacity: 0.26 }, // phase 05
  { left: 82, top: 28, scale: 3.0, opacity: 0.28 }, // phase 06
];

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function RoadmapPage() {
  const [activeVideo, setActiveVideo] = useState<ModalVideo | null>(null);
  const [globeTransform, setGlobeTransform] = useState(
    `translate3d(78vw, 30vh, 0) translate3d(-50%, -50%, 0) scale3d(2.8, 2.8, 1)`
  );
  const [globeOpacity, setGlobeOpacity] = useState(0.32);
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroRef = useRef<HTMLElement>(null);

  const totalVideos = PHASES.reduce((acc, p) => acc + p.items.reduce((a, i) => a + (i.videos?.length ?? 0), 0), 0);

  // Parallax globe — snap to nearest section
  useEffect(() => {
    function handleScroll() {
      const refs: (Element | null)[] = [
        heroRef.current,
        ...Array.from({ length: PHASES.length }, (_, i) => phaseRefs.current[i] ?? null),
      ];
      const midpoint = window.innerHeight / 2;
      let closest = 0;
      let minDist = Infinity;
      refs.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - midpoint);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      const p = GLOBE_POS[closest] ?? GLOBE_POS[0];
      setGlobeTransform(
        `translate3d(${p.left}vw, ${p.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${p.scale}, ${p.scale}, 1)`
      );
      setGlobeOpacity(p.opacity);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function jumpTo(i: number) {
    phaseRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "var(--bone)", position: "relative" }}>

      {/* ── Space atmosphere ─────────────────────────────────────────────────── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 100% 70% at 65% 28%, rgba(6,10,20,1) 0%, rgba(0,0,0,1) 65%)" }} />

      {/* ── Parallax Globe ───────────────────────────────────────────────────── */}
      <div style={{
        position: "fixed", top: 0, left: 0,
        zIndex: 0, pointerEvents: "none",
        opacity: globeOpacity,
        willChange: "transform, opacity",
        transform: globeTransform,
        transition: "transform 1400ms cubic-bezier(0.23, 1, 0.32, 1), opacity 700ms ease",
      }}>
        <Globe size={250} />
      </div>

      {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
      <CueChat />

      {/* HEADER */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "18px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(20px)", zIndex: 100 }}>
        <Link href="/ig" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/wsa/home/1.png" alt="Wall Street Academy" style={{ height: 44, width: 44, borderRadius: "50%", objectFit: "cover" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "var(--bone)", letterSpacing: "0.18em", textTransform: "uppercase" }}>Wall Street Academy</span>
        </Link>
        {/* Phase jump nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {PHASES.map((p, i) => (
            <button key={i} onClick={() => jumpTo(i)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", padding: "4px 8px", cursor: "pointer", transition: "color 0.15s, border-color 0.15s", borderRadius: 3 }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--acid)"; e.currentTarget.style.borderColor = "rgba(249,255,60,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
              {p.num}
            </button>
          ))}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
          · Inner Circle · Roadmap ·
        </div>
      </header>

      {/* HERO */}
      <section ref={heroRef} style={{ maxWidth: 860, margin: "0 auto", padding: "96px 48px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "6px 18px" }}>
            <span className="pulse" style={{ width: 5, height: 5, background: "var(--acid)", borderRadius: "50%", display: "inline-block" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.22em", textTransform: "uppercase" }}>Inner Circle Member Access</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(48px, 7.5vw, 88px)", lineHeight: 0.92, letterSpacing: "-0.045em", color: "var(--bone)", margin: "0 0 24px" }}>
            The Inner Circle<br />
            <em style={{ color: "var(--acid)", fontStyle: "normal" }}>Roadmap.</em>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 18, lineHeight: 1.65, color: "rgba(255,255,255,0.45)", margin: "0 auto 36px", maxWidth: 500, letterSpacing: "0.01em" }}>
            Every module. Every drill. Every live session — in the exact order that builds a profitable trader.
          </p>
          {/* Stats row */}
          <div style={{ display: "inline-flex", gap: 0, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: 80, borderRadius: 12 }}>
            {[
              { n: "6", label: "Phases" },
              { n: "16", label: "Weeks" },
              { n: String(totalVideos) + "+", label: "Videos" },
              { n: `${CNC.length + CUECASTS.length}`, label: "Live Sessions" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "18px 28px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none", textAlign: "center", background: "rgba(255,255,255,0.03)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32, letterSpacing: "-0.04em", color: "var(--acid)", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHASES */}
      <section style={{ maxWidth: 920, margin: "0 auto", padding: "0 48px 100px", position: "relative", zIndex: 1 }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 28, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, rgba(249,255,60,0.5) 0%, rgba(249,255,60,0.04) 100%)", pointerEvents: "none" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {PHASES.map((phase, i) => {
              const videoCount = phase.items.reduce((a, item) => a + (item.videos?.length ?? 0), 0);
              return (
                <div key={i} ref={el => { phaseRefs.current[i] = el; }} style={{ display: "flex", gap: 32, position: "relative", scrollMarginTop: 80 }}>
                  {/* Dot */}
                  <div style={{ flexShrink: 0, width: 56, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 32, position: "relative", zIndex: 1 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#000", border: "1.5px solid rgba(249,255,60,0.6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(249,255,60,0.12), 0 0 60px rgba(249,255,60,0.05)" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.04em" }}>{phase.num}</span>
                    </div>
                  </div>

                  {/* Card */}
                  <div style={{ flex: 1, background: "rgba(12,16,24,0.7)", border: "1px solid rgba(255,255,255,0.07)", borderTop: "1px solid rgba(249,255,60,0.3)", overflow: "hidden", backdropFilter: "blur(8px)", boxShadow: "0 0 0 0 transparent, 0 8px 40px rgba(0,0,0,0.5)" }}>
                    {/* Card header */}
                    <div style={{ padding: "36px 40px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.2em", textTransform: "uppercase", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "5px 12px" }}>{phase.duration}</div>
                        {videoCount > 0 && (
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.14em", textTransform: "uppercase", background: "rgba(249,255,60,0.07)", border: "1px solid rgba(249,255,60,0.2)", borderRadius: 4, padding: "5px 12px" }}>
                            ▶ {videoCount} videos
                          </div>
                        )}
                      </div>
                      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(26px, 3vw, 34px)", letterSpacing: "-0.03em", color: "var(--bone)", margin: "0 0 14px" }}>{phase.title}</h2>
                      <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 16, lineHeight: 1.75, color: "rgba(255,255,255,0.48)", margin: 0, maxWidth: 620 }}>{phase.tagline}</p>
                    </div>

                    {/* Items */}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "8px 40px" }}>
                      {phase.items.map((item, j) => (
                        <ModuleItem key={j} item={item} index={j} isLast={j === phase.items.length - 1} onPlay={setActiveVideo} />
                      ))}
                    </div>

                    {/* Checkpoint */}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(249,255,60,0.03)", padding: "20px 40px", display: "flex", alignItems: "flex-start", gap: 16 }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "rgba(249,255,60,0.45)", letterSpacing: "0.22em", textTransform: "uppercase", flexShrink: 0, paddingTop: 3, whiteSpace: "nowrap" }}>· After ·</div>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 14, lineHeight: 1.7, color: "rgba(249,255,60,0.65)" }}>{phase.checkpoint}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INCLUDED */}
      <section style={{ maxWidth: 920, margin: "0 auto", padding: "0 48px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 48 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.2)", letterSpacing: "0.26em", textTransform: "uppercase", textAlign: "center", marginBottom: 28 }}>· What&apos;s included ·</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
            {[
              { label: `${totalVideos}+ Videos`, desc: "Every module, webinar, and live session — all on demand." },
              { label: `${CNC.length} Chart N Chill`, desc: "Every Chart N Chill on record. The answer is probably already in here." },
              { label: `${CUECASTS.length} CueCAST Sessions`, desc: "Cue's live market analysis — real time, real charts." },
              { label: "Monthly Group Q&A", desc: "4 live calls with Cue across the 4 months. Bring your charts." },
              { label: "Structured Drills", desc: "Practice between phases is required. This is a training program, not a library." },
              { label: "Cue AI — On Demand", desc: "Ask Cue anything, anytime. Trained on WSA content, answers in his voice." },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", padding: "20px 22px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 14, color: "rgba(255,255,255,0.85)", marginBottom: 6, letterSpacing: "-0.01em" }}>{s.label}</div>
                <div style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 12.5, lineHeight: 1.55, color: "rgba(255,255,255,0.32)" }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.18)", letterSpacing: "0.22em", textTransform: "uppercase", position: "relative", zIndex: 1 }}>
        <span>© 2026 · iknkfx inc · All Rights Reserved</span>
        <span>· Not financial advice · Trading involves real risk of loss ·</span>
      </footer>
    </div>
  );
}
