import Bot from 'bot';
import { Reaction } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { reply } from 'util/discord/messages';
import { PROBABILITIES } from 'bot/constants';
import { generateGPT3Completion } from 'services/gpt-3';

const TIME_LIMIT = 1000 * 60 * 60;

const cmd: Reaction = {
  name: 'bot-mention',
  description: 'Reacts to mentioning the bot',
  probability: PROBABILITIES.ALWAYS,
  test: (msg) => !!Bot.client.user && msg.mentions.has(Bot.client.user) && !msg.mentions.everyone,
  execute: async (msg) => {
    const t = new Date().getTime();
    const context = (await msg.channel.messages
      .fetch({
        limit: 50,
        before: msg.id,
      }))
      .filter((m) => t - m.createdTimestamp <= TIME_LIMIT)
      .sort((a, b) => a.createdTimestamp - b.createdTimestamp);
    const contextArr = context.toJSON();
    contextArr.push(msg);

    const response = await generateGPT3Completion(contextArr);
    if (response) {
      await reply(msg, response);
    }
  },
};

MessageHandler.registerReaction(cmd);
