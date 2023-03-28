import type { Reaction } from "bot/types";
import ReactionHandler from "../ReactionHandler";
import { COOLDOWNS, PROBABILITIES } from "../constants";

const regex = /(?:^|\\W)(ya+y!*)(?:$|\\W)/i;

const cmd: Reaction = {
  name: "yay",
  cooldown: COOLDOWNS.LONG,
  probability: PROBABILITIES.UNCOMMON,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await msg.reply("https://cdn.discordapp.com/attachments/958649870443503646/958649902936768552/dancin.gif\nYay!");
  },
};

ReactionHandler.register(cmd);
