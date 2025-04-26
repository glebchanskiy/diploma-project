import { Bot } from "@grammy";
import { BotContext } from "./context.ts";
import { middleware } from "./middleware.ts";
import { ContextFactory } from "@nlse/core";

const bot = new Bot<BotContext>(Deno.env.get("BOT_TOKEN") || "");

bot.use(middleware);

bot.on("message", async (ctx) => {
  if (!ctx.msg.text) return;

  const context = ContextFactory.createRequest(ctx.msg.text, 4)

  while (!context.isFound()) {
    await context.executeNextSearch()
  }

  const result = await context.result()

  if (result)
    ctx.reply(result)
  else 
    ctx.reply('Хмпф..')

  const meta = context.meta()

  console.log('meta: ', meta)

  if (meta.path.length) {
    ctx.reply(meta.path.map((k, i) => `${'\t'.repeat(i)}${k}`).join(' -> \n'))
  }
  
});

export default bot;
