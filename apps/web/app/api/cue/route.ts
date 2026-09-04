import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getMember, saveChatAnalytic } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { CUE_SYSTEM_PROMPT, getInstructionAppendix } from "@/lib/cue-prompt";
import { CUE_MODEL, createCueClient } from "@/lib/cue-llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Message = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const authUser = await getAuthUser();
  if (!authUser) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  // 20 messages per user per hour to protect LLM spend
  if (!rateLimit(`cue:${authUser.email}`, 20, 60 * 60 * 1000)) {
    return new Response(JSON.stringify({ error: "You've hit the hourly limit (20 messages). Come back in an hour." }), { status: 429 });
  }

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

  const lastUserMsg = [...cleaned].reverse().find(m => m.role === "user");

  const instructionAppendix = await getInstructionAppendix().catch(() => "");
  const systemPrompt = CUE_SYSTEM_PROMPT + instructionAppendix;

  let client;
  try {
    client = createCueClient();
  } catch (err) {
    console.error("[cue] LLM config error:", err);
    return new Response(JSON.stringify({ error: "Cue AI is not configured" }), { status: 503 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      let fullAnswer = "";
      try {
        const s = client.messages.stream({
          model: CUE_MODEL,
          max_tokens: 1024,
          system: systemPrompt,
          messages: cleaned,
        });
        for await (const event of s) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            fullAnswer += event.delta.text;
            controller.enqueue(enc.encode(event.delta.text));
          }
        }
        controller.close();
        // Save question + full answer after stream completes
        if (lastUserMsg) {
          getMember(authUser.email).then(member => {
            saveChatAnalytic(authUser.email, member?.plan ?? "5k", lastUserMsg.content, fullAnswer).catch(() => {});
          }).catch(() => {});
        }
      } catch (err) {
        console.error("[cue] stream error:", err);
        controller.enqueue(enc.encode(`\n\nSorry — Cue hit a snag processing that. Try asking again in a moment.`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Transfer-Encoding": "chunked" },
  });
}
