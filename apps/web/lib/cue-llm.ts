import Anthropic from "@anthropic-ai/sdk";

/**
 * MiniMax via Anthropic-compatible Messages API.
 * Docs: https://platform.minimax.io/docs (base https://api.minimax.io/anthropic)
 *
 * Env:
 *   MINIMAX_API_KEY   (required)
 *   MINIMAX_BASE_URL  (optional, default international Anthropic-compatible host)
 *   MINIMAX_MODEL     (optional, default MiniMax-M2.5-highspeed for chat latency)
 */
export function createCueClient(): Anthropic {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    throw new Error("MINIMAX_API_KEY is not set");
  }
  return new Anthropic({
    apiKey,
    baseURL: process.env.MINIMAX_BASE_URL ?? "https://api.minimax.io/anthropic",
  });
}

/** Fast chat default; override with MINIMAX_MODEL=MiniMax-M3 for max quality. */
export const CUE_MODEL = process.env.MINIMAX_MODEL ?? "MiniMax-M2.5-highspeed";
