import { Context } from "@grammy";

interface BotConfig {
}

export type BotContext = Context & {
  config: BotConfig;
};
