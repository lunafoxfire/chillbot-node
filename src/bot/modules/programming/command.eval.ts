import { ArgumentType, Command } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { safeEval } from 'services/vm';
import { BotError } from 'util/errors';

// TODO: add this to guild config
const BOT_SPAM_CHANNEL = '606703714027175936';

const MAX_CHARS = 2000;
const MAX_LINES = 25;

const MAX_CHARS_LENIENT = 10000;
const MAX_LINES_LENIENT = 1000;

const cmd: Command<ArgumentType.FullString> = {
  name: 'eval',
  aliases: ['js'],
  description: 'Runs eval() on the passed in string. The last executed line is emitted. (Happy hacking!)',
  args: { name: 'code', description: 'The code to evaluate' },
  execute: async (msg, input) => {
    let output = '';
    const result = safeEval(input);
    if (result.error) {
      output = `${result.error.name}: ${result.error.message}`;
    } else if (result.text) {
      output = result.text;
    }
    const lines = output.split('\n');
    const lenient = process.env.NODE_ENV === 'development'
      || msg.channel.type === 'dm'
      || msg.channel.id === BOT_SPAM_CHANNEL;
    const maxChars = lenient ? MAX_CHARS_LENIENT : MAX_CHARS;
    const maxLines = lenient ? MAX_LINES_LENIENT : MAX_LINES;
    if (output.length <= maxChars && lines.length <= maxLines) {
      for (let i = 0; i < output.length; i += 2000) {
        const subMsg = output.substr(i, 2000);
        if (i === 0) {
          await msg.reply(subMsg);
        } else {
          await msg.channel.send(subMsg);
        }
      }
    } else {
      throw new BotError('Result too big >.>');
    }
  },
};

MessageHandler.registerCommand(cmd);
