import { Reaction, DEFAULT_COOLDOWN } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { createMultiWordRegex } from 'util/string/regex';

const regex = createMultiWordRegex(['taco bell', 'taco baco']);

const cmd: Reaction = {
  name: 'taco-baco',
  description: 'Reaction to mentioning taco bell',
  cooldown: DEFAULT_COOLDOWN,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await msg.reply('https://i.kym-cdn.com/photos/images/original/001/269/888/59a.jpg\nTaco Baco?');
  },
};

MessageHandler.registerReaction(cmd);
