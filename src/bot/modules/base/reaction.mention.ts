import Bot from 'bot';
import { Reaction } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { reply } from 'util/discord/messages';
import { COOLDOWNS, PROBABILITIES } from 'bot/constants';

const cmd: Reaction = {
  name: 'bot-mention',
  description: 'Reacts to mentioning the bot',
  cooldown: COOLDOWNS.GLOBAL_SHORT,
  probability: PROBABILITIES.ALWAYS,
  test: (msg) => !!Bot.client.user && msg.mentions.has(Bot.client.user) && !msg.mentions.everyone,
  execute: async (msg) => {
    await reply(msg, '... nani?');
  },
};

MessageHandler.registerReaction(cmd);
