import { SlashCommandBuilder } from 'discord.js';
import type { SlashCommand } from 'bot/types';
import SlashCommandHandler from '../SlashCommandHandler';

const cmd: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Makes Chillbot say something.')
    .addStringOption((option) => option
      .setName('text')
      .setDescription('The text to say.')
      .setRequired(true),
    ),
  execute: async (interaction) => {
    const text = interaction.options.getString('text', true);
    await interaction.reply(text);
  },
};

SlashCommandHandler.register(cmd);
