import { Reaction } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { createWordRegex } from 'util/string/regex';
import { reply } from 'util/discord/messages';
import { COOLDOWNS } from 'bot/constants';

const regex = createWordRegex('nani');

const cmd: Reaction = {
  name: 'NANI??',
  description: 'Teleports behind you',
  cooldown: COOLDOWNS.GLOBAL_SHORT,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await reply(msg, '_Teleports behind you_');
  },
};

MessageHandler.registerReaction(cmd);
