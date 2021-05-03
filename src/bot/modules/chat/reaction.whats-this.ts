import { Reaction } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { createMultiWordRegex } from 'util/string/regex';

const regex = createMultiWordRegex(['what\'s this', 'whats this']);

const cmd: Reaction = {
  name: 'whats-this',
  description: 'Does the owo',
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await msg.reply("OwO what's this? _nuzzles_");
  },
};

MessageHandler.registerReaction(cmd);
