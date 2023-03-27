import type { Reaction } from 'bot/types';
import ReactionHandler from '../ReactionHandler';
import { COOLDOWNS, PROBABILITIES } from '../constants';
import { createMultiWordRegex } from 'util/string/regex';

const regex = createMultiWordRegex(['taco bell', 'taco baco']);

const cmd: Reaction = {
  name: 'taco-baco',
  cooldown: COOLDOWNS.LONG,
  probability: PROBABILITIES.UNCOMMON,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await msg.reply('https://i.kym-cdn.com/photos/images/original/001/269/888/59a.jpg\nTaco Baco?');
  },
};

ReactionHandler.register(cmd);
