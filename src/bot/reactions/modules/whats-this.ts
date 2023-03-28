import type { Reaction } from "bot/types";
import ReactionHandler from "../ReactionHandler";
import { COOLDOWNS, PROBABILITIES } from "../constants";
import { createMultiWordRegex } from "util/string/regex";

const regex = createMultiWordRegex(["what's this", "whats this"]);

const cmd: Reaction = {
  name: "whats-this",
  cooldown: COOLDOWNS.LONG,
  probability: PROBABILITIES.ALWAYS,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await msg.reply("OwO what's this? _nuzzles_");
  },
};

ReactionHandler.register(cmd);
