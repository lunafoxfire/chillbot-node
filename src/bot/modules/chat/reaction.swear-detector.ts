import { Reaction } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { createMultiWordRegex } from 'util/string/regex';
import { Message } from 'discord.js';
import { COOLDOWNS, PROBABILITIES } from 'bot/constants';
import { emojiIds } from 'util/discord/constants';

const fucks = [
  'fuck',
  'fucked',
  'fucker',
  'fuckin',
  'fucking',
  'fucks',
  'motherfucker',
  'motherfuckin',
  'motherfucking',
];

const shits = [
  'shit',
  'shits',
  'shitting',
  'shitty',
  'bullshit',
];

const asses = [
  'ass',
  'asses',
];

const fuckRegex = createMultiWordRegex(fucks);
const shitRegex = createMultiWordRegex(shits);
const assRegex = createMultiWordRegex(asses);

const fuckCmd: Reaction = {
  name: 'fuck-detector',
  description: 'Reacts to fucks',
  suppressTyping: true,
  cooldown: COOLDOWNS.GLOBAL_STANDARD,
  probability: PROBABILITIES.ALWAYS,
  test: (msg) => fuckRegex.test(msg.content),
  execute: async (msg) => {
    await msg.react('❌');
    await msg.react('🇫');
    await msg.react('🇺');
    await msg.react('🇨');
    await msg.react('🇰');
  },
};
MessageHandler.registerReaction(fuckCmd);

const shitCmd: Reaction = {
  name: 'shit-detector',
  description: 'Reacts to shits',
  suppressTyping: true,
  cooldown: COOLDOWNS.GLOBAL_STANDARD,
  probability: PROBABILITIES.ALWAYS,
  test: (msg) => shitRegex.test(msg.content),
  execute: async (msg) => {
    await msg.react('💩');
  },
};
MessageHandler.registerReaction(shitCmd);

const assCmd: Reaction = {
  name: 'ass-detector',
  description: 'Reacts to asses',
  suppressTyping: true,
  cooldown: COOLDOWNS.GLOBAL_STANDARD,
  probability: PROBABILITIES.ALWAYS,
  test: (msg) => assRegex.test(msg.content),
  execute: async (msg) => {
    await msg.react(emojiIds.Butt);
  },
};
MessageHandler.registerReaction(assCmd);
