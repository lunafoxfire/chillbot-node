import { Reaction, DEFAULT_COOLDOWN } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { createMultiWordRegex } from 'util/string/regex';

const regex = createMultiWordRegex(['factorio', 'satisfactory']);

const cmd: Reaction = {
  name: 'factory-mention',
  description: 'Reacts to mentioning factory games',
  cooldown: DEFAULT_COOLDOWN,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await msg.reply('THE FACTORY MUST  E X P A N D');
  },
};

MessageHandler.registerReaction(cmd);
