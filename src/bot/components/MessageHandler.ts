import { Message } from 'discord.js';
import { createLogger } from 'util/logger';
import { BotError, ArgumentError, UserPermissionError, BotPermissionError } from 'util/errors';
import { guildIds, userIds } from 'util/constants';
import { getMentionString, parseArgList } from 'util/string';
import { createPrefixRegex, createMentionPrefixRegex, createCommandRegex } from 'util/string/regex';
import Bot from 'bot';
import { Command, Reaction } from 'bot/types';

const DEFAULT_CMD_PREFIX = '!';

const logger = createLogger('MessageHandler');
const chatLogger = createLogger('chat');

export default class MessageHandler {
  private static initialized: boolean = false;
  private static registeredCommands: { command: Command, keywords: { text: string, regex: RegExp }[] }[] = [];
  private static registeredReactions: Reaction[] = [];

  private static prefixRegex: RegExp;
  private static mentionPrefixRegex: RegExp;

  public static init() {
    if (MessageHandler.initialized) {
      logger.error('Tried to init MessageHandler but it is already initialized');
      return;
    }
    MessageHandler.prefixRegex = createPrefixRegex(DEFAULT_CMD_PREFIX);
    if (!Bot.client.user) throw new Error('Bot.client.user somehow doesn\'t exist???');
    MessageHandler.mentionPrefixRegex = createMentionPrefixRegex(getMentionString(Bot.client.user));
    Bot.client.on('message', MessageHandler.handleMessage);
    logger.info('Ready to listen for commands');
  }

  public static registerCommand(command: Command) {
    const keywords = [{ text: command.name, regex: createCommandRegex(command.name) }];
    if (command.aliases && command.aliases.length) {
      for (const alias of command.aliases) {
        keywords.push({ text: alias, regex: createCommandRegex(alias) });
      }
    }
    MessageHandler.registeredCommands.push({ command, keywords });
    logger.info(`Registered command: ${command.name}`);
  }

  public static registerReaction(reaction: Reaction) {
    MessageHandler.registeredReactions.push(reaction);
    logger.info(`Registered reaction: ${reaction.name}`);
  }

  public static getRegisteredCommands() {
    return MessageHandler.registeredCommands;
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
    MessageHandler.chatLog(msg);
    if (msg.author.bot) return;
    try {
      if (await MessageHandler.handleAsCommand(msg)) return;
      if (await MessageHandler.handleAsReaction(msg)) return;
    } catch (e) {
      MessageHandler.handleError(msg, e);
    }
  }

  private static async handleAsCommand(msg: Message): Promise<boolean> {
    let match = msg.content.match(MessageHandler.prefixRegex) || msg.content.match(MessageHandler.mentionPrefixRegex);
    if (match) {
      const commandText = match[1];
      for (const { command, keywords } of MessageHandler.registeredCommands) {
        for (const keyword of keywords) {
          match = commandText.match(keyword.regex);
          if (match) {
            const { valid, error } = MessageHandler.validateCommandPermissions(msg, command);
            if (!valid) {
              // no
              // eslint-disable-next-line @typescript-eslint/no-throw-literal
              throw error;
            }
            logger.verbose(`Executing command: ${command.name}`);
            const argumentText = match[1];
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

  private static chatLog(msg: Message) {
    const channelName = msg.channel.type === 'dm' ? 'dm' : `${msg.guild?.name}#${msg.channel.name}`;
    // const formattedMsg = msg.content.split('\n').join('\n  ');
    chatLogger.silly(`${channelName}@${msg.author.username}: ${msg.content}`);
  }
}
