import { Message } from 'discord.js';
import { ArgumentType, Command } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { reply } from 'util/discord/messages';

const cmd: Command<ArgumentType.FullString> = {
  name: 'help',
  description: 'Displays this message',
  args: { name: 'command', description: 'Command to get details for' },
  execute: async (msg, input) => {
    let helpText: string;
    if (input) {
      helpText = await getSpecificCommandHelp(msg, input);
    } else {
      helpText = await getAllCommandsHelp(msg);
    }
    await reply(msg, helpText);
  },
};

async function getAllValidCommands(msg: Message): Promise<Command<ArgumentType>[]> {
  const promises = MessageHandler.getRegisteredCommands().map(async ({ command }) => ({
    command,
    valid: (await MessageHandler.validateCommandPermissions(msg, command)).valid,
  }));
  const commands = (await Promise.all(promises))
    .filter(({ command, valid }) => valid && !command.ownerOnly)
    .map(({ command }) => command);
  return commands;
}

async function getAllCommandsHelp(msg: Message): Promise<string> {
  const commands = await getAllValidCommands(msg);

  const helpText = commands
    .sort((a, b) => {
      if (a.name > b.name) { return 1; }
      if (a.name < b.name) { return -1; }
      return 0;
    })
    .map((command) => {
      let argArray;
      if (command.args) {
        argArray = Array.isArray(command.args) ? command.args : [command.args];
      }
      const argText = argArray
        ? argArray.map((a) => {
          const argName = a.rest ? `...${a.name}` : a.name;
          return ` <${argName}>`;
        }).join(' ')
        : '';
      return `\`!${command.name}${argText}\` - ${command.description}`;
    })
    .join('\n');

  return helpText;
}

async function getSpecificCommandHelp(msg: Message, commandName: string): Promise<string> {
  const commands = await getAllValidCommands(msg);

  const command = commands.find((c) => c.name === commandName || c.aliases?.find((a) => commandName === a));
  if (!command) {
    return 'Command not found';
  }

  const name = `\`${command.name}\` - ${command.description}\n`;
  const aliases = command.aliases ? `aliases: ${command.aliases.map((a) => `\`${a}\``).join(', ')}\n` : '';
  let argArray;
  if (command.args) {
    argArray = Array.isArray(command.args) ? command.args : [command.args];
  }
  const args = argArray
    ? `arguments:${argArray.map((arg) => {
      const argName = arg.rest ? `...${arg.name}` : arg.name;
      return `\n  \`${argName}\` - ${arg.description}`;
    })}`
    : '';

  const helpText = `${name}${aliases}${args}`;
  return helpText;
}

MessageHandler.registerCommand(cmd);
