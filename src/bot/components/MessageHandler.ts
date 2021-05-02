import { Message } from 'discord.js';
import { createLogger } from 'util/logger';
import { BotError, ArgumentError, UserPermissionError, BotPermissionError } from 'util/errors';
import { guildIds, userIds } from 'util/constants';
import { parseArgList } from 'util/string';
import Bot from 'bot';
import { Command, Reaction } from 'bot/types';

const DEFAULT_CMD_PREFIX = '!';

const logger = createLogger('MessageHandler');

export default class MessageHandler {
  private static initialized: boolean = false;
  private static registeredCommands: { command: Command, keywords: string[] }[] = [];
  private static registeredReactions: Reaction[] = [];

  public static init() {
    if (MessageHandler.initialized) {
      logger.error('Tried to init MessageHandler but it is already initialized');
      return;
    }
    Bot.client.on('message', MessageHandler.handleMessage);
    logger.info('Ready to listen for commands');
  }

  public static registerCommand(command: Command) {
    const keywords = [command.name];
    if (command.aliases && command.aliases.length) {
      for (const alias of command.aliases) {
        keywords.push(alias);
      }
    }
    MessageHandler.registeredCommands.push({ command, keywords });
    logger.info(`Registered command: ${command.name}`);
  }

  public static registerReaction(reaction: Reaction) {
    MessageHandler.registeredReactions.push(reaction);
    logger.info(`Registered reaction: ${reaction.name}`);
  }

  public static validateCommandPermissions(msg: Message, command: Command): { valid: Boolean, error: Error | undefined } {
    const { guildOnly, chillBrosOnly, ownerOnly, requireUserPermissions, requireBotPermissions } = command;
    if (guildOnly && msg.channel.type !== 'text') {
      return {
        valid: false,
        error: new BotError('Sorry that command only works on a server channel'),
      };
    }
    if (chillBrosOnly && msg.guild?.id !== guildIds.ChillBros) {
      return {
        valid: false,
        error: new BotError('This command only works on the Chill Bros server'),
      };
    }
    if (ownerOnly && msg.author.id !== userIds.LydianLights) {
      return {
        valid: false,
        error: new UserPermissionError(),
      };
    }
    if (requireUserPermissions && msg.member?.permissionsIn(msg.channel).has(requireUserPermissions)) {
      return {
        valid: false,
        error: new UserPermissionError(),
      };
    }
    if (requireBotPermissions && msg.guild?.me?.permissionsIn(msg.channel).has(requireBotPermissions)) {
      return {
        valid: false,
        error: new BotPermissionError(),
      };
    }
    return {
      valid: true,
      error: undefined,
    };
  }

  private static async handleMessage(msg: Message) {
    if (msg.partial) {
      logger.warn(`Partial message recieved! id: ${msg.id}`);
      return;
    }
    if (msg.author.bot) return;
    try {
      if (await MessageHandler.handleAsCommand(msg)) return;
      if (await MessageHandler.handleAsReaction(msg)) return;
    } catch (e) {
      MessageHandler.handleError(msg, e);
    }
  }

  private static async handleAsCommand(msg: Message): Promise<boolean> {
    let commandText;
    if (msg.content.startsWith(DEFAULT_CMD_PREFIX)) {
      commandText = msg.content.substring(DEFAULT_CMD_PREFIX.length);
    } else {
      // Mentioning bot counts as command prefix
      const mentionPrefix = `${Bot.client.user}`;
      if (msg.content.startsWith(mentionPrefix)) {
        commandText = msg.content.substring(mentionPrefix.length).trimLeft();
      }
    }
    if (commandText) {
      for (const { command, keywords } of MessageHandler.registeredCommands) {
        for (const keyword of keywords) {
          if (commandText.startsWith(keyword)) {
            const { valid, error } = MessageHandler.validateCommandPermissions(msg, command);
            if (!valid) {
              // no
              // eslint-disable-next-line @typescript-eslint/no-throw-literal
              throw error;
            }
            logger.verbose(`Executing command: ${command.name}`);
            const argumentText = commandText.substring(keyword.length).trimLeft();
            const args = MessageHandler.parseArgsFromText(command, argumentText);
            // eslint-disable-next-line no-await-in-loop
            await command.execute(msg, args);
            return true;
          }
        }
      }
    }
    return false;
  }

  private static async handleAsReaction(msg: Message): Promise<boolean> {
    for (const reaction of MessageHandler.registeredReactions) {
      if (reaction.test(msg)) {
        logger.verbose(`Executing reaction: ${reaction.name}`);
        // eslint-disable-next-line no-await-in-loop
        await reaction.execute(msg);
        return true;
      }
    }
    return false;
  }

  private static async handleError(msg: Message, e: any) {
    if (
      e.name === BotError.NAME
      || e.name === ArgumentError.NAME
      || e.name === UserPermissionError.NAME
      || e.name === BotPermissionError.NAME
    ) {
      if (!e.internalOnly) {
        await msg.reply(e.message);
      }
    } else if (e.name === 'DiscordAPIError' && e.code === 50035) {
      await msg.reply('I wanted to say something, but it was way too long...');
    }
  }

  private static parseArgsFromText(command: Command, argumentText: string): string | string[] | undefined {
    if (!command.args) {
      return undefined;
    }
    if (Array.isArray(command.args)) {
      return parseArgList(argumentText);
    }
    return argumentText;
  }
}
