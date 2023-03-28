import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "bot/types";
import SlashCommandHandler from "../SlashCommandHandler";

const ANSWERS = [
  "It is certain.",
  "It is decidedly so.",
  "Without a doubt.",
  "Yes - definitely.",
  "You may rely on it.",
  "As I see it, yes.",
  "Most likely.",
  "Outlook good.",
  "Yes.",
  "Signs point to yes.",
  "Reply hazy, try again...",
  "Ask again later...",
  "Better not tell you now...",
  "Cannot predict now...",
  "Concentrate and ask again.",
  "Don't count on it.",
  "My reply is no.",
  "My sources say no.",
  "Outlook not so good.",
  "Very doubtful",
];

const cmd: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("magic8ball")
    .setDescription("Asks Chillbot to predict your future.")
    .addStringOption((option) => option
      .setName("query")
      .setDescription("The question to ask.")
      .setRequired(true),
    ),
  execute: async (interaction) => {
    const query = interaction.options.getString("query", true);
    const answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
    const text = `${interaction.user} asks:\n"${query}"\n\nMy fortune: ${answer}`;
    await interaction.reply(text);
  },
};

SlashCommandHandler.register(cmd);
