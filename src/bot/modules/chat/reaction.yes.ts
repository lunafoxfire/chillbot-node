import { Reaction } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { reply } from 'util/discord/messages';
import { COOLDOWNS, PROBABILITIES } from 'bot/constants';

const regex = /^(?:(?:yes)|(?:yea+h*))[.!]*$/i;

const cmd: Reaction = {
  name: 'yes',
  description: 'Reaction to someone saying only yes/yeah in a message',
  cooldown: COOLDOWNS.GLOBAL_STANDARD,
  probability: PROBABILITIES.STANDARD,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await reply(msg, 'https://cdn.discordapp.com/attachments/958649870443503646/958649994615873596/yespls.gif');
  },
};

MessageHandler.registerReaction(cmd);
