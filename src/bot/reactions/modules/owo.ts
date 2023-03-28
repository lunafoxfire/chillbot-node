import type { Reaction } from "bot/types";
import ReactionHandler from "../ReactionHandler";
import { COOLDOWNS, PROBABILITIES } from "../constants";
import { createMultiWordRegex } from "util/string/regex";

const owoRegex = createMultiWordRegex(["owo", "0w0"]);
const uwuRegex = createMultiWordRegex(["uwu", "nwn", "u_u", "n_n", "u-u", "n-n"]);
const whatsThisRegex = createMultiWordRegex(["what's this", "whats this", "what is this"]);
const whatsThatRegex = createMultiWordRegex(["what's that", "whats that", "what is that"]);

const owoCmd: Reaction = {
  name: "owo",
  cooldown: COOLDOWNS.LONG,
  probability: PROBABILITIES.ALWAYS,
  test: (msg) => owoRegex.test(msg.content),
  execute: async (msg) => {
    await msg.reply("OwO what's this?");
  },
};

const uwuCmd: Reaction = {
  name: "uwu",
  cooldown: COOLDOWNS.LONG,
  probability: PROBABILITIES.ALWAYS,
  test: (msg) => uwuRegex.test(msg.content),
  execute: async (msg) => {
    await msg.reply("UwU");
  },
};

const whatsThisCmd: Reaction = {
  name: "whats-this",
  cooldown: COOLDOWNS.LONG,
  probability: PROBABILITIES.ALWAYS,
  test: (msg) => whatsThisRegex.test(msg.content),
  execute: async (msg) => {
    await msg.reply("OwO what's this?");
  },
};

const whatsThatCmd: Reaction = {
  name: "whats-that",
  cooldown: COOLDOWNS.LONG,
  probability: PROBABILITIES.ALWAYS,
  test: (msg) => whatsThatRegex.test(msg.content),
  execute: async (msg) => {
    await msg.reply("OwO what's that?");
  },
};

ReactionHandler.register(owoCmd);
ReactionHandler.register(uwuCmd);
ReactionHandler.register(whatsThisCmd);
ReactionHandler.register(whatsThatCmd);
