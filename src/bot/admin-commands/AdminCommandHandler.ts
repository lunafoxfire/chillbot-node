import { Events } from "discord.js";
import type { Message } from "discord.js";
import Bot from "bot/index";
import type { AdminCommand } from "bot/types";
import { createLogger } from "util/logger";
import { importAllFromDirectory } from "util/import";
import { userIds } from "util/discord/constants";
import { BotError } from "util/errors";

const COMMAND_PREFIX = ">";
const COMMANDS_DIR = "./bot/admin-commands/modules";

export default class AdminCommandHandler {
  public static logger = createLogger("AdminCommandHandler");
  private static readonly commands: Record<string, AdminCommand> = {};

  public static async init() {
    await self.importCommands();
    Bot.client.on(Events.MessageCreate, self.handleMessage);
  }

  public static register(cmd: AdminCommand) {
    const name = cmd.name;
    if (!name) {
      self.logger.warn("Tried to register command with no name");
      return;
    }
    if (self.commands[name]) {
      self.logger.warn(`Tried to register duplicate command: ${name}`);
      return;
    }
    self.commands[name] = cmd;
    self.logger.info(`Registered admin command: ${name}`);
  }

  private static async handleMessage(msg: Message) {
    if (msg.author.id !== userIds.LydianLights) return;
    if (!msg.content.startsWith(COMMAND_PREFIX)) return;

    const isDM = msg.channel.isDMBased();
    for (const [name, command] of Object.entries(self.commands)) {
      if (msg.content.startsWith(`>${name}`)) {
        if ((command.isGuild && isDM) || (!command.isGuild && !isDM)) break;
        try {
          self.logger.verbose(`Executing command ${name}`);
          await command.execute(msg);
        } catch (error: any) {
          if (Bot.isDev) console.error(error);
          let message = BotError.defaultMessage;
          if (error.isBotError && !error.internalOnly) {
            message = error.message;
          }
          await msg.reply(message);
        }
        break;
      }
    };
  }

  private static async importCommands() {
    await importAllFromDirectory(COMMANDS_DIR);
  }
}

const self = AdminCommandHandler;
