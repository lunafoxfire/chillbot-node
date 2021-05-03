import { Reaction } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { createWordRegex } from 'util/string/regex';

const regex = createWordRegex('taco bell');

const cmd: Reaction = {
  name: 'taco-baco',
  description: 'Reaction to mentioning taco bell',
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await msg.reply('https://i.kym-cdn.com/photos/images/original/001/269/888/59a.jpg\nTaco Baco?');
  },
};

MessageHandler.registerReaction(cmd);
