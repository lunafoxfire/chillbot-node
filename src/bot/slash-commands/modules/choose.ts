import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "bot/types";
import SlashCommandHandler from "../SlashCommandHandler";
import WeightedList from "util/weighted-list";

const templates = new WeightedList<string>()
  .add(10, "My choice is... %c!")
  .add(10, "I'm thinking... %c!")
  .add(10, "How about... %c!")
  .add(10, "Um I guess I'll pick... %c!")
  .add(10, "I'd say... %c!")
  .add(2, "After long and thoughtful deliberation, weighing the pros and cons of each option you presented in a careful, nonbiased way, taking every minutia of each choice into account and weighing it against the others, leaving no detail unpondered... I have arrived at a conclusion. A option that, in my mind, is a cut above the rest. Although all the choices you had me choose from were in their own way appealing, I believe there is one that is simply unavoidable in this situation. The one I choose is... %c!");

const cmd: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("choose")
    .setDescription("Choose an option from a list.")
    .addStringOption((option) => option
      .setName("list")
      .setDescription("Comma-separated list of options")
      .setRequired(true),
    ),
  execute: async (interaction) => {
    const list = interaction.options.getString("list", true);
    const options = list.split(",").map((opt) => opt.trim());
    const choice = options[Math.floor(Math.random() * options.length)];
    const answer = templates.select().replace("%c", choice);
    const text = `${interaction.user} wants to choose from: ${options.join(", ")}\n\n${answer}`;
    await interaction.reply(text);
  },
};

SlashCommandHandler.register(cmd);
