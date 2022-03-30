import { Reaction } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { createMultiWordRegex } from 'util/string/regex';
import { reply } from 'util/discord/messages';
import { COOLDOWNS, PROBABILITIES } from 'bot/constants';

const regex = createMultiWordRegex(['owo', '0w0']);

const cmd: Reaction = {
  name: 'OwO',
  description: 'owo reaction',
  cooldown: COOLDOWNS.GLOBAL_STANDARD,
  probability: PROBABILITIES.STANDARD,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await reply(msg, "OwO What's this?");
  },
};

MessageHandler.registerReaction(cmd);
