import { ArgumentType, Command } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { reply } from 'util/discord/messages';
import UserData from 'models/UserData';
import { BotError } from 'util/errors';
import { emojiIds, roleIds } from 'util/discord/constants';

const cmd: Command<ArgumentType.None> = {
  name: 'remove-title',
  description: 'Removes the user\'s unique title',
  args: undefined,
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
        await existingRole.delete(`Removed by Chillbot -- was unique title for user ${author.id}`);
        await UserData.setUniqueRole({ user_id: author.id, guild_id: guild.id }, null);
        await reply(msg, `Your title has been removed ${emojiIds.CoffeeCat}`);
        return;
      }
    }

    await reply(msg, 'You already don\'t have a title.');
  },
};

MessageHandler.registerCommand(cmd);
