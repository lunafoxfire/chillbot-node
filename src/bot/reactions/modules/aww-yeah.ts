import type { Reaction } from 'bot/types';
import ReactionHandler from '../ReactionHandler';
import { COOLDOWNS, PROBABILITIES } from '../constants';

const regex = /(?:^|\\W)(aw+ yea+h*!*)(?:$|\\W)/i;

const cmd: Reaction = {
  name: 'aww-yeah',
  cooldown: COOLDOWNS.LONG,
  probability: PROBABILITIES.ALWAYS,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await msg.reply('https://cdn.discordapp.com/attachments/958649870443503646/958649935782379520/awwyeah.jpg');
  },
};

ReactionHandler.register(cmd);
