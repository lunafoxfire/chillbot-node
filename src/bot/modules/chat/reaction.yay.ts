import { Reaction } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { reply } from 'util/discord/messages';
import { COOLDOWNS, PROBABILITIES } from 'bot/constants';

const regex = /(?:^|\\W)(ya+y!+)(?:$|\\W)/i;

const cmd: Reaction = {
  name: 'yay',
  description: 'Reaction to someone saying yay',
  cooldown: COOLDOWNS.GLOBAL_STANDARD,
  probability: PROBABILITIES.STANDARD,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await reply(msg, 'https://cdn.discordapp.com/attachments/958649870443503646/958649902936768552/dancin.gif\nYay!');
  },
};

MessageHandler.registerReaction(cmd);
