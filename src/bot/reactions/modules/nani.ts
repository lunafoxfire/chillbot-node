import type { Reaction } from "bot/types";
import ReactionHandler from "../ReactionHandler";
import { COOLDOWNS, PROBABILITIES } from "../constants";
import { createWordRegex } from "util/string/regex";

const regex = createWordRegex("nani");

const cmd: Reaction = {
  name: "nani",
  cooldown: COOLDOWNS.LONG,
  probability: PROBABILITIES.ALWAYS,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await msg.reply("_Teleports behind you_");
  },
};

ReactionHandler.register(cmd);
