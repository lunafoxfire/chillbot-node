import { Message } from 'discord.js';
import { createLogger } from 'util/logger';
import { isDMChannel, isGuildTextChannel } from 'util/discord/channels';
import { guildIds, userIds } from 'util/discord/constants';
import { BotError, UserPermissionError, BotPermissionError } from 'util/errors';
import { getMentionString, parseArgList } from 'util/string';
import { createPrefixRegex, createMentionPrefixRegex, createCommandRegex } from 'util/string/regex';
import Bot from 'bot';
import { Command, Reaction } from 'bot/types';
import CooldownHandler from 'bot/components/CooldownHandler';
import { sendTyping } from 'util/discord/messages';

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
    Bot.client.on('messageCreate', MessageHandler.handleMessage);
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

  public static finalizeCommandRegistration() {
    MessageHandler.registeredCommands.sort((a, b) => {
      const aPriority = a.command.priority ?? 0;
      const bPriority = b.command.priority ?? 0;
      if (aPriority > bPriority) return -1;
      if (aPriority < bPriority) return 1;
      return 0;
    });

    MessageHandler.registeredReactions.sort((a, b) => {
      const aPriority = a.priority ?? 0;
      const bPriority = b.priority ?? 0;
      if (aPriority > bPriority) return -1;
      if (aPriority < bPriority) return 1;
      return 0;
    });
  }

  public static getRegisteredCommands() {
    return MessageHandler.registeredCommands;
  }

  public static async validateCommandPermissions(msg: Message, command: Command): Promise<{ valid: Boolean, error: Error | undefined }> {
    const { guildOnly, chillBrosOnly, ownerOnly, requireUserPermissions, requireBotPermissions, requireUserRole, requireBotRole } = command;
    if (guildOnly && !isGuildTextChannel(msg.channel)) {
      return {
        valid: false,
        error: new BotError('Sorry that command only works on a server channel'),
      };
    }
    if (chillBrosOnly && !(msg.guild?.id === guildIds.ChillBros)) {
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
    if (isGuildTextChannel(msg.channel)) {
      if (requireUserPermissions && !msg.member?.permissionsIn(msg.channel).has(requireUserPermissions)) {
        return {
          valid: false,
          error: new UserPermissionError(),
        };
      }
      if (requireBotPermissions && !msg.guild?.me?.permissionsIn(msg.channel).has(requireBotPermissions)) {
        return {
          valid: false,
          error: new BotPermissionError(),
        };
      }
      if (requireUserRole) {
        const requiredRole = await msg.guild?.roles.fetch(requireUserRole);
        const userRole = msg.member?.roles.highest;
        if (requireUserRole && (!requiredRole || !userRole || requiredRole.position > userRole.position)) {
          return {
            valid: false,
            error: new UserPermissionError(),
          };
        }
      }
      if (requireBotRole) {
        const requiredRole = await msg.guild?.roles.fetch(requireBotRole);
        const botRole = msg.guild?.me?.roles.highest;
        if (requireUserRole && (!requiredRole || !botRole || requiredRole.position > botRole.position)) {
          return {
            valid: false,
            error: new BotPermissionError(),
          };
        }
      }
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
            const { valid, error } = await MessageHandler.validateCommandPermissions(msg, command);
            if (!valid) {
              if (error) {
                throw error;
              } else {
                throw new BotError();
              }
            }
            logger.verbose(`Executing command: ${command.name}`);
            const argumentText = match[1];
            const args = MessageHandler.parseArgsFromText(command, argumentText);
            if (!command.suppressTyping) {
              await sendTyping(msg);
            }
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
        if ((reaction.probability == null) || (Math.random() < reaction.probability)) {
          if (CooldownHandler.checkCooldown(msg, reaction, true)) {
            logger.verbose(`Executing reaction: ${reaction.name}`);
            if (!reaction.suppressTyping) {
              await sendTyping(msg);
            }
            await reaction.execute(msg);
          }
        } else {
          logger.debug(`Reaction rejected: ${reaction.name}. Failed probability check.`);
        }
        return true;
      }
    }
    return false;
  }

  private static async handleError(msg: Message, e: any) {
    if (e.isBotError) {
      if (!e.internalOnly) {
        await sendTyping(msg);
        await msg.reply(e.message);
        return;
      }
    }
    logger.error(e);
    await sendTyping(msg);
    await msg.reply(BotError.defaultMessage);
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
    let channelName;
    if (isGuildTextChannel(msg.channel)) {
      channelName = `${msg.guild?.name}#${msg.channel.name}`;
    } else if (isDMChannel(msg.channel)) {
      channelName = 'dm';
    }
    chatLogger.silly(`${channelName}@${msg.author.username}: ${msg.content}`);
  }
}
