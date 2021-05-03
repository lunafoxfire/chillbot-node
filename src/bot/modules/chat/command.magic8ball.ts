import { ArgumentType, Command } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';

const ANSWERS = [
  'It is certain.',
  'It is decidedly so.',
  'Without a doubt.',
  'Yes - definitely.',
  'You may rely on it.',
  'As I see it, yes.',
  'Most likely.',
  'Outlook good.',
  'Yes.',
  'Signs point to yes.',
  'Reply hazy, try again...',
  'Ask again later...',
  'Better not tell you now...',
  'Cannot predict now...',
  'Concentrate and ask again.',
  'Don\'t count on it.',
  'My reply is no.',
  'My sources say no.',
  'Outlook not so good.',
  'Very doubtful',
];

const cmd: Command<ArgumentType.FullString> = {
  name: 'magic8ball',
  aliases: ['ask', 'fortune'],
  description: 'Asks Chillbot to predict your future',
  args: { name: 'query', description: 'The question to ask' },
  execute: async (msg, input) => {
    if (!input) {
      await msg.reply('You have to actually ask something :P');
      return;
    }
    const answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
    await msg.reply(answer);
  },
};

MessageHandler.registerCommand(cmd);
