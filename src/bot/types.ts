import type { ChatInputCommandInteraction, Message, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export type SlashCommand = {
  data: SlashCommandData,
  execute: SlashCommandCallback,
};

export type SlashCommandData = SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">;

export type SlashCommandCallback = (interaction: ChatInputCommandInteraction) => Promise<void>;

export type AdminCommand = {
  name: string,
  isGuild: boolean,
  execute: AdminCommandCallback,
};

export type AdminCommandCallback = (msg: Message) => Promise<void>;

export type Reaction = {
  name: string,
  suppressTyping?: boolean,
  cooldown: number,
  probability: number,
  test: ReactionTest,
  execute: ReactionCallback,
};

export type ReactionTest = (msg: Message) => boolean;

export type ReactionCallback = (msg: Message) => Promise<void>;
