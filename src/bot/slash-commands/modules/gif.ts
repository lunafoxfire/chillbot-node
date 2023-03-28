import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "bot/types";
import SlashCommandHandler from "../SlashCommandHandler";
import { getRandomImageURL } from "services/tenor";
import { BotError } from "util/errors";

const cmd: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("gif")
    .setDescription("Searches for a random gif.")
    .addStringOption((option) => option
      .setName("keyword")
      .setDescription("Keyword to search for -- leave blank for random."),
    ),
  execute: async (interaction) => {
    const keyword = interaction.options.getString("keyword") ?? "";
    let imageUrl;
    try {
      imageUrl = await getRandomImageURL(keyword);
    } catch (e: any) {
      if (e.statusCode === 429) {
        throw new BotError("Tenor rate limit reached :c");
      }
    }
    if (!imageUrl) {
      throw new BotError("No suitable image found :c");
    }
    await interaction.reply(imageUrl);
  },
};

SlashCommandHandler.register(cmd);
