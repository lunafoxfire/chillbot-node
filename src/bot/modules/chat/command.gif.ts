import { ArgumentType, Command } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { getRandomImageURL } from 'services/tenor';
import { BotError } from 'util/errors';
import { reply } from 'util/discord/messages';

const cmd: Command<ArgumentType.FullString> = {
  name: 'gif',
  description: 'Searches for a random gif',
  args: { name: 'keyword', description: 'Keyword to search for -- leave blank for random' },
  execute: async (msg, input) => {
    let imageUrl;
    try {
      imageUrl = await getRandomImageURL(input);
    } catch (e: any) {
      if (e.statusCode === 429) {
        throw new BotError('Tenor rate limit reached :c');
      }
    }
    if (!imageUrl) {
      throw new BotError('No suitable image found :c');
    }
    await reply(msg, imageUrl);
  },
};

MessageHandler.registerCommand(cmd);
