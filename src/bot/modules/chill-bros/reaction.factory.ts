import { Reaction } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { createMultiWordRegex } from 'util/string/regex';
import { reply } from 'util/discord/messages';
import { COOLDOWNS, PROBABILITIES } from 'bot/constants';

const regex = createMultiWordRegex(['factorio', 'satisfactory']);

const cmd: Reaction = {
  name: 'factory-mention',
  description: 'Reacts to mentioning factory games',
  cooldown: COOLDOWNS.GLOBAL_STANDARD,
  probability: PROBABILITIES.STANDARD,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await reply(msg, 'THE FACTORY MUST  E X P A N D');
  },
};

MessageHandler.registerReaction(cmd);
