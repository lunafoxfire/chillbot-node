import { SlashCommandBuilder } from 'discord.js';
import type { Guild, GuildMember, Role, ChatInputCommandInteraction } from 'discord.js';
import type { SlashCommand } from 'bot/types';
import SlashCommandHandler from '../SlashCommandHandler';
import UserData from 'models/UserData';
import { emojiIds, roleIds } from 'util/discord/constants';
import { ArgumentError, BotError } from 'util/errors';

const cmd: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('title')
    .setDescription('Edits your custom unique title.')
    .addSubcommand((subcommand) => subcommand
      .setName('get')
      .setDescription('Check what your currently registered title is.'),
    )
    .addSubcommand((subcommand) => subcommand
      .setName('set')
      .setDescription('Set your unique title.')
      .addStringOption((option) => option
        .setName('name')
        .setDescription('The name of your new title.')
        .setRequired(true),
      ),
    )
    .addSubcommand((subcommand) => subcommand
      .setName('color')
      .setDescription('Set the color of your unique title.')
      .addStringOption((option) => option
        .setName('color')
        .setDescription('The desired color in #hex or r,g,b format.')
        .setRequired(true),
      ),
    )
    .addSubcommand((subcommand) => subcommand
      .setName('remove')
      .setDescription('Remove your unique title.'),
    ),
  execute: async (interaction) => {
    const author = interaction.member as GuildMember;
    const guild = interaction.guild;
    if (!guild || !author) throw new BotError();

    const placeholderRole = await guild.roles.fetch(roleIds.UniqueRolePlaceholder);
    if (!placeholderRole) {
      throw new BotError('This server is not configured to allow user titles.');
    }

    const { unique_role: existingRoleId } = await UserData.findOrCreate({ user_id: author.id, guild_id: guild.id });
    const existingRole = existingRoleId ? await guild.roles.fetch(existingRoleId) : null;

    if (existingRoleId && !existingRole) {
      await UserData.setUniqueRole({ user_id: author.id, guild_id: guild.id }, null);
    }
    if (existingRoleId && existingRole && !author.roles.valueOf().has(existingRoleId)) {
      await author.roles.add(existingRole);
    }

    const context: CommandContext = {
      author,
      guild,
      existingRole,
      placeholderRole,
    };
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case 'get':
        await handleGetTitle(interaction, context);
        break;
      case 'set':
        await handleSetTitle(interaction, context);
        break;
      case 'color':
        await handleSetTitleColor(interaction, context);
        break;
      case 'remove':
        await handleRemoveTitle(interaction, context);
        break;
    }
  },
};

type CommandContext = {
  author: GuildMember,
  guild: Guild,
  existingRole: Role | null,
  placeholderRole: Role,
};


// ======== HANDLERS ======== //
async function handleGetTitle(interaction: ChatInputCommandInteraction, context: CommandContext) {
  const { existingRole } = context;
  if (existingRole) {
    await interaction.reply(`Your current title is \`${existingRole.name}\``);
  } else {
    await interaction.reply('You currently have no title.');
  }
}

async function handleSetTitle(interaction: ChatInputCommandInteraction, context: CommandContext) {
  const { author, guild, existingRole, placeholderRole } = context;
  const input = interaction.options.getString('name', true);
  if (existingRole) {
    await existingRole.setName(input);
    await interaction.reply(`Your title has been updated ${emojiIds.CoffeeCat}`);
  } else {
    const newRole = await guild.roles.create({
      name: input,
      color: 'Random',
      position: placeholderRole.position,
      reason: `Created by Chillbot as unique title for user ${author.id}`,
    });
    await author.roles.add(newRole);
    await UserData.setUniqueRole({ user_id: author.id, guild_id: guild.id }, newRole.id);
    await interaction.reply(`You now have the title of \`${newRole.name}\`!\nUse \`/title color\` to set your color.`);
  }
}

async function handleSetTitleColor(interaction: ChatInputCommandInteraction, context: CommandContext) {
  const { existingRole } = context;
  const input = interaction.options.getString('color', true);
  if (existingRole) {
    const parsedColor = parseColor(input);
    if (!parsedColor) throw new ArgumentError('Invaild color format. Must be hex or r,g,b format.');
    await existingRole.setColor(parsedColor);
    await interaction.reply(`Your title has been updated ${emojiIds.CoffeeCat}`);
  } else {
    await interaction.reply('You currently have no title. Set one with `/title set` first!');
  }
}

async function handleRemoveTitle(interaction: ChatInputCommandInteraction, context: CommandContext) {
  const { author, guild, existingRole } = context;
  if (existingRole) {
    await existingRole.delete(`Removed by Chillbot -- was unique title for user ${author.id}`);
    await UserData.setUniqueRole({ user_id: author.id, guild_id: guild.id }, null);
    await interaction.reply(`Your title has been removed ${emojiIds.CoffeeCat}`);
  } else {
    await interaction.reply('You already don\'t have a title.');
  }
}


// ======== HELPERS ======== //
function parseColor(input: string): [number, number, number] | undefined {
  let result: [number, number, number] | undefined;

  result = parseAsRGB(input);
  if (result) return result;

  result = parseAsHex(input);
  if (result) return result;

  return undefined;
}

const rgbRegex = /^(\d+),(\d+),(\d+)$/;
function parseAsRGB(input: string): [number, number, number] | undefined {
  const match = rgbRegex.exec(input);
  if (match) {
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    if (validateColorValue(r) && validateColorValue(g) && validateColorValue(b)) {
      return [r, g, b];
    }
  }
  return undefined;
}

const hexRegex = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
function parseAsHex(input: string): [number, number, number] | undefined {
  const match = hexRegex.exec(input);
  if (match) {
    const r = parseInt(match[1], 16);
    const g = parseInt(match[2], 16);
    const b = parseInt(match[3], 16);
    if (validateColorValue(r) && validateColorValue(g) && validateColorValue(b)) {
      return [r, g, b];
    }
  }
  return undefined;
}

function validateColorValue(n: number): boolean {
  if (Number.isNaN(n) || n < 0 || n > 255) return false;
  return true;
}

SlashCommandHandler.register(cmd);
