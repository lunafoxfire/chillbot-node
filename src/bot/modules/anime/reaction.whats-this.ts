import { Reaction } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { createMultiWordRegex } from 'util/string/regex';
import { reply } from 'util/discord/messages';
import { COOLDOWNS } from 'bot/constants';

const regex = createMultiWordRegex(['what\'s this', 'whats this']);

const cmd: Reaction = {
  name: 'whats-this',
  description: 'Does the owo',
  cooldown: COOLDOWNS.GLOBAL_SHORT,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await reply(msg, "OwO what's this? _nuzzles_");
  },
};

MessageHandler.registerReaction(cmd);
