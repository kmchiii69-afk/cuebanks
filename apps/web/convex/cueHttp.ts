import { httpAction } from "./_generated/server";
import type { ActionCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { CUE_SYSTEM_PROMPT } from "./lib/cuePrompt";
import { minimaxConfig, streamMinimaxText, type CueChatMessage } from "./lib/minimax";

const EXPERIENCE_LABELS: Record<string, string> = {
  under_1y: "under a year",
  "1_3y": "1–3 years",
  "3_5y": "3–5 years",
  "5y_plus": "5+ years",
};

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin") ?? "";
  const site = (process.env.SITE_URL ?? "").replace(/\/$/, "");
  const allowed =
    (site.length > 0 && origin === site) ||
    /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
  return {
    "Access-Control-Allow-Origin": allowed ? origin : site || "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-WSA-Bootstrap, X-WSA-Email",
    "Access-Control-Max-Age": "86400",
  };
}

function jsonResponse(
  request: Request,
  status: number,
  body: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(request),
      "Content-Type": "application/json",
    },
  });
}

function parseMessages(raw: unknown): CueChatMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (m): m is { role: string; content: string } =>
        !!m &&
        typeof m === "object" &&
        typeof (m as { role?: unknown }).role === "string" &&
        typeof (m as { content?: unknown }).content === "string",
    )
    .slice(-50)
    .map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content.slice(0, 4000),
    }));
}

async function resolveMemberEmail(
  ctx: ActionCtx,
  request: Request,
): Promise<string | null> {
  const fromAuth = await ctx.runQuery(internal.cue.emailFromAuth, {});
  if (fromAuth) return fromAuth;
  const secret = request.headers.get("X-WSA-Bootstrap") ?? "";
  const expected = process.env.AUTH_BOOTSTRAP_SECRET ?? "";
  const email = (request.headers.get("X-WSA-Email") ?? "").toLowerCase().trim();
  if (expected && secret === expected && email.includes("@")) {
    return email;
  }
  return null;
}

export const cueOptions = httpAction(async (_ctx, request) => {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
});

export const cuePost = httpAction(async (ctx, request) => {
  const email = await resolveMemberEmail(ctx, request);
  if (!email) {
    return jsonResponse(request, 401, { error: "Unauthorized" });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(request, 400, { error: "Invalid JSON" });
  }

  const cleaned = parseMessages((body as { messages?: unknown }).messages);
  if (cleaned.length === 0) {
    return jsonResponse(request, 400, { error: "messages required" });
  }

  const prepared = await ctx.runQuery(internal.cue.prepareMember, {
    email,
    now: Date.now(),
  });
  if (!prepared.ok) {
    return jsonResponse(request, prepared.status, { error: prepared.error });
  }

  try {
    minimaxConfig();
  } catch {
    return jsonResponse(request, 503, { error: "Cue AI is not configured" });
  }

  const lastUserMsg = [...cleaned].reverse().find((m) => m.role === "user");
  let turnId: Id<"chatAnalytics"> | null = null;
  if (lastUserMsg) {
    turnId = await ctx.runMutation(internal.cue.beginTurn, {
      email: prepared.email,
      plan: prepared.plan,
      question: lastUserMsg.content,
    });
  }

  const systemPrompt = CUE_SYSTEM_PROMPT + prepared.appendix;
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let fullAnswer = "";
      try {
        for await (const chunk of streamMinimaxText(systemPrompt, cleaned)) {
          fullAnswer += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
        if (turnId) {
          await ctx.runMutation(internal.cue.finishTurn, {
            id: turnId,
            answer: fullAnswer,
          });
        }
      } catch (err) {
        console.error("[cue] stream error:", err);
        controller.enqueue(
          encoder.encode(
            "\n\nSorry — Cue hit a snag processing that. Try asking again in a moment.",
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders(request),
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
});

export const freebieCuePost = httpAction(async (ctx, request) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(request, 400, { error: "Invalid JSON" });
  }

  const emailRaw = (body as { email?: unknown }).email;
  const questionRaw = (body as { question?: unknown }).question;
  if (typeof emailRaw !== "string" || !emailRaw.trim()) {
    return jsonResponse(request, 401, { error: "Opt in first" });
  }
  if (typeof questionRaw !== "string" || !questionRaw.trim()) {
    return jsonResponse(request, 400, { error: "question required" });
  }

  const cleanEmail = emailRaw.trim().toLowerCase();
  const cleanQuestion = questionRaw.trim().slice(0, 2000);

  const prepared = await ctx.runQuery(internal.cue.prepareFreebie, {
    email: cleanEmail,
  });
  if (!prepared.ok) {
    return jsonResponse(request, prepared.status, {
      error: prepared.error,
      ...(prepared.message ? { message: prepared.message } : {}),
    });
  }

  try {
    minimaxConfig();
  } catch {
    return jsonResponse(request, 503, { error: "Cue AI is not configured" });
  }

  const experienceAppendix = prepared.experience
    ? `\n\nContext for this reply: this person said they've been trading forex for "${EXPERIENCE_LABELS[prepared.experience] || prepared.experience}". Tailor your tone and depth to that — more foundational framing for beginners, no-BS advanced framing for veterans who've heard the basics a hundred times. Don't announce that you're doing this, just talk to them at the right level.`
    : "";
  const systemPrompt = CUE_SYSTEM_PROMPT + prepared.appendix + experienceAppendix;

  await ctx.runMutation(internal.cue.incrementFreebieQuestions, {
    email: prepared.email,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let fullAnswer = "";
      try {
        for await (const chunk of streamMinimaxText(systemPrompt, [
          { role: "user", content: cleanQuestion },
        ])) {
          fullAnswer += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
        await ctx.runMutation(internal.cue.saveFreebieQa, {
          email: prepared.email,
          question: cleanQuestion,
          answer: fullAnswer,
        });
      } catch (err) {
        console.error("[freebie/cue] stream error:", err);
        controller.enqueue(
          encoder.encode(
            "\n\nSorry — Cue hit a snag processing that. Try asking again in a moment.",
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders(request),
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
});
