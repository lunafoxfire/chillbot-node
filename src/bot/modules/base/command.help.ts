import { Message } from 'discord.js';
import { ArgumentType, Command } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';

const cmd: Command<ArgumentType.FullString> = {
  name: 'help',
  description: 'Displays this message',
  args: { name: 'command', description: 'Command to get details for' },
  execute: async (msg, input) => {
    let helpText: string;
    if (input) {
      helpText = getSpecificCommandHelp(msg, input);
    } else {
      helpText = getAllCommandsHelp(msg);
    }
    msg.reply(helpText);
  },
};

function getAllCommandsHelp(msg: Message): string {
  const commands = MessageHandler.getRegisteredCommands()
    .filter(({ command }) => MessageHandler.validateCommandPermissions(msg, command).valid)
    .sort((a, b) => {
      if (a.command.name > b.command.name) { return 1; }
      if (a.command.name < b.command.name) { return -1; }
      return 0;
    });

  const helpText = commands
    .map(({ command }) => {
      let argArray;
      if (command.args && !Array.isArray(command.args)) {
        argArray = [command.args];
      }
      const argText = argArray ? argArray.map((a) => ` <${a.name}>`).join(' ') : '';
      return `\`!${command.name}${argText}\` - ${command.description}`;
    })
    .join('\n');

  return helpText;
}

function getSpecificCommandHelp(msg: Message, commandName: string): string {
  const cmdInfo = MessageHandler.getRegisteredCommands()
    .find(({ command: c }) => c.name === commandName || c.aliases?.find((a) => commandName === a));
  if (!cmdInfo || !MessageHandler.validateCommandPermissions(msg, cmdInfo.command).valid) {
    return '';
  }

  const name = `\`${cmdInfo.command.name}\` - ${cmdInfo.command.description}\n`;
  const aliases = cmdInfo.command.aliases ? `aliases: ${cmdInfo.command.aliases.map((a) => `\`${a}\``).join(', ')}\n` : '';
  let argArray;
  if (cmdInfo.command.args && !Array.isArray(cmdInfo.command.args)) {
    argArray = [cmdInfo.command.args];
  }
  const args = argArray ? `arguments:${argArray.map((arg) => `\n  \`${arg.name}\` - ${arg.description}`)}` : '';

  const helpText = `${name}${aliases}${args}`;
  return helpText;
}

MessageHandler.registerCommand(cmd);
