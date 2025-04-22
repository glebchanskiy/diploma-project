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

  if (meta.paths.length) {
    const paths = meta.paths.map(p => p.map(k => k.name).join(' -> ')).join('\n')
    ctx.reply(paths)
  }
  

});

export default bot;
