import type { LLMResponse } from "../context.ts";

export const parseLLMJson = (llmResponse?: string) => {
  try {
    if (llmResponse) {
      return JSON.parse(llmResponse) as LLMResponse;
    }
    // deno-lint-ignore no-empty
  } catch {}
};
