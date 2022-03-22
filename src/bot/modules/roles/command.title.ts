import { ArgumentType, Command } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { reply } from 'util/discord/messages';
import UserData from 'models/UserData';
import { BotError } from 'util/errors';
import { emojiIds, roleIds } from 'util/discord/constants';

const cmd: Command<ArgumentType.FullString> = {
  name: 'title',
  description: 'Gives the user a custom unique title',
  args: { name: 'title name', description: 'The name of the user\'s unique title' },
  guildOnly: true,
  chillBrosOnly: true,
  requireBotPermissions: ['MANAGE_ROLES'],
  requireUserRole: roleIds.Bro,
  requireBotRole: roleIds.UniqueRolePlaceholder,
  execute: async (msg, input) => {
    const { member: author, guild } = msg;
    if (!guild || !author) throw new BotError();

    const placeholderRole = await guild.roles.fetch(roleIds.UniqueRolePlaceholder);
    if (!placeholderRole) {
      throw new BotError('This server is not configured to allow user titles');
    }

    const { unique_role: existingRoleId } = await UserData.findOrCreate({ user_id: author.id, guild_id: guild.id });

    if (existingRoleId) {
      const existingRole = await guild.roles.fetch(existingRoleId);
      if (existingRole) {
        if (!author.roles.valueOf().has(existingRoleId)) {
          await author.roles.add(existingRole);
        }
        if (input) {
          await existingRole.setName(input);
          await reply(msg, `Your title has been updated ${emojiIds.CoffeeCat}`);
          return;
        }
        await reply(msg, `Your current title is \`${existingRole.name}\``);
        return;
      }
    }

    if (input) {
      const newRole = await guild.roles.create({
        name: input,
        color: 'RANDOM',
        position: placeholderRole.position,
        reason: `Created by Chillbot as unique title for user ${author.id}`,
      });
      await author.roles.add(newRole);
      await UserData.setUniqueRole({ user_id: author.id, guild_id: guild.id }, newRole.id);
      await reply(msg, `You now have the title of \`${newRole.name}\`!\nUse \`!title-color\` to set your color.`);
      return;
    }
    await reply(msg, 'You currently have no title. Use this command to set one!');
  },
};

MessageHandler.registerCommand(cmd);
