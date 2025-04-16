import type { BotContext } from "./context.ts";

import { Middleware } from "@grammy";

export const middleware: Middleware<BotContext> = async (ctx, next) => {
  ctx.config = {};

  await next();
};
