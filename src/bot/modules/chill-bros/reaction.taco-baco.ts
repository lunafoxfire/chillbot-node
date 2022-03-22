import { Reaction } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { createMultiWordRegex } from 'util/string/regex';
import { reply } from 'util/discord/messages';
import { COOLDOWNS } from 'bot/constants';

const regex = createMultiWordRegex(['taco bell', 'taco baco']);

const cmd: Reaction = {
  name: 'taco-baco',
  description: 'Reaction to mentioning taco bell',
  cooldown: COOLDOWNS.GLOBAL_LONG,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await reply(msg, 'https://i.kym-cdn.com/photos/images/original/001/269/888/59a.jpg\nTaco Baco?');
  },
};

MessageHandler.registerReaction(cmd);
