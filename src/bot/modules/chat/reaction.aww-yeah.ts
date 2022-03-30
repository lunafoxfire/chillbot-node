import { Reaction } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { reply } from 'util/discord/messages';
import { COOLDOWNS, PROBABILITIES } from 'bot/constants';

const regex = /(?:^|\\W)(aw+ yea+h*!*)(?:$|\\W)/i;

const cmd: Reaction = {
  name: 'aw-yeah',
  description: 'Reaction to someone saying awww yeah',
  cooldown: COOLDOWNS.GLOBAL_STANDARD,
  probability: PROBABILITIES.STANDARD,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await reply(msg, 'https://cdn.discordapp.com/attachments/958649870443503646/958649935782379520/awwyeah.jpg');
  },
};

MessageHandler.registerReaction(cmd);
