import type { Reaction } from "bot/types";
import ReactionHandler from "../ReactionHandler";
import { COOLDOWNS, PROBABILITIES } from "../constants";
import Bot from "bot";
import { generateGPT3Completion } from "services/gpt-3";

const TIME_LIMIT = 1000 * 60 * 60;

const cmd: Reaction = {
  name: "bot-mention",
  cooldown: COOLDOWNS.NONE,
  probability: PROBABILITIES.ALWAYS,
  test: (msg) => msg.mentions.has(Bot.client.user!) && !msg.mentions.everyone,
  execute: async (msg) => {
    const t = new Date().getTime();
    const context = (await msg.channel.messages
      .fetch({
        limit: 50,
        before: msg.id,
      }) as any)
      .filter((m: any) => t - m.createdTimestamp <= TIME_LIMIT)
      .sort((a: any, b: any) => a.createdTimestamp - b.createdTimestamp);
    const contextArr = context.toJSON();
    contextArr.push(msg);

    const response = await generateGPT3Completion(contextArr);
    if (response) {
      await msg.reply(response);
    }
  },
};

ReactionHandler.register(cmd);
