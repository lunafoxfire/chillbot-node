import type { Reaction } from "bot/types";
import ReactionHandler from "../ReactionHandler";
import { COOLDOWNS, PROBABILITIES } from "../constants";
import { createMultiWordRegex } from "util/string/regex";

const regex = createMultiWordRegex(["factorio", "satisfactory"]);

const cmd: Reaction = {
  name: "factory",
  cooldown: COOLDOWNS.LONG,
  probability: PROBABILITIES.UNCOMMON,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await msg.reply("THE FACTORY MUST  E X P A N D");
  },
};

ReactionHandler.register(cmd);
