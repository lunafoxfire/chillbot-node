import { Reaction, DEFAULT_COOLDOWN } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { createMultiWordRegex } from 'util/string/regex';

const regex = createMultiWordRegex(['owo', 'OwO', 'oWo', 'OWO', '0w0', '0W0']);

const cmd: Reaction = {
  name: 'OwO',
  description: 'owo reaction',
  cooldown: DEFAULT_COOLDOWN,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await msg.reply("OwO What's this?");
  },
};

MessageHandler.registerReaction(cmd);
