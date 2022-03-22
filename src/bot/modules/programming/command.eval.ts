import { ArgumentType, Command } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { safeEval } from 'services/vm';
import { multiPageReply } from 'util/discord/messages';

const cmd: Command<ArgumentType.FullString> = {
  name: 'eval',
  aliases: ['js'],
  description: 'Runs javascript eval() on the passed in string. The last executed statement is emitted.',
  args: { name: 'code', description: 'The code to evaluate' },
  execute: async (msg, input) => {
    let output = '';
    const result = safeEval(input);
    if (result.error) {
      output = `${result.error.name}: ${result.error.message}`;
    } else if (result.text) {
      output = result.text;
    }
    await multiPageReply(msg, output, 5);
  },
};

MessageHandler.registerCommand(cmd);
