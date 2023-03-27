import type { AdminCommand } from 'bot/types';
import AdminCommandHandler from '../AdminCommandHandler';
import UserData from 'models/UserData';
import { ArgumentError, BotError } from 'util/errors';

const cmd: AdminCommand = {
  name: 'force-title',
  isGuild: true,
  execute: async (msg) => {
    const [, userId, roleId] = msg.content.split(' ');

    const { guild } = msg;
    if (!guild) throw new BotError();

    const guildUser = await guild.members.fetch(userId);
    const role = await guild.roles.fetch(roleId);

    if (!guildUser) throw new ArgumentError('Invalid user id');
    if (!role) throw new ArgumentError('Invalid role id');

    await UserData.setUniqueRole({ user_id: guildUser.id, guild_id: guild.id }, role.id);
    await msg.reply(`User ${guildUser.displayName} now has title ${role.name}`);
  },
};

AdminCommandHandler.register(cmd);
