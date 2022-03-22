import { Reaction } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { createMultiWordRegex } from 'util/string/regex';
import { reply } from 'util/discord/messages';
import { COOLDOWNS } from 'bot/constants';

const regex = createMultiWordRegex(['owo', '0w0']);

const cmd: Reaction = {
  name: 'OwO',
  description: 'owo reaction',
  cooldown: COOLDOWNS.GLOBAL_SHORT,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await reply(msg, "OwO What's this?");
  },
};

MessageHandler.registerReaction(cmd);
