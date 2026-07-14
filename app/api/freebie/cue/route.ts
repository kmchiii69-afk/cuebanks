// POST /api/freebie/cue
//
// Public, unauthenticated Cue AI endpoint for the "ask Cue AI 3 questions"
// lead magnet. Gated by wsa_freebie_leads instead of a member session:
// the visitor must have opted in via /api/freebie/optin first, and gets
// exactly 3 questions total (tracked in DB, not just in-memory) before
// they're pointed at /qualify to go further.

import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getFreebieLead, incrementFreebieQuestions, saveFreebieQA } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { CUE_SYSTEM_PROMPT, getInstructionAppendix } from "@/lib/cue-prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FREE_QUESTION_LIMIT = 3;

const EXPERIENCE_LABELS: Record<string, string> = {
  under_1y: "under a year",
  "1_3y": "1–3 years",
  "3_5y": "3–5 years",
  "5y_plus": "5+ years",
};

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const { email, question } = (body as { email?: unknown; question?: unknown }) ?? {};
  if (typeof email !== "string" || !email.trim()) {
    return new Response(JSON.stringify({ error: "Opt in first" }), { status: 401 });
  }
  if (typeof question !== "string" || !question.trim()) {
    return new Response(JSON.stringify({ error: "question required" }), { status: 400 });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Coarse abuse guard on top of the DB-backed lifetime cap below (protects
  // against a burst of requests landing before the increment is read back).
  if (!rateLimit(`freebie-cue:${cleanEmail}`, 5, 60 * 1000)) {
    return new Response(JSON.stringify({ error: "Slow down a bit and try again." }), { status: 429 });
  }

  const lead = await getFreebieLead(cleanEmail);
  if (!lead) {
    return new Response(JSON.stringify({ error: "Opt in first" }), { status: 401 });
  }
  if (lead.questions_asked >= FREE_QUESTION_LIMIT) {
    return new Response(JSON.stringify({
      error: "limit_reached",
      message: "You've used all 3 free questions. Join the Inner Circle for unlimited access to Cue AI.",
    }), { status: 403 });
  }

  const cleanQuestion = question.trim().slice(0, 2000);
  const instructionAppendix = await getInstructionAppendix().catch(() => "");
  const experienceAppendix = lead.experience
    ? `\n\nContext for this reply: this person said they've been trading forex for "${EXPERIENCE_LABELS[lead.experience] || lead.experience}". Tailor your tone and depth to that — more foundational framing for beginners, no-BS advanced framing for veterans who've heard the basics a hundred times. Don't announce that you're doing this, just talk to them at the right level.`
    : "";
  const systemPrompt = CUE_SYSTEM_PROMPT + instructionAppendix + experienceAppendix;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Charge the question against the 3-free limit up front, not after the
  // stream finishes — otherwise a client that disconnects mid-stream (closed
  // tab, flaky network, or someone deliberately aborting) never gets counted
  // and can rack up unlimited free answers.
  await incrementFreebieQuestions(cleanEmail).catch(() => {});

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      let fullAnswer = "";
      try {
        const s = client.messages.stream({
          model: "claude-opus-4-8",
          max_tokens: 1024,
          system: systemPrompt,
          messages: [{ role: "user", content: cleanQuestion }],
        });
        for await (const event of s) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            fullAnswer += event.delta.text;
            controller.enqueue(enc.encode(event.delta.text));
          }
        }
        controller.close();
        saveFreebieQA(cleanEmail, cleanQuestion, fullAnswer).catch(() => {});
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
