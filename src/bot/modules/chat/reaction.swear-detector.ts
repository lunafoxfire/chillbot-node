import { Reaction } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { createMultiWordRegex } from 'util/string/regex';
import { Message } from 'discord.js';
import { COOLDOWNS, PROBABILITIES } from 'bot/constants';
// import { reply, sendTyping } from 'util/discord/messages';

const badWords = [
  'bitch',
  'bitches',
  'bitchy',
  'bullshit',
  'fuck',
  'fucked',
  'fucker',
  'fuckin',
  'fucking',
  'fucks',
  'motherfucker',
  'motherfuckin',
  'motherfucking',
  'shit',
  'shits',
  'shitting',
  'shitty',
];

const regex = createMultiWordRegex(badWords);

const handlers: ((msg: Message) => Promise<void>)[] = [
  // async (msg) => {
  //   await sendTyping(msg);
  //   await reply(msg, 'Don\'t fucking swear on my fucking server goddammit');
  // },
  async (msg) => {
    await msg.react('😰');
    await msg.react('🇦');
    await msg.react('🇳');
    await msg.react('🇬');
    await msg.react('🇪');
    await msg.react('🇷');
    await msg.react('🇾');
  },
  async (msg) => {
    await msg.react('❌');
    await msg.react('🇧');
    await msg.react('🇦');
    await msg.react('🇩');
  },
  async (msg) => {
    await msg.react('🤬');
  },
  async (msg) => {
    await Promise.all([
      msg.react('🌶️'),
      msg.react('🔥'),
      msg.react('💥'),
      msg.react('👺'),
      msg.react('🖕'),
      msg.react('⚡'),
      msg.react('💩'),
      msg.react('⁉️'),
      msg.react('‼️'),
    ]);
  },
];

const cmd: Reaction = {
  name: 'swear-detector',
  description: 'Reacts to swear words',
  suppressTyping: true,
  cooldown: COOLDOWNS.GLOBAL_STANDARD,
  probability: PROBABILITIES.ALWAYS,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    await handlers[Math.floor(Math.random() * handlers.length)](msg);
  },
};

MessageHandler.registerReaction(cmd);
