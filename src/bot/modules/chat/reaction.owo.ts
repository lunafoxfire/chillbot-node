import { Reaction } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { createMultiWordRegex } from 'util/string/regex';

const regex = createMultiWordRegex(['owo', 'OwO', 'oWo', 'OWO', '0w0', '0W0']);

const cmd: Reaction = {
  name: 'OwO',
  description: 'owo reaction',
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await msg.reply("OwO What's this?");
  },
};

MessageHandler.registerReaction(cmd);
