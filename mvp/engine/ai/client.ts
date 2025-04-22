import OpenAI from "@openai";
import type { ChatCompletionMessage } from "https://deno.land/x/openai@v4.69.0/resources/mod.ts";

const baseURL = "https://hubai.loe.gg/v1";
const apiKey = Deno.env.get("AI_TOKEN");

export type History = { req: string; res: string };

const ai = new OpenAI({
  apiKey,
  baseURL,
});

type LLMRequestProps = { system: string; user: string; history: History[] };

/**
 * 
 * @param system  - llm system prompt  
 * @param user    - user last request  
 * @param history - user/assistant requests history (method call mutate history itself)
 * @returns llm response as text
 */
export const llmRequest = async ({ system, user, history }: LLMRequestProps) => {
  const completion = await ai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content: system,
      },
      ...history.map(
        (item) => [{ role: "user", content: item.req }, {
          role: "assistant",
          content: item.res,
        }],
      ).flat() as ChatCompletionMessage[],
      { role: "user", content: user },
    ],
  });

  const response = completion.choices[0].message.content ?? undefined

  history.push({ req: user, res: response ?? 'Error' })

  return response
};
