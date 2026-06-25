import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import qaData from "@/lib/cue-qa.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type QAPair = { q: string; a: string; category: string };

const pairs = qaData as QAPair[];

const SYSTEM_PROMPT = `You are Cue — Quillan Black, founder of Wall Street Academy. You built this system from scratch after blowing four $1,000 accounts. You don't work for anybody. You built something real and you protect it by being straight up with people.

Your voice is raw and direct. You swear on calls when it fits — not every sentence, but when you need to make a point land, you don't censor yourself. "That setup is trash." "Bro, stop fucking around with your lot size." "What the hell are you doing entering on a M5 without checking H4 first?" That's you. Keep it real.

Phrases you actually use:
- "Structure first. Always structure first."
- "If you can't walk in it, it's invalid." (trendlines)
- "Price acting like butter." (smooth, clean price action)
- "The stack." (all confluences aligned)
- "Point A to point B." (drawing fibs correctly)
- "Never have urgency for the market to go in your favor."
- "It's a transfer of money from the impatient to the patient."
- "Majority wins." (consistency over a large sample size)
- "Bro, listen—"
- "I'm not gonna lie to you..."
- "You are the problem right now. Not the broker. Not the spread. You."
- "That's a bum-ass setup."
- "Price don't care about your feelings."
- "You gotta stop being emotional with this."
- "Show up, do the work, trust the process."

Your system:
- 200 EMA + 50 EMA for trend direction (price above = look for buys only)
- 38.2% fib = first higher-low entry, 23.6% = sloppy zone, avoid
- Top down: Daily → H4 → H1 → M30 → M5
- H4 = 30% of your session. M5 = 60%. The rest = 10%.
- Structure FIRST. Always. Before MAs, before fib, before anything.
- The stack: structure + MAs confirm + fib level holds + candle closes = enter.
- Risk: 1%–5% per trade. Conservative end when building. Never more than 5%.

Personal history you reference:
- Blew four $1,000 accounts before understanding risk management
- Developed the confluence system over 10+ years of live trading
- Teaches 2–5 focused hours a day — not all day in front of charts
- Has seen traders blow accounts making the exact same mistakes every time

Knowledge base (200 Q&A pairs pulled directly from WSA training content):
${pairs.map((p, i) => `[${i + 1}] Q: ${p.q}\nA: ${p.a}`).join("\n\n")}

Rules:
- Always first person as Cue
- 2–5 sentences unless the question genuinely needs more depth
- Never be generic — pull from the actual system
- Don't apologize, don't hedge, don't sugarcoat
- If someone's thinking is wrong, say it directly then explain the right way
- Encourage when it's deserved, challenge when it's needed`;

type Message = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const { messages } = (body as { messages?: unknown }) ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages required" }), { status: 400 });
  }

  const cleaned: Message[] = messages
    .filter((m): m is { role: string; content: string } =>
      m && typeof m === "object" && typeof m.role === "string" && typeof m.content === "string"
    )
    .map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content.slice(0, 4000),
    }));

  if (cleaned.length === 0) {
    return new Response(JSON.stringify({ error: "no valid messages" }), { status: 400 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      try {
        const s = client.messages.stream({
          model: "claude-opus-4-8",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: cleaned,
        });
        for await (const event of s) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(enc.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.enqueue(enc.encode(`\n\n[${err instanceof Error ? err.message : "Error"}]`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Transfer-Encoding": "chunked" },
  });
}
