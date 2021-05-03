import Bot from 'bot';
import { Reaction } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';

const cmd: Reaction = {
  name: 'bot-mention',
  description: 'Reacts to mentioning the bot',
  test: (msg) => !!Bot.client.user && msg.mentions.has(Bot.client.user),
  execute: async (msg) => {
    await msg.reply('... nani?');
  },
};

MessageHandler.registerReaction(cmd);
