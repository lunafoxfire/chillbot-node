import type { Reaction } from "bot/types";
import ReactionHandler from "../ReactionHandler";
import { COOLDOWNS, PROBABILITIES } from "../constants";
import { createMultiWordRegex } from "util/string/regex";

const regex = createMultiWordRegex(["owo", "0w0"]);

const cmd: Reaction = {
  name: "owo",
  cooldown: COOLDOWNS.LONG,
  probability: PROBABILITIES.ALWAYS,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await msg.reply("OwO What's this?");
  },
};

ReactionHandler.register(cmd);
