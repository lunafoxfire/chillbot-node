import { Reaction, DEFAULT_COOLDOWN } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { createMultiWordRegex } from 'util/string/regex';

const regex = createMultiWordRegex(['what\'s this', 'whats this']);

const cmd: Reaction = {
  name: 'whats-this',
  description: 'Does the owo',
  cooldown: DEFAULT_COOLDOWN,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await msg.reply("OwO what's this? _nuzzles_");
  },
};

MessageHandler.registerReaction(cmd);
