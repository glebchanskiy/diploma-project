import { Context } from "./context.ts";

export const ContextFactory = {
  createRequest(query: string, maxDivesCount: number = 10) {
    return new Context({ query, maxDivesCount });
  },
};
