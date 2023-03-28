import type { AdminCommand } from "bot/types";
import SlashCommandHandler from "bot/slash-commands/SlashCommandHandler";
import AdminCommandHandler from "../AdminCommandHandler";

const cmd: AdminCommand = {
  name: "update-slash-commands",
  isGuild: false,
  execute: async (msg) => {
    await SlashCommandHandler.updateSlashCommands();
    await msg.reply("Slash commands updated!");
  },
};

AdminCommandHandler.register(cmd);
