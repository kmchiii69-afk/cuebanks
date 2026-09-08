export type CueChatMessage = { role: "user" | "assistant"; content: string };

export function minimaxConfig(): { apiKey: string; baseUrl: string; model: string } {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    throw new Error("MINIMAX_API_KEY is not set");
  }
  return {
    apiKey,
    baseUrl: (process.env.MINIMAX_BASE_URL ?? "https://api.minimax.io/anthropic").replace(/\/$/, ""),
    model: process.env.MINIMAX_MODEL ?? "MiniMax-M2.5-highspeed",
  };
}

/** Stream MiniMax (Anthropic-compatible SSE) as plain text chunks. */
export async function* streamMinimaxText(
  system: string,
  messages: CueChatMessage[],
): AsyncGenerator<string, void, unknown> {
  const { apiKey, baseUrl, model } = minimaxConfig();
  const res = await fetch(`${baseUrl}/v1/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system,
      messages,
      stream: true,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`MiniMax ${res.status}: ${err.slice(0, 400)}`);
  }
  if (!res.body) {
    throw new Error("MiniMax returned an empty body");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const json: unknown = JSON.parse(data);
        if (
          typeof json === "object" &&
          json !== null &&
          "type" in json &&
          json.type === "content_block_delta" &&
          "delta" in json &&
          typeof json.delta === "object" &&
          json.delta !== null &&
          "type" in json.delta &&
          json.delta.type === "text_delta" &&
          "text" in json.delta &&
          typeof json.delta.text === "string"
        ) {
          yield json.delta.text;
        }
      } catch {
        // skip malformed SSE lines
      }
    }
  }
}
