import type { History } from "@ai/client.ts";
import { finalAnswer, sysPromptV_0_1 } from "@prompt/prompts.ts";

type SearchParams = {
  query: string;
  knowledge: string;
  history: History[];
  comment?: string;
};

type FinalizeParams = {
  query: string;
  knowledge: string;
  auxiliary?: string;
  comments: string;
};

export const PromptCreator = {
  search({ query, knowledge, comment, history }: SearchParams) {
    return {
      system: sysPromptV_0_1,
      user: `QUERY: ${query}\nKNOWLEDGES:\n${knowledge}\n${
        comment ? "COMMENT: " + comment : ""
      }`,
      history,
    };
  },
  finalize({ query, knowledge, auxiliary, comments }: FinalizeParams) {
    return {
        system: finalAnswer,
        user: `User query: ${query}\nKNOWLEDGE: ${knowledge}\n ADDITIONAL:${auxiliary}\n COMMENT:\n${comments}`,
        history: []
    }
  },
};
