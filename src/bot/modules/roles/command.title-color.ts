import { ArgumentType, Command } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { reply } from 'util/discord/messages';
import UserData from 'models/UserData';
import { ArgumentError, BotError } from 'util/errors';
import { emojiIds, roleIds } from 'util/discord/constants';

const cmd: Command<ArgumentType.FullString> = {
  name: 'title-color',
  description: 'Sets the color of the user\'s unique title',
  args: { name: 'color', description: 'The desired color in hex or r,g,b format' },
  guildOnly: true,
  chillBrosOnly: true,
  requireBotPermissions: ['MANAGE_ROLES'],
  requireUserRole: roleIds.Bro,
  requireBotRole: roleIds.UniqueRolePlaceholder,
  execute: async (msg, input) => {
    const { member: author, guild } = msg;
    if (!guild || !author) throw new BotError();

    const { unique_role: existingRoleId } = await UserData.findOrCreate({ user_id: author.id, guild_id: guild.id });

    if (existingRoleId) {
      const existingRole = await guild.roles.fetch(existingRoleId);
      if (existingRole) {
        const parsedColor = parseColor(input);
        if (!parsedColor) throw new ArgumentError('Invaild color format. Must be hex or r,g,b format.');
        await existingRole.setColor(parsedColor);
        await reply(msg, `Your title has been updated ${emojiIds.CoffeeCat}`);
        return;
      }
    }

    await reply(msg, 'You currently have no title. Set one with `!title`');
  },
};

function parseColor(input: string): [number, number, number] | undefined {
  let result: [number, number, number] | undefined = undefined;

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

MessageHandler.registerCommand(cmd);
