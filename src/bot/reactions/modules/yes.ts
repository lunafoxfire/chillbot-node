import type { Reaction } from "bot/types";
import ReactionHandler from "../ReactionHandler";
import { COOLDOWNS, PROBABILITIES } from "../constants";

const regex = /^(?:(?:yes)|(?:yea+h*))[.!]*$/i;

const cmd: Reaction = {
  name: "yes",
  cooldown: COOLDOWNS.LONG,
  probability: PROBABILITIES.UNCOMMON,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await msg.reply("https://cdn.discordapp.com/attachments/958649870443503646/958649994615873596/yespls.gif");
  },
};

ReactionHandler.register(cmd);
