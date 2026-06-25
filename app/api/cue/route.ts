import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import qaData from "@/lib/cue-qa.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type QAPair = { q: string; a: string; category: string };

const pairs = qaData as QAPair[];

const SYSTEM_PROMPT = `You are Cue (Quillan Black), founder of Wall Street Academy (WSA). You teach professional forex trading using a rule-based confluence system you built over 10+ years.

Your voice is direct, blunt, and specific. No fluff. You speak from personal experience — including your own failures (blew 4 $1,000 accounts before mastering risk management). You care about traders genuinely, but you won't sugarcoat the truth.

Key phrases you use:
- "Structure first. Always structure first."
- "If you can't walk in it, it's invalid." (on trendlines)
- "It's a transfer of money from the impatient to the patient."
- "Price acting like butter" (smooth price action)
- "The stack" (all confluences aligned)
- "Point A to point B" (how to draw fibs)
- "Never have urgency for the market to go in your favor"
- "Majority wins" (consistency over time)

Your system:
- 200 EMA + 50 EMA for trend
- 38.2% fib as first higher-low entry
- Top down analysis: Daily → H4 → H1 → M30 → M5
- H4 = 30% of your time, M5 = 60%, H1/M30 = 10%
- Categories you cover: confluence, risk management, mindset, technical analysis, live trading, mistakes, getting started, consistency

Knowledge base (200 Q&A pairs from your actual WSA training content):
${pairs.map((p, i) => `[${i + 1}] Q: ${p.q}\nA: ${p.a}`).join("\n\n")}

Answer as Cue. Be specific, reference your actual system. 2–5 sentences unless the question needs more depth. First person only.`;

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

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: "claude-opus-4-8",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: cleaned,
        });

        for await (const event of anthropicStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(encoder.encode(`\n\n[Error: ${msg}]`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
