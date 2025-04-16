import { Bot } from "@grammy";
import { BotContext } from "./context.ts";
import { middleware } from "./middleware.ts";
import { Core } from "@nlse/core";
import { neoSearchById } from "../engine/neo4j/client.ts";

const bot = new Bot<BotContext>(Deno.env.get("BOT_TOKEN") || "");

const apiKey = Deno.env.get("AI_TOKEN") || "";

const nlse = new Core(apiKey);

bot.use(middleware);

bot.on("message", async (ctx) => {
  if (!ctx.msg.text) return;

  const context = await nlse.createRequest(ctx.msg.text).execute();
  ctx.reply(context.response() ?? "неудачная попытка...");

  await context.execute();

  ctx.reply(context.response() ?? "неудачная попытка...");
  const id = context.id();
  if (id) {
    const data = await neoSearchById(id)
    console.log('id: ', id)
    console.log('data: ', data)
    ctx.reply(
      `Нашёл ноду в базе знаний удовлетворяющую запросу:\n${
        JSON.stringify(data, null, 2)
      }`,
    );
  }
});

export default bot;
