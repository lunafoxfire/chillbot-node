import { Events, Routes } from "discord.js";
import type { Interaction } from "discord.js";
import Bot from "bot/index";
import type { SlashCommand } from "bot/types";
import { createLogger } from "util/logger";
import { guildIds } from "util/discord/constants";
import { importAllFromDirectory } from "util/import";
import { BotError } from "util/errors";

const COMMANDS_DIR = "./bot/slash-commands/modules";

export default class SlashCommandHandler {
  public static logger = createLogger("SlashCommandHandler");
  private static readonly commands: Record<string, SlashCommand> = {};

  public static async init() {
    await self.importCommands();
    Bot.client.on(Events.InteractionCreate, self.handleInteraction);
  }

  public static register(cmd: SlashCommand) {
    const name = cmd.data.name;
    if (!name) {
      self.logger.warn("Tried to register command with no name");
      return;
    }
    if (self.commands[name]) {
      self.logger.warn(`Tried to register duplicate command: ${name}`);
      return;
    }
    self.commands[name] = cmd;
    self.logger.info(`Registered slash command: ${name}`);
  }

  public static async updateSlashCommands() {
    const commandsJSON = [];
    for (const command of Object.values(self.commands)) {
      commandsJSON.push(command.data.toJSON());
      self.logger.debug(`Prepared: ${command.data.name}`);
    }

    if (Bot.isDev) {
      await Bot.restAPI.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID ?? "", guildIds._dev_),
        { body: commandsJSON },
      );
    } else {
      await Bot.restAPI.put(
        Routes.applicationCommands(process.env.CLIENT_ID ?? ""),
        { body: commandsJSON },
      );
    }

    self.logger.debug("Slash commands updated!");
  }

  private static async handleInteraction(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.user.bot) return;

    const name = interaction.commandName;
    const command = self.commands[interaction.commandName];
    if (!command) {
      self.logger.warn(`Tried to execute missing command: ${name}`);
      return;
    }

    try {
      self.logger.verbose(`Executing command ${name}`);
      await command.execute(interaction);
    } catch (error: any) {
      if (Bot.isDev) console.error(error);
      let message = BotError.defaultMessage;
      if (error.isBotError && !error.internalOnly) {
        message = error.message;
      }
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: message, ephemeral: true });
      } else {
        await interaction.reply({ content: message, ephemeral: true });
      }
    }
  }

  private static async importCommands() {
    await importAllFromDirectory(COMMANDS_DIR);
  }
}

const self = SlashCommandHandler;
