import Bot from 'bot';
import { Reaction } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { reply } from 'util/discord/messages';
import { COOLDOWNS } from 'bot/constants';

const cmd: Reaction = {
  name: 'bot-mention',
  description: 'Reacts to mentioning the bot',
  cooldown: COOLDOWNS.GLOBAL_EXTRA_SHORT,
  test: (msg) => !!Bot.client.user && msg.mentions.has(Bot.client.user) && !msg.mentions.everyone,
  execute: async (msg) => {
    await reply(msg, '... nani?');
  },
};

MessageHandler.registerReaction(cmd);
