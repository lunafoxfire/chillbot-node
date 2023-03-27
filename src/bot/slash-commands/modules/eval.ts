import { SlashCommandBuilder } from 'discord.js';
import type { SlashCommand } from 'bot/types';
import SlashCommandHandler from '../SlashCommandHandler';
import { safeEval } from 'services/vm';

const cmd: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Runs javascript eval() on the passed in string. The last executed statement is emitted.')
    .addStringOption((option) => option
      .setName('code')
      .setDescription('The javascript code to evaluate.')
      .setRequired(true),
    ),
  execute: async (interaction) => {
    const input = interaction.options.getString('code', true);
    await interaction.deferReply();
    let output = '';
    const result = safeEval(input);
    if (result.error) {
      output = `${result.error.name}: ${result.error.message}`;
    } else if (result.text) {
      output = result.text;
    }
    await interaction.followUp(`\`\`\`\n${input}\n\`\`\``);
    await interaction.followUp(output);
  },
};

SlashCommandHandler.register(cmd);
