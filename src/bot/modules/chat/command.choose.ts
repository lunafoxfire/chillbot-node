import { ArgumentType, Command } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { reply } from 'util/discord/messages';

const cmd: Command<ArgumentType.ArgumentList> = {
  name: 'choose',
  aliases: ['pick'],
  description: 'Chooses an option from a list',
  args: [{ name: 'options', description: 'Options to choose from', rest: true }],
  execute: async (msg, args) => {
    const choice = args[Math.floor(Math.random() * args.length)];
    await reply(msg, `My choice is...\n${choice}!`);
  },
};

MessageHandler.registerCommand(cmd);
