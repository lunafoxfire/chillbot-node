import { ArgumentType, Command } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { reply } from 'util/discord/messages';
import UserData from 'models/UserData';
import { ArgumentError, BotError } from 'util/errors';

const cmd: Command<ArgumentType.ArgumentList> = {
  name: 'force-title',
  description: 'ADMIN | Forces pairing of user with role',
  args: [
    { name: 'user-id', description: '' },
    { name: 'role-id', description: '' },
  ],
  ownerOnly: true,
  guildOnly: true,
  chillBrosOnly: true,
  execute: async (msg, input) => {
    const [userId, roleId] = input;

    const { guild } = msg;
    if (!guild) throw new BotError();

    const guildUser = await guild.members.fetch(userId);
    const role = await guild.roles.fetch(roleId);

    if (!guildUser) throw new ArgumentError('Invalid user id');
    if (!role) throw new ArgumentError('Invalid role id');

    const { unique_role: existingRoleId } = await UserData.findOrCreate({ user_id: guildUser.id, guild_id: guild.id });

    if (existingRoleId) {
      const existingRole = await guild.roles.fetch(existingRoleId);
      if (existingRole) {
        await reply(msg, `User already has a title. Name: ${existingRole.name} | Id: ${existingRole.id}`);
        return;
      }
    }

    await UserData.setUniqueRole({ user_id: guildUser.id, guild_id: guild.id }, role.id);
    await reply(msg, `User ${guildUser.displayName} now has title ${role.name}`);
  },
};

MessageHandler.registerCommand(cmd);
