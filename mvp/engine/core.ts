import { OpenAI } from "@openai";
import { Context } from "./context.ts";

const baseURL = "https://hubai.loe.gg/v1";

export class Core {
  private ai: OpenAI;

  constructor(private apiKey: string) {
    this.ai = new OpenAI({
      apiKey,
      baseURL,
    });
  }

  private async callAi(system: string, user: string) {
    const completion = await this.ai.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: system,
          },
          {role: 'user', content: user }
        ],
      });
    
      return completion.choices[0].message.content ?? undefined;
    
  }

  public createRequest(query: string) {
    return new Context(this.callAi.bind(this), { query });
  }
}
