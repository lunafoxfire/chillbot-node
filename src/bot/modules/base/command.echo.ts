import { ArgumentType, Command } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';

const cmd: Command<ArgumentType.FullString> = {
  name: 'echo',
  aliases: ['say'],
  description: 'Echoes the given message',
  args: { name: 'message', description: 'The message to echo' },
  execute: async (msg, input) => {
    await msg.reply(input);
  },
};

MessageHandler.registerCommand(cmd);
